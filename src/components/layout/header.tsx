import Link from 'next/link';

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
const UserIcon = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
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
        {/* Placeholder for Admin Mode Toggle */}
        <label htmlFor="adminMode" className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" id="adminMode" className="sr-only" />
            <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
          </div>
          <div className="ml-2 text-xs">Admin Mode</div>
        </label>
        <UserIcon />
      </div>
    </header>
  );
}
