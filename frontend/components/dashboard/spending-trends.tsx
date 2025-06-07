"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export function SpendingTrends() {
  const [timeframe, setTimeframe] = useState("year")

  // Sample data - in a real app, this would come from your data source
  const yearlyData = [
    { month: "Jan", expenses: 1200 },
    { month: "Feb", expenses: 1800 },
    { month: "Mar", expenses: 1600 },
    { month: "Apr", expenses: 2200 },
    { month: "May", expenses: 1900 },
    { month: "Jun", expenses: 2400 },
    { month: "Jul", expenses: 2100 },
    { month: "Aug", expenses: 2800 },
    { month: "Sep", expenses: 2500 },
    { month: "Oct", expenses: 2700 },
    { month: "Nov", expenses: 2300 },
    { month: "Dec", expenses: 2845 },
  ]

  const monthlyData = [
    { day: "1", expenses: 95 },
    { day: "5", expenses: 125 },
    { day: "10", expenses: 85 },
    { day: "15", expenses: 220 },
    { day: "20", expenses: 140 },
    { day: "25", expenses: 180 },
    { day: "30", expenses: 95 },
  ]

  const weeklyData = [
    { day: "Mon", expenses: 45 },
    { day: "Tue", expenses: 35 },
    { day: "Wed", expenses: 65 },
    { day: "Thu", expenses: 40 },
    { day: "Fri", expenses: 120 },
    { day: "Sat", expenses: 85 },
    { day: "Sun", expenses: 55 },
  ]

  const data = timeframe === "year" ? yearlyData : timeframe === "month" ? monthlyData : weeklyData
  const xKey = timeframe === "year" ? "month" : "day"

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year">Past Year</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
            <SelectItem value="week">Past Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ChartContainer
        config={{
          expenses: {
            label: "Expenses",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-[350px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              style={{
                fontSize: "12px",
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              style={{
                fontSize: "12px",
              }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="expenses"
              strokeWidth={2}
              activeDot={{ r: 6, style: { fill: "var(--color-expenses)" } }}
              style={{
                stroke: "var(--color-expenses)",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
