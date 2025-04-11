
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
import UserManagement from "./pages/admin/UserManagement";
import QueueManagement from "./pages/admin/QueueManagement";
import ACDRules from "./pages/admin/ACDRules";
import IVRBuilder from "./pages/admin/IVRBuilder";
import DirectoryManagement from "./pages/admin/DirectoryManagement";
import BroadcastManagement from "./pages/admin/BroadcastManagement";
import WhatsAppTemplates from "./pages/admin/WhatsAppTemplates";
import AuditLogs from "./pages/admin/AuditLogs";
import SystemSettings from "./pages/admin/SystemSettings";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
