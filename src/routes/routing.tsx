import Login from "@/pages/Login";
import PasswordRecovery from "@/pages/PasswordRecovery";
import Register from "@/pages/Register";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedResolver } from "./Resolvers/ProtectedResolver";
import { Home } from "@/pages/Home";
import { Appointments } from "@/pages/Appointments";
import { RoleResolver } from "./Resolvers/RoleResolver";
import { UserRoles } from "@/zustand/session/session.types";
import { Profile } from "@/pages/Profile";

export const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/password-recovery" element={<PasswordRecovery />} />

      <Route element={<ProtectedResolver redirectPath="/login" />}>

        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route element={<RoleResolver role={UserRoles.USER} redirectPath="/login" />}>
          <Route path="/appointments" element={<Appointments />} />
        </Route>
      </Route>

      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
};
