"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tool, User, ToolCategory } from "@/lib/types"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  iconUrl: z.string().url("Must be a valid URL."),
  launchUrl: z.string().optional(),
  type: z.enum(['Web-based', 'API-integrated']),
  category: z.enum(['Text', 'Image', 'Audio', 'Web-based']),
  status: z.enum(['active', 'inactive']),
  assignedDepartments: z.array(z.string()),
  assignedUsers: z.array(z.string()),
}).refine(data => data.type !== 'Web-based' || (data.launchUrl && data.launchUrl.length > 0), {
  message: "Launch URL is required for Web-based tools.",
  path: ["launchUrl"],
});


type ToolFormValues = z.infer<typeof formSchema>

interface ToolFormProps {
  onSubmit: (data: Omit<Tool, 'id'>) => void;
  users: User[];
  currentUser: User | null;
  defaultValues?: Partial<Tool>;
}

export function ToolForm({ onSubmit, users, currentUser, defaultValues }: ToolFormProps) {
  const form = useForm<ToolFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      iconUrl: "https://placehold.co/100x100.png",
      launchUrl: "",
      type: "Web-based",
      category: "Web-based",
      status: "active",
      assignedDepartments: [],
      assignedUsers: [],
    },
  })
  
  const departments = ['Marketing' , 'HR' , 'Dev' , 'Sales' , 'Unassigned'];
  const categories: ToolCategory[] = ['Text', 'Image', 'Audio', 'Web-based'];

  const visibleUsers = currentUser?.role === 'super_admin'
    ? users
    : users.filter(u => u.department === currentUser?.department);

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const toolType = form.watch("type");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tool Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ChatGPT" {...field} readOnly={!isSuperAdmin} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the tool..." {...field} readOnly={!isSuperAdmin} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="iconUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://placehold.co/100x100.png" {...field} readOnly={!isSuperAdmin}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
              control={form.control}
              name="launchUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Launch URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/tool" 
                      {...field} 
                      readOnly={!isSuperAdmin}
                      disabled={toolType === 'API-integrated'}
                      value={toolType === 'API-integrated' ? '' : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
         <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={(value) => {
                      field.onChange(value);
                      if (value === 'Web-based') {
                        form.setValue('category', 'Web-based');
                      } else {
                        form.setValue('category', 'Text'); // Default to text for API-integrated
                      }
                  }} defaultValue={field.value} disabled={!isSuperAdmin}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Web-based">Web-based</SelectItem>
                      <SelectItem value="API-integrated">API-integrated</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isSuperAdmin || toolType === 'Web-based'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.filter(c => toolType === 'API-integrated' ? c !== 'Web-based' : c === 'Web-based').map(cat => (
                         <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
         <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isSuperAdmin}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isSuperAdmin && (
          <FormField
            control={form.control}
            name="assignedDepartments"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Assign to Departments</FormLabel>
                  <FormDescription>
                    Select departments to give them access to this tool.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {departments.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="assignedDepartments"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <Controller
            control={form.control}
            name="assignedUsers"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Assign to specific users</FormLabel>
                     <FormDescription>
                        Select individual users to give them access.
                      </FormDescription>
                    <ScrollArea className="h-40 rounded-md border p-4">
                        {visibleUsers.map((user) => (
                            <FormItem key={user.id} className="flex flex-row items-center justify-between py-2">
                                <div>
                                    <FormLabel className="font-normal">{user.name}</FormLabel>
                                    <FormDescription>{user.email}</FormDescription>
                                </div>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(user.id)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                            ? field.onChange([...field.value, user.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                    (value) => value !== user.id
                                                )
                                                )
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        ))}
                    </ScrollArea>
                    <FormMessage />
                </FormItem>
            )}
        />


        <Button type="submit">Save Tool</Button>
      </form>
    </Form>
  )
}
