// next-auth.d.ts
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      // id: string; // If you're using a database adapter and want to add user ID to session
    } & DefaultSession['user'];
  }
}
