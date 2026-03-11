from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.schemas.user import ProfileCreate, ProfileUpdate, ProfileResponse, UserResponse
from app.services.user_service import UserService
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])


# ─── Helper ──────────────────────────────────────────────────────────────────

def build_profile_response(profile, username: str = None) -> ProfileResponse:
    """
    Maps UserProfile model → ProfileResponse schema.
    Handles:
      - profile_image  → profile_picture  (name mismatch)
      - username       → pulled from User  (not on UserProfile)
    """
    return ProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        username=username,                          # ✅ from User model
        age=profile.age,
        height=profile.height,
        weight=profile.weight,
        profile_picture=profile.profile_image,      # ✅ remapped
        fitness_level=profile.fitness_level or "beginner",
        created_at=profile.created_at,
    )


# ─── Routes ──────────────────────────────────────────────────────────────────

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return current_user                             # ✅ No changes needed


@router.get("/me/profile", response_model=ProfileResponse)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's profile"""
    profile = await UserService.get_profile(db, str(current_user.id))

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    return build_profile_response(                  # ✅ FIXED: was `return profile`
        profile,
        username=current_user.username              # ✅ pulled from User model
    )


@router.post("/me/profile", response_model=ProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_my_profile(
    profile_data: ProfileCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create profile for current user"""
    try:
        profile = await UserService.create_profile(db, str(current_user.id), profile_data)

        return build_profile_response(              # ✅ FIXED: was `return profile`
            profile,
            username=current_user.username
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.put("/me/profile", response_model=ProfileResponse)
async def update_my_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user's profile"""
    profile = await UserService.update_profile(db, str(current_user.id), profile_data)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    return build_profile_response(                  # ✅ FIXED: was `return profile`
        profile,
        username=current_user.username
    )