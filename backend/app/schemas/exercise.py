from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID


class ExerciseCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon_url: Optional[str] = None


class ExerciseCategoryCreate(ExerciseCategoryBase):
    pass


class ExerciseCategoryResponse(ExerciseCategoryBase):
    id: UUID

    class Config:
        from_attributes = True


class ExerciseBase(BaseModel):
    name: str
    description: Optional[str] = None
    difficulty_level: str
    duration_seconds: int = 60
    repetitions: Optional[int] = None
    video_url: Optional[str] = None
    image_url: Optional[str] = None
    calories_burn_per_minute: int = 5


class ExerciseCreate(ExerciseBase):
    category_id: UUID


class ExerciseResponse(ExerciseBase):
    id: UUID
    category_id: UUID

    class Config:
        from_attributes = True


class CategoryWithExercises(ExerciseCategoryResponse):
    exercises: List[ExerciseResponse] = []

    class Config:
        from_attributes = True