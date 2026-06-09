# @vencav/result-zod

## 0.1.1

### Patch Changes

- 82eeccc: Fix broken `0.1.0` publish. The published npm tarball was missing the `dist/`
  directory (it contained only `LICENSE`, `package.json` and `README.md`), so the
  `main`/`module`/`types`/`exports` entry points all pointed at files that were
  not in the package — the package could not be imported. This republish ships the
  built output.
  - @vencav/result@0.1.1
