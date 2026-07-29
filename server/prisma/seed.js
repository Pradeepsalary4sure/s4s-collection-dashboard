/**
 * Seed Script
 *
 * Creates a default admin user for first-time login.
 * Run: npx prisma db seed
 *
 * Default Admin Credentials:
 *   Email:    admin@s4s.com
 *   Password: admin123
 *
 * IMPORTANT: Change the password after first login!
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@s4s.com";

  // Check if admin already exists
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log(`✅ Admin user already exists: ${adminEmail}`);
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin1234", salt);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: "Super Admin",
      password: hashedPassword,
      role: "admin",
      is_verified: true,
    },
  });

  console.log("✅ Default admin user created!");
  console.log(`   Email:    admin@s4s.com`);
  console.log(`   Password: admin1234`);
  console.log(`   Role:     ${admin.role}`);
  console.log(`   ID:       ${admin.id}`);
  console.log("");
  console.log("⚠️  IMPORTANT: Change the password after first login!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
