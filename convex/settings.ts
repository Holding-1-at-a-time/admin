import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Business Settings
export const getBusinessSettings = query({
    handler: async (ctx) => {
        const settings = await ctx.db.query("businessSettings").first()

        if (!settings) {
            // Return default settings if none exist
            return {
                businessName: "My Business",
                email: "contact@mybusiness.com",
                phone: "",
                address: "",
                website: "",
                taxId: "",
                businessHours: [
                    { day: "Monday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
                    { day: "Tuesday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
                    { day: "Wednesday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
                    { day: "Thursday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
                    { day: "Friday", isOpen: true, openTime: "09:00", closeTime: "17:00" },
                    { day: "Saturday", isOpen: false },
                    { day: "Sunday", isOpen: false },
                ],
                updatedAt: Date.now(),
            }
        }

        return settings
    },
})

export const updateBusinessSettings = mutation({
    args: {
        businessName: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
        website: v.optional(v.string()),
        taxId: v.optional(v.string()),
        businessHours: v.array(
            v.object({
                day: v.string(),
                isOpen: v.boolean(),
                openTime: v.optional(v.string()),
                closeTime: v.optional(v.string()),
            }),
        ),
    },
    handler: async (ctx, args) => {
        const existingSettings = await ctx.db.query("businessSettings").first()

        if (existingSettings) {
            return await ctx.db.patch(existingSettings._id, {
                ...args,
                updatedAt: Date.now(),
            })
        } else {
            return await ctx.db.insert("businessSettings", {
                ...args,
                updatedAt: Date.now(),
            })
        }
    },
})

// Branding Settings
export const getBrandingSettings = query({
    handler: async (ctx) => {
        const settings = await ctx.db.query("brandingSettings").first()

        if (!settings) {
            // Return default settings if none exist
            return {
                primaryColor: "#3b82f6", // blue-500
                secondaryColor: "#1e293b", // slate-800
                accentColor: "#10b981", // emerald-500
                logoUrl: "",
                favicon: "",
                fontPrimary: "Inter",
                fontSecondary: "Roboto",
                updatedAt: Date.now(),
            }
        }

        return settings
    },
})

export const updateBrandingSettings = mutation({
    args: {
        primaryColor: v.string(),
        secondaryColor: v.string(),
        accentColor: v.string(),
        logoUrl: v.optional(v.string()),
        favicon: v.optional(v.string()),
        fontPrimary: v.string(),
        fontSecondary: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existingSettings = await ctx.db.query("brandingSettings").first()

        if (existingSettings) {
            return await ctx.db.patch(existingSettings._id, {
                ...args,
                updatedAt: Date.now(),
            })
        } else {
            return await ctx.db.insert("brandingSettings", {
                ...args,
                updatedAt: Date.now(),
            })
        }
    },
})

// User Roles and Permissions
export const getUserRoles = query({
    handler: async (ctx) => {
        const roles = await ctx.db.query("userRoles").collect()

        if (roles.length === 0) {
            // Create default roles if none exist
            const defaultRoles = [
                {
                    name: "Admin",
                    description: "Full access to all features",
                    permissions: ["*"],
                    isSystem: true,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                },
                {
                    name: "Manager",
                    description: "Can manage most aspects of the business",
                    permissions: [
                        "dashboard:view",
                        "customers:view",
                        "customers:create",
                        "customers:edit",
                        "services:view",
                        "services:create",
                        "services:edit",
                        "appointments:view",
                        "appointments:create",
                        "appointments:edit",
                    ],
                    isSystem: true,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                },
                {
                    name: "Employee",
                    description: "Limited access to customer and appointment data",
                    permissions: ["dashboard:view", "customers:view", "appointments:view", "appointments:create"],
                    isSystem: true,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                },
            ]

            for (const role of defaultRoles) {
                await ctx.db.insert("userRoles", role)
            }

            return defaultRoles
        }

        return roles
    },
})

export const createUserRole = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        permissions: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if role with same name already exists
        const existingRole = await ctx.db
            .query("userRoles")
            .filter((q) => q.eq(q.field("name"), args.name))
            .first()

        if (existingRole) {
            throw new Error(`Role with name "${args.name}" already exists`)
        }

        return await ctx.db.insert("userRoles", {
            ...args,
            isSystem: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })
    },
})

export const updateUserRole = mutation({
    args: {
        id: v.id("userRoles"),
        name: v.string(),
        description: v.optional(v.string()),
        permissions: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args

        // Check if role exists
        const role = await ctx.db.get(id)
        if (!role) {
            throw new Error("Role not found")
        }

        // Prevent modifying system roles
        if (role.isSystem) {
            throw new Error("Cannot modify system roles")
        }

        // Check if new name conflicts with existing role
        if (updates.name !== role.name) {
            const existingRole = await ctx.db
                .query("userRoles")
                .filter((q) => q.eq(q.field("name"), updates.name))
                .first()

            if (existingRole) {
                throw new Error(`Role with name "${updates.name}" already exists`)
            }
        }

        return await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        })
    },
})

export const deleteUserRole = mutation({
    args: {
        id: v.id("userRoles"),
    },
    handler: async (ctx, args) => {
        const role = await ctx.db.get(args.id)

        if (!role) {
            throw new Error("Role not found")
        }

        // Prevent deleting system roles
        if (role.isSystem) {
            throw new Error("Cannot delete system roles")
        }

        await ctx.db.delete(args.id)
        return true
    },
})

// Service Catalog
export const getServices = query({
    handler: async (ctx) => {
        return await ctx.db.query("services").collect()
    },
})

export const createService = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        price: v.number(),
        duration: v.number(),
        category: v.string(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("services", args)
    },
})

export const updateService = mutation({
    args: {
        id: v.id("services"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        duration: v.optional(v.number()),
        category: v.optional(v.string()),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args

        // Check if service exists
        const service = await ctx.db.get(id)
        if (!service) {
            throw new Error("Service not found")
        }

        return await ctx.db.patch(id, updates)
    },
})

export const deleteService = mutation({
    args: {
        id: v.id("services"),
    },
    handler: async (ctx, args) => {
        // Check if service exists
        const service = await ctx.db.get(args.id)
        if (!service) {
            throw new Error("Service not found")
        }

        // Check if service is used in appointments
        const appointments = await ctx.db
            .query("appointments")
            .filter((q) => q.eq(q.field("serviceId"), args.id))
            .first()

        if (appointments) {
            throw new Error("Cannot delete service that is used in appointments")
        }

        await ctx.db.delete(args.id)
        return true
    },
})

