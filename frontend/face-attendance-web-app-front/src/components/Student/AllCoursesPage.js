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
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchAvailableCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/courses");
        setAvailableCourses(response.data);
      } catch (error) {
        console.error("Error fetching available courses:", error);
      }
    };

    const fetchRegisteredCourses = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/students/${studentId}/courses`
            );
            setRegisteredCourses(response.data);
        } catch (error) {
            console.error("Error fetching registered courses:", error.response?.data || error.message);
        }
    };
    

    fetchAvailableCourses();
    fetchRegisteredCourses();
  }, [studentId]);

  const handleCourseRegistration = async (courseId) => {
    const registerDetails = { student_id: studentId, course_id: courseId };
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/courses/students/registercourse",
        registerDetails
      );

      if (response.status === 200 && response.data.message === "Course registered successfully!") 
        {
        const updatedRegisteredCourses = await axios.get(
          `http://localhost:8000/courses/students/${studentId}/courses`
        );
        setRegisteredCourses(updatedRegisteredCourses.data);
        alert(response.data.message || "Course registered successfully!");
      } else {
        throw new Error("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error registering for course:", error.response?.data || error.message);
      alert(error.response?.data?.detail || "Failed to register for the course. Please try again.");
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
            <div className="loader">Registering...</div>
          ) : (
            availableCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isRegistered={!!registeredCourses.find((regCourse) => regCourse.id === course.id)}
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
