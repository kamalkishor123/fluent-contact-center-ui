
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserFormValues } from '@/types/user';
import { userFormSchema } from '@/schemas/userSchema';
import UserForm from './UserForm';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (data: UserFormValues) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ 
  open, 
  onOpenChange,
  onAddUser
}) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "agent",
      department: "Support",
      status: "active",
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Enter the details for the new user. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <UserForm 
          form={form} 
          onSubmit={(data) => {
            onAddUser(data);
            form.reset();
          }}
          submitLabel="Save User"
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
