from fastapi import APIRouter, Depends, HTTPException
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
    ReminderCreate, ReminderResponse,
    ChatMessage, ChatResponse
)
from app.services.ai_service import AIService
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/medical", tags=["Medical"])


# ── Chat ──────────────────────────────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse)
async def medical_chat(
    chat_data: ChatMessage,
    current_user: User = Depends(get_current_user)
):
    """Gemini-powered Medical Chatbot"""
    result = await AIService.medical_chat(
        message=chat_data.message,
        context=chat_data.context,
        chat_history=chat_data.history
    )
    return result


# ── Symptoms ──────────────────────────────────────────────────────────────────

@router.post("/symptoms", response_model=SymptomResponse)
async def report_symptom(
    symptom_data: SymptomCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    symptom = Symptom(
        user_id=current_user.id,
        name=symptom_data.name,
        severity=symptom_data.severity,
        description=symptom_data.description,
        started_at=symptom_data.started_at
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
    result = await db.execute(
        select(Symptom)
        .where(Symptom.user_id == current_user.id)
        .order_by(Symptom.created_at.desc())
    )
    return result.scalars().all()


# ── Doctor Visits ─────────────────────────────────────────────────────────────

@router.post("/doctor-visits", response_model=DoctorVisitResponse)
async def log_doctor_visit(
    visit_data: DoctorVisitCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    visit = DoctorVisit(
        user_id=current_user.id,
        doctor_name=visit_data.doctor_name,
        specialty=visit_data.specialty,
        visit_date=visit_data.visit_date,
        reason=visit_data.reason,
        diagnosis=visit_data.diagnosis,
        prescription=visit_data.prescription,
        follow_up_date=visit_data.follow_up_date,
        notes=visit_data.notes
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
    result = await db.execute(
        select(DoctorVisit)
        .where(DoctorVisit.user_id == current_user.id)
        .order_by(DoctorVisit.created_at.desc())
    )
    return result.scalars().all()


# ── Medications ───────────────────────────────────────────────────────────────

@router.post("/medications", response_model=MedicationResponse)
async def add_medication(
    medication_data: MedicationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    medication = Medication(
        user_id=current_user.id,
        name=medication_data.name,
        dosage=medication_data.dosage,
        frequency=medication_data.frequency,
        start_date=medication_data.start_date,
        end_date=medication_data.end_date,
        prescribed_by=medication_data.prescribed_by,
        purpose=medication_data.purpose,
        side_effects=medication_data.side_effects
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
    query = select(Medication).where(Medication.user_id == current_user.id)
    if active_only:
        query = query.where(Medication.is_active == True)
    result = await db.execute(query.order_by(Medication.created_at.desc()))
    return result.scalars().all()


@router.put("/medications/{medication_id}", response_model=MedicationResponse)
async def update_medication(
    medication_id: int,
    medication_data: MedicationUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Medication).where(
            Medication.id == medication_id,
            Medication.user_id == current_user.id
        )
    )
    medication = result.scalar_one_or_none()
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")

    for field, value in medication_data.model_dump(exclude_unset=True).items():
        setattr(medication, field, value)

    await db.commit()
    await db.refresh(medication)
    return medication


@router.delete("/medications/{medication_id}")
async def delete_medication(
    medication_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Medication).where(
            Medication.id == medication_id,
            Medication.user_id == current_user.id
        )
    )
    medication = result.scalar_one_or_none()
    if not medication:
        raise HTTPException(status_code=404, detail="Medication not found")
    await db.delete(medication)
    await db.commit()
    return {"message": "Medication deleted"}


# ── Reminders ─────────────────────────────────────────────────────────────────

@router.post("/reminders", response_model=ReminderResponse)
async def add_reminder(
    reminder_data: ReminderCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    reminder = MedicationReminder(
        user_id=current_user.id,
        medication_id=reminder_data.medication_id,
        reminder_time=reminder_data.reminder_time,
        is_active=reminder_data.is_active
    )
    db.add(reminder)
    await db.commit()
    await db.refresh(reminder)
    return reminder


@router.get("/reminders", response_model=List[ReminderResponse])
async def get_reminders(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(MedicationReminder)
        .where(MedicationReminder.user_id == current_user.id)
        .order_by(MedicationReminder.reminder_time)
    )
    return result.scalars().all()


@router.delete("/reminders/{reminder_id}")
async def delete_reminder(
    reminder_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(MedicationReminder).where(
            MedicationReminder.id == reminder_id,
            MedicationReminder.user_id == current_user.id
        )
    )
    reminder = result.scalar_one_or_none()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    await db.delete(reminder)
    await db.commit()
    return {"message": "Reminder deleted"}