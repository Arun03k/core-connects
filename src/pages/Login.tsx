import React from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";

const Login: React.FC = () => {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 420 }}>
        <Typography variant="h5" gutterBottom>login</Typography>
        <TextField label="email" fullWidth sx={{ mt: 2 }} />
        <TextField label="password" type="password" fullWidth sx={{ mt: 2 }} />
        <Button variant="contained" fullWidth sx={{ mt: 3 }}>
          continue
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
