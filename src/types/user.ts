
export type UserRole = 'agent' | 'supervisor' | 'admin';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  lastActive: string;
}

export interface UserFormValues {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
}
