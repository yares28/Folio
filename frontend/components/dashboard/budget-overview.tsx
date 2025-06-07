"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2 } from "lucide-react"

interface BudgetOverviewProps {
  dateRange?: {
    from: Date
    to: Date
  }
}

export function BudgetOverview({ dateRange }: BudgetOverviewProps) {
  const [loading, setLoading] = useState(true)
  const [budgets, setBudgets] = useState<any[]>([])
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const [selectedBudget, setSelectedBudget] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editAmount, setEditAmount] = useState("")

  // Simulate data fetching with the date range
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1200))

      // Sample data - in a real app, this would come from your API with the date range filter
      const sampleData = [
        {
          category: "Food & Dining",
          budget: 1000,
          spent: 850,
          color: isDark ? "#38bdf8" : "#0ea5e9",
          currency: "USD",
        },
        {
          category: "Housing",
          budget: 1500,
          spent: 1200,
          color: isDark ? "#fb923c" : "#f97316",
          currency: "USD",
        },
        {
          category: "Transportation",
          budget: 300,
          spent: 350,
          color: isDark ? "#a78bfa" : "#8b5cf6",
          currency: "USD",
        },
        {
          category: "Entertainment",
          budget: 400,
          spent: 250,
          color: isDark ? "#34d399" : "#10b981",
          currency: "USD",
        },
        {
          category: "Utilities",
          budget: 200,
          spent: 195,
          color: isDark ? "#fb7185" : "#f43f5e",
          currency: "USD",
        },
        {
          category: "Shopping",
          budget: 300,
          spent: 275,
          color: isDark ? "#fbbf24" : "#f59e0b",
          currency: "USD",
        },
        {
          category: "Healthcare",
          budget: 150,
          spent: 120,
          color: isDark ? "#60a5fa" : "#3b82f6",
          currency: "USD",
        },
        {
          category: "Personal Care",
          budget: 100,
          spent: 85,
          color: isDark ? "#c084fc" : "#a855f7",
          currency: "USD",
        },
      ]

      setBudgets(sampleData)
      setLoading(false)
    }

    fetchData()
  }, [dateRange, isDark])

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="space-y-2 w-full px-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Find any over-budget categories
  const overBudgetItems = budgets.filter((item) => item.spent > item.budget)

  return (
    <div className="p-2 h-full overflow-hidden bg-gradient-to-br from-background to-muted/20">
      <div className="grid grid-cols-2 gap-1">
        {budgets.map((item, index) => {
          const percentage = Math.round((item.spent / item.budget) * 100)
          const isOverBudget = item.spent > item.budget

          return (
            <div key={index} className="budget-item-compact">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-md p-1.5 hover:shadow-sm transition-all duration-200 hover:bg-card/80 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-foreground">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="text-sm text-right">
                      <span className={`font-semibold ${isOverBudget ? "text-destructive" : "text-foreground"}`}>
                        {formatCurrency(item.spent, item.currency)}
                      </span>
                      <span className="text-muted-foreground text-xs block">
                        of {formatCurrency(item.budget, item.currency)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 hover:bg-primary/10"
                      onClick={() => {
                        // Set the selected budget item for editing
                        setSelectedBudget(item)
                        setEditAmount(item.budget.toString())
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit2 className="h-1.5 w-1.5 text-muted-foreground hover:text-primary" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center mb-0.5">
                  <Progress
                    value={percentage > 100 ? 100 : percentage}
                    className="h-2 w-1/2"
                    style={{
                      backgroundColor: "hsl(var(--muted))",
                    }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{percentage}% used</span>
                  {isOverBudget && (
                    <div className="text-xs text-destructive flex items-center gap-0.5">
                      <AlertCircle className="h-1 w-1" />
                      Over by {formatCurrency(item.spent - item.budget, item.currency)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {overBudgetItems.length > 0 && (
        <Alert className="mt-2 py-1">
          <AlertCircle className="h-3 w-3" />
          <AlertTitle className="text-xs">Budget Alerts</AlertTitle>
          <AlertDescription className="text-xs">
            You've exceeded {overBudgetItems.length} budget{overBudgetItems.length > 1 ? "s" : ""}
          </AlertDescription>
        </Alert>
      )}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedBudget?.color }} />
              Edit Budget for {selectedBudget?.category}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget-amount" className="text-right">
                Budget
              </Label>
              <Input
                id="budget-amount"
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="col-span-3"
                placeholder="Enter budget amount"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Current spending: {selectedBudget && formatCurrency(selectedBudget.spent, selectedBudget.currency)}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Update the budget in the budgets array
                const newAmount = Number.parseFloat(editAmount)
                if (!isNaN(newAmount) && newAmount > 0) {
                  setBudgets((prev) =>
                    prev.map((budget) =>
                      budget.category === selectedBudget?.category ? { ...budget, budget: newAmount } : budget,
                    ),
                  )
                }
                setIsEditDialogOpen(false)
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
