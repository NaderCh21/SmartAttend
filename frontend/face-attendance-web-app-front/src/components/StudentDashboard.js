import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentLayout from './StudentLayout';
import './StudentDashboard.css';
import CourseCard from './CourseCard';
import AttendanceCircle from './AttendanceCircle';
import SectionHeader from './SectionHeader';
import { FaBook, FaCheckCircle } from 'react-icons/fa';

const StudentDashboard = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const studentId = 1;

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

  const handleCourseRegistration = async (courseId) => {
    const studentID = localStorage.getItem('studentId') || studentId;
    const registerDetails = { student_id: studentID, course_id: courseId };
    try {
      const response = await axios.post(`http://localhost:8000/courses/students/registercourse`, registerDetails);
      alert(`Course "${response.data.course_id}" registered successfully!`);
    } catch (error) {
      console.error('Error registering for course:', error);
    }
  };

  return (
    <StudentLayout>
      <div className="student-dashboard">
        <SectionHeader title="Your Registered Courses" icon={<FaCheckCircle />} />
        <div className="attendance-circles">
          {registeredCourses.map((course) => (
            <AttendanceCircle key={course.id} percentage={course.percentage} name={course.name} />
          ))}
        </div>

        <SectionHeader title="All Available Courses" icon={<FaBook />} />
        <div className="course-list">
          {availableCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isRegistered={!!registeredCourses.find((regCourse) => regCourse.id === course.id)}
              onRegister={handleCourseRegistration}
            />
          ))}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
