import Login from "@/pages/Login";
import PasswordRecovery from "@/pages/PasswordRecovery";
import Register from "@/pages/Register";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedResolver } from "./Resolvers/ProtectedResolver";
import { Home } from "@/pages/Home";
import { Appointments } from "@/pages/Appointments";

export const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/passwordRecovery" element={<PasswordRecovery />} />
      <Route element={<ProtectedResolver redirectPath="/login" />}>

        <Route path="/home" element={<Home />} />
        <Route path="/appointments" element={<Appointments />} />
      </Route>

      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
};