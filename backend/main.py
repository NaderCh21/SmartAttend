from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import auth, course, teacher, face_router , face_matching  , students, face_matching_new , face_matching_testing

app = FastAPI()

# Database creation
Base.metadata.create_all(bind=engine)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust as needed for your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication routes
app.include_router(auth.router)

# Include course routes
app.include_router(course.router, prefix="/courses",tags=["courses"])

# Include teacher routes
app.include_router(teacher.router, prefix="/teachers", tags=["Teachers"])

# Include face encoding routes
app.include_router(face_router.router, prefix="/face", tags=["Face Encoding"])

app.include_router(face_matching.router, prefix="/face-matching", tags=["Face Matching"])

app.include_router(face_matching_new.router, prefix="/face_matching_new", tags=["Face Matching New"])
app.include_router(face_matching_testing.router, prefix="/face_matching_testing", tags=["Face Matching Testing"])
app.include_router(students.router, prefix="/students", tags=["Students"]) 
# To run the app, use the command:
# uvicorn main:app --reload
