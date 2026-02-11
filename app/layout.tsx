import { Barlow } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";

const BASE_URL = "https://www.aqibakinyele.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Aqib Akinyele | Frontend Developer",
    template: "%s | Aqib Akinyele",
  },
  description:
    "Frontend Developer with several years of experience building production web applications using Next.js, React, TypeScript, and Flutter. Explore my projects and get in touch.",
  keywords: [
    "Aqib Akinyele",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Flutter Developer",
    "Web Developer",
    "Portfolio",
    "Nigeria",
  ],
  authors: [{ name: "Aqib Akinyele" }],
  creator: "Aqib Akinyele",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Aqib Akinyele",
    title: "Aqib Akinyele | Frontend Developer",
    description:
      "Frontend Developer with several years of experience building production web applications using Next.js, React, TypeScript, and Flutter.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aqib Akinyele | Frontend Developer",
    description:
      "Frontend Developer with several years of experience building production web applications using Next.js, React, TypeScript, and Flutter.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/codec-pro"
          rel="stylesheet"
        />
      </head>

      <body className={barlow.className}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
