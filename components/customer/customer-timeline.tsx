"use client"

import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Phone, Mail, Users, Clock, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CustomerTimelineProps {
    interactions: any[]
}

export function CustomerTimeline({ interactions }: CustomerTimelineProps) {
    if (interactions.length === 0) {
        return (
            <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No interactions yet</h3>
                <p className="text-muted-foreground">Log your first interaction with this customer</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {interactions.map((interaction) => (
                <div key={interaction._id} className="relative pl-8 pb-8">
                    {/* Timeline connector */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

                    {/* Timeline dot */}
                    <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full border-2 border-background bg-primary" />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <InteractionIcon type={interaction.type} />
                                <Badge variant="outline">{interaction.type}</Badge>
                            </div>
                            <time className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(interaction.createdAt), {
                                    addSuffix: true,
                                })}
                            </time>
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                            <p>{interaction.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function InteractionIcon({ type }: { type: string }) {
    switch (type) {
        case "note":
            return <MessageSquare className="h-4 w-4 text-blue-500" />
        case "call":
            return <Phone className="h-4 w-4 text-green-500" />
        case "email":
            return <Mail className="h-4 w-4 text-purple-500" />
        case "meeting":
            return <Users className="h-4 w-4 text-orange-500" />
        case "appointment":
            return <Calendar className="h-4 w-4 text-red-500" />
        default:
            return <Clock className="h-4 w-4 text-gray-500" />
    }
}

