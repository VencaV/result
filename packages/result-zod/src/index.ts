import { Result } from "@vencav/result";
import type { SafeParseReturnType, ZodError } from "zod";

export function fromZodSafeParse<T>(
  parseResult: SafeParseReturnType<unknown, T>,
): Result<T, ZodError> {
  if (parseResult.success) return Result.ok(parseResult.data);
  return Result.error(parseResult.error);
}
