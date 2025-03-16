"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import type { Id } from "../convex/_generated/dataModel"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Plus, Edit, Trash2, Shield, Badge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion"
import { Checkbox } from "@radix-ui/react-checkbox"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog"
import { TooltipProvider, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip"
import { Tooltip } from "recharts"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card"
import { DialogHeader, DialogFooter } from "./ui/dialog"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "./ui/form"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { Toast } from "@radix-ui/react-toast"


// Form validation schema
const roleFormSchema = z.object({
    name: z.string().min(2, "Role name must be at least 2 characters"),
    description: z.string().optional(),
    permissions: z.array(z.string()),
})

// Available permissions by category
const permissionsByCategory = {
    dashboard: [{ id: "dashboard:view", label: "View Dashboard" }],
    customers: [
        { id: "customers:view", label: "View Customers" },
        { id: "customers:create", label: "Create Customers" },
        { id: "customers:edit", label: "Edit Customers" },
        { id: "customers:delete", label: "Delete Customers" },
    ],
    services: [
        { id: "services:view", label: "View Services" },
        { id: "services:create", label: "Create Services" },
        { id: "services:edit", label: "Edit Services" },
        { id: "services:delete", label: "Delete Services" },
    ],
    appointments: [
        { id: "appointments:view", label: "View Appointments" },
        { id: "appointments:create", label: "Create Appointments" },
        { id: "appointments:edit", label: "Edit Appointments" },
        { id: "appointments:delete", label: "Delete Appointments" },
    ],
    settings: [
        { id: "settings:view", label: "View Settings" },
        { id: "settings:edit", label: "Edit Settings" },
    ],
}

export function RolesPermissionsManager() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingRoleId, setEditingRoleId] = useState<Id<"userRoles"> | null>(null)

    // Fetch roles
    const roles = useQuery(api.settings.getUserRoles)

    // Role mutations
    const createUserRole = useMutation(api.settings.createUserRole)
    const updateUserRole = useMutation(api.settings.updateUserRole)
    const deleteUserRole = useMutation(api.settings.deleteUserRole)

    // Initialize form
    const form = useForm<z.infer<typeof roleFormSchema>>({
        resolver: zodResolver(roleFormSchema),
        defaultValues: {
            name: "",
            description: "",
            permissions: [],
        },
    })

    // Handle dialog open for new role
    const handleNewRole = () => {
        setEditingRoleId(null)
        form.reset({
            name: "",
            description: "",
            permissions: [],
        })
        setIsDialogOpen(true)
    }

    // Handle dialog open for editing role
    const handleEditRole = (role: any) => {
        if (role.isSystem) {
            toast({
                title: "Cannot edit system role",
                description: "System roles cannot be modified.",
                variant: "destructive",
            })
            return
        }

        setEditingRoleId(role._id)
        form.reset({
            name: role.name,
            description: role.description || "",
            permissions: role.permissions,
        })
        setIsDialogOpen(true)
    }

    // Handle form submission
    const onSubmit = async (values: z.infer<typeof roleFormSchema>) => {
        try {
            setIsSubmitting(true)

            if (editingRoleId) {
                // Update existing role
                await updateUserRole({
                    id: editingRoleId,
                    ...values,
                })

                toast({
                    title: "Role updated",
                    description: "The role has been updated successfully.",
                })
            } else {
                // Create new role
                await createUserRole(values)

                toast({
                    title: "Role created",
                    description: "The new role has been created successfully.",
                })
            }

            setIsDialogOpen(false)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to save role. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle role deletion
    const handleDeleteRole = async (id: Id<"userRoles">) => {
        const role = roles?.find((r) => r._id === id)

        if (role?.isSystem) {
            toast({
                title: "Cannot delete system role",
                description: "System roles cannot be deleted.",
                variant: "destructive",
            })
            return
        }

        if (window.confirm("Are you sure you want to delete this role? This action cannot be undone.")) {
            try {
                await deleteUserRole({ id })

                toast({
                    title: "Role deleted",
                    description: "The role has been deleted successfully.",
                })
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.message || "Failed to delete role. Please try again.",
                    variant: "destructive",
                })
            }
        }
    }

    if (!roles) {
        return (
            <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={handleNewRole}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Role
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => (
                    <Card key={role._id} className="relative">
                        {role.isSystem && (
                            <div className="absolute top-2 right-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                <Shield className="h-3 w-3" />
                                                System
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>System roles cannot be modified or deleted</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle>{role.name}</CardTitle>
                            {role.description && <CardDescription>{role.description}</CardDescription>}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="text-sm font-medium">Permissions:</div>
                                {role.permissions.includes("*") ? (
                                    <Badge className="bg-primary">All Permissions</Badge>
                                ) : (
                                    <div className="flex flex-wrap gap-1">
                                        {role.permissions.length > 0 ? (
                                            role.permissions.slice(0, 3).map((permission) => (
                                                <Badge key={permission} variant="outline">
                                                    {permission.split(":")[0]}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">No permissions</span>
                                        )}
                                        {role.permissions.length > 3 && (
                                            <Badge variant="outline">+{role.permissions.length - 3} more</Badge>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" size="sm" onClick={() => handleEditRole(role)} disabled={role.isSystem}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteRole(role._id)}
                                disabled={role.isSystem}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingRoleId ? "Edit Role" : "Add New Role"}</DialogTitle>
                        <DialogDescription>
                            {editingRoleId
                                ? "Update the details and permissions for this role"
                                : "Create a new role with specific permissions"}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea rows={2} {...field} />
                                        </FormControl>
                                        <FormDescription>Optional description of this role</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4">
                                <FormLabel>Permissions</FormLabel>
                                <FormField
                                    control={form.control}
                                    name="permissions"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-4">
                                                <FormField
                                                    control={form.control}
                                                    name="permissions"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value.includes("*")}
                                                                    onCheckedChange={(checked) => {
                                                                        if (checked) {
                                                                            field.onChange(["*"])
                                                                        } else {
                                                                            field.onChange([])
                                                                        }
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <div className="space-y-1 leading-none">
                                                                <FormLabel>All Permissions</FormLabel>
                                                                <FormDescription>Grant all permissions to this role</FormDescription>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {!form.watch("permissions").includes("*") && (
                                                <Accordion type="multiple" className="w-full">
                                                    {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                                                        <AccordionItem key={category} value={category}>
                                                            <AccordionTrigger className="capitalize">{category}</AccordionTrigger>
                                                            <AccordionContent>
                                                                <div className="space-y-2">
                                                                    {permissions.map((permission) => (
                                                                        <FormField
                                                                            key={permission.id}
                                                                            control={form.control}
                                                                            name="permissions"
                                                                            render={({ field }) => (
                                                                                <FormItem
                                                                                    key={permission.id}
                                                                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2"
                                                                                >
                                                                                    <FormControl>
                                                                                        <Checkbox
                                                                                            checked={field.value.includes(permission.id)}
                                                                                            onCheckedChange={(checked) => {
                                                                                                const updatedPermissions = checked
                                                                                                    ? [...field.value, permission.id]
                                                                                                    : field.value.filter((p) => p !== permission.id)
                                                                                                field.onChange(updatedPermissions)
                                                                                            }}
                                                                                        />
                                                                                    </FormControl>
                                                                                    <div className="space-y-1 leading-none">
                                                                                        <FormLabel>{permission.label}</FormLabel>
                                                                                    </div>
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    ))}
                                                </Accordion>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

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
                                        "Save Role"
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

