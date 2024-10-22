import React from 'react';
import StudentLayout from './StudentLayout';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const courses = [
    { name: 'OS', percentage: 100 },
    { name: 'Database', percentage: 100 },
    { name: 'Advance DB', percentage: 100 },
  ];

  return (
    <StudentLayout>
      <div className="student-dashboard">
        <h2>All classes attendance</h2>
        <div className="attendance-circles">
          {courses.map((course) => (
            <div className="attendance-item" key={course.name}>
              <div className="attendance-circle">
                {course.percentage}%
              </div>
              <p>{course.name}</p>
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
