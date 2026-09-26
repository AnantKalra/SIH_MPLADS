# MPLADS Forensic Dashboard: Architect & Presentation Guide

## 1. Project High-Level Overview
**Goal:** A Full-Stack Unsupervised Machine Learning platform built to continuously audit the MPLADS (Member of Parliament Local Area Development Scheme) scheme, automatically flagging financial irregularities, implementation stalls, and systemic anomalies using a dark-mode forensic dashboard.

### Core Architecture
- **Frontend (UI Layer):** React.js + Vite, styled with Tailwind CSS (Glassmorphism aesthetic).
- **Backend (API Layer):** Python FastAPI handling highly concurrent Data streaming and ML Model inference.
- **Machine Learning (Forensic Engine):** Scikit-Learn utilizing an Unsupervised Ensemble algorithm (`Isolation Forest` + `Local Outlier Factor`).
- **GenAI / LLM Integration:** Connected to Groq's high-speed inference engine via `LangChain` to dynamically formulate intelligence summaries on demand.

---

## 2. The Machine Learning Engine (The "Brain")
*You should focus heavily on this code structure during the technical presentation.*

**Why Unsupervised Learning?**
Because fraud and exact delays are often *unlabelled* in government datasets, we cannot reliably use supervised learning (like standard Random Forests) to detect anomalies. We rely on mathematical outliers.

### Data Preprocessing Pipeline
- **Numerical Features** are passed through a `SimpleImputer` (median strategy to survive extreme outliers) and then normalized using a `RobustScaler` (which uses IQR to prevent extreme outliers from skewing the scaling).
- **Categorical Features** are imputed using `most_frequent` and expanded using `OneHotEncoder` so the models can mathematically process categorical tags like State or Vendor.

### The Ensemble Algorithm
We combined two powerful outlier detection algorithms to create the **Ensemble Threat Score**:
1. **Isolation Forest (Global Anomalies):** Works by randomly partitioning the dataset. Anomalous points (fraud, absurd delays) are easier to isolate and require fewer cuts to separate from the normal data. (Focuses on macro-level outliers).
2. **Local Outlier Factor (LOF) (Local Anomalies):** Analyzes the local density deviation of a data point compared with its exact neighbors. E.g., if a project in Kerala is vastly more expensive than *other projects in Kerala*, LOF catches it.

**Score Blending:** Both outputs are pushed into a `MinMaxScaler` and averaged to create a unified `Anomaly_Score_Ensemble`. We flag the top **5%** of scores as critical audits.

---

## 3. Generative AI (LLM) Integration
We integrated an LLM capability using the **LangChain** framework combined with **ChatGroq** (`allam-2-7b` / custom Llama variant).
- **How it works:** When a dashboard analyst clicks "Generate Summary", the React frontend fires an API request to the FastAPI backend.
- The Backend parses all telemetry (Sanctioned Amounts, Disbursed Amounts, State, Risk Flags, Delay Days) into a `ChatPromptTemplate`.
- The LLM streams an intelligent, 3-sentence forensic Palantir-style deduction identifying specifically *why* the financial telemetry looks suspicious, vastly speeding up human auditing.

---
---

## 4. Potential VIVA Questions & High-Score Answers

### Q1: Why did you use `RobustScaler` instead of `StandardScaler`?
**A:** "MPLADS data contains extreme outliers—such as projects with massive cost overruns or years of delay. StandardScaler relies on the mean and variance, which are completely skewed by outliers. RobustScaler uses the median and the Interquartile Range (IQR), making our anomaly detection pipeline immune to skewed distributions."

### Q2: Why did you use an Ensemble of Isolation Forest and LOF? Why not just one?
**A:** "Isolation Forest is exceptionally good at finding *global outliers* (e.g., a project mathematically unlike anything in the country). However, it struggles with local anomalies. Local Outlier Factor (LOF) looks at density—it finds projects that are highly suspicious *relative to their specific region or dataset cluster*. By scaling and averaging both, our Ensemble Score catches both macro-level fraud and micro-level irregularities."

### Q3: How do you handle missing data when a project doesn't have an expenditure listed?
**A:** "Our `ColumnTransformer` pipeline automatically handles this before the ML model sees it. Numerical gaps are patched with the median value of that column (to avoid skewing the density), and categorical gaps are patched with the most frequent value."

### Q4: Which model detects categorical anomalies (like a weird vendor)?
**A:** "By pushing categorical strings through our `OneHotEncoder`, they are converted into a sparse matrix of 1s and 0s. The Isolation Forest algorithm then treats these as standard mathematical dimensions, allowing it to easily isolate a project if its specific combination of vendor, state, and cost is completely unprecedented."

### Q5: How is your React Frontend communicating with the Machine learning backend?
**A:** "We fully decoupled the stack. The backend is a Python FastAPI server that serves ML predictions and dataset pages over RESTful JSON endpoints. Our React frontend retrieves this data asynchronously using standard `axios/fetch` hooks, ensuring the UI remains highly responsive even when querying thousands of data rows."

### Q6: What does the LLM "Generate Summary" feature actually do mathematically?
**A:** "It acts as a translation layer. Our Ensemble ML outputs raw telemetry (like an Anomaly score of 0.92, Delay of 400 days). We inject that raw JSON state strictly into a LangChain Prompt Template. The LLM (powered by Groq for zero-latency inference) synthesizes those disconnected mathematical metrics into a human-readable forensic summary."

### Q7: If I want to update the dataset tomorrow, do I have to change the code?
**A:** "No. Our Python backend uses dynamic Data Loaders and Pandas aggregations. You simply drop the new datasets into the project folder, and the anomaly detector will organically parse, scale, and analyze the fresh CSVs on boot."

### Q8: What percentage of projects do you flag, and how did you determine that threshold?
**A:** "We use a mathematically strict threshold, slicing exactly at the 95th percentile using NumPy (`np.percentile(ensemble_scores, 95)`). This guarantees that only the absolutely most mathematically extreme 5% of projects are pushed to the top of the Priority Dashboard to prevent alarm fatigue for the auditors."

---

*Good luck with the presentation! Speak confidently, mention the words "Unsupervised Ensemble Architecture" and "Interquartile Range" to impress the judges.*
