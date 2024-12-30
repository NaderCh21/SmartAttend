import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/DashboardLayout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faUserGraduate } from '@fortawesome/free-solid-svg-icons';





const DashboardLayout = ({ children, teacherId }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const id = teacherId || localStorage.getItem("teacherId");
  // Fetch courses for the specified teacher from the backend
  const fetchCourses = async () => {
    try {
      
      const response = await axios.get(`http://localhost:8000/courses/teacher/${id}`);
      setCourses(response.data);
      console.log("Courses fetched:", response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourses();
    }
  }, [id]);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:8000/courses/${courseId}`);
      setCourses(courses.filter((course) => course.id !== courseId));
      if (selectedCourse && selectedCourse.id === courseId) {
        setSelectedCourse(null);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const [teacherDetails, setTeacherDetails] = useState(null);

  const fetchTeacherDetails = async () => {
    try {
      
      const response = await axios.get(`http://localhost:8000/teachers/${id}`);
      setTeacherDetails(response.data);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
    }
  };
  

  useEffect(() => {
    
    if (id) {
      fetchTeacherDetails();
    }
  }, [id]);
  

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Teacher Dashboard</h3>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item" onClick={() => handleCourseSelect(null)}><FontAwesomeIcon icon={faHome} />Dashboard</div>
          <div className="nav-item dropdown">
          <FontAwesomeIcon icon={faBook} />
            My Courses ▼
            <div className="dropdown-list">
              {courses.map((course) => (
                <div key={course.id} className="nav-item">
                  <span onClick={() => handleCourseSelect(course)}>{course.name}</span>
                  <button className="delete-button" onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
          <div className="nav-item"><FontAwesomeIcon icon={faUserGraduate} /> Students</div>

        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
  
  
  <header className="dashboard-header">
  <div className="search-container">
    <input type="text" placeholder="Search for courses, students..." className="search-bar" />
  </div>
  <div className="teacher-info">
  <span className="teacher-name">
    <strong>{teacherDetails ? `${teacherDetails.first_name} ${teacherDetails.last_name}` : "Loading..."}</strong>
  </span>
    <div className="teacher-actions">
      {/*to be changed later */}
      <img
        src="data:image/png;base64,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"
        alt="Teacher Icon"
        className="teacher-icon"
      />
      <button className="logout-button">Logout</button>
    </div>
  </div>
</header>


        <section className="content">
          {selectedCourse ? (
            <div>
              <h2>Course: {selectedCourse.name}</h2>
              <p>This is the content for {selectedCourse.name}.</p>
            </div>
          ) : (
            <div>
              <h2>Dashboard Overview</h2>
              {children}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
