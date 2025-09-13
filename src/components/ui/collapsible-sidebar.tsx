"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "@/contexts/ThemeContext"
import { useAuth } from "@/contexts/AuthContext"
import {
  BarChart3,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  LogOut,
  Menu,
  Moon,
  PieChart,
  Receipt,
  Settings,
  Sun,
  Users,
  Wallet,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { auth } from "@/lib/firebase"

interface SidebarProps {
  className?: string
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Sales",
    icon: Receipt,
    children: [
      {
        title: "Invoices",
        href: "/invoices",
        icon: Receipt,
      },
      {
        title: "Quotes",
        href: "/quotes",
        icon: FileText,
      },
      {
        title: "Payments",
        href: "/payments",
        icon: Wallet,
      },
      {
        title: "Products & Services",
        href: "/products-services",
        icon: BarChart3,
      },
      {
        title: "Customers",
        href: "/customers",
        icon: Users,
      },
    ]
  },
  {
    title: "Purchases",
    icon: Receipt,
    children: [
      {
        title: "Invoices",
        href: "/purchase-invoices",
        icon: Receipt,
      },
      {
        title: "Products & Services",
        href: "/purchase-products-services",
        icon: BarChart3,
      },
      {
        title: "Suppliers",
        href: "/suppliers",
        icon: Users,
      },
    ]
  },
  {
    title: "Reports",
    href: "/reports",
    icon: PieChart,
  },
  {
    title: "Company",
    href: "/company",
    icon: Building2,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function CollapsibleSidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [openSections, setOpenSections] = React.useState<{ [key: string]: boolean }>({
    Sales: true,
    Purchases: true,
  })
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { user, tenantId } = useAuth()

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex md:flex-col md:fixed md:inset-y-0 md:z-50 transition-all duration-300 ease-in-out",
          isCollapsed ? "md:w-16" : "md:w-64",
          className
        )}
      >
        <div className="flex flex-col flex-grow border-r bg-background">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <Receipt className="h-6 w-6" />
                <span className="font-semibold">DijiInvoice</span>
              </div>
            )}
            <div className="flex items-center space-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-8 w-8 p-0"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8 p-0 bg-input hover:bg-primary"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                if (item.children) {
                  const isSectionOpen = openSections[item.title]
                  const hasActiveChild = item.children.some(child => pathname === child.href)
                  return (
                    <Collapsible key={item.title} open={isSectionOpen} onOpenChange={() => toggleSection(item.title)}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start",
                            isCollapsed ? "px-2" : "px-3",
                            hasActiveChild && "bg-secondary/50"
                          )}
                        >
                          <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                          {!isCollapsed && (
                            <>
                              <span>{item.title}</span>
                              <ChevronDown className={cn("h-4 w-4 ml-auto transition-transform", isSectionOpen ? "rotate-180" : "")} />
                            </>
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      {!isCollapsed && (
                        <CollapsibleContent className="space-y-1 ml-6">
                          {item.children.map((child) => {
                            const isActive = pathname === child.href
                            return (
                              <Link key={child.href} href={child.href}>
                                <Button
                                  variant={isActive ? "secondary" : "ghost"}
                                  size="sm"
                                  className={cn(
                                    "w-full justify-start px-2",
                                    isActive && "bg-secondary"
                                  )}
                                >
                                  <child.icon className="h-3 w-3 mr-2" />
                                  <span className="text-sm">{child.title}</span>
                                </Button>
                              </Link>
                            )
                          })}
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  )
                } else {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href!}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          isCollapsed ? "px-2" : "px-3",
                          isActive && "bg-secondary"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Button>
                    </Link>
                  )
                }
              })}
            </nav>
          </ScrollArea>

          {/* Profile Footer */}
          {user && (
            <div className="border-t p-4">
              {!isCollapsed ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.displayName || user.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Company: {tenantId?.substring(0, 8)}...
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="h-8 w-8 p-0"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="h-8 w-8 p-0"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden fixed top-4 left-4 z-40 h-10 w-10 p-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Receipt className="h-6 w-6" />
                <span className="font-semibold">DijiInvoice</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-8 w-8 p-0"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  if (item.children) {
                    const isSectionOpen = openSections[item.title]
                    const hasActiveChild = item.children.some(child => pathname === child.href)
                    return (
                      <Collapsible key={item.title} open={isSectionOpen} onOpenChange={() => toggleSection(item.title)}>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start px-3",
                              hasActiveChild && "bg-secondary/50"
                            )}
                          >
                            <item.icon className="h-4 w-4 mr-3" />
                            <span>{item.title}</span>
                            <ChevronDown className={cn("h-4 w-4 ml-auto transition-transform", isSectionOpen ? "rotate-180" : "")} />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-1 ml-6">
                          {item.children.map((child) => {
                            const isActive = pathname === child.href
                            return (
                              <Link key={child.href} href={child.href}>
                                <Button
                                  variant={isActive ? "secondary" : "ghost"}
                                  size="sm"
                                  className={cn(
                                    "w-full justify-start px-2",
                                    isActive && "bg-secondary"
                                  )}
                                >
                                  <child.icon className="h-3 w-3 mr-2" />
                                  <span className="text-sm">{child.title}</span>
                                </Button>
                              </Link>
                            )
                          })}
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  } else {
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.href} href={item.href!}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start px-3",
                            isActive && "bg-secondary"
                          )}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          <span>{item.title}</span>
                        </Button>
                      </Link>
                    )
                  }
                })}
              </nav>
            </ScrollArea>

            {/* Profile Footer */}
            {user && (
              <div className="border-t p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-medium">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.displayName || user.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Company: {tenantId?.substring(0, 8)}...
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="h-8 w-8 p-0"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}