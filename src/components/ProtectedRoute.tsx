import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useRootContext } from '../context/RootContext';

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthorized } = useRootContext();

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
