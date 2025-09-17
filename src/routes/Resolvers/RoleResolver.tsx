import { useStore } from "@/zustand/store";
import { Navigate, Outlet } from "react-router-dom";
import type { UserRole } from "@/zustand/session/session.types";

interface Props {
  redirectPath: string;
  role: UserRole;
}

export const RoleResolver = ({ redirectPath, role }: Props) => {
  const { user } = useStore()
  if (String(user.userRole).trim().toLowerCase() === String(role).trim().toLowerCase()) {
    return <Outlet />;
  } else {
    return <Navigate to={redirectPath} />;
  }
}