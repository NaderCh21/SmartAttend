import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./API";
import "./MasterComponent.css"; // Add this line to import the new CSS file

function MasterComponent({ onFaceCapture, onLoginSuccess, onLogoutSuccess }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastFrame, setLastFrame] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Set up the webcam stream
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      } catch (error) {
        console.error("Error accessing the webcam: ", error);
      }
    };
    if (!isStreaming && showPopup) {
      setupCamera();
    }
  }, [isStreaming, showPopup]);

  // Capture image from the webcam
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, 400, 300);
      canvasRef.current.toBlob((blob) => {
        setLastFrame(URL.createObjectURL(blob));
        if (onFaceCapture) {
          onFaceCapture(blob);
        }
      });
    } else {
      console.error("Video or Canvas element is not available for face capture.");
    }
  };

  const handleLogin = () => {
    captureImage();
    const apiUrl = `${API_BASE_URL}/login`;
    sendImageToAPI(apiUrl, (response) => {
      if (response.match_status) {
        onLoginSuccess(response.user);
      } else {
        alert("Unknown user! Please try again or register.");
      }
    });
  };

  const handleLogout = () => {
    captureImage();
    const apiUrl = `${API_BASE_URL}/logout`;
    sendImageToAPI(apiUrl, (response) => {
      if (response.match_status) {
        onLogoutSuccess(response.user);
      } else {
        alert("Unknown user! Please try again or register.");
      }
    });
  };

  const sendImageToAPI = (apiUrl, callback) => {
    canvasRef.current.toBlob((blob) => {
      const file = new File([blob], "webcam-frame.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("file", file);

      axios.post(apiUrl, formData, { headers: { "Content-Type": "multipart/form-data" } })
        .then((response) => callback(response.data))
        .catch((error) => console.error("Error sending image to API:", error));
    });
  };

  return (
    <div className="master-component">
      <button onClick={() => setShowPopup(true)} className="open-popup-button">Open Camera</button>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-popup" onClick={() => setShowPopup(false)}>&times;</span>
            <Webcam videoRef={videoRef} canvasRef={canvasRef} />
            <Buttons
              handleLogin={handleLogin}
              handleLogout={handleLogout}
              captureImage={captureImage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Webcam({ videoRef, canvasRef }) {
  return (
    <div className="webcam">
      <canvas ref={canvasRef} width={400} height={300} style={{ display: "none" }} />
      <video ref={videoRef} autoPlay playsInline width={400} height={300} />
    </div>
  );
}

function Buttons({ handleLogin, handleLogout, captureImage }) {
  return (
    <div className="buttons-container">
      <button onClick={captureImage} className="styled-button">Register Face</button>
    </div>
  );
}

export default MasterComponent;
