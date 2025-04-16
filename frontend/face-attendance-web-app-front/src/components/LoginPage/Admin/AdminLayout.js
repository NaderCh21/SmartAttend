import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

// --- Material UI Imports ---
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Avatar,
  Button,
  InputAdornment,
} from "@mui/material";

// --- Material UI Icons (choose whichever you like) ---
import MenuBookIcon from "@mui/icons-material/MenuBook"; // for 'Courses'
import DashboardIcon from "@mui/icons-material/Dashboard"; // for 'Dashboard'
import CoPresentIcon from "@mui/icons-material/CoPresent"; // for 'Attendance'
import SchoolIcon from "@mui/icons-material/School"; // for 'All Available Courses'
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

// NOTE: We do NOT rely on the old CSS; we use MUI's styles below instead.

// Custom drawer width
const drawerWidth = 220;

const StudentLayout = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const studentId = localStorage.getItem("studentId");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    if (!studentId) {
      alert("Student ID not found. Redirecting to login...");
      window.location.href = "/login";
      return;
    }

    const fetchRegisteredCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/courses/students/${studentId}/courses`
        );
        setRegisteredCourses(response.data);
      } catch (error) {
        console.error(
          "Error fetching registered courses:",
          error.response || error
        );
      }
    };

    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/students/${studentId}`
        );
        setStudentDetails(response.data);
      } catch (error) {
        console.error(
          "Error fetching student details:",
          error.response || error
        );
      }
    };

    fetchRegisteredCourses();
    fetchStudentDetails();
  }, [studentId]);

  // --- Handler: Logout ---
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // --- Sidebar Items ---
  const navItems = [
    {
      label: "Dashboard",
      icon: <DashboardIcon />,
      link: "/student/dashboard",
    },
    {
      label: "All Available Courses",
      icon: <SchoolIcon />,
      link: "/student/all-courses",
    },
    {
      label: "Courses",
      icon: <MenuBookIcon />,
      link: "/student/courses",
    },
    {
      label: "Attendance",
      icon: <CoPresentIcon />,
      link: "/student/attendance",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* SIDEBAR (Drawer) */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#2f3e4d", // darker background
            color: "#ffffff",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Student Section
          </Typography>
        </Toolbar>

        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.label}
              component={NavLink}
              to={item.link}
              sx={{
                "&.active": {
                  backgroundColor: "#3e5060",
                  color: "#fff",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* MAIN CONTENT AREA */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
          // This ensures content starts below the fixed header
          pt: { xs: 8, sm: 8 }, // adjust if you changed the toolbar height
        }}
      >
        {/* HEADER / TOP BAR */}
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`, // fill remaining space
            ml: `${drawerWidth}px`, // shift right by drawer width
            backgroundColor: "#ffffff",
            color: "#333",
            boxShadow: "none",
            borderBottom: "1px solid #ddd",
            zIndex: (theme) => theme.zIndex.drawer + 1, // ensure header is above the drawer
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Search Bar */}
            <Box sx={{ width: "40%" }}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth
                placeholder="Search for courses, students..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Student Info + Logout */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Student Name */}
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {studentDetails
                  ? `${studentDetails.first_name} ${studentDetails.last_name}`
                  : "Loading..."}
              </Typography>

              {/* Student Icon */}
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                <PersonIcon />
              </Avatar>

              {/* Logout */}
              <Button
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ textTransform: "none" }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* PAGE CONTENT (children) */}
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default StudentLayout;
