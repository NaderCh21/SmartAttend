// LoginApp.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Link,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import MasterComponent from "../MasterComponent"; // Import the face capture component

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

  // State for face capture
  const [isCapturingFace, setIsCapturingFace] = useState(false);
  const [capturedFace, setCapturedFace] = useState(null);

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
      const { user_id, role } = response.data;

      if (role === "teacher") {
        localStorage.setItem("teacherId", user_id); // Store teacher ID in localStorage
        navigate("/teacher/dashboard");
      } else if (role === "student") {
        navigate("/student/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginMessage({ type: "error", text: "Login failed. Please try again." });
    }
  };

  // Handle signup submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupMessage({ type: "", text: "" });

    if (signupData.role === "student") {
      setIsCapturingFace(true); // Start face capture for students
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(signupData).forEach((key) => formData.append(key, signupData[key]));

      if (capturedFace) {
        formData.append("face_data", capturedFace);
      }

      const response = await axios.post("http://localhost:8000/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSignupMessage({ type: "success", text: response.data.message });
      setIsCapturingFace(false);
    } catch (error) {
      const errorMessage = Array.isArray(error.response?.data?.detail)
        ? error.response.data.detail.map((err) => err.msg).join(" ")
        : "Signup failed. Please try again.";
      setSignupMessage({ type: "error", text: errorMessage });
      setIsCapturingFace(false);
    }
  };

  return (
    <>
      {/* Render MasterComponent only when capturing face */}
      {isCapturingFace && (
        <MasterComponent
          onFaceCapture={(blob) => {
            setCapturedFace(blob);
            setIsCapturingFace(false); // Stop capturing once face is saved
            handleSignupSubmit(new Event("submit"));
          }}
        />
      )}

      <Grid container spacing={0} justifyContent="center" direction="row">
        <Grid item>
          <Grid container direction="column" justifyContent="center" spacing={2} className="login-form">
            <Paper variant="elevation" elevation={2} className="login-background">
              <Grid container direction="row" spacing={4}>
                {/* Sign In Section */}
                <Grid item container direction="column" xs={6}>
                  <Grid item>
                    <Typography component="h1" variant="h5">Sign in</Typography>
                  </Grid>

                  {/* Display login feedback message */}
                  {loginMessage.text && (
                    <Alert severity={loginMessage.type}>{loginMessage.text}</Alert>
                  )}

                  <Grid item>
                    <form onSubmit={handleLoginSubmit}>
                      <Grid container direction="column" spacing={2}>
                        <Grid item>
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
                        </Grid>
                        <Grid item>
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
                        </Grid>
                        <Grid item>
                          <Button variant="contained" color="primary" type="submit" className="button-block">
                            Submit
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2">Forgot Password?</Link>
                  </Grid>
                </Grid>

                {/* Create Account Section */}
                <Grid item container direction="column" xs={6}>
                  <Typography component="h1" variant="h5">Create Account</Typography>

                  {/* Display signup feedback message */}
                  {signupMessage.text && (
                    <Alert severity={signupMessage.type}>{signupMessage.text}</Alert>
                  )}

                  <form onSubmit={handleSignupSubmit}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
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
                      </Grid>
                      <Grid item>
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
                      </Grid>
                      <Grid item>
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
                      </Grid>
                      <Grid item>
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
                      </Grid>
                      <Grid item>
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
                      </Grid>
                      <Grid item>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Role</FormLabel>
                          <RadioGroup
                            row
                            name="role"
                            value={signupData.role}
                            onChange={handleSignupChange}
                          >
                            <FormControlLabel value="student" control={<Radio color="primary" />} label="Student" />
                            <FormControlLabel value="teacher" control={<Radio color="primary" />} label="Teacher" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item>
                        <TextField
                          type="text"
                          label="Roll"
                          fullWidth
                          name="roll"
                          variant="outlined"
                          value={signupData.roll}
                          onChange={handleSignupChange}
                        />
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <TextField
                            type="text"
                            label="Degree"
                            fullWidth
                            name="degree"
                            variant="outlined"
                            value={signupData.degree}
                            onChange={handleSignupChange}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            type="text"
                            label="Year"
                            fullWidth
                            name="year"
                            variant="outlined"
                            value={signupData.year}
                            onChange={handleSignupChange}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            type="text"
                            label="Stream"
                            fullWidth
                            name="stream"
                            variant="outlined"
                            value={signupData.stream}
                            onChange={handleSignupChange}
                          />
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Button variant="contained" color="primary" type="submit" className="button-block">
                          Create
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default LoginApp;
