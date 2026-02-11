import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super International Travels Limited",
  description:
    "A premium travel companion offering exceptional flight deals, luxurious accommodations, and unforgettable vacation packages worldwide.",
  openGraph: {
    title: "Super International Travels Limited | Aqib Akinyele",
    description:
      "A travel booking platform built with Next.js, TypeScript, and Shadcn.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
