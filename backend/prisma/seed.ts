import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedLandlord = await bcrypt.hash("landlord123", 10);
  const hashedTenant = await bcrypt.hash("tenant123", 10);

  await prisma.user.upsert({
    where: { email: "landlord@test.com" },
    update: {},
    create: {
      email: "landlord@test.com",
      passwordHash: hashedLandlord,
      role: "LANDLORD",
    },
  });

  await prisma.user.upsert({
    where: { email: "tenant@test.com" },
    update: {},
    create: {
      email: "tenant@test.com",
      passwordHash: hashedTenant,
      role: "TENANT",
    },
  });

  console.log("Users seeded");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
