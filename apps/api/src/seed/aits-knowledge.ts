import { SYSTEM_ROLE_SLUGS } from "@repo/shared";
import { sql } from "drizzle-orm";

import { documents } from "src/storage/schema";

import type { KnowledgeMetadata } from "src/aits/aits.schema";
import type { DatabasePg, UUIDType } from "src/common";

export async function seedAitsKnowledge(db: DatabasePg, tenantId: UUIDType, createdBy: UUIDType) {
  const examples = [
    {
      language: "en",
      kind: "faq",
      title: "Where can I find approved employee benefits?",
      body: "This sample does not define any benefits. Ask HR for current, approved employee documents and confirm the version that applies.",
    },
    {
      language: "th",
      kind: "faq",
      title: "จะค้นหาสวัสดิการพนักงานที่ได้รับอนุมัติได้ที่ไหน?",
      body: "ตัวอย่างนี้ไม่ได้กำหนดสวัสดิการใด ๆ กรุณาขอเอกสารพนักงานที่เป็นปัจจุบันและอนุมัติแล้วจากฝ่ายบุคคล และยืนยันเวอร์ชันที่เกี่ยวข้อง",
    },
    {
      language: "en",
      kind: "sop",
      title: "Connectivity observations — demonstration checklist",
      body: "1. Describe the reported symptoms.\n2. Note whether one device or several are affected.\n3. Observe physical connections without unsafe intervention.\n4. Record relevant observations without credentials or customer secrets.\n5. Ask a supervisor for the applicable approved SOP.\nThis checklist does not determine compliance with an actual company procedure.",
    },
    {
      language: "th",
      kind: "sop",
      title: "การสังเกตปัญหาการเชื่อมต่อ — รายการตรวจสอบตัวอย่าง",
      body: "1. อธิบายอาการที่ได้รับแจ้ง\n2. ระบุว่ากระทบอุปกรณ์เดียวหรือหลายเครื่อง\n3. สังเกตการเชื่อมต่อโดยไม่ดำเนินการที่ไม่ปลอดภัย\n4. บันทึกสิ่งที่พบโดยไม่ใส่รหัสผ่านหรือข้อมูลลับลูกค้า\n5. ขอ SOP ที่ได้รับอนุมัติจากหัวหน้างาน\nรายการนี้ไม่ได้ประเมินการปฏิบัติตามขั้นตอนจริงของบริษัท",
    },
  ] as const;
  for (const [index, example] of examples.entries()) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const metadata: KnowledgeMetadata = {
      ...example,
      id,
      lineageId: id,
      version: 1,
      owner: "Demo content collection — Matsumoto",
      category: "Sample onboarding",
      sample: true,
      state: "draft",
      roles: [SYSTEM_ROLE_SLUGS.STUDENT, SYSTEM_ROLE_SLUGS.GROUP_MANAGER, SYSTEM_ROLE_SLUGS.ADMIN],
      createdBy,
      reviewedBy: null,
      createdAt: now,
      updatedAt: now,
      fileName: null,
      storageKey: null,
      extension: "aits-knowledge-v1",
    };
    await db
      .insert(documents)
      .values({
        tenantId,
        id,
        fileName: example.title,
        contentType: "text/plain",
        byteSize: Buffer.byteLength(example.body),
        checksum: `aits-demo:${tenantId}:${index}`,
        status: "ready",
        metadata: sql`${JSON.stringify(metadata)}::text::jsonb`,
      })
      .onConflictDoNothing({ target: documents.checksum });
  }
}
