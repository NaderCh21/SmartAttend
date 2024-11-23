# routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import User, Student, Teacher
from schemas import RegisterUser, LoginUser
from database import SessionLocal, get_db
from utils import hash_password, verify_password
from utils import encode_face

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/signup")
def register_user(user: RegisterUser, db: Session = Depends(get_db), face_data: str = None):
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password and create new user
    hashed_password = hash_password(user.password)
    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Additional student or teacher data
    if user.role == "student":
        student = Student(
            user_id=new_user.id,
            roll=user.roll,
            degree=user.degree,
            year=user.year,
            stream=user.stream,
        )

        # Only add face_data if provided
        if face_data:
            face_encoding = encode_face(face_data)  # Generate face encoding
            student.face_data = face_encoding.tobytes()

        db.add(student)
        db.commit()
        db.refresh(student)  # Refresh to get the student_id
        return {"message": "User registered successfully", "student_id": student.id}

    elif user.role == "teacher":
        teacher = Teacher(
            user_id=new_user.id,
            department="Default",  # Modify as needed
            subject="Default"      # Modify as needed
        )
        db.add(teacher)

    db.commit()
    return {"message": "User registered successfully"}


@router.post("/login")
def login_user(user: LoginUser, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Initialize teacher_id as None
    id = None

    # Check if the user is a teacher and retrieve teacher_id
    if db_user.role == "teacher":
        teacher = db.query(Teacher).filter(Teacher.user_id == db_user.id).first()
        if teacher:
            id = teacher.id
    elif db_user.role == "student":
        student = db.query(Student).filter(Student.user_id == db_user.id).first()
        if student:
            id = student.id
    return {
        "message": "Login successful",
        "user_id": db_user.id,
        "role": db_user.role,
        "relative_id": id,  # Add teacher_id to the response
    }

