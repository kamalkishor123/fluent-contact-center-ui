
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User, UserFormValues, UserStatus } from '@/types/user';
import { users as mockUsers } from '@/data/mockUsers';
import AddUserDialog from '@/components/admin/AddUserDialog';
import EditUserDialog from '@/components/admin/EditUserDialog';
import DeleteUserDialog from '@/components/admin/DeleteUserDialog';
import UsersTable from '@/components/admin/UsersTable';

const UserManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [userList, setUserList] = useState<User[]>(mockUsers);
  
  // Dialog state management
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const filteredUsers = userList.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = (data: UserFormValues) => {
    // Generate a unique ID (in a real app this would come from the backend)
    const newId = (userList.length + 1).toString();
    
    const newUser: User = {
      id: newId,
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      status: data.status,
      lastActive: new Date().toISOString()
    };

    setUserList([...userList, newUser]);
    setAddDialogOpen(false);
    
    toast({
      title: "User Added",
      description: `${data.name} has been added successfully`,
    });
  };

  const handleEditUser = (userId: string) => {
    const user = userList.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setEditDialogOpen(true);
    }
  };

  const handleUpdateUser = (data: UserFormValues) => {
    if (!currentUser) return;
    
    const updatedUsers = userList.map(user => {
      if (user.id === currentUser.id) {
        return { 
          ...user, 
          name: data.name,
          email: data.email,
          role: data.role, 
          department: data.department,
          status: data.status
        };
      }
      return user;
    });

    setUserList(updatedUsers);
    setEditDialogOpen(false);
    setCurrentUser(null);
    
    toast({
      title: "User Updated",
      description: `${data.name} has been updated successfully`,
    });
  };

  const handleToggleUserStatus = (userId: string, currentStatus: UserStatus) => {
    const newStatus: UserStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    const updatedUsers = userList.map(user => {
      if (user.id === userId) {
        return { ...user, status: newStatus };
      }
      return user;
    });

    setUserList(updatedUsers);
    
    toast({
      title: "User Status Updated",
      description: `User status changed to ${newStatus}`,
    });
  };

  const handleDeleteConfirm = (userId: string) => {
    const user = userList.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteUser = () => {
    if (!currentUser) return;
    
    const updatedUsers = userList.filter(user => user.id !== currentUser.id);
    setUserList(updatedUsers);
    setDeleteDialogOpen(false);
    setCurrentUser(null);
    
    toast({
      title: "User Deleted",
      description: `${currentUser.name} has been deleted`,
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
          <Button onClick={() => setAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
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
            <UsersTable 
              users={filteredUsers}
              onEdit={handleEditUser}
              onToggleStatus={handleToggleUserStatus}
              onDelete={handleDeleteConfirm}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddUserDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddUser={handleAddUser}
      />
      
      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={currentUser}
        onUpdateUser={handleUpdateUser}
      />
      
      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={currentUser}
        onDelete={handleDeleteUser}
      />
    </PageLayout>
  );
};

export default UserManagement;
