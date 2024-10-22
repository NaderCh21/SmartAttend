import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const courses = [
    { name: 'OS', percentage: 62.5 },
    { name: 'Database', percentage: 33.33 },
    { name: 'Advance DB', percentage: 0 },
    { name: 'Web Dev', percentage: 0 },
  ];

  const [formState, setFormState] = useState({
    name: '',
    year: '',
    semester: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New Course:', formState);
    // Add your logic here to handle the form submission
  };

  return (
    <DashboardLayout>
      <div className="attendance-overview">
        <h2>All classes attendance</h2>
        <div className="attendance-circles">
          {courses.map((course) => (
            <div className="attendance-item" key={course.name}>
              <div
                className="attendance-circle"
                style={{ '--percent': course.percentage }}
              >
                {course.percentage.toFixed(2)}%
              </div>
              <p>{course.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="add-course-form">
        <h3>Add a Course</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            value={formState.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="year"
            placeholder="Year"
            required
            value={formState.year}
            onChange={handleInputChange}
          />
          <select
            name="semester"
            value={formState.semester}
            onChange={handleInputChange}
            required
          >
            <option value="">Semester</option>
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
          </select>
          <button type="submit" className="add-course-button">Add Course</button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
