# Smart India Hackathon: Final Project Report
**Project Title:** MPLADSGuard - AI-Driven Forensic Auditing System  
**Category:** Software / Data Analytics  
**Target Stakeholders:** MoSPI, District Authorities, Audit Bodies, and Citizens  

---

## 1. Executive Summary
The Members of Parliament Local Area Development Scheme (MPLADS) is a cornerstone of decentralized public infrastructure development in India. However, managing the sheer scale of the scheme—involving tens of thousands of projects—strains traditional monitoring frameworks. 

**MPLADSGuard** (Team Cybatics) is a proactive, data-driven intelligence dashboard designed to revolutionize the auditing of these public funds. By integrating a meticulously designed Dual Machine Learning Engine with Generative AI (LLMs), the system automates the heavily manual process of anomaly detection. It autonomously flags high-risk projects, evaluates stalled development vectors, and generates read-out summaries for auditors, ultimately narrowing the manual review queue by approximately 94% while retaining human oversight authority.

## 2. Introduction & Background
### 2.1 Context of the MPLADS Scheme
Under MPLADS, each Member of Parliament is allocated ₹5 Crore annually to execute local infrastructural works such as roads, schools, health clinics, and sanitation facilities. While the objective is to promote localized growth, the execution spans across multiple autonomous implementing agencies, District Authorities, and nodal ministries.

### 2.2 Scope of the Problem
The current operational framework faces critical limitations:
* **Massive Scale & Fragmentation:** Over 78,700 active projects are processed, but their tracking data is dispersed across disjointed portals. 
* **Reactive Error Detection:** Authorities typically investigate systemic delays or cost inflations only *after* funds are depleted or physical complaints are lodged by citizens.
* **Interpretation Bottleneck:** Tabular financial data lacks qualitative context. Figuring out why a specific project was flagged takes hours of manual document review.

## 3. The Proposed Solution: MPLADSGuard
To bridge the gap between raw data collection and actionable intelligence, we developed a system capable of analyzing unstructured and tabular data at runtime. 

MPLADSGuard acts as a "smart sieve." Instead of presenting an auditor with a static list of 78,000 projects, it applies algorithmic scoring to bubble the top ~4,700 high-priority projects to the surface. It provides interactive, geospatial drill-downs (State > District > Constituency level) and explicitly documents the mathematical reasoning behind every flag.

## 4. System Architecture & Technology Stack
The platform is built on an enterprise-grade stack, designed modularly to support both the constraints of a rapid hackathon prototype and the rigor of a nationwide deployment.

### 4.1 Client Layer (Frontend)
Developed using **React, Vite, and Tailwind CSS**.
Government portals are historically plagued by poor UX. We actively broke this mold by implementing a premium, glassmorphic "dark-mode" intelligence dashboard. This includes 3D tilt cards, dynamic state management, and real-time interactive priority queues. It reduces cognitive load for auditors reviewing complex financial data.

### 4.2 Application Layer (Backend API)
Powered by **FastAPI (Python)**.
The backend serves as a high-throughput RESTful API broker. It connects the frontend request layer directly to the ML inference engine. FastAPI’s asynchronous capabilities ensure that complex multi-variable filtering does not block the event loop.

### 4.3 Data Layer & The Role of PostgreSQL
* **The Rapid Prototype Phase:** For the scope of the hackathon demonstration, our backend utilizes an intelligently cached, in-memory data loader via **Pandas**. Since the current dataset stands at ~78,000 projects, utilizing in-memory DataFrames allows for lightning-fast sub-second filtering and sorting metrics specifically for the presentation.
* **The Production Deployment Phase (*If and Only If Required at Scale*):** While CSV memory loading is highly efficient for a 78k row dataset, it is not ACID-compliant. If this system is deployed by MoSPI where concurrent auditors from 700+ districts are writing updates, appending new project milestones, and changing statuses simultaneously, an in-memory solution will immediately fail. Therefore, the architectural blueprint strictly utilizes **PostgreSQL** as the primary relational database. PostgreSQL ensures concurrent access safety, strict relationship structures between expenditures and sanctioned funds, and seamless JSONB querying capabilities for metadata. 

## 5. Machine Learning Methodology: The Dual Engine
A core innovation of our solution is recognizing that one model cannot solve two fundamentally different problems. We implemented a **Signal Fusion Engine** dividing the workload:

### 5.1 Supervised Engine (Random Forest) for Stall Prediction
* **Objective:** Predict the likelihood of a project facing systemic execution delays.
* **Approach:** Utilizing historical data showing completion timelines, sanction delays, and disbursement gaps, a supervised Random Forest classifier was trained. This model effectively captures non-linear relationships, such as how long sanction delays correlate with eventual project abandonment.

### 5.2 Unsupervised Engine (Isolation Forest + LOF) for Financial Anomalies
* **Objective:** Detect unusual financial behavior or suspicious spending.
* **Approach:** "Fraud" is rarely explicitly labeled in raw government data. Hence, an unsupervised approach was necessary. By combining Isolation Forest (finding globally isolated data points) with Local Outlier Factor (LOF; finding local density deviations), the system detects projects that stray significantly from standard expenditure patterns, even if they aren't explicitly flagged as "failed."

### 5.3 Risk Scoring (0-100 Scale)
The outputs of both the supervised stall probability and the unsupervised anomaly likelihood are fused mathematically. The system generates an overarching "Ensemble Risk Score" from 0 to 100, which actively determines the project's position in the auditor's Priority Queue.

## 6. Generative AI for Forensic Summarization
A major hurdle in traditional ML is a lack of interpretability (the "black box" problem). 

To solve this, MPLADSGuard features an integrated Generative AI microservice using **LangChain** and **Groq** hardware infrastructure (leveraging models like Llama-3/Allam-2). When an auditor selects a high-risk project, the system injects the localized tabular anomalies into a finely-tuned LLM prompt. In less than 1.5 seconds, the AI outputs a professional, highly readable "Forensic Summary" explicitly detailing *why* the project was flagged—transitioning pure mathematics into plain English.

## 7. Implementation Scalability & Analytics
* **Massive Workload Reduction:** The system successfully identifies anomalies and targets ~6% of the dataset, successfully reducing the human review queue by over **94%**.
* **High-Throughput Processing:** The internal pipeline is capable of ingesting, executing dual-model inference, and ranking over 78,000 project records in **under 10 seconds** on standard computational hardware.

## 8. Stakeholder Value & Feasibility (Triple Bottom Line)
1. **Economic:** By identifying leakages and unblocking stalled funds, the system optimizes the capital efficiency of public tax infrastructure.
2. **Social:** Accelerating the delivery of critical public resources directly improves the health, safety, and education of rural and urban citizens.
3. **Environmental / Strategic:** The system requires **zero paper**. Furthermore, it utilizes existing fragmentation data currently sitting unused in MoSPI portals; the solution requires no new national surveys or environmentally costly data drives.

## 9. Conclusion
MPLADSGuard embraces the philosophy that **Anomaly ≠ Fraud**. The system is not designed to unilaterally punish or accuse implementing agencies. Instead, it respects the "Human-in-the-Loop" doctrine. The AI acts as a sophisticated, tireless investigative assistant that organizes the haystack, points directly to the needle, and provides the algorithmic evidence—but the final judgment rightfully remains in the hands of authorized government officials.  
