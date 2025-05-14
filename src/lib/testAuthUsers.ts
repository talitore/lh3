import { PrismaClient, User, Role } from '@/generated/prisma';

interface TestUserConfig {
  name: string;
  role: Role;
  idSuffix: string; // To ensure unique IDs if needed, e.g., for upsert create
}

const testUserConfigs: Record<string, TestUserConfig> = {
  'testuser@example.com': {
    name: 'Test User',
    role: Role.ADMIN,
    idSuffix: 'credentials-admin',
  },
  'organizer@example.com': {
    name: 'Organizer User',
    role: Role.ORGANIZER,
    idSuffix: 'credentials-organizer',
  },
  'user@example.com': {
    name: 'Basic User',
    role: Role.USER,
    idSuffix: 'credentials-user',
  },
  'another-organizer@example.com': {
    name: 'Another Organizer User',
    role: Role.ORGANIZER,
    idSuffix: 'credentials-another-organizer',
  },
  'another-basic-user@example.com': {
    name: 'Another Basic User',
    role: Role.USER,
    idSuffix: 'credentials-another-user',
  },
};

export async function authenticateTestCredentialsUser(
  username: string | undefined,
  prisma: PrismaClient
): Promise<User | null> {
  if (!username || !testUserConfigs[username]) {
    console.error(`[Auth Debug] Invalid or missing username: ${username}`);
    return null;
  }

  const config = testUserConfigs[username];
  const email = username; // Username is the email

  try {
    const user = await prisma.user.upsert({
      where: { email: email },
      update: {
        name: config.name,
        role: config.role,
        image: `https://via.placeholder.com/150?text=${config.name.replace(
          /\s+/g,
          '+'
        )}`,
      },
      create: {
        // Attempt to create a more deterministic ID if possible, or let Prisma handle it if not critical.
        // For test credentials, a simple ID might be fine.
        // id: `test-user-${config.idSuffix}`, // Prisma might not allow setting ID if it's auto-increment or CUID by default. Let's rely on email for unique constraint and let ID be generated.
        email: email,
        name: config.name,
        image: `https://via.placeholder.com/150?text=${config.name.replace(
          /\s+/g,
          '+'
        )}`,
        role: config.role,
      },
    });
    return user;
  } catch (error) {
    console.error(
      `[Auth Debug] Error upserting test user ${email}:`,
      error,
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
    return null; // Or handle error as appropriate
  }
}
