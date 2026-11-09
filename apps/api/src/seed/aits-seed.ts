import { LESSON_TYPES, SYSTEM_ROLE_SLUGS, SUPPORTED_LANGUAGES } from "@repo/shared";
import * as dotenv from "dotenv";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import hashPassword from "src/common/helpers/hashPassword";
import {
  DEFAULT_ADMIN_SETTINGS,
  DEFAULT_GLOBAL_SETTINGS,
  DEFAULT_STUDENT_SETTINGS,
} from "src/settings/constants/settings.constants";
import {
  assessments,
  categories,
  credentials,
  groupManagerGroups,
  groups,
  groupUsers,
  lessons,
  settings,
  studentCourses,
  tenants,
  userDetails,
  userOnboarding,
  users,
} from "src/storage/schema";
import { settingsToJSONBuildObject } from "src/utils/settings-to-json-build-object";

import { aitsCourses } from "./aits-data";
import { seedAitsKnowledge } from "./aits-knowledge";
import {
  assignSystemRoleToUser,
  createNiceCourses,
  ensureSeedTenant,
  seedSystemRolesForTenant,
} from "./seed-helpers";

import type { DatabasePg } from "src/common";

dotenv.config();

async function seedAits() {
  if (process.env.NODE_ENV === "production" || process.env.AITS_DEMO_SEED !== "1") {
    throw new Error("Development seed only. Set AITS_DEMO_SEED=1 explicitly.");
  }
  const connectionString = process.env.MIGRATOR_DATABASE_URL;
  const password = process.env.AITS_DEMO_PASSWORD;
  if (!connectionString || !password || password.length < 12) {
    throw new Error(
      "Set MIGRATOR_DATABASE_URL and an AITS_DEMO_PASSWORD of at least 12 characters.",
    );
  }
  const databaseHost = new URL(connectionString).hostname;
  if (!["localhost", "127.0.0.1", "[::1]", "db"].includes(databaseHost)) {
    throw new Error("AITS demonstration seed is restricted to a local development database.");
  }
  const sqlClient = postgres(connectionString, { max: 1 });
  const database = drizzle(sqlClient) as DatabasePg;
  try {
    await database.transaction(async (transaction) => {
      const db = transaction as unknown as DatabasePg;
      const [existing] = await db
        .select({ id: tenants.id })
        .from(tenants)
        .where(eq(tenants.host, "https://aits.lms.localhost"));
      if (existing) {
        const [admin] = await db
          .select({ id: users.id })
          .from(users)
          .where(and(eq(users.tenantId, existing.id), eq(users.email, "admin@aits.example")));
        if (admin) await seedAitsKnowledge(db, existing.id, admin.id);
        console.log(
          "AITS demo tenant already exists; existing content and credentials were preserved.",
        );
        return;
      }
      const tenant = await ensureSeedTenant(db, {
        name: "AITS Learning Hub — Development Demo",
        host: "https://aits.lms.localhost",
      });
      const tenantId = tenant.id;
      await seedSystemRolesForTenant(db, tenantId);
      await db.insert(settings).values({
        tenantId,
        settings: settingsToJSONBuildObject({
          ...DEFAULT_GLOBAL_SETTINGS,
          primaryColor: "#2563eb",
          contrastColor: "#ffffff",
          calendarEnabled: false,
          companyInformation: {
            ...DEFAULT_GLOBAL_SETTINGS.companyInformation,
            companyName: "A.I.T.S. Company Limited",
            companyShortName: "AITS",
          },
        }),
      });
      const accounts = [
        {
          email: "admin@aits.example",
          firstName: "Demo",
          lastName: "Administrator",
          role: SYSTEM_ROLE_SLUGS.ADMIN,
        },
        {
          email: "manager@aits.example",
          firstName: "Demo",
          lastName: "Supervisor",
          role: SYSTEM_ROLE_SLUGS.GROUP_MANAGER,
        },
        {
          email: "learner@aits.example",
          firstName: "Demo",
          lastName: "Learner",
          role: SYSTEM_ROLE_SLUGS.STUDENT,
        },
        {
          email: "technician@aits.example",
          firstName: "Demo",
          lastName: "Technician",
          role: SYSTEM_ROLE_SLUGS.STUDENT,
        },
        {
          email: "office@aits.example",
          firstName: "Demo",
          lastName: "Office",
          role: SYSTEM_ROLE_SLUGS.STUDENT,
        },
      ];
      const passwordHash = await hashPassword(password);
      const created = [];
      for (const account of accounts) {
        const [user] = await db
          .insert(users)
          .values({
            tenantId,
            email: account.email,
            firstName: account.firstName,
            lastName: account.lastName,
          })
          .returning();
        if (!user) throw new Error("Could not create demonstration account");
        await db.insert(credentials).values({
          tenantId,
          userId: user.id,
          password: passwordHash,
          requiresPasswordChange: false,
        });
        await db.insert(userDetails).values({
          tenantId,
          userId: user.id,
          description: "Synthetic development account; not an AITS employee record.",
        });
        await db.insert(userOnboarding).values({
          tenantId,
          userId: user.id,
          dashboard: true,
          courses: true,
          announcements: true,
          profile: true,
          settings: true,
          providerInformation: true,
        });
        await assignSystemRoleToUser(db, user.id, tenantId, account.role);
        await db.insert(settings).values({
          tenantId,
          userId: user.id,
          settings: settingsToJSONBuildObject(
            account.role === SYSTEM_ROLE_SLUGS.ADMIN
              ? { ...DEFAULT_ADMIN_SETTINGS, configWarningDismissed: true }
              : DEFAULT_STUDENT_SETTINGS,
          ),
        });
        created.push(user);
      }
      const [admin, manager, ...employees] = created;
      if (!admin || !manager) throw new Error("Demonstration roles missing");
      await seedAitsKnowledge(db, tenantId, admin.id);
      const [group] = await db
        .insert(groups)
        .values({
          tenantId,
          name: sql`${JSON.stringify({ en: "Demo team", th: "ทีมสาธิต" })}::text::jsonb`,
          baseLanguage: SUPPORTED_LANGUAGES.EN,
          availableLocales: [SUPPORTED_LANGUAGES.EN, SUPPORTED_LANGUAGES.TH],
        })
        .returning();
      if (!group) throw new Error("Could not create demonstration team");
      await db
        .insert(groupManagerGroups)
        .values({ tenantId, managerUserId: manager.id, groupId: group.id });
      // Keep one employee outside the manager's scope for authorization verification.
      await db
        .insert(groupUsers)
        .values(
          employees.slice(0, 2).map((user) => ({ tenantId, userId: user.id, groupId: group.id })),
        );
      const courses = await createNiceCourses([admin.id], db, aitsCourses, tenantId);
      await db
        .update(lessons)
        .set({ thresholdScore: 100 })
        .where(and(eq(lessons.tenantId, tenantId), eq(lessons.type, LESSON_TYPES.QUIZ)));
      await db
        .update(assessments)
        .set({ passingScorePercentage: "100" })
        .where(eq(assessments.tenantId, tenantId));
      await db
        .insert(studentCourses)
        .values(
          employees.flatMap((employee) =>
            courses.map((course) => ({ tenantId, studentId: employee.id, courseId: course.id })),
          ),
        );
      for (const title of [
        { en: "Company Policies", th: "นโยบายบริษัท" },
        { en: "Workplace Safety", th: "ความปลอดภัยในที่ทำงาน" },
      ]) {
        await db.insert(categories).values({
          tenantId,
          title: sql`${JSON.stringify(title)}::text::jsonb`,
          baseLanguage: SUPPORTED_LANGUAGES.EN,
          availableLocales: [SUPPORTED_LANGUAGES.EN, SUPPORTED_LANGUAGES.TH],
        });
      }
      console.log(
        `Created AITS development tenant: ${created.length} synthetic users, ${
          courses.length
        } courses, ${
          employees.length * courses.length
        } assignments. No existing records were removed.`,
      );
    });
  } finally {
    await sqlClient.end();
  }
}

seedAits().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "AITS seed failed");
  process.exitCode = 1;
});
