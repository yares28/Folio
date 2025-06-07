import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseByCategory } from "@/components/dashboard/expense-by-category"
import { SpendingTrends } from "@/components/dashboard/spending-trends"
import { MonthlyComparison } from "@/components/dashboard/monthly-comparison"
import { BudgetProgress } from "@/components/dashboard/budget-progress"

export default function ChartsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Visualize your spending patterns and financial trends</p>
      </div>

      <Tabs defaultValue="category">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="trends">Spending Trends</TabsTrigger>
          <TabsTrigger value="comparison">Monthly Comparison</TabsTrigger>
          <TabsTrigger value="budget">Budget Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="category" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown by Category</CardTitle>
              <CardDescription>See where your money is going and identify spending patterns</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ExpenseByCategory />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending Trends Over Time</CardTitle>
              <CardDescription>Track how your expenses change over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <SpendingTrends />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expense Comparison</CardTitle>
              <CardDescription>Compare your spending across different months</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <MonthlyComparison />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Progress</CardTitle>
              <CardDescription>Track your spending against your budget goals</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <BudgetProgress />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
