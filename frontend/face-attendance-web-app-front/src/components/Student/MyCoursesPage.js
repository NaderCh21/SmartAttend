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
          `http://localhost:8000/students/${studentId}/courses`
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

  return (
    <StudentLayout>
      {/* Optional "SectionHeader" if you want a styled title */}
      <SectionHeader
        title="My Registered Courses"
        icon={<FaBook />}
      />

      <div style={{ padding: "1rem" }}>
        {loading && <p>Loading courses...</p>}

        {/* If not loading, display the user's courses */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {registeredCourses.length === 0 && !loading && (
            <p>You have not registered for any courses yet.</p>
          )}

          {registeredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              // Already registered, so always show "Registered" button
              isRegistered={true}
              onRegister={() => {}} 
            />
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}
