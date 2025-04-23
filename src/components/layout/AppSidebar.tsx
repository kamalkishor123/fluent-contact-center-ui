import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  MessagesSquare,
  PhoneCall,
  BarChart3,
  Settings,
  ClipboardList,
  Phone,
  MonitorSmartphone,
  FileAudio,
  Radio,
  MessageSquareText,
  History,
  Menu,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
}

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [confirmLogout, setConfirmLogout] = React.useState(false);
  
  const agentNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/agent'
    }
  ];
  
  const supervisorNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/supervisor'
    },
    {
      title: 'Call Recordings',
      icon: FileAudio,
      path: '/supervisor/call-recordings'
    },
    {
      title: 'Reporting',
      icon: BarChart3,
      path: '/reporting'
    }
  ];
  
  const adminNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin'
    },
    {
      title: 'User Management',
      icon: Users,
      path: '/admin/users'
    },
    {
      title: 'Queue Management',
      icon: PhoneCall,
      path: '/admin/queues'
    },
    {
      title: 'ACD Rules',
      icon: MonitorSmartphone,
      path: '/admin/acd-rules'
    },
    {
      title: 'IVR Builder',
      icon: Phone,
      path: '/admin/ivr-builder'
    },
    {
      title: 'Directory',
      icon: ClipboardList,
      path: '/admin/directory'
    },
    {
      title: 'Broadcasts',
      icon: Radio,
      path: '/admin/broadcasts'
    },
    {
      title: 'WhatsApp Templates',
      icon: MessageSquareText,
      path: '/admin/whatsapp-templates'
    },
    {
      title: 'Audit Logs',
      icon: History,
      path: '/admin/audit-logs'
    },
    {
      title: 'System Settings',
      icon: Settings,
      path: '/admin/settings'
    },
  ];
  
  const navItems = user?.role === 'agent' ? agentNavItems :
                  user?.role === 'supervisor' ? supervisorNavItems :
                  user?.role === 'admin' ? adminNavItems : [];
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  const handleLogout = () => {
    if (confirmLogout) {
      logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the system."
      });
    } else {
      setConfirmLogout(true);
      setTimeout(() => setConfirmLogout(false), 3000);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <PhoneCall className="text-cc-primary h-6 w-6" />
          <h1 className="text-xl font-semibold">Contact Center</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    className={location.pathname === item.path ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-4 py-2">
          {user && (
            <div className="mb-4 text-sm flex items-center gap-2">
              <div className="flex-1">
                <p className="font-semibold flex items-center gap-1">
                  {user.name}
                  <button
                    aria-label="User Settings"
                    className="ml-1 p-1 rounded-full hover:bg-muted transition"
                    onClick={() => {
                      console.log("Open user settings");
                    }}
                    title="User Settings"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground hover:text-cc-primary" />
                  </button>
                </p>
                <p className="text-muted-foreground capitalize">{user.role}</p>
                {user.agentId && (
                  <p className="text-xs text-muted-foreground">
                    ID: {user.agentId}
                  </p>
                )}
              </div>
            </div>
          )}
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {confirmLogout ? "Click again to confirm" : "Logout"}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
