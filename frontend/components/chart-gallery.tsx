"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getTransactionsByDateRange } from "@/lib/actions"
import type { Transaction } from "@/lib/types"

interface ChartGalleryProps {
  type: "spending" | "timeline" | "comparison" | "advanced"
}

export function ChartGallery({ type }: ChartGalleryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTransactions() {
      setIsLoading(true)
      try {
        // Default to last 90 days
        const today = new Date()
        const ninetyDaysAgo = new Date()
        ninetyDaysAgo.setDate(today.getDate() - 90)

        const data = await getTransactionsByDateRange(
          ninetyDaysAgo.toISOString().split("T")[0],
          today.toISOString().split("T")[0],
        )

        setTransactions(data)
      } catch (error) {
        console.error("Failed to load transactions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">No transaction data available</p>
      </div>
    )
  }

  // Process data for charts
  const categoryData = processDataByCategory(transactions)
  const timelineData = processDataByTimeline(transactions)
  const comparisonData = processDataForComparison(transactions)

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
  ]

  if (type === "spending") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-medium">Spending by Category (Bar)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Math.abs(Number(value)).toFixed(2)}`} />
                <Legend />
                <Bar dataKey="value" fill="#0088FE" name="Amount ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-medium">Spending by Category (Pie)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Math.abs(Number(value)).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (type === "timeline") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-medium">Spending Over Time (Line)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Math.abs(Number(value)).toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="expenses" stroke="#FF8042" name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-medium">Spending Over Time (Area)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Math.abs(Number(value)).toFixed(2)}`} />
                <Legend />
                <Area type="monotone" dataKey="expenses" stroke="#FF8042" fill="#FF8042" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (type === "comparison") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-medium">Income vs. Expenses (Bar)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Math.abs(Number(value)).toFixed(2)}`} />
                <Legend />
                <Bar dataKey="income" fill="#00C49F" name="Income" />
                <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-medium">Income vs. Expenses (Line)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Math.abs(Number(value)).toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#00C49F" name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="#FF8042" name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Advanced charts
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-lg font-medium">Category Distribution (Stacked Bar)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Math.abs(Number(value)).toFixed(2)}`} />
              <Legend />
              {categoryData.slice(0, 5).map((category, index) => (
                <Bar key={category.name} dataKey={category.name} stackId="a" fill={COLORS[index % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-lg font-medium">Cumulative Spending (Area)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Math.abs(Number(value)).toFixed(2)}`} />
              <Legend />
              <Area type="monotone" dataKey="cumulative" stroke="#8884D8" fill="#8884D8" name="Cumulative Spending" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper functions to process data for charts
function processDataByCategory(transactions: Transaction[]) {
  const expensesByCategory: Record<string, number> = {}

  transactions.forEach((transaction) => {
    const amount = Number.parseFloat(transaction.amount.toString())
    if (amount < 0) {
      // Only consider expenses
      const category = transaction.category || "Uncategorized"
      expensesByCategory[category] = (expensesByCategory[category] || 0) + Math.abs(amount)
    }
  })

  return Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

function processDataByTimeline(transactions: Transaction[]) {
  const expensesByDate: Record<string, { expenses: number; cumulative: number }> = {}
  let cumulativeTotal = 0

  // Sort transactions by date
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  sortedTransactions.forEach((transaction) => {
    const amount = Number.parseFloat(transaction.amount.toString())
    const date = new Date(transaction.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })

    if (!expensesByDate[date]) {
      expensesByDate[date] = { expenses: 0, cumulative: 0 }
    }

    if (amount < 0) {
      // Only consider expenses
      expensesByDate[date].expenses += Math.abs(amount)
      cumulativeTotal += Math.abs(amount)
    }

    expensesByDate[date].cumulative = cumulativeTotal
  })

  return Object.entries(expensesByDate).map(([date, values]) => ({ date, ...values }))
}

function processDataForComparison(transactions: Transaction[]) {
  const monthlyData: Record<string, { income: number; expenses: number }> = {}

  transactions.forEach((transaction) => {
    const amount = Number.parseFloat(transaction.amount.toString())
    const date = new Date(transaction.date)
    const month = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })

    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expenses: 0 }
    }

    if (amount > 0) {
      monthlyData[month].income += amount
    } else {
      monthlyData[month].expenses += Math.abs(amount)
    }
  })

  return Object.entries(monthlyData)
    .map(([month, values]) => ({ month, ...values }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split(" ")
      const [bMonth, bYear] = b.month.split(" ")

      if (aYear !== bYear) return Number.parseInt(aYear) - Number.parseInt(bYear)

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return months.indexOf(aMonth) - months.indexOf(bMonth)
    })
}
