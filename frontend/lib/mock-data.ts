// Mock data generator for finance dashboard

// Types for our financial data
export interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: "income" | "expense" | "transfer"
  account: string
  tags: string[]
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

// Categories for transactions
const CATEGORIES = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Insurance",
  "Healthcare",
  "Savings",
  "Personal",
  "Entertainment",
  "Miscellaneous",
  "Income",
  "Investments",
]

// Tags for transactions
const TAGS = [
  "essential",
  "recurring",
  "discretionary",
  "tax-deductible",
  "business",
  "personal",
  "vacation",
  "gift",
  "emergency",
]

// Account types
const ACCOUNT_TYPES = ["checking", "savings", "investment", "credit"]

// Asset types
const ASSET_TYPES = ["stock", "bond", "crypto", "real_estate", "cash"]

// Helper to generate random date within range
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().split("T")[0]
}

// Helper to pick random item from array
function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

// Helper to generate random amount
function randomAmount(min: number, max: number, isInteger = false): number {
  const amount = min + Math.random() * (max - min)
  return isInteger ? Math.round(amount) : Number(amount.toFixed(2))
}

// Generate random transaction
function generateTransaction(id: number): Transaction {
  const type = Math.random() > 0.7 ? "income" : Math.random() > 0.5 ? "expense" : "transfer"
  const amount =
    type === "income" ? randomAmount(500, 5000) : type === "expense" ? -randomAmount(10, 1000) : randomAmount(100, 2000)

  const category =
    type === "income"
      ? "Income"
      : type === "transfer"
        ? "Transfer"
        : randomItem(CATEGORIES.filter((c) => c !== "Income"))

  // Generate random tags (1-3)
  const numTags = Math.floor(Math.random() * 3) + 1
  const tags: string[] = []
  for (let i = 0; i < numTags; i++) {
    const tag = randomItem(TAGS)
    if (!tags.includes(tag)) {
      tags.push(tag)
    }
  }

  return {
    id: `txn-${id}`,
    date: randomDate(new Date(2022, 0, 1), new Date()),
    description: `Transaction ${id}`,
    category,
    amount,
    type,
    account: `Account ${Math.floor(Math.random() * 5) + 1}`,
    tags,
  }
}

// Generate random account
function generateAccount(id: number): Account {
  const type = randomItem(ACCOUNT_TYPES) as "checking" | "savings" | "investment" | "credit"
  return {
    id: `acc-${id}`,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Account ${id}`,
    type,
    balance: randomAmount(1000, 50000),
    currency: "USD",
  }
}

// Generate random asset
function generateAsset(id: number): Asset {
  const type = randomItem(ASSET_TYPES) as "stock" | "bond" | "crypto" | "real_estate" | "cash"
  const value = randomAmount(1000, 100000)
  const asset: Asset = {
    id: `asset-${id}`,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${id}`,
    type,
    value,
  }

  if (type === "stock" || type === "crypto") {
    asset.quantity = randomAmount(1, 100, false)
    asset.purchasePrice = value / asset.quantity
    asset.purchaseDate = randomDate(new Date(2020, 0, 1), new Date(2023, 0, 1))
  }

  return asset
}

// Generate dataset with transactions, accounts, and assets
export function generateFinancialData(numTransactions = 500, numAccounts = 5, numAssets = 10) {
  const transactions: Transaction[] = []
  const accounts: Account[] = []
  const assets: Asset[] = []

  // Generate transactions
  for (let i = 1; i <= numTransactions; i++) {
    transactions.push(generateTransaction(i))
  }

  // Sort transactions by date (newest first)
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Generate accounts
  for (let i = 1; i <= numAccounts; i++) {
    accounts.push(generateAccount(i))
  }

  // Generate assets
  for (let i = 1; i <= numAssets; i++) {
    assets.push(generateAsset(i))
  }

  return {
    transactions,
    accounts,
    assets,
  }
}

// Generate time series data for balance history
export function generateBalanceHistory(days = 365) {
  const data = []
  let balance = randomAmount(10000, 20000)
  const today = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Random daily change (-3% to +3%)
    const change = balance * randomAmount(-0.03, 0.03)
    balance += change

    data.push({
      date: date.toISOString().split("T")[0],
      balance: Number(balance.toFixed(2)),
    })
  }

  return data
}

// Generate asset allocation data
export function generateAssetAllocation() {
  return [
    { type: "Stocks", value: randomAmount(30000, 50000) },
    { type: "Bonds", value: randomAmount(10000, 20000) },
    { type: "Cash", value: randomAmount(5000, 15000) },
    { type: "Real Estate", value: randomAmount(50000, 100000) },
    { type: "Crypto", value: randomAmount(5000, 15000) },
  ]
}

// Generate expense by category data
export function generateExpensesByCategory(startDate?: Date, endDate?: Date) {
  return CATEGORIES.filter((c) => c !== "Income" && c !== "Investments").map((category) => ({
    category,
    amount: randomAmount(500, 3000),
  }))
}

// Generate income vs expenses data
export function generateIncomeVsExpenses(months = 12) {
  const data = []
  const today = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setMonth(date.getMonth() - i)

    const month = date.toLocaleString("default", { month: "short" })
    const year = date.getFullYear()

    data.push({
      month: `${month} ${year}`,
      income: randomAmount(4000, 6000),
      expenses: randomAmount(2000, 4000),
    })
  }

  return data
}

// Generate monthly data for a specific date range
export function generateMonthlyData(startDate: Date, endDate: Date) {
  const data = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const month = currentDate.toLocaleString("default", { month: "short" })
    const year = currentDate.getFullYear()

    data.push({
      month: `${month} ${year}`,
      income: randomAmount(4000, 6000),
      expenses: randomAmount(2000, 4000),
    })

    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  return data
}

// Generate dividend data for a specific date range
export function generateDividendData(startDate: Date, endDate: Date) {
  const data = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const month = currentDate.toLocaleString("default", { month: "short" })
    const year = currentDate.getFullYear()

    data.push({
      month: `${month} ${year}`,
      amount: randomAmount(100, 500),
    })

    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  return data
}

// Filter transactions by date range
export function filterTransactionsByDate(transactions: Transaction[], startDate: Date, endDate: Date) {
  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)
    return transactionDate >= startDate && transactionDate <= endDate
  })
}

// Get expense summary by category for a date range
export function getExpenseSummaryByCategory(transactions: Transaction[], startDate: Date, endDate: Date) {
  const filteredTransactions = filterTransactionsByDate(transactions, startDate, endDate)

  const expensesByCategory: Record<string, number> = {}

  filteredTransactions.forEach((transaction) => {
    if (transaction.type === "expense") {
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

// Get total expenses for a date range
export function getTotalExpenses(transactions: Transaction[], startDate: Date, endDate: Date) {
  const filteredTransactions = filterTransactionsByDate(transactions, startDate, endDate)

  return filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Math.abs(t.amount), 0)
}

// Get total income for a date range
export function getTotalIncome(transactions: Transaction[], startDate: Date, endDate: Date) {
  const filteredTransactions = filterTransactionsByDate(transactions, startDate, endDate)

  return filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
}

// Generate complete mock dataset
export function generateMockData() {
  const { transactions, accounts, assets } = generateFinancialData()

  return {
    transactions,
    accounts,
    assets,
    balanceHistory: generateBalanceHistory(),
    assetAllocation: generateAssetAllocation(),
    expensesByCategory: generateExpensesByCategory(),
    incomeVsExpenses: generateIncomeVsExpenses(),
  }
}

// Export a singleton instance of the mock data
export const mockData = generateMockData()
