# TextNow / Access & Trust Intelligence

**An independent, research-led analytical case by Felipe Mattos.** No affiliation with TextNow.

## Hypothesis
How might a communication platform make security-related access friction visible, *without weakening fraud and abuse defenses*? This is not a verified TextNow product gap. TextNow already offers identity verification, CAPTCHA, and account recovery; this exercise explores measurement and product decision-making.

## What is included
- Editorial purple/white landing page, fully static GitHub Pages-ready.
- 2,400 reproducible fictional journeys, segmented by device and verification route.
- Interaction: selectors recompute every metric from one CSV.
- Synthetic fields include intentionally fictional `simulated_legitimate` labels. In production such labels are **not known ground truth**; they would require privacy-aware validation/proxies and coordination with Trust & Safety.
- Seven basic dataset quality tests.
- Suggested methodology with safety guardrails, falsification checks, and real-user protection.

## Build / test
```bash
python scripts/build.py
python -m unittest discover -s tests -v
python -m http.server 8000
```
Open http://localhost:8000. Do not open the HTML directly with `file://`: browser CORS restrictions may block CSV fetch.

## Sources (TextNow official)
- [CAPTCHA login troubleshooting](https://help.textnow.com/hc/en-us/articles/21085362250903-Press-and-Hold-CAPTCHA-login-issues)
- [Persona identity verification](https://help.textnow.com/hc/en-us/articles/20680179506967-Verifying-your-identity-with-Persona)
- [Account restrictions / Terms of Use](https://help.textnow.com/hc/en-us/articles/360043086894-Help-I-Got-a-Terms-of-Use-Error)
- [Account login troubleshooting](https://help.textnow.com/hc/en-us/articles/360043602573-Help-I-Can-t-Login-to-my-Account)
- [TextNow culture manual (Derek Ting)](https://static.textnow.com/press/TextNow_Culture_Manual.pdf)

## Limits / ethics
No real user records, fraud labels, company retention metrics, internal decision rules or revenue data were used. The simulated outcomes should not be interpreted as customer friction incidence. The proposal **does not recommend bypassing or reducing account security checks**. A real pilot needs review for privacy, fairness, abuse prevention and false-positive monitoring.

## Contact
Felipe Mattos · [LinkedIn](https://www.linkedin.com/in/felipervm) · felipervm22@gmail.com
