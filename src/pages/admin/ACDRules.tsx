
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Search, MoreVertical, Edit, Trash2, Eye, ArrowRightLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import AddRuleDialog from '@/components/admin/AddRuleDialog';
import { z } from 'zod';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Mock ACD rules data
const acdRules = [
  {
    id: '1',
    name: 'Business Hours Routing',
    description: 'Routes calls based on business hours schedule',
    condition: 'Time between 8:00-17:00 AND Weekday',
    actions: 'Route to General Support Queue',
    priority: 'High',
    enabled: true
  },
  {
    id: '2',
    name: 'VIP Customer Routing',
    description: 'Identifies VIP customers and routes accordingly',
    condition: 'Customer Segment = VIP',
    actions: 'Route to VIP Support Queue',
    priority: 'Critical',
    enabled: true
  },
  {
    id: '3',
    name: 'Overflow to Spanish Queue',
    description: 'Routes Spanish-speaking customers to Spanish agents',
    condition: 'Language Preference = Spanish AND Wait Time > 30s',
    actions: 'Route to Spanish Support Queue',
    priority: 'Medium',
    enabled: false
  },
  {
    id: '4',
    name: 'After-Hours Routing',
    description: 'Routes calls during non-business hours',
    condition: 'Time outside 8:00-17:00 OR Weekend',
    actions: 'Route to Voicemail System',
    priority: 'Medium',
    enabled: true
  },
  {
    id: '5',
    name: 'Technical Issue Escalation',
    description: 'Escalates technical issues based on keywords',
    condition: 'Keywords = "broken", "error", "not working"',
    actions: 'Route to Technical Support',
    priority: 'High',
    enabled: true
  }
];

// Priority badge variants with proper typing
const priorityVariants: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
  'Critical': 'destructive',
  'High': 'default',
  'Medium': 'secondary',
  'Low': 'outline'
};

const ACDRules = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [ruleToDelete, setRuleToDelete] = React.useState<string | null>(null);

  const filteredRules = acdRules.filter(rule => 
    rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditRule = (ruleId: string) => {
    toast({
      title: "Edit Rule",
      description: `Editing ACD rule with ID: ${ruleId}`,
    });
  };

  const handleToggleRule = (ruleId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    toast({
      title: `Rule ${newStatus ? 'Enabled' : 'Disabled'}`,
      description: `ACD rule ${ruleId} has been ${newStatus ? 'enabled' : 'disabled'}`,
    });
  };

  const handleViewRule = (ruleId: string) => {
    toast({
      title: "View Rule Details",
      description: `Viewing details for rule: ${ruleId}`,
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    setRuleToDelete(ruleId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRule = () => {
    if (ruleToDelete) {
      toast({
        title: "Rule Deleted",
        description: `ACD rule ${ruleToDelete} has been deleted`,
      });
      setRuleToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  // Handler for adding a new rule
  const handleAddRule = (values: z.infer<typeof ruleFormSchema>) => {
    toast({
      title: "Rule Created",
      description: `New ACD rule "${values.name}" has been created`,
    });
  };

  // Schema for rule form
  const ruleFormSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(5),
    condition: z.string().min(5),
    actions: z.string().min(5),
    priority: z.enum(["Critical", "High", "Medium", "Low"]),
  });

  return (
    <PageLayout 
      title="ACD Rules" 
      subtitle="Manage automatic call distribution rules and conditions"
      allowedRoles={['admin']}
    >
      <div className="space-y-4">
        {/* Search and actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search rules..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setOpenAddDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Rule
          </Button>
        </div>

        {/* ACD Rules Table */}
        <Card>
          <CardHeader>
            <CardTitle>ACD Rules</CardTitle>
            <CardDescription>Automatic Call Distribution rules determine how calls are routed</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell>{rule.description}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={rule.condition}>{rule.condition}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={rule.actions}>{rule.actions}</TableCell>
                    <TableCell>
                      <Badge variant={priorityVariants[rule.priority]}>
                        {rule.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={rule.enabled} 
                        onCheckedChange={() => handleToggleRule(rule.id, rule.enabled)}
                      />
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
                          <DropdownMenuItem onClick={() => handleViewRule(rule.id)}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditRule(rule.id)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleRule(rule.id, rule.enabled)}>
                            <ArrowRightLeft className="mr-2 h-4 w-4" /> 
                            {rule.enabled ? 'Disable' : 'Enable'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteRule(rule.id)}
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

      {/* Add Rule Dialog */}
      <AddRuleDialog 
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        onAddRule={handleAddRule}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected ACD rule and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRule} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default ACDRules;
