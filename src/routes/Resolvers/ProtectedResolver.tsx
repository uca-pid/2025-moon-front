import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  redirectPath: string;
}

export const ProtectedResolver = ({ redirectPath }: Props) => {
  // TODO: implementar un validator de token
  if (false) {
    return <Navigate to={redirectPath} />;
  } else {
    return <Outlet />;
  }
};