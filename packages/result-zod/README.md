# @vencav/result-zod

Zod integration for [@vencav/result](https://github.com/VencaV/result/tree/main/packages/result).

## Install

```bash
npm install @vencav/result @vencav/result-zod zod
# or
pnpm add @vencav/result @vencav/result-zod zod
```

## Usage

```ts
import { z } from "zod";
import { Result } from "@vencav/result";
import { fromZodSafeParse } from "@vencav/result-zod";

const UserSchema = z.object({ name: z.string(), age: z.number() });

function parseUser(raw: unknown): Result<{ name: string; age: number }, ZodError> {
  return fromZodSafeParse(UserSchema.safeParse(raw));
}

const result = parseUser({ name: "Alice", age: 30 });

if (Result.isOk(result)) {
  console.log(result.data.name); // "Alice"
}

if (Result.isError(result)) {
  console.log(result.error.issues); // structured validation errors with paths and codes
}
```

## API

### `fromZodSafeParse(parseResult)`

Converts a Zod `safeParse` result to `Result<T, ZodError>`.

- On success → `Result.ok(data)`
- On failure → `Result.error(zodError)` — the full `ZodError` is preserved, including `.issues` with field paths and error codes

## License

MIT
