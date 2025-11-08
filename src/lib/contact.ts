"use server"

import { z } from "zod"

// Form validation schema
const contactFormSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  projectName: z.string().min(2),
  message: z.string().min(10),
})

export async function sendContactForm(formData: z.infer<typeof contactFormSchema>) {
  // Validate form data
  const validatedData = contactFormSchema.parse(formData)

  // In a real application, you would send this data to your email service, CRM, etc.
  // For example, using a service like SendGrid, Mailchimp, or your own email server

  // For demonstration purposes, we'll just log the data and simulate a delay
  console.log("Contact form submission:", validatedData)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Simulate success (in a real app, you'd handle errors from your email service)
  return { success: true }

  // If you want to simulate an error, uncomment this:
  // throw new Error("Failed to send message")
}
