'use client'; // This component needs client-side features

import { useState } from 'react';
import Header from '@/components/layout/header';
import EnhancedSidebar from '@/components/layout/enhanced-sidebar';
import { SkipLink } from '@/components/ui/skip-link';
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
      {/* Skip link for accessibility */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>

      <Header onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <EnhancedSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        <main id="main-content" className="flex-grow p-4" role="main">
          {children}
        </main>
      </div>
      {/* Footer will go here (optional) */}
    </>
  );
}
