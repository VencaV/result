# CLAUDE.md

## Project structure

pnpm monorepo with two published packages:

- `packages/result` — `@vencav/result`, core Result type, **zero dependencies**
- `packages/result-zod` — `@vencav/result-zod`, Zod integration, declares `@vencav/result` and `zod` as peer dependencies

## Commands

```bash
pnpm install          # install dependencies
pnpm build            # build both packages (tsup)
pnpm test             # test both packages (vitest)
pnpm lint             # ESLint both packages
pnpm typecheck        # builds @vencav/result first, then typechecks everything
```

## Watch out for when updating

### Versioning

- Both packages are versioned together — always bump both at once.
- `result-zod/package.json` has `peerDependencies["@vencav/result"]: ">=0.1.0 <1.0.0"`. When releasing `1.0.0`, update the upper bound to `<2.0.0`.
- Same for `zod: ">=3.0.0 <4.0.0"` — test compatibility before expanding to Zod v4.
- Publishing is triggered by a GitHub Actions `v*` tag — do not run `pnpm publish` manually.

### Adding API to core (`@vencav/result`)

- All new methods go into `packages/result/src/index.ts` as entries on the `Result` object.
- `@vencav/result` must have **zero runtime dependencies** — never add third-party imports here.

### Adding API to result-zod

- `fromZodSafeParse` returns `Result<T, ZodError>` — **not** `Result<T, Error>`. ZodError preserves `.issues` with structured errors including paths and codes. Do not destroy this by converting to a string.

### tsconfig in result-zod

- The tsconfig intentionally has no `rootDir` — `include: ["src", "*.config.ts"]` covers `vitest.config.ts` as well, and `rootDir: "src"` would conflict with that.
- The Vitest alias uses `fileURLToPath(new URL(..., import.meta.url))` intentionally — not cosmetic. `new URL(...).pathname` produces incorrect paths on Windows; `fileURLToPath` is the cross-platform correct form.
- The build (`outDir: "dist"`) is driven by tsup, not tsc — options like `declaration` and `sourceMap` do not belong in tsconfig.base.json.

### Typecheck and build artifacts

- `pnpm typecheck` builds `@vencav/result` first, then runs `tsc --noEmit` across all packages. This is an intentional trade-off — `result-zod` needs `dist/index.d.ts` from the core package for TypeScript to resolve types.
- Running `pnpm typecheck` directly inside `packages/result-zod/` without a prior build will fail.

### CI and Node support

- Both packages declare `engines.node: ">=20"`. CI runs against Node 20, 22, and 24 (see `.github/workflows/ci.yml`).
- Do not lower the Node floor or widen the CI matrix without verifying that no Node 20+ API is relied upon and that the change is intentional policy, not a casual edit.

### Build output

- Both packages publish ESM + CJS + `.d.ts` via tsup.
- `exports`, `main`, `module`, and `types` fields in each `package.json` must stay in sync with the actual files tsup emits. A mismatch here is a silent regression — consumers get wrong entry points or missing types with no build error.
- When changing tsup config or the export map, verify the `dist/` contents after build.

### Documentation

- When changing the public API, keep tests, `packages/result/README.md`, and `packages/result-zod/README.md` in sync. For a small OSS package, the README is effectively part of the API contract.

### ESLint

- Config lives in the root `eslint.config.mjs` and is picked up automatically by each package.
- Config files (`*.config.*`) are intentionally excluded from linting.
