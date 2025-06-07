"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DateRangePreset } from "@/lib/types"
import { getTransactionsByDateRange } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"
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

// Chart colors with a teal/apricot accent palette
const COLORS = [
  "#0ea5e9", // teal primary
  "#f97316", // apricot accent
  "#14b8a6",
  "#f59e0b",
  "#06b6d4",
  "#fb923c",
  "#0891b2",
  "#fdba74",
  "#0e7490",
  "#fed7aa",
  "#155e75",
  "#ffedd5",
]

export function VisualInsights() {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("category")
  const [datePreset, setDatePreset] = useState<DateRangePreset>("30days")
  const { toast } = useToast()

  useEffect(() => {
    async function loadTransactions() {
      try {
        setIsLoading(true)

        // Calculate date range based on preset
        const today = new Date()
        let startDate: Date

        switch (datePreset) {
          case "7days":
            startDate = new Date(today)
            startDate.setDate(today.getDate() - 7)
            break
          case "30days":
            startDate = new Date(today)
            startDate.setDate(today.getDate() - 30)
            break
          case "90days":
            startDate = new Date(today)
            startDate.setDate(today.getDate() - 90)
            break
          case "ytd":
            startDate = new Date(today.getFullYear(), 0, 1) // January 1st of current year
            break
          default: // "all"
            startDate = new Date(2000, 0, 1) // Far in the past
            break
        }

        const formattedStartDate = startDate.toISOString().split("T")[0]
        const formattedEndDate = today.toISOString().split("T")[0]

        const data = await getTransactionsByDateRange(formattedStartDate, formattedEndDate)
        setTransactions(data)
      } catch (error) {
        console.error("Failed to load transactions:", error)
        toast({
          title: "Error",
          description: "Failed to load transaction data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
  }, [datePreset, toast])

  // Calculate spending by category
  const spendingByCategory = transactions
    .filter((tx) => tx.amount < 0)
    .reduce((acc, tx) => {
      const category = tx.category || "Uncategorized"
      const amount = Math.abs(Number(tx.amount))

      if (!acc[category]) {
        acc[category] = 0
      }

      acc[category] += amount
      return acc
    }, {})

  const categoryChartData = Object.entries(spendingByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // Calculate spending over time (by month)
  const spendingOverTime = transactions.reduce((acc, tx) => {
    const date = new Date(tx.date)
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const amount = Number(tx.amount)

    if (!acc[monthYear]) {
      acc[monthYear] = {
        month: monthYear,
        spending: 0,
        income: 0,
        name: new Date(monthYear + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      }
    }

    if (amount < 0) {
      acc[monthYear].spending += Math.abs(amount)
    } else {
      acc[monthYear].income += amount
    }

    return acc
  }, {})

  const timeChartData = Object.values(spendingOverTime).sort((a, b) => a.month.localeCompare(b.month))

  // Calculate income vs expenses
  const totalIncome = transactions.filter((tx) => tx.amount > 0).reduce((sum, tx) => sum + Number(tx.amount), 0)

  const totalExpenses = transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(Number(tx.amount)), 0)

  const summaryChartData = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpenses },
  ]

  // Format currency for tooltips
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Visual Insights</CardTitle>
            <CardDescription>Analyze your spending patterns</CardDescription>
          </div>
          <Tabs
            value={datePreset}
            onValueChange={(value) => setDatePreset(value as DateRangePreset)}
            className="mt-2 sm:mt-0"
          >
            <TabsList>
              <TabsTrigger value="7days">7 Days</TabsTrigger>
              <TabsTrigger value="30days">30 Days</TabsTrigger>
              <TabsTrigger value="90days">90 Days</TabsTrigger>
              <TabsTrigger value="ytd">YTD</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex h-[400px] flex-col items-center justify-center text-center">
            <h3 className="text-lg font-medium">No transaction data available</h3>
            <p className="text-sm text-muted-foreground">Upload some CSV files to see your financial insights</p>
          </div>
        ) : (
          <Tabs defaultValue="category" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="category">By Category</TabsTrigger>
              <TabsTrigger value="time">Over Time</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="category" className="mt-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Bar Chart */}
                <div className="h-[400px] overflow-hidden rounded-lg border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                  <h3 className="mb-4 text-sm font-medium">Top Spending Categories</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart
                      data={categoryChartData.slice(0, 10)}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar
                        dataKey="value"
                        fill="#0ea5e9"
                        animationDuration={1000}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="h-[400px] overflow-hidden rounded-lg border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                  <h3 className="mb-4 text-sm font-medium">Spending Distribution</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1000}
                        className="transition-all duration-300 hover:opacity-90"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="time" className="mt-4">
              <div className="h-[400px] overflow-hidden rounded-lg border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                <h3 className="mb-4 text-sm font-medium">Income & Expenses Over Time</h3>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={timeChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#0ea5e9"
                      activeDot={{ r: 8 }}
                      name="Income"
                      strokeWidth={2}
                      animationDuration={1000}
                    />
                    <Line
                      type="monotone"
                      dataKey="spending"
                      stroke="#f97316"
                      name="Spending"
                      strokeWidth={2}
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="mt-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Income vs Expenses Pie Chart */}
                <div className="h-[400px] overflow-hidden rounded-lg border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                  <h3 className="mb-4 text-sm font-medium">Income vs Expenses</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie
                        data={summaryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1000}
                      >
                        <Cell fill="#0ea5e9" /> {/* Income - teal */}
                        <Cell fill="#f97316" /> {/* Expenses - apricot */}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Summary Stats */}
                <div className="flex flex-col justify-center space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</div>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-500">{formatCurrency(totalExpenses)}</div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card className="overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-2xl font-bold ${
                          totalIncome - totalExpenses >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {formatCurrency(totalIncome - totalExpenses)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
