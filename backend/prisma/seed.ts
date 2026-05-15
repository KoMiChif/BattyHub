import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

type Tier = "TOURNAMENT" | "CLUB" | "PRACTICE";
type Shuttle = {
  slug: string;
  name: string;
  brand: string;
  tier: Tier;
  price: number;
  salePrice?: number;
  feather: string;
  speed: string;
  stock: number;
};

const SHUTTLES: Shuttle[] = [
  { slug: "yonex-aerosensa-50",  name: "Aerosensa 50",        brand: "yonex",   tier: "TOURNAMENT", price: 4400, feather: "Goose", speed: "77", stock: 60 },
  { slug: "yonex-aerosensa-40",  name: "Aerosensa 40",        brand: "yonex",   tier: "TOURNAMENT", price: 3600, feather: "Goose", speed: "77", stock: 80 },
  { slug: "rsl-tourney-no1",     name: "Tourney No. 1",       brand: "rsl",     tier: "TOURNAMENT", price: 3800, feather: "Goose", speed: "77", stock: 50 },
  { slug: "victor-master-no1",   name: "Master No. 1",        brand: "victor",  tier: "TOURNAMENT", price: 4000, salePrice: 3200, feather: "Goose", speed: "77", stock: 40 },
  { slug: "lining-a90",          name: "A+90 Tournament",     brand: "lining",  tier: "TOURNAMENT", price: 3600, feather: "Goose", speed: "77", stock: 45 },
  { slug: "yonex-aerosensa-30",  name: "Aerosensa 30",        brand: "yonex",   tier: "CLUB",       price: 2600, feather: "Goose", speed: "77", stock: 100 },
  { slug: "rsl-classic-tourney", name: "Classic Tourney",     brand: "rsl",     tier: "CLUB",       price: 2200, feather: "Goose", speed: "77", stock: 100 },
  { slug: "victor-champion-no3", name: "Champion No. 3",      brand: "victor",  tier: "CLUB",       price: 1900, feather: "Duck",  speed: "77", stock: 120 },
  { slug: "yonex-aerosensa-20",  name: "Aerosensa 20",        brand: "yonex",   tier: "PRACTICE",   price: 1800, feather: "Duck",  speed: "77", stock: 200 },
  { slug: "lining-a30",          name: "A+30 Training",       brand: "lining",  tier: "PRACTICE",   price: 1600, feather: "Duck",  speed: "77", stock: 200 },
  { slug: "yonex-mavis-350",     name: "Mavis 350 (Nylon)",   brand: "yonex",   tier: "PRACTICE",   price: 1300, feather: "Nylon", speed: "76", stock: 300 },
  { slug: "yonex-mavis-2000",    name: "Mavis 2000 (Nylon)",  brand: "yonex",   tier: "PRACTICE",   price: 1600, feather: "Nylon", speed: "76", stock: 250 },
];

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

  const brandDefs = [
    { slug: "yonex",  name: "YONEX" },
    { slug: "rsl",    name: "RSL" },
    { slug: "victor", name: "Victor" },
    { slug: "lining", name: "Li-Ning" },
  ];

  const brands: Record<string, { id: string }> = {};
  for (const b of brandDefs) {
    brands[b.slug] = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name },
      create: b,
    });
  }

  for (const s of SHUTTLES) {
    await prisma.product.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        price: s.price,
        salePrice: s.salePrice ?? null,
        stock: s.stock,
        featherType: s.feather,
        speed: s.speed,
        tier: s.tier,
        brandId: brands[s.brand].id,
      },
      create: {
        slug: s.slug,
        name: s.name,
        description: `${s.feather} feather shuttle, speed ${s.speed} grain.`,
        price: s.price,
        salePrice: s.salePrice ?? null,
        stock: s.stock,
        featherType: s.feather,
        speed: s.speed,
        tier: s.tier,
        brandId: brands[s.brand].id,
      },
    });
  }

  console.log(`Seeded: admin=${admin.email}, brands=${brandDefs.length}, shuttles=${SHUTTLES.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
