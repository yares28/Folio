import type { Transaction, CategoryRule } from "./types"

// Function to parse CSV data into transactions
export function processTransactions(csvData: string, categoryRules: CategoryRule[]): Transaction[] {
  // Split the CSV into lines
  const lines = csvData.split("\n")

  // Skip header row and empty lines
  const dataLines = lines.slice(1).filter((line) => line.trim() !== "")

  // Parse each line into a transaction
  const transactions: Transaction[] = dataLines.map((line, index) => {
    // Simple CSV parsing (this assumes comma-separated values with no commas in the fields)
    // In a production app, you'd want a more robust CSV parser
    const [date, description, amount] = line.split(",").map((field) => field.trim())

    // Generate a unique ID
    const id = `tx-${Date.now()}-${index}`

    // Determine category based on rules
    const category = categorizeTransaction(description, categoryRules)

    return {
      id,
      date,
      description,
      amount: Number.parseFloat(amount),
      category,
    }
  })

  return transactions
}

// Function to categorize a transaction based on rules
function categorizeTransaction(description: string, rules: CategoryRule[]): string {
  const lowerDesc = description.toLowerCase()

  for (const rule of rules) {
    if (lowerDesc.includes(rule.pattern.toLowerCase())) {
      return rule.category
    }
  }

  return "Uncategorized"
}

// Default category rules
export function getDefaultCategoryRules(): CategoryRule[] {
  return [
    { pattern: "uber", category: "Transport" },
    { pattern: "lyft", category: "Transport" },
    { pattern: "taxi", category: "Transport" },
    { pattern: "subway", category: "Transport" },
    { pattern: "train", category: "Transport" },
    { pattern: "bus", category: "Transport" },
    { pattern: "walmart", category: "Groceries" },
    { pattern: "kroger", category: "Groceries" },
    { pattern: "safeway", category: "Groceries" },
    { pattern: "trader joe", category: "Groceries" },
    { pattern: "whole foods", category: "Groceries" },
    { pattern: "amazon", category: "Shopping" },
    { pattern: "target", category: "Shopping" },
    { pattern: "best buy", category: "Shopping" },
    { pattern: "netflix", category: "Entertainment" },
    { pattern: "spotify", category: "Entertainment" },
    { pattern: "hulu", category: "Entertainment" },
    { pattern: "disney+", category: "Entertainment" },
    { pattern: "cinema", category: "Entertainment" },
    { pattern: "movie", category: "Entertainment" },
    { pattern: "restaurant", category: "Dining" },
    { pattern: "cafe", category: "Dining" },
    { pattern: "starbucks", category: "Dining" },
    { pattern: "mcdonald", category: "Dining" },
    { pattern: "burger", category: "Dining" },
    { pattern: "pizza", category: "Dining" },
    { pattern: "utility", category: "Utilities" },
    { pattern: "electric", category: "Utilities" },
    { pattern: "water", category: "Utilities" },
    { pattern: "gas", category: "Utilities" },
    { pattern: "internet", category: "Utilities" },
    { pattern: "phone", category: "Utilities" },
    { pattern: "mobile", category: "Utilities" },
    { pattern: "rent", category: "Housing" },
    { pattern: "mortgage", category: "Housing" },
    { pattern: "insurance", category: "Insurance" },
    { pattern: "doctor", category: "Healthcare" },
    { pattern: "hospital", category: "Healthcare" },
    { pattern: "pharmacy", category: "Healthcare" },
    { pattern: "salary", category: "Income" },
    { pattern: "deposit", category: "Income" },
    { pattern: "payroll", category: "Income" },
    { pattern: "interest", category: "Income" },
    { pattern: "dividend", category: "Income" },
  ]
}
