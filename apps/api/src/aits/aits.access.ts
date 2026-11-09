import { PERMISSIONS } from "@repo/shared";

import type { KnowledgeRecord } from "./aits.schema";
import type { CurrentUserType } from "src/common/types/current-user.type";

export const canManageKnowledge = (user: CurrentUserType) =>
  user.permissions.includes(PERMISSIONS.SETTINGS_MANAGE);

export function canReadKnowledge(record: KnowledgeRecord, user: CurrentUserType) {
  if (canManageKnowledge(user)) return true;
  if (record.state === "inactive" || !record.roles.some((role) => user.roleSlugs.includes(role)))
    return false;
  return record.state === "approved" || record.sample;
}

export function isAuthoritativeKnowledge(record: KnowledgeRecord) {
  return record.state === "approved" && !record.sample;
}
