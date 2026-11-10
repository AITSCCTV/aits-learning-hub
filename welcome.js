const words = {
  th: {
    brand: "พื้นที่เรียนรู้ของทีม AITS",
    title: "ยินดีด้วยที่ได้ร่วมทีม AITSCCTV",
    body: "ก้าวแรกของคุณเริ่มที่นี่ รู้จักบริษัท พบทีมที่พร้อมช่วยคุณ และเรียนสิ่งที่ใช้ได้จริงในงานของคุณ",
    login: "เข้าสู่ระบบเพื่อเริ่มต้น →",
    note: "หากระบบกำลังพัก อาจใช้เวลาสักครู่ในการเริ่มต้น",
    review: "เอกสารประกอบสำหรับผู้ตรวจทาน",
    company: "รู้จักบริษัทและวิธีทำงาน",
    people: "รู้จักผู้ช่วยเหลือและทีมงาน",
    role: "เลือกบทเรียนให้เหมาะกับคุณ",
  },
  en: {
    brand: "AITS team learning",
    title: "Congratulations on joining AITSCCTV",
    body: "Your first steps start here. Meet the company, find your people and learn what matters for your work.",
    login: "Log in to get started →",
    note: "If the free app is sleeping, it may take a little time to start.",
    review: "Supporting materials for reviewers",
    company: "Company and working culture",
    people: "People and support",
    role: "Learning that fits your role",
  },
};
function language(value) {
  document.documentElement.lang = value;
  document.querySelectorAll("[data-copy]").forEach((node) => {
    node.textContent = words[value][node.dataset.copy];
  });
  ["th", "en"].forEach((key) => {
    document.getElementById(key).setAttribute("aria-pressed", String(key === value));
  });
}
document.getElementById("th").addEventListener("click", () => language("th"));
document.getElementById("en").addEventListener("click", () => language("en"));
