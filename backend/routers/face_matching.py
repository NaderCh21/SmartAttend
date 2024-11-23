import json
import os
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import face_recognition
import base64
from sqlalchemy.orm import Session
from database import get_db
from models import Student
import numpy as np

router = APIRouter()

class FaceMatchData(BaseModel):
    image: str  # Base64 encoded image

@router.post("/recognize")
async def recognize_face(face_data: FaceMatchData, db: Session = Depends(get_db)):
    file_path = "temp_image.png"
    try:
        # Decode the Base64 image
        image_data = face_data.image.split(",")[1]
        image_bytes = base64.b64decode(image_data)

        # Save the image temporarily
        with open(file_path, "wb") as file:
            file.write(image_bytes)

        # Load the image and extract face encodings
        image = face_recognition.load_image_file(file_path)
        encodings = face_recognition.face_encodings(image)

        if not encodings:
            return {"success": False, "message": "No face detected in the image"}

        captured_encoding = encodings[0]

        # Fetch stored students and compare encodings
        students = db.query(Student).filter(Student.face_data != None).all()
        for student in students:
            try:
                # Deserialize stored face data from JSON
                known_encoding = np.frombuffer(student.face_data)
                match = face_recognition.compare_faces([known_encoding], captured_encoding)[0]
                if match:
                    return {
                        "success": True,
                        "message": f"Recognized as {student.user.first_name} {student.user.last_name}",
                        "student_id": student.id,
                    }
            except Exception as decode_error:
                print(f"Error decoding face data for student {student.id}: {decode_error}")

        return {"success": False, "message": "Face not recognized"}
    except Exception as e:
        print("Error:", str(e))
        return {"success": False, "message": f"Error: {str(e)}"}
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
