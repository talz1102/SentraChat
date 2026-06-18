from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.sentiment.sentiment_service import get_sentiment

router = APIRouter()

@router.websocket("/ws/chat")
async def chat(websocket: WebSocket):

    await websocket.accept()
    print("NEW CONNECTION")

    try:
        while True:
            data = await websocket.receive_text()

            sentiment = get_sentiment(data)

            print("MESSAGE:", data)
            print("SENTIMENT:", sentiment)

            await websocket.send_json({
                "message": data,
                "sentiment": sentiment["label"],
                "score": sentiment["score"]
            })

    except WebSocketDisconnect:
        print("Client disconnected")