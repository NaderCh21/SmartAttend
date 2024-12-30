import React, { useEffect, useState } from "react";
import axios from "axios";
import StudentLayout from "./StudentLayout";
import "../../style/StudentDashboard.css";
import AttendanceCircle from "../AttendanceCircle";
import SectionHeader from "../SectionHeader";
import { FaCheckCircle } from "react-icons/fa";

const StudentDashboard = () => {
  const [registeredCourses, setRegisteredCourses] = useState([]);

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchRegisteredCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/students/${studentId}/courses`
        );
        setRegisteredCourses(response.data);
      } catch (error) {
        console.error("Error fetching registered courses:", error);
      }
    };

    fetchRegisteredCourses();
  }, [studentId]);

  return (
    <StudentLayout>
      <div className="student-dashboard">
        <SectionHeader title="Your Registered Courses" icon={<FaCheckCircle />} />
        <div className="attendance-circles">
          {registeredCourses.map((course) => (
            <AttendanceCircle
              key={course.id}
              percentage={course.percentage}
              name={course.name}
            />
          ))}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
