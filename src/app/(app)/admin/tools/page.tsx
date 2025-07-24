"use client";

import { DataTable } from "@/components/admin/data-table";
import { columns } from "@/components/admin/tools-columns";
import useMockDb from "@/hooks/use-mock-db";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function AdminToolsPage() {
  const { tools } = useMockDb();

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Tool Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage all AI tools.</p>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Tool
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={tools}
        filterColumnId="name"
        filterPlaceholder="Filter by tool name..."
        />
    </div>
  );
}
