import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './StudentLayout.css';

const StudentLayout = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
              <NavLink to="/student/course/os" className="nav-item">OS</NavLink>
              <NavLink to="/student/course/database" className="nav-item">Database</NavLink>
              <NavLink to="/student/course/advance-db" className="nav-item">Advance DB</NavLink>
            </div>
          )}
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default StudentLayout;
