import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create landlord
  const landlord = await prisma.user.upsert({
    where: { email: "landlord@test.com" },
    update: {},
    create: {
      email: "landlord@test.com",
      passwordHash: "$2b$10$K.ExampleHashForTesting", // test123
      role: "LANDLORD",
    },
  });

  // Create tenant
  const tenant = await prisma.user.upsert({
    where: { email: "tenant@test.com" },
    update: {},
    create: {
      email: "tenant@test.com",
      passwordHash: "$2b$10$K.ExampleHashForTesting", // test123
      role: "TENANT",
    },
  });

  // Create property
  const property = await prisma.property.create({
    data: {
      title: "Cozy 1BHK Apartment",
      description: "Perfect for students. Close to university.",
      depositAmount: 500,
      landlordId: landlord.id,
    },
  });

  console.log({ landlord, tenant, property });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
