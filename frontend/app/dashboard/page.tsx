"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { ExpenseSummary } from "@/components/dashboard/expense-summary"
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown"
import { MonthlyTrends } from "@/components/dashboard/monthly-trends"
import { FileUploader } from "@/components/dashboard/file-uploader"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Download, Filter, Plus, Moon, Sun } from "lucide-react"
import { BudgetOverview } from "@/components/dashboard/budget-overview"
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview"
import { AssetAllocation } from "@/components/dashboard/asset-allocation"
import { InvestmentPerformance } from "@/components/dashboard/investment-performance"
import { DividendIncome } from "@/components/dashboard/dividend-income"
import { useTheme } from "next-themes"
import { FilterDrawer } from "@/components/dashboard/filter-drawer"
import { useData } from "@/contexts/data-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, ChevronDown, PiggyBank } from "lucide-react"

export default function DashboardPage() {
  const { dateRange, setDateRange } = useData()
  const [view, setView] = useState<"day" | "week" | "month" | "year">("month")
  const [dashboardTab, setDashboardTab] = useState("expenses")
  const [filterOpen, setFilterOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [budgetView, setBudgetView] = useState<"monthly" | "savings">("monthly")

  // Ensure theme component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleViewChange = (newView: "day" | "week" | "month" | "year") => {
    setView(newView)
    const now = new Date()
    let from: Date
    let to: Date = now

    switch (newView) {
      case "day":
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
        break
      case "week":
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        from = startOfWeek
        break
      case "month":
        from = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "year":
        from = new Date(now.getFullYear(), 0, 1)
        break
      default:
        from = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    setDateRange({ from, to })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
          <p className="text-muted-foreground">Track, analyze, and optimize your finances</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Tabs defaultValue="month" className="w-[300px]" onValueChange={handleViewChange}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[240px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from && dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to })
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={() => setFilterOpen(true)}>
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          {mounted && (
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="expenses" onValueChange={setDashboardTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">Expense Tracker</TabsTrigger>
          <TabsTrigger value="investments">Investment Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-6 mt-6">
          <Suspense fallback={<DashboardSkeleton />}>
            <Overview />
          </Suspense>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <Card className="h-[400px] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>Monthly Expense Trends</CardTitle>
                <CardDescription>Track how your spending changes over time</CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[330px] overflow-hidden">
                <MonthlyTrends />
              </CardContent>
            </Card>
            <Card className="h-[400px] overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Category Breakdown</CardTitle>
                    <CardDescription>See where your money is going</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Custom Category
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[330px] overflow-hidden">
                <CategoryBreakdown />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <Card className="h-[400px] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest financial activities</CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[330px] overflow-auto">
                <RecentTransactions />
              </CardContent>
            </Card>
            <Card className="h-[400px] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>Expense Summary</CardTitle>
                <CardDescription>Your spending by category this month</CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[330px] overflow-hidden">
                <ExpenseSummary />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <Card className="min-h-[400px] overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Budget Overview</CardTitle>
                    <CardDescription>Track your spending against budget limits</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        View Options
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setBudgetView("monthly")}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Monthly Budget
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setBudgetView("savings")}>
                        <PiggyBank className="h-4 w-4 mr-2" />
                        Savings Goals
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-0 min-h-[330px] overflow-auto">
                {budgetView === "monthly" ? (
                  <BudgetOverview />
                ) : (
                  <div className="p-4 h-full overflow-auto">
                    <div className="space-y-4">
                      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-md p-3">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Travel Fund</span>
                          <span className="text-sm">$3,200 / $5,000</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mb-1">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "64%" }}></div>
                        </div>
                        <div className="text-xs text-muted-foreground">64% complete</div>
                      </div>

                      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-md p-3">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">New Watch</span>
                          <span className="text-sm">$450 / $800</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mb-1">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: "56%" }}></div>
                        </div>
                        <div className="text-xs text-muted-foreground">56% complete</div>
                      </div>

                      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-md p-3">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Gaming Console</span>
                          <span className="text-sm">$320 / $500</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mb-1">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "64%" }}></div>
                        </div>
                        <div className="text-xs text-muted-foreground">64% complete</div>
                      </div>

                      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-md p-3">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">New Laptop</span>
                          <span className="text-sm">$800 / $2,000</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mb-1">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: "40%" }}></div>
                        </div>
                        <div className="text-xs text-muted-foreground">40% complete</div>
                      </div>

                      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-md p-3">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Home Renovation</span>
                          <span className="text-sm">$5,000 / $15,000</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mb-1">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "33%" }}></div>
                        </div>
                        <div className="text-xs text-muted-foreground">33% complete</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="min-h-[400px] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>Financial Calendar</CardTitle>
                <CardDescription>Upcoming bills and financial events</CardDescription>
              </CardHeader>
              <CardContent className="p-0 min-h-[330px] overflow-auto">
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Rent Payment</div>
                          <div className="text-xs text-muted-foreground">Monthly recurring</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$1,500</div>
                          <div className="text-xs text-destructive">Due in 3 days</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Electric Bill</div>
                          <div className="text-xs text-muted-foreground">Monthly recurring</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$85</div>
                          <div className="text-xs text-amber-500">Due in 10 days</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Car Insurance</div>
                          <div className="text-xs text-muted-foreground">Quarterly payment</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$350</div>
                          <div className="text-xs text-amber-500">Due in 14 days</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Phone Bill</div>
                          <div className="text-xs text-muted-foreground">Monthly recurring</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$75</div>
                          <div className="text-xs text-green-500">Due in 20 days</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Internet Service</div>
                          <div className="text-xs text-muted-foreground">Monthly recurring</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">$65</div>
                          <div className="text-xs text-green-500">Due in 25 days</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Import Transactions</CardTitle>
              <CardDescription>Upload your bank statements to analyze your spending</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments" className="space-y-6 mt-6">
          <PortfolioOverview />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <Card className="h-[400px] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>Investment Performance</CardTitle>
                <CardDescription>Track returns against benchmark indices</CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[330px] overflow-hidden">
                <InvestmentPerformance />
              </CardContent>
            </Card>
            <Card className="h-[400px] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Portfolio breakdown by asset class</CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[330px] overflow-hidden">
                <AssetAllocation />
              </CardContent>
            </Card>
          </div>

          <Card className="h-[400px] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>Dividend Income</CardTitle>
              <CardDescription>Track dividend payments and yield</CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[330px] overflow-hidden">
              <DividendIncome />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  )
}
