import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const getUser = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first()
    },
})

export const createUser = mutation({
    args: {
        clerkId: v.string(),
        name: v.string(),
        email: v.string(),
        image: v.optional(v.string()),
        role: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("users", {
            clerkId: args.clerkId,
            name: args.name,
            email: args.email,
            image: args.image,
            role: args.role,
        })
    },
})

