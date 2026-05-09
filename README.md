# result

Monorepo for lightweight, type-safe Result type packages for TypeScript.

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [`@vencav/result`](./packages/result) | Core Result type — zero dependencies | [![npm](https://img.shields.io/npm/v/@vencav/result)](https://www.npmjs.com/package/@vencav/result) |
| [`@vencav/result-zod`](./packages/result-zod) | Zod integration | [![npm](https://img.shields.io/npm/v/@vencav/result-zod)](https://www.npmjs.com/package/@vencav/result-zod) |

## Quick start

```bash
pnpm add @vencav/result
```

```ts
import { Result } from "@vencav/result";

function divide(a: number, b: number): Result<number, Error> {
  if (b === 0) return Result.error(new Error("Division by zero"));
  return Result.ok(a / b);
}

const r = divide(10, 2);
if (Result.isOk(r)) console.log(r.data); // 5
```

## Development

```bash
pnpm install
pnpm build
pnpm test
```

## Publishing

Create and push a tag — GitHub Actions handles the rest:

```bash
# bump versions in packages/*/package.json first, then:
git tag v0.1.0
git push origin v0.1.0
```

Requires an `NPM_TOKEN` secret in GitHub repository settings.

## License

MIT — see [LICENSE](./LICENSE).
