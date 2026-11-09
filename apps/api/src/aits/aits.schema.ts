import { SUPPORTED_LANGUAGES, SYSTEM_ROLE_SLUGS } from "@repo/shared";
import { Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";

import type { Static } from "@sinclair/typebox";

export const knowledgeInputSchema = Type.Object(
  {
    title: Type.String({ minLength: 1, maxLength: 250 }),
    body: Type.String({ minLength: 1, maxLength: 50000 }),
    owner: Type.String({ minLength: 1, maxLength: 200 }),
    category: Type.String({ minLength: 1, maxLength: 200 }),
    language: Type.Enum(SUPPORTED_LANGUAGES),
    kind: Type.Union([Type.Literal("document"), Type.Literal("faq"), Type.Literal("sop")]),
    sample: Type.Boolean(),
    roles: Type.Array(Type.Enum(SYSTEM_ROLE_SLUGS), { minItems: 1, uniqueItems: true }),
  },
  { additionalProperties: false },
);
export const knowledgeSchema = Type.Intersect([
  Type.Object(knowledgeInputSchema.properties),
  Type.Object({
    id: UUIDSchema,
    lineageId: UUIDSchema,
    version: Type.Integer({ minimum: 1 }),
    state: Type.Union([
      Type.Literal("draft"),
      Type.Literal("pending"),
      Type.Literal("approved"),
      Type.Literal("inactive"),
    ]),
    createdAt: Type.String(),
    updatedAt: Type.String(),
    createdBy: UUIDSchema,
    reviewedBy: Type.Union([UUIDSchema, Type.Null()]),
    fileName: Type.Union([Type.String(), Type.Null()]),
  }),
]);
export const knowledgeTransitionSchema = Type.Object(
  {
    action: Type.Union([
      Type.Literal("review"),
      Type.Literal("approve"),
      Type.Literal("deactivate"),
    ]),
  },
  { additionalProperties: false },
);
export const knowledgeListSchema = Type.Array(knowledgeSchema);
export const knowledgeDownloadSchema = Type.Object({ url: Type.String() });
export type KnowledgeInput = Static<typeof knowledgeInputSchema>;
export type KnowledgeRecord = Static<typeof knowledgeSchema>;
export type KnowledgeTransition = Static<typeof knowledgeTransitionSchema>;
export type KnowledgeDownload = Static<typeof knowledgeDownloadSchema>;

export const knowledgeMetadataSchema = Type.Intersect([
  knowledgeSchema,
  Type.Object({
    extension: Type.Literal("aits-knowledge-v1"),
    storageKey: Type.Union([Type.String(), Type.Null()]),
  }),
]);
export type KnowledgeMetadata = Static<typeof knowledgeMetadataSchema>;
