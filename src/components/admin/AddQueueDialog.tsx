
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

// Schema for queue validation
const queueFormSchema = z.object({
  name: z.string().min(2, { message: "Queue name must be at least 2 characters" }),
  agents: z.coerce.number().min(1, { message: "Queue must have at least 1 agent" }),
});

type QueueFormValues = z.infer<typeof queueFormSchema>;

interface AddQueueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddQueue: (queue: QueueFormValues) => void;
}

const AddQueueDialog: React.FC<AddQueueDialogProps> = ({ 
  open, 
  onOpenChange,
  onAddQueue
}) => {
  const form = useForm<QueueFormValues>({
    resolver: zodResolver(queueFormSchema),
    defaultValues: {
      name: "",
      agents: 1,
    },
  });

  const handleSubmit = (values: QueueFormValues) => {
    onAddQueue(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Queue</DialogTitle>
          <DialogDescription>
            Create a new call queue. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Queue Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter queue name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="agents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Agents</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Create Queue</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddQueueDialog;
