// import React from "react";
// import MasterComponent from "./MasterComponent";
// import "./App.css";

// function App() {
//   return (
//     <div className="app">
//       <MasterComponent />
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TeacherDashboard from "./components/TeacherDashboard";
import TeacherCourse from "./components/TeacherCourse";
import StudentDashboard from "./components/StudentDashboard";
import StudentCourse from "./components/StudentCourse";
import AttendancePage from "./components/AttendancePage";
import LoginApp from "./components/LoginApp";
import HomePage from "./components/HomePage";

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
        <Route path="/student/course/:courseName" element={<StudentCourse />} />
      </Routes>
    </Router>
  );
}

export default App;
