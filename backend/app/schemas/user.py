from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID


# --- User Schemas ---

class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class GoogleLogin(BaseModel):
    token: str


class UserResponse(BaseModel):
    id: UUID
    email: str
    auth_provider: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[str] = None


# --- Profile Schemas ---

class ProfileCreate(BaseModel):
    username: Optional[str] = None
    age: Optional[int] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    profile_picture: Optional[str] = None
    fitness_level: Optional[str] = "beginner"


class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    age: Optional[int] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    profile_picture: Optional[str] = None
    fitness_level: Optional[str] = None


class ProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    username: Optional[str]
    age: Optional[int]
    height: Optional[float]
    weight: Optional[float]
    profile_picture: Optional[str]
    fitness_level: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserWithProfile(BaseModel):
    id: UUID
    email: str
    profile: Optional[ProfileResponse]

    class Config:
        from_attributes = True