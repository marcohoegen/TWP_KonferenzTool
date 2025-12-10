import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

export default function ProtectedAdminRoute({
  children,
}: ProtectedAdminRouteProps) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login?unauthorized=true" replace />;
  }

  return <>{children}</>;
}
