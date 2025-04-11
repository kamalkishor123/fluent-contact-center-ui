
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  PhoneCall,
  MonitorSmartphone,
  Phone,
  ClipboardList,
  Radio,
  MessageSquareText,
  Settings,
  History,
  BarChart3,
  PlusCircle,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Module status type
type ModuleStatus = 'healthy' | 'warning' | 'error' | 'maintenance';

// Admin module type
interface AdminModule {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  status: ModuleStatus;
  statusMessage?: string;
}

// System status type
interface SystemStatus {
  id: string;
  name: string;
  status: ModuleStatus;
  uptime: string;
  lastIssue?: string;
}

// Mock admin modules
const ADMIN_MODULES: AdminModule[] = [
  {
    id: 'users',
    title: 'User Management',
    description: 'Manage users, permissions and roles',
    icon: Users,
    path: '/admin/users',
    status: 'healthy',
  },
  {
    id: 'queues',
    title: 'Queue Management',
    description: 'Configure call queues and routing',
    icon: PhoneCall,
    path: '/admin/queues',
    status: 'healthy',
  },
  {
    id: 'acd',
    title: 'ACD Rules',
    description: 'Define automatic call distribution rules',
    icon: MonitorSmartphone,
    path: '/admin/acd-rules',
    status: 'warning',
    statusMessage: 'Rule "Overflow to Sales" needs review',
  },
  {
    id: 'ivr',
    title: 'IVR Builder',
    description: 'Create and manage IVR flows',
    icon: Phone,
    path: '/admin/ivr-builder',
    status: 'healthy',
  },
  {
    id: 'directory',
    title: 'Directory Management',
    description: 'Manage contact directory',
    icon: ClipboardList,
    path: '/admin/directory',
    status: 'healthy',
  },
  {
    id: 'broadcasts',
    title: 'Broadcast Management',
    description: 'Create and schedule broadcasts',
    icon: Radio,
    path: '/admin/broadcasts',
    status: 'maintenance',
    statusMessage: 'Scheduled maintenance (Apr 12)',
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp Templates',
    description: 'Manage WhatsApp message templates',
    icon: MessageSquareText,
    path: '/admin/whatsapp-templates',
    status: 'healthy',
  },
  {
    id: 'audit',
    title: 'Audit Logs',
    description: 'View system audit logs',
    icon: History,
    path: '/admin/audit-logs',
    status: 'healthy',
  },
  {
    id: 'settings',
    title: 'System Settings',
    description: 'Configure global system settings',
    icon: Settings,
    path: '/admin/settings',
    status: 'healthy',
  },
];

// Mock system status
const SYSTEM_STATUS: SystemStatus[] = [
  {
    id: 'telephony',
    name: 'Telephony Services',
    status: 'healthy',
    uptime: '99.99% (30 days)',
  },
  {
    id: 'recording',
    name: 'Call Recording',
    status: 'healthy',
    uptime: '100% (30 days)',
  },
  {
    id: 'database',
    name: 'Database Services',
    status: 'healthy',
    uptime: '99.98% (30 days)',
  },
  {
    id: 'integration',
    name: 'CRM Integration',
    status: 'warning',
    uptime: '99.82% (30 days)',
    lastIssue: '2023-04-10: 15min degraded performance',
  },
  {
    id: 'api',
    name: 'API Services',
    status: 'healthy',
    uptime: '99.95% (30 days)',
  },
];

// Component for status indicator
const StatusIndicator = ({ status }: { status: ModuleStatus }) => {
  const colorClasses = {
    healthy: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    maintenance: 'bg-blue-500',
  };

  return (
    <span className="flex items-center">
      <span className={cn('w-2 h-2 rounded-full mr-2', colorClasses[status])}></span>
      <span className="text-xs font-medium capitalize">{status}</span>
    </span>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Calculate overall system health
  const systemHealth = SYSTEM_STATUS.every(item => item.status === 'healthy') 
    ? 'healthy' 
    : SYSTEM_STATUS.some(item => item.status === 'error')
      ? 'error'
      : 'warning';
  
  return (
    <PageLayout 
      title="Admin Dashboard" 
      subtitle="System overview and administrative modules"
      allowedRoles={['admin']}
    >
      <div className="space-y-6">
        {/* System Status Overview */}
        <section>
          <h2 className="text-lg font-medium mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium flex items-center justify-between">
                  <span>Overall System Health</span>
                  <StatusIndicator status={systemHealth} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {SYSTEM_STATUS.map((item) => (
                    <li key={item.id} className="flex items-center justify-between p-2 border-b last:border-0">
                      <span className="font-medium">{item.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{item.uptime}</span>
                        <StatusIndicator status={item.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/reporting')}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View System Reports
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/admin/audit-logs')}>
                    <History className="mr-2 h-4 w-4" />
                    Check Audit Logs
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/supervisor/call-recordings')}>
                    <Phone className="mr-2 h-4 w-4" />
                    Browse Call Recordings
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/admin/users')}>
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                  
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Recent issues</h4>
                    {SYSTEM_STATUS.some(item => item.lastIssue) ? (
                      <ul className="text-sm space-y-2">
                        {SYSTEM_STATUS.filter(item => item.lastIssue).map((item) => (
                          <li key={item.id} className="flex items-start">
                            <AlertCircle className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
                            <span><span className="font-medium">{item.name}:</span> {item.lastIssue}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No recent issues detected.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Admin Modules */}
        <section>
          <h2 className="text-lg font-medium mb-4">Administrative Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADMIN_MODULES.map((module) => (
              <Card key={module.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-md mr-3">
                        <module.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base font-medium">{module.title}</CardTitle>
                    </div>
                    <StatusIndicator status={module.status} />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <CardDescription>{module.description}</CardDescription>
                  {module.statusMessage && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Note: {module.statusMessage}
                    </p>
                  )}
                </CardContent>
                <div className="px-6 py-2 bg-muted/50 border-t">
                  <Button 
                    className="w-full" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(module.path)}
                  >
                    Manage
                  </Button>
                </div>
              </Card>
            ))}
            
            {/* Add New Module Card (for future expansion) */}
            <Card className="flex flex-col items-center justify-center border-dashed bg-muted/30">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="p-2 rounded-full border-2 border-dashed mb-3">
                  <PlusCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">Add Custom Module</p>
                <p className="text-xs text-muted-foreground mt-1">(Coming Soon)</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;
