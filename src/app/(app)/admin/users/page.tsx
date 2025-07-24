"use client";

import { DataTable } from "@/components/admin/data-table";
import { columns } from "@/components/admin/users-columns";
import useMockDb from "@/hooks/use-mock-db";

export default function AdminUsersPage() {
  const { users } = useMockDb();

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">View and manage all users in the system.</p>
      </div>
      <DataTable 
        columns={columns} 
        data={users}
        filterColumnId="name"
        filterPlaceholder="Filter by name..."
        />
    </div>
  );
}
