"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { SuccessAnimation } from "@/components/ui/loading-animations"

// Import constants
import { API_ENDPOINTS } from "@/lib/constants/api"

export type RSVPStatus = 'YES' | 'NO' | 'MAYBE'

interface RSVPCounts {
  yes: number
  maybe: number
  no: number
}

interface RSVPButtonsProps {
  runId: string
  currentUserRsvp?: RSVPStatus | null
  rsvpCounts: RSVPCounts
  onRsvpChange?: (newStatus: RSVPStatus, newCounts: RSVPCounts) => void
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'compact'
  disabled?: boolean
}

export function RSVPButtons({
  runId,
  currentUserRsvp,
  rsvpCounts,
  onRsvpChange,
  size = 'default',
  variant = 'default',
  disabled = false
}: RSVPButtonsProps) {
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localRsvp, setLocalRsvp] = useState<RSVPStatus | null>(currentUserRsvp || null)
  const [localCounts, setLocalCounts] = useState<RSVPCounts>(rsvpCounts)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleRsvpClick = async (newStatus: RSVPStatus) => {
    if (status !== 'authenticated' || !session?.user?.id) {
      toast.error('Please sign in to RSVP')
      return
    }

    if (isSubmitting || disabled) return

    // Optimistic update
    const previousRsvp = localRsvp
    const previousCounts = { ...localCounts }

    // Update local state immediately
    setLocalRsvp(newStatus)

    // Calculate new counts
    const newCounts = { ...localCounts }

    // Remove from previous status
    if (previousRsvp) {
      newCounts[previousRsvp.toLowerCase() as keyof RSVPCounts]--
    }

    // Add to new status
    newCounts[newStatus.toLowerCase() as keyof RSVPCounts]++

    setLocalCounts(newCounts)
    onRsvpChange?.(newStatus, newCounts)

    try {
      setIsSubmitting(true)

      const response = await fetch(`${API_ENDPOINTS.RUNS}/${runId}/rsvp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update RSVP')
      }

      const result = await response.json()

      // Show success message with animation
      setShowSuccess(true)
      toast.success(`RSVP updated to ${newStatus.toLowerCase()}`)

      // Hide success animation after 2 seconds
      setTimeout(() => setShowSuccess(false), 2000)

    } catch (error) {
      // Revert optimistic update on error
      setLocalRsvp(previousRsvp)
      setLocalCounts(previousCounts)
      onRsvpChange?.(previousRsvp || 'NO', previousCounts)

      console.error('Error updating RSVP:', error)
      toast.error('Failed to update RSVP. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getButtonVariant = (status: RSVPStatus) => {
    if (localRsvp === status) {
      return 'default'
    }
    return 'outline'
  }

  const isAuthenticated = status === 'authenticated'

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        <div
          className="flex space-x-1"
          role="group"
          aria-label="Quick RSVP options"
        >
          <Button
            size={size}
            variant={getButtonVariant('YES')}
            onClick={() => handleRsvpClick('YES')}
            disabled={!isAuthenticated || isSubmitting || disabled}
            className="px-2 min-h-[36px] touch-manipulation"
            aria-label={`Quick RSVP Yes - ${localCounts.yes} attending`}
            aria-pressed={localRsvp === 'YES'}
          >
            {isSubmitting && localRsvp === 'YES' && (
              <Loader2 className="h-3 w-3 animate-spin mr-1" aria-hidden="true" />
            )}
            ✓ {localCounts.yes}
          </Button>
          <Button
            size={size}
            variant={getButtonVariant('MAYBE')}
            onClick={() => handleRsvpClick('MAYBE')}
            disabled={!isAuthenticated || isSubmitting || disabled}
            className="px-2 min-h-[36px] touch-manipulation"
            aria-label={`Quick RSVP Maybe - ${localCounts.maybe} might attend`}
            aria-pressed={localRsvp === 'MAYBE'}
          >
            {isSubmitting && localRsvp === 'MAYBE' && (
              <Loader2 className="h-3 w-3 animate-spin mr-1" aria-hidden="true" />
            )}
            ? {localCounts.maybe}
          </Button>
          <Button
            size={size}
            variant={getButtonVariant('NO')}
            onClick={() => handleRsvpClick('NO')}
            disabled={!isAuthenticated || isSubmitting || disabled}
            className="px-2 min-h-[36px] touch-manipulation"
            aria-label={`Quick RSVP No - ${localCounts.no} not attending`}
            aria-pressed={localRsvp === 'NO'}
          >
            {isSubmitting && localRsvp === 'NO' && (
              <Loader2 className="h-3 w-3 animate-spin mr-1" aria-hidden="true" />
            )}
            ✗ {localCounts.no}
          </Button>
        </div>
        <Badge variant="secondary" className="text-xs" aria-label={`Total RSVPs: ${localCounts.yes + localCounts.maybe + localCounts.no}`}>
          <Users className="h-3 w-3 mr-1" aria-hidden="true" />
          {localCounts.yes + localCounts.maybe + localCounts.no}
        </Badge>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="RSVP options"
      >
        <Button
          size={size}
          variant={getButtonVariant('YES')}
          onClick={() => handleRsvpClick('YES')}
          disabled={!isAuthenticated || isSubmitting || disabled}
          className="flex-1 min-w-0 min-h-[44px] touch-manipulation"
          aria-label={`RSVP Yes - ${localCounts.yes} people attending`}
          aria-pressed={localRsvp === 'YES'}
        >
          {isSubmitting && localRsvp === 'YES' && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
          )}
          Yes ({localCounts.yes})
        </Button>
        <Button
          size={size}
          variant={getButtonVariant('MAYBE')}
          onClick={() => handleRsvpClick('MAYBE')}
          disabled={!isAuthenticated || isSubmitting || disabled}
          className="flex-1 min-w-0 min-h-[44px] touch-manipulation"
          aria-label={`RSVP Maybe - ${localCounts.maybe} people might attend`}
          aria-pressed={localRsvp === 'MAYBE'}
        >
          {isSubmitting && localRsvp === 'MAYBE' && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
          )}
          Maybe ({localCounts.maybe})
        </Button>
        <Button
          size={size}
          variant={getButtonVariant('NO')}
          onClick={() => handleRsvpClick('NO')}
          disabled={!isAuthenticated || isSubmitting || disabled}
          className="flex-1 min-w-0 min-h-[44px] touch-manipulation"
          aria-label={`RSVP No - ${localCounts.no} people not attending`}
          aria-pressed={localRsvp === 'NO'}
        >
          {isSubmitting && localRsvp === 'NO' && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
          )}
          No ({localCounts.no})
        </Button>
      </div>

      {showSuccess && (
        <div className="flex justify-center">
          <SuccessAnimation />
        </div>
      )}

      {localRsvp && !showSuccess && (
        <p className="text-sm text-muted-foreground text-center">
          Your current RSVP: <strong>{localRsvp.toLowerCase()}</strong>
        </p>
      )}

      {!isAuthenticated && (
        <p className="text-sm text-muted-foreground text-center">
          Sign in to RSVP for this run
        </p>
      )}
    </div>
  )
}

// Export types for use in other components
export type { RSVPCounts }
