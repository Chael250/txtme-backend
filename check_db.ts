import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkContacts() {
  const contacts = await prisma.contact.findMany({
    select: {
      firstname: true,
      lastname: true,
      company: true,
    }
  });
  console.log('Contacts in DB:', JSON.stringify(contacts, null, 2));
}

checkContacts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
