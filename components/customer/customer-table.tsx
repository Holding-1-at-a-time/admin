"use client"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"

export function CustomerTable() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Parse search params
    const page = Number(searchParams.get("page") || "1")
    const pageSize = Number(searchParams.get("pageSize") || "10")
    const search = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Parse filters
    const status = searchParams.get("status") || undefined
    const createdAfter = searchParams.get("createdAfter") || undefined
    const createdBefore = searchParams.get("createdBefore") || undefined

    // Calculate pagination
    const skip = (page - 1) * pageSize

    // Fetch customers
    const customersData = useQuery(api.customers.getCustomers, {
        paginationOpts: {
            skip,
            take: pageSize,
        },
        search,
        filters: {
            status,
            createdAfter,
            createdBefore,
        },
        sortBy,
        sortOrder: sortOrder as "asc" | "desc",
    })

    // Handle sorting
    const handleSort = (column: string) => {
        const params = new URLSearchParams(searchParams)

        if (sortBy === column) {
            // Toggle sort order
            params.set("sortOrder", sortOrder === "asc" ? "desc" : "asc")
        } else {
            // Set new sort column
            params.set("sortBy", column)
            params.set("sortOrder", "asc")
        }

        // Reset to first page
        params.set("page", "1")

        router.push(`${pathname}?${params.toString()}`)
    }

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", newPage.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    // Calculate total pages
    const totalPages = customersData ? Math.ceil(customersData.totalCount / pageSize) : 0

    // Render loading state
    if (!customersData) {
        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: pageSize }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Skeleton className="h-5 w-32" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-40" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-24" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-16" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-5 w-24" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-8 w-8" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    // Render empty state
    if (customersData.customers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-semibold">No customers found</h3>
                <p className="text-muted-foreground">
                    {search || status || createdAfter || createdBefore
                        ? "Try adjusting your search or filters"
                        : "Get started by adding a new customer"}
                </p>
                {!(search || status || createdAfter || createdBefore) && (
                    <Link href="/customers/new" className="mt-4">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Customer
                        </Button>
                    </Link>
                )}
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                            <div className="flex items-center">
                                Name
                                {sortBy === "name" && (
                                    <span className="ml-1">
                                        {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                    </span>
                                )}
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                            <div className="flex items-center">
                                Email
                                {sortBy === "email" && (
                                    <span className="ml-1">
                                        {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                    </span>
                                )}
                            </div>
                        </TableHead>
                        <TableHead className="hidden md:table-cell">Phone</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                            <div className="flex items-center">
                                Status
                                {sortBy === "status" && (
                                    <span className="ml-1">
                                        {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                    </span>
                                )}
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer hidden md:table-cell" onClick={() => handleSort("createdAt")}>
                            <div className="flex items-center">
                                Created
                                {sortBy === "createdAt" && (
                                    <span className="ml-1">
                                        {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                    </span>
                                )}
                            </div>
                        </TableHead>
                        <TableHead className="w-12"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customersData.customers.map((customer) => (
                        <TableRow key={customer._id}>
                            <TableCell>
                                <Link href={`/customers/${customer._id}`} className="font-medium hover:underline">
                                    {customer.name}
                                </Link>
                            </TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell className="hidden md:table-cell">{customer.phone || "-"}</TableCell>
                            <TableCell>
                                <StatusBadge status={customer.status} />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{formatDate(new Date(customer.createdAt))}</TableCell>
                            <TableCell>
                                <CustomerActions customer={customer} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between  py-2 border-t">
                <div className="text-sm text-muted-foreground">
                    Showing {skip + 1}-{Math.min(skip + pageSize, customersData.totalCount)} of {customersData.totalCount}{" "}
                    customers
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm">
                        Page {page} of {totalPages}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case "active":
            return <Badge className="bg-green-500">Active</Badge>
        case "inactive":
            return <Badge variant="outline">Inactive</Badge>
        case "pending":
            return <Badge className="bg-yellow-500">Pending</Badge>
        default:
            return <Badge variant="secondary">{status}</Badge>
    }
}

function CustomerActions({ customer }: { customer: any }) {
    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`/customers/${customer._id}`)}>View details</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/customers/${customer._id}/edit`)}>
                    Edit customer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                        // Show confirmation dialog before deleting
                        if (window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
                            // Delete customer logic here
                        }
                    }}
                >
                    Delete customer
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

