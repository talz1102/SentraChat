from fastapi import APIRouter, WebSocket

router = APIRouter()

@router.websocket("/ws/chat")
async def chat(websocket: WebSocket):
    await websocket.accept()
    print("NEW CONNECTION")

    while True:
        data = await websocket.receive_text()
        print("RECEIVED:", data)
        await websocket.send_text("echo: " + data)