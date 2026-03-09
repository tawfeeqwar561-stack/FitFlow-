from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.user import User, UserProfile
from app.models.nutrition import FoodLog
from app.schemas.nutrition import FoodLogCreate, FoodLogResponse, CalorieDetectionResponse, WorkoutRecommendation
from app.services.ai_service import AIService
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/nutrition", tags=["Nutrition"])


@router.post("/detect", response_model=CalorieDetectionResponse)
async def detect_calories(
    image_url: str,
    current_user: User = Depends(get_current_user)
):
    """Detect food and calories from image URL"""
    result = await AIService.detect_food_from_image(image_url)
    return result


@router.post("/log", response_model=FoodLogResponse)
async def log_food(
    food_data: FoodLogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Log food entry"""
    food_log = FoodLog(
        user_id=current_user.id,
        image_url=food_data.image_url,
        detected_food=food_data.detected_food,
        calories=food_data.calories,
        protein=food_data.protein,
        carbs=food_data.carbs,
        fat=food_data.fat,
        notes=food_data.notes
    )
    
    db.add(food_log)
    await db.commit()
    await db.refresh(food_log)
    
    return food_log


@router.get("/history", response_model=List[FoodLogResponse])
async def get_food_history(
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get food log history"""
    result = await db.execute(
        select(FoodLog)
        .where(FoodLog.user_id == current_user.id)
        .order_by(FoodLog.logged_at.desc())
        .limit(limit)
    )
    return result.scalars().all()


@router.post("/recommendations", response_model=List[WorkoutRecommendation])
async def get_workout_recommendations(
    calories: float,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get workout recommendations based on calories consumed"""
    
    # Get user weight from profile
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    weight = profile.weight if profile and profile.weight else 70
    
    recommendations = AIService.get_workout_recommendation(calories, weight)
    return recommendations