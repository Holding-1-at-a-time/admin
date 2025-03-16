import { v } from "convex/values"
import { query } from "./_generated/server"

export const getAnalytics = query({
    args: {
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let analyticsQuery = ctx.db.query("analytics")

        if (args.startDate && args.endDate) {
            analyticsQuery = analyticsQuery.filter((q) =>
                q.and(q.gte(q.field("date"), args.startDate as string), q.lte(q.field("date"), args.endDate as string)),
            )
        }

        return await analyticsQuery.collect()
    },
})

export const getDashboardStats = query({
    handler: async (ctx) => {
        const analytics = await ctx.db.query("analytics").order("desc").take(30)
        const customers = await ctx.db.query("customers").collect();
        const customersCount = customers.length;

        const services = await ctx.db.query("services").collect();
        const servicesCount = services.length;

        const appointments = await ctx.db.query("appointments").collect();
        const appointmentsCount = appointments.length;
        // Calculate total revenue for the last 30 days
        const totalRevenue = analytics.reduce((acc, curr) => acc + curr.revenue, 0)

        return {
            totalRevenue,
            totalCustomers: customers,
            totalServices: services,
            totalAppointments: appointments,
            recentAnalytics: analytics,
        }
    },
})

