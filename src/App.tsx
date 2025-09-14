import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordRecovery from "./pages/PasswordRecovery";

function App() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/passwordRecovery" element={<PasswordRecovery />} />

        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

export default App;
