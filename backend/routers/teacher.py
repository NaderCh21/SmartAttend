from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Teacher, User
from schemas import TeacherResponse
from typing import List

router = APIRouter()

# Endpoint to fetch teacher details by ID
@router.get("/{teacher_id}", response_model=TeacherResponse)
def get_teacher_by_id(teacher_id: int, db: Session = Depends(get_db)):
    print(f"Fetching teacher details for ID: {teacher_id}")
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        print(f"Teacher with ID {teacher_id} not found.")
        raise HTTPException(status_code=404, detail="Teacher not found")
    user = db.query(User).filter(User.id == teacher.user_id).first()
    if not user:
        print(f"User for teacher ID {teacher_id} not found.")
        raise HTTPException(status_code=404, detail="User not found for the teacher")
    return {
        "id": teacher.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "department": teacher.department,
        "subject": teacher.subject,
    }


# Additional endpoints for teacher-related operations can be added here.
