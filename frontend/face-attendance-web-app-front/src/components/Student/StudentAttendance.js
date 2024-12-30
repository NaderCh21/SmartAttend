import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StudentLayout from './StudentLayout';
import '../../style/StudentAttendance.css';

const StudentAttendance = () => {
    const { courseId } = useParams();
    const [attendanceData, setAttendanceData] = useState([]);
    const [courseName, setCourseName] = useState('');
    const studentId = localStorage.getItem('studentId') || 1;

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/students/${studentId}/courses/${courseId}/attendance`);
                setAttendanceData(response.data.attendance);
                setCourseName(response.data.courseName);
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            }
        };

        fetchAttendance();
    }, [studentId, courseId]);

    return (
        <StudentLayout>
            <div className="student-attendance-page">
                <h1>Attendance Details for {courseName}</h1>
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map((record, index) => (
                            <tr key={index}>
                                <td>{record.date}</td>
                                <td>{record.status ? 'Present' : 'Absent'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </StudentLayout>
    );
};

export default StudentAttendance;
