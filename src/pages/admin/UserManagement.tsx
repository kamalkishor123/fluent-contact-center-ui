
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Search, Filter, MoreVertical, Edit, Trash2, Lock, UnlockKeyhole } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

// Mock user data
const users = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john.doe@example.com', 
    role: 'agent', 
    department: 'Support', 
    status: 'active',
    lastActive: '2025-04-11T09:45:00Z'
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    email: 'jane.smith@example.com', 
    role: 'supervisor', 
    department: 'Sales', 
    status: 'active',
    lastActive: '2025-04-11T10:15:00Z'
  },
  { 
    id: '3', 
    name: 'Mike Johnson', 
    email: 'mike.johnson@example.com', 
    role: 'admin', 
    department: 'IT', 
    status: 'active',
    lastActive: '2025-04-11T08:30:00Z'
  },
  { 
    id: '4', 
    name: 'Sarah Williams', 
    email: 'sarah.williams@example.com', 
    role: 'agent', 
    department: 'Support', 
    status: 'inactive',
    lastActive: '2025-04-10T14:20:00Z'
  },
  { 
    id: '5', 
    name: 'Robert Brown', 
    email: 'robert.brown@example.com', 
    role: 'supervisor', 
    department: 'Marketing', 
    status: 'active',
    lastActive: '2025-04-11T07:55:00Z'
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

const UserManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditUser = (userId: string) => {
    toast({
      title: "Edit User",
      description: `Editing user with ID: ${userId}`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    toast({
      title: "Delete User",
      description: `Deleting user with ID: ${userId}`,
    });
  };

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    toast({
      title: "User Status Updated",
      description: `User ${userId} status changed to ${newStatus}`,
    });
  };

  return (
    <PageLayout 
      title="User Management" 
      subtitle="Manage system users, permissions, and roles"
      allowedRoles={['admin']}
    >
      <div className="space-y-4">
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage contact center users and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.lastActive)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id, user.status)}>
                            {user.status === 'active' ? (
                              <><Lock className="mr-2 h-4 w-4" /> Deactivate</>
                            ) : (
                              <><UnlockKeyhole className="mr-2 h-4 w-4" /> Activate</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
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
    </PageLayout>
  );
};

export default UserManagement;
