
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Search, MoreVertical, Edit, Trash2, Play, Pause } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import AddQueueDialog from '@/components/admin/AddQueueDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { z } from 'zod';

// Mock queue data
const queues = [
  {
    id: '1',
    name: 'Customer Support',
    status: 'active',
    agents: 12,
    waiting: 5,
    avgWaitTime: '2:30',
    slaLevel: 87
  },
  {
    id: '2',
    name: 'Sales Inquiries',
    status: 'active',
    agents: 8,
    waiting: 2,
    avgWaitTime: '1:15',
    slaLevel: 93
  },
  {
    id: '3',
    name: 'Technical Support',
    status: 'active',
    agents: 6,
    waiting: 8,
    avgWaitTime: '4:45',
    slaLevel: 72
  },
  {
    id: '4',
    name: 'Billing Questions',
    status: 'paused',
    agents: 4,
    waiting: 0,
    avgWaitTime: '0:00',
    slaLevel: 100
  },
  {
    id: '5',
    name: 'VIP Support',
    status: 'active',
    agents: 3,
    waiting: 1,
    avgWaitTime: '0:45',
    slaLevel: 95
  }
];

const QueueManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [queueToDelete, setQueueToDelete] = React.useState<string | null>(null);
  const [editSheetOpen, setEditSheetOpen] = React.useState(false);
  const [currentQueue, setCurrentQueue] = React.useState<typeof queues[0] | null>(null);

  const filteredQueues = queues.filter(queue => 
    queue.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditQueue = (queueId: string) => {
    const queue = queues.find(q => q.id === queueId);
    if (queue) {
      setCurrentQueue(queue);
      setEditSheetOpen(true);
    }
  };

  const handleDeleteQueue = (queueId: string) => {
    setQueueToDelete(queueId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteQueue = () => {
    if (queueToDelete) {
      toast({
        title: "Queue Deleted",
        description: `Queue with ID: ${queueToDelete} has been deleted`,
      });
      setQueueToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleToggleQueueStatus = (queueId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    toast({
      title: "Queue Status Updated",
      description: `Queue ${queueId} status changed to ${newStatus}`,
    });
  };

  const handleAddQueue = (values: z.infer<typeof queueFormSchema>) => {
    toast({
      title: "Queue Created",
      description: `New queue "${values.name}" has been created with ${values.agents} agents`,
    });
  };

  const getSLAColor = (slaLevel: number) => {
    if (slaLevel >= 90) return 'bg-green-500';
    if (slaLevel >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Schema for queue form
  const queueFormSchema = z.object({
    name: z.string().min(2),
    agents: z.coerce.number().min(1),
  });

  return (
    <PageLayout 
      title="Queue Management" 
      subtitle="Manage call queues, routing, and agent assignments"
      allowedRoles={['admin']}
    >
      <div className="space-y-4">
        {/* Search and actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search queues..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setOpenAddDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Queue
          </Button>
        </div>

        {/* Queues Table */}
        <Card>
          <CardHeader>
            <CardTitle>Call Queues</CardTitle>
            <CardDescription>Manage call queues and their configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Agents</TableHead>
                  <TableHead>Calls Waiting</TableHead>
                  <TableHead>Avg. Wait Time</TableHead>
                  <TableHead>SLA Level</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueues.map((queue) => (
                  <TableRow key={queue.id}>
                    <TableCell className="font-medium">{queue.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={queue.status === 'active' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {queue.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{queue.agents}</TableCell>
                    <TableCell>{queue.waiting}</TableCell>
                    <TableCell>{queue.avgWaitTime}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={queue.slaLevel}
                          className={`h-2 ${getSLAColor(queue.slaLevel)}`}
                        />
                        <span className="text-sm">{queue.slaLevel}%</span>
                      </div>
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
                          <DropdownMenuItem onClick={() => handleEditQueue(queue.id)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleQueueStatus(queue.id, queue.status)}>
                            {queue.status === 'active' ? (
                              <><Pause className="mr-2 h-4 w-4" /> Pause</>
                            ) : (
                              <><Play className="mr-2 h-4 w-4" /> Activate</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteQueue(queue.id)}
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
      </div>

      {/* Add Queue Dialog */}
      <AddQueueDialog 
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        onAddQueue={handleAddQueue}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected queue and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteQueue} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Queue Sheet */}
      <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Queue</SheetTitle>
            <SheetDescription>
              Update queue settings and configuration
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentQueue?.name || ''}
                className="col-span-3"
                onChange={() => {}}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="agents" className="text-right">
                Agents
              </Label>
              <Input
                id="agents"
                value={currentQueue?.agents || 0}
                type="number"
                className="col-span-3"
                onChange={() => {}}
              />
            </div>
          </div>
          
          <SheetFooter>
            <Button 
              onClick={() => {
                toast({
                  title: "Queue Updated",
                  description: "Queue settings have been updated successfully",
                });
                setEditSheetOpen(false);
              }}
            >
              Save changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
};

export default QueueManagement;
