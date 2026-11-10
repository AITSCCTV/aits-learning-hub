import json
from pathlib import Path

root = Path(__file__).resolve().parents[1] / 'apps/web/app/locales'
# This intentionally bilingual learning surface has parity in English and Thai,
# independent of the language used for the surrounding application.
labels = {
 'title': 'Visual learning / เรียนรู้ผ่านภาพ',
 'intro': 'Watch, explore, try. One clear idea at a time. / ดู สำรวจ ทดลอง เรียนรู้ทีละแนวคิด',
 'formats': 'Visual slides · Videos · Practice / สไลด์ · วิดีโอ · แบบฝึก',
 'draft': 'Learning draft / เนื้อหาฝึกฉบับร่าง',
 'personalize': 'YOUR START / จุดเริ่มต้น',
 'interest': 'Where would you like to begin? / อยากเริ่มเรียนเรื่องใด',
 'interestNote': 'Choose an interest. Every topic stays available. / เลือกเรื่องที่สนใจ ทุกหัวข้อยังเปิดให้เรียนได้',
 'all': 'Getting started / เริ่มต้นทำงาน',
 'technical': 'CCTV & networks / กล้องและเครือข่าย',
 'customer': 'Customer care / การดูแลลูกค้า',
 'begin': 'Let’s begin / เริ่มเรียน',
 'path': 'YOUR LEARNING PATH / เส้นทางการเรียนรู้',
 'steps': 'practice steps / ขั้นการฝึก',
 'cardFormat': '3 slides + practice / 3 สไลด์ + แบบฝึก',
 'backPath': 'All topics / ทุกหัวข้อ',
 'practiceOnly': 'Practice, not certification / แบบฝึก ไม่ใช่การรับรอง',
 'diagram': 'Concept flow / ลำดับแนวคิด',
 'previous': 'Previous slide / สไลด์ก่อนหน้า',
 'next': 'Next slide / สไลด์ถัดไป',
 'slide': 'Slide / สไลด์',
 'watch': 'Watch & connect / ดูและเชื่อมโยงความรู้',
 'loadVideo': 'Load YouTube video / โหลดวิดีโอ YouTube',
 'videoNote': 'Original English video. Both-language learning notes are above; Thai subtitles depend on the publisher. Loading connects to YouTube. / วิดีโอต้นฉบับภาษาอังกฤษ มีเนื้อหาประกอบสองภาษาด้านบน คำบรรยายไทยขึ้นอยู่กับผู้เผยแพร่ การโหลดจะเชื่อมต่อกับ YouTube',
 'openYoutube': 'Open on YouTube if playback is unavailable / เปิดใน YouTube หากเล่นไม่ได้',
 'sources': 'Sources & content status / แหล่งข้อมูลและสถานะเนื้อหา',
 'sourceNote': 'AI-assisted educational draft. Examples are fictional; this is not approved AITS policy. English and Thai wording require company review. / เนื้อหาฝึกจัดทำโดยใช้ AI ช่วย ตัวอย่างเป็นเรื่องสมมติ ไม่ใช่นโยบาย AITS ที่อนุมัติแล้ว ต้องตรวจทานทั้งภาษาไทยและอังกฤษ',
 'yourTurn': 'YOUR TURN / ลองทำด้วยตัวเอง',
 'chooseAnswer': 'Choose an answer / เลือกคำตอบ',
 'check': 'Check my answer / ตรวจคำตอบ',
 'correct': 'That’s it. / ถูกต้อง',
 'retry': 'Take another look, then try again. / ลองทบทวนแล้วตอบอีกครั้ง',
 'complete': 'Practice completed / ทำแบบฝึกแล้ว',
 'nextLesson': 'Next topic / หัวข้อถัดไป',
 'lab': 'Try the PoE budget / ทดลองคำนวณกำลังไฟ PoE',
 'cameras': 'Cameras / จำนวนกล้อง',
 'watts': 'W per camera / วัตต์ต่อกล้อง',
 'budget': 'Budget (W) / กำลังไฟที่มี (W)',
 'fits': 'Within this example’s total budget / อยู่ในงบกำลังไฟรวมของตัวอย่าง',
 'over': 'Over budget — change the example values / เกินงบกำลังไฟ ลองปรับค่า',
 'invalid': 'Enter positive values and a whole number of cameras. / ใส่ค่ามากกว่าศูนย์ และจำนวนกล้องเป็นจำนวนเต็ม',
 'labNote': 'Arithmetic practice only. Real designs also need per-port checks, device specifications and design margin. / ฝึกคำนวณเท่านั้น งานจริงต้องตรวจแต่ละพอร์ต ข้อกำหนดอุปกรณ์ และกำลังไฟสำรองในการออกแบบ',
 'finished': 'A stronger start. / เริ่มต้นอย่างมั่นใจขึ้น',
 'finishedNote': 'You have practised all seven topics. Continue with your assigned courses and supervisor guidance. / คุณฝึกครบทั้งเจ็ดหัวข้อแล้ว เรียนหลักสูตรที่ได้รับมอบหมายต่อและขอคำแนะนำจากหัวหน้า',
 'localProgress': 'Practice progress saves in this browser for your account. It does not update course grades or manager reports. / ความคืบหน้าแบบฝึกบันทึกในเบราว์เซอร์นี้สำหรับบัญชีของคุณ ไม่เปลี่ยนคะแนนหลักสูตรหรือรายงานผู้จัดการ',
 'sessionOnly': 'Browser storage is unavailable. Practice progress lasts for this visit only. / ไม่สามารถบันทึกในเบราว์เซอร์ได้ ความคืบหน้าเก็บไว้เฉพาะการใช้งานครั้งนี้',
 'thaiVideos': 'Explore Hikvision Thailand’s official video channel / ดูช่องวิดีโอทางการ Hikvision Thailand',
 'readReference': 'Read reference article / อ่านบทความอ้างอิง',
}
for file in root.glob('*/translation.json'):
    data = json.loads(file.read_text(encoding='utf-8'))
    data['visualLearning'] = labels
    file.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
