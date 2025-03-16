"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface CustomerChartProps {
  data: any[]
}

export function CustomerChart({ data }: CustomerChartProps) {
  const formattedData = data
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      customers: item.customers,
    }))
    .reverse()

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            customers: {
              label: "Customers",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="customers" fill="var(--color-customers)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

