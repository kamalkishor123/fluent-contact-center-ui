
import { z } from 'zod';

// Schema for user form validation - ensure role is properly typed
export const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  role: z.enum(['agent', 'supervisor', 'admin']),
  department: z.string().min(2, { message: "Department must be at least 2 characters" }),
  status: z.enum(['active', 'inactive']).default('active'),
});
