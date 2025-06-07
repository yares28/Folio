"use client"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { useTheme } from "next-themes"
import { useData } from "@/contexts/data-context"

export function MonthlyTrends() {
  const { monthlyData, isLoading } = useData()
  const { theme } = useTheme()
  const isDark = theme === "dark"

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
          <div className="mt-1 space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#10b981]" />
              <p className="text-xs">Income: {formatCurrency(payload[0].value)}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#f43f5e]" />
              <p className="text-xs">Expenses: {formatCurrency(payload[1].value)}</p>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={(value) => `$${value / 1000}k`}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10 }}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#f43f5e"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
