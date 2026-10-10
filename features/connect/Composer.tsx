"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/config/site";
import { useSpecimen } from "@/features/seam/useSpecimen";

/**
 * Writes a structured email. There is no backend, so nothing is "sent" from here:
 * the visitor's own mail app opens with the message filled in, or they copy it.
 */
export function Composer() {
  const [building, setBuilding] = useState("");
  const [timeline, setTimeline] = useState("");
  const [reply, setReply] = useState("");
  const [copied, setCopied] = useState<"idle" | "copied" | "failed">("idle");
  const spec = useSpecimen<HTMLFormElement>("ContactComposer", "S6 Connect", { filled: [building, timeline, reply].filter(Boolean).length });

  const subject = building ? `Project: ${building.slice(0, 60)}` : "Hello from your portfolio";
  const body = [`What I'm building:\n${building || "-"}`, `Timeline:\n${timeline || "-"}`, `Best way to reach me:\n${reply || "-"}`].join("\n\n");
  const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    window.location.href = mailto;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${site.contact.email}\nSubject: ${subject}\n\n${body}`);
      setCopied("copied");
    } catch {
      setCopied("failed");
    }
  };

  const field = "w-full border border-ink bg-vellum px-3 py-2.5 font-read text-[17px] leading-snug";
  return (
    <form {...spec} onSubmit={onSubmit} className="flex flex-col gap-5" aria-describedby="composer-note">
      <label className="flex flex-col gap-1.5" htmlFor="c-building">
        <span className="label">What are you building?</span>
        <textarea id="c-building" rows={3} value={building} onChange={(e) => setBuilding(e.target.value)} className={field} />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5" htmlFor="c-timeline">
          <span className="label">Timeline</span>
          <input id="c-timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)} className={field} placeholder="e.g. starting in November" />
        </label>
        <label className="flex flex-col gap-1.5" htmlFor="c-reply">
          <span className="label">How should I reply?</span>
          <input id="c-reply" value={reply} onChange={(e) => setReply(e.target.value)} className={field} placeholder="Email, call, LinkedIn…" />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn">
          Open in my mail app
        </button>
        <button type="button" className="btn btn-ghost" onClick={copy}>
          Copy message
        </button>
        <span role="status" className="label text-ink-2">
          {copied === "copied" ? "Copied. Paste it into any email to " + site.contact.email : copied === "failed" ? "Copy was blocked. Email " + site.contact.email + " directly." : ""}
        </span>
      </div>
      <p id="composer-note" className="text-[15px] leading-snug text-ink-2">
        Nothing is sent from this page. Your mail app opens with the message filled in, addressed to {site.contact.email}.
      </p>
    </form>
  );
}
