from pydantic import BaseModel, EmailStr, Field


# ---------------- REGISTER ----------------
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)


# ---------------- LOGIN ----------------
class UserLogin(BaseModel):
    email: EmailStr
    password: str