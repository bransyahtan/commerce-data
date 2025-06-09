import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196F3",
    },
    secondary: {
      main: "#dc004e",
    },
    success: {
      main: "#4CAF50",
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: "#f5f7fa",
    },
  },
  typography: {
    fontFamily: ["Roboto", "sans-serif"].join(","),
    h3: {
      fontSize: "2.8rem",
      fontWeight: 700,
    },
    h4: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1.2rem",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        },
      },
    },
  },
});

export default theme;
