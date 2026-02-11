import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aqib Akinyele | Frontend Developer",
    short_name: "Aqib Akinyele",
    description:
      "Frontend Developer with several years of experience building production web applications using Next.js, React, TypeScript, and Flutter.",
    start_url: "/",
    display: "standalone",
    background_color: "#121120",
    theme_color: "#121120",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
