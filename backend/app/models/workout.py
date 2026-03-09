import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    exercise_id = Column(UUID(as_uuid=True), ForeignKey("exercises.id"))
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    calories_burned = Column(Integer, nullable=True)
    completed = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="workout_sessions")
    exercise = relationship("Exercise", back_populates="workout_sessions")