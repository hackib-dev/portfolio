import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.aqibakinyele.com";

  const routes = [
    "",
    "/tax",
    "/bitooqoh",
    "/super",
    "/mte",
    "/mte-kenya",
    "/cloudvantage",
    "/kamyk",
    "/crm-dashboard",
    "/instashop",
    "/feeble",
    "/novacrust",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "monthly" : "yearly",
    priority: route === "" ? 1 : 0.8,
  }));
}
