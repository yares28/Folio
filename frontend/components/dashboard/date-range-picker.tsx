"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DatePickerWithRangeProps {
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  className?: string
}

export function DatePickerWithRange({ date, setDate, className }: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handlePresetChange = (preset: string) => {
    const today = new Date()
    let startDate: Date
    const endDate = today

    switch (preset) {
      case "7days":
        startDate = new Date()
        startDate.setDate(today.getDate() - 7)
        break
      case "30days":
        startDate = new Date()
        startDate.setDate(today.getDate() - 30)
        break
      case "90days":
        startDate = new Date()
        startDate.setDate(today.getDate() - 90)
        break
      case "ytd":
        startDate = new Date(today.getFullYear(), 0, 1) // January 1st of current year
        break
      default: // "all"
        startDate = new Date(2000, 0, 1) // Far in the past
        break
    }

    setDate({ from: startDate, to: endDate })
    setIsOpen(false)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[260px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex items-center justify-between space-x-2 border-b p-3">
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            className="p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
