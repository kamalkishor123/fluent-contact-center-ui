
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Redirect based on user role
    if (user) {
      switch (user.role) {
        case 'agent':
          navigate('/agent');
          break;
        case 'supervisor':
          navigate('/supervisor');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/login');
      }
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-cc-primary" />
        <h2 className="mt-4 text-xl">Redirecting to dashboard...</h2>
      </div>
    </div>
  );
};

export default Index;
