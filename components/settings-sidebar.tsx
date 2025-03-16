"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Building, Palette, Clock, Package, Users, Shield, CreditCard, Bell, Mail } from "lucide-react"

interface SettingsNavProps extends React.HTMLAttributes<HTMLElement> { }

export function SettingsSidebar({ className, ...props }: SettingsNavProps) {
    const pathname = usePathname()

    const navItems = [
        {
            title: "Business",
            href: "/settings/business",
            icon: Building,
            description: "Manage your business information",
        },
        {
            title: "Branding",
            href: "/settings/branding",
            icon: Palette,
            description: "Customize your brand appearance",
        },
        {
            title: "Business Hours",
            href: "/settings/hours",
            icon: Clock,
            description: "Set your operating hours",
        },
        {
            title: "Services",
            href: "/settings/services",
            icon: Package,
            description: "Manage your service catalog",
        },
        {
            title: "Team",
            href: "/settings/team",
            icon: Users,
            description: "Manage your team members",
        },
        {
            title: "Roles & Permissions",
            href: "/settings/roles",
            icon: Shield,
            description: "Configure user roles and permissions",
        },
        {
            title: "Billing",
            href: "/settings/billing",
            icon: CreditCard,
            description: "Manage your subscription and billing",
        },
        {
            title: "Notifications",
            href: "/settings/notifications",
            icon: Bell,
            description: "Configure notification preferences",
        },
        {
            title: "Email Templates",
            href: "/settings/email-templates",
            icon: Mail,
            description: "Customize your email templates",
        },
    ]

    return (
        <nav className={cn("flex flex-col space-y-1", className)} {...props}>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
                        "justify-start",
                    )}
                >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                </Link>
            ))}
        </nav>
    )
}

