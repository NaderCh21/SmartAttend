from fastapi import APIRouter, HTTPException , Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Student, User
from schemas import StudentOut

router = APIRouter()

@router.get("/{student_id}", response_model=StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    user = db.query(User).filter(User.id == student.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User associated with student not found")
    
    return {
        "id": student.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "roll": student.roll,
        "degree": student.degree,
        "year": student.year,
        "stream": student.stream,
    }
