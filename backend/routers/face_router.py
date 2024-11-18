from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import face_recognition
import base64
import os
from sqlalchemy.orm import Session
from database import get_db
from models import Student

router = APIRouter()

class FaceData(BaseModel):
    image: str  # Base64 encoded image
    student_id: int  # The ID of the student

@router.post("/face-encode")
async def face_encode(face_data: FaceData, db: Session = Depends(get_db)):
    try:
        # Process image data
        image_data = face_data.image.split(",")[1]
        image_bytes = base64.b64decode(image_data)
        file_path = "temp_image.png"

        # Save the image temporarily
        with open(file_path, "wb") as file:
            file.write(image_bytes)

        # Load the image for face recognition
        image = face_recognition.load_image_file(file_path)
        encodings = face_recognition.face_encodings(image)

        # Check if a face is detected
        if len(encodings) == 0:
            os.remove(file_path)  # Clean up temp file
            return {"success": False, "message": "No face detected"}

        # Save the encoding in the database
        face_encoding = encodings[0]  # Keep as binary
        student = db.query(Student).filter(Student.id == face_data.student_id).first()
        if not student:
            os.remove(file_path)
            return {"success": False, "message": "Student not found"}

        student.face_data = face_encoding.tobytes()  # Save as binary
        db.commit()
        os.remove(file_path)
        return {"success": True, "message": "Face registered successfully"}
    except Exception as e:
        return {"success": False, "message": f"Error: {str(e)}"}

