
import { User } from '@/types/user';

// Mock user data - ensure all roles are properly typed
export const users: User[] = [
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
