from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from app.models.user import User, UserProfile
from app.schemas.user import ProfileCreate, ProfileUpdate


class UserService:
    
    @staticmethod
    async def get_profile(db: AsyncSession, user_id: str) -> Optional[UserProfile]:
        """Get user profile"""
        result = await db.execute(
            select(UserProfile).where(UserProfile.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def create_profile(db: AsyncSession, user_id: str, profile_data: ProfileCreate) -> UserProfile:
        """Create user profile"""
        
        # Check if profile exists
        existing = await UserService.get_profile(db, user_id)
        if existing:
            raise ValueError("Profile already exists")
        
        profile = UserProfile(
            user_id=user_id,
            username=profile_data.username,
            age=profile_data.age,
            height=profile_data.height,
            weight=profile_data.weight,
            profile_picture=profile_data.profile_picture,
            fitness_level=profile_data.fitness_level
        )
        
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
        
        return profile
    
    @staticmethod
    async def update_profile(db: AsyncSession, user_id: str, profile_data: ProfileUpdate) -> Optional[UserProfile]:
        """Update user profile"""
        
        result = await db.execute(
            select(UserProfile).where(UserProfile.user_id == user_id)
        )
        profile = result.scalar_one_or_none()
        
        if not profile:
            return None
        
        # Update only provided fields
        update_data = profile_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if value is not None:
                setattr(profile, field, value)
        
        await db.commit()
        await db.refresh(profile)
        
        return profile