// console.log(`E2E_TESTING_MODE on server: ${process.env.E2E_TESTING_MODE}`); // Debug log
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
