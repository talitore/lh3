import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    // User is authenticated, proceed with your logic
    return NextResponse.json({
      message: 'You are authenticated and can see this secret message!',
      user: session.user,
      // You can add any data here that should only be accessible to authenticated users
    });
  } else {
    // User is not authenticated
    return new NextResponse(
      JSON.stringify({
        message: 'Unauthorized: Please log in to access this resource.',
      }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
