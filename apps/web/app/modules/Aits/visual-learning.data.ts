export type Bilingual = { en: string; th: string };
export type VisualLesson = {
  id: string;
  title: Bilingual;
  subtitle: Bilingual;
  diagram: Bilingual[];
  slides: { title: Bilingual; body: Bilingual }[];
  question: Bilingual;
  options: Bilingual[];
  correct: number;
  feedback: Bilingual;
  sources: { title: string; url: string }[];
  video?: { id: string; title: string; publisher: string };
};
const b = (en: string, th: string): Bilingual => ({ en, th });
export const visualLessons: VisualLesson[] = [
  {
    id: "welcome",
    title: b("Start with the customer", "เริ่มจากความต้องการของลูกค้า"),
    subtitle: b("Your first steps at AITS", "ก้าวแรกของคุณที่ AITS"),
    diagram: [b("Listen", "รับฟัง"), b("Clarify", "ถามให้ชัด"), b("Hand over", "ส่งต่องาน")],
    slides: [
      {
        title: b("A service starts with a need.", "งานบริการเริ่มจากความต้องการ"),
        body: b(
          "AITS presents CCTV, networking and security services on its public website. Start by understanding the customer's problem before choosing equipment.",
          "เว็บไซต์ AITS นำเสนอบริการกล้องวงจรปิด เครือข่าย และระบบรักษาความปลอดภัย เริ่มจากเข้าใจปัญหาของลูกค้าก่อนเลือกอุปกรณ์",
        ),
      },
      {
        title: b("Ask three useful questions.", "เริ่มด้วยคำถามที่ช่วยให้งานชัดเจน"),
        body: b(
          "What needs to improve? Where will the system be used? What equipment is already there? Record the answers and any uncertainty.",
          "ต้องการปรับปรุงเรื่องใด จะใช้ระบบที่ไหน และมีอุปกรณ์อะไรอยู่แล้ว บันทึกคำตอบพร้อมประเด็นที่ยังไม่แน่ใจ",
        ),
      },
      {
        title: b("Make the next action clear.", "ระบุขั้นตอนต่อไปให้ชัดเจน"),
        body: b(
          "A good handover includes the request, known facts, open questions and the person asked to respond. Confirm actual responsibilities with your supervisor.",
          "การส่งต่องานที่ดีมีคำขอ ข้อเท็จจริง คำถามที่ยังค้าง และผู้ที่ต้องตอบ ยืนยันหน้าที่จริงกับหัวหน้างาน",
        ),
      },
    ],
    question: b(
      "A customer asks for a camera price. What is the best first step?",
      "ลูกค้าถามราคากล้อง ควรเริ่มอย่างไร",
    ),
    options: [
      b("Promise an installation date", "รับปากวันติดตั้งทันที"),
      b("Clarify the location and intended use", "สอบถามสถานที่และวัตถุประสงค์"),
      b("Choose the most expensive camera", "เลือกกล้องที่แพงที่สุด"),
    ],
    correct: 1,
    feedback: b(
      "Understanding the need gives the technical team enough context to assess options. Pricing and dates need the authorized process.",
      "การเข้าใจความต้องการช่วยให้ทีมเทคนิคประเมินทางเลือกได้ ราคาและกำหนดเวลาต้องผ่านกระบวนการที่ได้รับอนุญาต",
    ),
    sources: [{ title: "AITS • Public services", url: "https://aitscctv.com/" }],
  },
  {
    id: "rights",
    title: b("Find the right answer", "ค้นหาคำตอบจากแหล่งที่ถูกต้อง"),
    subtitle: b("People, policies and support", "บุคลากร นโยบาย และความช่วยเหลือ"),
    diagram: [b("Question", "คำถาม"), b("Source", "แหล่งข้อมูล"), b("Confirm", "ยืนยัน")],
    slides: [
      {
        title: b("Know what a source can tell you.", "รู้ขอบเขตของแหล่งข้อมูล"),
        body: b(
          "A public website describes the business. An approved handbook explains company rules. A training example helps you practise a decision.",
          "เว็บไซต์สาธารณะอธิบายธุรกิจ คู่มือที่อนุมัติแล้วอธิบายกฎบริษัท ส่วนตัวอย่างการฝึกช่วยฝึกการตัดสินใจ",
        ),
      },
      {
        title: b("Check before relying on a policy.", "ตรวจสอบก่อนใช้นโยบาย"),
        body: b(
          "Look for the owner, approval, effective date and scope. A draft or an old copy may not be the rule that applies to you.",
          "ตรวจสอบผู้รับผิดชอบ การอนุมัติ วันที่มีผล และขอบเขต เอกสารร่างหรือฉบับเก่าอาจไม่ใช่กฎที่ใช้กับคุณ",
        ),
      },
      {
        title: b("Ask the responsible person.", "สอบถามผู้รับผิดชอบ"),
        body: b(
          "For leave, benefits or reporting lines, ask HR or your supervisor for the current approved document. This practice does not define AITS employment terms.",
          "เรื่องวันลา สวัสดิการ หรือสายการรายงาน ให้ขอเอกสารปัจจุบันที่อนุมัติแล้วจากฝ่ายบุคคลหรือหัวหน้า แบบฝึกนี้ไม่ได้กำหนดเงื่อนไขการจ้างงานของ AITS",
        ),
      },
    ],
    question: b(
      "A draft slide and a current approved handbook disagree. What should you do?",
      "สไลด์ฉบับร่างไม่ตรงกับคู่มือปัจจุบันที่อนุมัติแล้ว ควรทำอย่างไร",
    ),
    options: [
      b("Use whichever is shorter", "ใช้ฉบับที่สั้นกว่า"),
      b("Treat the slide as company policy", "ถือว่าสไลด์เป็นนโยบายบริษัท"),
      b("Check the approved policy with HR", "ตรวจสอบนโยบายที่อนุมัติแล้วกับฝ่ายบุคคล"),
    ],
    correct: 2,
    feedback: b(
      "Approval, currency and applicability matter. Ask HR to resolve the discrepancy; do not invent a company rule.",
      "ต้องพิจารณาการอนุมัติ ความเป็นปัจจุบัน และขอบเขต ให้ฝ่ายบุคคลช่วยตรวจสอบความต่าง อย่ากำหนดกฎบริษัทขึ้นเอง",
    ),
    sources: [
      {
        title: "AITS • Draft training source register",
        url: "https://aitscctv.github.io/aits-learning-hub/sources/inventory.json",
      },
    ],
  },
  {
    id: "safety",
    title: b("Pause. Check. Work safely.", "หยุด ตรวจสอบ ทำงานอย่างปลอดภัย"),
    subtitle: b("Notice risk before you begin", "มองเห็นความเสี่ยงก่อนเริ่มงาน"),
    diagram: [b("Notice", "สังเกต"), b("Pause", "หยุดก่อน"), b("Escalate", "แจ้งผู้รับผิดชอบ")],
    slides: [
      {
        title: b("Look at the whole work area.", "มองพื้นที่ทำงานให้ครบ"),
        body: b(
          "Notice electrical equipment, access routes, people and work at height. This is hazard-awareness practice, not authorization to carry out hazardous work.",
          "สังเกตอุปกรณ์ไฟฟ้า ทางสัญจร ผู้คน และงานบนที่สูง นี่คือการฝึกตระหนักถึงอันตราย ไม่ใช่การอนุญาตให้ทำงานเสี่ยง",
        ),
      },
      {
        title: b("Uncertainty is a reason to pause.", "เมื่อไม่แน่ใจ ให้หยุดก่อน"),
        body: b(
          "If the work method, equipment or authorization is unclear, pause and ask the responsible supervisor. Do not improvise an electrical or height-work procedure.",
          "หากวิธีทำงาน อุปกรณ์ หรือการอนุญาตยังไม่ชัดเจน ให้หยุดและสอบถามหัวหน้าที่รับผิดชอบ อย่าคิดวิธีทำงานไฟฟ้าหรืองานบนที่สูงขึ้นเอง",
        ),
      },
      {
        title: b("Describe the concern clearly.", "อธิบายข้อกังวลให้ชัด"),
        body: b(
          "State where the concern is, what you observed and who may be affected. Follow the site's approved emergency arrangements if there is immediate danger.",
          "ระบุสถานที่ สิ่งที่พบ และผู้ที่อาจได้รับผลกระทบ หากมีอันตรายทันที ให้ปฏิบัติตามแผนฉุกเฉินที่อนุมัติของสถานที่นั้น",
        ),
      },
    ],
    question: b(
      "A task requires access at height but no approved plan is available. What next?",
      "งานต้องขึ้นที่สูงแต่ยังไม่มีแผนที่อนุมัติ ควรทำอย่างไร",
    ),
    options: [
      b("Pause and ask the supervisor", "หยุดและสอบถามหัวหน้า"),
      b("Copy an online demonstration", "ทำตามคลิปออนไลน์"),
      b("Start quickly to save time", "รีบเริ่มเพื่อประหยัดเวลา"),
    ],
    correct: 0,
    feedback: b(
      "Work at height needs competent planning and suitable controls. A video or quiz cannot authorize the task.",
      "งานบนที่สูงต้องมีการวางแผนโดยผู้มีความสามารถและมาตรการที่เหมาะสม วิดีโอหรือแบบทดสอบไม่ใช่การอนุญาตให้ทำงาน",
    ),
    sources: [
      {
        title: "ILO • Working at height",
        url: "https://www.ilo.org/topics-and-sectors/occupational-safety-and-health-guide-labour-inspectors-and-other/working-height",
      },
    ],
  },
  {
    id: "cctv",
    title: b("Follow the camera signal", "ติดตามเส้นทางสัญญาณกล้อง"),
    subtitle: b("CCTV and Power over Ethernet", "กล้องวงจรปิดและการจ่ายไฟผ่านสาย LAN"),
    diagram: [b("Camera", "กล้อง"), b("PoE switch", "สวิตช์ PoE"), b("Recorder", "เครื่องบันทึก")],
    slides: [
      {
        title: b("One cable. Two jobs.", "สายเส้นเดียว ทำหน้าที่สองอย่าง"),
        body: b(
          "Power over Ethernet can carry data and power to compatible devices. Check the camera, power source and cabling requirements for the actual models.",
          "PoE ส่งข้อมูลและจ่ายไฟให้อุปกรณ์ที่รองรับผ่านสายเครือข่าย ตรวจสอบข้อกำหนดของกล้อง แหล่งจ่ายไฟ และสายตามรุ่นที่ใช้งานจริง",
        ),
      },
      {
        title: b("A picture is only part of the test.", "เห็นภาพยังไม่ใช่การทดสอบครบ"),
        body: b(
          "Live viewing and recording are separate checks. A useful handover verifies the required scene and playback, using approved acceptance criteria.",
          "การดูภาพสดและการบันทึกต้องตรวจแยกกัน การส่งมอบควรตรวจภาพที่ต้องการและการเล่นย้อนหลังตามเกณฑ์ที่อนุมัติ",
        ),
      },
      {
        title: b("Budget for every device.", "คำนวณกำลังไฟของทุกอุปกรณ์"),
        body: b(
          "Compare total maximum device demand with the switch's available PoE budget. Also check each port's capability and allow the margin required by the design.",
          "เปรียบเทียบความต้องการกำลังไฟสูงสุดรวมกับงบกำลังไฟ PoE ของสวิตช์ ตรวจความสามารถแต่ละพอร์ตและเผื่อกำลังไฟตามข้อกำหนดการออกแบบ",
        ),
      },
    ],
    question: b(
      "Live video works, but playback does not. What deserves checking?",
      "ดูภาพสดได้แต่เล่นย้อนหลังไม่ได้ ควรตรวจอะไร",
    ),
    options: [
      b("The camera's paint colour", "สีตัวกล้อง"),
      b("Recording settings and storage", "การตั้งค่าบันทึกและพื้นที่จัดเก็บ"),
      b("Reset everything immediately", "รีเซ็ตทุกอุปกรณ์ทันที"),
    ],
    correct: 1,
    feedback: b(
      "Check the recording path and preserve evidence. A reset can erase useful settings and needs authorization.",
      "ตรวจเส้นทางการบันทึกและเก็บหลักฐาน การรีเซ็ตอาจลบค่าที่สำคัญและต้องได้รับอนุญาต",
    ),
    sources: [
      {
        title: "Axis • Camera power considerations",
        url: "https://whitepapers.axis.com/en-us/typical-and-maximum-power-consumption-in-axis-cameras",
      },
    ],
    video: {
      id: "8YreJdKJqh0",
      title: "Academy 60 seconds — Power over Ethernet",
      publisher: "Axis Communications",
    },
  },
  {
    id: "network",
    title: b("Connect the dots", "เชื่อมโยงความเข้าใจเรื่องเครือข่าย"),
    subtitle: b("Devices, networks and services", "อุปกรณ์ เครือข่าย และบริการ"),
    diagram: [b("Device", "อุปกรณ์"), b("Switch", "สวิตช์"), b("Router", "เราเตอร์")],
    slides: [
      {
        title: b("Different devices, different jobs.", "อุปกรณ์ต่างชนิด ทำหน้าที่ต่างกัน"),
        body: b(
          "A switch connects devices within a network. A router connects networks. An access point provides a wireless connection to a network.",
          "สวิตช์เชื่อมอุปกรณ์ภายในเครือข่าย เราเตอร์เชื่อมระหว่างเครือข่าย และจุดกระจายสัญญาณให้การเชื่อมต่อแบบไร้สาย",
        ),
      },
      {
        title: b("Separate the connection from the service.", "แยกการเชื่อมต่อออกจากบริการ"),
        body: b(
          "A Wi-Fi icon does not prove every service is reachable. Check the symptom, affected devices, addressing and name resolution before changing settings.",
          "สัญลักษณ์ Wi-Fi ไม่ได้ยืนยันว่าเข้าถึงทุกบริการได้ ตรวจอาการ อุปกรณ์ที่ได้รับผลกระทบ การกำหนดที่อยู่ และการแปลงชื่อก่อนเปลี่ยนค่า",
        ),
      },
      {
        title: b("Networks carry more than video.", "เครือข่ายไม่ได้ส่งแค่วิดีโอ"),
        body: b(
          "Network audio is another example of a service using IP infrastructure. Identify the signal path and the device roles before troubleshooting.",
          "ระบบเสียงผ่านเครือข่ายเป็นอีกตัวอย่างของบริการบนโครงสร้าง IP ระบุเส้นทางสัญญาณและหน้าที่อุปกรณ์ก่อนแก้ปัญหา",
        ),
      },
    ],
    question: b(
      "Which device usually connects separate networks?",
      "อุปกรณ์ใดโดยทั่วไปใช้เชื่อมระหว่างเครือข่าย",
    ),
    options: [
      b("Patch panel", "แผงกระจายสาย"),
      b("Camera lens", "เลนส์กล้อง"),
      b("Router", "เราเตอร์"),
    ],
    correct: 2,
    feedback: b(
      "The router forwards traffic between networks. Identify each device's role before changing the configuration.",
      "เราเตอร์ส่งต่อข้อมูลระหว่างเครือข่าย ระบุหน้าที่ของแต่ละอุปกรณ์ก่อนเปลี่ยนการตั้งค่า",
    ),
    sources: [
      {
        title: "Cisco • Networking basics",
        url: "https://www.cisco.com/site/us/en/learn/topics/small-business/networking-basics.html",
      },
    ],
    video: {
      id: "5iB3AmPBXHA",
      title: "Academy 60 seconds — Network audio",
      publisher: "Axis Communications",
    },
  },
  {
    id: "service",
    title: b("Turn a concern into a next step", "เปลี่ยนข้อกังวลให้เป็นขั้นตอนต่อไป"),
    subtitle: b("Customer care and handovers", "ดูแลลูกค้าและส่งต่องาน"),
    diagram: [b("Listen", "รับฟัง"), b("Record", "บันทึก"), b("Follow up", "ติดตาม")],
    slides: [
      {
        title: b("Capture facts before conclusions.", "เก็บข้อเท็จจริงก่อนสรุป"),
        body: b(
          "Ask what happened, when it started and which devices are affected. Keep the customer's observation separate from your suspected cause.",
          "ถามว่าเกิดอะไรขึ้น เริ่มเมื่อใด และอุปกรณ์ใดได้รับผลกระทบ แยกสิ่งที่ลูกค้าพบออกจากสาเหตุที่คุณคาดไว้",
        ),
      },
      {
        title: b("Promise a next action you can own.", "รับปากเฉพาะขั้นตอนที่รับผิดชอบได้"),
        body: b(
          "Explain who will review the issue and how the next update will be arranged. Do not invent warranty terms, prices or resolution times.",
          "อธิบายว่าใครจะตรวจสอบและจะนัดหมายการแจ้งความคืบหน้าอย่างไร อย่ากำหนดเงื่อนไขประกัน ราคา หรือเวลาแก้ไขขึ้นเอง",
        ),
      },
      {
        title: b("Share evidence, protect secrets.", "ส่งหลักฐานอย่างระมัดระวัง"),
        body: b(
          "Use authorized channels for customer records. Keep passwords out of ordinary tickets, screenshots and training exercises.",
          "ใช้ช่องทางที่ได้รับอนุญาตสำหรับข้อมูลลูกค้า ไม่ใส่รหัสผ่านในใบงานทั่วไป ภาพหน้าจอ หรือแบบฝึกอบรม",
        ),
      },
    ],
    question: b("Which handover is most useful?", "ข้อความส่งต่องานใดมีประโยชน์ที่สุด"),
    options: [
      b(
        "Site A: camera 2 lost video at 09:00; other cameras work; technician review requested",
        "ไซต์ A กล้อง 2 ไม่มีภาพตั้งแต่ 09:00 กล้องอื่นปกติ ขอให้ช่างตรวจสอบ",
      ),
      b("It is broken", "เสียแล้ว"),
      b("Definitely replace everything", "ต้องเปลี่ยนทุกอย่างแน่นอน"),
    ],
    correct: 0,
    feedback: b(
      "The first example gives the scope, timing and requested action without pretending the cause is confirmed. This is a fictional practice case.",
      "ตัวอย่างแรกระบุขอบเขต เวลา และสิ่งที่ต้องการให้ทำ โดยไม่อ้างว่ายืนยันสาเหตุแล้ว กรณีนี้เป็นสถานการณ์สมมติสำหรับฝึก",
    ),
    sources: [
      {
        title: "AITS • Instructional draft source register",
        url: "https://aitscctv.github.io/aits-learning-hub/sources/inventory.json",
      },
    ],
  },
  {
    id: "quality",
    title: b("Make good work repeatable", "ทำให้งานที่ดีเกิดขึ้นได้อย่างสม่ำเสมอ"),
    subtitle: b("SOPs, evidence and improvement", "ขั้นตอน หลักฐาน และการปรับปรุง"),
    diagram: [b("Prepare", "เตรียม"), b("Verify", "ตรวจสอบ"), b("Improve", "ปรับปรุง")],
    slides: [
      {
        title: b("Start with the current procedure.", "เริ่มจากขั้นตอนฉบับปัจจุบัน"),
        body: b(
          "Check the procedure's version, approval and scope before using it. Generic templates help discussion; they are not automatically AITS rules.",
          "ตรวจฉบับ การอนุมัติ และขอบเขตก่อนใช้ขั้นตอนการทำงาน แม่แบบทั่วไปช่วยในการหารือ แต่ไม่ได้เป็นกฎ AITS โดยอัตโนมัติ",
        ),
      },
      {
        title: b("Record what you actually checked.", "บันทึกสิ่งที่ตรวจจริง"),
        body: b(
          "Evidence should say what was tested, the observed result and any unresolved issue. A tick without a check does not demonstrate quality.",
          "หลักฐานควรระบุสิ่งที่ทดสอบ ผลที่พบ และประเด็นค้าง การทำเครื่องหมายโดยไม่ได้ตรวจไม่ยืนยันคุณภาพ",
        ),
      },
      {
        title: b("Learn from the difference.", "เรียนรู้จากสิ่งที่ต่างจากแผน"),
        body: b(
          "If work differs from the approved method, record the deviation and seek review. Keep improvements traceable to a responsible owner.",
          "หากงานต่างจากวิธีที่อนุมัติ ให้บันทึกความคลาดเคลื่อนและขอให้ทบทวน การปรับปรุงควรติดตามผู้รับผิดชอบได้",
        ),
      },
    ],
    question: b(
      "The checklist says playback was tested, but nobody checked it. What should happen?",
      "รายการตรวจระบุว่าทดสอบย้อนหลังแล้ว แต่ยังไม่มีใครตรวจ ควรทำอย่างไร",
    ),
    options: [
      b("Keep the tick to finish faster", "คงเครื่องหมายไว้เพื่อให้งานเสร็จเร็ว"),
      b("Correct the record and arrange the actual check", "แก้บันทึกให้ตรงจริงและจัดให้มีการตรวจ"),
      b("Copy another site's results", "คัดลอกผลจากไซต์อื่น"),
    ],
    correct: 1,
    feedback: b(
      "Records should reflect actual work. Resolve the missing check through the responsible team before claiming it passed.",
      "บันทึกต้องตรงกับงานจริง ให้ทีมที่รับผิดชอบดำเนินการตรวจที่ขาดก่อนระบุว่าผ่าน",
    ),
    sources: [
      {
        title: "ISO • Quality assurance overview",
        url: "https://www.iso.org/quality-management/quality-assurance",
      },
    ],
  },
];

export function calculatePoeLoad(cameras: number, watts: number, budget: number) {
  if (
    ![cameras, watts, budget].every(Number.isFinite) ||
    cameras < 1 ||
    !Number.isInteger(cameras) ||
    watts <= 0 ||
    budget <= 0
  )
    return null;
  const total = cameras * watts;
  return { total, remaining: budget - total, fits: total <= budget };
}
