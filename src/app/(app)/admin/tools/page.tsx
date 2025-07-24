"use client";

import * as React from "react";
import { DataTable } from "@/components/admin/data-table";
import { columns as makeColumns } from "@/components/admin/tools-columns";
import useMockDb from "@/hooks/use-mock-db";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ToolForm } from "@/components/admin/tool-form";
import { Tool } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";

export default function AdminToolsPage() {
  const { tools, users, addTool, updateTool } = useMockDb();
  const { user: currentUser } = useAuth();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingTool, setEditingTool] = React.useState<Tool | null>(null);

  const handleOpenForm = (tool?: Tool) => {
    setEditingTool(tool || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingTool(null);
    setIsFormOpen(false);
  };
  
  const canManageTools = currentUser?.role === 'super_admin' || currentUser?.role === 'department_admin';

  const handleSubmit = (data: Omit<Tool, 'id'>) => {
    if (editingTool) {
      updateTool({ ...editingTool, ...data });
    } else {
      addTool(data);
    }
    handleCloseForm();
  };
  
  const columns = makeColumns({ onEdit: handleOpenForm, canManageTools });

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Tool Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage all AI tools.</p>
        </div>
        {currentUser?.role === 'super_admin' && (
           <Button onClick={() => handleOpenForm()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Tool
          </Button>
        )}
      </div>

       <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTool ? "Edit Tool" : "Add New Tool"}</DialogTitle>
          </DialogHeader>
          <ToolForm 
            onSubmit={handleSubmit} 
            users={users} 
            currentUser={currentUser}
            defaultValues={editingTool ?? undefined}
          />
        </DialogContent>
      </Dialog>
      
      <DataTable 
        columns={columns} 
        data={tools}
        filterColumnId="name"
        filterPlaceholder="Filter by tool name..."
        />
    </div>
  );
}
