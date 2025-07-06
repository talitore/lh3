import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { User } from "../types";
import { editPasswordPath, rootPath, sessionsPath, signInPath } from "@/routes";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface PageProps {
  user: User | null;
  [key: string]: unknown;
}

interface DefaultLayoutProps {
  children: React.ReactNode;
}

/**
 * Provides a page layout with a sticky header, navigation menu, and main content area.
 *
 * Renders navigation links and a welcome message based on user authentication status. The main content is displayed below the header.
 *
 * @param children - The content to display within the layout
 */
export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const { user } = usePage<PageProps>().props;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link
              href={rootPath()}
              className="mr-6 flex items-center space-x-2"
            >
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                LH3
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    asChild
                  >
                    <Link href={rootPath()}>Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {user ? (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                        asChild
                      >
                        <Link href={sessionsPath()}>Sessions</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                        asChild
                      >
                        <Link href={editPasswordPath()}>Settings</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </>
                ) : (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      asChild
                    >
                      <Link href={signInPath()}>Sign In</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.display_name}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
