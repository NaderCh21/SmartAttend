import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentLayout from './StudentLayout';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [availableCourses, setAvailableCourses] = useState([]); // State for all available courses
  const [registeredCourses, setRegisteredCourses] = useState([]); // State for student's registered courses
  const studentId = 1; // Replace with dynamic student ID if needed

  // Fetch all available courses and registered courses on component mount
  useEffect(() => {
    const fetchAvailableCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/courses');
        setAvailableCourses(response.data);
      } catch (error) {
        console.error('Error fetching available courses:', error);
      }
    };

    const fetchRegisteredCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/students/${studentId}/courses`);
        setRegisteredCourses(response.data);
      } catch (error) {
        console.error('Error fetching registered courses:', error);
      }
    };

    fetchAvailableCourses();
    fetchRegisteredCourses();
  }, [studentId]);

  // Function to handle course registration
  const handleCourseRegistration = async (courseId) => {
    try {
      await axios.post(`http://localhost:8000/students/${studentId}/courses`, {
        course_id: courseId,
      });
      // Re-fetch registered courses to update the UI after registration
      const response = await axios.get(`http://localhost:8000/students/${studentId}/courses`);
      setRegisteredCourses(response.data);
    } catch (error) {
      console.error('Error registering for course:', error);
    }
  };

  return (
    <StudentLayout>
      <div className="student-dashboard">
        <h2>Your Registered Courses</h2>
        <div className="attendance-circles">
          {registeredCourses.map((course) => (
            <div className="attendance-item" key={course.id}>
              <div className="attendance-circle">
                {/* Assuming attendance percentage is part of the response */}
                {course.percentage ? `${course.percentage}%` : 'N/A'}
              </div>
              <p>{course.name}</p>
            </div>
          ))}
        </div>

        <h2>All Available Courses</h2>
        <div className="course-list">
          {availableCourses.map((course) => (
            <div className="course-item" key={course.id}>
              <p>{course.name}</p>
              {/* Show register button if course is not in the registered courses */}
              {!registeredCourses.find((regCourse) => regCourse.id === course.id) && (
                <button onClick={() => handleCourseRegistration(course.id)}>
                  Register
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
