
import { AuthGuard } from "@/components/auth-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Allow any admin-level role to access the admin section
  return <AuthGuard role={['super_admin', 'management', 'department_admin']}>{children}</AuthGuard>;
}
