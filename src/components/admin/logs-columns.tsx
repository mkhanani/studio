"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Log } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<Log>[] = [
  {
    accessorKey: "toolName",
    header: "Tool Name",
  },
  {
    accessorKey: "userName",
    header: "User",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Timestamp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const date = new Date(row.getValue("timestamp"))
        return <div>{date.toLocaleString()}</div>
    }
  },
]
