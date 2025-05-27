"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Award, 
  BarChart3, 
  FileText,
  Settings,
  ChevronRight
} from "lucide-react"

// Import constants
import { USER_ROLES } from "@/lib/constants"

export default function AdminDashboard() {
  const { data: session } = useSession()
  
  const isAdmin = session?.user?.role === USER_ROLES.ADMIN
  const isOrganizer = session?.user?.role === USER_ROLES.ORGANIZER

  const adminTools = [
    {
      title: "Attendance Tracking",
      description: "Mark users as attended for completed runs",
      icon: Users,
      href: "/admin/attendance",
      badge: "Essential",
      available: true
    },
    {
      title: "Hash Cash Management",
      description: "Track and manage Hash Cash transactions",
      icon: DollarSign,
      href: "/admin/hash-cash",
      badge: "Financial",
      available: true
    },
    {
      title: "Achievement Management",
      description: "Assign and track member achievements",
      icon: Award,
      href: "/admin/achievements",
      badge: "Recognition",
      available: true
    },
    {
      title: "User Management",
      description: "Manage user roles and permissions",
      icon: Settings,
      href: "/admin/users",
      badge: "Admin Only",
      available: isAdmin
    },
    {
      title: "Run Statistics",
      description: "View detailed analytics and reports",
      icon: BarChart3,
      href: "/admin/statistics",
      badge: "Analytics",
      available: true
    },
    {
      title: "Data Export",
      description: "Export attendance, RSVP, and other data",
      icon: FileText,
      href: "/admin/export",
      badge: "Reports",
      available: true
    }
  ]

  const quickStats = [
    {
      title: "Pending RSVPs",
      value: "23",
      description: "For upcoming runs",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Active Members",
      value: "89",
      description: "This month",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Hash Cash Pool",
      value: "$1,250",
      description: "Current balance",
      icon: DollarSign,
      color: "text-yellow-600"
    },
    {
      title: "Recent Achievements",
      value: "7",
      description: "This week",
      icon: Award,
      color: "text-purple-600"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Admin Tools */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Admin Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminTools.map((tool, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-md transition-shadow ${
                tool.available ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <CardContent className="p-6">
                {tool.available ? (
                  <Link href={tool.href} className="block">
                    <div className="flex items-start justify-between mb-3">
                      <tool.icon className="h-8 w-8 text-primary" />
                      <Badge 
                        variant={tool.badge === "Admin Only" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {tool.badge}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-2">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {tool.description}
                    </p>
                    <div className="flex items-center text-sm text-primary">
                      <span>Access Tool</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <tool.icon className="h-8 w-8 text-gray-400" />
                      <Badge variant="outline" className="text-xs">
                        {tool.badge}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-500">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {tool.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-400">
                      <span>Admin Access Required</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>Recent admin actions and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New member joined</p>
                  <p className="text-xs text-muted-foreground">John Doe registered for LH3</p>
                </div>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Run #1234 completed</p>
                  <p className="text-xs text-muted-foreground">15 attendees marked present</p>
                </div>
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Achievement awarded</p>
                  <p className="text-xs text-muted-foreground">Trail Master badge given to Jane Smith</p>
                </div>
                <span className="text-xs text-muted-foreground">2 days ago</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Hash Cash collected</p>
                  <p className="text-xs text-muted-foreground">$150 collected from Run #1233</p>
                </div>
                <span className="text-xs text-muted-foreground">3 days ago</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
