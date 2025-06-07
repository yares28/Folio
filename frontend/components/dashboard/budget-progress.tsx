"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, TrendingDown } from "lucide-react"

export function BudgetProgress() {
  // Sample data - in a real app, this would come from your data source
  const budgetData = [
    {
      category: "Food & Dining",
      budget: 1000,
      spent: 850,
      color: "#0ea5e9",
    },
    {
      category: "Housing",
      budget: 1200,
      spent: 1200,
      color: "#f97316",
    },
    {
      category: "Transportation",
      budget: 300,
      spent: 350,
      color: "#8b5cf6",
    },
    {
      category: "Entertainment",
      budget: 300,
      spent: 250,
      color: "#10b981",
    },
    {
      category: "Utilities",
      budget: 200,
      spent: 195,
      color: "#f43f5e",
    },
    {
      category: "Shopping",
      budget: 400,
      spent: 320,
      color: "#eab308",
    },
    {
      category: "Health",
      budget: 200,
      spent: 180,
      color: "#ec4899",
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const getStatusIcon = (budget: number, spent: number) => {
    const percentage = (spent / budget) * 100

    if (percentage >= 100) {
      return <AlertCircle className="h-5 w-5 text-destructive" />
    } else if (percentage >= 80) {
      return <TrendingDown className="h-5 w-5 text-amber-500" />
    } else {
      return <CheckCircle className="h-5 w-5 text-primary" />
    }
  }

  return (
    <div className="space-y-6">
      {budgetData.map((item, index) => {
        const percentage = Math.min(100, (item.spent / item.budget) * 100)

        return (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-medium">{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.budget, item.spent)}
                  <span className="text-sm font-medium">
                    {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                  </span>
                </div>
              </div>

              <Progress
                value={percentage}
                className="h-2"
                indicatorColor={percentage >= 100 ? "bg-destructive" : percentage >= 80 ? "bg-amber-500" : item.color}
              />

              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{percentage.toFixed(0)}% of budget</span>
                <span>
                  {formatCurrency(item.budget - item.spent)} {item.spent < item.budget ? "remaining" : "over budget"}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
