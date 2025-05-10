import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Placeholder icons - replace with actual icons later
const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const BarChartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);
const ToolIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);
const XIcon = () => (
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
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden"
        onClick={onClose}
      ></div>

      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-gray-700 text-white p-5 transform transition-transform z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)]`}
      >
        <div className="flex justify-between items-center mb-6 md:hidden">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={onClose}>
            <XIcon />
          </button>
        </div>

        <nav>
          <ul>
            <li className="mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                <CalendarIcon />
                <span className="ml-2">Upcoming Events</span>
              </h3>
              {/* Placeholder links - replace with actual data/links */}
              <Link
                href="#"
                className="block py-1 px-2 hover:bg-gray-600 rounded text-sm"
              >
                Event 1
              </Link>
              <Link
                href="#"
                className="block py-1 px-2 hover:bg-gray-600 rounded text-sm"
              >
                Event 2
              </Link>
            </li>
            <li className="mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                <BarChartIcon />
                <span className="ml-2">Quick Stats</span>
              </h3>
              {/* Placeholder links - replace with actual data/links */}
              <Link
                href="#"
                className="block py-1 px-2 hover:bg-gray-600 rounded text-sm"
              >
                Active Members
              </Link>
              <Link
                href="#"
                className="block py-1 px-2 hover:bg-gray-600 rounded text-sm"
              >
                Hash Cash Pool
              </Link>
            </li>
            <li>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                <ToolIcon />
                <span className="ml-2">Admin Tools</span>
              </h3>
              {/* Placeholder links - replace with actual data/links */}
              <Link
                href="#"
                className="block py-1 px-2 hover:bg-gray-600 rounded text-sm"
              >
                Attendance Tracking
              </Link>
              <Link
                href="#"
                className="block py-1 px-2 hover:bg-gray-600 rounded text-sm"
              >
                User Management
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
