import React, { useState, useEffect } from 'react';
import '../../style/CourseCard.css';
import { FaPlus, FaCheckCircle, FaUserTie, FaCalendarAlt, FaRegClock } from 'react-icons/fa';

const CourseCard = ({ course, isRegistered, onRegister }) => {
  const [isRegisteredState, setIsRegisteredState] = useState(isRegistered);
  const [showPopup, setShowPopup] = useState(false);

  // Sync state when the parent updates the `isRegistered` prop
  useEffect(() => {
    setIsRegisteredState(isRegistered);
  }, [isRegistered]);

  const handleRegister = () => {
    onRegister(course.id); // Call parent function to register
    setShowPopup(true);

    // Hide the popup after a short delay
    setTimeout(() => setShowPopup(false), 2000);
  };

  return (
    <div className="course-card">
      {/* Popup for registration success */}
      {showPopup && (
        <div className="popup-success">
          <FaCheckCircle size={20} /> Successfully Registered!
        </div>
      )}
      <div className="course-image">
        <FaUserTie size={40} color="#3f51b5" />
      </div>
      <h3>{course.name}</h3>
      <p>
        <strong><FaUserTie /> Instructor:</strong> {course.instructor || 'N/A'}
      </p>
      <p>
        <strong><FaCalendarAlt /> Semester:</strong> {course.semester}
      </p>
      <p>
        <strong><FaRegClock /> Year:</strong> {course.year}
      </p>
      <p>
        <strong>Credits:</strong> 3
      </p>
      <div className="course-footer">
        {!isRegisteredState ? (
          <button
            className="register-btn"
            onClick={handleRegister}
            disabled={showPopup} // Disable button during popup
          >
            <FaPlus /> {showPopup ? 'Processing...' : 'Register'}
          </button>
        ) : (
          <button className="registered-btn" disabled>
            <FaCheckCircle /> Registered
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
