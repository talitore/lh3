"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Users, 
  Calendar, 
  Search, 
  Check, 
  X,
  UserCheck,
  Filter
} from "lucide-react"
import { toast } from "sonner"

// Import constants
import { API_ENDPOINTS } from "@/lib/constants/api"

interface Run {
  id: string
  number: number
  descriptor: string
  dateTime: string
  rsvps: Array<{
    id: string
    status: 'YES' | 'NO' | 'MAYBE'
    user: {
      id: string
      name: string
      email: string
    }
  }>
  attendees: Array<{
    id: string
    user: {
      id: string
      name: string
      email: string
    }
  }>
}

export default function AttendanceTracking() {
  const [runs, setRuns] = useState<Run[]>([])
  const [selectedRun, setSelectedRun] = useState<Run | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchRuns()
  }, [])

  const fetchRuns = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        sortBy: "dateTime",
        sortOrder: "desc",
        limit: "20"
      })
      
      const response = await fetch(`${API_ENDPOINTS.RUNS}?${params}`)
      if (response.ok) {
        const data = await response.json()
        setRuns(data.runs)
        
        // Auto-select the most recent completed run
        const completedRuns = data.runs.filter((run: Run) => new Date(run.dateTime) < new Date())
        if (completedRuns.length > 0) {
          setSelectedRun(completedRuns[0])
        }
      }
    } catch (error) {
      console.error('Error fetching runs:', error)
      toast.error('Failed to load runs')
    } finally {
      setLoading(false)
    }
  }

  const markAttendance = async (userId: string, attended: boolean) => {
    if (!selectedRun) return

    try {
      const response = await fetch(`${API_ENDPOINTS.RUNS}/${selectedRun.id}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, attended }),
      })

      if (response.ok) {
        // Update local state
        setSelectedRun(prev => {
          if (!prev) return prev
          
          const updatedAttendees = attended 
            ? [...prev.attendees, { id: `temp-${userId}`, user: prev.rsvps.find(r => r.user.id === userId)!.user }]
            : prev.attendees.filter(a => a.user.id !== userId)
          
          return {
            ...prev,
            attendees: updatedAttendees
          }
        })
        
        toast.success(attended ? 'Marked as attended' : 'Removed from attendance')
      } else {
        throw new Error('Failed to update attendance')
      }
    } catch (error) {
      console.error('Error updating attendance:', error)
      toast.error('Failed to update attendance')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isCompleted = (dateString: string) => {
    return new Date(dateString) < new Date()
  }

  const getFilteredRSVPs = () => {
    if (!selectedRun) return []
    
    let filtered = selectedRun.rsvps
    
    if (searchTerm) {
      filtered = filtered.filter(rsvp => 
        rsvp.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rsvp.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter !== "all") {
      if (statusFilter === "attended") {
        filtered = filtered.filter(rsvp => 
          selectedRun.attendees.some(a => a.user.id === rsvp.user.id)
        )
      } else if (statusFilter === "not-attended") {
        filtered = filtered.filter(rsvp => 
          !selectedRun.attendees.some(a => a.user.id === rsvp.user.id)
        )
      } else {
        filtered = filtered.filter(rsvp => rsvp.status === statusFilter)
      }
    }
    
    return filtered
  }

  const isUserAttended = (userId: string) => {
    return selectedRun?.attendees.some(a => a.user.id === userId) || false
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96" />
          <div className="lg:col-span-2">
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <UserCheck className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Attendance Tracking</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Run Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Select Run
            </CardTitle>
            <CardDescription>Choose a run to track attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {runs.map((run) => (
                <div
                  key={run.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRun?.id === run.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRun(run)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">
                        Run #{run.number}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {run.descriptor}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(run.dateTime)}
                      </p>
                    </div>
                    <div className="ml-2 flex flex-col items-end space-y-1">
                      <Badge variant={isCompleted(run.dateTime) ? "secondary" : "default"}>
                        {isCompleted(run.dateTime) ? "Completed" : "Upcoming"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {run.rsvps.length} RSVPs
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Management */}
        <div className="lg:col-span-2">
          {selectedRun ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Run #{selectedRun.number} Attendance
                  </div>
                  <Badge variant="outline">
                    {selectedRun.attendees.length} / {selectedRun.rsvps.length} attended
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {selectedRun.descriptor} - {formatDate(selectedRun.dateTime)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Members</SelectItem>
                      <SelectItem value="YES">RSVP: Yes</SelectItem>
                      <SelectItem value="MAYBE">RSVP: Maybe</SelectItem>
                      <SelectItem value="NO">RSVP: No</SelectItem>
                      <SelectItem value="attended">Attended</SelectItem>
                      <SelectItem value="not-attended">Not Attended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Member List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {getFilteredRSVPs().map((rsvp) => {
                    const attended = isUserAttended(rsvp.user.id)
                    
                    return (
                      <div
                        key={rsvp.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            attended ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          <div>
                            <p className="font-medium">{rsvp.user.name}</p>
                            <p className="text-sm text-muted-foreground">{rsvp.user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={rsvp.status === 'YES' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {rsvp.status}
                          </Badge>
                          
                          {isCompleted(selectedRun.dateTime) && (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant={attended ? "default" : "outline"}
                                onClick={() => markAttendance(rsvp.user.id, true)}
                                disabled={attended}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant={attended ? "outline" : "secondary"}
                                onClick={() => markAttendance(rsvp.user.id, false)}
                                disabled={!attended}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {getFilteredRSVPs().length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== "all" 
                        ? "No members match your filters" 
                        : "No RSVPs for this run"
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a run from the list to track attendance
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
