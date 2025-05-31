"use client"

import { useState, useEffect, lazy, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calendar, MapPin, Users, Info, Camera, CheckCircle, Clock, Edit, Save, X } from "lucide-react"
import { RSVPButtons, type RSVPCounts, type RSVPStatus } from "@/components/ui/rsvp-buttons"
import { WhatsHashingInfo } from "@/components/ui/whats-hashing-info"

// Lazy load heavy components
const PhotoGallery = lazy(() => import("@/components/ui/photo-gallery").then(module => ({ default: module.PhotoGallery })))

// Import constants
import { API_ENDPOINTS } from "@/lib/constants/api"

interface RunDetails {
  id: string
  number: number
  descriptor: string
  dateTime: string
  address: string
  lat?: number
  lng?: number
  introLink?: string
  organizer: {
    id: string
    name: string
    email: string
  }
  rsvps: Array<{
    id: string
    status: 'YES' | 'NO' | 'MAYBE'
    user: {
      id: string
      name: string
      email: string
    }
  }>
  photos: Array<{
    id: string
    url: string
    caption?: string
    uploadedBy: {
      id: string
      name: string
    }
  }>
  _count: {
    rsvps: number
  }
}

export default function RunDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [run, setRun] = useState<RunDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    descriptor: '',
    dateTime: '',
    address: '',
    introLink: ''
  })
  const [saving, setSaving] = useState(false)

  const runId = params.id as string

  useEffect(() => {
    if (runId) {
      fetchRunDetails()
    }
  }, [runId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRunDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINTS.RUNS}/${runId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch run details')
      }

      const runData = await response.json()
      setRun(runData)

      // Initialize edit form with current data
      setEditForm({
        descriptor: runData.descriptor || '',
        dateTime: runData.dateTime ? new Date(runData.dateTime).toISOString().slice(0, 16) : '',
        address: runData.address || '',
        introLink: runData.introLink || ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC'
    })
  }

  const getRsvpCounts = (): RSVPCounts => {
    if (!run?.rsvps) return { yes: 0, maybe: 0, no: 0 }

    return run.rsvps.reduce(
      (counts, rsvp) => {
        counts[rsvp.status.toLowerCase() as keyof typeof counts]++
        return counts
      },
      { yes: 0, maybe: 0, no: 0 }
    )
  }

  const getUserRsvp = (): RSVPStatus | null => {
    if (!session?.user?.id || !run?.rsvps) return null
    const userRsvp = run.rsvps.find(rsvp => rsvp.user.id === session.user!.id)
    return userRsvp?.status || null
  }

  const handleRsvpChange = (newStatus: RSVPStatus, newCounts: RSVPCounts) => {
    // Update the run data optimistically
    if (run) {
      setRun({
        ...run,
        _count: {
          ...run._count,
          rsvps: newCounts.yes + newCounts.maybe + newCounts.no
        }
      })
    }
  }

  const handlePhotosChange = (newPhotos: RunDetails['photos']) => {
    if (run) {
      setRun({
        ...run,
        photos: newPhotos
      })
    }
  }

  const isEventDay = () => {
    if (!run) return false
    const eventDate = new Date(run.dateTime)
    const today = new Date()
    return eventDate.toDateString() === today.toDateString()
  }

  const isEventTime = () => {
    if (!run) return false
    const eventDate = new Date(run.dateTime)
    const now = new Date()
    const timeDiff = eventDate.getTime() - now.getTime()
    // Allow check-in 30 minutes before and 2 hours after event start
    return timeDiff <= 30 * 60 * 1000 && timeDiff >= -2 * 60 * 60 * 1000
  }

  const handleCheckIn = async () => {
    if (!session?.user?.id || !run) return

    try {
      setCheckingIn(true)
      const response = await fetch(`${API_ENDPOINTS.RUNS}/${run.id}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setIsCheckedIn(true)
        // You could also show a success toast here
      } else {
        throw new Error('Failed to check in')
      }
    } catch (error) {
      console.error('Error checking in:', error)
      // You could show an error toast here
    } finally {
      setCheckingIn(false)
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to original values when canceling
      if (run) {
        setEditForm({
          descriptor: run.descriptor || '',
          dateTime: run.dateTime ? new Date(run.dateTime).toISOString().slice(0, 16) : '',
          address: run.address || '',
          introLink: run.introLink || ''
        })
      }
    }
    setIsEditing(!isEditing)
  }

  const handleSaveEdit = async () => {
    if (!run) return

    try {
      setSaving(true)
      const response = await fetch(`${API_ENDPOINTS.RUNS}/${run.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descriptor: editForm.descriptor,
          dateTime: new Date(editForm.dateTime).toISOString(),
          address: editForm.address,
          introLink: editForm.introLink || null
        }),
      })

      if (response.ok) {
        const updatedRun = await response.json()
        setRun(updatedRun)
        setIsEditing(false)
        // You could show a success toast here
      } else {
        throw new Error('Failed to update run')
      }
    } catch (error) {
      console.error('Error updating run:', error)
      // You could show an error toast here
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">Loading run details...</p>
          </div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (error || !run) {
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Error loading run details</h2>
              <p className="text-muted-foreground mb-4">
                {error || 'Run not found'}
              </p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const rsvpCounts = getRsvpCounts()
  const userRsvp = getUserRsvp()

  return (
    <main className="container mx-auto p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Runs
        </Button>

        <div className="flex space-x-2">
          {session?.user?.id === run.organizerId && (
            <>
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {saving ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleEditToggle}
                    variant="outline"
                    size="sm"
                    disabled={saving}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleEditToggle}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Run
                </Button>
              )}
            </>
          )}
          <Button variant="outline" size="sm">
            Share
          </Button>
        </div>
      </div>

      {/* Run Information */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="descriptor" className="text-base font-semibold">
                      Run #{run.number}: Description
                    </Label>
                    <Input
                      id="descriptor"
                      value={editForm.descriptor}
                      onChange={(e) => setEditForm(prev => ({ ...prev, descriptor: e.target.value }))}
                      placeholder="Enter run description"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateTime" className="text-sm font-medium">
                        Date & Time
                      </Label>
                      <Input
                        id="dateTime"
                        type="datetime-local"
                        value={editForm.dateTime}
                        onChange={(e) => setEditForm(prev => ({ ...prev, dateTime: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-sm font-medium">
                        Location
                      </Label>
                      <Input
                        id="address"
                        value={editForm.address}
                        onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter meeting location"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="introLink" className="text-sm font-medium">
                      Intro Link (Optional)
                    </Label>
                    <Input
                      id="introLink"
                      value={editForm.introLink}
                      onChange={(e) => setEditForm(prev => ({ ...prev, introLink: e.target.value }))}
                      placeholder="https://example.com/intro"
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <CardTitle>
                    <h1 className="text-2xl">
                      Run #{run.number}: {run.descriptor}
                    </h1>
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(run.dateTime)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {run.address}
                      </div>
                    </div>
                    {run.introLink && (
                      <div className="mt-2">
                        <a
                          href={run.introLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm"
                        >
                          View Intro Information →
                        </a>
                      </div>
                    )}
                  </CardDescription>
                </>
              )}
            </div>
            <Badge variant="secondary" className="ml-4">
              <Users className="h-3 w-3 mr-1" />
              {run._count?.rsvps || 0} RSVPs
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* RSVP Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">RSVP Status</h3>
          <RSVPButtons
            runId={run.id}
            currentUserRsvp={userRsvp}
            rsvpCounts={rsvpCounts}
            onRsvpChange={handleRsvpChange}
          />
        </CardContent>
      </Card>

      {/* Check-in Section */}
      {isEventDay() && session?.user && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-semibold mb-4 flex items-center justify-center">
                <Clock className="h-5 w-5 mr-2" />
                Event Day Check-In
              </h3>

              {isCheckedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center text-green-600">
                    <CheckCircle className="h-8 w-8 mr-2" />
                    <span className="text-lg font-medium">You&apos;re checked in!</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Thanks for joining us today. Have a great run!
                  </p>
                </div>
              ) : isEventTime() ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-4">
                    Check in to confirm your attendance at today&apos;s run
                  </p>
                  <Button
                    onClick={handleCheckIn}
                    disabled={checkingIn}
                    className="w-full"
                    size="lg"
                  >
                    {checkingIn ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Checking In...
                      </>
                    ) : (
                      <>
                        Check In
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Check-in will be available 30 minutes before the run starts
                  </p>
                  <Button disabled className="w-full" size="lg" variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    Check-In Not Yet Available
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* What's Hashing Info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4" />
              <span className="font-medium">New to Hash House Harriers?</span>
            </div>
            <WhatsHashingInfo size="sm" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Learn about Hash traditions, what to bring, and what to expect at your first run.
          </p>
        </CardContent>
      </Card>

      {/* Attendee List */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Attendees ({rsvpCounts.yes + rsvpCounts.maybe})
            </div>
            <Badge variant="outline">
              {rsvpCounts.yes} Yes, {rsvpCounts.maybe} Maybe, {rsvpCounts.no} No
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(run.rsvps?.length || 0) > 0 ? (
            <div className="space-y-3">
              {/* Yes RSVPs */}
              {(run.rsvps?.filter(rsvp => rsvp.status === 'YES').length || 0) > 0 && (
                <div>
                  <h4 className="font-medium text-green-700 mb-2 flex items-center">
                    <Badge variant="default" className="mr-2 bg-green-600">
                      Going ({rsvpCounts.yes})
                    </Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {(run.rsvps || [])
                      .filter(rsvp => rsvp.status === 'YES')
                      .map(rsvp => (
                        <div key={rsvp.id} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm font-medium">{rsvp.user.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Maybe RSVPs */}
              {(run.rsvps?.filter(rsvp => rsvp.status === 'MAYBE').length || 0) > 0 && (
                <div>
                  <h4 className="font-medium text-yellow-700 mb-2 flex items-center">
                    <Badge variant="secondary" className="mr-2 bg-yellow-500">
                      Maybe ({rsvpCounts.maybe})
                    </Badge>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {(run.rsvps || [])
                      .filter(rsvp => rsvp.status === 'MAYBE')
                      .map(rsvp => (
                        <div key={rsvp.id} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                          <span className="text-sm font-medium">{rsvp.user.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* No RSVPs - Collapsed by default */}
              {(run.rsvps?.filter(rsvp => rsvp.status === 'NO').length || 0) > 0 && (
                <details className="group">
                  <summary className="cursor-pointer font-medium text-red-700 mb-2 flex items-center">
                    <Badge variant="outline" className="mr-2 border-red-500 text-red-700">
                      No ({rsvpCounts.no})
                    </Badge>
                    <span className="text-sm text-muted-foreground group-open:hidden">Click to show</span>
                    <span className="text-sm text-muted-foreground hidden group-open:inline">Click to hide</span>
                  </summary>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                    {(run.rsvps || [])
                      .filter(rsvp => rsvp.status === 'NO')
                      .map(rsvp => (
                        <div key={rsvp.id} className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                          <span className="text-sm font-medium text-red-700">{rsvp.user.name}</span>
                        </div>
                      ))}
                  </div>
                </details>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">No RSVPs yet</p>
              <p className="text-sm text-muted-foreground">Be the first to RSVP for this run!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photos Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            Photos ({run.photos?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full" />
                ))}
              </div>
            </div>
          }>
            <PhotoGallery
              runId={run.id}
              photos={run.photos || []}
              onPhotosChange={handlePhotosChange}
              allowUpload={true}
              maxPhotos={50}
            />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}
