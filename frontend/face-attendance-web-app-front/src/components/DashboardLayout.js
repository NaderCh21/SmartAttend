import React, { useState } from 'react';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const [selectedCourse, setSelectedCourse] = useState(null); // To track the selected course

  const handleCourseSelect = (courseName) => {
    setSelectedCourse(courseName);
  };

  const courseContent = {
    os: "This is the Operating Systems course content.",
    database: "This is the Database course content.",
    'advance-db': "This is the Advanced Database course content.",
    'web-dev': "This is the Web Development course content.",
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h3 className="sidebar-header">Teacher Section</h3>
        <nav className="sidebar-nav">
          {/* Use onClick instead of NavLink to control the rendering */}
          <div className="nav-item" onClick={() => handleCourseSelect(null)}>Dashboard</div>
          <div className="nav-item dropdown">
            My Courses ▼
            <div className="dropdown-list">
              <div className="nav-item" onClick={() => handleCourseSelect('os')}>OS</div>
              <div className="nav-item" onClick={() => handleCourseSelect('database')}>Database</div>
              <div className="nav-item" onClick={() => handleCourseSelect('advance-db')}>Advance DB</div>
              <div className="nav-item" onClick={() => handleCourseSelect('web-dev')}>Web Dev</div>
            </div>
          </div>
        </nav>
      </aside>
      <main className="main-content">
        {selectedCourse ? (
          <div>
            <h2>Course Content</h2>
            <p>{courseContent[selectedCourse]}</p>
          </div>
        ) : (
          <div>
            <h2>Dashboard Overview</h2>
            {/* Render the TeacherDashboard content here */}
            {children}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;
