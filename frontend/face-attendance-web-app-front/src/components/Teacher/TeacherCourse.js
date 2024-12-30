import React from 'react';
import { useParams } from 'react-router-dom';
import '../../style/TeacherCourse.css';

const TeacherCourse = () => {
  const { courseName } = useParams();

  const courseData = {
    os: { name: 'Operating Systems', year: '2020', semester: 'Spring' },
    database: { name: 'Database Systems', year: '2021', semester: 'Fall' },
    'advance-db': { name: 'Advanced Database', year: '2021', semester: 'Fall' },
    'web-dev': { name: 'Web Development', year: '2021', semester: 'Spring' },
  };

  const course = courseData[courseName] || {};

  return (
    <div className="teacher-course-page">
      <h1>{course.name || 'Course Info'}</h1>
      <div className="course-details">
        <p><strong>Course Name:</strong> {course.name}</p>
        <p><strong>Year:</strong> {course.year}</p>
        <p><strong>Semester:</strong> {course.semester}</p>
      </div>
    </div>
  );
};

export default TeacherCourse;
