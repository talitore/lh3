import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
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
            async authorize(credentials, req) {
              // This is where you'd normally validate credentials against a database
              // For testing, we'll accept a specific username and return a mock user
              if (credentials?.username === 'testuser@example.com') {
                // Return a mock user object
                // Ensure this shape matches what your application expects for a session user
                return {
                  id: 'test-user-id',
                  name: 'Test User',
                  email: 'testuser@example.com',
                  image: 'https://via.placeholder.com/150', // Optional mock image
                };
              }
              // If credentials are not valid, return null
              return null;
            },
          }),
        ]
      : []),
  ],
  secret: process.env.AUTH_SECRET || '',
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      // @ts-expect-error // TODO: look into this TS error
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
