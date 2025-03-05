import React from "react";
import { Box, Grid, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Typed from "react-typed";
import MainImage from "../../assets/MainImage.png";

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const HomeSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <Box
      id="home"
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        background: "linear-gradient(135deg, #03045E 20%, #0077B6 100%)",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 4, md: 8 },
        py: { xs: 4, md: 8 },
        color: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <Grid
        container
        spacing={6}
        alignItems="center"
        justifyContent="center"
        component={motion.div}
        variants={containerVariants}
      >
        {/* Left Column: Image */}
        <Grid
          item
          xs={12}
          md={6}
          textAlign="center"
          component={motion.div}
          variants={itemVariants}
        >
          <Box
            component="img"
            src={MainImage}
            alt="Main Eye Recognition"
            sx={{
              width: { xs: "80%", md: "70%" },
              //backgroundColor: "#00B4D8",
              maxWidth: 500,
              borderRadius: 2,
              boxShadow: 5,
              transition: "transform 0.4s",
              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
          />
        </Grid>

        {/* Right Column: Animated Text & Button */}
        <Grid
          item
          xs={12}
          md={6}
          textAlign={{ xs: "center", md: "left" }}
          component={motion.div}
          variants={itemVariants}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
            justifyContent: "center",
          }}
        >
          {/* Animated/Typed Title */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "#00B4D8   ",
              lineHeight: 1.2,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            <Typed
              strings={["Face Recognition", "Smart and Secure"]}
              typeSpeed={100}
              backSpeed={40}
              backDelay={500}
              startDelay={300}
              smartBackspace={false}
              fadeOut={false}
              loop
              showCursor
              cursorChar="|"
            />
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              maxWidth: 500,
              color: "#ADE8F4",
              fontSize: { xs: "1rem", sm: "1.1rem" },
              fontWeight: 300,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Effortlessly manage attendance and access your data with
            cutting-edge facial recognition technology. It’s time to streamline
            your everyday tasks!
          </Typography>

          {/* Button(s) in a Stack for nice spacing */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              component={motion.button}
              sx={{
                backgroundColor: "#00B4D8",
                color: "#03045E",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 3,
                px: 4,
                py: 1.2,
                "&:hover": {
                  backgroundColor: "#90E0EF",
                },
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeSection;
