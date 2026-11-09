import { BadRequestException } from "@nestjs/common";
import { SYSTEM_ROLE_SLUGS } from "@repo/shared";
import { Value } from "@sinclair/typebox/value";
import { applyFormats } from "nestjs-typebox";

import { knowledgeInputSchema, knowledgeMetadataSchema } from "./aits.schema";
import { AitsService } from "./aits.service";

import type { AitsRepository } from "./aits.repository";
import type { KnowledgeMetadata } from "./aits.schema";
import type { CurrentUserType } from "src/common/types/current-user.type";
import type { S3Service } from "src/s3/s3.service";

describe("AITS knowledge review", () => {
  applyFormats();
  const user: CurrentUserType = {
    userId: crypto.randomUUID(),
    tenantId: crypto.randomUUID(),
    email: "admin@example.invalid",
    permissions: [],
    roleSlugs: [SYSTEM_ROLE_SLUGS.ADMIN],
  };
  const sample: KnowledgeMetadata = {
    id: crypto.randomUUID(),
    lineageId: crypto.randomUUID(),
    title: "Sample",
    body: "Not a company policy",
    owner: "Demo",
    category: "Demo",
    language: "en",
    kind: "faq",
    sample: true,
    roles: [SYSTEM_ROLE_SLUGS.STUDENT],
    version: 1,
    state: "pending",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    createdBy: user.userId,
    reviewedBy: null,
    storageKey: null,
    fileName: null,
    extension: "aits-knowledge-v1",
  };
  const repository = { get: jest.fn(), replace: jest.fn(), revise: jest.fn(), insert: jest.fn() };
  const service = new AitsService(repository as unknown as AitsRepository, {} as S3Service);

  it("validates persisted metadata while rejecting server-owned fields on create input", () => {
    expect(Value.Check(knowledgeMetadataSchema, sample)).toBe(true);
    expect(Value.Check(knowledgeInputSchema, sample)).toBe(false);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    repository.get.mockResolvedValue(sample);
    repository.replace.mockImplementation((_tenant, _previous, next) => next);
  });

  it("rejects approval of sample material even when review was requested", async () => {
    await expect(service.transition(user, sample.id, { action: "approve" })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repository.replace).not.toHaveBeenCalled();
  });
  it("rejects approval without pending review", async () => {
    repository.get.mockResolvedValue({ ...sample, sample: false, state: "draft" });
    await expect(service.transition(user, sample.id, { action: "approve" })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
  it("records the reviewer and never exposes internal storage keys", async () => {
    repository.get.mockResolvedValue({ ...sample, sample: false });
    const result = await service.transition(user, sample.id, { action: "approve" });
    expect(result.state).toBe("approved");
    expect(result.reviewedBy).toBe(user.userId);
    expect(result).not.toHaveProperty("storageKey");
  });
  it("starts a revised document as a fresh draft without inheriting its old attachment or approval", async () => {
    repository.get.mockResolvedValue({
      ...sample,
      state: "approved",
      sample: false,
      storageKey: "private-key",
    });
    const result = await service.create(
      user,
      {
        title: sample.title,
        body: sample.body,
        owner: sample.owner,
        category: sample.category,
        language: sample.language,
        kind: sample.kind,
        sample: false,
        roles: sample.roles,
      },
      sample.id,
    );
    expect(result).toMatchObject({ version: 2, state: "draft", reviewedBy: null, fileName: null });
    expect(repository.revise).toHaveBeenCalledWith(
      user.tenantId,
      expect.anything(),
      expect.objectContaining({ storageKey: null }),
    );
  });
});
