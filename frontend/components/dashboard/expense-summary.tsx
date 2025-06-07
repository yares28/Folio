"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { useTheme } from "next-themes"
import { useData } from "@/contexts/data-context"

export function ExpenseSummary() {
  const { expensesByCategory, isLoading } = useData()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Add colors to the expense data
  const colors = [
    "#0ea5e9",
    "#f97316",
    "#8b5cf6",
    "#10b981",
    "#f43f5e",
    "#eab308",
    "#ec4899",
    "#6366f1",
    "#14b8a6",
    "#f59e0b",
  ]

  const data = expensesByCategory
    .map((item, index) => ({
      ...item,
      fill: isDark
        ? colors[index % colors.length].replace("e9", "f8").replace("16", "3c")
        : colors[index % colors.length],
    }))
    .sort((a, b) => b.amount - a.amount) // Sort by amount descending
    .slice(0, 5) // Take top 5 categories

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="space-y-4 w-full px-6">
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
          <XAxis
            type="number"
            tickFormatter={formatCurrency}
            axisLine={false}
            tickLine={false}
            tick={{ fill: isDark ? "#d1d5db" : "#6b7280", fontSize: 10 }}
            domain={[0, "dataMax"]}
          />
          <YAxis
            dataKey="category"
            type="category"
            axisLine={false}
            tickLine={false}
            width={60}
            tick={{ fill: isDark ? "#d1d5db" : "#6b7280", fontSize: 10 }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
          />
          <Bar
            dataKey="amount"
            radius={[0, 4, 4, 0]}
            barSize={16}
            animationDuration={1000}
            animationBegin={0}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
