# routers/course.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from models import Course, Registration, AttendanceLog, Student, Sessions , Teacher , User, Final_Attendance
from schemas import CourseCreate, CourseResponse, RecordAttendance, AttendanceResponse, RegistrationCreate, RegistrationResponse, SessionResponce, FinalAttendance, StudentFinalAttendance
from database import get_db
from typing import List
from datetime import date, datetime

router = APIRouter()

# Endpoint to get all courses for a specific teacher
@router.get("/teacher/{teacher_id}", response_model=List[CourseResponse])
def get_courses_for_teacher(teacher_id: int, db: Session = Depends(get_db)):
    courses = db.query(Course).filter(Course.teacher_id == teacher_id).all()
    return courses

# Endpoint to get all available courses (for students to see all courses)
@router.get("/", response_model=List[CourseResponse])
def get_all_courses(db: Session = Depends(get_db)):
    courses = (
        db.query(
            Course.id,
            Course.name,
            Course.year,
            Course.semester,
            Teacher.id.label("teacher_id"),
            User.first_name.label("instructor_first_name"),
            User.last_name.label("instructor_last_name"),
        )
        .outerjoin(Teacher, Course.teacher_id == Teacher.id)
        .outerjoin(User, Teacher.user_id == User.id)
        .all()
    )

    print("Courses fetched: ", courses)  # Debugging line

    response = [
        {
            "id": course.id,
            "name": course.name,
            "year": course.year,
            "semester": course.semester,
            "teacher_id": course.teacher_id,
            "instructor": (
                f"{course.instructor_first_name or 'N/A'} {course.instructor_last_name or ''}".strip()
            ),
        }
        for course in courses
    ]

    print("Response data: ", response)  # Debugging line
    return response


# Endpoint to get all registered courses for a specific student
@router.get("/students/{student_id}/courses", response_model=List[CourseResponse])
def get_registered_courses_for_student(student_id: int, db: Session = Depends(get_db)):
    # Query registrations to get course_ids for the student
    registrations = db.query(Registration).filter(Registration.student_id == student_id).all()
    course_ids = [registration.course_id for registration in registrations]

    # If no courses are registered, return an empty list
    if not course_ids:
        return []

    # Query course details for the registered courses
    courses = (
        db.query(
            Course.id,
            Course.name,
            Course.year,
            Course.semester,
            Teacher.id.label("teacher_id"),
            User.first_name.label("instructor_first_name"),
            User.last_name.label("instructor_last_name"),
        )
        .join(Teacher, Course.teacher_id == Teacher.id)
        .join(User, Teacher.user_id == User.id)
        .filter(Course.id.in_(course_ids))
        .all()
    )

    # Format the response
    response = [
        {
            "id": course.id,
            "name": course.name,
            "year": course.year,
            "semester": course.semester,
            "teacher_id": course.teacher_id,
            "instructor": f"{course.instructor_first_name or 'N/A'} {course.instructor_last_name or ''}".strip(),
        }
        for course in courses
    ]

    return response

#Endpoint to register a course
@router.post("/students/registercourse", response_model=RegistrationResponse)
def register_course_for_student(register: RegistrationCreate, db: Session = Depends(get_db)):
    try:
        # Check if the student is already registered for the course
        existing_registration = db.query(Registration).filter(
            Registration.student_id == register.student_id,
            Registration.course_id == register.course_id
        ).first()
        if existing_registration:
            raise HTTPException(status_code=400, detail="Student is already registered for this course")

        # Proceed with registration
        new_registration = Registration(**register.dict())
        db.add(new_registration)
        db.commit()
        db.refresh(new_registration)
        return {
            "id": new_registration.id,
            "student_id": new_registration.student_id,
            "course_id": new_registration.course_id
        }
    except Exception as e:
        print(f"Registration Error: {e}")  # Log error for debugging
        raise HTTPException(status_code=500, detail=f"Failed to register the course: {str(e)}")



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


# ✅ Endpoint to get final attendance for a specific student and course
@router.get("/final_attendance/{course_id}/{student_id}", response_model=List[StudentFinalAttendance])
def get_sessions(course_id: int, student_id: int, db: Session = Depends(get_db)):
    try:
        # 🔁 Join Final_Attendance and Sessions on session_id
        attendance = db.query(
            Final_Attendance.id,
            Final_Attendance.student_id,
            Final_Attendance.check_in_time,
            Final_Attendance.time_in_class,
            Final_Attendance.session_id,
            Sessions.date.label("session_date"),
            Final_Attendance.status
        ).join(Sessions, Final_Attendance.session_id == Sessions.id
        ).filter(
            and_(
                Sessions.course_id == course_id,
                Final_Attendance.student_id == student_id
            )
        ).all()

        if not attendance:
            return attendance  # it will be an empty list if nothing found

        return attendance

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# # Endpoint for students to record attendance for a specific course (not used)
# @router.post("/students/{student_id}/courses/{course_id}/attendance", response_model=AttendanceResponse)
# def record_attendance(student_id: int, course_id: int, db: Session = Depends(get_db)):
#     # Check if the student is registered for the course
#     registration = db.query(Registration).filter(
#         Registration.student_id == student_id,
#         Registration.course_id == course_id
#     ).first()
    
#     if not registration:
#         raise HTTPException(status_code=400, detail="Student not registered for this course")

#     # Record attendance
#     attendance = AttendanceLog(
#         student_id=student_id,
#         course_id=course_id,
#         date=date.today(),
#         status="Present"
#     )
#     db.add(attendance)
#     db.commit()
#     db.refresh(attendance)
#     return attendance


# #Endpoint for teacher to create a new session and record initial attendance as absent
# @router.post("/teacher/newSession/{course_id}",status_code=status.HTTP_204_NO_CONTENT)
# def new_session(course_id: int, db: Session = Depends(get_db)):
    
#     create_session= Sessions(course_id = course_id, date = date.today())
#     db.add(create_session)
#     db.commit()
#     db.refresh(create_session)

#     registered_students = db.query(Registration.student_id).filter(Registration.course_id == course_id).all()
#     if not registered_students:
#         raise HTTPException(status_code=400, detail="No Students Registered for this course")

#     student_ids = [student_id[0] for student_id in registered_students]
#     attendance_records = [
#         AttendanceLog(student_id=student_id, session_id=create_session.id, status="Absent")
#         for student_id in student_ids
#     ]
#     db.bulk_save_objects(attendance_records)
#     db.commit()
#     db.refresh()
#     return {"message": "Session Initiated successfully"}


# #Endpoint for teacher to record check-in attendance
# @router.post("/teacher/record_attendance/check-in", status_code=status.HTTP_204_NO_CONTENT)
# def record_attendance(record: RecordAttendance, db: Session = Depends(get_db)):
#     attendance_record = db.query(AttendanceLog).filter(AttendanceLog.student_id == record.student_id,AttendanceLog.session_id == record.session_id).first()
#     if not attendance_record:
#         raise HTTPException(
#             status_code=404, 
#             detail="Student not registered in class"
#         )
#     attendance_record.status = "Present"
#     attendance_record.check_in = datetime.now().time()
#     db.commit()
#     db.refresh(attendance_record)
#     return {"message": "Checked-in successfully"}

# #Endpoint for teacher to record check-out attendance
# @router.post("/teacher/record_attendance/check-out", status_code=status.HTTP_204_NO_CONTENT)
# def record_attendance(record: RecordAttendance, db: Session = Depends(get_db)):
#     attendance_record = db.query(AttendanceLog).filter(AttendanceLog.student_id == record.student_id,AttendanceLog.session_id == record.session_id).first()
#     if not attendance_record:
#         raise HTTPException(
#             status_code=404, 
#             detail="Student not registered in class"
#         )
#     attendance_record.status = "Early Leave"
#     attendance_record.check_out = datetime.now().time()
#     db.commit()
#     db.refresh(attendance_record)
#     return {"message": "Checked-out successfully"}



# Endpoint to store a new attendance log
@router.post("/attendance/log", status_code=status.HTTP_201_CREATED)
def create_attendance_log(log: RecordAttendance, db: Session = Depends(get_db)):
    # Query the database to count rows with the same session_id and student_id
    log_count = db.query(func.count(AttendanceLog.id)).filter(
        AttendanceLog.student_id == log.student_id,
        AttendanceLog.session_id == log.session_id
    ).scalar()

    # Create a new attendance log entry
    new_log = AttendanceLog(
        student_id=log.student_id,
        session_id=log.session_id,
        timestamp=datetime.now()  # Automatically set the current timestamp
    )
    
    # Add and commit the new log to the database
    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    # Determine the response message based on the count of existing logs
    if log_count == 0 or log_count % 2 == 0:
        message = "Checkin successful"
    else:
        message = "Checkout successful"
    
    return {"message": message, "log_id": new_log.id}


# Endpoint for teacher to create a new session
@router.post("/teacher/newSession/{course_id}", status_code=status.HTTP_201_CREATED)
def new_session(course_id: int, db: Session = Depends(get_db)):
    # Create a new session
    create_session = Sessions(course_id=course_id, date=date.today(), session_status = "Open")
    db.add(create_session)
    db.commit()
    db.refresh(create_session)

    # Return the newly created session ID
    return {"message": "Session created successfully", "session_id": create_session.id}


#Endpoint to end a session
@router.post("/teacher/EndSession/{course_id}/{session_id}", status_code=status.HTTP_201_CREATED)
def end_session(session_id:int, course_id:int , db: Session = Depends(get_db)):
    #End the session
    # Query the session from the database
    db_session = db.query(Sessions).filter(Sessions.id == session_id).first()

    # Check if the session exists
    if not db_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session with id {session_id} not found"
        )

    # Update the session status to "ended"
    db_session.status = "Ended"  # Assuming `SessionStatus` is an enum or a string
    db.commit()  # Save changes to the database




    return {"message": f"Session {session_id} has been ended successfully"}

# Endpoint to get all sessions for a specific course
@router.get("/teacher/GetSessions/{course_id}/", response_model=List[SessionResponce])
def get_courses_for_teacher(course_id: int, db: Session = Depends(get_db)):
    course_sessions = db.query(Sessions).filter(Sessions.course_id == course_id).all()
    return course_sessions

# Endpoint to get all final attendacne for a specific sessions
@router.get("/teacher/GetAttendance/{session_id}/", response_model = List[FinalAttendance])
def get_final_attendance(session_id: int, db: Session = Depends(get_db)):
    finalattendance= db.query(final_attendance).filter(final_attendance.session_id ==session_id).all()

    if not finalattendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No attendance records found for session with id {session_id}"
        )
    
    return finalattendance
