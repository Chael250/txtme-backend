import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://txtme_user:txtme_password@localhost:5433/txtme_db?schema=public'
    }
  }
});

async function checkContacts() {
  const contacts = await prisma.contact.findMany({
    select: {
      firstname: true,
      lastname: true,
      company: true,
    }
  });
  console.log('Contacts in DB (Port 5433):', JSON.stringify(contacts, null, 2));
}

checkContacts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
