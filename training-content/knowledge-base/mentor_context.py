"""Offline reference adapter. Not wired into the live LMS AI provider.
The caller must supply only records already authorized for the current tenant/user.
Never use this filter as a substitute for tenant and role enforcement.
"""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
MISSING_POLICY='I do not have verified AITS information for that internal policy. Please ask HR or the responsible company department for the current approved document.'
def select_context(records,*,company_policy=False,practice=False):
 selected=[]
 for record in records:
  if record.get('approval_status')=='Archived':continue
  if company_policy:
   if record.get('approval_status')!='Approved':continue
   if record.get('source_classification')!='Verified company information':continue
   if record.get('authoritative_company_use') is not True:continue
  elif record.get('approval_status')!='Approved' and not practice:continue
  selected.append(record)
 return selected
def context_for(topic,*,company_policy=False,practice=False):
 records=json.loads((ROOT/'knowledge-base/items.json').read_text(encoding='utf8'))
 matches=[r for r in records if topic.casefold() in (r['topic']+' '+r['question']).casefold()]
 selected=select_context(matches,company_policy=company_policy,practice=practice)
 return {'mode':'company-policy' if company_policy else 'draft-practice' if practice else 'approved-general','items':selected,'message':MISSING_POLICY if company_policy and not selected else 'General educational practice; not an approved AITS procedure.' if practice else 'Use only the cited applicable sources.'}
def practice_session(course_id='AITS-C05',scenario_index=0):
 course=next(c for c in json.loads((ROOT/'curriculum.json').read_text(encoding='utf8'))['courses'] if c['id']==course_id)
 scenario=course['scenarios'][scenario_index]
 return dict(label='General technical training — synthetic scenario; not AITS SOP',scenario=scenario,mentor_instructions=[
  'Present the problem first. Do not reveal the model response or score anchors initially.',
  'Ask what the learner would investigate first and why. Wait for the response.',
  'Respond using only the scenario facts. If the learner asks for unavailable information, say it is unknown; do not invent a test result.',
  'Reveal relevant available information after the learner requests a corresponding check.',
  'Ask follow-up questions about scope, authorization and evidence. Explain why a decision helps or could cause harm.',
  'At the end, compare the response with each rubric criterion. Explain missing steps and the evidence for each score.',
  'State that the score is formative feedback, not an official competency certification.',
  'If asked about internal AITS policy, use only approved company-authoritative context; otherwise state the gap.'
 ],provider_status='Not connected. This package supplies prompts, sources and rubrics; no live AI assessment is claimed.')
if __name__=='__main__':
 print(json.dumps(practice_session(),ensure_ascii=False,indent=2))
