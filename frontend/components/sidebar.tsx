"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLayout } from "@/contexts/layout-context"
import { LayoutDashboard, BarChart3, PieChart, FileText, Upload, Settings, Menu, X } from "lucide-react"

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, isMobile } = useLayout()
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Transactions", href: "/transactions", icon: FileText },
    { name: "Charts", href: "/charts", icon: BarChart3 },
    { name: "Asset Allocation", href: "/allocation", icon: PieChart },
    { name: "Upload", href: "/upload", icon: Upload },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-10" onClick={toggleSidebar} aria-hidden="true" />
      )}

      <aside className={`sidebar ${!sidebarOpen ? "sidebar-collapsed" : ""}`} aria-label="Sidebar navigation">
        <div className="sidebar-header flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">Finance Dashboard</h1>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-content">
          <ul className="sidebar-nav">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`sidebar-nav-item ${isActive ? "sidebar-nav-item-active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile toggle button */}
      {isMobile && !sidebarOpen && (
        <button
          className="fixed bottom-4 right-4 p-3 bg-primary-600 text-white rounded-full shadow-lg z-10"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
      )}
    </>
  )
}
