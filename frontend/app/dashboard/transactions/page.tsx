"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionsTable } from "@/components/dashboard/transactions-table"
import { TransactionFilters } from "@/components/dashboard/transaction-filters"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getTransactionsByFileId, getTransactionsByDateRange } from "@/lib/actions"
import type { Transaction } from "@/lib/types"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const searchParams = useSearchParams()
  const fileId = searchParams.get("fileId")

  useEffect(() => {
    async function loadTransactions() {
      setIsLoading(true)
      try {
        let data: Transaction[] = []

        if (fileId) {
          data = await getTransactionsByFileId(fileId)
        } else {
          // Default to last 30 days if no file ID is provided
          const today = new Date()
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(today.getDate() - 30)

          data = await getTransactionsByDateRange(
            thirtyDaysAgo.toISOString().split("T")[0],
            today.toISOString().split("T")[0],
          )
        }

        setTransactions(data)
      } catch (error) {
        console.error("Failed to load transactions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
  }, [fileId])

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">View and manage all your financial transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>Browse, search, and filter your transaction history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TransactionFilters />
          <TransactionsTable
            transactions={filteredTransactions}
            isLoading={isLoading}
            onEditTransaction={handleEditTransaction}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="description"
                  value={selectedTransaction.description}
                  onChange={(e) =>
                    setSelectedTransaction({
                      ...selectedTransaction,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Input
                  id="category"
                  value={selectedTransaction.category}
                  onChange={(e) =>
                    setSelectedTransaction({
                      ...selectedTransaction,
                      category: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Here you would update the transaction in the database
                    // For now, we'll just update it in the local state
                    setTransactions(
                      transactions.map((t) => (t.id === selectedTransaction.id ? selectedTransaction : t)),
                    )
                    setIsDialogOpen(false)
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
