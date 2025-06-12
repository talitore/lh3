'use client'; // Ensure this is a client component

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { AUTH_PROVIDERS, USER_ROLES } from '@/lib/constants';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminToggle } from '@/components/layout/admin-toggle';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { data: session, status } = useSession();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="mr-4 text-white hover:bg-gray-700"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <Link href="/" className="text-xl font-bold">
          App
        </Link>
      </div>
      <nav className="hidden md:flex space-x-4">
        <Link href="/feed" className="hover:text-gray-300">
          Feed
        </Link>
        <Link href="/events" className="hover:text-gray-300">
          Events
        </Link>
        <Link href="/members" className="hover:text-gray-300">
          Members
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        {/* Show AdminToggle only for organizers and admins */}
        {status === 'authenticated' && session?.user &&
         (session.user.role === USER_ROLES.ORGANIZER || session.user.role === USER_ROLES.ADMIN) && (
          <AdminToggle />
        )}

        {/* Auth Status Logic */}
        {status === 'loading' && <div className="text-xs">Loading...</div>}

        {status === 'unauthenticated' && (
          <Button
            onClick={() => signIn(AUTH_PROVIDERS.GOOGLE)}
            variant="default"
            size="sm"
            className="bg-blue-500 hover:bg-blue-700"
          >
            Sign in with Google
          </Button>
        )}

        {status === 'authenticated' && session?.user && (
          <div className="flex items-center space-x-2">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || 'User avatar'}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm hidden sm:inline">
              {session.user.name || session.user.email}
            </span>
            <Button
              onClick={() => signOut()}
              variant="destructive"
              size="sm"
            >
              Sign out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
