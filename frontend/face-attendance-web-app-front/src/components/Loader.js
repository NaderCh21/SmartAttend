import React from "react";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";

export default function Loader({ message = "Please wait..." }) {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999, //
        color: "#ffffff",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <FaceIcon sx={{ fontSize: 50 }} />

        {/* Spinner */}
        <CircularProgress color="inherit" size={50} />

        {/* Message */}
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {message}
        </Typography>
      </Stack>
    </Box>
  );
}
