import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cloudvantage",
  description:
    "A cloud solutions platform providing affordable cutting-edge services that transform how businesses and individuals connect, collaborate, and innovate.",
  openGraph: {
    title: "Cloudvantage | Aqib Akinyele",
    description:
      "A cloud solutions platform built with React.js.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
