import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { paginationOptsValidator } from "convex/server"

// Get all customers with pagination, sorting, and filtering
export const getCustomers = query({
    args: {
        paginationOpts: paginationOptsValidator,
        search: v.optional(v.string()),
        filters: v.optional(
            v.object({
                status: v.optional(v.string()),
                createdAfter: v.optional(v.string()),
                createdBefore: v.optional(v.string()),
            }),
        ),
        sortBy: v.optional(v.string()),
        sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
    },
    handler: async (ctx, args) => {
        const { paginationOpts, search, filters, sortBy, sortOrder } = args
        const { skip, take } = paginationOpts

        let customersQuery = ctx.db.query("customers")

        // Apply search
        // Apply search
        if (search?.trim()) {
            const searchTerm = search.toLowerCase();
            customersQuery = customersQuery.filter((q) =>
                q.any([
                    q.field("name").contains(searchTerm),
                    q.field("email").contains(searchTerm),
                    q.field("phone").contains(searchTerm)
                ])
            );
        }
        // Apply filters
        if (filters) {
            if (filters.status) {
                customersQuery = customersQuery.filter((q) => q.eq(q.field("status"), filters.status))
            }

            if (filters.createdAfter) {
                const createdAfterDate = new Date(filters.createdAfter).getTime()
                customersQuery = customersQuery.filter((q) => q.gte(q.field("createdAt"), createdAfterDate))
            }

            if (filters.createdBefore) {
                const createdBeforeDate = new Date(filters.createdBefore).getTime()
                customersQuery = customersQuery.filter((q) => q.lte(q.field("createdAt"), createdBeforeDate))
            }
        }

        // Apply sorting
        if (sortBy) {
            customersQuery.order(sortOrder === "desc" ? "desc" : "asc", sortBy as any)
        } else {
            // Default sort by createdAt desc
            customersQuery.order("desc")
        }

        // Get total count for pagination
        const totalCount = await customersQuery.collect().then((res) => res.length)

        // Apply pagination
        const customers = await customersQuery.skip(skip).take(take).collect()

        return {
            customers,
            totalCount,
        }
    },
})

// Get a single customer by ID
export const getCustomerById = query({
    args: { id: v.id("customers") },
    handler: async (ctx, args) => {
        const customer = await ctx.db.get(args.id)

        if (!customer) {
            throw new Error("Customer not found")
        }

        // Get customer interactions
        const interactions = await ctx.db
            .query("customerInteractions")
            .withIndex("by_customer_id", (q) => q.eq("customerId", args.id))
            .order("desc")
            .collect()

        // Get customer appointments
        const appointments = await ctx.db
            .query("appointments")
            .withIndex("by_customer", (q) => q.eq("customerId", args.id))
            .order("desc", "date")
            .collect()

        return {
            ...customer,
            interactions,
            appointments,
        }
    },
})

// Create a new customer
export const createCustomer = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
        status: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { name, email, phone, address, status, notes } = args

        // Check if customer with email already exists
        const existingCustomer = await ctx.db
            .query("customers")
            .withIndex("by_email", (q) => q.eq("email", email))
            .first()

        if (existingCustomer) {
            throw new Error("Customer with this email already exists")
        }

        const now = Date.now()

        return await ctx.db.insert("customers", {
            name,
            email,
            phone,
            address,
            status: status || "active",
            notes,
            createdAt: now,
            updatedAt: now,
        })
    },
})

// Update an existing customer
export const updateCustomer = mutation({
    args: {
        id: v.id("customers"),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        address: v.optional(v.string()),
        status: v.optional(v.string()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args

        // Check if customer exists
        const customer = await ctx.db.get(id)
        if (!customer) {
            throw new Error("Customer not found")
        }

        // If email is being updated, check if it's already in use
        if (updates.email && updates.email !== customer.email) {
            const existingCustomer = await ctx.db
                .query("customers")
                .withIndex("by_email", (q) => q.eq("email", updates.email))
                .first()

            if (existingCustomer) {
                throw new Error("Email is already in use by another customer")
            }
        }

        return await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        })
    },
})

// Delete a customer
export const deleteCustomer = mutation({
    args: { id: v.id("customers") },
    handler: async (ctx, args) => {
        // Check if customer exists
        const customer = await ctx.db.get(args.id)
        if (!customer) {
            throw new Error("Customer not found")
        }

        // Delete the customer
        await ctx.db.delete(args.id)
        return true
    },
})

// Log a customer interaction
export const logCustomerInteraction = mutation({
    args: {
        customerId: v.id("customers"),
        type: v.string(),
        description: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const { customerId, type, description, userId } = args

        // Check if customer exists
        const customer = await ctx.db.get(customerId)
        if (!customer) {
            throw new Error("Customer not found")
        }

        return await ctx.db.insert("customerInteractions", {
            customerId,
            type,
            description,
            userId,
            createdAt: Date.now(),
        })
    },
})

