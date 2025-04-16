// src/Student/MyCoursesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentLayout from "./StudentLayout";
import CourseCard from "./CourseCard";
import SectionHeader from "../SectionHeader"; // If you have a reusable header
import { FaBook } from "react-icons/fa";      // Or any icon you prefer

export default function MyCoursesPage() {
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    if (!studentId) {
      console.error("No studentId found in localStorage");
      alert("Student ID not found. Please log in again.");
      return;
    }

    const fetchRegisteredCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/courses/students/${studentId}/courses`
        );
        setRegisteredCourses(response.data);
      } catch (error) {
        console.error(
          "Error fetching registered courses:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredCourses();
  }, [studentId]);

  const fetchAttendance = async (courseId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/courses/final_attendance/${courseId}/${studentId}`
      );
      setAttendanceData(response.data);
      setSelectedCourseId(courseId);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  return (
    <StudentLayout>
      <SectionHeader title="My Registered Courses" icon={<FaBook />} />

      <div style={{ padding: "1rem" }}>
        {loading && <p>Loading courses...</p>}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {registeredCourses.length === 0 && !loading && (
            <p>You have not registered for any courses yet.</p>
          )}

          {registeredCourses.map((course) => (
            <div key={course.id}>
              <CourseCard
                course={course}
                isRegistered={true}
                onRegister={() => {}}
              />
              <button onClick={() => fetchAttendance(course.id)}>
                View Attendance
              </button>
            </div>
          ))}
        </div>

        {selectedCourseId && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Attendance for Course ID: {selectedCourseId}</h3>
            {attendanceData.length === 0 ? (
              <p>No sessions where taken yet.</p>
            ) : (
              <table border="1" cellPadding="8">
                <thead>
                  <tr>
                    <th>Session ID</th>
                    <th>Session Date</th>
                    <th>Status</th>
                    <th>Check-In Time</th>
                    <th>Time in Class</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record) => (
                    <tr key={record.id}>
                      <td>{record.session_id}</td>
                      <td>{record.session_date || "N/A"}</td>
                      <td>{record.status}</td>
                      <td>{record.check_in_time || "N/A"}</td>
                      <td>{record.time_in_class || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
                </table>

            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
