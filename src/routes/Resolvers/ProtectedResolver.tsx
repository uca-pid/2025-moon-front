import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '@/zustand/store';

interface Props {
  redirectPath: string;
}

export const ProtectedResolver = ({ redirectPath }: Props) => {
  const { user } = useStore()
  if (user.expiresAt && user.expiresAt.date < new Date()) {
    return <Navigate to={redirectPath} />;
  } else {
    return <Outlet />;
  }
};