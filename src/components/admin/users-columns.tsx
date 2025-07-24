"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<User>[] = [
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
      const role = row.getValue("role") as string
      return <Badge variant={role === 'admin' ? "destructive" : "secondary"}>{role}</Badge>
    }
  },
  {
      accessorKey: "assignedTools",
      header: "Assigned Tools",
      cell: ({row}) => {
          const tools = row.getValue("assignedTools") as string[]
          return <span>{tools.length}</span>
      }
  }
]
