from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.medical import Symptom, DoctorVisit, Medication, MedicationReminder
from app.schemas.medical import (
    SymptomCreate, SymptomResponse, DoctorSuggestion,
    DoctorVisitCreate, DoctorVisitResponse,
    MedicationCreate, MedicationUpdate, MedicationResponse,
    ReminderCreate, ReminderResponse
)
from app.services.ai_service import AIService
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/medical", tags=["Medical"])


# --- Symptoms ---

@router.post("/symptoms", response_model=SymptomResponse)
async def report_symptom(
    symptom_data: SymptomCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Report a symptom"""
    symptom = Symptom(
        user_id=current_user.id,
        description=symptom_data.description,
        body_part=symptom_data.body_part,
        severity=symptom_data.severity,
        during_exercise=symptom_data.during_exercise
    )
    
    db.add(symptom)
    await db.commit()
    await db.refresh(symptom)
    
    return symptom


@router.get("/symptoms", response_model=List[SymptomResponse])
async def get_symptoms(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all symptoms"""
    result = await db.execute(
        select(Symptom)
        .where(Symptom.user_id == current_user.id)
        .order_by(Symptom.reported_at.desc())
    )
    return result.scalars().all()


@router.post("/symptoms/analyze", response_model=List[DoctorSuggestion])
async def analyze_symptoms(
    symptom_data: SymptomCreate,
    current_user: User = Depends(get_current_user)
):
    """Analyze symptoms and get doctor suggestions"""
    suggestions = AIService.analyze_symptoms(
        symptom_data.description,
        symptom_data.body_part
    )
    return suggestions


# --- Doctor Visits ---

@router.post("/doctor-visits", response_model=DoctorVisitResponse)
async def log_doctor_visit(
    visit_data: DoctorVisitCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Log a doctor visit"""
    visit = DoctorVisit(
        user_id=current_user.id,
        symptom_id=visit_data.symptom_id,
        doctor_type=visit_data.doctor_type,
        doctor_name=visit_data.doctor_name,
        doctor_feedback=visit_data.doctor_feedback,
        visit_date=visit_data.visit_date
    )
    
    db.add(visit)
    await db.commit()
    await db.refresh(visit)
    
    return visit


@router.get("/doctor-visits", response_model=List[DoctorVisitResponse])
async def get_doctor_visits(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all doctor visits"""
    result = await db.execute(
        select(DoctorVisit)
        .where(DoctorVisit.user_id == current_user.id)
        .order_by(DoctorVisit.created_at.desc())
    )
    return result.scalars().all()


# --- Medications ---

@router.post("/medications", response_model=MedicationResponse)
async def add_medication(
    medication_data: MedicationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add a medication"""
    medication = Medication(
        user_id=current_user.id,
        name=medication_data.name,
        dosage=medication_data.dosage,
        frequency=medication_data.frequency,
        start_date=medication_data.start_date,
        end_date=medication_data.end_date,
        notes=medication_data.notes
    )
    
    db.add(medication)
    await db.commit()
    await db.refresh(medication)
    
    return medication


@router.get("/medications", response_model=List[MedicationResponse])
async def get_medications(
    active_only: bool = False,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all medications"""
    query = select(Medication).where(Medication.user_id == current_user.id)
    
    if active_only:
        query = query.where(Medication.is_active == True)
    
    result = await db.execute(query.order_by(Medication.created_at.desc()))
    return result.scalars().all()


@router.put("/medications/{medication_id}", response_model=MedicationResponse)
async def update_medication(
    medication_id: str,
    medication_data: MedicationUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a medication"""
    result = await db.execute(
        select(Medication).where(
            Medication.id == medication_id,
            Medication.user_id == current_user.id
        )
    )
    medication = result.scalar_one_or_none()
    
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    update_data = medication_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            setattr(medication, field, value)
    
    await db.commit()
    await db.refresh(medication)
    
    return medication


# --- Reminders ---

@router.post("/reminders", response_model=ReminderResponse)
async def add_reminder(
    reminder_data: ReminderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add a medication reminder"""
    reminder = MedicationReminder(
        medication_id=reminder_data.medication_id,
        reminder_time=reminder_data.reminder_time,
        is_enabled=reminder_data.is_enabled
    )
    
    db.add(reminder)
    await db.commit()
    await db.refresh(reminder)
    
    return reminder