import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Project terpisah dengan tooling sendiri (API Go + dashboard Vite untuk
    // app. dan admin.adhiteknologi.com). Isinya termasuk bundel hasil build yang
    // sudah diminifikasi — melintasinya menghasilkan ribuan temuan tak berguna.
    "dashboard/**",
  ]),
]);

export default eslintConfig;
