
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Search, MoreVertical, Edit, Trash2, Copy, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Mock WhatsApp template data
const templates = [
  {
    id: '1',
    name: 'Appointment Reminder',
    category: 'Utility',
    status: 'approved',
    language: 'English',
    variables: 2,
    createdAt: '2025-03-10T14:30:00Z'
  },
  {
    id: '2',
    name: 'Order Status Update',
    category: 'Utility',
    status: 'approved',
    language: 'English',
    variables: 3,
    createdAt: '2025-03-15T09:20:00Z'
  },
  {
    id: '3',
    name: 'Payment Confirmation',
    category: 'Utility',
    status: 'pending',
    language: 'English',
    variables: 4,
    createdAt: '2025-04-05T11:45:00Z'
  },
  {
    id: '4',
    name: 'Welcome Message',
    category: 'Marketing',
    status: 'rejected',
    language: 'English',
    variables: 1,
    createdAt: '2025-04-08T16:10:00Z',
    rejectionReason: 'Contains promotional content inappropriate for this category'
  },
  {
    id: '5',
    name: 'Servicio al Cliente',
    category: 'Customer Service',
    status: 'approved',
    language: 'Spanish',
    variables: 2,
    createdAt: '2025-03-28T13:15:00Z'
  }
];

// Status badge variants
const statusBadgeVariant = {
  'approved': 'default',
  'pending': 'secondary',
  'rejected': 'destructive'
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

const WhatsAppTemplates = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('all');

  const filteredTemplates = templates.filter(template => 
    (activeTab === 'all' || 
     template.status === activeTab) &&
    (template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
     template.language.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleViewTemplate = (templateId: string) => {
    toast({
      title: "View Template",
      description: `Viewing template with ID: ${templateId}`,
    });
  };

  const handleEditTemplate = (templateId: string) => {
    toast({
      title: "Edit Template",
      description: `Editing template with ID: ${templateId}`,
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    toast({
      title: "Delete Template",
      description: `Deleting template with ID: ${templateId}`,
    });
  };

  const handleDuplicateTemplate = (templateId: string) => {
    toast({
      title: "Duplicate Template",
      description: `Creating a copy of template with ID: ${templateId}`,
    });
  };

  const handleSubmitTemplate = (templateId: string) => {
    toast({
      title: "Submit Template",
      description: `Submitting template ${templateId} for approval`,
    });
  };

  return (
    <PageLayout 
      title="WhatsApp Templates" 
      subtitle="Manage message templates for WhatsApp Business API"
      allowedRoles={['admin']}
    >
      <div className="space-y-4">
        {/* Search and actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search templates..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Templates</CardTitle>
                <CardDescription>Manage message templates for WhatsApp Business communication</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Variables</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>
                          <div className="font-medium">{template.name}</div>
                        </TableCell>
                        <TableCell>{template.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {template.status === 'approved' ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : template.status === 'rejected' ? (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <div className="h-4 w-4 rounded-full bg-yellow-500" />
                            )}
                            <Badge variant={statusBadgeVariant[template.status as keyof typeof statusBadgeVariant]} className="capitalize">
                              {template.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{template.language}</TableCell>
                        <TableCell>{template.variables}</TableCell>
                        <TableCell>{formatDate(template.createdAt)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewTemplate(template.id)}>
                                <MessageSquare className="mr-2 h-4 w-4" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditTemplate(template.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateTemplate(template.id)}>
                                <Copy className="mr-2 h-4 w-4" /> Duplicate
                              </DropdownMenuItem>
                              {template.status === 'rejected' && (
                                <DropdownMenuItem onClick={() => handleSubmitTemplate(template.id)}>
                                  <CheckCircle2 className="mr-2 h-4 w-4" /> Resubmit
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteTemplate(template.id)}
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

export default WhatsAppTemplates;
