"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
}

export function FilterDrawer({ open, onClose }: FilterDrawerProps) {
  const [categories, setCategories] = useState({
    food: true,
    housing: true,
    transportation: true,
    entertainment: true,
    utilities: true,
    shopping: true,
    health: true,
    other: true,
  })

  const [amountRange, setAmountRange] = useState([0, 2000])
  const [sortBy, setSortBy] = useState("date-desc")
  const [currency, setCurrency] = useState("usd")

  const handleReset = () => {
    setCategories({
      food: true,
      housing: true,
      transportation: true,
      entertainment: true,
      utilities: true,
      shopping: true,
      health: true,
      other: true,
    })
    setAmountRange([0, 2000])
    setSortBy("date-desc")
    setCurrency("usd")
  }

  const handleApply = () => {
    // In a real app, this would apply the filters to the data
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:max-w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Customize your dashboard view with filters</SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="food"
                  checked={categories.food}
                  onCheckedChange={(checked) => setCategories({ ...categories, food: !!checked })}
                />
                <Label htmlFor="food">Food & Dining</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="housing"
                  checked={categories.housing}
                  onCheckedChange={(checked) => setCategories({ ...categories, housing: !!checked })}
                />
                <Label htmlFor="housing">Housing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="transportation"
                  checked={categories.transportation}
                  onCheckedChange={(checked) => setCategories({ ...categories, transportation: !!checked })}
                />
                <Label htmlFor="transportation">Transportation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="entertainment"
                  checked={categories.entertainment}
                  onCheckedChange={(checked) => setCategories({ ...categories, entertainment: !!checked })}
                />
                <Label htmlFor="entertainment">Entertainment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="utilities"
                  checked={categories.utilities}
                  onCheckedChange={(checked) => setCategories({ ...categories, utilities: !!checked })}
                />
                <Label htmlFor="utilities">Utilities</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shopping"
                  checked={categories.shopping}
                  onCheckedChange={(checked) => setCategories({ ...categories, shopping: !!checked })}
                />
                <Label htmlFor="shopping">Shopping</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="health"
                  checked={categories.health}
                  onCheckedChange={(checked) => setCategories({ ...categories, health: !!checked })}
                />
                <Label htmlFor="health">Health</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="other"
                  checked={categories.other}
                  onCheckedChange={(checked) => setCategories({ ...categories, other: !!checked })}
                />
                <Label htmlFor="other">Other</Label>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium">Amount Range</h3>
              <p className="text-sm text-muted-foreground">
                ${amountRange[0]} - ${amountRange[1]}
              </p>
            </div>
            <Slider defaultValue={amountRange} max={5000} step={50} onValueChange={setAmountRange} className="py-4" />
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Sort By</h3>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                <SelectItem value="amount-desc">Amount (Highest First)</SelectItem>
                <SelectItem value="amount-asc">Amount (Lowest First)</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Currency</h3>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="gbp">GBP (£)</SelectItem>
                <SelectItem value="jpy">JPY (¥)</SelectItem>
                <SelectItem value="cad">CAD (C$)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
