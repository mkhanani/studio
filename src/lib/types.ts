export type UserRole = 'employee' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  department: 'Marketing' | 'HR' | 'Dev' | 'Sales' | 'Unassigned';
  role: UserRole;
  assignedTools: string[]; // Array of tool IDs
}

export interface Tool {
  id: string;
  name: string;
  iconUrl: string;
  launchUrl: string;
  description: string;
  type: 'Web-based' | 'API-integrated';
  status: 'active' | 'inactive';
  assignedDepartments: string[];
  assignedUsers: string[];
}

export interface Log {
  id: string;
  toolId: string;
  toolName: string;
  userId: string;
  userName: string;
  department: string;
  timestamp: Date;
}
