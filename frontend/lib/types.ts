export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category: string
  type: "debit" | "credit"
  currency: string
  file_id?: string
  created_at?: string
  user_id?: string
}

export interface CategoryRule {
  id?: string
  pattern: string
  category: string
  user_id?: string
  created_at?: string
}

export interface FileUpload {
  id: string
  filename: string
  uploaded_at: string
  row_count: number
  file_size: number
  user_id?: string
}

export type DateRange = {
  from: Date
  to?: Date
}

export type DateRangePreset = "7days" | "30days" | "90days" | "ytd" | "all"
