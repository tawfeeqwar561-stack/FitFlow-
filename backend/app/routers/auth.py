from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.user import UserCreate, UserResponse, Token, UserLogin  # ✅ added UserLogin
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup", response_model=UserResponse)
async def signup(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user"""
    try:
        user = await AuthService.create_user(db, user_data)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """Login with email and password (form)"""
    user = await AuthService.authenticate_user(db, form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = AuthService.create_token(user)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login/json", response_model=Token)
async def login_json(
    credentials: UserLogin,          # ✅ FIXED: Was (email: str, password: str)
    db: AsyncSession = Depends(get_db)  #          which made them QUERY PARAMS
):
    """Login with JSON body"""
    user = await AuthService.authenticate_user(
        db,
        credentials.email,           # ✅ Now properly parsed from JSON body
        credentials.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    access_token = AuthService.create_token(user)
    return {"access_token": access_token, "token_type": "bearer"}