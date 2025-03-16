"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export function CustomerExport() {
    
    const [isExporting, setIsExporting] = useState(false)

    // Get all customers for export
    const allCustomers = useQuery(api.customers.getCustomers, {
        paginationOpts: {
            skip: 0,
            take: 1000, // Adjust based on your needs
        },
    })

    const handleExport = async (format: "csv" | "json") => {
        if (!allCustomers || !allCustomers.customers.length) {
            toast({
                title: "No data to export",
                description: "There are no customers to export.",
                variant: "destructive",
            })
            return
        }

        try {
            setIsExporting(true)

            // Prepare data for export
            const customers = allCustomers.customers.map((customer) => ({
                name: customer.name,
                email: customer.email,
                phone: customer.phone || "",
                address: customer.address || "",
                status: customer.status,
                createdAt: new Date(customer.createdAt).toISOString(),
                updatedAt: new Date(customer.updatedAt).toISOString(),
            }))

            if (format === "csv") {
                // Generate CSV
                const headers = Object.keys(customers[0]).join(",")
                const rows = customers.map((customer) =>
                    Object.values(customer)
                        .map((value) => `"${value}"`)
                        .join(","),
                )
                const csv = [headers, ...rows].join("\n")

                // Download CSV
                downloadFile(csv, "customers.csv", "text/csv")
            } else {
                // Generate JSON
                const json = JSON.stringify(customers, null, 2)

                // Download JSON
                downloadFile(json, "customers.json", "application/json")
            }

            toast({
                title: "Export successful",
                description: `Customers exported as ${format.toUpperCase()} successfully.`,
            })
        } catch (error) {
            toast({
                title: "Export failed",
                description: "Failed to export customers. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsExporting(false)
        }
    }

    // Helper function to download file
    const downloadFile = (content: string, fileName: string, contentType: string) => {
        const blob = new Blob([content], { type: contentType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={isExporting}>
                    {isExporting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Exporting...
                        </>
                    ) : (
                        <>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("json")}>Export as JSON</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

