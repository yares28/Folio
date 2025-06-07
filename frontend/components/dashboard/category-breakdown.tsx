"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useTheme } from "next-themes"
import { useData } from "@/contexts/data-context"

export function CategoryBreakdown() {
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

  const data = expensesByCategory.map((item, index) => ({
    ...item,
    color: isDark
      ? colors[index % colors.length].replace("e9", "f8").replace("16", "3c")
      : colors[index % colors.length],
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="space-y-4 w-full px-6">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.amount, 0)

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1)
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
            <p className="font-semibold text-sm">{payload[0].name}</p>
          </div>
          <p className="text-xl font-bold text-primary">{percentage}%</p>
          <p className="text-sm font-medium">{formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">of total spending</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full w-full flex flex-col p-4">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="amount"
              nameKey="category"
              labelLine={false}
              label={renderCustomizedLabel}
              animationDuration={1000}
              animationBegin={0}
              animationEasing="ease-out"
              onClick={(data, index) => {
                console.log(`Clicked on ${data.category}: ${((data.amount / total) * 100).toFixed(1)}%`)
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={isDark ? "#1f2937" : "#ffffff"}
                  strokeWidth={2}
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    transition: "all 0.2s ease-in-out",
                  }}
                  className="hover:brightness-110 cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 space-y-1">
        {data.map((category, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="text-xs">{category.category}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium">{formatCurrency(category.amount)}</span>
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                {Math.round((category.amount / total) * 100)}%
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
