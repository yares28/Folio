"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  mockData,
  type Transaction,
  type Account,
  type Asset,
  filterTransactionsByDate,
  getExpenseSummaryByCategory,
  getTotalExpenses,
  getTotalIncome,
  generateMonthlyData,
  generateDividendData,
} from "@/lib/mock-data"

interface DataContextType {
  transactions: Transaction[]
  filteredTransactions: Transaction[]
  accounts: Account[]
  assets: Asset[]
  balanceHistory: any[]
  assetAllocation: any[]
  expensesByCategory: any[]
  incomeVsExpenses: any[]
  isLoading: boolean
  dateRange: { from: Date; to: Date }
  setDateRange: (range: { from: Date; to: Date }) => void
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  totalExpenses: number
  totalIncome: number
  monthlyData: any[]
  dividendData: any[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(mockData)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(),
  })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(data.transactions)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [dividendData, setDividendData] = useState<any[]>([])
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([])

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Apply filters when they change
  useEffect(() => {
    let filtered = data.transactions

    // Apply date range filter
    filtered = filterTransactionsByDate(filtered, dateRange.from, dateRange.to)

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((transaction) => selectedCategories.includes(transaction.category))
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(query) ||
          transaction.category.toLowerCase().includes(query) ||
          transaction.account.toLowerCase().includes(query),
      )
    }

    setFilteredTransactions(filtered)

    // Calculate totals based on filtered transactions
    setTotalExpenses(getTotalExpenses(data.transactions, dateRange.from, dateRange.to))
    setTotalIncome(getTotalIncome(data.transactions, dateRange.from, dateRange.to))

    // Generate monthly data for the selected date range
    setMonthlyData(generateMonthlyData(dateRange.from, dateRange.to))

    // Generate dividend data for the selected date range
    setDividendData(generateDividendData(dateRange.from, dateRange.to))

    // Get expense summary by category
    setExpensesByCategory(getExpenseSummaryByCategory(data.transactions, dateRange.from, dateRange.to))
  }, [data.transactions, dateRange, selectedCategories, searchQuery])

  const value = {
    transactions: data.transactions,
    filteredTransactions,
    accounts: data.accounts,
    assets: data.assets,
    balanceHistory: data.balanceHistory,
    assetAllocation: data.assetAllocation,
    expensesByCategory,
    incomeVsExpenses: data.incomeVsExpenses,
    isLoading,
    dateRange,
    setDateRange,
    selectedCategories,
    setSelectedCategories,
    searchQuery,
    setSearchQuery,
    totalExpenses,
    totalIncome,
    monthlyData,
    dividendData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
