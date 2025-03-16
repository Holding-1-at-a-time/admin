"use client"

import type React from "react"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

// Generate time options in 30-minute increments
const generateTimeOptions = () => {
  const options = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const h = hour.toString().padStart(2, "0")
      const m = minute.toString().padStart(2, "0")
      const time = `${h}:${m}`
      const label = formatTimeLabel(time)
      options.push({ value: time, label })
    }
  }
  return options
}

// Format time for display (12-hour format)
const formatTimeLabel = (time: string) => {
  const [hour, minute] = time.split(":")
  const h = Number.parseInt(hour, 10)
  const period = h >= 12 ? "PM" : "AM"
  const displayHour = h % 12 || 12
  return `${displayHour}:${minute} ${period}`
}

const timeOptions = generateTimeOptions()

export function BusinessHoursForm() {
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch business settings
  const businessSettings = useQuery(api.settings.getBusinessSettings)

  // Update business settings mutation
  const updateBusinessSettings = useMutation(api.settings.updateBusinessSettings)

  // Local state for business hours
  const [businessHours, setBusinessHours] = useState<any[]>([])

  // Update local state when business settings are loaded
  useState(() => {
    if (businessSettings?.businessHours) {
      setBusinessHours(businessSettings.businessHours)
    }
  })

  // Handle toggle day open/closed
  const handleToggleDay = (index: number, isOpen: boolean) => {
    const updatedHours = [...businessHours]
    updatedHours[index] = {
      ...updatedHours[index],
      isOpen,
    }
    setBusinessHours(updatedHours)
  }

  // Handle time change
  const handleTimeChange = (index: number, field: "openTime" | "closeTime", value: string) => {
    const updatedHours = [...businessHours]
    updatedHours[index] = {
      ...updatedHours[index],
      [field]: value,
    }
    setBusinessHours(updatedHours)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      // Update business settings with new hours
      await updateBusinessSettings({
        ...businessSettings,
        businessHours,
      })

      toast({
        title: "Business hours updated",
        description: "Your business hours have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business hours. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!businessSettings || !businessHours.length) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {businessHours.map((day, index) => (
              <div key={day.day} className="grid grid-cols-12 items-center gap-4 py-2">
                <div className="col-span-3">
                  <Label>{day.day}</Label>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch checked={day.isOpen} onCheckedChange={(checked) => handleToggleDay(index, checked)} />
                    <span className="text-sm">{day.isOpen ? "Open" : "Closed"}</span>
                  </div>
                </div>
                {day.isOpen && (
                  <>
                    <div className="col-span-3">
                      <Select
                        value={day.openTime}
                        onValueChange={(value) => handleTimeChange(index, "openTime", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Opening time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1 text-center">to</div>
                    <div className="col-span-3">
                      <Select
                        value={day.closeTime}
                        onValueChange={(value) => handleTimeChange(index, "closeTime", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Closing time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                {!day.isOpen && <div className="col-span-7 text-muted-foreground">Closed all day</div>}
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

