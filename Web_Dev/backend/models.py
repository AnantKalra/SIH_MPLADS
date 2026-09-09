from pydantic import BaseModel
from typing import List

class ProjectDetail(BaseModel):
    Work_Id: str
    state: str
    constituency: str
    description: str
    sanctioned_amount: int
    anomaly_score: float
    stall_probability: float
    risk_category: str
    risk_score: float
    
class PaginatedResponse(BaseModel):
    total: int
    page: int
    limit: int
    data: List[ProjectDetail]

class DashboardStats(BaseModel):
    total_projects: int
    requires_review: int
    high_priority: int
