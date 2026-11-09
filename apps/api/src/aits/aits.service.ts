import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";

import { FileGuard } from "src/file/guards/file.guard";
import { S3Service } from "src/s3/s3.service";

import { canReadKnowledge } from "./aits.access";
import { AitsRepository } from "./aits.repository";

import type {
  KnowledgeInput,
  KnowledgeMetadata,
  KnowledgeRecord,
  KnowledgeTransition,
} from "./aits.schema";
import type { UUIDType } from "src/common";
import type { CurrentUserType } from "src/common/types/current-user.type";

@Injectable()
export class AitsService {
  constructor(
    private readonly aitsRepository: AitsRepository,
    private readonly s3Service: S3Service,
  ) {}

  private publicRecord(record: KnowledgeMetadata): KnowledgeRecord {
    const { extension: _extension, storageKey: _storageKey, ...result } = record;
    return result;
  }

  async list(user: CurrentUserType) {
    return (await this.aitsRepository.list(user.tenantId))
      .filter((record) => canReadKnowledge(record, user))
      .map((record) => this.publicRecord(record));
  }

  async create(user: CurrentUserType, body: KnowledgeInput, priorId?: UUIDType) {
    const prior = priorId ? await this.aitsRepository.get(user.tenantId, priorId) : undefined;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const record: KnowledgeMetadata = {
      ...body,
      id,
      lineageId: prior?.lineageId ?? id,
      version: (prior?.version ?? 0) + 1,
      state: "draft",
      createdAt: now,
      updatedAt: now,
      createdBy: user.userId,
      reviewedBy: null,
      extension: "aits-knowledge-v1",
      storageKey: null,
      fileName: null,
    };
    if (prior) await this.aitsRepository.revise(user.tenantId, prior, record);
    else await this.aitsRepository.insert(user.tenantId, record);
    return this.publicRecord(record);
  }

  async transition(user: CurrentUserType, id: UUIDType, body: KnowledgeTransition) {
    const previous = await this.aitsRepository.get(user.tenantId, id);
    const next = { ...previous, updatedAt: new Date().toISOString() };
    if (body.action === "review") {
      if (previous.state !== "draft")
        throw new BadRequestException("Only a draft can be submitted for review.");
      next.state = "pending";
    } else if (body.action === "approve") {
      if (previous.state !== "pending" || previous.sample)
        throw new BadRequestException("Only reviewed, non-sample content can be approved.");
      next.state = "approved";
      next.reviewedBy = user.userId;
    } else next.state = "inactive";
    return this.publicRecord(await this.aitsRepository.replace(user.tenantId, previous, next));
  }

  async upload(user: CurrentUserType, id: UUIDType, file: Express.Multer.File) {
    const previous = await this.aitsRepository.get(user.tenantId, id);
    if (previous.state !== "draft" || previous.storageKey)
      throw new BadRequestException("Upload to a new draft version without an attachment.");
    const detected = await FileGuard.getFileType(file);
    if (!detected && file.mimetype !== "text/plain")
      throw new BadRequestException("Unrecognized document format.");
    if (detected && detected.mime !== file.mimetype)
      throw new BadRequestException("Document content type mismatch.");
    // Text uploads must be valid UTF-8, without binary control bytes; never execute or render uploaded files inline.
    if (file.mimetype === "text/plain") {
      try {
        new TextDecoder("utf-8", { fatal: true }).decode(file.buffer);
      } catch {
        throw new BadRequestException("Invalid UTF-8 text file.");
      }
      if (file.buffer.some((byte) => byte < 32 && ![9, 10, 13].includes(byte)))
        throw new BadRequestException("Binary text file rejected.");
    }
    const storageKey = `aits-knowledge/${user.tenantId}/${id}/${crypto.randomUUID()}`;
    const fileName = file.originalname.replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 200);
    await this.s3Service.uploadFile(file.buffer, storageKey, file.mimetype, file.size);
    try {
      return this.publicRecord(
        await this.aitsRepository.replace(user.tenantId, previous, {
          ...previous,
          storageKey,
          fileName,
          updatedAt: new Date().toISOString(),
        }),
      );
    } catch (error) {
      await this.s3Service.deleteFile(storageKey);
      throw error;
    }
  }

  async download(user: CurrentUserType, id: UUIDType) {
    const record = await this.aitsRepository.get(user.tenantId, id);
    if (!canReadKnowledge(record, user)) throw new ForbiddenException();
    if (!record.storageKey || !record.fileName) throw new BadRequestException("No attached file.");
    return {
      url: await this.s3Service.getSignedUrl(record.storageKey, 60, {
        downloadFilename: record.fileName,
      }),
    };
  }
}
