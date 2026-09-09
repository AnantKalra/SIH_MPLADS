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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ml_engine = MLEngine()
data_loader = DataLoader(ml_engine)

@app.get("/api/stats", response_model=DashboardStats)
def get_stats():
    return data_loader.get_stats()

@app.get("/api/projects", response_model=PaginatedResponse)
def get_projects(page: int = 1, limit: int = 20, sort_by: str = "risk_score"):
    records, total = data_loader.get_projects(page=page, limit=limit, sort_by=sort_by, sort_asc=False)
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
