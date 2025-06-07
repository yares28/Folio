"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { FileIcon, FileTextIcon, Trash2Icon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { getFileUploads, deleteFileUpload } from "@/lib/actions"
import type { FileUpload } from "@/lib/types"

export default function HistoryPage() {
  const [fileUploads, setFileUploads] = useState<FileUpload[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function loadFileUploads() {
      try {
        const data = await getFileUploads()
        setFileUploads(data)
      } catch (error) {
        console.error("Failed to load file uploads:", error)
        toast({
          title: "Error",
          description: "Failed to load file history",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadFileUploads()
  }, [toast])

  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteFileUpload(fileId)
      setFileUploads(fileUploads.filter((file) => file.id !== fileId))
      toast({
        title: "File deleted",
        description: "The file and its transactions have been deleted",
      })
    } catch (error) {
      console.error("Failed to delete file:", error)
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      })
    }
  }

  const handleLoadFile = (fileId: string) => {
    router.push(`/dashboard/transactions?fileId=${fileId}`)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload History</h1>
        <p className="text-muted-foreground">View and manage your uploaded files</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>File History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : fileUploads.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground">No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fileUploads.map((file) => (
                <div
                  key={file.id}
                  className="group rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-primary/10 p-2">
                        <FileTextIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium">{file.filename}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(file.uploaded_at), "MMMM d, yyyy h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{file.row_count} transactions</span>
                    <span>{formatFileSize(file.file_size)}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleLoadFile(file.id)}
                    >
                      <FileIcon className="h-4 w-4" />
                      <span>View Transactions</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
