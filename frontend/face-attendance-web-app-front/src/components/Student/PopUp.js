import React from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

/**
 * Slide transition component for Snackbar
 */
function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const PopUp = ({
  visible = false,
  message = "Successfully Registered!",
  onClose,
  autoHideDuration = 8000,
}) => {
  return (
    <Snackbar
      open={visible}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        variant="filled"
        severity="success"
        onClose={onClose}
        sx={{ fontWeight: 500 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default PopUp;
