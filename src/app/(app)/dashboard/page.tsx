"use client";

import { useEffect, useState, useMemo } from 'react';
import { ToolCard } from '@/components/tool-card';
import useMockDb from '@/hooks/use-mock-db';
import { useAuth } from '@/hooks/use-auth';
import type { Tool } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tools, addLog } = useMockDb();
  const [visibleTools, setVisibleTools] = useState<Tool[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const userTools = tools.filter(tool => {
        // Super admins see all tools regardless of assignment
        if (user.role === 'super_admin') return true;
        
        // Department admins see tools assigned to their department
        if (user.role === 'department_admin' && tool.assignedDepartments.includes(user.department)) {
          return true;
        }

        // All users see tools specifically assigned to them
        if(tool.assignedUsers.includes(user.id)) return true;

        // Employees see tools assigned to their department, but only if the tool is active
        if(user.role === 'employee' && tool.assignedDepartments.includes(user.department) && tool.status === 'active') {
          return true;
        }

        return false;
      });
      setVisibleTools(userTools);
    }
  }, [user, tools]);
  
  const handleLaunch = (tool: Tool) => {
    if(!user) return;
    if (tool.status !== 'active') {
        toast({
            variant: "destructive",
            title: `${tool.name} is inactive`,
            description: 'This tool is currently unavailable.',
        });
        return;
    }
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

  const categorizedTools = useMemo(() => {
    return {
      apiIntegrated: visibleTools.filter(tool => tool.type === 'API-integrated'),
      webBased: visibleTools.filter(tool => tool.type === 'Web-based'),
    };
  }, [visibleTools]);

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold">Welcome, {user?.name}!</h1>
        <p className="text-muted-foreground">Here are the AI tools available to you.</p>
      </div>
      
      {visibleTools.length > 0 ? (
        <div className="space-y-12">
            {categorizedTools.apiIntegrated.length > 0 && (
                <section>
                    <h2 className="font-headline text-2xl font-semibold mb-1">API-Integrated Tools</h2>
                    <p className="text-muted-foreground mb-4">These tools are built directly into the AI Tool Hub for a seamless experience.</p>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {categorizedTools.apiIntegrated.map((tool) => (
                            <ToolCard key={tool.id} tool={tool} onLaunch={handleLaunch} />
                        ))}
                    </div>
                </section>
            )}

             {categorizedTools.webBased.length > 0 && categorizedTools.apiIntegrated.length > 0 && (
                <Separator />
            )}

            {categorizedTools.webBased.length > 0 && (
                 <section>
                    <h2 className="font-headline text-2xl font-semibold mb-1">Web-based Tools</h2>
                    <p className="text-muted-foreground mb-4">These tools will open in a new browser tab.</p>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {categorizedTools.webBased.map((tool) => (
                            <ToolCard key={tool.id} tool={tool} onLaunch={handleLaunch} />
                        ))}
                    </div>
                </section>
            )}
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
