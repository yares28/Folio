"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Updated types to match backend API
export interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: "debit" | "credit"
  currency: string
}

export interface Account {
  id: string
  name: string
  type: "checking" | "savings" | "investment" | "credit"
  balance: number
  currency: string
}

export interface Asset {
  id: string
  name: string
  type: "stock" | "bond" | "crypto" | "real_estate" | "cash"
  value: number
  quantity?: number
  purchasePrice?: number
  purchaseDate?: string
}

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Helper functions for data processing
const filterTransactionsByDate = (transactions: Transaction[], startDate: Date, endDate: Date) => {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)
    return transactionDate >= startDate && transactionDate <= endDate
  })
}

const getTotalExpenses = (transactions: Transaction[], startDate: Date, endDate: Date) => {
  const filtered = filterTransactionsByDate(transactions, startDate, endDate)
  return filtered.filter(t => t.type === "debit").reduce((sum, t) => sum + Math.abs(t.amount), 0)
}

const getTotalIncome = (transactions: Transaction[], startDate: Date, endDate: Date) => {
  const filtered = filterTransactionsByDate(transactions, startDate, endDate)
  return filtered.filter(t => t.type === "credit").reduce((sum, t) => sum + t.amount, 0)
}

const getExpenseSummaryByCategory = (transactions: Transaction[], startDate: Date, endDate: Date) => {
  const filtered = filterTransactionsByDate(transactions, startDate, endDate)
  const expensesByCategory: Record<string, number> = {}

  filtered.forEach((transaction) => {
    if (transaction.type === "debit") {
      if (!expensesByCategory[transaction.category]) {
        expensesByCategory[transaction.category] = 0
      }
      expensesByCategory[transaction.category] += Math.abs(transaction.amount)
    }
  })

  return Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
  }))
}

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
  uploadTransactions: (file: File) => Promise<void>
  categories: Record<string, string[]>
  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [categories, setCategories] = useState<Record<string, string[]>>({})
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(),
  })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [dividendData, setDividendData] = useState<any[]>([])
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([])

  // API functions
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const uploadTransactions = async (file: File) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_BASE_URL}/upload-transactions`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload transactions')
      
      const data = await response.json()
      setTransactions(data.transactions)
    } catch (error) {
      console.error('Error uploading transactions:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    await fetchCategories()
  }

  // Load categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Apply filters when they change
  useEffect(() => {
    let filtered = transactions

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
          transaction.category.toLowerCase().includes(query)
      )
    }

    setFilteredTransactions(filtered)

    // Calculate totals based on filtered transactions
    setTotalExpenses(getTotalExpenses(transactions, dateRange.from, dateRange.to))
    setTotalIncome(getTotalIncome(transactions, dateRange.from, dateRange.to))

    // Get expense summary by category
    setExpensesByCategory(getExpenseSummaryByCategory(transactions, dateRange.from, dateRange.to))

    // Generate mock monthly data for visualization (could be moved to API later)
    const months = []
    const currentDate = new Date(dateRange.from)
    while (currentDate <= dateRange.to) {
      const month = currentDate.toLocaleString("default", { month: "short" })
      const year = currentDate.getFullYear()
      months.push({
        month: `${month} ${year}`,
        income: Math.random() * 3000 + 2000,
        expenses: Math.random() * 2000 + 1000,
      })
      currentDate.setMonth(currentDate.getMonth() + 1)
    }
    setMonthlyData(months)

    // Generate mock dividend data
    const dividends = months.map(m => ({
      month: m.month,
      amount: Math.random() * 300 + 100
    }))
    setDividendData(dividends)
  }, [transactions, dateRange, selectedCategories, searchQuery])

  const value = {
    transactions,
    filteredTransactions,
    accounts,
    assets,
    balanceHistory: [], // Empty for now
    assetAllocation: [], // Empty for now
    expensesByCategory,
    incomeVsExpenses: monthlyData,
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
    uploadTransactions,
    categories,
    refreshData,
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
