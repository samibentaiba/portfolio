// src/lib/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Generic function to send emails
 * Used for technical reports and other generic notifications
 */
export async function sendEmail(data: { to: string; subject: string; html: string; attachments?: { filename: string; content: Buffer | string }[] }) {
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
export async function sendVerificationEmail(email: string, verificationUrl: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify Your Email - Algis",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Verify Your Email Address</h2>
        <p>Thank you for registering with Algis!</p>
        <p>Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${verificationUrl}</p>
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          This email was sent by Algis. If you have any questions, please contact our support team.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Your Password - Algis",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Reset Your Password</h2>
        <p>You requested to reset your password for your Algis account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
        <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
          This link will expire in 30 minutes. If you didn't request this password reset, you can safely ignore this email.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          This email was sent by Algis. If you have any questions, please contact our support team.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendLoginAlertEmail(email: string, time: string, ip: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "New Login Detected - Algis",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">New Login Detected</h2>
        <p>We detected a new login to your Algis account.</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>IP Address:</strong> ${ip}</p>
        <p>If this was you, you can ignore this email.</p>
        <p>If you did not authorize this login, please change your password immediately and contact support.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          This email was sent by Algis.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

interface PriceBreakdown {
  base: number;
  addonTotal: number;
  multiplier: number;
  rawTotal: number;
  featureCount: number;
  newFeatureCount: number;
  newFeatureCost: number;
}

// Module and addon display names
const MODULE_NAMES: Record<string, string> = {
  auth: "Authentication",
  uap: "UAP Management",
  livestock: "Livestock",
  vegetal: "Vegetal Production",
  stock: "Stock & Equipment",
  production: "Production Records",
  finance: "Finance & Payroll",
  reporting: "Reporting",
  ui_ux: "Full Improved UI/UX",
  rbac: "RBAC - Role Access Control",
};

const ADDON_NAMES: Record<string, string> = {
  source_code: "Source Code Ownership",
  enterprise: "Enterprise Level",
  priority: "Priority Support",
};

export async function sendAgreementEmail(data: { to: string; clientName: string; totalAmount: number; agreementId: string; modules?: string[]; features?: string[]; addons?: string[]; priceBreakdown?: PriceBreakdown; screenshotBuffer?: Buffer }) {
  const attachments = [];
  if (data.screenshotBuffer) {
    attachments.push({ filename: "agreement-summary.png", content: data.screenshotBuffer });
  }

  // Generate modules list HTML
  const modulesHtml =
    data.modules && data.modules.length > 0
      ? `<ul style="margin: 0; padding-left: 20px;">
        ${data.modules.map((m) => `<li style="color: #059669;">${MODULE_NAMES[m] || m}</li>`).join("")}
       </ul>`
      : '<p style="color: #6b7280;">No modules selected</p>';

  // Generate features count by module
  const featuresHtml =
    data.features && data.features.length > 0
      ? `<p style="margin: 5px 0; color: #374151;"><strong>${data.features.length}</strong> features selected</p>
       <details style="margin: 5px 0;">
         <summary style="cursor: pointer; color: #6b7280;">View all features</summary>
         <ul style="margin: 5px 0; padding-left: 20px; color: #6b7280; font-size: 12px;">
           ${data.features.map((f) => `<li>${f}</li>`).join("")}
         </ul>
       </details>`
      : '<p style="color: #6b7280;">No features selected</p>';

  // Generate addons list HTML
  const addonsHtml =
    data.addons && data.addons.length > 0
      ? `<ul style="margin: 0; padding-left: 20px;">
        ${data.addons.map((a) => `<li style="color: #f59e0b;">${ADDON_NAMES[a] || a}</li>`).join("")}
       </ul>`
      : '<p style="color: #6b7280;">No add-ons selected</p>';

  // Generate price breakdown HTML
  const priceBreakdownHtml = data.priceBreakdown
    ? `<table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 5px 0; color: #6b7280;">Base Price (${data.priceBreakdown.featureCount} features)</td>
          <td style="padding: 5px 0; text-align: right;">${data.priceBreakdown.base.toLocaleString()} DA</td>
        </tr>
        ${
          data.priceBreakdown.addonTotal > 0
            ? `
        <tr>
          <td style="padding: 5px 0; color: #f59e0b;">Add-ons</td>
          <td style="padding: 5px 0; text-align: right; color: #f59e0b;">+${data.priceBreakdown.addonTotal.toLocaleString()} DA</td>
        </tr>`
            : ""
        }
        ${
          data.priceBreakdown.multiplier > 1
            ? `
        <tr>
          <td style="padding: 5px 0; color: #dc2626;">Enterprise Multiplier</td>
          <td style="padding: 5px 0; text-align: right; color: #dc2626;">×${data.priceBreakdown.multiplier}</td>
        </tr>`
            : ""
        }
        ${
          data.priceBreakdown.newFeatureCount > 0
            ? `
        <tr>
          <td style="padding: 5px 0; color: #10b981;">New Features (${data.priceBreakdown.newFeatureCount})</td>
          <td style="padding: 5px 0; text-align: right; color: #10b981;">+${data.priceBreakdown.newFeatureCost.toLocaleString()} DA</td>
        </tr>`
            : ""
        }
        <tr style="border-top: 2px solid #e5e7eb;">
          <td style="padding: 10px 0; font-weight: bold; color: #111827;">Total</td>
          <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #059669; font-size: 18px;">${data.totalAmount.toLocaleString()} DA</td>
        </tr>
       </table>`
    : "";

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: [data.to, "samibentaiba25@gmail.com"],
    subject: "Project Agreement Confirmation - Algis",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Agreement Confirmed ✓</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px;">Dear <strong>${data.clientName}</strong>,</p>
          <p>This email confirms that you have agreed to the Statement of Work and Contract terms for the <strong>ALGIS Agricultural Management System</strong>.</p>
          
          <!-- Agreement Details -->
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">📋 Agreement Details</h3>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 5px 0; color: #6b7280;">Agreement ID:</td>
                <td style="padding: 5px 0; font-family: monospace;">${data.agreementId}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #6b7280;">Date:</td>
                <td style="padding: 5px 0;">${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
              </tr>
            </table>
          </div>

          <!-- Selected Modules -->
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h3 style="margin-top: 0; color: #059669;">📦 Selected Modules</h3>
            ${modulesHtml}
          </div>

          <!-- Selected Features -->
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
            <h3 style="margin-top: 0; color: #22c55e;">⚙️ Features</h3>
            ${featuresHtml}
          </div>

          <!-- Add-ons -->
          <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0; color: #f59e0b;">🎁 Add-ons</h3>
            ${addonsHtml}
          </div>

          <!-- Price Breakdown -->
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #059669;">
            <h3 style="margin-top: 0; color: #111827;">💰 Price Breakdown</h3>
            ${priceBreakdownHtml}
          </div>

          <p style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <strong>📎 Attachments:</strong> A screenshot of your agreement summary is attached for your records.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            This is an automated confirmation from the ALGIS DevPortal.<br>
            © ${new Date().getFullYear()} Bentaidev - All rights reserved.
          </p>
        </div>
      </div>
    `,
    attachments,
  };

  await transporter.sendMail(mailOptions);
}
