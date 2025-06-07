"use client"

import { ArrowUpIcon, DollarSign, CreditCard, PiggyBank, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/contexts/data-context"
import { Skeleton } from "@/components/ui/skeleton"

export function Overview() {
  const { totalExpenses, totalIncome, isLoading, dateRange } = useData()

  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  // Mock net worth data
  const netWorth = 28750.0
  const netWorthChange = 5.2

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatPercent = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(amount / 100)
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-muted-foreground">
            {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          <div className="mt-1 flex items-center text-xs">
            <ArrowUpIcon className="mr-1 h-3 w-3 text-destructive" />
            <span className="text-destructive">12.5%</span>
            <span className="ml-1 text-muted-foreground">from previous period</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPercent(savingsRate)}</div>
          <p className="text-xs text-muted-foreground">Of total income</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(netWorth)}</div>
          <div className="mt-1 flex items-center text-xs">
            <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-green-500">{netWorthChange}%</span>
            <span className="ml-1 text-muted-foreground">from previous period</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
