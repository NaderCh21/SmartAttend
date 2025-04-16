import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/DashboardLayout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faUserGraduate, faPlus, faEye, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import FaceRecognition from './FaceRecognition';

const AttendanceRecords = ({ attendanceData, onBack }) => {
  return (
    <div className="attendance-records">
      <button 
        onClick={onBack}
        style={{
          padding: '5px 10px',
          backgroundColor: '#2196F3',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '5px',
          marginBottom: '20px'
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Sessions
      </button>
      
      <h3>Attendance Records</h3>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Check-in Time</th>
            <th>Time in Class</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((record) => (
            <tr key={`${record.student_id}-${record.session_id}`}>
              <td>{record.student_id}</td>
              <td>{record.student_name || 'N/A'}</td>
              <td>{record.check_in_time ? new Date(record.check_in_time).toLocaleString() : 'N/A'}</td>
              <td>{record.time_in_class || 'N/A'}</td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DashboardLayout = ({ children, teacherId }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [viewingAttendance, setViewingAttendance] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);

  const id = teacherId || localStorage.getItem("teacherId");

  // Fetch courses for the specified teacher from the backend
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/courses/teacher/${id}`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Fetch teacher details
  const fetchTeacherDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/teachers/${id}`);
      setTeacherDetails(response.data);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
    }
  };

  // Fetch sessions for a course
  const fetchSessions = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:8000/teachers/GetSessions/${courseId}`);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      alert("Failed to fetch sessions. Please try again.");
    }
  };

  // Handle viewing attendance
  const handleViewAttendance = async (sessionId) => {
    try {
      const response = await axios.get(`http://localhost:8000/teachers/final_attendance/${sessionId}`);
      setAttendanceData(response.data);
      setViewingAttendance(true);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      alert("Failed to fetch attendance data. Please try again.");
    }
  };

  // Handle back to sessions
  const handleBackToSessions = () => {
    setViewingAttendance(false);
    setAttendanceData([]);
  };

  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setViewingAttendance(false);
    if (course) {
      fetchSessions(course.id);
    }
  };

  // Handle course deletion
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

  // Handle session creation
  const handleCreateSession = async () => {
    if (!selectedCourse) {
      alert("No course selected.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/teachers/new_session/${selectedCourse.id}`
      );
      alert(response.data.message);
      fetchSessions(selectedCourse.id);
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create session. Please try again.");
    }
  };

  // Handle session ending
  const handleEndSession = async (courseId, sessionId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/teachers/EndSession2/${courseId}/${sessionId}`
      );
      alert(response.data.message);
      fetchSessions(courseId);
    } catch (error) {
      console.error("Error ending session:", error);
      alert("Failed to end session. Please try again.");
    }
  };

  // Fetch courses and teacher details on component mount
  useEffect(() => {
    if (id) {
      fetchCourses();
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
          <div className="nav-item" onClick={() => handleCourseSelect(null)}>
            <FontAwesomeIcon icon={faHome} /> Dashboard
          </div>
          <div className="nav-item dropdown">
            <FontAwesomeIcon icon={faBook} /> My Courses ▼
            <div className="dropdown-list">
              {courses.map((course) => (
                <div key={course.id} className="nav-item">
                  <span onClick={() => handleCourseSelect(course)}>{course.name}</span>
                  <button className="delete-button" onClick={() => handleDeleteCourse(course.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="nav-item">
            <FontAwesomeIcon icon={faUserGraduate} /> Students
          </div>
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
              <strong>
                {teacherDetails ? `${teacherDetails.first_name} ${teacherDetails.last_name}` : "Loading..."}
              </strong>
            </span>
            <div className="teacher-actions">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ"
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
              
              {viewingAttendance ? (
                <AttendanceRecords 
                  attendanceData={attendanceData} 
                  onBack={handleBackToSessions} 
                />
              ) : (
                <>
                  <p>This is the content for {selectedCourse.name}.</p>

                  {/* Create Session Section */}
                  <div className="create-session">
                    <h3>Create New Session</h3>
                    <button
                      onClick={handleCreateSession}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Create Session
                    </button>
                  </div>

                  {/* Display Sessions */}
                  <div className="sessions-list">
                    <h3>Sessions for {selectedCourse.name}</h3>
                    {sessions.length > 0 ? (
                      <ul>
                        {sessions.map((session) => (
                          <li key={session.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <strong>Date:</strong> {session.date} | <strong>Status:</strong> {session.session_status} | <strong> Start Time:</strong> {session.start_time} |
                            </div>
                            <div>
                              {session.session_status?.toLowerCase() === "open" && (
                                <>
                                  <button 
                                    onClick={() => {
                                      setCurrentSessionId(session.id);
                                      setShowCameraModal(true);
                                    }}
                                    style={{
                                      padding: '5px 10px',
                                      backgroundColor: '#4caf50',
                                      color: '#fff',
                                      border: 'none',
                                      cursor: 'pointer',
                                      borderRadius: '5px',
                                      marginRight: '10px'
                                    }}
                                  >
                                    Open Camera
                                  </button>
                                  <button 
                                    onClick={() => handleEndSession(selectedCourse.id, session.id)}
                                    style={{
                                      padding: '5px 10px',
                                      backgroundColor: '#f44336',
                                      color: '#fff',
                                      border: 'none',
                                      cursor: 'pointer',
                                      borderRadius: '5px',
                                    }}
                                  >
                                    End Session Now
                                  </button>
                                </>
                              )}
                              {session.session_status?.toLowerCase() === "ended" && (
                                <button 
                                  onClick={() => handleViewAttendance(session.id)}
                                  style={{
                                    padding: '5px 10px',
                                    backgroundColor: '#2196F3',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                  }}
                                >
                                  <FontAwesomeIcon icon={faEye} /> View Attendance
                                </button>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No sessions found for this course.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div>
              <h2>Dashboard Overview</h2>
              {children}
            </div>
          )}
        </section>
      </main>

      {/* Face Recognition Modal */}
      {showCameraModal && (
        <FaceRecognition 
          onClose={() => {
            setShowCameraModal(false);
            setCurrentSessionId(null);
          }} 
          sessionId={currentSessionId}
        />
      )}
    </div>
  );
};

export default DashboardLayout;