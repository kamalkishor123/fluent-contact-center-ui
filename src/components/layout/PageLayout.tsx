
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  rightContent?: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: Array<'agent' | 'supervisor' | 'admin'>;
}

export function PageLayout({ 
  children, 
  title, 
  subtitle, 
  rightContent,
  requireAuth = true,
  allowedRoles
}: PageLayoutProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    // Redirect if not authenticated and auth is required
    if (requireAuth && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    // Check for role restrictions
    if (
      isAuthenticated && 
      user && 
      allowedRoles && 
      user.role && 
      !allowedRoles.includes(user.role)
    ) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page",
        variant: "destructive"
      });
      
      // Redirect based on role
      if (user.role === 'agent') {
        navigate('/agent');
      } else if (user.role === 'supervisor') {
        navigate('/supervisor');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, user, navigate, requireAuth, allowedRoles, toast]);

  if (requireAuth && !isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-y-auto bg-background">
          <div className="sticky top-0 z-10 bg-background border-b flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4 md:hidden" />
              <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
              </div>
            </div>
            {rightContent && (
              <div className="flex items-center">
                {rightContent}
              </div>
            )}
          </div>
          <div className="p-6 flex-1">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
