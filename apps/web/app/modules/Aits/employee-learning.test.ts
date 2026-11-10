import { PERMISSIONS } from "@repo/shared";
import { describe, expect, it } from "vitest";

import {
  canOpenLesson,
  employeeCourses,
  employeeRoles,
  getEmployeeCourses,
  isEmployeeLearner,
} from "./employee-learning";

describe("employee learning paths", () => {
  it("offers every role common essentials and relevant specialist material", () => {
    for (const role of employeeRoles) {
      const courses = getEmployeeCourses(role);
      expect(courses.some((course) => course.id === "welcome")).toBe(true);
      expect(courses.some((course) => course.id === "sop-quality")).toBe(true);
      expect(courses.some((course) => course.roles.includes(role))).toBe(true);
      expect(courses.every((course) => !course.roles.length || course.roles.includes(role))).toBe(
        true,
      );
    }
    expect(getEmployeeCourses("engineer").map((course) => course.id)).not.toContain(
      "accounting-foundations",
    );
    expect(getEmployeeCourses("accounting").map((course) => course.id)).not.toContain(
      "cctv-installation",
    );
    expect(getEmployeeCourses("hr").map((course) => course.id)).not.toContain("networking");
  });
  it("has complete Thai and English lesson bodies, examples and answer choices", () => {
    const ids = employeeCourses.flatMap((course) => course.lessons.map((lesson) => lesson.id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toHaveLength(32);
    for (const course of employeeCourses) {
      for (const lesson of course.lessons) {
        expect(lesson.paragraphs).toHaveLength(2);
        const copy = [
          course.title,
          lesson.title,
          ...lesson.paragraphs,
          ...lesson.points,
          lesson.example,
          lesson.question,
          ...lesson.options,
          lesson.feedback,
        ];
        for (const text of copy) {
          expect(text.th.trim()).not.toBe("");
          expect(text.en.trim()).not.toBe("");
        }
        expect(lesson.paragraphs.every((text) => /[\u0e00-\u0e7f]/.test(text.th))).toBe(true);
        expect(lesson.correct).toBeGreaterThanOrEqual(0);
        expect(lesson.correct).toBeLessThan(lesson.options.length);
      }
    }
  });
  it("unlocks sequential lessons and keeps administration distinct from learning roles", () => {
    const course = employeeCourses[0];
    expect(canOpenLesson(course, 0, [])).toBe(true);
    expect(canOpenLesson(course, 1, [])).toBe(false);
    expect(canOpenLesson(course, 1, [course.lessons[0].id])).toBe(true);
    expect(isEmployeeLearner([PERMISSIONS.COURSE_READ])).toBe(true);
    expect(isEmployeeLearner([PERMISSIONS.COURSE_READ, PERMISSIONS.COURSE_CREATE])).toBe(false);
  });
});
