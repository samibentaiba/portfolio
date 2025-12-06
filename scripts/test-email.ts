import nodemailer from "nodemailer";

// dotenv is not needed with bun run as it loads .env automatically

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function main() {
  console.log("Testing email configuration...");
  console.log(`User: ${process.env.EMAIL_USER}`);
  console.log("Attempting to send test email...");

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: "Test Email from Portfolio",
      text: "If you receive this, your email configuration is correct!",
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send email.");
    console.error(error);
  }
}

main();
