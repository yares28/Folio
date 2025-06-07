"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DividendIncome() {
  // Sample data - in a real app, this would come from your data source
  const monthlyData = [
    { month: "Jan", amount: 250 },
    { month: "Feb", amount: 150 },
    { month: "Mar", amount: 350 },
    { month: "Apr", amount: 250 },
    { month: "May", amount: 150 },
    { month: "Jun", amount: 450 },
    { month: "Jul", amount: 250 },
    { month: "Aug", amount: 150 },
    { month: "Sep", amount: 350 },
    { month: "Oct", amount: 250 },
    { month: "Nov", amount: 150 },
    { month: "Dec", amount: 500 },
  ]

  const stockData = [
    { stock: "AAPL", amount: 450, yield: 0.5 },
    { stock: "MSFT", amount: 600, yield: 0.8 },
    { stock: "JNJ", amount: 350, yield: 2.5 },
    { stock: "PG", amount: 300, yield: 2.3 },
    { stock: "KO", amount: 250, yield: 2.8 },
    { stock: "VZ", amount: 500, yield: 4.5 },
    { stock: "T", amount: 400, yield: 5.2 },
    { stock: "O", amount: 400, yield: 4.8 },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100)
  }

  return (
    <Tabs defaultValue="monthly">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="monthly">Monthly Income</TabsTrigger>
        <TabsTrigger value="by-stock">By Stock</TabsTrigger>
      </TabsList>

      <TabsContent value="monthly" className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatCurrency} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value) => formatCurrency(value as number)}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--background))",
              }}
            />
            <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>

      <TabsContent value="by-stock" className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stockData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
            <XAxis type="number" tickFormatter={formatCurrency} axisLine={false} tickLine={false} />
            <YAxis dataKey="stock" type="category" axisLine={false} tickLine={false} width={80} />
            <Tooltip
              formatter={(value, name, props) => {
                if (name === "amount") return formatCurrency(value as number)
                if (name === "yield") return `${(value as number).toFixed(1)}%`
                return value
              }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--background))",
              }}
              labelFormatter={(value) => `Stock: ${value}`}
            />
            <Bar dataKey="amount" fill="#10b981" name="Annual Dividend" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  )
}
