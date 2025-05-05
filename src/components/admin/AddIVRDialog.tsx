
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Schema for IVR flow validation
const ivrFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
});

type IVRFormValues = z.infer<typeof ivrFormSchema>;

interface AddIVRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddIVR: (ivr: IVRFormValues) => void;
}

const AddIVRDialog: React.FC<AddIVRDialogProps> = ({ 
  open, 
  onOpenChange,
  onAddIVR
}) => {
  const form = useForm<IVRFormValues>({
    resolver: zodResolver(ivrFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleSubmit = (values: IVRFormValues) => {
    onAddIVR(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New IVR Flow</DialogTitle>
          <DialogDescription>
            Create a new Interactive Voice Response flow. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IVR Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter IVR name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the IVR flow" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Create IVR</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddIVRDialog;
