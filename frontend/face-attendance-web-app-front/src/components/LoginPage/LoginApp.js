// src/components/LoginPage/LoginApp.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FaceCapture from "../FaceCapture";
import Loader from "../Loader"; // import our new loader

// --- Material UI ---
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  InputAdornment,
  Stack,
  Paper
} from "@mui/material";

// --- Icons ---
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";

export default function LoginApp() {
  const navigate = useNavigate();

  // Which tab is selected? 0 -> Sign In, 1 -> Create Account
  const [tabValue, setTabValue] = useState(0);
  // Loading state for login
  const [isLoading, setIsLoading] = useState(false);

  // Tab Switch
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // ----- Login State -----
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginMessage, setLoginMessage] = useState({ type: "", text: "" });

  // ----- Signup State -----
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

  // Face capture state
  const [isFaceCaptureOpen, setIsFaceCaptureOpen] = useState(false);
  const [studentId, setStudentId] = useState(null);

  // ------------------ Handlers ------------------

  // Login form onChange
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Signup form onChange
  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Submit: Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // show loader
    setLoginMessage({ type: "", text: "" });

    try {
      const response = await axios.post("http://localhost:8000/login", loginData);
      const { role, relative_id } = response.data;

      if (role === "teacher") {
        localStorage.setItem("teacherId", relative_id);
        navigate("/teacher/dashboard");
      } else if (role === "student") {
        localStorage.setItem("studentId", relative_id);
        navigate("/student/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginMessage({ type: "error", text: "Login failed. Please try again." });
    } finally {
      setIsLoading(false); // hide loader
    }
  };

  // Submit: Signup
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupMessage({ type: "", text: "" });

    try {
      const response = await axios.post("http://localhost:8000/signup", signupData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.student_id) {
        setStudentId(response.data.student_id);
        setSignupMessage({ type: "success", text: response.data.message });
        setIsFaceCaptureOpen(true); // open face capture
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

  // Face Capture
  const handleFaceCapture = async (imageData) => {
    try {
      const response = await axios.post("http://localhost:8000/face/face-encode", {
        image: imageData,
        student_id: studentId,
      });

      if (response.data.success) {
        alert(response.data.message);
        setIsFaceCaptureOpen(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Face capture failed:", error);
      alert("Failed to register face. Please try again.");
    }
  };

  // ------------------ UI Rendering ------------------

  // Sign In UI
  const renderSignIn = (
    <Box
      component="form"
      onSubmit={handleLoginSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
    >
      {loginMessage.text && (
        <Alert severity={loginMessage.type}>{loginMessage.text}</Alert>
      )}

      <TextField
        type="email"
        label="Email"
        fullWidth
        size="small"
        name="email"
        variant="outlined"
        required
        value={loginData.email}
        onChange={handleLoginChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailOutlinedIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        type="password"
        label="Password"
        fullWidth
        size="small"
        name="password"
        variant="outlined"
        required
        value={loginData.password}
        onChange={handleLoginChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon />
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        sx={{
          mt: 1,
          fontWeight: 600,
          textTransform: "none",
          borderRadius: 2
        }}
        type="submit"
      >
        Submit
      </Button>
    </Box>
  );

  // Sign Up UI
  const renderSignUp = (
    <Box
      component="form"
      onSubmit={handleSignupSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
    >
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

      {/* Show form only if not capturing face */}
      {!isFaceCaptureOpen && (
        <>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="First Name"
              fullWidth
              size="small"
              name="first_name"
              variant="outlined"
              required
              value={signupData.first_name}
              onChange={handleSignupChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Last Name"
              fullWidth
              size="small"
              name="last_name"
              variant="outlined"
              required
              value={signupData.last_name}
              onChange={handleSignupChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <TextField
            type="email"
            label="Email"
            fullWidth
            size="small"
            name="email"
            variant="outlined"
            required
            value={signupData.email}
            onChange={handleSignupChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              type="password"
              label="Password"
              fullWidth
              size="small"
              name="password"
              variant="outlined"
              required
              value={signupData.password}
              onChange={handleSignupChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              type="password"
              label="Re-enter password"
              fullWidth
              size="small"
              name="confirm_password"
              variant="outlined"
              required
              value={signupData.confirm_password}
              onChange={handleSignupChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* Role Selection */}
          <FormControl>
            <FormLabel>Role</FormLabel>
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

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Roll"
              fullWidth
              size="small"
              name="roll"
              variant="outlined"
              value={signupData.roll}
              onChange={handleSignupChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Degree"
              fullWidth
              size="small"
              name="degree"
              variant="outlined"
              value={signupData.degree}
              onChange={handleSignupChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SchoolOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Year"
              fullWidth
              size="small"
              name="year"
              variant="outlined"
              value={signupData.year}
              onChange={handleSignupChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WcOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Stream"
              fullWidth
              size="small"
              name="stream"
              variant="outlined"
              value={signupData.stream}
              onChange={handleSignupChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WcOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Button
            variant="contained"
            color="primary"
            sx={{
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2
            }}
            type="submit"
          >
            Create
          </Button>
        </>
      )}
    </Box>
  );

  return (
    <>
      {isLoading && <Loader message="Verifying credentials..." />}

      <Box
        sx={{
          // full-screen gradient background
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #68C3F9 0%, #0ABCF9 100%)",
          p: 2,
        }}
      >
        <Paper
          sx={{
            width: { xs: "90%", sm: 500, md: 600 }, // narrower form
            minHeight: 480,
            borderRadius: 3,
            p: { xs: 2, md: 4 },
          }}
          elevation={6}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
            sx={{ mb: 1 }}
          >
            <Tab label="Sign In" />
            <Tab label="Create Account" />
          </Tabs>

          {/* Tab Panels */}
          {tabValue === 0 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Sign In
              </Typography>
              {renderSignIn}
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Create Account
              </Typography>
              {renderSignUp}
            </Box>
          )}
        </Paper>
      </Box>
    </>
  );
}
