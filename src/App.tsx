import React from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#7C4DFF" }, // nice purple
    secondary: { main: "#3F51B5" }, // indigo
  },
  shape: { borderRadius: 12 },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
