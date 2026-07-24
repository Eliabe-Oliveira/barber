import type { NextConfig } from "next";
const config: NextConfig = {
  transpilePackages: ["@agenda/config", "@agenda/scheduling"],
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" }, { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
    ];
    return [{ source: "/(.*)", headers: security }, { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }] }];
  }
};
export default config;
