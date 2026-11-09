import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Value } from "@sinclair/typebox/value";
import { and, desc, eq, sql } from "drizzle-orm";

import { DatabasePg } from "src/common";
import { DB } from "src/storage/db/db.providers";
import { documents } from "src/storage/schema";

import { knowledgeMetadataSchema } from "./aits.schema";

import type { KnowledgeMetadata } from "./aits.schema";
import type { UUIDType } from "src/common";

@Injectable()
export class AitsRepository {
  constructor(@Inject(DB) private readonly db: DatabasePg) {}

  private scope(tenantId: UUIDType) {
    return and(
      eq(documents.tenantId, tenantId),
      sql`${documents.metadata}->>'extension' = 'aits-knowledge-v1'`,
    );
  }

  async list(tenantId: UUIDType): Promise<KnowledgeMetadata[]> {
    const rows = await this.db
      .select({ metadata: documents.metadata })
      .from(documents)
      .where(this.scope(tenantId))
      .orderBy(desc(documents.createdAt));
    return rows.flatMap(({ metadata }) =>
      Value.Check(knowledgeMetadataSchema, metadata) ? [metadata] : [],
    );
  }

  async get(tenantId: UUIDType, id: UUIDType): Promise<KnowledgeMetadata> {
    const [row] = await this.db
      .select({ metadata: documents.metadata })
      .from(documents)
      .where(and(this.scope(tenantId), eq(documents.id, id)));
    if (!row || !Value.Check(knowledgeMetadataSchema, row.metadata)) throw new NotFoundException();
    return row.metadata;
  }

  async insert(tenantId: UUIDType, record: KnowledgeMetadata) {
    await this.db.insert(documents).values({
      tenantId,
      id: record.id,
      fileName: record.title,
      contentType: "text/plain",
      byteSize: Buffer.byteLength(record.body),
      checksum: `aits:${tenantId}:${record.id}`,
      status: "ready",
      metadata: sql`${JSON.stringify(record)}::text::jsonb`,
    });
    return record;
  }

  async replace(tenantId: UUIDType, previous: KnowledgeMetadata, next: KnowledgeMetadata) {
    return this.db.transaction(async (transaction) => {
      await transaction.execute(
        sql`SELECT pg_advisory_xact_lock(hashtext(${tenantId + previous.lineageId}))`,
      );
      if (next.state === "approved") {
        const [latest] = await transaction
          .select({ id: documents.id })
          .from(documents)
          .where(
            and(
              this.scope(tenantId),
              sql`${documents.metadata}->>'lineageId' = ${previous.lineageId}`,
            ),
          )
          .orderBy(desc(sql`(${documents.metadata}->>'version')::int`))
          .limit(1);
        if (latest?.id !== previous.id)
          throw new ConflictException("Only the latest revision can be approved.");
        await transaction
          .update(documents)
          .set({
            metadata: sql`jsonb_set(${documents.metadata}, '{state}', '"inactive"'::jsonb)`,
            updatedAt: next.updatedAt,
          })
          .where(
            and(
              this.scope(tenantId),
              sql`${documents.metadata}->>'lineageId' = ${previous.lineageId}`,
              sql`${documents.metadata}->>'state' = 'approved'`,
            ),
          );
      }
      const changed = await transaction
        .update(documents)
        .set({ metadata: sql`${JSON.stringify(next)}::text::jsonb`, updatedAt: next.updatedAt })
        .where(
          and(
            this.scope(tenantId),
            eq(documents.id, previous.id),
            sql`${documents.metadata} = ${JSON.stringify(previous)}::text::jsonb`,
          ),
        )
        .returning({ id: documents.id });
      if (!changed.length) throw new ConflictException("Record changed. Reload before retrying.");
      return next;
    });
  }

  async revise(tenantId: UUIDType, previous: KnowledgeMetadata, next: KnowledgeMetadata) {
    // Serialize revisions in each document lineage; immutable prior records preserve source references.
    return this.db.transaction(async (transaction) => {
      await transaction.execute(
        sql`SELECT pg_advisory_xact_lock(hashtext(${tenantId + previous.lineageId}))`,
      );
      const [latest] = await transaction
        .select({ metadata: documents.metadata })
        .from(documents)
        .where(
          and(
            this.scope(tenantId),
            sql`${documents.metadata}->>'lineageId' = ${previous.lineageId}`,
          ),
        )
        .orderBy(desc(sql`(${documents.metadata}->>'version')::int`))
        .limit(1);
      if (
        !latest ||
        !Value.Check(knowledgeMetadataSchema, latest.metadata) ||
        latest.metadata.id !== previous.id
      )
        throw new ConflictException("Revise the latest version.");
      await transaction.insert(documents).values({
        tenantId,
        id: next.id,
        fileName: next.title,
        contentType: "text/plain",
        byteSize: Buffer.byteLength(next.body),
        checksum: `aits:${tenantId}:${next.id}`,
        status: "ready",
        metadata: sql`${JSON.stringify(next)}::text::jsonb`,
      });
      return next;
    });
  }
}
