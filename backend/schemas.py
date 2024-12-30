# schemas.py
from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class RegisterUser(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    confirm_password: str
    role: str
    roll: str = None
    degree: str = None
    year: int = None
    stream: str = None

class LoginUser(BaseModel):
    email: EmailStr
    password: str

class CourseCreate(BaseModel):
    name: str
    year: str
    semester: str
    teacher_id: int

class CourseResponse(BaseModel):
    id: int
    name: str
    year: str
    semester: str
    teacher_id: int
    instructor: Optional[str]  # New field for instructor's name

    class Config:
        orm_mode = True

class RecordAttendance(BaseModel):
    student_id: int
    session_id: int
    

class AttendanceResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    date: date
    status: str

    class Config:
        from_attributes = True

class RegistrationCreate(BaseModel):
    student_id: int
    course_id: int

class RegistrationResponse(BaseModel):
    id: int
    student_id: int
    course_id: int

    class Config:
        from_attributes = True


class TeacherResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    department: str
    subject: str

    class Config:
        from_attributes = True

class StudentOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    roll: str
    degree: str
    year: int
    stream: str

    class Config:
        from_attributes = True
