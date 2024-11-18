import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import "./LoginApp.css";
import FaceCapture from "./FaceCapture";

const LoginApp = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginMessage, setLoginMessage] = useState({ type: "", text: "" });

  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "student",
    roll: "",
    degree: "",
    year: "",
    stream: "",
  });
  const [signupMessage, setSignupMessage] = useState({ type: "", text: "" });

  const [isFaceCaptureOpen, setIsFaceCaptureOpen] = useState(false);
  const [studentId, setStudentId] = useState(null); // Store student ID for face capture

  // Handle login form change
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle signup form change
  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login", loginData);
      const { user_id, role, teacher_id } = response.data;

      if (role === "teacher") {
        localStorage.setItem("teacherId", teacher_id);
        navigate("/teacher/dashboard");
      } else if (role === "student") {
        navigate("/student/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginMessage({
        type: "error",
        text: "Login failed. Please try again.",
      });
    }
  };

  // Handle signup submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        "http://localhost:8000/signup",
        signupData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.student_id) {
        setStudentId(response.data.student_id); // Store student ID
        setSignupMessage({ type: "success", text: response.data.message });
        setIsFaceCaptureOpen(true); // Open face capture modal
        alert("Signup successful! Please capture your face.");
      } else {
        setSignupMessage({ type: "error", text: response.data.message });
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data);
      setSignupMessage({
        type: "error",
        text: error.response?.data?.detail || "Signup failed. Please try again.",
      });
    }
  };

  // Handle face capture
  const handleFaceCapture = async (imageData) => {
    try {
      const response = await axios.post("http://localhost:8000/face/face-encode", {
        image: imageData,
        student_id: studentId, // Use the stored student ID
      });

      if (response.data.success) {
        alert(response.data.message);
        setIsFaceCaptureOpen(false); // Close modal on success
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Face capture failed:", error);
      alert("Failed to register face. Please try again.");
    }
  };

  return (
    <Grid container spacing={0} justifyContent="center" direction="row">
      <Grid item>
        <Grid
          container
          direction="column"
          justifyContent="center"
          spacing={2}
          className="login-form"
        >
          <Paper variant="elevation" elevation={2} className="login-background">
            <Grid container direction="row" spacing={4}>
              {/* Sign In Section */}
              <Grid item container direction="column" xs={6} className="login-section">
                <Typography component="h1" variant="h5">Sign in</Typography>

                {loginMessage.text && (
                  <Alert severity={loginMessage.type}>{loginMessage.text}</Alert>
                )}

                <form onSubmit={handleLoginSubmit}>
                  <Grid container direction="column" spacing={2}>
                    <TextField
                      type="email"
                      label="Email"
                      fullWidth
                      name="email"
                      variant="outlined"
                      required
                      value={loginData.email}
                      onChange={handleLoginChange}
                    />
                    <TextField
                      type="password"
                      label="Password"
                      fullWidth
                      name="password"
                      variant="outlined"
                      required
                      value={loginData.password}
                      onChange={handleLoginChange}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      className="button-block"
                    >
                      Submit
                    </Button>
                  </Grid>
                </form>
              </Grid>

              {/* Create Account Section */}
              <Grid item container direction="column" xs={6} className="signup-section">
                <Typography component="h1" variant="h5">Create Account</Typography>

                {signupMessage.text && (
                  <Alert severity={signupMessage.type}>{signupMessage.text}</Alert>
                )}

                {isFaceCaptureOpen && (
                  <FaceCapture
                    onCapture={handleFaceCapture}
                    onClose={() => setIsFaceCaptureOpen(false)}
                    studentId={studentId}
                  />
                )}

                {!isFaceCaptureOpen && (
                  <form onSubmit={handleSignupSubmit}>
                    <TextField
                      type="text"
                      label="First Name"
                      fullWidth
                      name="first_name"
                      variant="outlined"
                      required
                      value={signupData.first_name}
                      onChange={handleSignupChange}
                    />
                    <TextField
                      type="text"
                      label="Last Name"
                      fullWidth
                      name="last_name"
                      variant="outlined"
                      required
                      value={signupData.last_name}
                      onChange={handleSignupChange}
                    />
                    <TextField
                      type="email"
                      label="Email"
                      fullWidth
                      name="email"
                      variant="outlined"
                      required
                      value={signupData.email}
                      onChange={handleSignupChange}
                    />
                    <TextField
                      type="password"
                      label="Password"
                      fullWidth
                      name="password"
                      variant="outlined"
                      required
                      value={signupData.password}
                      onChange={handleSignupChange}
                    />
                    <TextField
                      type="password"
                      label="Re-enter password"
                      fullWidth
                      name="confirm_password"
                      variant="outlined"
                      required
                      value={signupData.confirm_password}
                      onChange={handleSignupChange}
                    />
                    <FormControl component="fieldset" className="role-selection">
                      <FormLabel component="legend">Role</FormLabel>
                      <RadioGroup
                        row
                        name="role"
                        value={signupData.role}
                        onChange={handleSignupChange}
                      >
                        <FormControlLabel
                          value="student"
                          control={<Radio color="primary" />}
                          label="Student"
                        />
                        <FormControlLabel
                          value="teacher"
                          control={<Radio color="primary" />}
                          label="Teacher"
                        />
                      </RadioGroup>
                    </FormControl>
                    <TextField
                      type="text"
                      label="Roll"
                      fullWidth
                      name="roll"
                      variant="outlined"
                      value={signupData.roll}
                      onChange={handleSignupChange}
                    />
                    <TextField
                      type="text"
                      label="Degree"
                      fullWidth
                      name="degree"
                      variant="outlined"
                      value={signupData.degree}
                      onChange={handleSignupChange}
                    />
                    <TextField
                      type="text"
                      label="Year"
                      fullWidth
                      name="year"
                      variant="outlined"
                      value={signupData.year}
                      onChange={handleSignupChange}
                    />
                    <TextField
                      type="text"
                      label="Stream"
                      fullWidth
                      name="stream"
                      variant="outlined"
                      value={signupData.stream}
                      onChange={handleSignupChange}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      className="button-block"
                    >
                      Create
                    </Button>
                  </form>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LoginApp;
