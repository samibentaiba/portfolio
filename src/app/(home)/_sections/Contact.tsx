// src/app/(home)/client.tsx
"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ReloadIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useContactForm } from "../hook";

// ────────────────────────────────
// Contact Section
// ────────────────────────────────
const Contact = memo(function Contact() {
  return (
    <motion.section
      id="contact"
      className="w-full scroll-mt-16 px-4 sm:px-0 py-8 sm:py-12"
      aria-labelledby="contact-heading"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card>
        <CardContent className="p-6">
          <ContactForm />
        </CardContent>
      </Card>
    </motion.section>
  );
});

const ContactForm = memo(function ContactForm() {
  const { t, form, isSubmitting, onSubmit } = useContactForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h2 id="contact-heading" className="text-2xl font-bold">
            {t("contact.form.title") || "Contact Me"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("contact.form.description") ||
              "Fill out the form below to get in touch."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("contact.form.firstName") || "First Name"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={
                      t("contact.form.firstNamePlaceholder") ||
                      "Enter your first name"
                    }
                    disabled={isSubmitting}
                  />
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
                <FormLabel>
                  {t("contact.form.lastName") || "Last Name"}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={
                      t("contact.form.lastNamePlaceholder") ||
                      "Enter your last name"
                    }
                    disabled={isSubmitting}
                  />
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
                  <Input
                    {...field}
                    type="email"
                    placeholder={
                      t("contact.form.emailPlaceholder") || "Enter your email"
                    }
                    disabled={isSubmitting}
                  />
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
                <FormLabel>{t("contact.form.phone") || "Phone"}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder={
                      t("contact.form.phonePlaceholder") || "Enter your phone"
                    }
                    disabled={isSubmitting}
                  />
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
              <FormLabel>
                {t("contact.form.projectName") || "Project Name"}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={
                    t("contact.form.projectNamePlaceholder") ||
                    "Enter project name"
                  }
                  disabled={isSubmitting}
                />
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
                  {...field}
                  placeholder={
                    t("contact.form.messagePlaceholder") ||
                    "Tell me about your project..."
                  }
                  rows={5}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              {t("contact.form.sending")}
            </>
          ) : (
            t("contact.form.submit")
          )}
        </Button>
      </form>
    </Form>
  );
});
export default Contact;
