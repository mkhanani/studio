
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

const GridAiLogo = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2H2V10H10V2ZM8 4H4V8H8V4Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 2H12V10H20V2ZM18 4H14V8H18V4Z"
        fill="currentColor"
      />
       <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 2H22V10H30V2ZM28 4H24V8H28V4Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 12H2V20H10V12ZM8 14H4V18H8V14Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 12H22V20H30V12ZM28 14H24V18H28V14Z"
        fill="currentColor"
      />
       <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 22H2V30H10V22ZM8 24H4V28H8V24Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 22H12V30H20V22ZM18 24H14V28H18V24Z"
        fill="currentColor"
      />
       <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 22H22V30H30V22ZM28 24H24V28H28V24Z"
        fill="currentColor"
      />
      {/* A */}
      <path d="M14 18H18L16 14L14 18Z" fill="hsl(var(--accent))" />
      {/* I */}
       <path d="M15 12H17V13H15V12Z" fill="hsl(var(--accent))" />
    </svg>
  );

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
