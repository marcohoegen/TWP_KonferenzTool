import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

// npx prisma db seed --> Erstellung von zufälligen, neuen Testdaten - neu generierter Seed wird in seed-info.json gespeichert
// SEED=12345 npx prisma db seed --> Verwendung des angegebenen Seeds

const prisma = new PrismaClient();
const seedFilePath = path.join(__dirname, 'seed-info.json');

function getSeed(): number {
  const envSeed = process.env.SEED;
  if (envSeed) {
    console.log(`\n🌱 Using faker seed from ENV: ${envSeed}\n`);
    return Number(envSeed);
  }

  const newSeed = Math.floor(Math.random() * 1_000_000);
  console.log(`\n🌱 Generated new seed: ${newSeed}`);

  let existingData: { seeds: number[] } = { seeds: [] };

  if (fs.existsSync(seedFilePath)) {
    try {
      existingData = JSON.parse(fs.readFileSync(seedFilePath, 'utf8')) as {
        seeds: number[];
      };
    } catch {
      existingData = { seeds: [] };
    }
  }

  existingData.seeds.push(newSeed);
  fs.writeFileSync(seedFilePath, JSON.stringify(existingData, null, 2));

  console.log(`💾 Saved seed to prisma/seed-info.json\n`);
  return newSeed;
}
async function main() {
  const usedSeed = getSeed();
  faker.seed(usedSeed);

  // Clear existing data

  console.log('Clearing existing data...');

  await prisma.rating.deleteMany();
  await prisma.presentation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.adminPasswordTest.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.conference.deleteMany();

  console.log('Start seeding...');

  // Admins
  await Promise.all(
    Array.from({ length: faker.number.int({ min: 5, max: 10 }) }).map(
      async () => {
        const plainPassword = faker.internet.password({
          length: faker.number.int({ min: 6, max: 16 }), //zufällige Länge zwischen
          memorable: false,
          pattern: /[A-Za-z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/,
        });

        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const admin = await prisma.admin.create({
          data: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: hashedPassword,
          },
        });

        // Klartext Passwort in AdminPasswordTest speichern
        await prisma.adminPasswordTest.create({
          data: {
            adminId: admin.id,
            password: plainPassword,
          },
        });

        return admin;
      },
    ),
  );

  // Conference
  const conference = await prisma.conference.create({
    data: {
      name: 'TechConnect 2025',
      location: faker.location.city(),
      startDate: faker.date.soon({ days: 30 }),
      endDate: faker.date.soon({ days: 35 }),
    },
  });

  // Users
  const users = await Promise.all(
    Array.from({ length: faker.number.int({ min: 30, max: 50 }) }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          code: faker.string.alphanumeric(5),
          conferenceId: conference.id,
        },
      }),
    ),
  );

  // Presentations (je User eine)
  const presentations = await Promise.all(
    users.map((user, i) =>
      prisma.presentation.create({
        data: {
          title: faker.lorem.sentence(),
          agendaPosition: i + 1,
          conferenceId: conference.id,
          userId: user.id,
        },
      }),
    ),
  );

  // Ratings ((User - 1) * Vortrag)
  const ratings: {
    rating: number;
    userId: number;
    presentationId: number;
  }[] = [];
  for (const presentation of presentations) {
    for (const user of users.filter((u) => u.id !== presentation.userId)) {
      ratings.push({
        rating: faker.number.int({ min: 1, max: 10 }),
        userId: user.id,
        presentationId: presentation.id,
      });
    }
  }
  await prisma.rating.createMany({ data: ratings });

  console.log('Seeding finished.');
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
