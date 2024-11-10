import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import './StudentLayout.css';

const StudentLayout = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [registeredCourses, setRegisteredCourses] = useState([]); // State for registered courses
  const studentId = 1; // Replace with dynamic student ID if needed

  // Toggle the dropdown for the "My Courses" section
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Fetch the registered courses for the student
  useEffect(() => {
    const fetchRegisteredCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/students/${studentId}/courses`);
        setRegisteredCourses(response.data); // Set the registered courses in state
      } catch (error) {
        console.error('Error fetching registered courses:', error);
      }
    };

    fetchRegisteredCourses();
  }, [studentId]);

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h3 className="sidebar-header">Student Section</h3>
        <nav className="sidebar-nav">
          <NavLink to="/student/dashboard" className="nav-item">Dashboard</NavLink>
          <div className="nav-item dropdown" onClick={toggleDropdown}>
            My Courses {isDropdownOpen ? '▲' : '▼'}
          </div>
          {isDropdownOpen && (
            <div className="dropdown-list">
              {/* Render each registered course as a NavLink */}
              {registeredCourses.map((course) => (
                <NavLink
                  key={course.id}
                  to={`/student/course/${course.id}`}
                  className="nav-item"
                >
                  {course.name}
                </NavLink>
              ))}
            </div>
          )}
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default StudentLayout;
