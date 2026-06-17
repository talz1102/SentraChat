from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register():
    return {
        "message": "DB disabled temporarily, API is working"
    }