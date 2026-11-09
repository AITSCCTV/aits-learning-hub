import { PERMISSIONS, SYSTEM_ROLE_SLUGS } from "@repo/shared";

import { canReadKnowledge, isAuthoritativeKnowledge } from "./aits.access";

import type { KnowledgeRecord } from "./aits.schema";
import type { CurrentUserType } from "src/common/types/current-user.type";

const user: CurrentUserType = {
  userId: crypto.randomUUID(),
  tenantId: crypto.randomUUID(),
  email: "learner@example.invalid",
  roleSlugs: [SYSTEM_ROLE_SLUGS.STUDENT],
  permissions: [PERMISSIONS.DASHBOARD_READ],
};
const record: KnowledgeRecord = {
  id: crypto.randomUUID(),
  lineageId: crypto.randomUUID(),
  title: "Demonstration",
  body: "Sample only",
  owner: "Demo owner",
  category: "Demo",
  language: "en",
  kind: "sop",
  sample: true,
  roles: [SYSTEM_ROLE_SLUGS.STUDENT],
  version: 1,
  state: "draft",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  createdBy: user.userId,
  reviewedBy: null,
  fileName: null,
};

describe("AITS knowledge access", () => {
  it("permits a visible sample without treating it as authoritative", () => {
    expect(canReadKnowledge(record, user)).toBe(true);
    expect(isAuthoritativeKnowledge(record)).toBe(false);
    expect(isAuthoritativeKnowledge({ ...record, state: "approved" })).toBe(false);
  });
  it("withholds non-sample drafts and pending reviews from learners", () => {
    for (const state of ["draft", "pending", "inactive"] as const)
      expect(canReadKnowledge({ ...record, state, sample: false }, user)).toBe(false);
  });
  it("requires both approval and a matching reader role", () => {
    expect(canReadKnowledge({ ...record, state: "approved", sample: false }, user)).toBe(true);
    expect(
      canReadKnowledge({ ...record, state: "approved", roles: [SYSTEM_ROLE_SLUGS.ADMIN] }, user),
    ).toBe(false);
    expect(canReadKnowledge({ ...record, state: "inactive" }, user)).toBe(false);
  });
  it("allows authorized administration of drafts without granting learners management", () => {
    expect(
      canReadKnowledge(
        { ...record, sample: false },
        { ...user, permissions: [PERMISSIONS.SETTINGS_MANAGE] },
      ),
    ).toBe(true);
  });
});
