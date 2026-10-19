import csv,unittest
from pathlib import Path
P=Path(__file__).resolve().parents[1]
rows=list(csv.DictReader((P/'data'/'simulated_sessions.csv').open()))
class ModelTest(unittest.TestCase):
 def test_count(self):self.assertEqual(len(rows),2400)
 def test_unique(self):self.assertEqual(len(set(r['session_id'] for r in rows)),2400)
 def test_outcomes(self):self.assertTrue(set(r['outcome'] for r in rows)<={'Verified','Retry needed','Support recovery','Not completed'})
 def test_labels(self):self.assertTrue(all(r['simulated_legitimate'] in ['0','1'] for r in rows))
 def test_return(self):self.assertTrue(all(r['day7_return'] in ['0','1'] for r in rows))
 def test_recovery(self):self.assertTrue(all(int(r['support_resolution_minutes'])>=0 for r in rows))
 def test_paths(self):self.assertEqual(set(r['verification_path'] for r in rows),{'CAPTCHA','Identity check','No challenge'})
if __name__=='__main__':unittest.main()
