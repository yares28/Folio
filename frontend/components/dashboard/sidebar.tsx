"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, CreditCard, Home, LineChart, PiggyBank, Upload, Moon, Sun, SettingsIcon, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserNav } from "@/components/user-nav"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()

  return (
    <div className={cn("pb-12 w-[280px] border-r bg-background", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">Finance Dashboard</h2>
          <div className="space-y-1">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant={pathname === "/dashboard/transactions" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/transactions">
                <CreditCard className="mr-2 h-4 w-4" />
                Transactions
              </Link>
            </Button>
            <Button
              variant={pathname === "/dashboard/charts" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/charts">
                <BarChart3 className="mr-2 h-4 w-4" />
                Charts
              </Link>
            </Button>
            <Button
              variant={pathname === "/dashboard/investments" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/investments">
                <LineChart className="mr-2 h-4 w-4" />
                Investments
              </Link>
            </Button>
            <Button
              variant={pathname === "/dashboard/budget" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/budget">
                <PiggyBank className="mr-2 h-4 w-4" />
                Budget
              </Link>
            </Button>
            <Button
              variant={pathname === "/dashboard/history" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/history">
                <Upload className="mr-2 h-4 w-4" />
                Upload History
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Settings</h2>
          <div className="space-y-1"></div>
        </div>
      </div>
      <div className="px-4 py-2 mt-auto">
        <div className="flex items-center justify-between gap-2">
          {/* User Nav on bottom left */}
          <UserNav />

          {/* Settings dropdown on bottom right */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => {
                  setTheme(theme === "light" ? "dark" : "light")
                }}
              >
                <Sun className="mr-2 h-4 w-4 dark:hidden" />
                <Moon className="mr-2 h-4 w-4 hidden dark:block" />
                <span className="dark:hidden">Switch to Dark Mode</span>
                <span className="hidden dark:block">Switch to Light Mode</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/team">
                  <Users className="mr-2 h-4 w-4" />
                  Team
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
