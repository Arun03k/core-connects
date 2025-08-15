import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Documentation from "../pages/Documentation";
import Dashboard from "../pages/Dashboard";
import AuthDemo from "../pages/AuthDemo";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth-demo" element={<AuthDemo />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      {/* add more routes later: /employees, etc. */}
    </Routes>
  );
};

export default AppRoutes;
