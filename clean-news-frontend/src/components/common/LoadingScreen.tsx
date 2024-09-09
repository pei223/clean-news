import React from "react";
import { Box, CircularProgress } from "@mui/material";

type Props = {
  text?: string;
  onCancel?: () => void;
};

const LoadingScreen: React.FC<Props> = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <CircularProgress color="primary" size={70} />
    </Box>
  );
};

export default LoadingScreen;
