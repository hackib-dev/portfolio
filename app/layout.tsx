import { Barlow } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Aqib Akinyele",
  description: "",
  icons: {
    icon: "/favicon.svg",
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
      <body className={barlow.className}>{children}</body>
    </html>
  );
}
