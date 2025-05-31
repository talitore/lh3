"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, Users, DollarSign, Award, Download, BarChart3 } from "lucide-react"
import Link from "next/link"

// Import constants
import { USER_ROLES } from "@/lib/constants"

interface AdminLayoutProps {
  children: React.ReactNode
}

const adminNavItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: BarChart3,
    description: 'Overview and quick actions'
  },
  {
    href: '/admin/attendance',
    label: 'Attendance',
    icon: Users,
    description: 'Track run attendance'
  },
  {
    href: '/admin/hash-cash',
    label: 'Hash Cash',
    icon: DollarSign,
    description: 'Manage finances'
  },
  {
    href: '/admin/achievements',
    label: 'Achievements',
    icon: Award,
    description: 'Manage member awards'
  },
  {
    href: '/admin/exports',
    label: 'Data Exports',
    icon: Download,
    description: 'Export data and reports'
  }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (status === 'unauthenticated') {
      router.push('/')
      return
    }

    // Check if user has admin or organizer role
    const isAdmin = session?.user?.role === USER_ROLES.ADMIN
    const isOrganizer = session?.user?.role === USER_ROLES.ORGANIZER

    if (!isAdmin && !isOrganizer) {
      router.push('/')
      return
    }
  }, [session, status, router])

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show unauthorized if not admin/organizer
  const isAdmin = session?.user?.role === USER_ROLES.ADMIN
  const isOrganizer = session?.user?.role === USER_ROLES.ORGANIZER

  if (!isAdmin && !isOrganizer) {
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-4">
                You don&apos;t have permission to access admin tools.
              </p>
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      {/* Admin Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Admin Tools</h1>
            <p className="text-sm text-muted-foreground">
              {isAdmin ? 'Administrator' : 'Organizer'} access
            </p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {adminNavItems.map((item) => {
                  const IconComponent = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className={`text-xs ${
                          isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {children}
        </div>
      </div>
    </div>
  )
}
