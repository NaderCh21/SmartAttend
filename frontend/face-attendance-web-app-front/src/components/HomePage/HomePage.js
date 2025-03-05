// src/components/HomePage/HomePage.js
import React from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import HomeSection from "./HomeSection";

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(90deg, #03045E 20%, #0077B6 100%)",
        overflowX: "hidden"
      }}
    >
      <Header />

      {/* Main / Hero Section */}
      <HomeSection />

      {/* If you want to add more sections later, import and render them here: */}
      {/* <FeaturesSection /> */}
      {/* <Footer /> */}
    </Box>
  );
};

export default HomePage;
