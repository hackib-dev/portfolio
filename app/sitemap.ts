import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { allProjects } from "@/content/projects";
import { experiments } from "@/content/experiments";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/work", "/signals", "/journey", "/mind", "/lab", "/connect"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...allProjects.map((p) => ({ url: `${site.url}/work/${p.slug}`, changeFrequency: "monthly" as const, priority: p.tier === "featured" ? 0.7 : 0.4 })),
    ...experiments.map((e) => ({ url: `${site.url}/lab/${e.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
