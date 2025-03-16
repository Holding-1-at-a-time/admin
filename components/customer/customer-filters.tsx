"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { debounce } from "lodash"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function CustomerFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Get current filter values from URL
    const currentSearch = searchParams.get("search") || ""
    const currentStatus = searchParams.get("status") || ""
    const currentCreatedAfter = searchParams.get("createdAfter") || ""
    const currentCreatedBefore = searchParams.get("createdBefore") || ""

    // Local state for search input
    const [searchValue, setSearchValue] = useState(currentSearch)

    // Count active filters
    const activeFilterCount = [currentStatus, currentCreatedAfter, currentCreatedBefore].filter(Boolean).length

    // Update URL with new search params
    const updateSearchParams = useCallback(
        (params: Record<string, string | null>) => {
            const newSearchParams = new URLSearchParams(searchParams)

            // Update search params
            Object.entries(params).forEach(([key, value]) => {
                if (value === null) {
                    newSearchParams.delete(key)
                } else {
                    newSearchParams.set(key, value)
                }
            })

            // Reset to first page
            newSearchParams.set("page", "1")

            router.push(`${pathname}?${newSearchParams.toString()}`)
        },
        [searchParams, pathname, router],
    )

    // Debounced search handler
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            updateSearchParams({ search: value || null })
        }, 300),
        [updateSearchParams],
    )

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchValue(value)
        debouncedSearch(value)
    }

    // Handle status change
    const handleStatusChange = (value: string) => {
        updateSearchParams({ status: value || null })
    }

    // Handle date range change
    const handleDateChange = (field: "createdAfter" | "createdBefore", date: Date | undefined) => {
        updateSearchParams({
            [field]: date ? format(date, "yyyy-MM-dd") : null,
        })
    }

    // Clear all filters
    const clearAllFilters = () => {
        const newSearchParams = new URLSearchParams()
        if (searchValue) {
            newSearchParams.set("search", searchValue)
        }
        newSearchParams.set("page", "1")
        router.push(`${pathname}?${newSearchParams.toString()}`)
    }

    // Load search value from URL on mount
    useEffect(() => {
        setSearchValue(currentSearch)
    }, [currentSearch])

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search customers..."
                    className="w-full pl-8"
                    value={searchValue}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9">
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                            {activeFilterCount > 0 && (
                                <Badge
                                    variant="secondary"
                                    className="ml-2 rounded-full px-1"
                                >
                                    {activeFilterCount}
                                </Badge>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium">Status</h4>
                                <Select
                                    value={currentStatus}
                                    onValueChange={handleStatusChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Any status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Any status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium">Created After</h4>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !currentCreatedAfter && "text-muted-foreground"
                                            )}
                                        >
                                            {currentCreatedAfter ? (
                                                format(new Date(currentCreatedAfter), "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={
                                                currentCreatedAfter
                                                    ? new Date(currentCreatedAfter)
                                                    : undefined
                                            }
                                            onSelect={(date) =>
                                                handleDateChange("createdAfter", date)
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium">Created Before</h4>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !currentCreatedBefore && "text-muted-foreground"
                                            )}
                                        >
                                            {currentCreatedBefore ? (
                                                format(new Date(currentCreatedBefore), "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={
                                                currentCreatedBefore
                                                    ? new Date(currentCreatedBefore)
                                                    : undefined
                                            }
                                            onSelect={(date) =>
                                                handleDateChange("createdBefore", date)
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {activeFilterCount > 0 && (
                                <Button
                                    variant="ghost"
                                    className="justify-start px-2 text-xs"
                                    onClick={clearAllFilters}
                                >
                                    <X className="mr-2 h-3 w-3" />
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>

                <Select
                    value={searchParams.get("pageSize") || "10"}
                    onValueChange={(value) => {
                        updateSearchParams({ pageSize: value });
                    }}
                >
                    <SelectTrigger className="h-9 w-[110pxpageSize: value});
          }}
        >
          <SelectTrigger className=\"h-9 w-[110px]">
                    <SelectValue placeholder="10 per page" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </div >
  )
}

