'use client';

import { AuthProviderComponent } from '@/hooks/use-auth';

export function AuthProvider({children}: {children: React.ReactNode}) {
  return <AuthProviderComponent>{children}</AuthProviderComponent>;
}
