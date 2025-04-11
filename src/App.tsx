
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AgentDashboard from "./pages/agent/Dashboard";
import SupervisorDashboard from "./pages/supervisor/Dashboard";
import CallRecordings from "./pages/supervisor/CallRecordings";
import Reporting from "./pages/reporting/Reporting";
import AdminDashboard from "./pages/admin/Dashboard";
import { PageLayout } from "./components/layout/PageLayout";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

// Create placeholder components for admin pages that will be implemented later
const UserManagement = () => (
  <PageLayout title="User Management" allowedRoles={['admin']}>
    <div className="space-y-4">
      <p>User Management module will be implemented in future sprints.</p>
    </div>
  </PageLayout>
);

const QueueManagement = () => (
  <PageLayout title="Queue Management" allowedRoles={['admin']}>
    <div className="space-y-4">
      <p>Queue Management module will be implemented in future sprints.</p>
    </div>
  </PageLayout>
);

const ACDRules = () => (
  <PageLayout title="ACD Rules" allowedRoles={['admin']}>
    <div className="space-y-4">
      <p>ACD Rules module will be implemented in future sprints.</p>
    </div>
  </PageLayout>
);

const IVRBuilder = () => (
  <PageLayout title="IVR Builder" allowedRoles={['admin']}>
    <div className="space-y-4">
      <p>IVR Builder module will be implemented in future sprints.</p>
    </div>
  </PageLayout>
);

const DirectoryManagement = () => (
  <PageLayout title="Directory Management" allowedRoles={['admin']}>
    <div className="space-y-4">
      <p>Directory Management module will be implemented in future sprints.</p>
    </div>
  </PageLayout>
);

const BroadcastManagement = () => (
  <PageLayout title="Broadcast Management" allowedRoles={['admin']}>
    <div className="space-y-4">
      <p>Broadcast Management module will be implemented in future sprints.</p>
    </div>
  </PageLayout>
);

const WhatsAppTemplates = () => (
  <PageLayout title="WhatsApp Templates" allowedRoles={['admin']}>
    <div className="space-y-4">
      <p>WhatsApp Templates module will be implemented in future sprints.</p>
    </div>
  </PageLayout>
);

const AuditLogs = () => (
  <PageLayout title="Audit Logs" allowedRoles={['admin']}>
    <div className="space-y-4">
      <p>Audit Logs module will be implemented in future sprints.</p>
    </div>
  </PageLayout>
);

const SystemSettings = () => (
  <PageLayout title="System Settings" allowedRoles={['admin']}>
    <div className="space-y-4">
      <p>System Settings module will be implemented in future sprints.</p>
    </div>
  </PageLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            
            {/* Agent Routes */}
            <Route path="/agent" element={<AgentDashboard />} />
            
            {/* Supervisor Routes */}
            <Route path="/supervisor" element={<SupervisorDashboard />} />
            <Route path="/supervisor/call-recordings" element={<CallRecordings />} />
            <Route path="/reporting" element={<Reporting />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/queues" element={<QueueManagement />} />
            <Route path="/admin/acd-rules" element={<ACDRules />} />
            <Route path="/admin/ivr-builder" element={<IVRBuilder />} />
            <Route path="/admin/directory" element={<DirectoryManagement />} />
            <Route path="/admin/broadcasts" element={<BroadcastManagement />} />
            <Route path="/admin/whatsapp-templates" element={<WhatsAppTemplates />} />
            <Route path="/admin/audit-logs" element={<AuditLogs />} />
            <Route path="/admin/settings" element={<SystemSettings />} />
            
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
