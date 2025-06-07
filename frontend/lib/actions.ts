"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Transaction } from "@/lib/types"

// Save uploaded file metadata
export async function saveFileUpload(filename: string, rowCount: number, fileSize: number) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("file_uploads")
    .insert({
      filename,
      row_count: rowCount,
      file_size: fileSize,
    })
    .select()
    .single()

  if (error) {
    console.error("Error saving file upload:", error)
    throw new Error("Failed to save file upload")
  }

  revalidatePath("/dashboard")
  return data.id
}

// Save transactions from uploaded file
export async function saveTransactions(transactions: Transaction[], fileId: string) {
  const supabase = createServerClient()

  // Format transactions for database insertion
  const formattedTransactions = transactions.map((transaction) => ({
    file_id: fileId,
    date: transaction.date,
    description: transaction.description,
    amount: transaction.amount,
    category: transaction.category,
  }))

  const { error } = await supabase.from("transactions").insert(formattedTransactions)

  if (error) {
    console.error("Error saving transactions:", error)
    throw new Error("Failed to save transactions")
  }

  revalidatePath("/dashboard")
  return true
}

// Get file upload history
export async function getFileUploads() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("file_uploads").select("*").order("uploaded_at", { ascending: false })

  if (error) {
    console.error("Error fetching file uploads:", error)
    throw new Error("Failed to fetch file uploads")
  }

  return data
}

// Get transactions by file ID
export async function getTransactionsByFileId(fileId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("transactions").select("*").eq("file_id", fileId)

  if (error) {
    console.error("Error fetching transactions:", error)
    throw new Error("Failed to fetch transactions")
  }

  return data
}

// Get transactions by date range
export async function getTransactionsByDateRange(startDate: string, endDate: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("transactions").select("*").gte("date", startDate).lte("date", endDate)

  if (error) {
    console.error("Error fetching transactions by date range:", error)
    throw new Error("Failed to fetch transactions by date range")
  }

  return data
}

// Update transaction category
export async function updateTransactionCategory(transactionId: string, category: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("transactions").update({ category }).eq("id", transactionId)

  if (error) {
    console.error("Error updating transaction category:", error)
    throw new Error("Failed to update transaction category")
  }

  revalidatePath("/dashboard")
  return true
}

// Delete file upload and its transactions
export async function deleteFileUpload(fileId: string) {
  const supabase = createServerClient()

  // Transactions will be deleted automatically due to ON DELETE CASCADE
  const { error } = await supabase.from("file_uploads").delete().eq("id", fileId)

  if (error) {
    console.error("Error deleting file upload:", error)
    throw new Error("Failed to delete file upload")
  }

  revalidatePath("/dashboard")
  return true
}

// Get category rules
export async function getCategoryRules() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("category_rules").select("*")

  if (error) {
    console.error("Error fetching category rules:", error)
    throw new Error("Failed to fetch category rules")
  }

  return data
}

// Save category rule
export async function saveCategoryRule(pattern: string, category: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("category_rules").insert({ pattern, category })

  if (error) {
    console.error("Error saving category rule:", error)
    throw new Error("Failed to save category rule")
  }

  revalidatePath("/dashboard")
  return true
}
