from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Teacher, User, Course, Sessions, Registration, Student, AttendanceLog, Final_Attendance
from schemas import TeacherResponse , CourseResponse, CourseCreate,SessionResponce, FinalAttendance
from typing import List
from datetime import date, datetime, timedelta
from sqlalchemy.orm import aliased

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


# Endpoint to create a new course
@router.post("/createcourse/")
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    try:
        # Create a new Course object from the request data
        new_course = Course(
            name=course.name,
            semester=course.semester,
            year=course.year,
            teacher_id=course.teacher_id,
        )

        # Add the new course to the database session
        db.add(new_course)
        db.commit()  # Save the changes to the database
        db.refresh(new_course)  # Refresh the instance to get the auto-generated ID

        # Return a success message
        return {"message": "Course created successfully"}

    except Exception as e:
        # Rollback the transaction in case of an error
        db.rollback()
        # Raise an HTTPException with a 400 status code and error message
        raise HTTPException(status_code=400, detail=str(e))
    

    #Endpoint to create a new session
@router.post("/new_session/{course_id}", status_code=status.HTTP_201_CREATED)
def new_session(course_id: int, db: Session = Depends(get_db)):
    # Create a new session
    create_session = Sessions(course_id=course_id, date=date.today(), start_time=datetime.now() , session_status = "Open")
    db.add(create_session)
    db.commit()
    db.refresh(create_session)

    # Return the newly created session ID
    return {"message": "Session created successfully", "session_id": create_session.id}


# Endpoint to get all sessions for a specific course
@router.get("/GetSessions/{course_id}", response_model=List[SessionResponce])
def get_sessions(course_id: int, db: Session = Depends(get_db)):
    try:
        # Fetch all sessions for the specified course
        sessions = db.query(Sessions).filter(Sessions.course_id == course_id).all()
        if not sessions:
            raise HTTPException(status_code=404, detail="No sessions found for this course")

        return sessions

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.get("/final_attendance/{session_id}", response_model=List[FinalAttendance])
def get_final_attendance(session_id: int, db: Session = Depends(get_db)):
    try:
        # Aliases for readability (optional)
        student_alias = aliased(Student)
        user_alias = aliased(User)

        results = (
            db.query(
                Final_Attendance.id.label("attendance_id"),
                Final_Attendance.student_id,
                Final_Attendance.check_in_time,
                Final_Attendance.time_in_class,
                Final_Attendance.status,
                user_alias.first_name,
                user_alias.last_name,
            )
            .join(student_alias, Final_Attendance.student_id == student_alias.id)
            .join(user_alias, student_alias.user_id == user_alias.id)
            .filter(Final_Attendance.session_id == session_id)
            .all()
        )

        # Return list of dicts
        return [
            {
                "id": r.attendance_id,
                "student_id": r.student_id,
                "check_in_time": r.check_in_time,
                "time_in_class": r.time_in_class,
                "status": r.status,
                "student_name": f"{r.first_name} {r.last_name}",
                "session_id":session_id
            }
            for r in results
        ]

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


## End a Session
@router.post("/EndSession/{course_id}/{session_id}", status_code=status.HTTP_201_CREATED)
def end_session(session_id:int, course_id:int, db: Session = Depends(get_db)):
    try:
        print(f"🔍 Attempting to end session {session_id} for course {course_id}")
        # Query the session from the database
        db_session = db.query(Sessions).filter(Sessions.id == session_id).first()
        print(f"📦 Session fetched from DB: {db_session}")
        # Check if the session exists
        if not db_session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Session with id {session_id} not found"
            )

        # Update the session status to "ended"
        db_session.session_status = "Ended"
        db.commit()

        # Get the list of students registered in the course
        registrations = db.query(Registration).filter(Registration.course_id == course_id).all()
        print(f"👥 Total students registered in course {course_id}: {len(registrations)}")
        for registration in registrations:
            student_id = registration.student_id
            student = db.query(Student).filter(Student.id == student_id).first()
            
            if not student:
                continue

            # Get attendance logs ordered by timestamp
            attendance_logs = db.query(AttendanceLog).filter(
                AttendanceLog.session_id == session_id,
                AttendanceLog.student_id == student_id
            ).order_by(AttendanceLog.timestamp).all()
            print(f"➡️ Processing student {student_id}")
            print(f"  Attendance logs: {[log.timestamp for log in attendance_logs]}")

            if not attendance_logs:
                # If no logs, mark as absent
                final_attendance = Final_Attendance(
                    student_id=student_id,
                    check_in_time=None,
                    time_in_class=None,
                    status="Absent",
                    session_id=session_id
                )
            else:
                # Calculate check_in_time (first log)
                check_in_time = attendance_logs[0].timestamp

                # Calculate time_in_class
                time_in_class = timedelta(0)
                i = 0
                while i < len(attendance_logs):
                    if i + 1 < len(attendance_logs):
                        check_in = attendance_logs[i].timestamp
                        check_out = attendance_logs[i + 1].timestamp
                        time_in_class += check_out - check_in
                        i += 2
                    else:
                        # Last check-in without check-out
                        check_in = attendance_logs[i].timestamp
                        session_end_time = datetime.now()  # Fixed: added parentheses
                        time_in_class += session_end_time - check_in
                        break

                # Create final attendance record
                final_attendance = Final_Attendance(
                    student_id=student_id,
                    session_id=session_id,
                    check_in_time=check_in_time,
                    time_in_class=time_in_class,
                    status="Present" if time_in_class.total_seconds() > 0 else "Absent"
                )
                print(f"📝 Creating final attendance record for student {student_id}:")
                print(f"  Check-in: {check_in_time}, Time in class: {time_in_class}, Status: {final_attendance.status}")

            db.add(final_attendance)

        db.commit()
        return {"message": f"Session {session_id} has been ended successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while ending the session: {str(e)}"
        )
    

@router.post("/EndSession2/{course_id}/{session_id}", status_code=status.HTTP_200_OK)
def end_session(course_id: int, session_id: int, db: Session = Depends(get_db)):
    
        print(f"🔍 Attempting to end session {session_id} for course {course_id}")
        # Query the session from the database
        db_session = db.query(Sessions).filter(Sessions.id == session_id).first()
        print(f"📦 Session fetched from DB: {db_session}")
        # Check if the session exists
        if not db_session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Session with id {session_id} not found"
            )

        # Update the session status to "ended"
        db_session.session_status = "Ended"
        #db.commit()


        # Get the list of students registered in the course
        registrations = db.query(Registration).filter(Registration.course_id == course_id).all()
        print(f"👥 Total students registered in course {course_id}: {len(registrations)}")
        for registration in registrations:
            student_id = registration.student_id
            student = db.query(Student).filter(Student.id == student_id).first()
            
            if not student:
                continue

            # Get attendance logs ordered by timestamp
            attendance_logs = db.query(AttendanceLog).filter(
                AttendanceLog.session_id == session_id,
                AttendanceLog.student_id == student_id
            ).order_by(AttendanceLog.timestamp).all()
            print(f"➡️ Processing student {student_id}")
            print(f"  Attendance logs: {[log.timestamp for log in attendance_logs]}")

            if not attendance_logs:
                # If no logs, mark as absent
                final_attendance = Final_Attendance(
                    student_id=student_id,
                    check_in_time=None,
                    time_in_class=None,
                    status="Absent",
                    session_id=session_id
                )
            #db.add(final_attendance)
            else:
                # Calculate check_in_time (first log)
                check_in_time = attendance_logs[0].timestamp

                # Calculate time_in_class
                time_in_class = timedelta(0)
                i = 0
                while i < len(attendance_logs):
                    if i + 1 < len(attendance_logs):
                        check_in = attendance_logs[i].timestamp
                        check_out = attendance_logs[i + 1].timestamp
                        time_in_class += check_out - check_in
                        i += 2
                    else:
                        # Last check-in without check-out
                        check_in = attendance_logs[i].timestamp
                        session_end_time = datetime.now()  # Fixed: added parentheses
                        time_in_class += session_end_time - check_in
                        break

                # Create final attendance record
                final_attendance = Final_Attendance(
                    student_id=student_id,
                    session_id=session_id,
                    check_in_time=check_in_time,
                    time_in_class=time_in_class,
                    status="Present" if time_in_class.total_seconds() > 0 else "Absent"
                )
                print(f"📝 Creating final attendance record for student {student_id}:")
                print(f"  Check-in: {check_in_time}, Time in class: {time_in_class}, Status: {final_attendance.status}")
            
            db.add(final_attendance)    

        db.commit()
        return {"message": f"Session {session_id} has been ended successfullyyy"}
    
