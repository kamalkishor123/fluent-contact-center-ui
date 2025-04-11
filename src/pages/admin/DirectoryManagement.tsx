
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, MoreVertical, Edit, Trash2, Phone, Mail, UserPlus, Download, Upload } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

// Mock contacts data
const contacts = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1 (555) 123-4567',
    department: 'Sales',
    location: 'New York',
    type: 'internal'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    phone: '+1 (555) 234-5678',
    department: 'Support',
    location: 'Los Angeles',
    type: 'internal'
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol@acmecorp.com',
    phone: '+1 (555) 345-6789',
    company: 'Acme Corp',
    type: 'external'
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david.brown@example.com',
    phone: '+1 (555) 456-7890',
    department: 'Marketing',
    location: 'Chicago',
    type: 'internal'
  },
  {
    id: '5',
    name: 'Eva Garcia',
    email: 'eva@suppliersinc.com',
    phone: '+1 (555) 567-8901',
    company: 'Suppliers Inc',
    type: 'external'
  }
];

const getInitials = (name: string) => {
  return name.split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

const DirectoryManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('all');

  const filteredContacts = contacts.filter(contact => 
    (activeTab === 'all' || contact.type === activeTab) &&
    (contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
     contact.phone.includes(searchQuery) ||
     (contact.department && contact.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
     (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleEditContact = (contactId: string) => {
    toast({
      title: "Edit Contact",
      description: `Editing contact with ID: ${contactId}`,
    });
  };

  const handleDeleteContact = (contactId: string) => {
    toast({
      title: "Delete Contact",
      description: `Deleting contact with ID: ${contactId}`,
    });
  };

  const handleImportContacts = () => {
    toast({
      title: "Import Contacts",
      description: "Opening import dialog for contacts",
    });
  };

  const handleExportContacts = () => {
    toast({
      title: "Export Contacts",
      description: "Preparing contacts export",
    });
  };

  return (
    <PageLayout 
      title="Directory Management" 
      subtitle="Manage internal and external contacts"
      allowedRoles={['admin']}
    >
      <div className="space-y-4">
        {/* Search and actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportContacts}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" onClick={handleExportContacts}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Contacts</TabsTrigger>
            <TabsTrigger value="internal">Internal</TabsTrigger>
            <TabsTrigger value="external">External</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>Directory</CardTitle>
                <CardDescription>
                  {activeTab === 'all' ? 'All contacts' : 
                   activeTab === 'internal' ? 'Internal employees and team members' :
                   'External clients and partners'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>{activeTab !== 'external' ? 'Department' : 'Company'}</TableHead>
                      {activeTab !== 'external' && <TableHead>Location</TableHead>}
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{contact.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>{contact.type === 'internal' ? contact.department : contact.company}</TableCell>
                        {activeTab !== 'external' && <TableCell>{contact.location}</TableCell>}
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditContact(contact.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                toast({
                                  title: "Call Contact",
                                  description: `Initiating call to ${contact.name}`,
                                });
                              }}>
                                <Phone className="mr-2 h-4 w-4" /> Call
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                toast({
                                  title: "Email Contact",
                                  description: `Composing email to ${contact.name}`,
                                });
                              }}>
                                <Mail className="mr-2 h-4 w-4" /> Email
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteContact(contact.id)}
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

export default DirectoryManagement;
