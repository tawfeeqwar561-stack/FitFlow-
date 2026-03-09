import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)  # Null for Google OAuth users
    auth_provider = Column(String(50), default="email")  # "email" or "google"
    google_id = Column(String(255), nullable=True, unique=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    workout_sessions = relationship("WorkoutSession", back_populates="user")
    food_logs = relationship("FoodLog", back_populates="user")
    symptoms = relationship("Symptom", back_populates="user")
    medications = relationship("Medication", back_populates="user")
    meditation_sessions = relationship("MeditationSession", back_populates="user")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    username = Column(String(100), nullable=True)
    age = Column(Integer, nullable=True)
    height = Column(Float, nullable=True)  # in cm
    weight = Column(Float, nullable=True)  # in kg
    profile_picture = Column(String(500), nullable=True)
    fitness_level = Column(String(20), default="beginner")  # beginner, intermediate, advanced
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="profile")