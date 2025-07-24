
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"

type ColumnsConfig = {
  onRemove: (userId: string) => void;
  canManage: (user: User) => boolean;
}

export const columns = ({ onRemove, canManage }: ColumnsConfig): ColumnDef<User>[] => {
  const { user: currentUser } = useAuth();
  
  return [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const variantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
        super_admin: "destructive",
        management: "default",
        department_admin: "secondary",
        employee: "outline",
      };
      return <Badge variant={variantMap[role] || "outline"}>{role.replace('_', ' ')}</Badge>
    }
  },
  {
      accessorKey: "assignedTools",
      header: "Assigned Tools",
      cell: ({row}) => {
          const tools = row.getValue("assignedTools") as string[]
          return <span>{tools.length}</span>
      }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const isCurrentUser = user.id === currentUser?.id;

      if (!canManage(user) || isCurrentUser) {
        return null;
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit User</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onRemove(user.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]};
