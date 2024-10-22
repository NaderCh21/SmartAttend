import React from "react";
import "./HomePage.css";
import MainImage from '../assets/MainImage.png';
import DigitalEyeIcon from '../assets/digital_eye_icon.png';
import DigitalLockIcon from '../assets/digital_lock_icon.png';

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="header">
        <h2>Face Recognition Attendance System</h2>
      </header>

      <div className="main-content1">
        <div className="content-left">
          <img src={MainImage} alt="Main Eye Recognition" className="main-image" />
        </div>

        <div className="content-right">
          <h1 className="hero-title">Face Recognition Attendance System</h1>
          <p className="hero-subtitle">Log in to manage your attendance and access other features.</p>
          <div className="buttons">
            <button className="get-started-button">Get Started</button>
            <button className="login-button">Log In as Admin</button>
          </div>
        </div>
      </div>

      <div className="graphics">
        <div className="graphic-item">
          <img src={DigitalEyeIcon} alt="Digital Eye Icon" />
          <p>Facial Recognition</p>
        </div>
        <div className="graphic-item">
          <img src={DigitalLockIcon} alt="Security Lock Icon" />
          <p>Security Lock</p>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>Privacy Policy</p>
          <p>Terms of Use</p>
          <p>Help</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
