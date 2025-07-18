import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';

const isAuthenticated = () => {
    
}


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile, isLoading } = useProfile();

  if (isLoading) return <div>Loading...</div>; 

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
