const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
const prisma = require('../lib/prisma');

async function run() {
  const username = process.env.SEED_ADMIN_USERNAME || 'admin123';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    console.log(`Admin '${username}' already exists. Nothing to do.`);
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { username, password: hashedPassword, role: 'admin' }
    });
    console.log(`Created admin '${username}' with PostgreSQL/Prisma.`);
  }

  await prisma.$disconnect();
}

run().catch(err => {
  console.error(err);
  prisma.$disconnect().finally(() => process.exit(1));
});
