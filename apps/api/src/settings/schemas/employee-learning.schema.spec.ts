import { Value } from "@sinclair/typebox/value";

import { employeeLearningSchema } from "./settings.schema";

describe("employee learning settings", () => {
  const state = {
    version: 1,
    stage: "ready",
    role: "engineer",
    completedLessons: ["AITS-C01-L01"],
  };
  it("accepts a role preference and account progress", () => {
    expect(Value.Check(employeeLearningSchema, state)).toBe(true);
  });
  it("rejects system-role claims, unexpected fields and unbounded progress", () => {
    expect(Value.Check(employeeLearningSchema, { ...state, role: "admin-superuser" })).toBe(false);
    expect(Value.Check(employeeLearningSchema, { ...state, permissions: ["*.*"] })).toBe(false);
    expect(
      Value.Check(employeeLearningSchema, {
        ...state,
        completedLessons: Array.from({ length: 201 }, (_, i) => String(i)),
      }),
    ).toBe(false);
    expect(
      Value.Check(employeeLearningSchema, { ...state, completedLessons: ["same", "same"] }),
    ).toBe(false);
  });
});
