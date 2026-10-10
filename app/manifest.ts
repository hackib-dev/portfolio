import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AQ/OS · Aqib Akinyele",
    short_name: "AQ/OS",
    description: "Portfolio of Aqib Akinyele, Frontend Engineer.",
    start_url: "/",
    display: "standalone",
    background_color: "#e4e7e2",
    theme_color: "#e4e7e2",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
