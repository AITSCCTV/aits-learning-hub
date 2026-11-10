import { PERMISSIONS } from "@repo/shared";

import { hasPermission } from "~/common/permissions/permission.utils";

import courses from "./employee-courses.json";

import type { PermissionKey } from "@repo/shared";
import type { GetUserSettingsResponse } from "~/api/generated-api";

export type EmployeeLearning = NonNullable<GetUserSettingsResponse["data"]["employeeLearning"]>;
export const employeeRoles = [
  "hr",
  "accounting",
  "sales",
  "admin",
  "technician",
  "network",
  "engineer",
  "management",
] as const;
export const initialLearning: EmployeeLearning = {
  version: 1,
  stage: "company",
  role: null,
  completedLessons: [],
};
export const employeeCourses = courses;
export const getEmployeeCourses = (role: string | null) =>
  courses.filter(
    (course) => course.roles.length === 0 || (role !== null && course.roles.includes(role)),
  );
export const isEmployeeLearner = (permissions: PermissionKey[]) =>
  hasPermission(permissions, PERMISSIONS.COURSE_READ) &&
  !hasPermission(permissions, PERMISSIONS.COURSE_CREATE) &&
  !hasPermission(permissions, PERMISSIONS.MANAGED_GROUP_RESULTS_READ);
export const canOpenLesson = (
  course: (typeof courses)[number],
  index: number,
  completed: string[],
) => index === 0 || completed.includes(course.lessons[index - 1].id);
