const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const centers = [
  {
    name: 'MARJANE DERB SULTAN',
    city: 'Casablanca',
  },
  {
    name: 'MARJANE HAY HASSANI',
    city: 'Casablanca',
  },
  {
    name: 'MARJANE MENARA',
    city: 'Marrakech',
  },
  {
    name: 'MARJANE MARRA. MASSIRA',
    city: 'Marrakech',
  },
  {
    name: 'MARJANE Safi',
    city: 'Safi',
  }
]

const Admin = {
  email: "admin@test.com",
  password: "BaFq_9t7WVNw0aK"
}


async function main() {
  await prisma.admin.create({ data: Admin });

  for (const { name, city } of centers) {
    await prisma.center.create({ data: { name, city } });
  }
}

main()
  .catch((e) => { throw e })
  .finally(async () => await prisma.$disconnect())