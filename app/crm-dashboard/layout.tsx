import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM Dashboard",
  description:
    "A CRM dashboard assessment project featuring data visualization, user management, and Jest testing integration.",
  openGraph: {
    title: "CRM Dashboard | Aqib Akinyele",
    description:
      "A CRM dashboard built with Next.js, TypeScript, Redux, and Jest.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
