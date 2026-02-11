import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feeble - Frontend Developer Assessment",
  description:
    "A pixel-perfect implementation of a modern hero section with smooth animations, responsive design, and clean code. Built with Next.js 15, Framer Motion, and Tailwind CSS.",
  openGraph: {
    title: "Feeble Assessment | Aqib Akinyele",
    description:
      "A frontend assessment showcasing advanced development skills with Next.js 15 and Framer Motion.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
