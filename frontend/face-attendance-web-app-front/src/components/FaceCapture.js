import React, { useRef, useEffect } from "react";
import axios from "axios";

const FaceCapture = ({ onCapture, onClose, studentId }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Start the camera when the component mounts
    startCamera();

    // Stop the camera when the component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check your permissions.");
      onClose(); // Close modal on failure
    }
  };

  const captureImage = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");

    // Debugging: Log the payload
    console.log("Captured Image Data:", imageData);
    console.log("Student ID:", studentId);

    try {
      // Validate studentId
      if (!studentId || typeof studentId !== "number") {
        alert("Invalid student ID.");
        return;
      }

      // Send the captured image to the server for encoding
      const response = await axios.post("http://localhost:8000/face/face-encode", {
        image: imageData,
        student_id: studentId,
      });

      if (response.data.success) {
        alert(response.data.message); // Notify the user of success
        onCapture(imageData); // Notify the parent component
      } else {
        alert(response.data.message); // Notify the user of failure
      }
    } catch (error) {
      console.error("Error during face registration:", error);
      alert("An error occurred while registering your face. Please try again.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach((track) => track.stop());
    }
  };

  return (
    <div className="face-capture-modal" style={modalStyle}>
      <h3>Capture Your Face</h3>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "100%",
          maxHeight: "400px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      ></video>
      <div style={{ textAlign: "center" }}>
        <button
          onClick={captureImage}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Capture
        </button>
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FaceCapture;

// Modal styles
const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 1000,
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  width: "90%",
  maxWidth: "600px",
};
