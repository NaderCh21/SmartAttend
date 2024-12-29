import React from 'react';
import './CourseCard.css';
import { FaPlus } from 'react-icons/fa';

const CourseCard = ({ course, isRegistered, onRegister }) => (
  <div className="course-card">
    <h3>{course.name}</h3>
    {!isRegistered ? (
      <button className="register-btn" onClick={() => onRegister(course.id)}>
        <FaPlus /> Register
      </button>
    ) : (
      <p className="registered-label">Already Registered</p>
    )}
  </div>
);

export default CourseCard;
