import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FaceIcon from "@mui/icons-material/Face";
// Additional icons for nav
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";

const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        // A slightly smoother transition by adding an intermediate color
        background: "linear-gradient(90deg, #03045E 15%, #023E8A 45%, #0077B6 100%)",
        paddingX: 3, // more horizontal space
        paddingY: 1, // vertical space
        // borderRadius: "0 0 10px 10px", // (Optional) If you want a slight curve at the bottom
      }}
    >
      <Toolbar disableGutters sx={{ display: "flex", alignItems: "center" }}>
        {/* Left: Brand / Logo Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginRight: 5 // space before nav
          }}
        >
          {/* Icon (replace with your own logo if desired) */}
          <FaceIcon sx={{ color: "#CAF0F8", fontSize: "2.2rem", mr: 1 }} />

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.4rem",
                color: "#FFFFFF",
                lineHeight: 1.2
              }}
            >
              Face Recognition Attendance
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#ADE8F4",
                fontSize: "0.75rem",
                marginTop: "2px"
              }}
            >
              Smart &amp; Secure
            </Typography>
          </Box>
        </Box>

        {/* Optional Divider for visual separation */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderColor: "rgba(255, 255, 255, 0.2)",
            marginRight: 4,
            height: "2rem",
            alignSelf: "center"
          }}
        />

        {/* Middle: Nav Links */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2, // spacing between nav items
            flexGrow: 1 // pushes login button to far right
          }}
        >
          <Button
            startIcon={<HomeOutlinedIcon />}
            sx={{
              color: "#CAF0F8",
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#90E0EF",
                backgroundColor: "rgba(202, 240, 248, 0.05)"
              }
            }}
          >
            Home
          </Button>
          <Button
            startIcon={<InfoOutlinedIcon />}
            sx={{
              color: "#CAF0F8",
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#90E0EF",
                backgroundColor: "rgba(202, 240, 248, 0.05)"
              }
            }}
          >
            About
          </Button>
          <Button
            startIcon={<StarOutlineIcon />}
            sx={{
              color: "#CAF0F8",
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#90E0EF",
                backgroundColor: "rgba(202, 240, 248, 0.05)"
              }
            }}
          >
            Features
          </Button>
          <Button
            startIcon={<ContactSupportOutlinedIcon />}
            sx={{
              color: "#CAF0F8",
              textTransform: "none",
              fontWeight: 500,
              borderRadius: 2,
              transition: "all 0.3s ease",
              "&:hover": {
                color: "#90E0EF",
                backgroundColor: "rgba(202, 240, 248, 0.05)"
              }
            }}
          >
            Contact
          </Button>
        </Box>

        {/* Right: Login / Sign Up Button */}
        <Box>
          <Button
            onClick={handleLoginClick}
            variant="contained"
            sx={{
              backgroundColor: "#03045E",
              color: "#CAF0F8",
              fontSize: "15px",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 3,
              boxShadow: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                color:"#03045E",
                backgroundColor: "#00B4D8",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)"
              }
            }}
          >
            Log In
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
