# routers/course.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import Course, Registration, AttendanceLog, Student
from schemas import CourseCreate, CourseResponse, AttendanceCreate, AttendanceResponse, RegistrationCreate, RegistrationResponse
from database import get_db
from typing import List
from datetime import date

router = APIRouter()

# Endpoint to get all courses for a specific teacher
@router.get("/teacher/{teacher_id}", response_model=List[CourseResponse])
def get_courses_for_teacher(teacher_id: int, db: Session = Depends(get_db)):
    courses = db.query(Course).filter(Course.teacher_id == teacher_id).all()
    return courses

# Endpoint to get all available courses (for students to see all courses)
@router.get("/", response_model=List[CourseResponse])
def get_all_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

# Endpoint to get all registered courses for a specific student
@router.get("/students/{student_id}/courses", response_model=List[CourseResponse])
def get_registered_courses_for_student(student_id: int, db: Session = Depends(get_db)):
    registrations = db.query(Registration).filter(Registration.student_id == student_id).all()
    course_ids = [registration.course_id for registration in registrations]
    return db.query(Course).filter(Course.id.in_(course_ids)).all()

# Endpoint to create a new course
@router.post("/", response_model=CourseResponse)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    new_course = Course(**course.dict())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

# Endpoint to delete a course by ID
@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Deleting associated attendance logs and registrations if needed
    db.query(AttendanceLog).filter(AttendanceLog.course_id == course_id).delete()
    db.query(Registration).filter(Registration.course_id == course_id).delete()
    
    db.delete(course)
    db.commit()
    
    return {"message": "Course deleted successfully"}

# Endpoint for students to record attendance for a specific course
@router.post("/students/{student_id}/courses/{course_id}/attendance", response_model=AttendanceResponse)
def record_attendance(student_id: int, course_id: int, db: Session = Depends(get_db)):
    # Check if the student is registered for the course
    registration = db.query(Registration).filter(
        Registration.student_id == student_id,
        Registration.course_id == course_id
    ).first()
    
    if not registration:
        raise HTTPException(status_code=400, detail="Student not registered for this course")

    # Record attendance
    attendance = AttendanceLog(
        student_id=student_id,
        course_id=course_id,
        date=date.today(),
        status="Present"
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance
