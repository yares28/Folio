"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/dashboard/date-range-picker"
import type { DateRange } from "@/lib/types"
import { BarChart3, CreditCard, Download, Home, Menu, Settings, Upload, X } from "lucide-react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useData } from "@/contexts/data-context"

export function Header() {
  const pathname = usePathname()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { searchQuery, setSearchQuery } = useData()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/transactions",
      label: "Transactions",
      icon: CreditCard,
      active: pathname === "/dashboard/transactions",
    },
    {
      href: "/dashboard/reports",
      label: "Reports",
      icon: BarChart3,
      active: pathname === "/dashboard/reports",
    },
    {
      href: "/dashboard/import",
      label: "Import",
      icon: Upload,
      active: pathname === "/dashboard/import",
    },
    {
      href: "/dashboard/export",
      label: "Export",
      icon: Download,
      active: pathname === "/dashboard/export",
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <span className="text-lg font-bold">Finance Portal</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
        <div className="w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-lg font-bold">Finance Portal</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="grid gap-2 p-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  route.active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
            <div className="mt-4 border-t pt-4">
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
