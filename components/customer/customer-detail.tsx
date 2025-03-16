"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import { ArrowLeft, Edit, Trash2, Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import { CustomerInteractionForm } from "./customer-interaction-form"
import { CustomerTimeline } from "./customer-timeline"
import { CustomerAppointments } from "./customer-appointments"
import { toast } from "sonner"

export function CustomerDetail({ id }: { id: string }) {
    const router = useRouter()
    const { user } = useUser()
    
    const [activeTab, setActiveTab] = useState("overview")

    const customer = useQuery(api.customers.getCustomerById, {
        id: id as Id<"customers">,
    })

    const deleteCustomer = useMutation(api.customers.deleteCustomer)

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
            try {
                await deleteCustomer({ id: id as Id<"customers"> })
                toast({
                    title: "Customer deleted",
                    description: "The customer has been deleted successfully.",
                })
                router.push("/customers")
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to delete customer. Please try again.",
                    variant: "destructive",
                })
            }
        }
    }

    if (!customer) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/customers">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Skeleton className="h-8 w-48" />
                    </div>
                    <div className="flex space-x-2">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                </div>

                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="interactions">Interactions</TabsTrigger>
                        <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="mt-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Customer Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="flex items-center space-x-2">
                                            <Skeleton className="h-4 w-4" />
                                            <Skeleton className="h-4 w-full" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="mb-4">
                                            <Skeleton className="h-5 w-32 mb-2" />
                                            <Skeleton className="h-4 w-full" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/customers">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">{customer.name}</h1>
                    <Badge
                        className={cn(
                            customer.status === "active" && "bg-green-500",
                            customer.status === "inactive" && "bg-gray-500",
                            customer.status === "pending" && "bg-yellow-500",
                        )}
                    >
                        {customer.status}
                    </Badge>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" asChild>
                        <Link href={`/customers/${id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="interactions">Interactions</TabsTrigger>
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{customer.email}</span>
                                </div>
                                {customer.phone && (
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{customer.phone}</span>
                                    </div>
                                )}
                                {customer.address && (
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{customer.address}</span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>Customer since {formatDate(new Date(customer.createdAt))}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {customer.interactions && customer.interactions.length > 0 ? (
                                    <div className="space-y-4">
                                        {customer.interactions.slice(0, 3).map((interaction) => (
                                            <div key={interaction._id} className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="outline">{interaction.type}</Badge>
                                                        <span className="text-sm text-muted-foreground">
                                                            {formatDate(new Date(interaction.createdAt))}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-sm">{interaction.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground">No recent interactions</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button variant="ghost" className="w-full" onClick={() => setActiveTab("interactions")}>
                                    View all interactions
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {customer.notes && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{customer.notes}</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="interactions" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <CustomerTimeline interactions={customer.interactions || []} />
                        </div>
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Add Interaction</CardTitle>
                                    <CardDescription>Log a new interaction with this customer</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <CustomerInteractionForm customerId={id as Id<"customers">} userId={user?.id || ""} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="appointments" className="mt-6">
                    <CustomerAppointments appointments={customer.appointments || []} customerId={id as Id<"customers">} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

// Helper function for className conditionals
function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(" ")
}

