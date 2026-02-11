import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bitooqoh",
  description:
    "A platform transforming how you experience live events — simplifying the ticketing process and enhancing event experiences with seamless discovery, booking, and management.",
  openGraph: {
    title: "Bitooqoh | Aqib Akinyele",
    description:
      "An event ticketing platform built with Next.js, TypeScript, Shadcn, and Redux.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
