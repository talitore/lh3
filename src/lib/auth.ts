import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@/generated/prisma';
import { authenticateTestCredentialsUser } from '@/lib/testAuthUsers';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
    }),
    // Add Credentials provider only in non-production environments for testing
    // IMPORTANT: For actual test environments, use a dedicated env var like process.env.TEST_ENV === 'true'
    // Using 'development' here as a placeholder because Playwright's webServer runs `pnpm dev`
    ...(process.env.E2E_TESTING_MODE === 'true'
      ? [
          CredentialsProvider({
            id: 'test-credentials',
            name: 'Test Credentials',
            credentials: {
              username: {
                label: 'TestUsername',
                type: 'text',
                placeholder: 'testuser',
              },
              // We don't actually need a password field for this mock,
              // but NextAuth expects the credentials object.
            },
            async authorize(credentials) {
              // Logic moved to authenticateTestCredentialsUser
              return authenticateTestCredentialsUser(
                credentials?.username,
                prisma
              );
            },
          }),
        ]
      : []),
  ],
  secret: process.env.AUTH_SECRET || '',
  session: {
    strategy: 'jwt', // Using JWT strategy
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and user id/role to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        // User object is available on sign-in
        token.id = user.id;
        token.role = user.role; // Assuming user object has role from adapter/db
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token, user id, and role.
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        // session.accessToken = token.accessToken as string; // Optional: if you need accessToken client-side
      }
      return session;
    },
  },
};
