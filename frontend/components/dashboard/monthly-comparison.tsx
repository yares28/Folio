"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export function MonthlyComparison() {
  const [compareType, setCompareType] = useState("category")

  // Sample data - in a real app, this would come from your data source
  const categoryData = [
    {
      category: "Food",
      "Last Month": 750,
      "This Month": 850,
    },
    {
      category: "Housing",
      "Last Month": 1200,
      "This Month": 1200,
    },
    {
      category: "Transport",
      "Last Month": 320,
      "This Month": 350,
    },
    {
      category: "Entertainment",
      "Last Month": 280,
      "This Month": 250,
    },
    {
      category: "Utilities",
      "Last Month": 190,
      "This Month": 195,
    },
  ]

  const monthlyData = [
    {
      month: "Jan",
      "2022": 1100,
      "2023": 1200,
    },
    {
      month: "Feb",
      "2022": 1600,
      "2023": 1800,
    },
    {
      month: "Mar",
      "2022": 1400,
      "2023": 1600,
    },
    {
      month: "Apr",
      "2022": 2000,
      "2023": 2200,
    },
    {
      month: "May",
      "2022": 1700,
      "2023": 1900,
    },
    {
      month: "Jun",
      "2022": 2200,
      "2023": 2400,
    },
  ]

  const data = compareType === "category" ? categoryData : monthlyData
  const xKey = compareType === "category" ? "category" : "month"

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={compareType} onValueChange={setCompareType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select comparison" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category">By Category</SelectItem>
            <SelectItem value="month">By Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ChartContainer
        config={{
          "Last Month": {
            label: "Last Month",
            color: "hsl(var(--chart-1))",
          },
          "This Month": {
            label: "This Month",
            color: "hsl(var(--chart-2))",
          },
          "2022": {
            label: "2022",
            color: "hsl(var(--chart-1))",
          },
          "2023": {
            label: "2023",
            color: "hsl(var(--chart-2))",
          },
        }}
        className="h-[350px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
            {compareType === "category" ? (
              <>
                <Bar dataKey="Last Month" fill="var(--color-Last-Month)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="This Month" fill="var(--color-This-Month)" radius={[4, 4, 0, 0]} />
              </>
            ) : (
              <>
                <Bar dataKey="2022" fill="var(--color-2022)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="2023" fill="var(--color-2023)" radius={[4, 4, 0, 0]} />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
