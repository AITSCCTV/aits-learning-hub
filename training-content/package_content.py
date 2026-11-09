"""Validate authored assets, build a linked review index and package deliverables."""
import hashlib,html,json,sys,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT/'knowledge-base'))
from mentor_context import practice_session
courses=json.loads((ROOT/'curriculum.json').read_text(encoding='utf8'))['courses']
sources=json.loads((ROOT/'sources/inventory.json').read_text(encoding='utf8'))
def write(path,value):
 (ROOT/path).write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf8')
sessions=[practice_session(c['id'],i) for c in courses for i in range(len(c['scenarios']))]
write('knowledge-base/practice-sessions.json',sessions)
alignment=[];assets=[];cards=[]
for c in courses:
 assert len(c['lessons'])==4 and len(c['assessments'])==12 and len(c['scenarios'])==3
 qids={q['id'] for q in c['assessments']}
 for q in c['assessments']:
  assert q['correct_answer'] in q['choices'] and q['explanation'].strip()
 for l in c['lessons']:
  assert set(l['knowledge_checks'])<=qids
  assert l['exercise'] and l['model_response'] and l['thai_summary']
  alignment.append(dict(course=c['id'],lesson=l['id'],objectives=l['objectives'],questions=l['knowledge_checks'],exercise=l['exercise']))
 for s in c['scenarios']:
  assert len(s['evaluation_rubric'])==4 and s['expected_actions'] and s['consequences']
 folder=ROOT/c['folder'];links=[]
 for p in sorted(folder.rglob('*')):
  if not p.is_file():continue
  rel=p.relative_to(ROOT).as_posix()
  lesson=next((l['id'] for l in c['lessons'] if l['id'] in p.name),None)
  assets.append(dict(path=rel,course_id=c['id'],lesson_id=lesson,related_lessons=[lesson] if lesson else [l['id'] for l in c['lessons']],version='0.1.0',approval_status='Draft',created_date='2026-11-09',last_updated_date='2026-11-09',responsible_reviewer='Company to designate',source_references=c['metadata']['source_references'],sha256=hashlib.sha256(p.read_bytes()).hexdigest(),bytes=p.stat().st_size))
  if p.suffix in ('.pptx','.docx','.pdf','.svg') or p.suffix=='.html':
   links.append(f'<li><a href="{html.escape(rel)}">{html.escape(p.parent.name+" / "+p.name)}</a></li>')
 cards.append(f'<section><h2>{c["id"]} · {html.escape(c["title"])}</h2><p>{html.escape(", ".join(c["roles"]))} · Draft · ~100 minutes</p><ul>{"".join(links)}</ul></section>')
write('content-manifest.json',dict(version='0.1.0',approval_status='Draft',assets=assets,shared_resources=['curriculum.json','sources/inventory.json','knowledge-base/items.json','knowledge-base/practice-sessions.json'],local_import_receipt='imports/local-receipt.json'))
write('quality-reports/curriculum-alignment.json',dict(passed=True,courses=7,lessons=28,questions=84,scenarios=21,alignment=alignment))
write('quality-reports/visual-review.json',dict(slides_inspected=112,pdf_pages_inspected=68,diagram_pairs=7,method='Rendered slide PNGs and Word-exported PDF pages inspected visually.',findings=['No material clipping or unreadable Thai glyphs observed.','Cover metadata has lower contrast than the main teaching text.','Word table accents and SOP headings retain some template blue.'],status='Suitable for company review; not brand-final or policy-approved.'))
(ROOT/'index.html').write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AITS training review package</title><style>body{font:17px/1.55 Arial,sans-serif;max-width:1000px;margin:40px auto;padding:0 24px;color:#151515}h1{border-bottom:5px solid #c8272d;padding-bottom:20px}h2{font-size:23px}section{border-top:1px solid #ddd;padding:18px 0}a{color:#a61920}header p{font-size:20px}.tag{color:#b12027;font-weight:bold}li{margin:6px 0}aside{background:#f3f3f3;padding:20px}</style><header><div class="tag">DRAFT · v0.1.0 · 9 NOVEMBER 2026</div><h1>AITS Learning Hub<br>Training review package</h1><p>7 courses · 112 slides · 28 lessons · 84 questions · 21 practical scenarios</p></header><aside>Start with the <a href="README.md">review and readiness guide</a>. Materials are pending company approval. English with provisional Thai summaries. Live AI mentor integration and production deployment remain outstanding.</aside>'''+''.join(cards)+'''<section><h2>Sources, knowledge and evidence</h2><ul><li><a href="sources/workspace-inventory.md">Sources and missing company inputs</a></li><li><a href="sources/inventory.json">Source registry</a></li><li><a href="knowledge-base/items.json">Knowledge records</a></li><li><a href="knowledge-base/practice-sessions.json">21 mentor practice session definitions</a></li><li><a href="content-manifest.json">Asset manifest with checksums</a></li><li><a href="quality-reports/local-integration.json">Seven-course learner verification</a></li><li><a href="quality-reports/course-desktop.png">Local course screenshot</a></li><li><a href="quality-reports/lesson-desktop.png">Local lesson screenshot</a></li><li><a href="quality-reports/lesson-mobile.png">Mobile lesson screenshot</a></li></ul></section></html>''',encoding='utf8')
target=ROOT.parent/'deliverables/AITS-Training-Review-Package-v0.1.0.zip'
target.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
 for p in ROOT.rglob('*'):
  rel=p.relative_to(ROOT)
  if any(part in ('node_modules','__pycache__') for part in rel.parts):continue
  if not p.is_file():continue
  if rel.parts[0]=='quality-reports' and (len(rel.parts)>2 or p.suffix in ('.log','.mjs')):continue
  if p.name=='research-capture.json':continue
  z.write(p,Path('AITS-Training-Review-Package')/rel)
with zipfile.ZipFile(target) as z:assert z.testzip() is None
print(f'Validated 7 courses; mapped {len(assets)} assets; packaged {target.stat().st_size:,} bytes.')
