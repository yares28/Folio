"use client"
import { ArrowUpIcon, ArrowDownIcon, DollarSign, TrendingUp, Wallet, PieChart } from "lucide-react"
import { useData } from "@/contexts/data-context"

export default function SummaryCards() {
  const { accounts, assets, filteredTransactions, isLoading } = useData()

  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  // Calculate total assets value
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0)

  // Calculate income and expenses from transactions
  const income = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const expenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="summary-card">
        <div className="summary-card-header">
          <h3 className="summary-card-title">Total Balance</h3>
          <DollarSign className="summary-card-icon" size={20} />
        </div>

        {isLoading ? (
          <div className="animate-pulse h-8 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
        ) : (
          <div className="summary-card-value">{formatCurrency(totalBalance)}</div>
        )}

        <div className="summary-card-change text-success-500">
          <ArrowUpIcon className="summary-card-change-icon" />
          <span>8.2% from last month</span>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-header">
          <h3 className="summary-card-title">Total Assets</h3>
          <PieChart className="summary-card-icon" size={20} />
        </div>

        {isLoading ? (
          <div className="animate-pulse h-8 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
        ) : (
          <div className="summary-card-value">{formatCurrency(totalAssets)}</div>
        )}

        <div className="summary-card-change text-success-500">
          <ArrowUpIcon className="summary-card-change-icon" />
          <span>12.5% from last month</span>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-header">
          <h3 className="summary-card-title">Income</h3>
          <TrendingUp className="summary-card-icon" size={20} />
        </div>

        {isLoading ? (
          <div className="animate-pulse h-8 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
        ) : (
          <div className="summary-card-value">{formatCurrency(income)}</div>
        )}

        <div className="summary-card-change text-success-500">
          <ArrowUpIcon className="summary-card-change-icon" />
          <span>5.3% from last period</span>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-header">
          <h3 className="summary-card-title">Expenses</h3>
          <Wallet className="summary-card-icon" size={20} />
        </div>

        {isLoading ? (
          <div className="animate-pulse h-8 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
        ) : (
          <div className="summary-card-value">{formatCurrency(expenses)}</div>
        )}

        <div className="summary-card-change text-danger-500">
          <ArrowDownIcon className="summary-card-change-icon" />
          <span>3.1% from last period</span>
        </div>
      </div>
    </div>
  )
}
