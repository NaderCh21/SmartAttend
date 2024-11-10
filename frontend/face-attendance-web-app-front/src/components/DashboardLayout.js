// DashboardLayout.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DashboardLayout.css';

const DashboardLayout = ({ children, teacherId }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);

  // Fetch courses for the specified teacher from the backend
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/courses/teacher/${teacherId}`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    if (teacherId) {
      fetchCourses();
    }
  }, [teacherId]);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  // Handle course deletion
  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:8000/courses/${courseId}`);
      setCourses(courses.filter((course) => course.id !== courseId));
      if (selectedCourse && selectedCourse.id === courseId) {
        setSelectedCourse(null); // Reset selected course if it's deleted
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h3 className="sidebar-header">Teacher Section</h3>
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => handleCourseSelect(null)}>Dashboard</div>
          <div className="nav-item dropdown">
            My Courses ▼
            <div className="dropdown-list">
              {courses.map((course) => (
                <div key={course.id} className="nav-item">
                  <span onClick={() => handleCourseSelect(course)}>{course.name}</span>
                  <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </aside>
      <main className="main-content">
        {selectedCourse ? (
          <div>
            <h2>Course Content</h2>
            <p>This is the content for {selectedCourse.name}.</p>
          </div>
        ) : (
          <div>
            <h2>Dashboard Overview</h2>
            {children}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;
