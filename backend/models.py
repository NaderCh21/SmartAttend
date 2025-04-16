from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Date , LargeBinary, Text , DateTime
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy import Column, Integer, ForeignKey, Date, String, Time
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
    face_data = Column(Text, nullable=True)
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
    #duration = Column(Integer, nullable=True)
    teacher = relationship("Teacher", back_populates="courses")
    registrations = relationship("Registration", back_populates="course")
    sessions = relationship("Sessions", back_populates="course")  # Relationship with Sessions




class AttendanceLog(Base):
    __tablename__ = "attendance_logs"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)
    timestamp = Column(DateTime, nullable=True )
    student = relationship("Student", back_populates="attendance_logs")
    session = relationship("Sessions", back_populates="attendance_logs")

class Sessions(Base): 
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    date = Column(Date, nullable=False)  # Date of the session
    session_status = Column(String)
    start_time = Column(DateTime, nullable=True)  # Start time of the session
    #end_time = Column(Time, nullable=False)  # End time of the session
  
    attendance_logs = relationship("AttendanceLog", back_populates="session", cascade="all, delete-orphan")
    course = relationship("Course", back_populates="sessions")  # Relationship with Course


class Final_Attendance(Base):
    __tablename__ = "final_attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    status = Column(String)
    check_in_time = Column(DateTime, nullable= True)
    time_in_class = Column(String, nullable= True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=False)