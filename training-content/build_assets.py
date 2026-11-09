"""Build editable review manuals and original SVG/PNG learning diagrams."""
import json, textwrap, html
from pathlib import Path
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).parent
data=json.loads((ROOT/'curriculum.json').read_text(encoding='utf8'))
sources={x['id']:x for x in json.loads((ROOT/'sources/inventory.json').read_text(encoding='utf8'))}
FONT=Path('C:/Windows/Fonts/arial.ttf')
RED='C53130'
def svg(c):
 p=ROOT/c['folder']/'infographics';p.mkdir(parents=True,exist_ok=True)
 labels=c['flow'];title=c['title'];sub='General educational model — not an approved AITS procedure'
 out=['<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="450" viewBox="0 0 1400 450" role="img">',f'<title>{html.escape(title)} learning workflow</title><rect width="1400" height="450" fill="white"/>',f'<text x="45" y="65" font-family="Arial" font-size="32" font-weight="bold">{html.escape(title)}</text>',f'<text x="45" y="108" font-family="Arial" font-size="21" fill="#555">{html.escape(sub)}</text>']
 im=Image.new('RGB',(1400,450),'white');d=ImageDraw.Draw(im);f=ImageFont.truetype(str(FONT),26);small=ImageFont.truetype(str(FONT),21);bold=ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf',32)
 d.text((45,32),title,font=bold,fill='black');d.text((45,85),sub,font=small,fill='#555555')
 for i,label in enumerate(labels):
  x=45+i*270;out.append(f'<rect x="{x}" y="165" width="230" height="155" rx="8" fill="#F5F5F5" stroke="#{RED}" stroke-width="3"/>');d.rounded_rectangle((x,165,x+230,320),8,fill='#F5F5F5',outline='#'+RED,width=3)
  out.append(f'<text x="{x+18}" y="200" font-family="Arial" font-size="22" fill="#{RED}">{i+1:02}</text>');d.text((x+18,175),f'{i+1:02}',font=small,fill='#'+RED)
  for j,line in enumerate(textwrap.wrap(label,17)):
   out.append(f'<text x="{x+18}" y="{245+j*32}" font-family="Arial" font-size="26">{html.escape(line)}</text>');d.text((x+18,218+j*32),line,font=f,fill='black')
  if i<4:
   out.append(f'<path d="M{x+235} 242 H{x+260} l-9 -7 m9 7 l-9 7" fill="none" stroke="black" stroke-width="3"/>');d.line((x+237,242,x+260,242),fill='black',width=3);d.line((x+251,235,x+260,242,x+251,249),fill='black',width=3)
 out.append(f'<text x="45" y="405" font-family="Arial" font-size="20" fill="#555">{c["id"]} | v0.1.0 | Draft | 2026-11-09 | Original diagram</text></svg>');d.text((45,380),f'{c["id"]} | v0.1.0 | Draft | 2026-11-09 | Original diagram',font=small,fill='#555555')
 (p/'workflow.svg').write_text(''.join(out),encoding='utf8');im.save(p/'workflow.png')
def para(doc,text,style=None):
 p=doc.add_paragraph(text,style);p.paragraph_format.space_after=Pt(7);return p
def heading(doc,text):doc.add_heading(text,1)
def clean_style(doc):
 for element in list(doc.styles.element.iter()):
  if element.tag==qn('w:pBdr'):element.getparent().remove(element)
 for table in doc.tables:
  for row in table.rows:
   for cell in row.cells:
    pr=cell._tc.get_or_add_tcPr();shade=OxmlElement('w:shd');shade.set(qn('w:fill'),'F2F2F2');pr.append(shade)
def manual(c):
 doc=Document();sec=doc.sections[0];sec.top_margin=sec.bottom_margin=Inches(.65);sec.left_margin=sec.right_margin=Inches(.75)
 for name in ['Normal','Title','Heading 1','Heading 2']:
  st=doc.styles[name];st.font.name='Arial';st.font.color.rgb=RGBColor(0,0,0);st.font.size=Pt(11 if name=='Normal' else 25 if name=='Title' else 17 if name=='Heading 1' else 13)
  st.paragraph_format.space_after=Pt(8)
  st.element.get_or_add_rPr().append(OxmlElement('w:rFonts'))
 doc.core_properties.title=c['title'];doc.core_properties.author='AITS training content draft';doc.core_properties.subject='Company review required; version 0.1.0'
 doc.add_paragraph(c['title'].replace('&','and'),'Title');para(doc,'AITS Learning Hub training manual and practice workbook')
 para(doc,'Sample Content — Pending Company Approval').runs[0].font.color.rgb=RGBColor.from_string(RED)
 para(doc,'This course introduces the concepts below and gives you exercises to practise them. Use the source notes to distinguish public company information, general guidance and fictional examples. It does not authorize live work or establish internal policy.')
 t=doc.add_table(rows=0,cols=2);t.style='Light Shading Accent 1'
 for key,value in [('Document ID',c['id']+'-MANUAL'),('Version and status','0.1.0 / Draft'),('Created and updated','2026-11-09'),('Audience',', '.join(c['roles'])),('Reviewer','Company to designate'),('Author','AI-assisted instructional draft'),('Classification','Mixed; see lesson references and example labels'),('Duration','About 100 minutes including exercises'),('Language','English; Thai summaries pending native-speaker review')]:
  cells=t.add_row().cells;cells[0].text=key;cells[1].text=value
 heading(doc,'Learning objectives')
 for o in c['objectives']:para(doc,o,'List Bullet')
 doc.add_picture(str(ROOT/c['folder']/'infographics/workflow.png'),width=Inches(6.7))
 for l in c['lessons']:
  doc.add_page_break();heading(doc,l['title']);para(doc,l['id']+' | 15 minutes | Draft')
  para(doc,'Objective: '+l['objectives'][0]);para(doc,'Prerequisites: '+(', '.join(l['prerequisites']) or 'None'))
  for p in l['explanation']:para(doc,p)
  doc.add_heading('Worked example',2);para(doc,l['example'])
  doc.add_heading('Try it',2);para(doc,l['exercise']);para(doc,'Your response: __________________________________________________')
  doc.add_heading('Compare your reasoning',2);para(doc,l['model_response'])
  doc.add_heading('Remember',2);para(doc,l['summary'])
  para(doc,'Thai summary (AI translation, not professionally reviewed): '+l['thai_summary'])
  para(doc,'References: '+', '.join(l['references'])+'. See source register.').runs[0].font.size=Pt(9)
 doc.add_page_break();heading(doc,'Practical scenarios')
 for s in c['scenarios']:
  doc.add_heading(s['title'],2);para(doc,s['context']+' Role: '+s['employee_role'])
  para(doc,s['problem_description']+' '+s['available_information'][0]);para(doc,'Decide: '+' '.join(s['decision_points']))
  para(doc,'Appropriate: '+s['appropriate_decisions'][0]);para(doc,'Inappropriate: '+s['inappropriate_decisions'][0]);para(doc,'Consequence: '+s['consequences'])
 para(doc,'Use the full scenario JSON for the four-criterion rubric. Score evidence, decision quality, authority/safety and handover from 0–2 each. 0 = absent or unsafe; 1 = partial; 2 = complete and supported. Scores are formative, not certification.')
 for start in (0,6):
  doc.add_page_break();heading(doc,'Knowledge check' if start==0 else 'Knowledge check continued')
  for idx,q in enumerate(c['assessments'][start:start+6],start+1):
   para(doc,f'{idx}. {q["question"]}')
   para(doc,'  |  '.join(f'{chr(65+i)}. {v}' for i,v in enumerate(q['choices'])))
  para(doc,'Use the answer key after attempting the questions. Proposed practice pass mark: 80%. This is not an AITS competency rule.')
 doc.add_page_break();heading(doc,'Answer key and references')
 for i,q in enumerate(c['assessments'],1):
  para(doc,f'{i}. {chr(65+q["choices"].index(q["correct_answer"]))} — {q["explanation"]}').runs[0].font.size=Pt(9)
 for key in c['metadata']['source_references']:
  s=sources[key];para(doc,f'{key}: {s["title"]}. {s["publication_or_access"]}. {s["url_or_path"]}').runs[0].font.size=Pt(8)
 p=ROOT/c['folder']/'documents';p.mkdir(parents=True,exist_ok=True);clean_style(doc);doc.save(p/'training-manual.docx')
def templates():
 names=[('Technician troubleshooting',['Confirm safe access and diagnostic permission','Record symptom, scope, start time and recent changes','Gather read-only observations and compare a known-good path','Obtain authorization for any change and preserve rollback','Record result, open issues and escalation']),('Equipment installation preparation',['Confirm approved scope and current device documentation','Reconcile models, quantities and compatible accessories','Check site permissions and competent risk assessment','Confirm access, power design and cable route review','Record readiness and unresolved conditions before work']),('Customer support',['Confirm the request and authorized contact channel','Record impact and distinguish statements from verified facts','Clarify desired outcome without promising unapproved terms','Route to the authorized responsible function','Record agreed update and handover status']),('Administrative data handling',['Confirm purpose and required minimum data','Check recipient authority and approved storage location','Verify accuracy, classification and version','Transfer through the approved protected channel','Follow confirmed retention and incident-reporting rules']),('Work completion reporting',['Compare work with approved scope','Record test methods and actual results','List not-tested items, defects and deviations','Obtain authorized disposition and handover review','Store the controlled completion record'])]
 out=[]
 for i,(name,steps) in enumerate(names,1):
  out.append(dict(document_id=f'AITS-C07-SOP{i:02}',course_id='AITS-C07',title=name,version='0.1.0',created_date='2026-11-09',last_updated_date='2026-11-09',author_source='Original generic training template',information_classification='Draft procedures awaiting approval',approval_status='Draft',responsible_reviewer='Company to designate',source_references=['QA','EX'],scope='Training template only; company must define applicability',prerequisites='Company-approved scope, competent personnel, authorized access and applicable risk controls',steps=steps,stop_conditions='Unsafe condition, missing authorization, conflicting instructions or insufficient evidence',evidence_fields=['Task reference','Date/time','Applicable procedure version','Observation/test','Actual result','Deviation','Authorized disposition','Reviewer'],approval_fields=['Owner','Reviewer','Approval date','Effective date','Next review date'],warning='Not an approved AITS SOP. Do not use to authorize live work.'))
 (ROOT/'course-07-sop-quality/documents/draft-sop-templates.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
 # Editable templates are included in a separate document so company reviewers can revise them.
 doc=Document();doc.styles['Normal'].font.name='Arial';doc.styles['Normal'].font.size=Pt(11)
 for i,s in enumerate(out):
  if i:doc.add_page_break()
  doc.add_paragraph(s['title'],'Title');para(doc,s['document_id']+' | v0.1.0 | Draft | 2026-11-09');para(doc,s['warning']);heading(doc,'Scope and prerequisites');para(doc,s['scope']);para(doc,s['prerequisites']);heading(doc,'Proposed steps')
  for step in s['steps']:para(doc,step,'List Number')
  heading(doc,'Stop and escalate');para(doc,s['stop_conditions']);heading(doc,'Evidence and approval');para(doc,'Evidence: '+', '.join(s['evidence_fields']));para(doc,'Company to complete: '+', '.join(s['approval_fields']));para(doc,'Author: AI-assisted generic draft. Sources: ISO quality assurance overview and original examples. No company reviewer assigned.')
 clean_style(doc);doc.save(ROOT/'course-07-sop-quality/documents/draft-sop-templates.docx')
for c in data['courses']:svg(c);manual(c)
templates()
print('Built 8 editable Word documents and 7 SVG/PNG workflow pairs.')
