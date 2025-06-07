"use client"

import { useState, useEffect } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Treemap } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useTheme } from "next-themes"

export function AssetAllocation() {
  const [loading, setLoading] = useState(true)
  const [assetClassData, setAssetClassData] = useState<any[]>([])
  const [sectorData, setSectorData] = useState<any[]>([])
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Simulate data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Sample data - in a real app, this would come from your API
      const assetData = [
        { name: "Stocks", value: 75000, color: isDark ? "#38bdf8" : "#0ea5e9" },
        { name: "Bonds", value: 25000, color: isDark ? "#fb923c" : "#f97316" },
        { name: "Real Estate", value: 15000, color: isDark ? "#a78bfa" : "#8b5cf6" },
        { name: "Crypto", value: 5000, color: isDark ? "#34d399" : "#10b981" },
        { name: "Cash", value: 5750, color: isDark ? "#fb7185" : "#f43f5e" },
      ]

      const sectorData = [
        { name: "Technology", value: 35000, color: isDark ? "#38bdf8" : "#0ea5e9" },
        { name: "Healthcare", value: 15000, color: isDark ? "#fb923c" : "#f97316" },
        { name: "Financials", value: 12000, color: isDark ? "#a78bfa" : "#8b5cf6" },
        { name: "Consumer", value: 8000, color: isDark ? "#34d399" : "#10b981" },
        { name: "Energy", value: 5000, color: isDark ? "#fb7185" : "#f43f5e" },
      ]

      setAssetClassData(assetData)
      setSectorData(sectorData)
      setLoading(false)
    }

    fetchData()
  }, [isDark])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const total = payload[0].payload.root ? payload[0].payload.root.value : 125750 // Total portfolio value
      const percentage = ((data.value / total) * 100).toFixed(1)

      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(data.value)}</p>
          <p className="text-xs text-muted-foreground">{percentage}% of portfolio</p>
        </div>
      )
    }
    return null
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Skeleton className="h-[250px] w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="h-full w-full p-6">
      <Tabs defaultValue="asset-class">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="asset-class">Asset Class</TabsTrigger>
          <TabsTrigger value="sector">Sector</TabsTrigger>
        </TabsList>

        <TabsContent value="asset-class" className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assetClassData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
                animationDuration={1000}
                animationBegin={0}
                animationEasing="ease-out"
              >
                {assetClassData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={isDark ? "#1f2937" : "#ffffff"}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconSize={10}
                iconType="circle"
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="sector" className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={sectorData}
              dataKey="value"
              aspectRatio={4 / 3}
              stroke={isDark ? "#1f2937" : "#ffffff"}
              fill="#8884d8"
              animationDuration={1000}
              animationBegin={0}
              animationEasing="ease-out"
              content={({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {
                return (
                  <g>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      style={{
                        fill: sectorData[index % sectorData.length].color,
                        stroke: isDark ? "#1f2937" : "#ffffff",
                        strokeWidth: 2 / (depth + 1e-10),
                        strokeOpacity: 1 / (depth + 1e-10),
                      }}
                    />
                    {width > 30 && height > 30 && (
                      <text
                        x={x + width / 2}
                        y={y + height / 2}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={14}
                        fontWeight="bold"
                      >
                        {name}
                      </text>
                    )}
                    {width > 60 && height > 30 && (
                      <text x={x + width / 2} y={y + height / 2 + 16} textAnchor="middle" fill="#fff" fontSize={12}>
                        {formatCurrency(sectorData[index % sectorData.length].value)}
                      </text>
                    )}
                  </g>
                )
              }}
            />
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  )
}
