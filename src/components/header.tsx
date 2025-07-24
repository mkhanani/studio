import { UserNav } from "@/components/user-nav"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
       <SidebarTrigger className="hidden md:flex"/>
       <div className="flex-1">
         {/* This empty div is used to push the UserNav to the right */}
       </div>
      <div className="flex items-center gap-4">
        <UserNav />
      </div>
    </header>
  )
}
