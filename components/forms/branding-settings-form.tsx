"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import { Select } from "react-day-picker"

// Form validation schema
const formSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  logoUrl: z.string().optional(),
  favicon: z.string().optional(),
  fontPrimary: z.string(),
  fontSecondary: z.string().optional(),
})

// Available fonts
const fonts = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Raleway", label: "Raleway" },
  { value: "Nunito", label: "Nunito" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Merriweather", label: "Merriweather" },
]

export function BrandingSettingsForm() {
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("colors")

  // Fetch branding settings
  const brandingSettings = useQuery(api.settings.getBrandingSettings)

  // Update branding settings mutation
  const updateBrandingSettings = useMutation(api.settings.updateBrandingSettings)

  // Initialize form with branding settings
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryColor: "#3b82f6",
      secondaryColor: "#1e293b",
      accentColor: "#10b981",
      logoUrl: "",
      favicon: "",
      fontPrimary: "Inter",
      fontSecondary: "Roboto",
    },
  })

  // Update form values when branding settings are loaded
  useEffect(() => {
    if (brandingSettings) {
      form.reset({
        primaryColor: brandingSettings.primaryColor,
        secondaryColor: brandingSettings.secondaryColor,
        accentColor: brandingSettings.accentColor,
        logoUrl: brandingSettings.logoUrl || "",
        favicon: brandingSettings.favicon || "",
        fontPrimary: brandingSettings.fontPrimary,
        fontSecondary: brandingSettings.fontSecondary || "",
      })
    }
  }, [brandingSettings, form])

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)

      await updateBrandingSettings(values)

      toast({
        title: "Branding updated",
        description: "Your branding settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update branding settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get current form values for preview
  const watchedValues = form.watch()

  if (!brandingSettings) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="logo">Logo & Favicon</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="colors" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="primaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Color</FormLabel>
                            <div className="flex space-x-2">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: field.value }} />
                            </div>
                            <FormDescription>Main color for buttons and interactive elements</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="secondaryColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secondary Color</FormLabel>
                            <div className="flex space-x-2">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: field.value }} />
                            </div>
                            <FormDescription>Used for backgrounds and secondary elements</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="accentColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Accent Color</FormLabel>
                            <div className="flex space-x-2">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: field.value }} />
                            </div>
                            <FormDescription>Highlight color for important elements</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-4">Preview</h4>
                      <div className="space-y-4">
                        <div
                          className="p-4 rounded-md text-white"
                          style={{ backgroundColor: watchedValues.primaryColor }}
                        >
                          Primary Color
                        </div>
                        <div
                          className="p-4 rounded-md text-white"
                          style={{ backgroundColor: watchedValues.secondaryColor }}
                        >
                          Secondary Color
                        </div>
                        <div
                          className="p-4 rounded-md text-white"
                          style={{ backgroundColor: watchedValues.accentColor }}
                        >
                          Accent Color
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            className=" py-2 rounded-md text-white"
                            style={{ backgroundColor: watchedValues.primaryColor }}
                          >
                            Primary Button
                          </button>
                          <button
                            type="button"
                            className=" py-2 rounded-md text-white"
                            style={{ backgroundColor: watchedValues.secondaryColor }}
                          >
                            Secondary Button
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logo" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="logoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo URL</FormLabel>
                          <FormControl>
                            <div className="flex space-x-2">
                              <Input {...field} placeholder="https://example.com/logo.png" />
                              <Button type="button" variant="outline" size="icon">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>Enter the URL of your logo or upload a new one</FormDescription>
                          <FormMessage />
                          {field.value && (
                            <div className="mt-2 p-4 border rounded-md flex items-center justify-center">
                              <img
                                src={field.value || "/placeholder.svg"}
                                alt="Logo Preview"
                                className="max-h-24 object-contain"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=96&width=96"
                                }}
                              />
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="favicon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Favicon URL</FormLabel>
                          <FormControl>
                            <div className="flex space-x-2">
                              <Input {...field} placeholder="https://example.com/favicon.ico" />
                              <Button type="button" variant="outline" size="icon">
                                <Upload className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>Enter the URL of your favicon (recommended size: 32x32px)</FormDescription>
                          <FormMessage />
                          {field.value && (
                            <div className="mt-2 p-4 border rounded-md flex items-center justify-center">
                              <img
                                src={field.value || "/placeholder.svg"}
                                alt="Favicon Preview"
                                className="h-8 w-8 object-contain"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=32&width=32"
                                }}
                              />
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="typography" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fontPrimary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Font</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a font" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {fonts.map((font) => (
                                  <SelectItem key={font.value} value={font.value}>
                                    {font.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>Main font used for headings and body text</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fontSecondary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secondary Font</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a font" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {fonts.map((font) => (
                                  <SelectItem key={font.value} value={font.value}>
                                    {font.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>Optional secondary font for specific elements</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-4">Typography Preview</h4>
                      <div className="space-y-4">
                        <div style={{ fontFamily: watchedValues.fontPrimary }}>
                          <h1 className="text-2xl font-bold">Primary Heading</h1>
                          <p className="text-base">
                            This is a paragraph using the primary font. The quick brown fox jumps over the lazy dog.
                          </p>
                        </div>

                        {watchedValues.fontSecondary && (
                          <div style={{ fontFamily: watchedValues.fontSecondary }}>
                            <h2 className="text-xl font-semibold">Secondary Heading</h2>
                            <p className="text-sm">
                              This is a paragraph using the secondary font. The quick brown fox jumps over the lazy dog.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

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
        </Form>
      </Tabs>
    </div>
  )
}

