"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LithologySwatch } from "@/components/Lithology";
import { strata } from "@/content/strata";
import { useSpecimen } from "@/features/seam/useSpecimen";
import { isTypingTarget } from "@/lib/keyboard";

function activeId(pathname: string) {
  return strata.find((s) => pathname === s.href || pathname.startsWith(`${s.href}/`))?.id;
}

/** `[` and `]` move one open stratum up or down. */
function useStratumKeys(pathname: string) {
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      if (e.key !== "[" && e.key !== "]") return;
      const open = strata.filter((s) => s.open);
      const current = open.findIndex((s) => s.id === activeId(pathname));
      const next = e.key === "]" ? current + 1 : current - 1;
      if (next < 0) router.push("/");
      else if (open[next]) router.push(open[next].href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, router]);
}

export function SectionRail() {
  const pathname = usePathname();
  const active = activeId(pathname);
  const spec = useSpecimen<HTMLElement>("SectionRail", "Shell", { active: active ?? "surface" });
  useStratumKeys(pathname);

  return (
    <nav aria-label="Strata" className="rail max-[899px]:hidden" {...spec}>
      <Link href="/" className="rail-brand" aria-current={pathname === "/" ? "page" : undefined}>
        <b>AQ/OS</b>
        <span className="label text-ink-2">S0 · Surface</span>
      </Link>
      <ol className="rail-list">
        {strata.map((s) => (
          <li key={s.id}>
            {s.open ? (
              <Link href={s.href} className="rail-item" aria-current={active === s.id ? "page" : undefined}>
                <span className="rail-swatch">
                  <LithologySwatch type={s.lithology} />
                </span>
                <span className="rail-text">
                  <span className="code-tag">{s.code}</span>
                  <b>{s.label}</b>
                </span>
              </Link>
            ) : (
              <span className="rail-item" aria-disabled="true">
                <span className="rail-swatch">
                  <LithologySwatch type={s.lithology} />
                </span>
                <span className="rail-text">
                  <span className="code-tag">{s.code} · sealed</span>
                  <b>{s.label}</b>
                </span>
              </span>
            )}
          </li>
        ))}
      </ol>
      <div className="rail-foot">
        <span className="label text-ink-2" title="Keyboard: [ and ] move between strata, S opens the seam">
          [ ]
        </span>
      </div>
    </nav>
  );
}

export function BottomBar() {
  const pathname = usePathname();
  const active = activeId(pathname);
  return (
    <nav aria-label="Strata" className="bottom-bar min-[900px]:hidden">
      <ol>
        <li>
          <Link href="/" className="bb-home" aria-current={pathname === "/" ? "page" : undefined}>
            <span className="bb-swatch" aria-hidden="true" />
            <span className="bb-text">
              <span aria-hidden="true">AQ/OS</span>
              <span className="sr-only">Home</span>
            </span>
          </Link>
        </li>
        {strata.map((s) => (
          <li key={s.id}>
            {s.open ? (
              <Link href={s.href} aria-current={active === s.id ? "page" : undefined}>
                <span className="bb-swatch">
                  <LithologySwatch type={s.lithology} />
                </span>
                <span className="bb-text">{s.label}</span>
              </Link>
            ) : (
              <span className="sealed" aria-disabled="true">
                <span className="bb-swatch">
                  <LithologySwatch type={s.lithology} />
                </span>
                <span className="bb-text">
                  {s.label}
                  <span className="sr-only"> (sealed)</span>
                </span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
