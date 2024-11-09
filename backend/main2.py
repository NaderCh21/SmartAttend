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


from routes.auth import router as auth_router
app.include_router(auth_router)

from routes.signup import router as signup_router
app.include_router(signup_router)

from routes.createCourse import router as createCourse_router
app.include_router(createCourse_router)

# need to do an impoty for each filee

# Allow requests from any origin (adjust this for production use)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "file://"],  # Can also use ["*"] to allow all origins, but it's not recommended for production
    allow_credentials=True,
    allow_methods=["*"],  # Adjust if you want to restrict allowed HTTP methods (e.g., GET, POST)
    allow_headers=["*"],  # Adjust if you want to restrict allowed headers
)