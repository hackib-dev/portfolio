import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instashop",
  description:
    "A mobile-first Progressive Web App (PWA) assessment project showcasing responsive design and modern web capabilities.",
  openGraph: {
    title: "Instashop | Aqib Akinyele",
    description:
      "A mobile PWA project built with Next.js, TypeScript, and Redux.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
