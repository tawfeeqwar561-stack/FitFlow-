import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Text, DateTime, Date, ForeignKey, Boolean, Time
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Symptom(Base):
    __tablename__ = "symptoms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    description = Column(Text, nullable=False)
    body_part = Column(String(100), nullable=True)
    severity = Column(String(20), default="mild")  # mild, moderate, severe
    during_exercise = Column(String(200), nullable=True)
    reported_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="symptoms")
    doctor_visits = relationship("DoctorVisit", back_populates="symptom")


class DoctorVisit(Base):
    __tablename__ = "doctor_visits"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    symptom_id = Column(UUID(as_uuid=True), ForeignKey("symptoms.id"), nullable=True)
    doctor_type = Column(String(100), nullable=True)  # Orthopedic, Physiotherapist, etc.
    doctor_name = Column(String(200), nullable=True)
    doctor_feedback = Column(Text, nullable=True)
    visit_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    symptom = relationship("Symptom", back_populates="doctor_visits")


class Medication(Base):
    __tablename__ = "medications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    name = Column(String(200), nullable=False)
    dosage = Column(String(100), nullable=True)
    frequency = Column(String(100), nullable=True)  # "twice daily", "once daily"
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    is_active = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="medications")
    reminders = relationship("MedicationReminder", back_populates="medication")


class MedicationReminder(Base):
    __tablename__ = "medication_reminders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    medication_id = Column(UUID(as_uuid=True), ForeignKey("medications.id"))
    reminder_time = Column(Time, nullable=False)
    is_enabled = Column(Boolean, default=True)

    # Relationships
    medication = relationship("Medication", back_populates="reminders")