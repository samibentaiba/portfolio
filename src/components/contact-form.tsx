"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { sendContactForm } from "@/lib/contact"
import { ReloadIcon } from "@radix-ui/react-icons"

export function ContactForm() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form validation schema
  const formSchema = z.object({
    firstName: z.string().min(2, {
      message: t("contact.validation.firstNameRequired") || "First name is required",
    }),
    lastName: z.string().min(2, {
      message: t("contact.validation.lastNameRequired") || "Last name is required",
    }),
    email: z.string().email({
      message: t("contact.validation.emailValid") || "Please enter a valid email address",
    }),
    phone: z.string().min(5, {
      message: t("contact.validation.phoneRequired") || "Phone number is required",
    }),
    projectName: z.string().min(2, {
      message: t("contact.validation.projectRequired") || "Project name is required",
    }),
    message: z.string().min(10, {
      message: t("contact.validation.messageLength") || "Message must be at least 10 characters",
    }),
  })

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      projectName: "",
      message: "",
    },
  })

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      await sendContactForm(values)

      toast({
        title: t("contact.success.title") || "Message sent!",
        description: t("contact.success.description") || "Thank you for your message. I'll get back to you soon.",
        variant: "default",
      })

      form.reset()
    } catch (error: unknown) {
      const err = error as Error
      toast({
        title: t("contact.error.title") || "Something went wrong",
        description:
          err.message || t("contact.error.description") || "Your message couldn't be sent. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.form.firstName") || "First Name"}</FormLabel>
                <FormControl>
                  <Input placeholder={t("contact.form.firstNamePlaceholder") || "Enter your first name"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.form.lastName") || "Last Name"}</FormLabel>
                <FormControl>
                  <Input placeholder={t("contact.form.lastNamePlaceholder") || "Enter your last name"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.form.email") || "Email"}</FormLabel>
                <FormControl>
                  <Input placeholder={t("contact.form.emailPlaceholder") || "Enter your email"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contact.form.phone") || "Phone Number"}</FormLabel>
                <FormControl>
                  <Input placeholder={t("contact.form.phonePlaceholder") || "Enter your phone number"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contact.form.projectName") || "Project Name"}</FormLabel>
              <FormControl>
                <Input placeholder={t("contact.form.projectNamePlaceholder") || "Enter your project name"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contact.form.message") || "Message"}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("contact.form.messagePlaceholder") || "Tell me about your project..."}
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("contact.form.messageDescription") || "Please provide details about your project and requirements."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              {t("contact.form.sending") || "Sending..."}
            </>
          ) : (
            t("contact.form.submit") || "Send Message"
          )}
        </Button>
      </form>
    </Form>
  )
}
