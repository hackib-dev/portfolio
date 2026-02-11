import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Muslim Tech Expo",
  description:
    "An event platform for Muslim tech aspirants, professionals, and entrepreneurs to learn, interact, and explore opportunities in the world of tech.",
  openGraph: {
    title: "Muslim Tech Expo | Aqib Akinyele",
    description:
      "A tech expo website built with Next.js, TypeScript, Shadcn, and AOS.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
