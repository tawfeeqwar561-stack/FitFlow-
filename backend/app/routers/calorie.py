from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import date
import base64

from app.database import get_db
from app.models.user import User
from app.schemas.calorie import (
    GoalCreate, GoalUpdate, GoalResponse,
    FoodDetectionRequest, FoodDetectionResponse,
    NutritionRequest, NutritionResponse,
    MealLogCreate, MealLogResponse,
    DailyIntakeResponse, DailyProgressResponse,
    WaterLogCreate, WaterLogResponse,
    CalorieBalanceResponse
)
from app.services.calorie_service import CalorieService
from app.services.food_ai_service import FoodAIService
from app.utils.dependencies import get_current_user

# ✅ FIXED: was "/api/calories" — frontend calls "/api/calorie" (no 's')
router = APIRouter(prefix="/api/calorie", tags=["Calories"])


# ==================== GOALS ====================

@router.get("/goals", response_model=GoalResponse)
async def get_goals(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's nutrition goals"""
    goal = await CalorieService.get_or_create_goal(db, str(current_user.id))
    return goal


@router.post("/goals", response_model=GoalResponse)
async def create_goal(
    goal_data: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create or update nutrition goals"""
    goal = await CalorieService.create_goal(db, str(current_user.id), goal_data)
    return goal


@router.put("/goals", response_model=GoalResponse)
async def update_goal(
    goal_data: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update nutrition goals"""
    goal = await CalorieService.update_goal(db, str(current_user.id), goal_data)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal


# ==================== FOOD DETECTION ====================

@router.post("/detect-food", response_model=FoodDetectionResponse)
async def detect_food(
    request: FoodDetectionRequest,
    current_user: User = Depends(get_current_user)
):
    """Detect food from base64 image"""
    result = await FoodAIService.detect_food_from_image(request.image_base64)

    if not result.get("success"):
        raise HTTPException(
            status_code=400,
            detail=result.get("error", "Failed to detect food")
        )

    return {
        "detected_foods": result.get("detected_foods", []),
        "top_food": result.get("top_food", "Unknown"),
        "confidence": result.get("confidence", 0)
    }


@router.post("/detect-food/upload")
async def detect_food_upload(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Detect food from uploaded image file"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await file.read()
    image_base64 = base64.b64encode(contents).decode("utf-8")
    result = await FoodAIService.detect_food_from_image(image_base64)

    if not result.get("success"):
        raise HTTPException(
            status_code=400,
            detail=result.get("error", "Failed to detect food")
        )

    return {
        "detected_foods": result.get("detected_foods", []),
        "top_food": result.get("top_food", "Unknown"),
        "confidence": result.get("confidence", 0)
    }


# ==================== NUTRITION DATA ====================

@router.post("/nutrition", response_model=NutritionResponse)
async def get_nutrition(
    request: NutritionRequest,
    current_user: User = Depends(get_current_user)
):
    """Get nutrition data for a food item"""
    result = await FoodAIService.get_nutrition_data(
        request.food_name,
        request.serving_size
    )

    if not result.get("success"):
        raise HTTPException(
            status_code=400,
            detail=result.get("error", "Failed to get nutrition data")
        )

    return {
        "foods": result.get("foods", []),
        "total_calories": result.get("total_calories", 0),
        "total_protein": result.get("total_protein", 0),
        "total_carbs": result.get("total_carbs", 0),
        "total_fat": result.get("total_fat", 0)
    }


@router.get("/nutrition/search")
async def search_nutrition(
    query: str,
    current_user: User = Depends(get_current_user)
):
    """Search for food and get nutrition data"""
    result = await FoodAIService.get_nutrition_data(query)
    return result


# ==================== MEAL LOGGING ====================

@router.post("/meals", response_model=MealLogResponse)
async def log_meal(
    meal_data: MealLogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Log a meal"""
    meal = await CalorieService.log_meal(db, str(current_user.id), meal_data)
    return meal


@router.get("/meals", response_model=List[MealLogResponse])
async def get_meals(
    meal_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get meals for a specific date (default: today)"""
    if meal_date is None:
        meal_date = date.today()
    meals = await CalorieService.get_meals_by_date(db, str(current_user.id), meal_date)
    return meals


@router.delete("/meals/{meal_id}")
async def delete_meal(
    meal_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a meal log"""
    success = await CalorieService.delete_meal(db, str(current_user.id), meal_id)
    if not success:
        raise HTTPException(status_code=404, detail="Meal not found")
    return {"message": "Meal deleted successfully"}


# ==================== DAILY PROGRESS ====================

@router.get("/daily-intake", response_model=DailyIntakeResponse)
async def get_daily_intake(
    intake_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get daily intake totals"""
    if intake_date is None:
        intake_date = date.today()

    intake = await CalorieService.get_daily_intake(
        db, str(current_user.id), intake_date
    )

    if not intake:
        return {
            "id": None,
            "user_id": current_user.id,
            "intake_date": intake_date,
            "total_calories": 0,
            "total_protein": 0,
            "total_carbs": 0,
            "total_fat": 0,
            "total_fiber": 0,
            "water_intake": 0,
            "meals_count": 0
        }
    return intake


@router.get("/progress")
async def get_daily_progress(
    progress_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get daily progress with goals comparison"""
    progress = await CalorieService.get_daily_progress(
        db,
        str(current_user.id),
        progress_date
    )
    return progress


# ==================== WATER TRACKING ====================

@router.post("/water", response_model=WaterLogResponse)
async def log_water(
    water_data: WaterLogCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Log water intake (in ml)"""
    water_log = await CalorieService.log_water(db, str(current_user.id), water_data)
    return water_log


# ==================== CALORIE BALANCE ====================

@router.get("/balance", response_model=CalorieBalanceResponse)
async def get_calorie_balance(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get calorie balance and exercise recommendations"""
    balance = await CalorieService.get_calorie_balance(db, str(current_user.id))
    return balance


# ==================== QUICK ANALYZE ====================

@router.post("/quick-analyze")
async def quick_analyze(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload image → Detect food → Get nutrition in one step"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await file.read()
    image_base64 = base64.b64encode(contents).decode("utf-8")

    # Step 1: Detect food
    detection_result = await FoodAIService.detect_food_from_image(image_base64)

    if not detection_result.get("success") or not detection_result.get("top_food"):
        return {
            "success": False,
            "error": "Could not detect food in image",
            "detected_food": None,
            "nutrition": None
        }

    detected_food = detection_result.get("top_food")
    confidence = detection_result.get("confidence")

    # Step 2: Get nutrition
    nutrition_result = await FoodAIService.get_nutrition_data(detected_food)

    return {
        "success": True,
        "detected_food": detected_food,
        "confidence": confidence,
        "all_detected": detection_result.get("detected_foods", []),
        "nutrition": nutrition_result.get("foods", []),
        "total_calories": nutrition_result.get("total_calories", 0),
        "total_protein": nutrition_result.get("total_protein", 0),
        "total_carbs": nutrition_result.get("total_carbs", 0),
        "total_fat": nutrition_result.get("total_fat", 0)
    }