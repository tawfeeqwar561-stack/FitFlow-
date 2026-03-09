import uuid
from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class ExerciseCategory(Base):
    __tablename__ = "exercise_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    icon_url = Column(String(500), nullable=True)

    # Relationships
    exercises = relationship("Exercise", back_populates="category")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_id = Column(UUID(as_uuid=True), ForeignKey("exercise_categories.id"))
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    difficulty_level = Column(String(20), nullable=False)  # beginner, intermediate, advanced
    duration_seconds = Column(Integer, default=60)
    repetitions = Column(Integer, nullable=True)
    video_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    calories_burn_per_minute = Column(Integer, default=5)

    # Relationships
    category = relationship("ExerciseCategory", back_populates="exercises")
    workout_sessions = relationship("WorkoutSession", back_populates="exercise")