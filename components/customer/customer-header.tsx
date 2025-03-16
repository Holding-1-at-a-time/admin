"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CustomerExport } from "./customer-export"

export function CustomerHeader() {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
                <p className="text-muted-foreground">Manage your customer database and interactions.</p>
            </div>
            <div className="flex items-center gap-2">
                <CustomerExport />
                <Link href="/customers/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Customer
                    </Button>
                </Link>
            </div>
        </div>
    )
}

