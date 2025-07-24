"use client";

import { DataTable } from "@/components/admin/data-table";
import { columns } from "@/components/admin/logs-columns";
import useMockDb from "@/hooks/use-mock-db";
import { Button } from "@/components/ui/button";
import { Download, Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";
import { Log } from "@/lib/types";

export default function AdminLogsPage() {
  const { logs } = useMockDb();
  const [date, setDate] = React.useState<DateRange | undefined>();

  const filteredLogs = React.useMemo(() => {
    if (!date?.from && !date?.to) {
      return logs;
    }
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      const from = date?.from ? new Date(date.from) : null;
      const to = date?.to ? new Date(date.to) : null;

      if(from) from.setHours(0,0,0,0);
      if(to) to.setHours(23,59,59,999);

      if (from && logDate < from) return false;
      if (to && logDate > to) return false;
      return true;
    });
  }, [logs, date]);

  const exportToCSV = () => {
    const headers = ["Tool Name", "User", "Department", "Timestamp"];
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map(log => [
        log.toolName,
        log.userName,
        log.department,
        new Date(log.timestamp).toISOString(),
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "usage_logs.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Usage Logs</h1>
          <p className="text-muted-foreground">Review tool launch events across the organization.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
           <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal md:w-[300px]",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={exportToCSV} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>
      <DataTable 
        columns={columns} 
        data={filteredLogs}
        filterColumnId="toolName"
        filterPlaceholder="Filter by tool name..."
        />
    </div>
  );
}
