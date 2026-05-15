import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@battyhub.local" },
    update: {},
    create: {
      email: "admin@battyhub.local",
      password: adminPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });

  const yonex = await prisma.brand.upsert({
    where: { slug: "yonex" },
    update: {},
    create: { name: "Yonex", slug: "yonex" },
  });

  const victor = await prisma.brand.upsert({
    where: { slug: "victor" },
    update: {},
    create: { name: "Victor", slug: "victor" },
  });

  await prisma.product.upsert({
    where: { slug: "yonex-aerosensa-30" },
    update: {},
    create: {
      name: "Yonex Aerosensa 30",
      slug: "yonex-aerosensa-30",
      description: "Tournament-grade goose feather shuttlecock.",
      price: 3500,
      stock: 50,
      featherType: "Goose",
      speed: "77",
      brandId: yonex.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "victor-gold-no1" },
    update: {},
    create: {
      name: "Victor Gold No.1",
      slug: "victor-gold-no1",
      description: "Premium goose feather, durable and consistent.",
      price: 3800,
      stock: 30,
      featherType: "Goose",
      speed: "77",
      brandId: victor.id,
    },
  });

  console.log("Seeded:", { admin: admin.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
