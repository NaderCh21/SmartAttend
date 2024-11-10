import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from './DashboardLayout';
import './TeacherDashboard.css';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: '',
    year: '',
    semester: '',
  });

  // Retrieve teacherId from localStorage
  const teacherId = localStorage.getItem('teacherId');

  useEffect(() => {
    if (!teacherId) {
      console.error("Teacher ID not found. Redirecting to login.");
      navigate('/login');  // Redirect to login if teacherId is missing
    }
  }, [teacherId, navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Handle form submission to add a new course
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/courses', {
        ...formState,
        teacher_id: parseInt(teacherId),  // Ensure teacherId is an integer
      });
      if (response.status === 201) {
        setFormState({ name: '', year: '', semester: '' });
        window.location.reload(); // Reload to refresh courses in the sidebar
      }
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  return (
    <DashboardLayout teacherId={teacherId}>
      <div className="attendance-overview">
        <h2>All classes attendance</h2>
        <div className="attendance-circles">
          <p>Summary of attendance by course will go here.</p>
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
