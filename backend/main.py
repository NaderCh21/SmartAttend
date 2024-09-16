from fastapi import FastAPI, UploadFile, File, Form
import shutil
import os
import uuid
import pickle
import cv2
import face_recognition
import mysql.connector
from pydantic import BaseModel
import time
import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow requests from any origin (adjust this for production use)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Can also use ["*"] to allow all origins, but it's not recommended for production
    allow_credentials=True,
    allow_methods=["*"],  # Adjust if you want to restrict allowed HTTP methods (e.g., GET, POST)
    allow_headers=["*"],  # Adjust if you want to restrict allowed headers
)

# Database configuration
DB_CONFIG = {
    'user': 'root',
    'password': 'root',
    'host': 'localhost',
    'database': 'attendance_db'
}

# Paths
DB_PATH = './db'  # Changed for cross-platform compatibility
ATTENDANCE_LOG_DIR = './logs'

# Ensure DB_PATH and ATTENDANCE_LOG_DIR directories exist
os.makedirs(DB_PATH, exist_ok=True)
os.makedirs(ATTENDANCE_LOG_DIR, exist_ok=True)

def get_db_connection():
    """Establish a connection to the MySQL database."""
    return mysql.connector.connect(**DB_CONFIG)

@app.post("/register_new_user")
async def register_new_user(file: UploadFile = File(...), text: str = Form(...)):
    try:
        # Generate unique filename
        file.filename = f"{uuid.uuid4()}.png"
        contents = await file.read()

        # Save the uploaded file temporarily
        with open(file.filename, "wb") as f:
            f.write(contents)

        # Check if the face can be encoded
        image = cv2.imread(file.filename)
        embeddings = face_recognition.face_encodings(image)
        if len(embeddings) == 0:
            os.remove(file.filename)
            return {'registration_status': 'No face detected'}

        # Save the image and embeddings
        shutil.copy(file.filename, os.path.join(DB_PATH, f'{text}.png'))
        with open(os.path.join(DB_PATH, f'{text}.pickle'), 'wb') as file_:
            pickle.dump(embeddings, file_)

        # Remove the temporary file
        os.remove(file.filename)

        # Add user to the database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO students (name) VALUES (%s)", (text,))
        conn.commit()

        cursor.close()
        conn.close()

        return {'registration_status': 200}

    except mysql.connector.IntegrityError:
        return {'registration_status': 'User already exists'}
    
    except Exception as e:
        return {'error': str(e)}

@app.post("/login")
async def login(file: UploadFile = File(...)):
    file.filename = f"{uuid.uuid4()}.png"
    contents = await file.read()

    # Save the file
    with open(file.filename, "wb") as f:
        f.write(contents)

    # Recognize the user
    user_name, match_status = recognize(cv2.imread(file.filename))

    if match_status:
        epoch_time = time.time()
        date = time.strftime('%Y%m%d', time.localtime(epoch_time))
        
        # Fetch student ID
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM students WHERE name = %s", (user_name,))
        student_id = cursor.fetchone()
        student_id = student_id[0] if student_id else None

        # Log attendance
        if student_id:
            with open(os.path.join(ATTENDANCE_LOG_DIR, f'{date}.csv'), 'a') as f:
                f.write(f'{user_name},{datetime.datetime.now()},IN\n')
            
            cursor.execute("INSERT INTO attendance_logs (student_id, timestamp, status) VALUES (%s, NOW(), 'IN')", (student_id,))
            conn.commit()

        cursor.close()
        conn.close()

    os.remove(file.filename)

    return {'user': user_name, 'match_status': match_status}

@app.post("/logout")
async def logout(file: UploadFile = File(...)):
    file.filename = f"{uuid.uuid4()}.png"
    contents = await file.read()

    # Save the file
    with open(file.filename, "wb") as f:
        f.write(contents)

    # Recognize the user
    user_name, match_status = recognize(cv2.imread(file.filename))

    if match_status:
        epoch_time = time.time()
        date = time.strftime('%Y%m%d', time.localtime(epoch_time))
        
        # Fetch student ID
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM students WHERE name = %s", (user_name,))
        student_id = cursor.fetchone()
        student_id = student_id[0] if student_id else None

        # Log attendance
        if student_id:
            with open(os.path.join(ATTENDANCE_LOG_DIR, f'{date}.csv'), 'a') as f:
                f.write(f'{user_name},{datetime.datetime.now()},OUT\n')
            
            cursor.execute("INSERT INTO attendance_logs (student_id, timestamp, status) VALUES (%s, NOW(), 'OUT')", (student_id,))
            conn.commit()

        cursor.close()
        conn.close()

    os.remove(file.filename)

    return {'user': user_name, 'match_status': match_status}

def recognize(image):
    """Recognize the user in the provided image."""
    known_face_encodings = []
    known_face_names = []
    
    # Load known encodings
    for filename in os.listdir(DB_PATH):
        if filename.endswith(".pickle"):
            with open(os.path.join(DB_PATH, filename), 'rb') as file_:
                known_face_encodings.append(pickle.load(file_))
                known_face_names.append(filename.split('.')[0])

    known_face_encodings = [encoding for encodings in known_face_encodings for encoding in encodings]

    face_locations = face_recognition.face_locations(image)
    face_encodings = face_recognition.face_encodings(image, face_locations)

    for face_encoding in face_encodings:
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "Unknown"

        if True in matches:
            first_match_index = matches.index(True)
            name = known_face_names[first_match_index]

        return name, name != "Unknown"

    return "Unknown", False
