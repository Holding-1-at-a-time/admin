"use client"

import { useEffect, useState } from "react"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { toast } from "sonner"
import { AppointmentChart } from "../charts/appointment-chart"
import { CustomerChart } from "../charts/customer-chart"
import { RevenueChart } from "../charts/revenue-chart"
import { ServiceChart } from "../charts/service-chart"
import { StatsCards } from "../stats-cards"
import { WidthProvider, Responsive } from 'react-grid-layout';

const ResponsiveGridLayout = WidthProvider(Responsive)

const defaultLayouts = {
    lg: [
        { i: "stats", x: 0, y: 0, w: 12, h: 2, minH: 2, maxH: 2 },
        { i: "revenue", x: 0, y: 2, w: 6, h: 8 },
        { i: "customers", x: 6, y: 2, w: 6, h: 8 },
        { i: "appointments", x: 0, y: 10, w: 6, h: 8 },
        { i: "services", x: 6, y: 10, w: 6, h: 8 },
    ],
    md: [
        { i: "stats", x: 0, y: 0, w: 8, h: 2, minH: 2, maxH: 2 },
        { i: "revenue", x: 0, y: 2, w: 8, h: 8 },
        { i: "customers", x: 0, y: 10, w: 8, h: 8 },
        { i: "appointments", x: 0, y: 18, w: 8, h: 8 },
        { i: "services", x: 0, y: 26, w: 8, h: 8 },
    ],
    sm: [
        { i: "stats", x: 0, y: 0, w: 6, h: 2, minH: 2, maxH: 2 },
        { i: "revenue", x: 0, y: 2, w: 6, h: 8 },
        { i: "customers", x: 0, y: 10, w: 6, h: 8 },
        { i: "appointments", x: 0, y: 18, w: 6, h: 8 },
        { i: "services", x: 0, y: 26, w: 6, h: 8 },
    ],
}

export function DashboardGrid() {
    const { user } = useUser()
    const [layouts, setLayouts] = useState(defaultLayouts)
    const [currentBreakpoint, setCurrentBreakpoint] = useState("lg")
    const [mounted, setMounted] = useState(false)

    const dashboardStats = useQuery(api.analytics.getDashboardStats)
    const savedLayout = useQuery(api.dashboard.getDashboardLayout, {
        userId: user?.id || "",
    })
    \
    const saveDashboardLayout = useMutation(api.dashboard.  {
        userId: user?.id || "",
    });
    const saveDashboardLayout = useMutation(api.dashboard.saveDashboardLayout)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (savedLayout && user) {
            if (savedLayout.layout) {
                setLayouts({
                    ...layouts,
                    [currentBreakpoint]: savedLayout.layout,
                })
            }
        }
    }, [savedLayout, user, currentBreakpoint])

    const handleLayoutChange = (layout: any, layouts: any) => {
        setLayouts(layouts)
    }

    const handleSaveLayout = () => {
        if (user) {
            saveDashboardLayout({
                userId: user.id,
                layout: layouts[currentBreakpoint],
            }).then(() => {
                toast({
                    title: "Layout saved",
                    description: "Your dashboard layout has been saved.",
                })
            })
        }
    }

    const handleBreakpointChange = (breakpoint: string) => {
        setCurrentBreakpoint(breakpoint)
    }

    if (!mounted) return null

    return (
        <div className="mt-4">
            <div className="flex justify-end mb-4">
                <Button onClick={handleSaveLayout}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Layout
                </Button>
            </div>
            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={50}
                onLayoutChange={handleLayoutChange}
                onBreakpointChange={handleBreakpointChange}
                isDraggable
                isResizable
            >
                <div key="stats" className="bg-card rounded-lg shadow p-4">
                    <StatsCards data={dashboardStats} />
                </div>
                <div key="revenue" className="bg-card rounded-lg shadow p-4">
                    <RevenueChart data={dashboardStats?.recentAnalytics || []} />
                </div>
                <div key="customers" className="bg-card rounded-lg shadow p-4">
                    <CustomerChart data={dashboardStats?.recentAnalytics || []} />
                </div>
                <div key="appointments" className="bg-card rounded-lg shadow p-4">
                    <AppointmentChart data={dashboardStats?.recentAnalytics || []} />
                </div>
                <div key="services" className="bg-card rounded-lg shadow p-4">
                    <ServiceChart data={dashboardStats?.recentAnalytics || []} />
                </div>
            </ResponsiveGridLayout>
        </div>
    )
}

