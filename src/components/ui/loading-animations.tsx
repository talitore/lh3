"use client"

import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface PulseProps {
  className?: string
  children?: React.ReactNode
}

export function Pulse({ className, children }: PulseProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      {children}
    </div>
  )
}

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in duration-500",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

interface SlideInProps {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  className?: string
}

export function SlideIn({ 
  children, 
  direction = "up", 
  delay = 0, 
  className 
}: SlideInProps) {
  const directionClasses = {
    up: "animate-in slide-in-from-bottom-4",
    down: "animate-in slide-in-from-top-4",
    left: "animate-in slide-in-from-right-4",
    right: "animate-in slide-in-from-left-4"
  }

  return (
    <div
      className={cn(
        directionClasses[direction],
        "duration-500",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

interface SuccessAnimationProps {
  className?: string
}

export function SuccessAnimation({ className }: SuccessAnimationProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="animate-in zoom-in duration-300">
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="h-6 w-6 text-green-600 animate-in zoom-in duration-500 delay-150"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 rounded-full bg-green-200 animate-ping opacity-20" />
    </div>
  )
}

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  )
}
