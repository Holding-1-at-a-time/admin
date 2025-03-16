"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../convex/_generated/api"
import type { Id } from "../convex/_generated/dataModel"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Plus, Edit, Trash2, Check, X, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import { Badge } from "./ui/badge"
import { formatCurrency } from "@/lib/utils"
import { TableBody, TableHead } from "./ui/table"

// Form validation schema
const serviceFormSchema = z.object({
    name: z.string().min(2, "Service name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    duration: z.coerce.number().min(5, "Duration must be at least 5 minutes"),
    category: z.string().min(1, "Category is required"),
    isActive: z.boolean().default(true),
})

interface Toast{
tittle: string;
message: string;
type: string;
}


// Service categories
const serviceCategories = ["Maintenance", "Repair", "Inspection", "Consultation", "Installation", "Other"]

export function ServiceCatalog() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingServiceId, setEditingServiceId] = useState<Id<"services"> | null>(null)

    // Fetch services
    const services = useQuery(api.settings.getServices)

    // Service mutations
    const createService = useMutation(api.settings.createService)
    const updateService = useMutation(api.settings.updateService)
    const deleteService = useMutation(api.settings.deleteService)

    // Initialize form
    const form = useForm<z.infer<typeof serviceFormSchema>>({
        resolver: zodResolver(serviceFormSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            duration: 60,
            category: "",
            isActive: true,
        },
    })

    // Handle dialog open for new service
    const handleNewService = () => {
        setEditingServiceId(null)
        form.reset({
            name: "",
            description: "",
            price: 0,
            duration: 60,
            category: "",
            isActive: true,
        })
        setIsDialogOpen(true)
    }

    // Handle dialog open for editing service
    const handleEditService = (service: any) => {
        setEditingServiceId(service._id)
        form.reset({
            name: service.name,
            description: service.description,
            price: service.price,
            duration: service.duration,
            category: service.category,
            isActive: service.isActive,
        })
        setIsDialogOpen(true)
    }

    // Handle form submission
    const onSubmit = async (values: z.infer<typeof serviceFormSchema>) => {
        try {
            setIsSubmitting(true)

            if (editingServiceId) {
                // Update existing service
                await updateService({
                    id: editingServiceId,
                    ...values,
                })

                toast({
                    title: "Service updated",
                    description: "The service has been updated successfully.",
                })
            } else {
                // Create new service
                await createService(values)

                toast({
                    title:"Service created",
                    description: "The new service has been created successfully.",
                })
            }

            setIsDialogOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save service. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle service deletion
    const handleDeleteService = async (id: Id<"services">) => {
        if (window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
            try {
                await deleteService({ id })

                toast({
                    title: "Service deleted",
                    description: "The service has been deleted successfully.",
                })
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.message || "Failed to delete service. Please try again.",
                    variant: "destructive",
                })
            }
        }
    }

    // Handle toggle service active status
    const handleToggleActive = async (service: any) => {
        try {
            await updateService({
                id: service._id,
                isActive: !service.isActive,
            })

            toast({
                title: `Service ${service.isActive ? "deactivated" : "activated"}`,
                description: `The service has been ${service.isActive ? "deactivated" : "activated"} successfully.`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update service status. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (!services) {
        return (
            <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={handleNewService}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <p className="text-muted-foreground">No services found. Add your first service to get started.</p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                services.map((service) => (
                                    <TableRow key={service._id}>
                                        <TableCell className="font-medium">{service.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{service.category}</Badge>
                                        </TableCell>
                                        <TableCell>{formatCurrency(service.price)}</TableCell>
                                        <TableCell>{service.duration} min</TableCell>
                                        <TableCell>
                                            <Badge variant={service.isActive ? "default" : "secondary"}>
                                                {service.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleToggleActive(service)}
                                                    title={service.isActive ? "Deactivate" : "Activate"}
                                                >
                                                    {service.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleEditService(service)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service._id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingServiceId ? "Edit Service" : "Add New Service"}</DialogTitle>
                        <DialogDescription>
                            {editingServiceId ? "Update the details of this service" : "Add a new service to your catalog"}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Service Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {serviceCategories.map((category) => (
                                                        <SelectItem key={category} value={category}>
                                                            {category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input type="number" step="0.01" min="0" className="pl-8" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duration (minutes)</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input type="number" min="5" step="5" className="pl-8" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea rows={3} {...field} />
                                        </FormControl>
                                        <FormDescription>Detailed description of the service</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Active</FormLabel>
                                            <FormDescription>Make this service available for booking</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Service"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

