'use client'; // This component needs client-side features

import { useState } from 'react';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { ReactNode } from 'react'; // Import ReactNode

export default function ClientLayoutContent({
  children,
}: {
  children: ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      {' '}
      {/* Use a fragment as the root element inside the client component */}
      <Header onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        <main className="flex-grow p-4">{children}</main>
      </div>
      {/* Footer will go here (optional) */}
    </>
  );
}
