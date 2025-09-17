import { useStore } from '@/zustand/store';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export const UserResolver: React.FC<Props> = ({ children }) => {
  const { user } = useStore();
  const location = useLocation();

  const hasHydrated = useStore.persist?.hasHydrated?.() ?? true;
  if (!hasHydrated) return <div>Loading...</div>;

  const isAuthenticated = Boolean(user?.id) && Boolean(user?.expiresAt) && user.expiresAt!.date > new Date();

  const routesDeflect = [
    '/login',
    '/register',
    '/passwordRecovery',
  ]
  
  if (isAuthenticated) {
    if (routesDeflect.includes(location.pathname)) {
      return <Navigate to={'/home'} replace />;
    }
  } else {
    if (!routesDeflect.includes(location.pathname)) {
      return <Navigate to={'/login'} replace />;
    }
  }

  return <>{children}</>;
};