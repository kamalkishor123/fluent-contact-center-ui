
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Search, Clock, Calendar, Megaphone, Radio, MoreVertical, Edit, Trash2, Copy, PauseCircle, PlayCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Mock broadcast data
const broadcasts = [
  {
    id: '1',
    name: 'Customer Satisfaction Survey',
    description: 'Post-call survey for support interactions',
    type: 'voice',
    status: 'scheduled',
    scheduled: '2025-04-15T09:00:00Z',
    targets: 250,
    completed: 0,
    inProgress: false
  },
  {
    id: '2',
    name: 'System Maintenance Notification',
    description: 'Alert about upcoming system downtime',
    type: 'sms',
    status: 'active',
    scheduled: '2025-04-11T08:00:00Z',
    targets: 500,
    completed: 324,
    inProgress: true
  },
  {
    id: '3',
    name: 'New Feature Announcement',
    description: 'Information about latest product features',
    type: 'email',
    status: 'completed',
    scheduled: '2025-04-05T10:30:00Z',
    targets: 1000,
    completed: 1000,
    inProgress: false
  },
  {
    id: '4',
    name: 'Payment Reminder',
    description: 'Gentle reminder about upcoming payments',
    type: 'sms',
    status: 'draft',
    targets: 150,
    completed: 0,
    inProgress: false
  },
  {
    id: '5',
    name: 'Holiday Hours Announcement',
    description: 'Special holiday operating hours',
    type: 'voice',
    status: 'scheduled',
    scheduled: '2025-04-20T12:00:00Z',
    targets: 300,
    completed: 0,
    inProgress: false
  }
];

// Type badge variants with proper typing
const typeBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  'voice': 'default',
  'sms': 'secondary',
  'email': 'outline'
};

// Status badge variants with proper typing
const statusBadgeVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  'scheduled': 'secondary',
  'active': 'default',
  'completed': 'outline',
  'draft': 'destructive'
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getCompletionRate = (completed: number, total: number) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

const BroadcastManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('all');

  const filteredBroadcasts = broadcasts.filter(broadcast => 
    (activeTab === 'all' || 
     (activeTab === 'active' && broadcast.status === 'active') ||
     (activeTab === 'scheduled' && broadcast.status === 'scheduled') ||
     (activeTab === 'completed' && broadcast.status === 'completed') ||
     (activeTab === 'draft' && broadcast.status === 'draft')) &&
    (broadcast.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     broadcast.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEditBroadcast = (broadcastId: string) => {
    toast({
      title: "Edit Broadcast",
      description: `Editing broadcast with ID: ${broadcastId}`,
    });
  };

  const handleDeleteBroadcast = (broadcastId: string) => {
    toast({
      title: "Delete Broadcast",
      description: `Deleting broadcast with ID: ${broadcastId}`,
    });
  };

  const handleDuplicateBroadcast = (broadcastId: string) => {
    toast({
      title: "Duplicate Broadcast",
      description: `Creating a copy of broadcast with ID: ${broadcastId}`,
    });
  };

  const handleToggleBroadcastStatus = (broadcastId: string, inProgress: boolean) => {
    const action = inProgress ? 'Pausing' : 'Starting';
    toast({
      title: `${action} Broadcast`,
      description: `${action} broadcast with ID: ${broadcastId}`,
    });
  };

  return (
    <PageLayout 
      title="Broadcast Management" 
      subtitle="Create and manage automated communication broadcasts"
      allowedRoles={['admin']}
    >
      <div className="space-y-4">
        {/* Search and actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search broadcasts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Broadcast
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>Broadcasts</CardTitle>
                <CardDescription>Manage automated communications campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBroadcasts.map((broadcast) => (
                      <TableRow key={broadcast.id}>
                        <TableCell>
                          <div className="max-w-[250px]">
                            <div className="font-medium">{broadcast.name}</div>
                            <div className="text-sm text-muted-foreground truncate" title={broadcast.description}>
                              {broadcast.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={typeBadgeVariant[broadcast.type]} className="capitalize">
                            {broadcast.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant[broadcast.status]} className="capitalize">
                            {broadcast.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {broadcast.scheduled ? (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{formatDate(broadcast.scheduled)}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {(broadcast.status === 'active' || broadcast.status === 'completed') ? (
                            <div className="space-y-1">
                              <Progress 
                                value={getCompletionRate(broadcast.completed, broadcast.targets)} 
                              />
                              <div className="text-xs text-muted-foreground">
                                {broadcast.completed} / {broadcast.targets} ({getCompletionRate(broadcast.completed, broadcast.targets)}%)
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              {broadcast.targets} recipients
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditBroadcast(broadcast.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateBroadcast(broadcast.id)}>
                                <Copy className="mr-2 h-4 w-4" /> Duplicate
                              </DropdownMenuItem>
                              {broadcast.status === 'active' && (
                                <DropdownMenuItem onClick={() => handleToggleBroadcastStatus(broadcast.id, broadcast.inProgress)}>
                                  <PauseCircle className="mr-2 h-4 w-4" /> Pause
                                </DropdownMenuItem>
                              )}
                              {(broadcast.status === 'scheduled' || broadcast.status === 'draft') && (
                                <DropdownMenuItem onClick={() => handleToggleBroadcastStatus(broadcast.id, broadcast.inProgress)}>
                                  <PlayCircle className="mr-2 h-4 w-4" /> Start
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteBroadcast(broadcast.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default BroadcastManagement;
