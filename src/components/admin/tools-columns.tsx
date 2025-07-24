"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Tool } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ColumnsConfig = {
  onEdit: (tool: Tool) => void;
  canManageTools: boolean;
}


export const columns = ({ onEdit, canManageTools }: ColumnsConfig): ColumnDef<Tool>[] => [
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
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const isActive = status === 'active';
      return <Badge variant={isActive ? "default" : "outline"} className={isActive ? 'bg-green-600/20 text-green-400 border-green-500/30 hover:bg-green-600/30' : 'capitalize'}>{status}</Badge>
    }
  },
  {
    accessorKey: "assignedDepartments",
    header: "Departments",
    cell: ({ row }) => {
      const depts = row.getValue("assignedDepartments") as string[]
      if (depts.length === 0) return <span className="text-muted-foreground">None</span>
      return <div className="flex flex-wrap gap-1">{depts.map(d => <Badge key={d} variant="secondary">{d}</Badge>)}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
   {
    accessorKey: "assignedUsers",
    header: "Users",
     cell: ({ row }) => {
      const users = row.getValue("assignedUsers") as string[]
      return <span>{users.length}</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tool = row.original
 
      if (!canManageTools) return null;

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
             <DropdownMenuItem onClick={() => onEdit(tool)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Tool
            </DropdownMenuItem>
             <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete Tool</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
