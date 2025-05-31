"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Plus, TrendingUp, Camera, Clock, Filter } from "lucide-react"
import Image from "next/image"
import { type RSVPCounts, type RSVPStatus } from "@/components/ui/rsvp-buttons"
import { RunCard } from "@/components/ui/run-card"
import { FeedSkeleton } from "@/components/ui/loading-states"

// Import constants
import { API_ENDPOINTS } from "@/lib/constants/api"

interface Run {
  id: string
  number: number
  descriptor: string
  dateTime: string
  address: string
  organizer: {
    id: string
    name: string
  }
  rsvps?: Array<{
    id: string
    status: 'YES' | 'NO' | 'MAYBE'
    user: {
      id: string
      name: string
    }
  }>
  _count: {
    rsvps: number
  }
}

interface RunsResponse {
  data: Run[]
  pagination: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

interface CommunityStats {
  totalMembers: number
  activeMembers: number
  runsThisMonth: number
  averageAttendance: number
  totalRuns: number
  hashCashPool: number
}

interface RecentPhoto {
  id: string
  url: string
  runId: string
  runNumber: number
  uploadedBy: {
    name: string
  }
}

export default function Home() {
  const { data: session } = useSession()
  const [upcomingRuns, setUpcomingRuns] = useState<Run[]>([])
  const [recentRuns, setRecentRuns] = useState<Run[]>([])
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null)
  const [recentPhotos, setRecentPhotos] = useState<RecentPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("dateTime")
  const [sortOrder, setSortOrder] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreRuns, setHasMoreRuns] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    fetchFeedData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Reset pagination and refetch when filters change
    setCurrentPage(1)
    setRecentRuns([])
    fetchRecentRuns(true)
  }, [sortBy, sortOrder]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchFeedData = async () => {
    try {
      setLoading(true)

      // Fetch upcoming runs
      const upcomingParams = new URLSearchParams({
        sortBy: "dateTime",
        sortOrder: "asc",
        limit: "3",
        status: "upcoming"
      })

      const upcomingResponse = await fetch(`${API_ENDPOINTS.RUNS}?${upcomingParams}`)

      if (upcomingResponse.ok) {
        const upcomingData: RunsResponse = await upcomingResponse.json()
        setUpcomingRuns(upcomingData.data)
      }

      // Fetch recent runs
      const recentParams = new URLSearchParams({
        sortBy: "dateTime",
        sortOrder: "desc",
        limit: "5"
      })

      const recentResponse = await fetch(`${API_ENDPOINTS.RUNS}?${recentParams}`)

      if (recentResponse.ok) {
        const recentData: RunsResponse = await recentResponse.json()
        setRecentRuns(recentData.data)
      }

      // Fetch community stats
      try {
        const statsResponse = await fetch('/api/stats/community')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setCommunityStats(statsData)
        } else {
          // Fallback to calculated stats if API doesn't exist
          const currentMonth = new Date().getMonth()
          const currentYear = new Date().getFullYear()
          const runsThisMonth = recentRuns.filter(run => {
            const runDate = new Date(run.dateTime)
            return runDate.getMonth() === currentMonth && runDate.getFullYear() === currentYear
          }).length

          setCommunityStats({
            totalMembers: 247, // Mock data - would come from user count
            activeMembers: 89,  // Mock data - would come from recent activity
            runsThisMonth: runsThisMonth || 12,
            averageAttendance: 15, // Mock data - would be calculated
            totalRuns: recentRuns.length * 10, // Rough estimate
            hashCashPool: 1250 // Mock data - would come from financial tracking
          })
        }
      } catch {
        console.log('Stats API not available, using fallback data')
        setCommunityStats({
          totalMembers: 247,
          activeMembers: 89,
          runsThisMonth: 12,
          averageAttendance: 15,
          totalRuns: 150,
          hashCashPool: 1250
        })
      }

      // Fetch recent photos
      try {
        const photosResponse = await fetch('/api/photos/recent?limit=6')
        if (photosResponse.ok) {
          const photosData = await photosResponse.json()
          setRecentPhotos(photosData.photos || [])
        }
      } catch {
        console.log('Photos API not available')
        setRecentPhotos([])
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentRuns = async (reset = false) => {
    try {
      if (reset) {
        setLoadingMore(false)
      } else {
        setLoadingMore(true)
      }

      const page = reset ? 1 : currentPage
      const recentParams = new URLSearchParams({
        sortBy,
        sortOrder,
        limit: "5",
        page: page.toString()
      })

      const recentResponse = await fetch(`${API_ENDPOINTS.RUNS}?${recentParams}`)

      if (recentResponse.ok) {
        const recentData: RunsResponse = await recentResponse.json()

        if (reset) {
          setRecentRuns(recentData.data)
        } else {
          setRecentRuns(prev => [...prev, ...recentData.data])
        }

        setHasMoreRuns(recentData.pagination.page < recentData.pagination.totalPages)

        if (!reset) {
          setCurrentPage(prev => prev + 1)
        }
      }
    } catch (err) {
      console.error('Error fetching recent runs:', err)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore && hasMoreRuns) {
      fetchRecentRuns(false)
    }
  }

  const getFilteredRuns = () => {
    if (!recentRuns || !Array.isArray(recentRuns)) return []

    let filtered = recentRuns

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(run =>
        run.descriptor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        run.number.toString().includes(searchTerm) ||
        run.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        run.organizer.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "upcoming") {
        filtered = filtered.filter(run => isUpcoming(run.dateTime))
      } else if (statusFilter === "completed") {
        filtered = filtered.filter(run => !isUpcoming(run.dateTime))
      }
    }

    return filtered
  }



  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date()
  }

  const getNextRun = () => {
    if (!upcomingRuns || upcomingRuns.length === 0) return null
    return upcomingRuns.find(run => isUpcoming(run.dateTime))
  }



  const getUserRsvp = (run: Run): RSVPStatus | null => {
    if (!session?.user?.id || !run?.rsvps) return null
    const userRsvp = run.rsvps.find(rsvp => rsvp.user.id === session.user!.id)
    return userRsvp?.status || null
  }

  const handleRsvpChange = (runId: string, newStatus: RSVPStatus, newCounts: RSVPCounts) => {
    // Update the run data optimistically
    setUpcomingRuns(prev =>
      prev.map(run =>
        run.id === runId
          ? { ...run, _count: { ...run._count, rsvps: newCounts.yes + newCounts.maybe + newCounts.no } }
          : run
      )
    )
  }

  const nextRun = getNextRun()

  if (loading) {
    return <FeedSkeleton />
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">LH3 Feed</h1>
        <Button asChild>
          <Link href="/runs/new">
            <Plus className="h-4 w-4 mr-2" />
            New Run
          </Link>
        </Button>
      </div>

      {/* Next Run Card */}
      {nextRun && (
        <div className="mb-8">
          <RunCard
            run={nextRun}
            variant="featured"
            currentUserRsvp={getUserRsvp(nextRun)}
            onRsvpChange={(newStatus, newCounts) => handleRsvpChange(nextRun.id, newStatus, newCounts)}
          />
        </div>
      )}

      {/* Recent Activity */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <div className="relative">
              <Input
                placeholder="Search runs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Runs</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateTime">Date</SelectItem>
                <SelectItem value="number">Run #</SelectItem>
                <SelectItem value="descriptor">Name</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full md:w-28">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest</SelectItem>
                <SelectItem value="asc">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-muted-foreground">Error loading feed: {error}</p>
                <Button onClick={fetchFeedData} className="mt-2">Try Again</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {getFilteredRuns().length === 0 && !error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || statusFilter !== "all" ? "No matching runs" : "No runs yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Be the first to create a run for the community!"
                  }
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Button asChild>
                    <Link href="/runs/new">Create First Run</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          getFilteredRuns().map((run) => (
            <RunCard
              key={run.id}
              run={run}
              variant="default"
              currentUserRsvp={getUserRsvp(run)}
              onRsvpChange={(newStatus, newCounts) => handleRsvpChange(run.id, newStatus, newCounts)}
              showRsvp={isUpcoming(run.dateTime)}
            />
          ))
        )}

        {/* Community Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Community Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            {communityStats ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{communityStats.averageAttendance}</div>
                  <div className="text-sm text-muted-foreground">Average Attendance</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{communityStats.activeMembers}</div>
                  <div className="text-sm text-muted-foreground">Active Members</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{communityStats.runsThisMonth}</div>
                  <div className="text-sm text-muted-foreground">Runs This Month</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{communityStats.totalMembers}</div>
                  <div className="text-sm text-muted-foreground">Total Members</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">${communityStats.hashCashPool}</div>
                  <div className="text-sm text-muted-foreground">Hash Cash Pool</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{communityStats.totalRuns}</div>
                  <div className="text-sm text-muted-foreground">Total Runs</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Recent Photos
              </div>
              <Badge variant="outline">{recentPhotos.length} photos</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentPhotos.length > 0 ? (
              <>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {recentPhotos.map((photo) => (
                    <div key={photo.id} className="aspect-square relative rounded-lg overflow-hidden group cursor-pointer">
                      <Image
                        src={photo.url}
                        alt={`Photo from Run #${photo.runNumber}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 33vw, 16vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-white text-xs font-medium">
                          Run #{photo.runNumber}
                        </p>
                        <p className="text-white/80 text-xs">
                          by {photo.uploadedBy.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/photos">View All Photos</Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No photos yet</p>
                <p className="text-sm text-muted-foreground">
                  Photos from recent runs will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Load More */}
        <div className="text-center space-y-4">
          {hasMoreRuns && getFilteredRuns().length > 0 && (
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="min-w-32"
            >
              {loadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                'Load More Runs'
              )}
            </Button>
          )}

          <div>
            <Button variant="outline" asChild>
              <Link href="/runs">View All Runs</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
