"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Calendar, Wrench } from "lucide-react"

interface StatsCardsProps {
    data: any
}

export function StatsCards({ data }: StatsCardsProps) {
    if (!data) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                            <div className="h-4 w-4 rounded-full bg-muted" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                <div className="h-8 w-24 rounded bg-muted" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const { totalRevenue, totalCustomers, totalAppointments, totalServices } = data

    const stats = [
        {
            title: "Total Revenue",
            value: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(totalRevenue || 0),
            description: "Revenue for the last 30 days",
            icon: DollarSign,
        },
        {
            title: "Customers",
            value: totalCustomers || 0,
            description: "Total customers",
            icon: Users,
        },
        {
            title: "Appointments",
            value: totalAppointments || 0,
            description: "Total appointments",
            icon: Calendar,
        },
        {
            title: "Services",
            value: totalServices || 0,
            description: "Total services",
            icon: Wrench,
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

