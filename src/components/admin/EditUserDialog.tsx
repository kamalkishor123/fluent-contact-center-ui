
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, UserFormValues } from '@/types/user';
import { userFormSchema } from '@/schemas/userSchema';
import UserForm from './UserForm';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onUpdateUser: (data: UserFormValues) => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ 
  open, 
  onOpenChange,
  user,
  onUpdateUser
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

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        status: user.status,
      });
    }
  }, [user, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <UserForm 
          form={form} 
          onSubmit={onUpdateUser}
          submitLabel="Save Changes"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
