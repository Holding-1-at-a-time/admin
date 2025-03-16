import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    users: defineTable({
        name: v.string(),
        clerkId: v.string(),
        email: v.string(),
        image: v.optional(v.string()),
        status: v.optional(v.string()),
        role: v.string(),
        updatedAt: v.number(),
    }).index("by_clerk_id", ["clerkId"])
        .index("by_email", ["email"]),

    customerInteractions: defineTable({
        customerId: v.id("customers"),
        type: v.string(), // call, email, meeting, note, etc.
        description: v.string(),
        userId: v.string(), // ID of the user who logged the interaction
        createdAt: v.number(),
    }).index("by_customer_id", ["customerId"]),

    businessSettings: defineTable({
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
            })
        ),
        updatedAt: v.number(),
    }).index("by_business_name", ["businessName"]), 

    brandingSettings: defineTable({
        businessName: v.string(),
        primaryColor: v.string(),
        secondaryColor: v.string(),
        accentColor: v.string(),
        logoUrl: v.optional(v.string()),
        favicon: v.optional(v.string()),
        fontPrimary: v.string(),
        fontSecondary: v.optional(v.string()),

    }).index("by_business_name", ["businessName"]),

    userRoles: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        permissions: v.array(v.string()),
        isSystem: v.boolean(),
    }).index("by_name", ["name"]),

    customer: defineTable({
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
        status: v.optional(v.string()),
        notes: v.optional(v.string()),
    }).index("by_email", ["email"])
        .index("by_status", ["status"])
        .index("by_name", ["name"])
        .index("by_phone", ["phone"]),

    service: defineTable({
        name: v.string(),
        description: v.string(),
        price: v.number(),
        duration: v.number(),
        category: v.string(),
        isActive: v.boolean(),
    }).index("by_name", ["name"])
        .index("by_category", ["category"])
        .index("by_price", ["price"])
        .index("by_duration", ["duration"])
        .index("by_is_active", ["isActive"]),
});