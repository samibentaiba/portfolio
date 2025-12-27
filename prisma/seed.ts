import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import projects from "../src/data/projects.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@bentaidev.com" },
    update: {},
    create: {
      email: "admin@bentaidev.com",
      name: "Sami Bentaiba",
      password: hashedPassword,
      role: "admin",
      emailVerified: new Date(),
      theme: "dark",
      sidebarAutoCollapse: false,
      emailAlertOnLogin: false,
    },
  });

  console.log("✅ Created admin user:", adminUser.email);

  // Register first 3 projects as examples
  const projectsToSeed = projects.slice(0, 3);

  for (const project of projectsToSeed) {
    const projectAccess = await prisma.projectAccess.upsert({
      where: { slug: project.slug },
      update: {},
      create: {
        slug: project.slug,
        name: project.title,
        status: "pending",
      },
    });
    console.log(
      `✅ Registered project: ${projectAccess.name} (${projectAccess.slug})`
    );
    console.log(`   API Key: ${projectAccess.apiKey}`);
  }

  console.log("\n🎉 Database seeding completed!");
  console.log("");
  console.log("📋 Admin credentials:");
  console.log("   Email: admin@bentaidev.com");
  console.log("   Password: admin123");
  console.log("");
  console.log("⚠️  Please change the password after first login!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
