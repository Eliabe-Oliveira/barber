import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/agendamento/gerenciar/"] }], sitemap: `${process.env.PUBLIC_BASE_URL || "http://localhost:3000"}/sitemap.xml` }; }
