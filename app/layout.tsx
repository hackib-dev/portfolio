import type { Metadata, Viewport } from "next";
import { Anybody, Martian_Mono, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { site } from "@/config/site";
import { LithologyDefs } from "@/components/Lithology";
import { BottomBar, SectionRail } from "@/features/shell/SectionRail";
import { DepthGauges } from "@/features/shell/DepthGauges";
import { DescentProvider } from "@/features/descent/DescentProvider";
import { SeamDock } from "@/features/seam/SeamDock";
import { VitalsRecorder } from "@/features/seam/VitalsRecorder";
import "./globals.css";

// display "optional": a font that misses the first ~100ms is skipped for that page view
// instead of swapping in later and shifting the layout. Display and reading faces are preloaded.
const anybody = Anybody({ subsets: ["latin"], axes: ["wdth"], variable: "--font-anybody", display: "optional" });
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "optional",
});
const martian = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-martian", display: "optional", preload: false });

const description =
  "Aqib Akinyele, Frontend Engineer at Payvantage. Core banking, security tokens, KYC SDKs and government dashboards, built in React, Next.js, TypeScript and Flutter. An interface you can X-ray.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Aqib Akinyele · AQ/OS", template: "%s · Aqib Akinyele" },
  description,
  authors: [{ name: site.name }],
  creator: site.name,
  icons: { icon: "/favicon.svg" },
  openGraph: { type: "website", locale: "en_GB", url: site.url, siteName: "AQ/OS · Aqib Akinyele", title: "Aqib Akinyele · AQ/OS", description },
  twitter: { card: "summary_large_image", title: "Aqib Akinyele · AQ/OS", description },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#e4e7e2", colorScheme: "light" };

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.fullName,
  url: site.url,
  jobTitle: site.title,
  worksFor: { "@type": "Organization", name: "Payvantage Limited", url: "https://www.payvantage.com.ng" },
  award: "ThinkVantage Award, Overall Winner, Ethica Microfinance Bank (2026)",
  knowsAbout: ["React", "Next.js", "TypeScript", "Flutter", "Frontend architecture", "Fintech"],
  address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
  sameAs: [site.contact.linkedin, site.contact.github],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${anybody.variable} ${newsreader.variable} ${martian.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <LithologyDefs />
        <SectionRail />
        <DescentProvider>
          <main id="main" className="min-[900px]:pl-[var(--rail)] max-[899px]:pb-[72px]" tabIndex={-1}>
            {children}
          </main>
        </DescentProvider>
        <BottomBar />
        <DepthGauges />
        <SeamDock />
        <VitalsRecorder />
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
