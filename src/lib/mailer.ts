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

/**
 * Send login alert email to user
 */
export async function sendLoginAlertEmail(
  email: string,
  time: string,
  ipAddress: string
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">🔐 New Login Alert</h2>
      <p>A new login was detected on your account.</p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>IP Address:</strong> ${ipAddress}</p>
      </div>
      <p style="color: #666; font-size: 14px;">
        If this wasn't you, please secure your account immediately.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">
        This email was sent from bentaidev.com
      </p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "🔐 New Login Alert - bentaidev",
    html,
  });
}
