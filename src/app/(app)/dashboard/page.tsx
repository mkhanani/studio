"use client";

import { useEffect, useState } from 'react';
import { ToolCard } from '@/components/tool-card';
import useMockDb from '@/hooks/use-mock-db';
import { useAuth } from '@/hooks/use-auth';
import type { Tool } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tools, addLog } = useMockDb();
  const [visibleTools, setVisibleTools] = useState<Tool[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const userTools = tools.filter(tool => {
        if (tool.status !== 'active') return false;
        if (user.role === 'admin') return true;

        const assignedToUser = tool.assignedUsers.includes(user.id);
        const assignedToDepartment = tool.assignedDepartments.includes(user.department);

        return assignedToUser || assignedToDepartment;
      });
      setVisibleTools(userTools);
    }
  }, [user, tools]);
  
  const handleLaunch = (tool: Tool) => {
    if(!user) return;
    addLog({
        toolId: tool.id,
        toolName: tool.name,
        userId: user.id,
        userName: user.name,
        department: user.department
    });
    toast({
        title: `Launching ${tool.name}`,
        description: 'The tool will open in a new tab.',
    });
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold">Welcome, {user?.name}!</h1>
        <p className="text-muted-foreground">Here are the AI tools available to you.</p>
      </div>
      
      {visibleTools.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onLaunch={handleLaunch} />
          ))}
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-12 text-center">
            <h3 className="text-xl font-semibold">No Tools Assigned</h3>
            <p className="mt-2 text-muted-foreground">There are currently no tools assigned to you or your department.
            <br />
            Please contact an administrator for access.</p>
        </div>
      )}
    </div>
  );
}
