// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import DashboardLayout from './DashboardLayout';
// import './TeacherDashboard.css';
// import { useNavigate } from 'react-router-dom';
// import { Line } from 'react-chartjs-2';

// const TeacherDashboard = () => {
//   const navigate = useNavigate();
//   const [formState, setFormState] = useState({
//     name: '',
//     year: '',
//     semester: '',
//   });
//   const [attendanceStats, setAttendanceStats] = useState([]);
//   const [absentees, setAbsentees] = useState([]);

//   // Retrieve teacherId from localStorage
//   const teacherId = localStorage.getItem('teacherId');

//   useEffect(() => {
//     if (!teacherId) {
//       console.error("Teacher ID not found. Redirecting to login.");
//       navigate('/login'); // Redirect to login if teacherId is missing
//     } else {
//       fetchAttendanceStats();
//       fetchAbsentees();
//     }
//   }, [teacherId, navigate]);

//   // Fetch attendance statistics
//   const fetchAttendanceStats = async () => {
//     try {
//       const response = await axios.get('http://localhost:8000/attendance/stats');
//       setAttendanceStats(response.data);
//     } catch (error) {
//       console.error("Error fetching attendance stats:", error);
//     }
//   };

//   // Fetch absentees list
//   const fetchAbsentees = async () => {
//     try {
//       const response = await axios.get('http://localhost:8000/attendance/absentees');
//       setAbsentees(response.data);
//     } catch (error) {
//       console.error("Error fetching absentees:", error);
//     }
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormState({
//       ...formState,
//       [name]: value,
//     });
//   };

//   // Handle form submission to add a new course
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8000/courses', {
//         ...formState,
//         teacher_id: parseInt(teacherId), // Ensure teacherId is an integer
//       });
//       if (response.status === 201) {
//         setFormState({ name: '', year: '', semester: '' });
//         window.location.reload(); // Reload to refresh courses in the sidebar
//       }
//     } catch (error) {
//       console.error("Error adding course:", error);
//     }
//   };

//   return (  
//     <DashboardLayout teacherId={teacherId}>
//       <div className="dashboard-container">
//         {/* Attendance Analysis */}
//         <div className="attendance-overview">
//   <h2>Attendance Analysis</h2>
//   <div className="attendance-stats">
//     {attendanceStats.length > 0 ? (
//       <div className="chart-container">
//         <Line
//           data={{
//             labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
//             datasets: [
//               {
//                 label: 'Attendance Percentage',
//                 data: [85, 90, 80, 75, 95], // Replace with dynamic data if available
//                 fill: false,
//                 backgroundColor: '#3f51b5',
//                 borderColor: '#3f51b5',
//                 tension: 0.4,
//               },
//             ],
//           }}
//           options={{
//             responsive: true,
//             plugins: {
//               legend: {
//                 display: true,
//                 position: 'top',
//               },
//             },
//             animation: {
//               duration: 1000,
//               easing: 'easeInOutQuart',
//             },
//           }}
//         />
//       </div>
//     ) : (
//       <p>No attendance data available.</p>
//     )}
//   </div>
// </div>


//         {/* Absentees Today */}
//         <div className="absentees-section">
//   <h3>Absentees Today</h3>
//   <table className="absentees-table">
//     <thead>
//       <tr>
//         <th>Roll No</th>
//         <th>Name</th>
//       </tr>
//     </thead>
//     <tbody>
//       {absentees.length > 0 ? (
//         absentees.map((absentee, index) => (
//           <tr key={index}>
//             <td>{absentee.rollNo}</td>
//             <td>{absentee.name}</td>
//           </tr>
//         ))
//       ) : (
//         <tr>
//           <td colSpan="2">No absentees for today.</td>
//         </tr>
//       )}
//     </tbody>
//   </table>
// </div>


//         {/* Add Course Form */}
//         <div className="add-course-form">
//           <h3>Add a Course</h3>
//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               name="name"
//               placeholder="Course Name"
//               required
//               value={formState.name}
//               onChange={handleInputChange}
//             />
//             <input
//               type="text"
//               name="year"
//               placeholder="Year"
//               required
//               value={formState.year}
//               onChange={handleInputChange}
//             />
//             <select
//               name="semester"
//               value={formState.semester}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select Semester</option>
//               <option value="Fall">Fall</option>
//               <option value="Spring">Spring</option>
//             </select>
//             <button type="submit" className="add-course-button">Add Course</button>
//           </form>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default TeacherDashboard;
import React, { useState } from "react";
import FaceRecognition from "../FaceRecognition";
import DashboardLayout from "../DashboardLayout";
import axios from "axios";

const TeacherDashboard = () => {
  const [isFaceRecognitionOpen, setIsFaceRecognitionOpen] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState("");
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const [courseDetails, setCourseDetails] = useState({
    name: "",
    semester: "",
    year: "",
    teacher_id: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleCreateCourse = async () => {
    const teacherId = localStorage.getItem("teacherId"); // Retrieve teacher_id
    if (!teacherId) {
      alert("Teacher ID not found. Please log in again.");
      return;
    }
    const courseData = {
      ...courseDetails,
      teacher_id: teacherId, // Ensure teacherID is included
  };
    try {
     
      const response = await axios.post("http://localhost:8000/courses", courseData);
      const { name  } = response.data;
      
      alert(`Course "${name}" created successfully!`);
      setCourseDetails({ name: "", semester: "", year: "", teacher_id:"" });
      setIsCourseFormOpen(false);
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <h2>Teacher Dashboard</h2>

        {/* Create Course Section */}
        <div className="create-course">
          <h3>Create Course</h3>
          <button
            onClick={() => setIsCourseFormOpen((prev) => !prev)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#3f51b5",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            {isCourseFormOpen ? "Close Form" : "Create New Course"}
          </button>

          {isCourseFormOpen && (
            <div
              className="course-form"
              style={{
                marginTop: "10px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <label>
                  Course Name:
                  <input
                    type="text"
                    name="name"
                    value={courseDetails.name}
                    onChange={handleInputChange}
                    style={{ marginLeft: "10px", padding: "5px" }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>
                  Semester:
                  <input
                    type="text"
                    name="semester"
                    value={courseDetails.semester}
                    onChange={handleInputChange}
                    style={{ marginLeft: "10px", padding: "5px" }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>
                  Year:
                  <input
                    type="number"
                    name="year"
                    value={courseDetails.year}
                    onChange={handleInputChange}
                    style={{ marginLeft: "10px", padding: "5px" }}
                  />
                </label>
              </div>
              <button
                onClick={handleCreateCourse}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                Create
              </button>
            </div>
          )}
        </div>

        {/* Face Recognition Section */}
        <div className="face-recognition-section">
          <h3>Face Recognition</h3>
          <button
            onClick={() => setIsFaceRecognitionOpen(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#3f51b5",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Open Camera for Face Recognition
          </button>
        </div>

        {/* Render FaceRecognition modal */}
        {isFaceRecognitionOpen && (
          <FaceRecognition
            onDetect={(result) => {
              setRecognitionResult(result); // Store recognition result
              setIsFaceRecognitionOpen(false); // Close modal
            }}
            onClose={() => setIsFaceRecognitionOpen(false)}
          />
        )}

        {/* Display recognition result */}
        {recognitionResult && (
          <p style={{ marginTop: "20px", fontSize: "16px", color: "#333" }}>
            {recognitionResult}
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
