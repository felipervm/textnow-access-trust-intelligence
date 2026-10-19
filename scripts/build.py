from pathlib import Path
import random,csv,json
from collections import Counter
R=Path(__file__).resolve().parents[1]; random.seed(20261019)
N=2400
platforms=['Android','iOS','Web']; cohorts=['New','Returning']; paths=['CAPTCHA','Identity check','No challenge']; outcomes=['Verified','Retry needed','Support recovery','Not completed']
rows=[]
for i in range(N):
 p=random.choices(platforms,[47,37,16])[0]; cohort=random.choices(cohorts,[43,57])[0]
 path=random.choices(paths,[43,19,38])[0]
 if path=='No challenge': probs=[.94,.03,.01,.02]
 elif path=='CAPTCHA': probs=[.77,.12,.04,.07]
 else: probs=[.69,.14,.08,.09]
 outcome=random.choices(outcomes,probs)[0]
 # This variable is fictional simulation ground truth; not identifiable in real production data.
 simulated_legitimate=random.random()<(0.96 if path=='No challenge' else .91 if path=='CAPTCHA' else .84)
 if not simulated_legitimate and outcome=='Support recovery': outcome='Not completed'
 retry= random.randint(1,3) if outcome in ['Retry needed','Support recovery'] else 0
 resolved_minutes=random.randint(5,90) if outcome=='Support recovery' else 0
 retained=(random.random() < (.82 if outcome=='Verified' else .64 if outcome=='Support recovery' else .48 if outcome=='Retry needed' else .17))
 rows.append({'session_id':f'TN-{i+1:04d}','platform':p,'cohort':cohort,'verification_path':path,'outcome':outcome,'simulated_legitimate':int(simulated_legitimate),'retry_count':retry,'support_resolution_minutes':resolved_minutes,'day7_return':int(retained)})
with (R/'data'/'simulated_sessions.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=rows[0].keys());w.writeheader();w.writerows(rows)
summary={'total':N,'outcomes':dict(Counter(r['outcome'] for r in rows)),'paths':dict(Counter(r['verification_path'] for r in rows)),'legitimate_total':sum(r['simulated_legitimate'] for r in rows),'legitimate_noncompleted':sum(r['simulated_legitimate'] and r['outcome']=='Not completed' for r in rows),'safety_note':'Synthetic labels are fictional and would require careful validation in real data.'}
(R/'data'/'summary.json').write_text(json.dumps(summary,indent=2));print(summary)
