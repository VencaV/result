import { Result } from "@vencav/result";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { fromZodSafeParse } from "./index.js";

const Schema = z.object({ name: z.string(), age: z.number() });

describe("fromZodSafeParse", () => {
  it("returns ok on valid input", () => {
    const r = fromZodSafeParse(Schema.safeParse({ name: "Alice", age: 30 }));
    expect(Result.isOk(r)).toBe(true);
    if (Result.isOk(r)) {
      expect(r.data).toEqual({ name: "Alice", age: 30 });
    }
  });

  it("returns ZodError with structured issues on invalid input", () => {
    const r = fromZodSafeParse(Schema.safeParse({ name: 123 }));
    expect(Result.isError(r)).toBe(true);
    if (Result.isError(r)) {
      expect(r.error.issues.length).toBeGreaterThan(0);
      expect(r.error.issues[0].path).toContain("name");
    }
  });

  it("preserves field paths in issues", () => {
    const r = fromZodSafeParse(Schema.safeParse({ name: "Alice", age: "oops" }));
    expect(Result.isError(r)).toBe(true);
    if (Result.isError(r)) {
      const agePath = r.error.issues.some((i) => i.path.includes("age"));
      expect(agePath).toBe(true);
    }
  });

  it("returns error on null input", () => {
    const r = fromZodSafeParse(Schema.safeParse(null));
    expect(Result.isError(r)).toBe(true);
  });
});
