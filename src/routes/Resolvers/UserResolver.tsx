import { useStore } from "@/zustand/store";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface Props {
  children: React.ReactElement;
}

export const UserResolver: React.FC<Props> = ({ children }) => {
  const { user } = useStore();
  const location = useLocation();

  const hasHydrated = useStore.persist?.hasHydrated?.() ?? true;
  if (!hasHydrated) return <div>Loading...</div>;

  const isAuthenticated =
    Boolean(user?.id) &&
    Boolean(user?.expiresAt) &&
    user.expiresAt!.date > new Date();

  const routesDeflect = ["/login", "/register", "/password-recovery"];

  if (isAuthenticated) {
    if (routesDeflect.includes(location.pathname)) {
      return <Navigate to={"/home"} replace />;
    }
  }

  return children;
};
