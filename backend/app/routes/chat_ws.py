from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.sentiment.sentiment_service import get_sentiment
from app.auth.jwt_handler import decode_access_token

router = APIRouter()

# user_id -> websocket
active_connections = {}


@router.websocket("/ws/chat")
async def chat(websocket: WebSocket):

    # 1. Get token BEFORE accept
    token = websocket.query_params.get("token")

    if not token:
        await websocket.close(code=1008)
        return

    user = decode_access_token(token)

    if not user:
        await websocket.close(code=1008)
        return

    # 2. Accept ONLY after validation
    await websocket.accept()

    user_id = user.get("user_id")
    username = user.get("username", "Anonymous")

    # 3. Replace old connection if exists
    old_ws = active_connections.get(user_id)
    if old_ws:
        try:
            await old_ws.close()
        except:
            pass

    active_connections[user_id] = websocket

    print(f"CONNECTED: {username}")

    try:
        while True:
            data = await websocket.receive_text()

            sentiment = get_sentiment(data)
            print("RAW SENTIMENT:", sentiment)

            message = {
                "user": username,
                "userId": user_id,
                "message": data,
                "sentiment": sentiment["label"],
                "score": sentiment["score"],
            }

            # broadcast
            dead = []

            for uid, conn in active_connections.items():
                try:
                    await conn.send_json(message)
                except:
                    dead.append(uid)

            for uid in dead:
                active_connections.pop(uid, None)

    except WebSocketDisconnect:
        print(f"DISCONNECTED: {username}")

    finally:
        # safe cleanup
        active_connections.pop(user_id, None)