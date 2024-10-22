import React from 'react';
import StudentLayout from './StudentLayout';
import { useParams } from 'react-router-dom';
import './StudentCourse.css';

const StudentCourse = () => {
  const { courseName } = useParams();

  const courseData = {
    os: { name: 'Operating Systems', year: '2020', semester: 'Spring' },
    database: { name: 'Database Systems', year: '2020', semester: 'Spring' },
    'advance-db': { name: 'Advanced Database', year: '2020', semester: 'Spring' },
  };

  const course = courseData[courseName] || {};

  return (
    <StudentLayout>
      <div className="student-course-page">
        <h1>{course.name || 'Course Info'}</h1>
        <div className="course-details">
          <p><strong>Course Name:</strong> {course.name}</p>
          <p><strong>Year:</strong> {course.year}</p>
          <p><strong>Semester:</strong> {course.semester}</p>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentCourse;
