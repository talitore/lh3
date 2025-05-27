"use client"

import React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RSVPButtons, type RSVPCounts, type RSVPStatus } from "@/components/ui/rsvp-buttons"
import { 
  Calendar, 
  MapPin, 
  Users, 
  User,
  ExternalLink,
  Clock
} from "lucide-react"

interface RunCardProps {
  run: {
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
    introLink?: string
  }
  variant?: 'default' | 'compact' | 'featured'
  showRsvp?: boolean
  showOrganizer?: boolean
  showActions?: boolean
  currentUserRsvp?: RSVPStatus | null
  onRsvpChange?: (newStatus: RSVPStatus, newCounts: RSVPCounts) => void
  className?: string
}

export function RunCard({
  run,
  variant = 'default',
  showRsvp = true,
  showOrganizer = true,
  showActions = true,
  currentUserRsvp,
  onRsvpChange,
  className = ""
}: RunCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 86400000).toDateString()
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    } else if (isTomorrow) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: variant === 'compact' ? 'short' : 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    }
  }

  const isUpcoming = () => {
    return new Date(run.dateTime) > new Date()
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

  const getTimeUntilRun = () => {
    const runDate = new Date(run.dateTime)
    const now = new Date()
    const diffMs = runDate.getTime() - now.getTime()
    
    if (diffMs < 0) return null // Past run
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
    }
  }

  if (variant === 'compact') {
    return (
      <Card className={`hover:shadow-md transition-shadow ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <Link 
                  href={`/runs/${run.id}`}
                  className="font-medium text-sm hover:underline truncate"
                >
                  Run #{run.number}: {run.descriptor}
                </Link>
                <Badge variant={isUpcoming() ? "default" : "secondary"} className="text-xs">
                  {isUpcoming() ? "Upcoming" : "Completed"}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(run.dateTime)}
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {run._count.rsvps}
                </div>
              </div>
            </div>
            
            {showActions && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/runs/${run.id}`}>
                  View
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'featured') {
    const timeUntil = getTimeUntilRun()
    
    return (
      <Card className={`border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-primary rounded-full animate-pulse" />
                <Badge variant="default">
                  {timeUntil ? `In ${timeUntil}` : 'Next Run'}
                </Badge>
              </div>
              {run.introLink && (
                <Button variant="outline" size="sm" asChild>
                  <a href={run.introLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Info
                  </a>
                </Button>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                <Link href={`/runs/${run.id}`} className="hover:underline">
                  Run #{run.number}: {run.descriptor}
                </Link>
              </h3>
              
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-sm">
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
            </div>

            {showRsvp && isUpcoming() && (
              <div className="pt-2">
                <RSVPButtons
                  runId={run.id}
                  currentUserRsvp={currentUserRsvp}
                  rsvpCounts={getRsvpCounts()}
                  onRsvpChange={onRsvpChange}
                  variant="compact"
                  size="sm"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold">
                <Link href={`/runs/${run.id}`} className="hover:underline">
                  Run #{run.number}: {run.descriptor}
                </Link>
              </h3>
              <Badge variant={isUpcoming() ? "default" : "secondary"}>
                {isUpcoming() ? "Upcoming" : "Completed"}
              </Badge>
            </div>

            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground mb-3">
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

            {showOrganizer && (
              <p className="text-sm text-muted-foreground mb-3">
                <User className="h-3 w-3 inline mr-1" />
                Organized by {run.organizer.name}
              </p>
            )}

            {showRsvp && isUpcoming() && (
              <div className="mt-4">
                <RSVPButtons
                  runId={run.id}
                  currentUserRsvp={currentUserRsvp}
                  rsvpCounts={getRsvpCounts()}
                  onRsvpChange={onRsvpChange}
                  size="sm"
                />
              </div>
            )}
          </div>

          {showActions && (
            <div className="ml-4 flex flex-col space-y-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/runs/${run.id}`}>
                  View Details
                </Link>
              </Button>
              {run.introLink && (
                <Button variant="outline" size="sm" asChild>
                  <a href={run.introLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Info
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
