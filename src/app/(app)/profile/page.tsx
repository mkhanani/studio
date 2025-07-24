"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import React, { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pencil } from "lucide-react"

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth()
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '')

  if (!user) {
    return null // Or a loading state
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }

  const handleAvatarSave = () => {
    updateUser({ ...user, avatarUrl });
    setIsAvatarDialogOpen(false);
  };
  
  const handleNameSave = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const newName = formData.get("name") as string;
      if (newName && newName !== user.name) {
        updateUser({ ...user, name: newName });
      }
  }

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
               <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                <DialogTrigger asChild>
                   <div className="relative cursor-pointer">
                    <Avatar className="h-24 w-24 text-3xl">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                     <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/80 text-primary-foreground backdrop-blur-sm">
                        <Pencil className="h-4 w-4" />
                     </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Avatar</DialogTitle>
                    <DialogDescription>
                      Enter a new image URL for your avatar. For best results, use a square image.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="avatar-url">Image URL</Label>
                    <Input 
                      id="avatar-url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/image.png"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAvatarDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAvatarSave}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
               <form onSubmit={handleNameSave} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" defaultValue={user.name} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue={user.email} readOnly />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" defaultValue={user.department} readOnly />
                </div>
                <Button type="submit">Save Changes</Button>
                </form>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
