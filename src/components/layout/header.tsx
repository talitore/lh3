'use client'; // Ensure this is a client component

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { AUTH_PROVIDERS, USER_ROLES } from '@/lib/constants';
import { Menu, Home, Calendar, Users, Settings, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AdminToggle } from '@/components/layout/admin-toggle';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: '/', label: 'Home', icon: Home, show: true },
    { href: '/runs', label: 'Runs', icon: Calendar, show: true },
    { href: '/runs/new', label: 'New Run', icon: Plus, show: status === 'authenticated' },
    {
      href: '/admin',
      label: 'Admin',
      icon: Settings,
      show: status === 'authenticated' && session?.user &&
            (session.user.role === USER_ROLES.ORGANIZER || session.user.role === USER_ROLES.ADMIN),
      badge: session?.user?.role === USER_ROLES.ADMIN ? 'Admin' : 'Org'
    }
  ];

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center">
        {/* Desktop Sidebar Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="mr-4 text-white hover:bg-gray-700 hidden md:flex"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Mobile Menu Toggle */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="mr-4 text-white hover:bg-gray-700 md:hidden"
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 space-y-2">
              {navigationItems.filter(item => item.show).map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href={item.href} className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="text-xl font-bold">
          LH3
        </Link>
      </div>
      <nav className="hidden md:flex items-center space-x-1">
        {navigationItems.filter(item => item.show).map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            size="sm"
            asChild
            className="text-white hover:bg-gray-700"
          >
            <Link href={item.href} className="flex items-center space-x-1">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          </Button>
        ))}
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
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-medium">
                {session.user.name || session.user.email}
              </span>
              {session.user.role && session.user.role !== USER_ROLES.USER && (
                <Badge variant="outline" className="text-xs w-fit">
                  {session.user.role}
                </Badge>
              )}
            </div>
            <Button
              onClick={() => signOut()}
              variant="destructive"
              size="sm"
              className="text-xs px-2 py-1"
            >
              <span className="hidden sm:inline">Sign out</span>
              <span className="sm:hidden">Out</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
