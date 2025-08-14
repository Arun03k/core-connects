import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Documentation from "../pages/Documentation";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/documentation" element={<Documentation />} />
      {/* add more routes later: /dashboard, /employees, etc. */}
    </Routes>
  );
};

export default AppRoutes;
