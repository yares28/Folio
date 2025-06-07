"use client"

import { useState } from "react"
import { Calendar, ChevronDown } from "lucide-react"
import { format } from "date-fns"

interface DateRangePickerProps {
  value: [Date | null, Date | null]
  onChange: (value: [Date | null, Date | null]) => void
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [startDate, endDate] = value

  const presets = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 90 days", days: 90 },
    { label: "Year to date", days: "ytd" },
    { label: "All time", days: "all" },
  ]

  const handlePresetClick = (preset: { days: number | string }) => {
    const end = new Date()
    let start: Date | null = null

    if (preset.days === "ytd") {
      start = new Date(end.getFullYear(), 0, 1) // January 1st of current year
    } else if (preset.days === "all") {
      start = null // No start date means all time
    } else if (typeof preset.days === "number") {
      start = new Date()
      start.setDate(end.getDate() - preset.days)
    }

    onChange([start, end])
    setIsOpen(false)
  }

  const displayText =
    startDate && endDate ? `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}` : "All time"

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Calendar size={16} />
        <span>{displayText}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg z-10">
          <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Date Range</h3>
          </div>
          <div className="p-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
