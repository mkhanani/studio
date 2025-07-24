
export type UserRole = 'super_admin' | 'management' | 'department_admin' | 'employee';
export type ToolCategory = 'Text' | 'Image' | 'Audio' | 'Web-based';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
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
  category: ToolCategory;
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
