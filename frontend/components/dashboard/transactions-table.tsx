"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Define the transaction type
interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
}

// Sample data - in a real app, this would come from your data source
const data: Transaction[] = [
  {
    id: "t1",
    date: "2023-12-15",
    description: "Grocery Store",
    category: "Food & Dining",
    amount: -120.5,
  },
  {
    id: "t2",
    date: "2023-12-01",
    description: "Rent Payment",
    category: "Housing",
    amount: -1200.0,
  },
  {
    id: "t3",
    date: "2023-12-14",
    description: "Coffee Shop",
    category: "Food & Dining",
    amount: -4.5,
  },
  {
    id: "t4",
    date: "2023-12-10",
    description: "Gas Station",
    category: "Transportation",
    amount: -45.0,
  },
  {
    id: "t5",
    date: "2023-12-05",
    description: "Streaming Service",
    category: "Entertainment",
    amount: -14.99,
  },
  {
    id: "t6",
    date: "2023-12-20",
    description: "Restaurant",
    category: "Food & Dining",
    amount: -85.75,
  },
  {
    id: "t7",
    date: "2023-12-18",
    description: "Electric Bill",
    category: "Utilities",
    amount: -95.2,
  },
  {
    id: "t8",
    date: "2023-12-22",
    description: "Online Shopping",
    category: "Shopping",
    amount: -65.99,
  },
  {
    id: "t9",
    date: "2023-12-03",
    description: "Phone Bill",
    category: "Utilities",
    amount: -75.0,
  },
  {
    id: "t10",
    date: "2023-12-28",
    description: "Pharmacy",
    category: "Health",
    amount: -32.5,
  },
]

export function TransactionsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{formatDate(row.getValue("date"))}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div className="font-medium">{row.getValue("description")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="justify-end w-full"
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"))
        return (
          <div className={`text-right font-medium ${amount < 0 ? "text-destructive" : "text-primary"}`}>
            {formatCurrency(amount)}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Edit Transaction</DropdownMenuItem>
              <DropdownMenuItem>Change Category</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete Transaction</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}{" "}
          of {table.getFilteredRowModel().rows.length} transactions
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
