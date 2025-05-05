
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Make sure we use the same role type as in UserManagement.tsx
type UserRole = 'agent' | 'supervisor' | 'admin' | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
  agentId?: string;
  status?: 'ready' | 'not-ready' | 'wrap-up' | 'on-call';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateStatus: (status: 'ready' | 'not-ready' | 'wrap-up' | 'on-call') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check for existing session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Mock login function (would connect to a real API in production)
  const login = async (email: string, password: string) => {
    try {
      // This would be an API call in a real app
      console.log('Logging in with:', email, password);
      
      // Based on email, set user with different role for demo purposes
      let mockUser: User;
      
      if (email.includes('agent')) {
        mockUser = { 
          id: '1', 
          name: 'John Agent', 
          role: 'agent', 
          agentId: 'A001',
          status: 'ready'
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsAuthenticated(true);
        navigate('/agent');
      } 
      else if (email.includes('supervisor')) {
        mockUser = { 
          id: '2', 
          name: 'Sarah Supervisor', 
          role: 'supervisor' 
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsAuthenticated(true);
        navigate('/supervisor');
      }
      else if (email.includes('admin')) {
        mockUser = { 
          id: '3', 
          name: 'Adam Admin', 
          role: 'admin' 
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsAuthenticated(true);
        navigate('/admin');
      }
      else {
        // Default to agent for demo
        mockUser = { 
          id: '1', 
          name: 'John Agent', 
          role: 'agent',
          agentId: 'A001',
          status: 'ready'
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setIsAuthenticated(true);
        navigate('/agent');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const updateStatus = (status: 'ready' | 'not-ready' | 'wrap-up' | 'on-call') => {
    if (user && user.role === 'agent') {
      const updatedUser = { ...user, status };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
