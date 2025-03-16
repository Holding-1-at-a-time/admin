"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Settings, ChevronDown, ChevronRight, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    submenu: [
      { title: "Overview", href: "/dashboard" },
      { title: "Analytics", href: "/dashboard/analytics" },
    ],
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
    submenu: [
      { title: "All Customers", href: "/customers" },
      { title: "Add Customer", href: "/customers/new" },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    submenu: [
      { title: "Branding", href: "/settings/branding" },
      { title: "Business", href: "/settings/business" },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
  const { signOut } = useClerk()
  const router = useRouter()

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const handleSignOut = () => {
    signOut(() => router.push("/"))
  }

  return (
    <div className="w-64 h-full bg-card border-r flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Admin Portal</h1>
      </div>
      <nav className="flex-1 overflow-auto p-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.title}>
              <Collapsible open={openMenus[item.title]} onOpenChange={() => toggleMenu(item.title)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start", pathname.startsWith(item.href) && "bg-accent")}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                    {openMenus[item.title] ? (
                      <ChevronDown className="ml-auto h-4 w-4" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="pl-6 pt-1 space-y-1">
                    {item.submenu.map((subitem) => (
                      <li key={subitem.title}>
                        <Link href={subitem.href}>
                          <Button
                            variant="ghost"
                            className={cn("w-full justify-start", pathname === subitem.href && "bg-accent")}
                          >
                            {subitem.title}
                          </Button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

