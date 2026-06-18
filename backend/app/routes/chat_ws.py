from fastapi import APIRouter, WebSocket
from app.sentiment.sentiment_service import get_sentiment

router = APIRouter()

@router.websocket("/ws/chat")
async def chat(websocket: WebSocket):

    await websocket.accept()

    print("NEW CONNECTION")

    while True:

        data = await websocket.receive_text()

        sentiment = get_sentiment(data)

        print("MESSAGE:", data)
        print("SENTIMENT:", sentiment)

        await websocket.send_json(
            {
                "message": data,
                "sentiment": sentiment["label"],
                "score": sentiment["score"]
            }
        )