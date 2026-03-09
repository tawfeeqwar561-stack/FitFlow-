from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from app.models.user import User, UserProfile
from app.schemas.user import UserCreate
from app.utils.security import hash_password, verify_password, create_access_token


class AuthService:
    
    @staticmethod
    async def create_user(db: AsyncSession, user_data: UserCreate) -> User:
        """Create a new user with email/password"""
        
        # Check if user exists
        result = await db.execute(select(User).where(User.email == user_data.email))
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            raise ValueError("Email already registered")
        
        # Create user
        user = User(
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            auth_provider="email"
        )
        
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        # Create empty profile
        profile = UserProfile(user_id=user.id)
        db.add(profile)
        await db.commit()
        
        return user
    
    @staticmethod
    async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
        """Authenticate user with email/password"""
        
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        
        if not user.password_hash:
            return None
        
        if not verify_password(password, user.password_hash):
            return None
        
        return user
    
    @staticmethod
    def create_token(user: User) -> str:
        """Create JWT token for user"""
        return create_access_token(data={"sub": str(user.id)})
    
    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
        """Get user by email"""
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: str) -> Optional[User]:
        """Get user by ID"""
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()