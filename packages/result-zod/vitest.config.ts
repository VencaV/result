import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@vencav/result": fileURLToPath(new URL("../result/src/index.ts", import.meta.url)),
    },
  },
});
