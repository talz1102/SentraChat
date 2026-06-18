from fastapi import APIRouter
from app.sentiment.sentiment_service import get_sentiment

router = APIRouter(
    prefix="/sentiment",
    tags=["Sentiment"]
)

@router.post("/")
def analyze(data: dict):
    message = data.get("message", "")
    return get_sentiment(message)