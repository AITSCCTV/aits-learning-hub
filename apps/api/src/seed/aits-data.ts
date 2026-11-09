import { SUPPORTED_LANGUAGES } from "@repo/shared";

import { LESSON_TYPES } from "src/lesson/lesson.type";
import { QUESTION_TYPE } from "src/questions/schema/question.types";

import type { NiceCourseData } from "src/utils/types/test-types";

export const AITS_SAMPLE = {
  en: "Sample Content — Pending Company Approval",
  th: "เนื้อหาตัวอย่าง — รอการอนุมัติจากบริษัท",
};

// Educational examples only. No internal policy, benefit or operational requirement is asserted.
const topics = [
  {
    en: "Welcome to AITS",
    th: "ยินดีต้อนรับสู่ AITS",
    category: "Welcome to AITS",
    categoryTh: "ยินดีต้อนรับสู่ AITS",
    kind: "video",
    body: "Explore your assigned learning, open a lesson, and try a practice quiz. AITS publicly describes CCTV, networking, internet, access control and smart home services. Visit https://www.aitscctv.com/ for public company information. Ask HR for the approved employee handbook.",
    bodyTh:
      "สำรวจหลักสูตรที่ได้รับมอบหมาย เปิดบทเรียน และทดลองทำแบบทดสอบ เว็บไซต์สาธารณะของ AITS แนะนำบริการ CCTV เครือข่าย อินเทอร์เน็ต ระบบควบคุมการเข้าออก และสมาร์ทโฮม ดูข้อมูลสาธารณะที่ https://www.aitscctv.com/ และขอคู่มือพนักงานที่อนุมัติแล้วจากฝ่ายบุคคล",
  },
  {
    en: "Introduction to CCTV Systems",
    th: "ความรู้เบื้องต้นเกี่ยวกับระบบ CCTV",
    category: "CCTV Installation Fundamentals",
    categoryTh: "พื้นฐานระบบ CCTV",
    kind: "image",
    body: "A basic CCTV system can include cameras, a recorder, storage, a network and a viewing device. This introductory example explains component names only. It does not authorize installation, surveillance access, or electrical work. Use approved training and qualified supervision for field work.",
    bodyTh:
      "ระบบ CCTV โดยทั่วไปอาจประกอบด้วยกล้อง เครื่องบันทึก พื้นที่จัดเก็บ เครือข่าย และอุปกรณ์แสดงผล ตัวอย่างนี้แนะนำชื่ออุปกรณ์เท่านั้น ไม่ใช่การอนุญาตให้ติดตั้ง เข้าถึงภาพ หรือทำงานไฟฟ้า งานภาคสนามต้องอ้างอิงการฝึกอบรมที่อนุมัติและผู้ควบคุมที่มีคุณสมบัติเหมาะสม",
  },
  {
    en: "Basic Networking Concepts",
    th: "แนวคิดพื้นฐานเกี่ยวกับเครือข่าย",
    category: "Networking Fundamentals",
    categoryTh: "พื้นฐานเครือข่าย",
    kind: "slides",
    body: "A local network connects devices. A switch connects devices within a network; a router connects networks. An IP address identifies a network interface. Review these concepts before using any company-approved configuration guide. Do not change a live network as part of this demonstration.",
    bodyTh:
      "เครือข่ายภายในเชื่อมต่ออุปกรณ์เข้าด้วยกัน สวิตช์เชื่อมอุปกรณ์ในเครือข่าย เราเตอร์เชื่อมระหว่างเครือข่าย และที่อยู่ IP ใช้ระบุอินเทอร์เฟซเครือข่าย ทบทวนแนวคิดเหล่านี้ก่อนอ่านคู่มือการตั้งค่าที่บริษัทอนุมัติ ห้ามใช้ตัวอย่างนี้เป็นคำสั่งเปลี่ยนเครือข่ายจริง",
  },
  {
    en: "Internet Connectivity Troubleshooting",
    th: "แนวคิดการตรวจสอบการเชื่อมต่ออินเทอร์เน็ต",
    category: "Internet Troubleshooting",
    categoryTh: "การตรวจสอบอินเทอร์เน็ต",
    kind: "text",
    body: "Generic demonstration: 1. Identify the reported symptoms. 2. Determine whether one or several devices are affected. 3. Observe basic physical connections without unsafe intervention. 4. Record observations without passwords or customer secrets. 5. Escalate using the applicable approved SOP. This is not an official AITS procedure.",
    bodyTh:
      "ตัวอย่างทั่วไป: 1. ระบุอาการที่ได้รับแจ้ง 2. ตรวจว่ากระทบอุปกรณ์เดียวหรือหลายเครื่อง 3. สังเกตการเชื่อมต่อพื้นฐานโดยไม่ดำเนินการที่ไม่ปลอดภัย 4. บันทึกสิ่งที่พบโดยไม่บันทึกรหัสผ่านหรือข้อมูลลับลูกค้า 5. ส่งต่อปัญหาตาม SOP ที่อนุมัติ ตัวอย่างนี้ไม่ใช่ขั้นตอนอย่างเป็นทางการของ AITS",
  },
  {
    en: "Introduction to Employee Rights",
    th: "การค้นหาข้อมูลสิทธิพนักงาน",
    category: "Employee Rights & Benefits",
    categoryTh: "สิทธิและสวัสดิการพนักงาน",
    kind: "pdf",
    body: "Approved HR materials are not available in this demonstration. No leave allowance, benefit, compensation, working-hours rule or entitlement is stated here. Contact HR for current approved documents and ask which version applies to your circumstances.",
    bodyTh:
      "ระบบสาธิตยังไม่มีเอกสารฝ่ายบุคคลที่ได้รับอนุมัติ จึงไม่ระบุวันลา สวัสดิการ ค่าตอบแทน ชั่วโมงทำงาน หรือสิทธิใด ๆ กรุณาติดต่อฝ่ายบุคคลเพื่อขอเอกสารล่าสุดที่อนุมัติและสอบถามว่าเวอร์ชันใดเกี่ยวข้องกับกรณีของคุณ",
  },
  {
    en: "Workplace Communication",
    th: "การสื่อสารในที่ทำงาน",
    category: "Company Overview",
    categoryTh: "ภาพรวมบริษัท",
    kind: "text",
    body: "Practice describing a situation, observations and an open question in clear language. Confirm your understanding and ask for clarification when uncertain. This generic communication exercise does not define AITS reporting lines or response-time requirements.",
    bodyTh:
      "ฝึกอธิบายสถานการณ์ สิ่งที่สังเกต และคำถามด้วยภาษาที่ชัดเจน ยืนยันความเข้าใจและสอบถามเมื่อไม่แน่ใจ แบบฝึกหัดทั่วไปนี้ไม่ได้กำหนดสายการบังคับบัญชาหรือระยะเวลาตอบกลับของ AITS",
  },
  {
    en: "Introduction to Company Procedures",
    th: "การค้นหาขั้นตอนของบริษัท",
    category: "Company SOPs",
    categoryTh: "ขั้นตอนปฏิบัติงานของบริษัท",
    kind: "sop",
    body: "Before relying on a procedure, check its title, owner, version and approval status. Sample or draft content is not authoritative. If the applicable approved procedure is missing, ask a supervisor. Do not infer requirements from a demonstration checklist.",
    bodyTh:
      "ก่อนอ้างอิงขั้นตอน ให้ตรวจชื่อ ผู้รับผิดชอบ เวอร์ชัน และสถานะอนุมัติ เนื้อหาตัวอย่างหรือฉบับร่างไม่ใช่ข้อกำหนด หากไม่พบขั้นตอนที่อนุมัติและเกี่ยวข้อง ให้ถามหัวหน้างาน อย่าอนุมานข้อกำหนดจากรายการตรวจสอบตัวอย่าง",
  },
  {
    en: "Administrative Information Handling",
    th: "การจัดการข้อมูลสำหรับงานธุรการ",
    category: "Administrative Procedures",
    categoryTh: "ขั้นตอนงานธุรการ",
    kind: "faq",
    body: "Use synthetic information when practicing. Avoid copying personal information, customer details or credentials into a training example. Ask the designated owner for the approved information-handling procedure. This lesson does not establish a company retention or privacy policy.",
    bodyTh:
      "ใช้ข้อมูลสมมติในการฝึก หลีกเลี่ยงการคัดลอกข้อมูลส่วนบุคคล รายละเอียดลูกค้า หรือข้อมูลเข้าสู่ระบบลงในตัวอย่างการเรียน ขอขั้นตอนการจัดการข้อมูลที่อนุมัติจากผู้รับผิดชอบ บทเรียนนี้ไม่ได้กำหนดนโยบายความเป็นส่วนตัวหรือระยะเวลาเก็บข้อมูลของบริษัท",
  },
] as const;

export const aitsCourses: NiceCourseData[] = [
  SUPPORTED_LANGUAGES.EN,
  SUPPORTED_LANGUAGES.TH,
].flatMap((language) =>
  topics.map((topic) => {
    const thai = language === SUPPORTED_LANGUAGES.TH;
    const warning = AITS_SAMPLE[language];
    const body = thai ? topic.bodyTh : topic.body;
    return {
      title: `${thai ? topic.th : topic.en} — ${warning}`,
      description: `${warning}. ${body}`,
      language,
      status: "published",
      priceInCents: 0,
      hasCertificate: false,
      category: thai ? topic.categoryTh : topic.category,
      chapters: [
        {
          title: thai ? "บทเรียนตัวอย่าง" : "Sample learning module",
          isFreemium: false,
          lessons: [
            {
              type: LESSON_TYPES.CONTENT,
              title: `${thai ? topic.th : topic.en} — ${warning}`,
              description: `<p>[AITS:${topic.kind}]</p><h2>${warning}</h2><p>${body}</p>`,
            },
            {
              type: LESSON_TYPES.QUIZ,
              title: `${thai ? "แบบทดสอบฝึกหัด" : "Practice quiz"} — ${warning}`,
              description: warning,
              questions: [
                {
                  type: QUESTION_TYPE.SINGLE_CHOICE,
                  language,
                  title: thai
                    ? "ควรใช้อะไรเป็นแหล่งอ้างอิงข้อกำหนดของบริษัท?"
                    : "Which source should establish company requirements?",
                  options: [
                    {
                      language,
                      optionText: thai
                        ? "เอกสารที่เป็นปัจจุบันและบริษัทอนุมัติ"
                        : "Current company-approved documentation",
                      isCorrect: true,
                    },
                    {
                      language,
                      optionText: thai
                        ? "บทเรียนตัวอย่างที่ยังไม่อนุมัติ"
                        : "An unapproved sample lesson",
                      isCorrect: false,
                    },
                    {
                      language,
                      optionText: thai ? "คำตอบที่ไม่มีแหล่งอ้างอิง" : "An unsupported answer",
                      isCorrect: false,
                    },
                  ],
                },
                {
                  type: QUESTION_TYPE.TRUE_OR_FALSE,
                  language,
                  title: thai
                    ? "ระบุว่าข้อความต่อไปนี้จริงหรือเท็จ"
                    : "Mark the statement true or false",
                  options: [
                    {
                      language,
                      optionText: thai
                        ? "เนื้อหาตัวอย่างนี้เป็นนโยบายอย่างเป็นทางการของ AITS"
                        : "This sample content is official AITS policy",
                      isCorrect: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  }),
);
