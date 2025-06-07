"use client"

import { useData } from "@/contexts/data-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ArrowDownIcon, ArrowUpIcon, ArrowRightIcon } from "lucide-react"

export function RecentTransactions() {
  const { filteredTransactions, isLoading } = useData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
      </div>
    )
  }

  // Take the first 10 transactions
  const recentTransactions = filteredTransactions.slice(0, 10)

  return (
    <div className="space-y-1 p-4">
      {recentTransactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center h-8 w-8 rounded-full 
              ${
                transaction.type === "income"
                  ? "bg-green-100 text-green-600"
                  : transaction.type === "expense"
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
              }`}
            >
              {transaction.type === "income" ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : transaction.type === "expense" ? (
                <ArrowDownIcon className="h-4 w-4" />
              ) : (
                <ArrowRightIcon className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{transaction.description}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                  {transaction.category}
                </Badge>
              </div>
            </div>
          </div>
          <p
            className={`text-sm font-medium ${
              transaction.type === "income"
                ? "text-green-600"
                : transaction.type === "expense"
                  ? "text-red-600"
                  : "text-blue-600"
            }`}
          >
            {transaction.type === "income" ? "+" : transaction.type === "expense" ? "-" : ""}
            {formatCurrency(Math.abs(transaction.amount))}
          </p>
        </div>
      ))}

      {recentTransactions.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No transactions found for the selected date range</p>
        </div>
      )}
    </div>
  )
}
