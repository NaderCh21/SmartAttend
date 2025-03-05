import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TeacherDashboard from "./components/Teacher/TeacherDashboard";
import TeacherCourse from "./components/Teacher/TeacherCourse";
import StudentDashboard from "./components/Student/StudentDashboard";
import StudentAttendance from "./components/Student/StudentAttendance";
import AllCoursesPage from "./components/Student/AllCoursesPage";
import AttendancePage from "./components/AttendancePage";
import LoginApp from "./components/LoginPage/LoginApp";
import HomePage from "./components/HomePage/HomePage";
import MyCoursesPage from "./components/Student/MyCoursesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginApp />} />
        {/* <Route path="/attendance" element={<AttendancePage />} /> */}

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/course/:courseName" element={<TeacherCourse />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route
          path="/student/course/:courseId/attendance"
          element={<StudentAttendance />}
        />
        <Route path="/student/all-courses" element={<AllCoursesPage />} />
        <Route path="/student/courses" element={<MyCoursesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
