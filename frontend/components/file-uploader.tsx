"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"

export default function FileUploader() {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [fileName, setFileName] = useState("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setFileName(file.name)
    setUploadStatus("uploading")
    setUploadProgress(0)

    // Simulate file upload with progress
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

    // Simulate processing delay after upload completes
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)
      setUploadStatus("success")
    }, 3000)
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/json": [".json"],
    },
    maxSize: 10485760, // 10MB
    multiple: false,
    disabled: uploadStatus === "uploading",
  })

  const resetUploader = () => {
    setUploadStatus("idle")
    setUploadProgress(0)
    setFileName("")
    setErrorMessage("")
  }

  return (
    <div className="mb-8">
      <div
        {...getRootProps()}
        className={`file-upload ${isDragActive ? "file-upload-active" : ""} ${
          isDragAccept ? "border-success-500 bg-success-50 dark:bg-success-900/20" : ""
        } ${isDragReject ? "border-danger-500 bg-danger-50 dark:bg-danger-900/20" : ""} ${
          uploadStatus === "uploading" ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : ""
        } ${uploadStatus === "success" ? "border-success-500 bg-success-50 dark:bg-success-900/20" : ""} ${
          uploadStatus === "error" ? "border-danger-500 bg-danger-50 dark:bg-danger-900/20" : ""
        }`}
      >
        <input {...getInputProps()} />

        <div className="file-upload-content">
          {uploadStatus === "idle" && (
            <>
              <Upload className={`file-upload-icon ${isDragActive ? "transform -translate-y-2" : ""}`} size={48} />
              <h3 className="file-upload-title">
                {isDragActive ? "Drop your file here..." : "Drag & drop your financial data file"}
              </h3>
              <p className="file-upload-description">Supports CSV, XLSX, and JSON formats (max 10MB)</p>
            </>
          )}

          {uploadStatus === "uploading" && (
            <>
              <FileText className="file-upload-icon animate-bounce" size={48} />
              <h3 className="file-upload-title">Uploading {fileName}</h3>
              <div className="file-upload-progress">
                <div
                  className="file-upload-progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                  role="progressbar"
                  aria-valuenow={uploadProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <p className="file-upload-description">{uploadProgress}% complete</p>
            </>
          )}

          {uploadStatus === "success" && (
            <>
              <CheckCircle className="file-upload-icon text-success-500" size={48} />
              <h3 className="file-upload-title">Upload Complete!</h3>
              <p className="file-upload-description">Successfully processed {fileName}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  resetUploader()
                }}
                className="mt-2 px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors"
              >
                Upload Another File
              </button>
            </>
          )}

          {uploadStatus === "error" && (
            <>
              <AlertCircle className="file-upload-icon text-danger-500" size={48} />
              <h3 className="file-upload-title">Upload Failed</h3>
              <p className="file-upload-description text-danger-700 dark:text-danger-400">
                {errorMessage || "There was an error processing your file."}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  resetUploader()
                }}
                className="mt-2 px-4 py-2 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
