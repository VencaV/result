# @vencav/result

Lightweight, type-safe `Result` type for TypeScript. Zero dependencies.

## Install

```bash
npm install @vencav/result
# or
pnpm add @vencav/result
```

## Usage

```ts
import { Result } from "@vencav/result";

function divide(a: number, b: number): Result<number, Error> {
  if (b === 0) return Result.error(new Error("Division by zero"));
  return Result.ok(a / b);
}

const result = divide(10, 2);

if (Result.isOk(result)) {
  console.log(result.data); // 5
}
```

## API

### `Result<T, E = Error>`

A discriminated union: `{ status: "ok"; data: T } | { status: "error"; error: E }`.

### `Result.ok(data)`

Wraps a value in a successful result.

### `Result.error(error)`

Wraps an error in a failed result.

### `Result.isOk(result)`

Type guard — narrows to the ok variant.

### `Result.isError(result)`

Type guard — narrows to the error variant.

### `Result.map(result, fn)`

Transforms the data of an ok result. Passes errors through unchanged.

### `Result.flatMap(result, fn)`

Chains operations that return `Result`. Passes errors through unchanged.

### `Result.collectResults(results)`

Turns `Result<T, E>[]` into `Result<T[], E>`. Returns the first error encountered.

### `Result.flattenResults(results)`

Turns `Result<T[], E>[]` into `Result<T[], E>`, flattening the arrays. Returns the first error encountered.

## Zod integration

See [@vencav/result-zod](https://github.com/VencaV/result/tree/main/packages/result-zod).

## License

MIT
