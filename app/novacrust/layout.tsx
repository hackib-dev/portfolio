import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Novacrust Labs - Crypto Checkout Widget",
  description:
    "A production-ready crypto-to-cash conversion widget built for Novacrust Labs featuring advanced form handling, state management, and a seamless crypto payment flow.",
  openGraph: {
    title: "Novacrust Labs Crypto Checkout Widget | Aqib Akinyele",
    description:
      "A crypto checkout widget built with Next.js 15, Redux Toolkit, React Query, and Zod.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
