from pydantic import BaseModel
from typing import List

class ProjectDetail(BaseModel):
    Work_Id: str
    state: str
    constituency: str
    description: str
    sanctioned_amount: int
    amount_disbursed: int = 0
    recommended_amount: int = 0
    sanction_delay_days: int = 0
    completion_days: int = 0
    mp_avg_amount: int = 0
    is_round_amount: int = 0
    completed_no_image: int = 0
    has_banned_keyword: int = 0
    is_duplicate_desc: int = 0
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
