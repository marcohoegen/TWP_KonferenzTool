import { PrismaClient, PresentationStatus, Conference } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { CreateRatingDto } from 'src/rating/dto/create-rating.dto';

// npx prisma db seed --> Erstellung von zufälligen, neuen Testdaten - neu generierter Seed wird in seed-info.json gespeichert
// SEED=12345 npx prisma db seed --> Verwendung des angegebenen Seeds

const prisma = new PrismaClient();
const seedFilePath = path.join(__dirname, 'seed-info.json');

function getSeed(): number {
  const envSeed = process.env.SEED;
  if (envSeed) {
    console.log(`\nUsing faker seed from ENV: ${envSeed}\n`);
    return Number(envSeed);
  }

  const newSeed = Math.floor(Math.random() * 1_000_000);
  console.log(`\nGenerated new seed: ${newSeed}`);

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

  console.log(`Saved seed to prisma/seed-info.json\n`);
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
          // eslint-disable-next-line no-useless-escape
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
  const numberOfConferences = faker.number.int({ min: 2, max: 3 });
  const conferences: Conference[] = [];

  for (let c = 0; c < numberOfConferences; c++) {
    console.log(`Seeding conference ${c + 1} of ${numberOfConferences}...`);

    const conference = await prisma.conference.create({
      data: {
        name: `${faker.company.name()} Conference`,
        location: faker.location.city(),
        startDate: faker.date.soon({ days: 30 }),
        endDate: faker.date.soon({ days: 35 }),
      },
    });

    conferences.push(conference);

    // Users
    const users = await Promise.all(
      Array.from({ length: faker.number.int({ min: 30, max: 50 }) }).map(() =>
        prisma.user.create({
          data: {
            email: faker.internet.email(),
            name: faker.person.fullName(),
            code: Array.from({ length: 5 }, () =>
              faker.helpers.arrayElement(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''),
              ),
            ).join(''),
            conferenceId: conference.id,
          },
        }),
      ),
    );
    // default Session erstellen
    await prisma.session.create({
      data: {
        sessionName: 'presentations',
        conferenceId: conference.id,
        sessionNumber: 0,
      },
    });
    // Sessions (1-5 pro Konferenz)
    const numberOfSessions = faker.number.int({ min: 1, max: 5 });

    const sessions = await Promise.all(
      Array.from({ length: numberOfSessions }).map((_, i) =>
        prisma.session.create({
          data: {
            sessionName: `Session ${i + 1}`,
            conferenceId: conference.id,
            sessionNumber: i + 1,
          },
        }),
      ),
    );

    // Presentations mit mehreren Presenters (m:n Beziehung)
    const numberOfPresentations = faker.number.int({ min: 15, max: 25 });
    const presentations = await Promise.all(
      Array.from({ length: numberOfPresentations }).map((_, i) => {
        // Wähle 1-3 zufällige User als Präsentatoren
        const numberOfPresenters = faker.number.int({ min: 1, max: 3 });
        const shuffledUsers = faker.helpers.shuffle(users);
        const selectedPresenters = shuffledUsers.slice(0, numberOfPresenters);
        const randomSession =
          sessions[faker.number.int({ min: 0, max: sessions.length - 1 })];

        return prisma.presentation.create({
          data: {
            title: faker.lorem.sentence(),
            agendaPosition: i + 1,
            conferenceId: conference.id,
            status: PresentationStatus.INACTIVE,
            sessionId: randomSession.id,
            presenters: {
              connect: selectedPresenters.map((user) => ({ id: user.id })),
            },
          },
          include: {
            presenters: true,
          },
        });
      }),
    );

    // Ratings ((User - 1) * Vortrag)
    const ratings: CreateRatingDto[] = [];
    for (const presentation of presentations) {
      const presenterIds = presentation.presenters.map((p) => p.id);

      for (const user of users.filter((u) => !presenterIds.includes(u.id))) {
        ratings.push({
          contentsRating: faker.number.int({ min: 1, max: 5 }),
          styleRating: faker.number.int({ min: 1, max: 5 }),
          slidesRating: faker.number.int({ min: 1, max: 5 }),
          userId: user.id,
          presentationId: presentation.id,
        });
      }
    }
    await prisma.rating.createMany({ data: ratings });

    console.log('Seeding finished.');
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
