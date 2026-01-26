import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthService } from '@/api/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login'
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = AuthService.isAuthenticated();

  useEffect(() => {
    // Check authentication on mount and when location changes
    if (!AuthService.isAuthenticated()) {
      // Clear any stale data
      sessionStorage.clear();
      // Redirect to login
      navigate(redirectTo, { replace: true });
    }
  }, [location, navigate, redirectTo]);

  if (!isAuthenticated) {
    // Redirect to login page with return url, using replace to prevent back navigation
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
