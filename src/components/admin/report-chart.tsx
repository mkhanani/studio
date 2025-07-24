"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface ReportChartProps {
  data: any[]
  config: ChartConfig
}

export function ReportChart({ data, config }: ReportChartProps) {
  return (
    <div className="h-[400px] min-h-[300px] w-full">
       <ChartContainer config={config} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="userName"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis allowDecimals={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {Object.keys(config).map(key => (
             <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  )
}
