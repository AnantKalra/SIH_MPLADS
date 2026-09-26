from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ml_engine import MLEngine
from data_loader import DataLoader
from models import DashboardStats, PaginatedResponse, ProjectDetail
import uvicorn

app = FastAPI(title="MPLADS Guard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

ml_engine = MLEngine()
data_loader = DataLoader(ml_engine)

@app.get("/api/stats", response_model=DashboardStats)
def get_stats():
    return data_loader.get_stats()

from typing import Optional

@app.get("/api/projects", response_model=PaginatedResponse)
def get_projects(page: int = 1, limit: int = 20, sort_by: str = "risk_score", 
                 state: Optional[str] = None, status: Optional[str] = None, 
                 risk: Optional[str] = None,
                 min_amount: Optional[int] = None, max_amount: Optional[int] = None):
    records, total = data_loader.get_projects(
        page=page, limit=limit, sort_by=sort_by, sort_asc=False,
        state=state, status=status, risk=risk, min_amount=min_amount, max_amount=max_amount
    )
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "data": records
    }

@app.get("/api/projects/search")
def search_projects(q: str):
    return data_loader.search_projects(q)

@app.post("/api/predict")
def predict_new(project_data: dict):
    return ml_engine.predict(project_data)

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="allam-2-7b")

prompt_template = ChatPromptTemplate.from_messages([
    ("system", "You are an expert fraud and compliance auditing AI named MPLADSGuard. Provide a highly concise, professional 3-4 sentence Forensic Intelligence Summary. Focus strictly on any financial irregularities, delays, or AI anomaly indicators. Write it in a highly professional, Palantir-style authoritative tone. Do not use markdown formatting."),
    ("user", """
    Project Analysis Data:
    - Target Geography: {state} ({constituency})
    - Sanctioned Funds: ₹{sanctioned_amount}
    - Disbursed Funds: ₹{amount_disbursed}
    - Implementation Status: {status_text}
    - Risk Category Flag: {risk_category}
    - Ensemble Threat Score: {anomaly_score}
    """)
])

@app.post("/api/projects/summary")
def generate_summary(project_data: dict):
    try:
        chain = prompt_template | llm
        
        response = chain.invoke({
            "state": project_data.get('state', 'N/A'),
            "constituency": project_data.get('constituency', 'N/A'),
            "sanctioned_amount": project_data.get('sanctioned_amount', '0'),
            "amount_disbursed": project_data.get('amount_disbursed', '0'),
            "status_text": project_data.get('status_text', 'N/A'),
            "risk_category": project_data.get('risk_category', 'N/A'),
            "anomaly_score": project_data.get('Anomaly_Score_Ensemble', '0')
        })
        
        return {"summary": response.content.strip()}
    except Exception as e:
        return {"summary": f"Intelligence uplink failed. Fallback error details: {str(e)}"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
