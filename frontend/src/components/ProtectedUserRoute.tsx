import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../contexts/UserAuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedUserRouteProps {
  children: ReactNode;
}

export default function ProtectedUserRoute({ children }: ProtectedUserRouteProps) {
  const { isAuthenticated, isLoading } = useUserAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
