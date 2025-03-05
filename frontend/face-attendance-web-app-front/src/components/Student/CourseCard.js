import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaCheckCircle,
  FaUserTie,
  FaCalendarAlt,
  FaRegClock,
} from "react-icons/fa";
import PopUp from "./PopUp"; // The new MUI-based Snackbar version

// Material UI
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";

// For subtle animation on mount
import { useSpring, animated } from "react-spring";

// Example color palette usage
const PRIMARY_DARK = "#03045E";    // deep navy
const PRIMARY_MEDIUM = "#0077B6";  // mid-blue
const ACCENT_GREEN = "#48CAE4";    // teal-ish color

export default function CourseCard({ course, isRegistered, onRegister }) {
  const [isRegisteredState, setIsRegisteredState] = useState(isRegistered);
  const [showPopup, setShowPopup] = useState(false);

  // Subtle "pop" animation config
  const springStyles = useSpring({
    from: { opacity: 0, transform: "scale(0.95)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 170, friction: 16 },
  });

  // Keep local state synced with parent prop
  useEffect(() => {
    setIsRegisteredState(isRegistered);
  }, [isRegistered]);

  const handleRegister = async () => {
    try {
      // Show the pop-up immediately
      setShowPopup(true);

      // Trigger registration logic
      await onRegister(course.id);

      // Example: 2-second "processing" delay, then mark as registered
      setTimeout(() => {
        setIsRegisteredState(true);
        // We do NOT hide the pop-up here; the Snackbar closes itself
      }, 2000);

    } catch (error) {
      console.error("Error during registration:", error);
      setShowPopup(false);
      alert("Failed to register for the course. Please try again.");
    }
  };

  return (
    <animated.div style={springStyles}>
      <Card
        sx={{
          width: { xs: 250, sm: 300, md: 320 },
          borderRadius: 2,
          boxShadow: 3,
          position: "relative",
          transition: "transform 0.3s",
          "&:hover": {
            transform: "translateY(-4px)",
          },
          m: 2,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 1.5,
          }}
        >
          {/* Big icon for the course "image" */}
          <Box sx={{ color: PRIMARY_MEDIUM, mb: 1 }}>
            <FaUserTie size={48} />
          </Box>

          {/* Course Name */}
          <Typography variant="h5" sx={{ fontWeight: 700, color: PRIMARY_DARK }}>
            {course.name}
          </Typography>

          <Divider sx={{ width: "80%", my: 1 }} />

          {/* Instructor */}
          <Typography
            variant="body2"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <FaUserTie />
            <strong>Instructor:</strong> {course.instructor || "N/A"}
          </Typography>

          {/* Semester */}
          <Typography
            variant="body2"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <FaCalendarAlt />
            <strong>Semester:</strong> {course.semester}
          </Typography>

          {/* Year */}
          <Typography
            variant="body2"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <FaRegClock />
            <strong>Year:</strong> {course.year}
          </Typography>

          {/* Credits */}
          <Typography variant="body2">
            <strong>Credits:</strong> {course.credits || 3}
          </Typography>
        </CardContent>

        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          {!isRegisteredState ? (
            <Button
              variant="contained"
              onClick={handleRegister}
              disabled={showPopup} // optionally disable while "Processing..."
              sx={{
                backgroundColor: showPopup ? "#ccc" : PRIMARY_MEDIUM,
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: showPopup ? "#ccc" : "#023E8A",
                },
              }}
              startIcon={!showPopup ? <FaPlus /> : null}
            >
              {showPopup ? "Processing..." : "Register"}
            </Button>
          ) : (
            <Button
              variant="contained"
              disabled
              sx={{
                textTransform: "none",
                backgroundColor: "#2e7d32", // some green
                borderRadius: 2,
              }}
              startIcon={<FaCheckCircle />}
            >
              Registered
            </Button>
          )}
        </CardActions>
      </Card>

      {/* MUI-based pop-up (Snackbar + Alert) */}
      <PopUp
        visible={showPopup}
        message="Successfully Registered!"
        onClose={() => setShowPopup(false)}
        autoHideDuration={8000}
      />
    </animated.div>
  );
}
 