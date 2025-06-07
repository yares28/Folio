"use client"
import { useLayout } from "@/contexts/layout-context"
import { useTheme } from "@/contexts/theme-context"
import { Menu, Sun, Moon, Computer } from "lucide-react"
import DateRangePicker from "./date-range-picker"
import { useData } from "@/contexts/data-context"

export default function Header() {
  const { toggleSidebar, isMobile } = useLayout()
  const { theme, setTheme } = useTheme()
  const { dateRange, setDateRange } = useData()

  return (
    <header className="dashboard-header">
      <div className="flex items-center gap-4">
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
        )}
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <DateRangePicker value={dateRange} onChange={setDateRange} />

        <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-md">
          <button
            onClick={() => setTheme("light")}
            className={`p-2 ${theme === "light" ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300" : "hover:bg-neutral-100 dark:hover:bg-neutral-700"}`}
            aria-label="Light mode"
            aria-pressed={theme === "light"}
          >
            <Sun size={18} />
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`p-2 ${theme === "system" ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300" : "hover:bg-neutral-100 dark:hover:bg-neutral-700"}`}
            aria-label="System theme"
            aria-pressed={theme === "system"}
          >
            <Computer size={18} />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`p-2 ${theme === "dark" ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300" : "hover:bg-neutral-100 dark:hover:bg-neutral-700"}`}
            aria-label="Dark mode"
            aria-pressed={theme === "dark"}
          >
            <Moon size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
