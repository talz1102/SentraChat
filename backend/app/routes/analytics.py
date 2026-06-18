from fastapi import APIRouter
from app.analytics_service import get_dashboard_analytics

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/")
def analytics():
    return get_dashboard_analytics()