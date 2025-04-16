import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentLayout from "./StudentLayout";
import "../../style/StudentDashboard.css";
import CourseCard from "./CourseCard";
import SectionHeader from "../SectionHeader";
import { FaBook } from "react-icons/fa";

const AllCoursesPage = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Grab studentId from localStorage
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    if (!studentId) {
      console.error("No studentId found in localStorage");
      alert("Student ID not found. Please log in again.");
      return;
    }

    // We will fetch both "all courses" and "registered courses",
    // then exclude any that are already registered from "all courses".
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all courses
        const allCoursesRes = await axios.get("http://localhost:8000/courses/");

        // Fetch student’s registered courses
        const registeredRes = await axios.get(
          `http://localhost:8000/courses/students/${studentId}/courses`
        );

        // Save them in state
        const allCourses = allCoursesRes.data;
        const registered = registeredRes.data;

        // Filter out any that are already registered
        const filteredCourses = allCourses.filter(
          (course) => !registered.some((reg) => reg.id === course.id)
        );

        setAvailableCourses(filteredCourses);
        setRegisteredCourses(registered);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  // Register a course for the student
  const handleCourseRegistration = async (courseId) => {
    const registerDetails = { student_id: studentId, course_id: courseId };
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/students/registercourse",
        registerDetails
      );

      if (response.status === 200) {
        // Now update both arrays again:
        // 1) Re-fetch registered courses,
        // 2) Filter out the newly registered from availableCourses
        const registeredRes = await axios.get(
          `http://localhost:8000/courses/students/${studentId}/courses`
        );
        const updatedRegistered = registeredRes.data;

        setRegisteredCourses(updatedRegistered);

        // Remove the newly registered course from "availableCourses"
        setAvailableCourses((prev) =>
          prev.filter((c) => c.id !== courseId)
        );
      }

      return true; // Indicate success to CourseCard (if needed)
    } catch (error) {
      console.error("Error registering for course:", error.response?.data || error.message);
      alert(
        error.response?.data?.detail ||
          "Failed to register for the course. Please try again."
      );
      throw error; // Re-throw if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="all-courses-page">
        <SectionHeader title="All Available Courses" icon={<FaBook />} />

        <div className="course-list">
          {loading ? (
            <div className="loader">Processing...</div>
          ) : (
            availableCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                // Double-check: is it registered? Should never be true if we filtered above
                isRegistered={registeredCourses.some(
                  (regCourse) => regCourse.id === course.id
                )}
                onRegister={handleCourseRegistration}
              />
            ))
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default AllCoursesPage;
