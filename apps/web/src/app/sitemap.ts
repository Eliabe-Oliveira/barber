import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: process.env.PUBLIC_BASE_URL || "http://localhost:3000", changeFrequency: "weekly", priority: 1 }]; }
