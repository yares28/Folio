"use client"

import { ArrowUpIcon, ArrowDownIcon, TrendingUp, DollarSign, BarChart3, PieChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PortfolioOverview() {
  // In a real app, this would come from your data source
  const stats = {
    totalValue: 125750.65,
    dailyChange: 1.2,
    totalReturn: 15.8,
    annualDividends: 3250.0,
    cashBalance: 12500.0,
  }

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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="h-[140px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
          <div className="mt-1 flex items-center text-xs">
            {stats.dailyChange >= 0 ? (
              <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
            )}
            <span className={stats.dailyChange >= 0 ? "text-green-500" : "text-red-500"}>
              {stats.dailyChange >= 0 ? "+" : ""}
              {formatPercent(stats.dailyChange)}
            </span>
            <span className="ml-1 text-muted-foreground">today</span>
          </div>
        </CardContent>
      </Card>

      <Card className="h-[140px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Return</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPercent(stats.totalReturn)}</div>
          <p className="text-xs text-muted-foreground">All-time return</p>
        </CardContent>
      </Card>

      <Card className="h-[140px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Annual Dividends</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.annualDividends)}</div>
          <p className="text-xs text-muted-foreground">Projected for year</p>
        </CardContent>
      </Card>

      <Card className="h-[140px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.cashBalance)}</div>
          <p className="text-xs text-muted-foreground">Available to invest</p>
        </CardContent>
      </Card>
    </div>
  )
}
