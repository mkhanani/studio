
import { AuthGuard } from "@/components/auth-guard";
import { Header } from "@/components/header";
import { SidebarNav } from "@/components/sidebar-nav";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { LayoutGrid } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
             <div className="flex items-center gap-2 p-2">
                <LayoutGrid className="h-8 w-8 text-foreground" />
                <h2 className="font-headline text-xl font-semibold">GridAI</h2>
             </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <Header />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
