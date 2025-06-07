"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Transaction } from "@/lib/types"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"

interface SpendingChartsProps {
  transactions: Transaction[]
}

// Chart colors
const COLORS = [
  "#8884d8",
  "#83a6ed",
  "#8dd1e1",
  "#82ca9d",
  "#a4de6c",
  "#d0ed57",
  "#ffc658",
  "#ff8042",
  "#ff6361",
  "#bc5090",
  "#58508d",
  "#003f5c",
  "#444e86",
  "#955196",
  "#dd5182",
  "#ff6e54",
  "#ffa600",
]

export function SpendingCharts({ transactions }: SpendingChartsProps) {
  // Calculate spending by category
  const spendingByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>()

    transactions.forEach((transaction) => {
      const amount = Number.parseFloat(transaction.amount.toString())
      // Only include expenses (negative amounts)
      if (amount < 0) {
        const category = transaction.category || "Uncategorized"
        const currentAmount = categoryMap.get(category) || 0
        categoryMap.set(category, currentAmount + Math.abs(amount))
      }
    })

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  // Calculate spending over time (by month)
  const spendingOverTime = useMemo(() => {
    const monthMap = new Map<string, { spending: number; income: number }>()

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const amount = Number.parseFloat(transaction.amount.toString())

      const current = monthMap.get(monthYear) || { spending: 0, income: 0 }

      if (amount < 0) {
        // Expense
        current.spending += Math.abs(amount)
      } else {
        // Income
        current.income += amount
      }

      monthMap.set(monthYear, current)
    })

    return Array.from(monthMap.entries())
      .map(([month, { spending, income }]) => ({
        month,
        spending,
        income,
        // Format month for display
        name: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }, [transactions])

  // Calculate income vs expenses
  const incomeVsExpenses = useMemo(() => {
    let totalIncome = 0
    let totalExpenses = 0

    transactions.forEach((transaction) => {
      const amount = Number.parseFloat(transaction.amount.toString())
      if (amount > 0) {
        totalIncome += amount
      } else {
        totalExpenses += Math.abs(amount)
      }
    })

    return [
      { name: "Income", value: totalIncome },
      { name: "Expenses", value: totalExpenses },
    ]
  }, [transactions])

  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="category" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="time">Over Time</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="category">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Your spending breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={spendingByCategory}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spendingByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {spendingByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>Spending Over Time</CardTitle>
              <CardDescription>Your monthly spending and income trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spendingOverTime} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#82ca9d" activeDot={{ r: 8 }} name="Income" />
                    <Line type="monotone" dataKey="spending" stroke="#ff7300" name="Spending" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Overview of your income vs expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Income vs Expenses Pie Chart */}
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeVsExpenses}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#82ca9d" />
                        <Cell fill="#ff7300" />
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Summary Stats */}
                <div className="flex flex-col justify-center space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                          {formatCurrency(incomeVsExpenses[0].value)}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                          {formatCurrency(incomeVsExpenses[1].value)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-2xl font-bold ${
                          incomeVsExpenses[0].value - incomeVsExpenses[1].value >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {formatCurrency(incomeVsExpenses[0].value - incomeVsExpenses[1].value)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
