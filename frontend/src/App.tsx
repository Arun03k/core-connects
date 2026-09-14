import React, { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { restoreSession } from "./store/thunks/authThunks";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import theme from "./theme";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // Retire credentials left by the old persistent-storage implementation.
    try {
      for (const key of ['accessToken', 'refreshToken', 'tokenExpiresIn', 'user']) localStorage.removeItem(key);
    } catch { /* Browser storage may be unavailable. */ }
    void dispatch(restoreSession());
  }, [dispatch]);
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
