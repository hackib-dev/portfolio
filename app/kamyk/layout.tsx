import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kamyk Hospital",
  description:
    "A healthcare facility website for Kamyk Hospital, committed to delivering high-quality, compassionate care to the Ojodu community since 2019.",
  openGraph: {
    title: "Kamyk Hospital | Aqib Akinyele",
    description:
      "A hospital website built with Next.js, TypeScript, Shadcn, and AOS.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
