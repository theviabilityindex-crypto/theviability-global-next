import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/spain-digital-nomad-visa-income-2026",
          "/api/rules/spain.json",
        ],
        disallow: ["/check"],
      },

      // Explicit AI crawler allowances
      {
        userAgent: "GPTBot",
        allow: [
          "/spain-digital-nomad-visa-income-2026",
          "/api/rules/spain.json",
        ],
        disallow: ["/check"],
      },
      {
        userAgent: "ClaudeBot",
        allow: [
          "/spain-digital-nomad-visa-income-2026",
          "/api/rules/spain.json",
        ],
        disallow: ["/check"],
      },
      {
        userAgent: "PerplexityBot",
        allow: [
          "/spain-digital-nomad-visa-income-2026",
          "/api/rules/spain.json",
        ],
        disallow: ["/check"],
      },
    ],
    sitemap: "https://theviabilityindex.com/sitemap.xml",
  };
}