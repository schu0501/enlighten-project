import { db } from '../src/lib/db';
import { createParentWithChild } from '../src/lib/auth';

async function main() {
  const email = 'demo@example.com';

  await db.childProfile.deleteMany({
    where: {
      user: {
        email,
      },
    },
  });
  await db.user.deleteMany({
    where: {
      email,
    },
  });

  await createParentWithChild({
    email,
    password: 'Password123!',
    nickname: '小米',
    birthDate: new Date('2023-08-01T00:00:00.000Z'),
  });

  console.log('Seeded demo parent account: demo@example.com');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
