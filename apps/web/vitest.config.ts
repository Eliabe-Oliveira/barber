import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
export default defineConfig({
  resolve: {
    alias: {
      "@agenda/config": fileURLToPath(new URL("../../packages/config/src/index.ts", import.meta.url)),
      "@agenda/scheduling": fileURLToPath(new URL("../../packages/scheduling/src/index.ts", import.meta.url))
    }
  },
  test:{environment:"node",include:["apps/web/src/**/*.test.ts","src/**/*.test.ts"]}
});
