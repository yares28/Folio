"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useTheme } from "next-themes"

interface InvestmentPerformanceProps {
  dateRange?: {
    from: Date
    to: Date
  }
}

export function InvestmentPerformance({ dateRange }: InvestmentPerformanceProps) {
  const [timeframe, setTimeframe] = useState("1y")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any[]>([])
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Simulate data fetching with the date range and timeframe
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1200))

      // Sample data - in a real app, this would come from your API with the date range filter
      const sampleData = [
        { date: "Jan", portfolio: 100, benchmark: 100 },
        { date: "Feb", portfolio: 105, benchmark: 102 },
        { date: "Mar", portfolio: 103, benchmark: 101 },
        { date: "Apr", portfolio: 107, benchmark: 103 },
        { date: "May", portfolio: 110, benchmark: 105 },
        { date: "Jun", portfolio: 115, benchmark: 107 },
        { date: "Jul", portfolio: 118, benchmark: 109 },
        { date: "Aug", portfolio: 121, benchmark: 111 },
        { date: "Sep", portfolio: 119, benchmark: 110 },
        { date: "Oct", portfolio: 125, benchmark: 112 },
        { date: "Nov", portfolio: 130, benchmark: 115 },
        { date: "Dec", portfolio: 135, benchmark: 118 },
      ]

      setData(sampleData)
      setLoading(false)
    }

    fetchData()
  }, [dateRange, timeframe])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-md">
          <p className="font-medium">{label}</p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: isDark ? "#38bdf8" : "#0ea5e9" }} />
              <p className="text-sm">
                Your Portfolio: <span className="font-medium">{payload[0].value}%</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: isDark ? "#fb923c" : "#f97316" }} />
              <p className="text-sm">
                S&P 500: <span className="font-medium">{payload[1].value}%</span>
              </p>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4 h-full w-full p-6">
      <div className="flex justify-end">
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">1 Month</SelectItem>
            <SelectItem value="3m">3 Months</SelectItem>
            <SelectItem value="6m">6 Months</SelectItem>
            <SelectItem value="1y">1 Year</SelectItem>
            <SelectItem value="5y">5 Years</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[250px]">
          <Skeleton className="h-[250px] w-full rounded-lg" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: isDark ? "#d1d5db" : "#6b7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: isDark ? "#d1d5db" : "#6b7280" }}
              domain={[(dataMin) => Math.floor(dataMin * 0.95), (dataMax) => Math.ceil(dataMax * 1.05)]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} formatter={(value) => <span className="text-sm">{value}</span>} />
            <Line
              type="monotone"
              dataKey="portfolio"
              stroke={isDark ? "#38bdf8" : "#0ea5e9"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="Your Portfolio"
              animationDuration={1500}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="benchmark"
              stroke={isDark ? "#fb923c" : "#f97316"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="S&P 500"
              animationDuration={1500}
              animationBegin={300}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
