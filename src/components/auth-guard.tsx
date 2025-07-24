
"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { UserRole } from '@/lib/types';

export function AuthGuard({ children, role }: { children: React.ReactNode, role?: UserRole | UserRole[] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (role) {
        const hasRole = Array.isArray(role) ? role.includes(user.role) : user.role === role;
        if (!hasRole) {
          router.push('/dashboard'); // Or an unauthorized page
        }
      }
    }
  }, [user, loading, router, role]);

  const hasRequiredRole = () => {
    if (!user || !role) return true; // No specific role required or no user yet
    return Array.isArray(role) ? role.includes(user.role) : user.role === role;
  }

  if (loading || !user || !hasRequiredRole()) {
    return (
       <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
