import React from 'react';
import '../style/AttendanceCircle.css'
const AttendanceCircle = ({ percentage, name }) => (
  <div className="attendance-item">
    <div className="attendance-circle">
      {percentage ? `${percentage}%` : 'N/A'}
    </div>
    <p>{name}</p>
  </div>
);

export default AttendanceCircle;
