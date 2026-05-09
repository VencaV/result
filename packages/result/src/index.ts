export type Result<T, E = Error> =
  | { status: "ok"; data: T }
  | { status: "error"; error: E };

export const Result = {
  ok: <T>(data: T): Result<T, never> => ({ status: "ok", data }),

  error: <E = Error>(error: E): Result<never, E> => ({ status: "error", error }),

  isOk: <T, E>(result: Result<T, E>): result is { status: "ok"; data: T } =>
    result.status === "ok",

  isError: <T, E>(result: Result<T, E>): result is { status: "error"; error: E } =>
    result.status === "error",

  map: <T, U, E>(result: Result<T, E>, fn: (data: T) => U): Result<U, E> => {
    if (result.status === "error") return result;
    return Result.ok(fn(result.data));
  },

  flatMap: <T, U, E>(result: Result<T, E>, fn: (data: T) => Result<U, E>): Result<U, E> => {
    if (result.status === "error") return result;
    return fn(result.data);
  },

  collectResults: <T, E>(results: ReadonlyArray<Result<T, E>>): Result<ReadonlyArray<T>, E> => {
    const collected: T[] = [];
    for (const result of results) {
      if (Result.isError(result)) return result;
      collected.push(result.data);
    }
    return Result.ok(collected);
  },

  flattenResults: <T, E>(
    results: ReadonlyArray<Result<ReadonlyArray<T>, E>>,
  ): Result<ReadonlyArray<T>, E> => {
    const collected: T[] = [];
    for (const result of results) {
      if (Result.isError(result)) return result;
      collected.push(...result.data);
    }
    return Result.ok(collected);
  },
};
