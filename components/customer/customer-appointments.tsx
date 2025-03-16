"use client"

import Link from "next/link"
import { Calendar, Clock, MapPin, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "./ui/badge"
import type { Id } from "@/convex/_generated/dataModel"

interface CustomerAppointmentsProps {
  appointments: any[]
  customerId: Id<"customers">
}

export function CustomerAppointments({ appointments, customerId }: CustomerAppointmentsProps) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No appointments yet</h3>
        <p className="text-muted-foreground mb-4">Schedule an appointment with this customer</p>
        <Button asChild>
          <Link href={`/schedule/new?customerId=${customerId}`}>Schedule Appointment</Link>
        </Button>
      </div>
    )
  }

  // Group appointments by status
  const upcomingAppointments = appointments.filter((appointment) => appointment.status === "scheduled")

  const pastAppointments = appointments.filter(
    (appointment) => appointment.status === "completed" || appointment.status === "cancelled",
  )

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Upcoming Appointments</h3>
          <Button asChild>
            <Link href={`/schedule/new?customerId=${customerId}`}>Schedule Appointment</Link>
          </Button>
        </div>

        {upcomingAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment._id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground">No upcoming appointments</p>
            </CardContent>
          </Card>
        )}
      </div>

      {pastAppointments.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Past Appointments</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment._id} appointment={appointment} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AppointmentCard({ appointment }: { appointment: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>{appointment.service?.name || "Appointment"}</CardTitle>
          <AppointmentStatusBadge status={appointment.status} />
        </div>
        <CardDescription>
          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Duration: {appointment.service?.duration || "60"} minutes</span>
          </div>
          {appointment.employee && (
            <div className="flex items-center text-sm">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>With: {appointment.employee.name}</span>
            </div>
          )}
          {appointment.location && (
            <div className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{appointment.location}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/schedule/${appointment._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function AppointmentStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "scheduled":
      return <Badge className="bg-blue-500">Scheduled</Badge>
    case "completed":
      return <Badge className="bg-green-500">Completed</Badge>
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

