# utils.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

import face_recognition
import base64
import io
from PIL import Image

def encode_face(face_data):
    image_data = base64.b64decode(face_data)
    image = Image.open(io.BytesIO(image_data))
    image_np = face_recognition.load_image_file(image)

    # Get face encodings
    encodings = face_recognition.face_encodings(image_np)
    if not encodings:
        raise ValueError("No face found in the image.")
    return encodings[0]  # Return the first face encoding
