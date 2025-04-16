import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

const FaceRecognition = ({ onClose, sessionId }) => {
  const videoRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const captureFrameAndDetectFace = async () => {
    try {
      setIsProcessing(true);

      if (!videoRef.current) return;

      // Capture frame from the video
      const canvas = document.createElement("canvas");
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/png"); // Convert to Base64

      // Send the captured frame to the backend for recognition
      const response = await axios.post(`http://localhost:8000/face_matching_testing/recognize/${sessionId}`,
        { image: imageData },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Display recognition result
      if (response.data.success) {
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error during face detection:", error);
      alert("An error occurred during face recognition.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="face-recognition-modal" style={modalStyle}>
      <h3>Face Recognition</h3>
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
          onClick={captureFrameAndDetectFace}
          disabled={isProcessing}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: isProcessing ? "#ccc" : "#4caf50",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          {isProcessing ? "Processing..." : "Detect Face"}
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

export default FaceRecognition;

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
