from pydantic import BaseModel
from typing import List

class ProjectDetail(BaseModel):
    Work_Id: str
    state: str
    constituency: str
    description: str
    sanctioned_amount: int
    amount_disbursed: int = 0
    vendor: str = ""
    status_text: str = ""
    anomaly_score: float
    stall_probability: float
    risk_category: str
    risk_score: float
    Anomaly_Score_Ensemble: float = 0.0
    
class PaginatedResponse(BaseModel):
    total: int
    page: int
    limit: int
    data: List[ProjectDetail]

class DashboardStats(BaseModel):
    total_projects: int
    requires_review: int
    high_priority: int
