"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface AppointmentChartProps {
    data: any[]
}

export function AppointmentChart({ data }: AppointmentChartProps) {
    const formattedData = data
        .map((item) => ({
            date: new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            appointments: item.appointments,
        }))
        .reverse()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Appointments</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        appointments: {
                            label: "Appointments",
                            color: "hsl(var(--chart-3))",
                        },
                    }}
                    className="h-[300px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line
                                type="monotone"
                                dataKey="appointments"
                                strokeWidth={2}
                                activeDot={{ r: 6 }}
                                stroke="var(--color-appointments)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

