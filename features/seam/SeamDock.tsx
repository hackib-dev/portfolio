"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useShallow } from "zustand/react/shallow";
import { isTypingTarget } from "@/lib/keyboard";
import { ScanBand } from "./ScanBand";
import { SEAM_DEFAULT, SEAM_MAX, useSeam } from "./store";

// The overlay, panel and accessibility library load only once the seam is first used.
const SeamOverlay = dynamic(() => import("./SeamOverlay"), { ssr: false });
const SpecimenPanel = dynamic(() => import("./SpecimenPanel"), { ssr: false });

const HINT_KEY = "aqos-seam-used";

function readFlag(key: string) {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeFlag(key: string) {
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    // Storage can be unavailable (private mode); the hint simply shows again next time.
  }
}

export function SeamDock() {
  const { substrate, panelOpen, engaged, setSubstrate, toggle, setPanel } = useSeam(
    useShallow((s) => ({
      substrate: s.substrate,
      panelOpen: s.panelOpen,
      engaged: s.engaged,
      setSubstrate: s.setSubstrate,
      toggle: s.toggle,
      setPanel: s.setPanel,
    })),
  );
  const pathname = usePathname();
  const [vh, setVh] = useState(0);
  const [hint, setHint] = useState(false);
  const drag = useRef<{ startY: number; moved: boolean } | null>(null);
  const panelBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (engaged) {
      writeFlag(HINT_KEY);
      return;
    }
    if (pathname !== "/" || readFlag(HINT_KEY)) return;
    const show = window.setTimeout(() => setHint(true), 2200);
    const hide = window.setTimeout(() => setHint(false), 11000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [engaged, pathname]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
      if (e.key === "s" && !e.shiftKey) {
        e.preventDefault();
        toggle();
      } else if (e.key === "S" && e.shiftKey) {
        e.preventDefault();
        setPanel(!useSeam.getState().panelOpen);
      } else if (e.key === "Escape") {
        const s = useSeam.getState();
        if (s.panelOpen) {
          setPanel(false);
          panelBtn.current?.focus();
        } else if (s.substrate > 0) {
          setSubstrate(0);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, setPanel, setSubstrate]);

  const open = substrate > 0;
  const showHint = hint && !engaged;
  const y = vh * (1 - substrate);
  const pct = Math.round(substrate * 100);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { startY: e.clientY, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.abs(e.clientY - d.startY) < 5) return;
    d.moved = true;
    setSubstrate(1 - e.clientY / window.innerHeight);
  };
  const onPointerUp = () => {
    if (drag.current && !drag.current.moved) toggle();
    drag.current = null;
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 0.2 : 0.05;
    const keys: Record<string, number> = {
      ArrowUp: substrate + step,
      ArrowRight: substrate + step,
      ArrowDown: substrate - step,
      ArrowLeft: substrate - step,
      PageUp: substrate + 0.2,
      PageDown: substrate - 0.2,
      Home: 0,
      End: SEAM_MAX,
    };
    if (e.key in keys) {
      e.preventDefault();
      setSubstrate(Math.max(0, keys[e.key] ?? 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSubstrate(open ? 0 : SEAM_DEFAULT);
    }
  };

  return (
    <>
      {engaged ? <SeamOverlay /> : null}
      {engaged ? <SpecimenPanel returnFocusTo={panelBtn} /> : null}
      {open ? <div className="seam-line" style={{ top: y }} aria-hidden="true" /> : <ScanBand />}
      <aside aria-label="Seam controls" className="seam-dock" style={open ? { top: Math.max(8, y - 18), bottom: "auto" } : undefined}>
        {showHint ? (
          <p className="seam-hint" role="status">
            Drag the seam. Everything here can be opened.
          </p>
        ) : null}
        <div
          className="seam-handle"
          role="slider"
          tabIndex={0}
          aria-label="Seam. Shows the engineering beneath the page"
          aria-valuemin={0}
          aria-valuemax={Math.round(SEAM_MAX * 100)}
          aria-valuenow={pct}
          aria-valuetext={open ? `${pct}% of the screen shows the substrate` : "Closed"}
          aria-keyshortcuts="S"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (drag.current = null)}
          onKeyDown={onKeyDown}
        >
          <span aria-hidden="true">Seam ⇅</span>
          <span aria-hidden="true">{open ? `${pct}%` : "S"}</span>
        </div>
        <button
          ref={panelBtn}
          type="button"
          className="seam-panel-btn"
          aria-expanded={panelOpen}
          aria-controls="specimen-panel"
          aria-keyshortcuts="Shift+S"
          onClick={() => setPanel(!panelOpen)}
        >
          Specimens
        </button>
      </aside>
    </>
  );
}
