
"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { user, logout } = useAuth()

  if (!user) {
    return null // Or a loading state
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }

  const handleAvatarUpload = () => {
    // This would trigger a file picker and upload logic
    alert("Avatar customization coming soon!");
  };

  return (
    <div className="container mx-auto">
       <div className="mb-8">
        <h1 className="font-headline text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">View and manage your personal information.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <div className="relative">
                <Avatar className="h-24 w-24 text-3xl">
                  <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full" onClick={handleAvatarUpload}>
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M15.22 2.15a.72.72 0 0 0-.22-.5.72.72 0 0 0-.5-.22H1.5a.72.72 0 0 0-.5.22.72.72 0 0 0-.22.5v11a.72.72 0 0 0 .22.5c.14.14.32.22.5.22h12a.72.72 0 0 0 .5-.22.72.72 0 0 0 .22-.5v-11ZM9.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-4 5.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-1Z"/></svg>
                </Button>
              </div>
              <CardTitle className="font-headline mt-4 text-2xl">{user.name}</CardTitle>
              <CardDescription>
                <Badge variant={user.role === 'super_admin' ? "destructive" : "secondary"}>{user.role.replace('_', ' ')}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
               <Button variant="outline" className="w-full" onClick={logout}>Log Out</Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
           <Card>
             <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details here. Password changes are not yet available.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user.name} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue={user.email} readOnly />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" defaultValue={user.department} readOnly />
                </div>
                <Button>Save Changes</Button>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
