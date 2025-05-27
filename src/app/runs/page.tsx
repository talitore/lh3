"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Users, Plus, Search } from "lucide-react"

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
  _count: {
    rsvps: number
  }
}

interface RunsResponse {
  runs: Run[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function RunsPage() {
  const router = useRouter()
  const [runs, setRuns] = useState<Run[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("dateTime")
  const [sortOrder, setSortOrder] = useState("desc")

  useEffect(() => {
    fetchRuns()
  }, [sortBy, sortOrder])

  const fetchRuns = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        sortBy,
        sortOrder,
        limit: "20",
      })
      
      const response = await fetch(`${API_ENDPOINTS.RUNS}?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch runs')
      }
      
      const data: RunsResponse = await response.json()
      setRuns(data.runs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date()
  }

  const filteredRuns = runs.filter(run =>
    run.descriptor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    run.number.toString().includes(searchTerm) ||
    run.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container mx-auto p-8 max-w-6xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 max-w-6xl">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Error Loading Runs</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchRuns}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Runs</h1>
        <Button asChild>
          <Link href="/runs/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Run
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search runs by description, number, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dateTime">Date</SelectItem>
                  <SelectItem value="number">Run Number</SelectItem>
                  <SelectItem value="descriptor">Description</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest</SelectItem>
                  <SelectItem value="asc">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Runs List */}
      <div className="space-y-4">
        {filteredRuns.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No runs found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No runs have been created yet.'}
                </p>
                {!searchTerm && (
                  <Button asChild>
                    <Link href="/runs/new">Create the first run</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRuns.map((run) => (
            <Card key={run.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        <Link href={`/runs/${run.id}`} className="hover:underline">
                          Run #{run.number}: {run.descriptor}
                        </Link>
                      </h3>
                      {isUpcoming(run.dateTime) && (
                        <Badge variant="default">Upcoming</Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(run.dateTime)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {run.address}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {run._count.rsvps} RSVPs
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2">
                      Organized by {run.organizer.name}
                    </p>
                  </div>
                  
                  <div className="ml-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/runs/${run.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More - Placeholder for pagination */}
      {filteredRuns.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="outline">Load More Runs</Button>
        </div>
      )}
    </div>
  )
}
