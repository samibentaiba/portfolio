"use server"

import { z } from "zod"
import { sendEmail } from "@/lib/mailer"

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

  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
          <p><strong>Name:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Phone:</strong> ${validatedData.phone}</p>
          <p><strong>Project:</strong> ${validatedData.projectName}</p>
          <hr style="border: 1px solid #ddd; margin: 15px 0;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${validatedData.message}</p>
        </div>
      </div>
    `

    await sendEmail({
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER || "",
      subject: `Portfolio Contact: ${validatedData.projectName} - ${validatedData.firstName} ${validatedData.lastName}`,
      html: htmlContent,
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to send contact email:", error)
    throw new Error("Failed to send message")
  }
}
