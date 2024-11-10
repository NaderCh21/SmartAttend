from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Date , LargeBinary
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum("student", "teacher"), nullable=False)
    student = relationship("Student", uselist=False, back_populates="user")
    teacher = relationship("Teacher", uselist=False, back_populates="user")

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    roll = Column(String)
    degree = Column(String)
    year = Column(Integer)
    stream = Column(String)
    face_data = Column(LargeBinary)
    user = relationship("User", back_populates="student")
    registrations = relationship("Registration", back_populates="student")
    attendance_logs = relationship("AttendanceLog", back_populates="student")

class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    department = Column(String)
    subject = Column(String)
    user = relationship("User", back_populates="teacher")
    courses = relationship("Course", back_populates="teacher")  

class Registration(Base):
    __tablename__ = "registrations"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    student = relationship("Student", back_populates="registrations")
    course = relationship("Course", back_populates="registrations")


class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    year = Column(String)
    semester = Column(String)
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    
    teacher = relationship("Teacher", back_populates="courses")
    registrations = relationship("Registration", back_populates="course")
    attendance_logs = relationship("AttendanceLog", back_populates="course", cascade="all, delete-orphan")

from sqlalchemy import Column, Integer, ForeignKey, Date, String
from sqlalchemy.orm import relationship
from database import Base

class AttendanceLog(Base):
    __tablename__ = "attendance_logs"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    date = Column(Date, nullable=False)  # Ensure this line exists
    status = Column(String, nullable=False)

    student = relationship("Student", back_populates="attendance_logs")
    course = relationship("Course", back_populates="attendance_logs")
