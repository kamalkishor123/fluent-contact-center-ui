
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, MoreVertical, Edit, Trash2, Phone, Mail, UserPlus, Download, Upload, MapPin, Clock, Award } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Enhanced contacts data with healthcare-specific information
const contacts = [
  {
    id: '1',
    name: 'Dr. Alice Johnson',
    email: 'alice.johnson@healthcenter.com',
    phone: '+1 (555) 123-4567',
    department: 'Cardiology',
    location: 'Main Hospital - Floor 3, Wing A',
    type: 'internal',
    role: 'Attending Physician',
    specialization: 'Interventional Cardiology',
    credentials: 'MD, FACC',
    availability: 'Mon-Fri 8:00 AM - 5:00 PM',
    extension: '3401',
    emergencyContact: true,
    languages: ['English', 'Spanish']
  },
  {
    id: '2',
    name: 'Dr. Robert Smith',
    email: 'robert.smith@healthcenter.com',
    phone: '+1 (555) 234-5678',
    department: 'Emergency Medicine',
    location: 'Emergency Department',
    type: 'internal',
    role: 'Emergency Physician',
    specialization: 'Trauma and Critical Care',
    credentials: 'MD, FACEP',
    availability: '24/7 Rotation',
    extension: '911',
    emergencyContact: true,
    languages: ['English']
  },
  {
    id: '3',
    name: 'Dr. Maria Garcia',
    email: 'maria.garcia@healthcenter.com',
    phone: '+1 (555) 345-6789',
    department: 'Pediatrics',
    location: 'Children\'s Wing - Floor 2',
    type: 'internal',
    role: 'Pediatrician',
    specialization: 'Pediatric Endocrinology',
    credentials: 'MD, FAAP',
    availability: 'Tue-Sat 9:00 AM - 6:00 PM',
    extension: '2201',
    emergencyContact: false,
    languages: ['English', 'Spanish', 'Portuguese']
  },
  {
    id: '4',
    name: 'Dr. David Chen',
    email: 'david.chen@healthcenter.com',
    phone: '+1 (555) 456-7890',
    department: 'Radiology',
    location: 'Imaging Center - Basement Level',
    type: 'internal',
    role: 'Radiologist',
    specialization: 'Interventional Radiology',
    credentials: 'MD, FACR',
    availability: 'Mon-Fri 7:00 AM - 7:00 PM',
    extension: '1801',
    emergencyContact: true,
    languages: ['English', 'Mandarin']
  },
  {
    id: '5',
    name: 'Dr. Sarah Williams',
    email: 'sarah.williams@healthcenter.com',
    phone: '+1 (555) 567-8901',
    department: 'Psychiatry',
    location: 'Mental Health Center - Floor 4',
    type: 'internal',
    role: 'Psychiatrist',
    specialization: 'Child and Adolescent Psychiatry',
    credentials: 'MD, Psychiatry Board Certified',
    availability: 'Mon-Thu 10:00 AM - 6:00 PM',
    extension: '4102',
    emergencyContact: false,
    languages: ['English', 'French']
  },
  {
    id: '6',
    name: 'Lisa Thompson',
    email: 'lisa@nursingservices.com',
    phone: '+1 (555) 678-9012',
    company: 'Premium Nursing Services',
    type: 'external',
    role: 'Nursing Coordinator',
    specialization: 'Home Healthcare Coordination',
    availability: 'Mon-Fri 8:00 AM - 5:00 PM',
    emergencyContact: false,
    languages: ['English']
  },
  {
    id: '7',
    name: 'Dr. Michael Brown',
    email: 'michael@orthopediccenter.com',
    phone: '+1 (555) 789-0123',
    company: 'Orthopedic Specialists Group',
    type: 'external',
    role: 'Orthopedic Surgeon',
    specialization: 'Sports Medicine and Joint Replacement',
    credentials: 'MD, FAAOS',
    availability: 'Mon-Fri 7:00 AM - 4:00 PM',
    emergencyContact: false,
    languages: ['English', 'German']
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
     (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
     (contact.specialization && contact.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
     (contact.role && contact.role.toLowerCase().includes(searchQuery.toLowerCase())))
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
      title="Healthcare Directory" 
      subtitle="Comprehensive directory of medical staff and external contacts"
      allowedRoles={['admin']}
    >
      <div className="space-y-4">
        {/* Search and actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, specialization, department, or role..."
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
            <TabsTrigger value="internal">Medical Staff</TabsTrigger>
            <TabsTrigger value="external">External Partners</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>Healthcare Directory</CardTitle>
                <CardDescription>
                  {activeTab === 'all' ? 'Complete healthcare directory with medical staff and external partners' : 
                   activeTab === 'internal' ? 'Internal medical staff including doctors, nurses, and specialists' :
                   'External healthcare partners and service providers'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contact Information</TableHead>
                        <TableHead>Role & Specialization</TableHead>
                        <TableHead>Location & Availability</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell>
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="text-sm">{getInitials(contact.name)}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium truncate">{contact.name}</div>
                                  {contact.emergencyContact && (
                                    <Badge variant="destructive" className="text-xs">Emergency</Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground truncate">{contact.email}</div>
                                <div className="text-sm text-muted-foreground">{contact.phone}</div>
                                {contact.extension && (
                                  <div className="text-xs text-muted-foreground">Ext: {contact.extension}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-sm">{contact.role}</div>
                              <div className="text-sm text-muted-foreground">
                                {contact.type === 'internal' ? contact.department : contact.company}
                              </div>
                              {contact.specialization && (
                                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                                  {contact.specialization}
                                </div>
                              )}
                              {contact.credentials && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Award className="h-3 w-3" />
                                  {contact.credentials}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {contact.location && (
                                <div className="flex items-start gap-1 text-sm">
                                  <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                                  <span className="text-muted-foreground text-xs">{contact.location}</span>
                                </div>
                              )}
                              {contact.availability && (
                                <div className="flex items-start gap-1 text-sm">
                                  <Clock className="h-3 w-3 mt-0.5 text-muted-foreground flex-shrink-0" />
                                  <span className="text-muted-foreground text-xs">{contact.availability}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {contact.languages && contact.languages.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {contact.languages.map((lang, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {lang}
                                    </Badge>
                                  ))}
                                </div>
                              )}
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default DirectoryManagement;
