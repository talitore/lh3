"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Calendar, BarChart3, Settings, Users, TrendingUp, Clock, ChevronRight } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Import constants
import { API_ENDPOINTS } from "@/lib/constants/api"
import { USER_ROLES } from "@/lib/constants"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface UpcomingRun {
  id: string
  number: number
  descriptor: string
  dateTime: string
  _count: {
    rsvps: number
  }
}

interface Stats {
  totalMembers: number
  activeMembers: number
  upcomingRuns: number
  thisMonthRuns: number
  hashCashPool: number
}

const iconMap = {
  calendar: Calendar,
  'bar-chart': BarChart3,
  settings: Settings,
} as const

const getIcon = (iconName: string) => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap]
  return IconComponent ? <IconComponent className="h-4 w-4" /> : null
}

export default function EnhancedSidebar({ isOpen, onClose }: SidebarProps) {
  const { data: session } = useSession()
  const [upcomingRuns, setUpcomingRuns] = useState<UpcomingRun[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchSidebarData()
    }
  }, [isOpen])

  const fetchSidebarData = async () => {
    try {
      setLoading(true)
      
      // Fetch upcoming runs
      const runsParams = new URLSearchParams({
        sortBy: "dateTime",
        sortOrder: "asc",
        limit: "5",
        status: "upcoming"
      })
      
      const runsResponse = await fetch(`${API_ENDPOINTS.RUNS}?${runsParams}`)
      if (runsResponse.ok) {
        const runsData = await runsResponse.json()
        setUpcomingRuns(runsData.runs)
      }
      
      // Mock stats for now - in real implementation, these would come from API
      setStats({
        totalMembers: 247,
        activeMembers: 89,
        upcomingRuns: upcomingRuns.length,
        thisMonthRuns: 12,
        hashCashPool: 1250
      })
      
    } catch (error) {
      console.error('Error fetching sidebar data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays < 7) return `${diffDays} days`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const isAdmin = session?.user?.role === USER_ROLES.ADMIN
  const isOrganizer = session?.user?.role === USER_ROLES.ORGANIZER || isAdmin

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 bg-gray-700 text-white border-gray-600 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Upcoming Events Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming Events
            </h3>
            
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full bg-gray-600" />
                ))}
              </div>
            ) : upcomingRuns.length > 0 ? (
              <div className="space-y-2">
                {upcomingRuns.slice(0, 4).map((run) => (
                  <Card key={run.id} className="bg-gray-600 border-gray-500 hover:bg-gray-500 transition-colors">
                    <CardContent className="p-3">
                      <Link href={`/runs/${run.id}`} onClick={onClose}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white truncate">
                              Run #{run.number}
                            </h4>
                            <p className="text-xs text-gray-300 truncate">
                              {run.descriptor}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-400">
                                {formatDate(run.dateTime)}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {run._count.rsvps} RSVPs
                              </Badge>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
                
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="w-full justify-start text-white hover:bg-gray-600 hover:text-white mt-2"
                >
                  <Link href="/runs" onClick={onClose}>
                    View All Runs
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400">No upcoming runs</p>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="mt-2 border-gray-500 text-gray-300 hover:bg-gray-600"
                >
                  <Link href="/runs/new" onClick={onClose}>
                    Create Run
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <Separator className="bg-gray-600" />

          {/* Quick Stats Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Quick Stats
            </h3>
            
            {loading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-gray-600" />
                ))}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 gap-2">
                <Card className="bg-gray-600 border-gray-500">
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold text-white">{stats.activeMembers}</div>
                    <div className="text-xs text-gray-300">Active Members</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-600 border-gray-500">
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold text-white">{stats.thisMonthRuns}</div>
                    <div className="text-xs text-gray-300">Runs This Month</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-600 border-gray-500">
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold text-white">${stats.hashCashPool}</div>
                    <div className="text-xs text-gray-300">Hash Cash Pool</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-600 border-gray-500">
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold text-white">{stats.totalMembers}</div>
                    <div className="text-xs text-gray-300">Total Members</div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
            
            <div className="mt-3 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start text-white hover:bg-gray-600 hover:text-white"
              >
                <Link href="/stats/members" onClick={onClose}>
                  Member Stats
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start text-white hover:bg-gray-600 hover:text-white"
              >
                <Link href="/stats/runs" onClick={onClose}>
                  Run Statistics
                </Link>
              </Button>
            </div>
          </div>

          {/* Admin Tools Section */}
          {(isAdmin || isOrganizer) && (
            <>
              <Separator className="bg-gray-600" />
              
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Tools
                </h3>
                
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full justify-start text-white hover:bg-gray-600 hover:text-white"
                  >
                    <Link href="/admin/attendance" onClick={onClose}>
                      Attendance Tracking
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full justify-start text-white hover:bg-gray-600 hover:text-white"
                  >
                    <Link href="/admin/hash-cash" onClick={onClose}>
                      Hash Cash Management
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full justify-start text-white hover:bg-gray-600 hover:text-white"
                  >
                    <Link href="/admin/achievements" onClick={onClose}>
                      Manage Achievements
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full justify-start text-white hover:bg-gray-600 hover:text-white"
                    >
                      <Link href="/admin/users" onClick={onClose}>
                        User Management
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
