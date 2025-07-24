"use client"

import React, { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReportChart } from "@/components/admin/report-chart"
import useMockDb from "@/hooks/use-mock-db"
import { useAuth } from "@/hooks/use-auth"
import { Log, User, Tool } from "@/lib/types"
import { BarChart3, Users } from "lucide-react"

type ReportData = {
  userName: string
  [key: string]: number | string // tool names as keys, usage count as value
}

export default function AdminReportsPage() {
  const { logs, users, tools } = useMockDb()
  const { user: currentUser } = useAuth()
  const [selectedDepartment, setSelectedDepartment] = useState<string | "all">(
    currentUser?.role === 'department_admin' ? currentUser.department : 'all'
  )

  const availableDepartments = useMemo(() => {
    if (currentUser?.role === 'super_admin' || currentUser?.role === 'management') {
      const allDepts = ['all', ...Array.from(new Set(users.map(u => u.department)))]
      return allDepts;
    }
    return [currentUser?.department].filter(Boolean) as string[]
  }, [currentUser, users])


  const filteredData = useMemo(() => {
    let relevantLogs = logs;
    let relevantUsers = users;

    if (selectedDepartment !== 'all') {
      relevantLogs = logs.filter(log => log.department === selectedDepartment)
      relevantUsers = users.filter(user => user.department === selectedDepartment)
    }

    const toolUsage: { [userId: string]: { [toolName: string]: number } } = {}

    relevantLogs.forEach(log => {
      if (!toolUsage[log.userId]) {
        toolUsage[log.userId] = {}
      }
      if (!toolUsage[log.userId][log.toolName]) {
        toolUsage[log.userId][log.toolName] = 0
      }
      toolUsage[log.userId][log.toolName]++
    })

    const reportData: ReportData[] = relevantUsers.map(user => {
      const userReport: ReportData = { userName: user.name }
      const userLogs = toolUsage[user.id] || {}
      tools.forEach(tool => {
        userReport[tool.name] = userLogs[tool.name] || 0
      })
      return userReport
    })

    return reportData
  }, [logs, users, tools, selectedDepartment])

  const chartConfig = useMemo(() => {
    const config: any = {}
    tools.forEach((tool, index) => {
      config[tool.name] = {
        label: tool.name,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      }
    })
    return config
  }, [tools])

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold">Productivity Reports</h1>
          <p className="text-muted-foreground">Analyze tool usage across departments.</p>
        </div>
        {(currentUser?.role === 'super_admin' || currentUser?.role === 'management') && (
          <Select onValueChange={setSelectedDepartment} value={selectedDepartment}>
            <SelectTrigger className="w-full md:w-[240px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {availableDepartments.map(dept => (
                <SelectItem key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Tool Launches per User
          </CardTitle>
          <CardDescription>
            This chart shows the number of times each user has launched a specific AI tool.
            {selectedDepartment !== 'all' && ` (Department: ${selectedDepartment})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <ReportChart data={filteredData} config={chartConfig} />
          ) : (
             <div className="flex flex-col items-center justify-center h-80 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50 mb-4"/>
                <h3 className="text-xl font-semibold">No Data Available</h3>
                <p className="mt-2 text-muted-foreground">
                    There is no usage data for the selected department.
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
