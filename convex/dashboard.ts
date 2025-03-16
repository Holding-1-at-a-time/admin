import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const getDashboardLayout = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("dashboardLayouts")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .first()
    },
})

export const saveDashboardLayout = mutation({
    args: {
        userId: v.string(),
        layout: v.array(
            v.object({
                i: v.string(),
                x: v.number(),
                y: v.number(),
                w: v.number(),
                h: v.number(),
                minW: v.optional(v.number()),
                maxW: v.optional(v.number()),
                minH: v.optional(v.number()),
                maxH: v.optional(v.number()),
                static: v.optional(v.boolean()),
            }),
        ),
    },
    handler: async (ctx, args) => {
        const existingLayout = await ctx.db
            .query("dashboardLayouts")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .first()

        if (existingLayout) {
            return await ctx.db.patch(existingLayout._id, {
                layout: args.layout,
            })
        } else {
            return await ctx.db.insert("dashboardLayouts", {
                userId: args.userId,
                layout: args.layout,
            })
        }
    },
})

