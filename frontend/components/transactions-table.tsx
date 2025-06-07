"use client"

import { useState } from "react"
import { useData } from "@/contexts/data-context"
import { ArrowUpDown, Search, Filter } from "lucide-react"

export default function TransactionsTable() {
  const { filteredTransactions, isLoading, searchQuery, setSearchQuery } = useData()
  const [sortField, setSortField] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue = a[sortField as keyof typeof a]
    let bValue = b[sortField as keyof typeof b]

    // Handle date sorting
    if (sortField === "date") {
      aValue = new Date(aValue as string).getTime()
      bValue = new Date(bValue as string).getTime()
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage)
  const paginatedTransactions = sortedTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded-md w-1/4"></div>
          <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-md"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-neutral-200 dark:bg-neutral-700 rounded-md"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Transactions</h2>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button className="p-2 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <button className="flex items-center gap-1" onClick={() => handleSort("date")}>
                  Date
                  <ArrowUpDown size={14} className={sortField === "date" ? "text-primary-500" : ""} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <button className="flex items-center gap-1" onClick={() => handleSort("description")}>
                  Description
                  <ArrowUpDown size={14} className={sortField === "description" ? "text-primary-500" : ""} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <button className="flex items-center gap-1" onClick={() => handleSort("category")}>
                  Category
                  <ArrowUpDown size={14} className={sortField === "category" ? "text-primary-500" : ""} />
                </button>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <button className="flex items-center gap-1 ml-auto" onClick={() => handleSort("amount")}>
                  Amount
                  <ArrowUpDown size={14} className={sortField === "amount" ? "text-primary-500" : ""} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-200">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-900 dark:text-neutral-200">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-200">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    <span
                      className={
                        transaction.amount >= 0
                          ? "text-success-600 dark:text-success-400"
                          : "text-danger-600 dark:text-danger-400"
                      }
                    >
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-700">
          <div className="text-sm text-neutral-700 dark:text-neutral-300">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of{" "}
            <span className="font-medium">{filteredTransactions.length}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded-md text-sm ${
                  currentPage === i + 1
                    ? "bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-400"
                    : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
