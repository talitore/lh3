'use client'; // Ensure this is a client component

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react'; // Import NextAuth hooks

// Placeholder icons - replace with actual icons later
const MenuIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12h18M3 6h18M3 18h18"></path>
  </svg>
);

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { data: session, status } = useSession(); // Get session status

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="mr-4">
          <MenuIcon />
        </button>
        <Link href="/" className="text-xl font-bold">
          LH3
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
        {/* Placeholder for Admin Mode Toggle - kept for now */}
        <label htmlFor="adminMode" className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" id="adminMode" className="sr-only" />
            <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
          </div>
          <div className="ml-2 text-xs">Admin Mode</div>
        </label>

        {/* Auth Status Logic */}
        {status === 'loading' && <div className="text-xs">Loading...</div>}

        {status === 'unauthenticated' && (
          <button
            onClick={() => signIn('google')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
          >
            Sign in with Google
          </button>
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
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
