"use client"

import { useState } from "react"
import { CalendarIcon, Filter, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export function TransactionFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [amount, setAmount] = useState<{
    min: string
    max: string
  }>({
    min: "",
    max: "",
  })

  const handleReset = () => {
    setSearchTerm("")
    setCategory("")
    setDateRange({ from: undefined, to: undefined })
    setAmount({ min: "", max: "" })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filters</h4>
                  <p className="text-sm text-muted-foreground">Narrow down transactions by specific criteria</p>
                </div>
                <Separator />
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="food">Food & Dining</SelectItem>
                      <SelectItem value="housing">Housing</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Date Range</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? format(dateRange.from, "PPP") : <span>From date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.to ? format(dateRange.to, "PPP") : <span>To date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Amount Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={amount.min}
                      onChange={(e) => setAmount({ ...amount, min: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={amount.max}
                      onChange={(e) => setAmount({ ...amount, max: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button size="sm">Apply Filters</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="default">Export</Button>
        </div>
      </div>

      {/* Active filters display */}
      {(category || dateRange.from || dateRange.to || amount.min || amount.max) && (
        <div className="flex flex-wrap gap-2">
          {category && (
            <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
              <span>Category: {category}</span>
              <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => setCategory("")}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {dateRange.from && (
            <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
              <span>From: {format(dateRange.from, "PP")}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4"
                onClick={() => setDateRange({ ...dateRange, from: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {dateRange.to && (
            <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
              <span>To: {format(dateRange.to, "PP")}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4"
                onClick={() => setDateRange({ ...dateRange, to: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {amount.min && (
            <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
              <span>Min: ${amount.min}</span>
              <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => setAmount({ ...amount, min: "" })}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {amount.max && (
            <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs">
              <span>Max: ${amount.max}</span>
              <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => setAmount({ ...amount, max: "" })}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={handleReset}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
