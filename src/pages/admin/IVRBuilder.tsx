
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy,
  Play,
  Phone,
  Share2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Mock IVR data
const ivrFlows = [
  {
    id: '1',
    name: 'Main Menu IVR',
    description: 'Primary customer entry point',
    lastModified: '2025-04-10T15:30:00Z',
    status: 'published',
    nodes: 12
  },
  {
    id: '2',
    name: 'Technical Support IVR',
    description: 'Technical support troubleshooting flow',
    lastModified: '2025-04-08T11:20:00Z',
    status: 'draft',
    nodes: 8
  },
  {
    id: '3',
    name: 'Billing Department IVR',
    description: 'Payment and billing inquiries',
    lastModified: '2025-04-05T09:45:00Z',
    status: 'published',
    nodes: 6
  },
  {
    id: '4',
    name: 'After Hours IVR',
    description: 'Non-business hours call handling',
    lastModified: '2025-04-01T16:15:00Z',
    status: 'published',
    nodes: 5
  },
  {
    id: '5',
    name: 'Sales Department IVR',
    description: 'New sales and product inquiries',
    lastModified: '2025-03-28T14:20:00Z',
    status: 'draft',
    nodes: 9
  }
];

// Mock templates data
const templates = [
  {
    id: '1',
    name: 'Simple Customer Support',
    description: 'Basic support flow with 3 options',
    complexity: 'Simple',
    nodes: 4
  },
  {
    id: '2',
    name: 'Advanced Technical Support',
    description: 'Detailed troubleshooting with escalation paths',
    complexity: 'Complex',
    nodes: 10
  },
  {
    id: '3',
    name: 'Payment Processing',
    description: 'Handle payment issues and billing inquiries',
    complexity: 'Medium',
    nodes: 7
  },
  {
    id: '4',
    name: 'Holiday Schedule',
    description: 'Special routing for holidays and closures',
    complexity: 'Simple',
    nodes: 3
  }
];

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

const IVRBuilder = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('ivr-flows');

  const filteredIVRs = ivrFlows.filter(ivr => 
    ivr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ivr.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditIVR = (ivrId: string) => {
    toast({
      title: "Edit IVR Flow",
      description: `Opening IVR builder for flow: ${ivrId}`,
    });
  };

  const handleDeleteIVR = (ivrId: string) => {
    toast({
      title: "Delete IVR Flow",
      description: `Deleting IVR flow: ${ivrId}`,
    });
  };
  
  const handleDuplicateIVR = (ivrId: string) => {
    toast({
      title: "Duplicate IVR Flow",
      description: `Creating a copy of IVR flow: ${ivrId}`,
    });
  };
  
  const handleTestIVR = (ivrId: string) => {
    toast({
      title: "Test IVR Flow",
      description: `Opening test dialog for IVR flow: ${ivrId}`,
    });
  };

  const handleUseTemplate = (templateId: string) => {
    toast({
      title: "Use Template",
      description: `Creating new IVR flow from template: ${templateId}`,
    });
  };

  return (
    <PageLayout 
      title="IVR Builder" 
      subtitle="Create and manage interactive voice response flows"
      allowedRoles={['admin']}
    >
      <div className="space-y-4">
        {/* Search and actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search IVR flows..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New IVR Flow
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ivr-flows" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="ivr-flows">IVR Flows</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ivr-flows">
            <Card>
              <CardHeader>
                <CardTitle>IVR Flows</CardTitle>
                <CardDescription>Manage your interactive voice response flows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredIVRs.map((ivr) => (
                    <Card key={ivr.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base font-medium">{ivr.name}</CardTitle>
                            <CardDescription className="text-sm">{ivr.description}</CardDescription>
                          </div>
                          <Badge
                            variant={ivr.status === 'published' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {ivr.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Nodes: {ivr.nodes}</span>
                          <span className="text-muted-foreground">
                            Modified: {formatDate(ivr.lastModified)}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2 pt-2 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleEditIVR(ivr.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleTestIVR(ivr.id)}>
                              <Play className="mr-2 h-4 w-4" /> Test
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateIVR(ivr.id)}>
                              <Copy className="mr-2 h-4 w-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteIVR(ivr.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>IVR Templates</CardTitle>
                <CardDescription>Start with a pre-built template for common scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base font-medium">{template.name}</CardTitle>
                            <CardDescription className="text-sm">{template.description}</CardDescription>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {template.complexity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{template.nodes} Nodes</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2 pt-2 border-t">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleUseTemplate(template.id)}
                        >
                          Use Template
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => {
                            toast({
                              title: "Preview Template",
                              description: `Opening preview for template: ${template.id}`,
                            });
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

const Eye = Trash2; // Using Trash2 as a placeholder for Eye icon

export default IVRBuilder;
