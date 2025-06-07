"use client"

import { useState } from "react"
import { FileUploader } from "./file-uploader"
import { TransactionsTable } from "./transactions-table"
import { SpendingCharts } from "./spending-charts"
import { processTransactions } from "@/lib/process-transactions"
import type { Transaction, CategoryRule } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Default category rules
  const [categoryRules] = useState<CategoryRule[]>([
    { pattern: "uber", category: "Transport" },
    { pattern: "lyft", category: "Transport" },
    { pattern: "walmart", category: "Groceries" },
    { pattern: "kroger", category: "Groceries" },
    { pattern: "safeway", category: "Groceries" },
    { pattern: "amazon", category: "Shopping" },
    { pattern: "netflix", category: "Entertainment" },
    { pattern: "spotify", category: "Entertainment" },
    { pattern: "restaurant", category: "Dining" },
    { pattern: "cafe", category: "Dining" },
    { pattern: "starbucks", category: "Dining" },
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
  ])

  const handleFileUpload = async (files: FileList) => {
    try {
      setIsLoading(true)
      setError(null)

      const filePromises = Array.from(files).map((file) => {
        return new Promise<Transaction[]>((resolve, reject) => {
          const reader = new FileReader()

          reader.onload = (e) => {
            try {
              const csvData = e.target?.result as string
              const processedData = processTransactions(csvData, categoryRules)
              resolve(processedData)
            } catch (err) {
              reject(err)
            }
          }

          reader.onerror = () => {
            reject(new Error(`Failed to read file: ${file.name}`))
          }

          reader.readAsText(file)
        })
      })

      const results = await Promise.all(filePromises)
      const allTransactions = results.flat()

      setTransactions(allTransactions)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process files")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Bank Statements</CardTitle>
          <CardDescription>Upload your CSV bank statements to analyze your spending</CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploader onUpload={handleFileUpload} isLoading={isLoading} />

          {error && (
            <Alert variant="destructive" className="mt-4">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {transactions.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Loaded {transactions.length} transactions.
              {transactions.filter((t) => t.category === "Uncategorized").length > 0 &&
                ` ${transactions.filter((t) => t.category === "Uncategorized").length} transactions need categorization.`}
            </div>
          )}
        </CardContent>
      </Card>

      {transactions.length > 0 && (
        <Tabs defaultValue="charts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="mt-4">
            <SpendingCharts transactions={transactions} />
          </TabsContent>

          <TabsContent value="transactions" className="mt-4">
            <TransactionsTable transactions={transactions} onUpdateTransaction={handleUpdateTransaction} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
