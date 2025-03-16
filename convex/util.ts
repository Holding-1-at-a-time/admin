import { v } from "convex/values"

export const paginationOptsValidator = v.object({
    skip: v.number(),
    take: v.number(),
})

export type PaginationOptions = {
    skip: number
    take: number
}

