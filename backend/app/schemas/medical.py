from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date, time
from uuid import UUID


# --- Symptom Schemas ---

class SymptomCreate(BaseModel):
    description: str
    body_part: Optional[str] = None
    severity: str = "mild"
    during_exercise: Optional[str] = None


class SymptomResponse(BaseModel):
    id: UUID
    user_id: UUID
    description: str
    body_part: Optional[str]
    severity: str
    during_exercise: Optional[str]
    reported_at: datetime

    class Config:
        from_attributes = True


class DoctorSuggestion(BaseModel):
    doctor_type: str
    reason: str
    urgency: str  # low, medium, high


# --- Doctor Visit Schemas ---

class DoctorVisitCreate(BaseModel):
    symptom_id: Optional[UUID] = None
    doctor_type: Optional[str] = None
    doctor_name: Optional[str] = None
    doctor_feedback: Optional[str] = None
    visit_date: Optional[date] = None


class DoctorVisitResponse(BaseModel):
    id: UUID
    user_id: UUID
    symptom_id: Optional[UUID]
    doctor_type: Optional[str]
    doctor_name: Optional[str]
    doctor_feedback: Optional[str]
    visit_date: Optional[date]
    created_at: datetime

    class Config:
        from_attributes = True


# --- Medication Schemas ---

class MedicationCreate(BaseModel):
    name: str
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    notes: Optional[str] = None


class MedicationUpdate(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None


class MedicationResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    dosage: Optional[str]
    frequency: Optional[str]
    start_date: Optional[date]
    end_date: Optional[date]
    is_active: bool
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# --- Reminder Schemas ---

class ReminderCreate(BaseModel):
    medication_id: UUID
    reminder_time: time
    is_enabled: bool = True


class ReminderResponse(BaseModel):
    id: UUID
    medication_id: UUID
    reminder_time: time
    is_enabled: bool

    class Config:
        from_attributes = True