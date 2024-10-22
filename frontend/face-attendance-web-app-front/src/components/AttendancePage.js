import React from 'react';
import './AttendancePage.css'; // Create a CSS file for this component

const AttendancePage = () => {
  return (
    <div className="attendance-page">
      <header className="header">
        <h2>Attendance System</h2>
      </header>
      
      <div className="attendance-container">
        <h1>Welcome to the Attendance System</h1>
        <p>Please choose an action below:</p>
        
        <div className="action-buttons">
          <button className="take-attendance-button">Take Attendance</button>
          <button className="view-attendance-button">View Attendance</button>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>Privacy Policy</p>
          <p>Help</p>
          <p>Contact Us</p>
        </div>
      </footer>
    </div>
  );
};

export default AttendancePage;
