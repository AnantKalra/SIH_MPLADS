# SIH Prototype Video Script: Cybatics - MPLADS Intelligence Dashboard

**Target Length:** 3 - 4 Minutes
**Format:** Screen recording of the web dashboard with a voiceover. 
**Pro-Tip:** Speak confidently, maintain a good pace, and use your mouse cursor to point at exactly what you are describing on the screen.

---

## 🕒 0:00 - 0:30 | The Hook & Problem Statement
*(Screen showing the Home/Login page of your dashboard)*

**Speaker:** 
"Hello everyone! We are Team Cybatics, and our solution tackles the critical challenge of auditing and monitoring the Member of Parliament Local Area Development Scheme (MPLADS). 

With thousands of projects sanctioned nationwide, detecting financial anomalies, unusual spending patterns, and stalled projects manually is nearly impossible. To solve this, we have built a comprehensive, AI-driven forensic auditing dashboard that transforms raw government data into actionable intelligence."

---

## 🕒 0:30 - 1:00 | System Architecture overview & The UI
*(Log in to the dashboard. Show the main dashboard view with the glassmorphic design and summary stats)*

**Speaker:** 
"Welcome to the MPLADS Intelligence Dashboard. We’ve designed a highly intuitive, premium glassmorphic interface using **React** and **Tailwind CSS**. 

But beneath this beautiful UI lies a robust and highly scalable architecture. Our backend is powered by **FastAPI**, and for enterprise-grade data management, we utilize **PostgreSQL** as our core database. This ensures high performance, data integrity, and the ability to handle millions of expenditure records concurrently."

---

## 🕒 1:00 - 1:45 | Core Feature: Risk Prioritization & Dual ML Engine
*(Navigate to the 'Projects' or 'Risk View' tab where projects are ranked by risk score)*

**Speaker:** 
"To address the core problem statement, we developed a powerful 5-stage AI pipeline. What you see here is our **Risk Prioritization Engine**. 

Instead of humans searching for fraud, our system flags high-risk projects automatically. Behind the scenes, we use a **Dual ML Engine**:
1. First, a **Random Forest** model classifies the likelihood of a project being stalled based on historical timelines.
2. Second, we use an **Isolation Forest combined with Local Outlier Factor (LOF)** to detect unusual spending patterns and financial anomalies.

Through Signal Fusion, these models generate a final 'Risk Score'. As you can see, project PRJ-271698 has a critical Risk Score of 92, immediately prioritizing it for human review."

---

## 🕒 1:45 - 2:30 | Deep Dive & Additional Feature: Generative AI Summaries
*(Click on a high-risk project to open its detailed view/tilt cards. Scroll through the details).*

**Speaker:** 
"Let's click into this high-risk project to investigate. Here, an auditor can see all the raw evidence—sanctioned amounts versus actual expenditure, and the physical progress reports. 

But to make the auditor's life even easier, we integrated an advanced Generative AI feature. Using **LangChain** and **Groq’s** ultra-fast inference, our system generates an instant, easy-to-read **Forensic Summary** of the project. It explicitly tells the auditor *why* the project was flagged—for example, a massive cost overrun combined with zero physical progress over six months. This takes data interpretation from hours down to seconds."

---

## 🕒 2:30 - 3:00 | Conclusion: Human-in-the-Loop & Impact
*(Show the 'Human Verification' section where an auditor can approve, reject, or request an inquiry).*

**Speaker:** 
"Crucially, our system embraces a **'Human-in-the-Loop'** philosophy. Our AI acts as a sophisticated assistant that sifts through the noise to find the evidence, but the final decision always rests with the government authorities. 

By combining PostgreSQL for scalable data management, a dual ML engine for precise anomaly detection, and LLMs for instant reporting, our prototype successfully modernizes MPLADS monitoring. It ensures transparency, prevents fund leakage, and ultimately accelerates national development. 

Thank you."
