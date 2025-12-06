// src/lib/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


export async function sendEmail(data: {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer | string }[];
}) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: data.to,
    subject: data.subject,
    html: data.html,
    attachments: data.attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    // We might not want to throw here to avoid crashing the calling service completely 
    // if email is non-critical, but for reports it's important.
    // For now, we log and rethrow or let the service handle the failure.
    throw error;
  }
}