import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Muslim Tech Expo Kenya",
  description:
    "The Muslim Tech Expo's East Africa expansion — a dedicated platform for MTE Kenya, bringing the movement to Nairobi with its own branding, speakers, and event experience.",
  openGraph: {
    title: "Muslim Tech Expo Kenya | Aqib Akinyele",
    description:
      "A separate, dedicated build for Muslim Tech Expo's Kenya edition, built with Next.js, TypeScript, Shadcn, and AOS.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
