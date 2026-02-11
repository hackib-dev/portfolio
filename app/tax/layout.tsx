import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FIRS Tax Management System",
  description:
    "An internal role-based tax administration platform developed for the Federal Inland Revenue Service (FIRS) to monitor, track, and manage tax remittances across Nigeria.",
  openGraph: {
    title: "FIRS Tax Management System | Aqib Akinyele",
    description:
      "An internal role-based tax administration platform for the Federal Inland Revenue Service (FIRS) built with Next.js, TypeScript, and Redux.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
