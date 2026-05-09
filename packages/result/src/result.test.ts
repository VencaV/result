import { describe, expect, it } from "vitest";
import { Result } from "./index.js";

describe("Result.ok", () => {
  it("creates an ok result", () => {
    const r = Result.ok(42);
    expect(r).toEqual({ status: "ok", data: 42 });
  });
});

describe("Result.error", () => {
  it("creates an error result", () => {
    const err = new Error("boom");
    const r = Result.error(err);
    expect(r).toEqual({ status: "error", error: err });
  });
});

describe("Result.isOk", () => {
  it("returns true for ok", () => expect(Result.isOk(Result.ok(1))).toBe(true));
  it("returns false for error", () => expect(Result.isOk(Result.error("x"))).toBe(false));
});

describe("Result.isError", () => {
  it("returns true for error", () => expect(Result.isError(Result.error("x"))).toBe(true));
  it("returns false for ok", () => expect(Result.isError(Result.ok(1))).toBe(false));
});

describe("Result.map", () => {
  it("transforms ok data", () => {
    expect(Result.map(Result.ok(2), (n) => n * 3)).toEqual(Result.ok(6));
  });

  it("passes errors through", () => {
    const err = Result.error(new Error("e"));
    expect(Result.map(err, (n: number) => n * 3)).toBe(err);
  });
});

describe("Result.flatMap", () => {
  it("chains ok results", () => {
    const r = Result.flatMap(Result.ok(4), (n) => Result.ok(n + 1));
    expect(r).toEqual(Result.ok(5));
  });

  it("short-circuits on error", () => {
    const err = Result.error(new Error("e"));
    const r = Result.flatMap(err, (n: number) => Result.ok(n + 1));
    expect(r).toBe(err);
  });

  it("propagates errors returned by fn", () => {
    const inner = Result.error(new Error("inner"));
    const r = Result.flatMap(Result.ok(1), () => inner);
    expect(r).toBe(inner);
  });
});

describe("Result.collectResults", () => {
  it("collects all ok values", () => {
    const r = Result.collectResults([Result.ok(1), Result.ok(2), Result.ok(3)]);
    expect(r).toEqual(Result.ok([1, 2, 3]));
  });

  it("returns first error", () => {
    const err = Result.error(new Error("e"));
    const r = Result.collectResults([Result.ok(1), err, Result.ok(3)]);
    expect(r).toBe(err);
  });

  it("handles empty array", () => {
    expect(Result.collectResults([])).toEqual(Result.ok([]));
  });
});

describe("Result.flattenResults", () => {
  it("flattens ok arrays", () => {
    const r = Result.flattenResults([Result.ok([1, 2]), Result.ok([3, 4])]);
    expect(r).toEqual(Result.ok([1, 2, 3, 4]));
  });

  it("returns first error", () => {
    const err = Result.error(new Error("e"));
    const r = Result.flattenResults([Result.ok([1]), err]);
    expect(r).toBe(err);
  });

  it("handles empty array", () => {
    expect(Result.flattenResults([])).toEqual(Result.ok([]));
  });
});
