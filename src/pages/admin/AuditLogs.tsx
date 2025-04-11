
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, DownloadCloud, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock audit log data
const auditLogs = [
  {
    id: '1',
    timestamp: '2025-04-11T10:15:23Z',
    user: 'admin@example.com',
    action: 'user.create',
    resource: 'users/john.doe',
    resourceType: 'user',
    status: 'success',
    ipAddress: '192.168.1.105',
    details: { name: 'John Doe', role: 'agent', department: 'Support' }
  },
  {
    id: '2',
    timestamp: '2025-04-11T09:30:45Z',
    user: 'admin@example.com',
    action: 'queue.update',
    resource: 'queues/support',
    resourceType: 'queue',
    status: 'success',
    ipAddress: '192.168.1.105',
    details: { name: 'Customer Support', changes: { maxWaitTime: '180 -> 120' } }
  },
  {
    id: '3',
    timestamp: '2025-04-11T08:45:12Z',
    user: 'jane.smith@example.com',
    action: 'ivr.update',
    resource: 'ivr/main-menu',
    resourceType: 'ivr',
    status: 'success',
    ipAddress: '192.168.1.112',
    details: { name: 'Main Menu IVR', changes: { nodes: '10 -> 12' } }
  },
  {
    id: '4',
    timestamp: '2025-04-10T16:20:38Z',
    user: 'john.doe@example.com',
    action: 'user.login',
    resource: 'users/john.doe',
    resourceType: 'auth',
    status: 'failure',
    ipAddress: '203.0.113.45',
    details: { reason: 'Invalid password' }
  },
  {
    id: '5',
    timestamp: '2025-04-10T14:55:20Z',
    user: 'admin@example.com',
    action: 'system.update',
    resource: 'system/settings',
    resourceType: 'system',
    status: 'success',
    ipAddress: '192.168.1.105',
    details: { changes: { workingHours: '9-5 -> 8-6' } }
  }
];

// Action types with their corresponding badges
const actionTypeBadge: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", label: string }> = {
  'user.create': { variant: 'default', label: 'User Create' },
  'user.update': { variant: 'default', label: 'User Update' },
  'user.delete': { variant: 'destructive', label: 'User Delete' },
  'user.login': { variant: 'secondary', label: 'User Login' },
  'queue.create': { variant: 'default', label: 'Queue Create' },
  'queue.update': { variant: 'default', label: 'Queue Update' },
  'queue.delete': { variant: 'destructive', label: 'Queue Delete' },
  'ivr.create': { variant: 'default', label: 'IVR Create' },
  'ivr.update': { variant: 'default', label: 'IVR Update' },
  'ivr.delete': { variant: 'destructive', label: 'IVR Delete' },
  'system.update': { variant: 'outline', label: 'System Update' }
};

// Status badge variants
const statusBadgeVariant: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
  'success': 'default',
  'failure': 'destructive',
  'warning': 'secondary'
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

const AuditLogs = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Apply filters to logs
  const filteredLogs = auditLogs.filter(log => 
    (searchQuery === '' || 
     log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
     log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
     log.resource.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (resourceTypeFilter === 'all' || log.resourceType === resourceTypeFilter) &&
    (statusFilter === 'all' || log.status === statusFilter)
  );

  // Get unique resource types for the filter
  const resourceTypes = [...new Set(auditLogs.map(log => log.resourceType))];
  
  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  
  const handleExport = () => {
    console.log('Exporting logs...');
    // Logic to export logs would go here
  };

  return (
    <PageLayout 
      title="Audit Logs" 
      subtitle="View and search system audit trails"
      allowedRoles={['admin']}
    >
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search logs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={resourceTypeFilter} onValueChange={setResourceTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Resource Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {resourceTypes.map(type => (
                  <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={handleExport}>
              <DownloadCloud className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Audit Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>System Audit Logs</CardTitle>
            <CardDescription>Review system activity and security events</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">{formatDate(log.timestamp)}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      {actionTypeBadge[log.action] ? (
                        <Badge variant={actionTypeBadge[log.action].variant}>
                          {actionTypeBadge[log.action].label}
                        </Badge>
                      ) : (
                        <Badge variant="outline">{log.action}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={log.resource}>
                      {log.resource}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant[log.status]} className="capitalize">
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.ipAddress}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Details</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <pre className="text-xs">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No audit logs match your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            {filteredLogs.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Page</span>
                  </Button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages || 1}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Page</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AuditLogs;
