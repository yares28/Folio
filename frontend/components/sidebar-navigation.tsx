"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { BarChart3, FileText, History, Home, LogOut, Menu, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { FileUploader } from "@/components/dashboard/file-uploader"
import { cn } from "@/lib/utils"
import type { CategoryRule } from "@/lib/types"

interface SidebarNavigationProps {
  categoryRules: CategoryRule[]
}

export function SidebarNavigation({ categoryRules }: SidebarNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  // Check if screen is mobile
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
      router.refresh()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: pathname === "/dashboard",
    },
    {
      name: "Transactions",
      href: "/dashboard/transactions",
      icon: FileText,
      current: pathname === "/dashboard/transactions",
    },
    {
      name: "Charts",
      href: "/dashboard/charts",
      icon: BarChart3,
      current: pathname === "/dashboard/charts",
    },
    {
      name: "History",
      href: "/dashboard/history",
      icon: History,
      current: pathname === "/dashboard/history",
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      current: pathname === "/dashboard/settings",
    },
  ]

  const NavItems = () => (
    <>
      <div className="flex flex-col gap-1 px-2">
        {navigation.map((item) => (
          <TooltipProvider key={item.name} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    item.current
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      <div className="mt-auto px-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span>Sign Out</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">Sign Out</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  )

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        <div className="fixed left-0 top-0 z-30 flex h-16 w-full items-center border-b bg-background px-4">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-64 flex-col p-0">
              <div className="flex h-16 items-center border-b px-4">
                <h2 className="text-lg font-semibold">Finance Dashboard</h2>
                <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <ScrollArea className="flex-1 px-2 py-4">
                <div className="mb-4 rounded-md border p-4">
                  <h3 className="mb-2 text-sm font-medium">Upload Files</h3>
                  <FileUploader categoryRules={categoryRules} compact />
                </div>
                <NavItems />
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold">Finance Dashboard</h1>
        </div>
        <div className="h-16" />
      </>
    )
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && <h2 className="text-lg font-semibold">Finance</h2>}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isCollapsed ? "mx-auto" : "ml-auto")}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-4 p-4">
          {!isCollapsed && (
            <div className="rounded-md border p-4">
              <h3 className="mb-2 text-sm font-medium">Upload Files</h3>
              <FileUploader categoryRules={categoryRules} compact />
            </div>
          )}
          <NavItems />
        </div>
      </ScrollArea>
    </div>
  )
}
