"use client"

import { useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function ExpenseByCategory() {
  const [viewType, setViewType] = useState<"pie" | "bar">("pie")

  // Sample data - in a real app, this would come from your data source
  const data = [
    { name: "Food & Dining", value: 850, color: "#0ea5e9" },
    { name: "Housing", value: 1200, color: "#f97316" },
    { name: "Transportation", value: 350, color: "#8b5cf6" },
    { name: "Entertainment", value: 250, color: "#10b981" },
    { name: "Utilities", value: 195, color: "#f43f5e" },
    { name: "Shopping", value: 320, color: "#eab308" },
    { name: "Health", value: 180, color: "#ec4899" },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      <Tabs value={viewType} onValueChange={(value) => setViewType(value as "pie" | "bar")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="pie" className="pt-4">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--background))",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="bar" className="pt-4">
          <div className="space-y-4">
            {data.map((category, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatCurrency(category.value)}</span>
                    <Badge variant="outline" className="text-xs">
                      {Math.round((category.value / total) * 100)}%
                    </Badge>
                  </div>
                </div>
                <Progress value={(category.value / total) * 100} className="h-2" indicatorColor={category.color} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
