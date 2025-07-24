
"use client";

import * as React from "react";
import { DataTable } from "@/components/admin/data-table";
import { columns as makeColumns } from "@/components/admin/users-columns";
import useMockDb from "@/hooks/use-mock-db";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { UserForm } from "@/components/admin/user-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, UserRole } from "@/lib/types";

export default function AdminUsersPage() {
  const { users, addUser, removeUser } = useMockDb();
  const { user: currentUser } = useAuth();
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const canManageUser = (targetUser: User): boolean => {
    if (!currentUser) return false;
    switch (currentUser.role) {
      case 'super_admin':
        return true;
      case 'management':
        return targetUser.role === 'department_admin' || targetUser.role === 'employee';
      case 'department_admin':
        return targetUser.role === 'employee' && targetUser.department === currentUser.department;
      default:
        return false;
    }
  };

  const handleAddUser = (data: Omit<User, 'id' | 'assignedTools'>) => {
    addUser(data);
    setIsFormOpen(false);
  };

  const handleRemoveUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser && canManageUser(targetUser)) {
      removeUser(userId);
    }
  };
  
  const columns = makeColumns({ onRemove: handleRemoveUser, canManage: canManageUser });

  const availableRoles: UserRole[] = currentUser?.role === 'super_admin' 
    ? ['super_admin', 'management', 'department_admin', 'employee']
    : currentUser?.role === 'management'
    ? ['department_admin', 'employee']
    : ['employee'];

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">View and manage all users in the system.</p>
        </div>
         {currentUser?.role !== 'employee' && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <UserForm 
                onSubmit={handleAddUser}
                availableRoles={availableRoles}
                departments={['Marketing', 'HR', 'Dev', 'Sales', 'Unassigned']}
               />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <DataTable 
        columns={columns} 
        data={users.filter(u => canManageUser(u) || u.id === currentUser?.id)}
        filterColumnId="name"
        filterPlaceholder="Filter by name..."
        />
    </div>
  );
}
