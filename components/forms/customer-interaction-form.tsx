"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface CustomerInteractionFormProps {
    customerId: Id<"customers">
    userId: string
}

export function CustomerInteractionForm({ customerId, userId }: CustomerInteractionFormProps) {
    const [type, setType] = useState("note")
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const logInteraction = useMutation(api.customers.logCustomerInteraction)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!description.trim()) {
            toast({
                title: "Error",
                description: "Please enter a description",
                variant: "destructive",
            })
            return
        }

        try {
            setIsSubmitting(true)
            await logInteraction({
                customerId,
                type,
                description,
                userId,
            })

            toast({
                title: "Interaction logged",
                description: "The customer interaction has been logged successfully.",
            })

            // Reset form
            setDescription("")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to log interaction. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select interaction type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="note">Note</SelectItem>
                        <SelectItem value="call">Phone Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Textarea
                    placeholder="Enter details about the interaction..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging..." : "Log Interaction"}
            </Button>
        </form>
    )
}

