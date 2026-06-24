from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin

from app.auth.jwt_handler import create_access_token
from app.auth.auth_handler import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["Auth"])


# ---------------- REGISTER ----------------
@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # hash password
    hashed_pw = hash_password(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({
        "user_id": new_user.id,
        "username": new_user.username,
        "email": new_user.email
    })

    return {
        "message": "User registered successfully",
        "token": token,
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email
        }
    }


# ---------------- LOGIN ----------------
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # verify hashed password
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Wrong password")

    token = create_access_token({
        "user_id": db_user.id,
        "username": db_user.username,
        "email": db_user.email
    })

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email
        }
    }