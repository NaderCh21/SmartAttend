import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "../../style/StudentLayout.css";

const StudentLayout = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const studentId = localStorage.getItem("studentId");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    if (!studentId) {
      alert("Student ID not found. Redirecting to login...");
      window.location.href = "/login";
      return;
    }

    const fetchRegisteredCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/students/${studentId}/courses`
        );
        setRegisteredCourses(response.data);
      } catch (error) {
        console.error(
          "Error fetching registered courses:",
          error.response || error
        );
      }
    };

    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/students/${studentId}`
        );
        setStudentDetails(response.data);
      } catch (error) {
        console.error(
          "Error fetching student details:",
          error.response || error
        );
      }
    };

    fetchRegisteredCourses();
    fetchStudentDetails();
  }, [studentId]);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3 className="sidebar-header">Student Section</h3>
        <nav className="sidebar-nav">
          <NavLink to="/student/dashboard" className="nav-item">
            Dashboard
          </NavLink>
          <NavLink to="/student/all-courses" className="nav-item">
            All Available Courses
          </NavLink>
          <NavLink to="/student/courses" className="nav-item">
            Courses
          </NavLink>
          <NavLink to="/student/attendance" className="nav-item">
            Attendance
          </NavLink>
        </nav>

      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header Section */}
     <header className="dashboard-header">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for courses, students..."
          className="search-bar"
        />
      </div>
      <div className="student-info">
        <span className="student-name">
          <strong>
            {studentDetails
              ? `${studentDetails.first_name} ${studentDetails.last_name}`
              : "Loading..."}
          </strong>
        </span>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Student Icon"
          className="student-icon"
        />
        <button
          className="logout-button"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </header>

        {/* Render children components */}
        {children}
      </main>
    </div>
  );
};

export default StudentLayout;
