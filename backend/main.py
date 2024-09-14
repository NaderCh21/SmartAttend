import os
import uuid
import pickle
import datetime
import time
import shutil

import cv2
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import face_recognition
import starlette

# Directory paths
ATTENDANCE_LOG_DIR = './logs'
DB_PATH = './db'
for dir_ in [ATTENDANCE_LOG_DIR, DB_PATH]:
    if not os.path.exists(dir_):
        os.mkdir(dir_)

app = FastAPI()

# CORS Middleware
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to save files
def save_file(file: UploadFile, filename: str) -> str:
    try:
        with open(filename, "wb") as f:
            f.write(file.file.read())
        print(f"File saved as: {filename}")
        return filename
    except Exception as e:
        print(f"Error saving file: {e}")
        raise HTTPException(status_code=500, detail="Error saving file")

@app.post("/login")
async def login(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4()}.png"
    filepath = save_file(file, filename)
    
    user_name, match_status = recognize(cv2.imread(filepath))

    if match_status:
        epoch_time = time.time()
        date = time.strftime('%Y%m%d', time.localtime(epoch_time))
        log_file = os.path.join(ATTENDANCE_LOG_DIR, f'{date}.csv')
        with open(log_file, 'a') as f:
            f.write(f'{user_name},{datetime.datetime.now()},IN\n')
        print(f"Log written: {user_name} checked in")

    return {'user': user_name, 'match_status': match_status}

@app.post("/logout")
async def logout(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4()}.png"
    filepath = save_file(file, filename)
    
    user_name, match_status = recognize(cv2.imread(filepath))

    if match_status:
        epoch_time = time.time()
        date = time.strftime('%Y%m%d', time.localtime(epoch_time))
        log_file = os.path.join(ATTENDANCE_LOG_DIR, f'{date}.csv')
        with open(log_file, 'a') as f:
            f.write(f'{user_name},{datetime.datetime.now()},OUT\n')
        print(f"Log written: {user_name} checked out")

    return {'user': user_name, 'match_status': match_status}

@app.post("/register_new_user")
async def register_new_user(file: UploadFile = File(...), text: str = None):
    if text is None:
        raise HTTPException(status_code=400, detail="Text parameter is required")

    filename = f"{uuid.uuid4()}.png"
    filepath = save_file(file, filename)
    
    shutil.copy(filepath, os.path.join(DB_PATH, f'{text}.png'))

    img = cv2.imread(filepath)
    embeddings = face_recognition.face_encodings(img)

    with open(os.path.join(DB_PATH, f'{text}.pickle'), 'wb') as file_:
        pickle.dump(embeddings, file_)
    print(f"User registered: {text}")

    os.remove(filepath)
    return {'registration_status': 200}

@app.get("/get_attendance_logs")
async def get_attendance_logs():
    filename = 'out.zip'
    shutil.make_archive(filename[:-4], 'zip', ATTENDANCE_LOG_DIR)
    return FileResponse(filename, media_type='application/zip', filename=filename)

def recognize(img):
    embeddings_unknown = face_recognition.face_encodings(img)
    if len(embeddings_unknown) == 0:
        return 'no_persons_found', False
    embeddings_unknown = embeddings_unknown[0]

    match = False
    j = 0

    db_dir = sorted([j for j in os.listdir(DB_PATH) if j.endswith('.pickle')])
    while not match and j < len(db_dir):
        path_ = os.path.join(DB_PATH, db_dir[j])
        with open(path_, 'rb') as file:
            embeddings = pickle.load(file)[0]
        match = face_recognition.compare_faces([embeddings], embeddings_unknown)[0]
        j += 1

    if match:
        return db_dir[j - 1][:-7], True
    else:
        return 'unknown_person', False
