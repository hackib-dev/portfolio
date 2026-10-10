"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { useDescent } from "./DescentProvider";
import { handoff } from "./handoff";

type Props = {
  href: string;
  /** Word shown on the film during the transition, e.g. "Lab". */
  word: string;
  direction?: "down" | "up";
  /** Handoff key whose current value is appended as ?seed= when the link is used. */
  carry?: string;
  className?: string;
  children: ReactNode;
};

/** A real link (works without JavaScript and with modifier-clicks) that runs the Descent on plain clicks. */
export function DescentLink({ href, word, direction = "down", carry, className, children }: Props) {
  const { travel } = useDescent();
  const target = () => {
    const seed = carry ? handoff.seedParam(carry) : undefined;
    return seed ? `${href}?seed=${encodeURIComponent(seed)}` : href;
  };
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    travel(target(), word, direction);
  };
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
