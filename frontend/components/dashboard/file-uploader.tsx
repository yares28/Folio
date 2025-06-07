"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = () => {
    if (files.length === 0) return

    setUploadStatus("uploading")
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadStatus("success")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const resetUploader = () => {
    setFiles([])
    setUploadStatus("idle")
    setUploadProgress(0)
    setErrorMessage("")
  }

  return (
    <div className="space-y-4">
      {uploadStatus === "idle" && (
        <div
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-10 transition-colors hover:border-muted-foreground/50"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Drag & drop your files</h3>
              <p className="text-sm text-muted-foreground">
                Upload CSV or Excel files containing your transaction data
              </p>
            </div>
            <div className="flex gap-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Select Files
                </span>
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".csv,.xlsx,.xls"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {files.length > 0 && uploadStatus === "idle" && (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Selected Files</div>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between rounded-md bg-muted p-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUpload}>Upload Files</Button>
          </div>
        </div>
      )}

      {uploadStatus === "uploading" && (
        <div className="space-y-4 rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Uploading {files.length} file(s)...</div>
            <div className="text-sm text-muted-foreground">{uploadProgress}%</div>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {uploadStatus === "success" && (
        <Alert variant="default" className="border-green-500 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Upload Complete</AlertTitle>
          <AlertDescription>Your files have been uploaded and processed successfully.</AlertDescription>
          <Button variant="outline" size="sm" className="mt-2" onClick={resetUploader}>
            Upload More Files
          </Button>
        </Alert>
      )}

      {uploadStatus === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Failed</AlertTitle>
          <AlertDescription>
            {errorMessage || "There was an error uploading your files. Please try again."}
          </AlertDescription>
          <Button variant="outline" size="sm" className="mt-2" onClick={resetUploader}>
            Try Again
          </Button>
        </Alert>
      )}

      <div className="text-xs text-muted-foreground">
        <p>Supported file formats: CSV, Excel (.xlsx, .xls)</p>
        <p>Maximum file size: 10MB</p>
      </div>
    </div>
  )
}
