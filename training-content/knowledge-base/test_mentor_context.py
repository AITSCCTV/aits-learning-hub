import unittest
from mentor_context import select_context,context_for,practice_session
class ContextTests(unittest.TestCase):
 def test_draft_never_company_policy(self):
  r={'approval_status':'Draft','source_classification':'Verified company information','authoritative_company_use':True}
  self.assertEqual(select_context([r],company_policy=True,practice=True),[])
 def test_general_approval_does_not_create_company_policy(self):
  r={'approval_status':'Approved','source_classification':'General industry knowledge','authoritative_company_use':True}
  self.assertEqual(select_context([r],company_policy=True),[])
 def test_approved_company_requires_explicit_authority(self):
  r={'approval_status':'Approved','source_classification':'Verified company information','authoritative_company_use':False}
  self.assertEqual(select_context([r],company_policy=True),[])
  r['authoritative_company_use']=True;self.assertEqual(select_context([r],company_policy=True),[r])
 def test_archived_excluded_even_in_practice(self):
  self.assertEqual(select_context([{'approval_status':'Archived'}],practice=True),[])
 def test_missing_policy_is_explicit(self):
  self.assertIn('do not have verified',context_for('travel allowance',company_policy=True)['message'])
 def test_practice_contains_rubric_and_provider_boundary(self):
  p=practice_session();self.assertEqual(len(p['scenario']['evaluation_rubric']),4);self.assertIn('Not connected',p['provider_status'])
if __name__=='__main__':unittest.main()
