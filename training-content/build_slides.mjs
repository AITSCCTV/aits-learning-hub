import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
const root=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1'));
const skill='C:/Users/pshka/.codex/plugins/cache/openai-primary-runtime/presentations/26.1104.22356/skills/presentations';
const runtime='C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1104-2876-0_26.1104.2876.0_x64__3k8sg7r9htsxt/dependencies';
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const data=JSON.parse(await fs.readFile(path.join(root,'curriculum.json'),'utf8'));
const refs=JSON.parse(await fs.readFile(path.join(root,'sources/inventory.json'),'utf8'));
const only=process.argv[2];
function text(s,value,x,y,w,h,size=28,color='#000000',bold=false){const t=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});t.text=value;t.text.style={typeface:'Arial',fontSize:size,color,bold};return t;}
for(const c of data.courses.filter(c=>!only||c.id===only)){
 const p=Presentation.create({slideSize:{width:1280,height:720}});const out=path.join(root,c.folder,'presentation');const qa=path.join(root,'quality-reports',c.id,'slides');await fs.mkdir(out,{recursive:true});await fs.mkdir(qa,{recursive:true});
 function slide(title,notes=''){const s=p.slides.add();s.background.fill='#FFFFFF';text(s,title,60,46,1160,110,40,'#000000',true);text(s,`${c.id} | v0.1.0 | Draft — pending company approval | ${p.slides.items.length}`,60,663,1160,30,17,'#555555');s.speakerNotes.text=notes+'\nMetadata: '+JSON.stringify(c.metadata)+'\nSources:\n'+refs.filter(r=>c.metadata.source_references.includes(r.id)).map(r=>`${r.id}: ${r.title}; ${r.publication_or_access}; ${r.url_or_path}`).join('\n');return s;}
 let s=slide('');s.background.fill='#000000';text(s,'AITS LEARNING HUB',60,54,1000,45,25,'#FFFFFF');text(s,c.title,60,180,1120,190,58,'#FFFFFF',true);text(s,'Learn the concept. Practise a decision. Explain your reasoning.',60,420,1100,90,29,'#FFFFFF');text(s,'Sample content — company review required',60,570,1100,50,25,'#FF7777');
 s=slide('What you will be able to do');c.objectives.forEach((v,i)=>{text(s,String(i+1).padStart(2,'0'),60,180+i*100,65,50,32,'#C53130',true);text(s,v,150,180+i*100,1050,78,29);});
 for(const l of c.lessons){
  s=slide(l.title,l.explanation.join('\n\n')+'\nThai summary (AI draft): '+l.thai_summary);l.key_points.forEach((v,i)=>{text(s,String(i+1),65,195+i*120,55,50,35,'#C53130',true);text(s,v,145,195+i*120,1050,95,34);});
  s=slide('Try it: '+l.title,l.example+'\nModel response: '+l.model_response);text(s,'SYNTHETIC EXAMPLE',60,175,530,35,19,'#C53130',true);text(s,l.example,60,225,530,285,29);text(s,'YOUR TASK',680,175,530,35,19,'#C53130',true);text(s,l.exercise,680,225,530,285,29);text(s,'Discuss your reasoning before checking the workbook response.',60,570,1140,65,24,'#555555');
 }
 s=slide('Follow the learning workflow','Original editable diagram. General model, not a company-approved SOP.');const nodes=c.flow.map((v,i)=>{const sh=s.shapes.add({geometry:'rect',position:{left:55+i*245,top:245,width:205,height:160},fill:'#F5F5F5',line:{fill:'#C53130',width:2}});sh.text=v;sh.text.style={typeface:'Arial',fontSize:25,color:'#000000'};return sh;});for(let i=0;i<4;i++)s.shapes.connect(nodes[i],nodes[i+1],{kind:'straight',fromSide:'right',toSide:'left',line:{fill:'#000000',width:2},tail:{type:'triangle'}});text(s,'Use the applicable approved procedure for real work.',60,515,1150,80,29);
 for(const scenario of c.scenarios){s=slide(scenario.title,JSON.stringify(scenario));text(s,scenario.problem_description,60,175,1150,100,32);text(s,'Available information',60,310,520,45,24,'#C53130',true);text(s,scenario.available_information.join(' '),60,365,520,210,27);text(s,'Explain your decision',680,310,530,45,24,'#C53130',true);text(s,'What do you check first?\nWhat needs authorization?\nWhat evidence do you hand over?',680,365,530,210,28);}
 s=slide('Knowledge check','Answers: '+c.assessments.slice(0,3).map(q=>q.correct_answer+' — '+q.explanation).join('\n'));c.assessments.slice(0,3).forEach((q,i)=>text(s,`${i+1}. ${q.question}`,60,185+i*135,1130,110,31));
 s=slide('Take the next step');text(s,'Complete the workbook exercise and course quiz.',60,190,1140,80,35);text(s,'Check sources, version and approval before using a document.',60,315,1140,100,35);text(s,'A practice score is feedback. It does not certify competence or authorize live work.',60,465,1140,120,32,'#C53130');
 const candidate=path.join(qa,'candidate.pptx');await(await PresentationFile.exportPptx(p)).save(candidate);
 for(let i=0;i<p.slides.items.length;i++){const b=await p.export({slide:p.slides.items[i],format:'png',scale:1});await fs.writeFile(path.join(qa,`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await b.arrayBuffer()));}
 const final=path.join(out,'training-presentation.pptx');
 const result=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:final,pythonExecutable:path.join(runtime,'python/python.exe'),integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],explicitTotalSlideCount:16,fontPolicy:{basis:'design',families:['Arial']},verifyArtifactToolImport:true,receiptPath:path.join(qa,'validation.json')});
 console.log(c.id,JSON.stringify(result));
}

