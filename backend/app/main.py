from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine   # 👈 ADD THIS
from app.models.user import User        # 👈 IMPORTANT (forces table creation)

from app.routes.auth import router as auth_router
from app.routes.chat_ws import router as chat_ws_router
from app.routes.sentiment import router as sentiment_router
from app.routes.analytics import router as analytics_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👇 THIS LINE CREATES TABLES AUTOMATICALLY
Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(chat_ws_router)
app.include_router(sentiment_router)
app.include_router(analytics_router)


@app.get("/")
def home():
    return {"ok": True}