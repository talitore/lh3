"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Camera, Upload, X, ChevronLeft, ChevronRight, User } from "lucide-react"
import { toast } from "sonner"

// Import constants
import { API_ENDPOINTS } from "@/lib/constants/api"

interface Photo {
  id: string
  url: string
  caption?: string
  uploadedBy: {
    id: string
    name: string
  }
  createdAt: string
}

interface PhotoGalleryProps {
  runId: string
  photos: Photo[]
  onPhotosChange?: (photos: Photo[]) => void
  allowUpload?: boolean
  maxPhotos?: number
  className?: string
}

export function PhotoGallery({
  runId,
  photos,
  onPhotosChange,
  allowUpload = true,
  maxPhotos = 50,
  className = ""
}: PhotoGalleryProps) {
  const { data: session } = useSession()
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const lightboxRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    if (!session?.user?.id) {
      toast.error('Please sign in to upload photos')
      return
    }

    if (photos.length >= maxPhotos) {
      toast.error(`Maximum ${maxPhotos} photos allowed`)
      return
    }

    const file = files[0]

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB')
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)

      // Step 1: Generate signed URL
      const signedUrlResponse = await fetch(`${API_ENDPOINTS.RUNS}/${runId}/photos/generate-signed-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      })

      if (!signedUrlResponse.ok) {
        throw new Error('Failed to generate upload URL')
      }

      const { signedUrl, photoId } = await signedUrlResponse.json()
      setUploadProgress(25)

      // Step 2: Upload to S3
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image')
      }

      setUploadProgress(75)

      // Step 3: Confirm upload
      const confirmResponse = await fetch(`${API_ENDPOINTS.RUNS}/${runId}/photos/confirm-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoId,
          caption: '', // Could add caption input later
        }),
      })

      if (!confirmResponse.ok) {
        throw new Error('Failed to confirm upload')
      }

      const newPhoto = await confirmResponse.json()
      setUploadProgress(100)

      // Update photos list
      const updatedPhotos = [...photos, newPhoto]
      onPhotosChange?.(updatedPhotos)

      toast.success('Photo uploaded successfully!')

    } catch (error) {
      console.error('Error uploading photo:', error)
      toast.error('Failed to upload photo. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      // Reset file input
      event.target.value = ''
    }
  }

  const openLightbox = (index: number) => {
    // Store the currently focused element to restore focus later
    previousFocusRef.current = document.activeElement as HTMLElement
    setSelectedPhotoIndex(index)
  }

  const closeLightbox = () => {
    setSelectedPhotoIndex(null)
    // Restore focus to the previously focused element
    if (previousFocusRef.current) {
      previousFocusRef.current.focus()
    }
  }

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (selectedPhotoIndex === null) return

    if (direction === 'prev') {
      setSelectedPhotoIndex(selectedPhotoIndex > 0 ? selectedPhotoIndex - 1 : photos.length - 1)
    } else {
      setSelectedPhotoIndex(selectedPhotoIndex < photos.length - 1 ? selectedPhotoIndex + 1 : 0)
    }
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return

      switch (event.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowLeft':
          event.preventDefault()
          navigatePhoto('prev')
          break
        case 'ArrowRight':
          event.preventDefault()
          navigatePhoto('next')
          break
      }
    }

    if (selectedPhotoIndex !== null) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedPhotoIndex, photos.length])

  const selectedPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null

  if (photos.length === 0 && !allowUpload) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-muted-foreground">No photos yet</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Photo Grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        role="grid"
        aria-label="Photo gallery"
      >
        {photos.map((photo, index) => (
          <Card key={photo.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <button
                type="button"
                className="aspect-square relative w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                onClick={() => openLightbox(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openLightbox(index)
                  }
                }}
                aria-label={`View photo ${index + 1} by ${photo.uploadedBy.name}${photo.caption ? `: ${photo.caption}` : ''}`}
                role="gridcell"
              >
                <Image
                  src={photo.url}
                  alt={photo.caption || `Photo ${index + 1} by ${photo.uploadedBy.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-end">
                  <div className="p-2 w-full">
                    <Badge variant="secondary" className="text-xs">
                      <User className="h-3 w-3 mr-1" />
                      {photo.uploadedBy.name}
                    </Badge>
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        ))}

        {/* Upload Button */}
        {allowUpload && session?.user && photos.length < maxPhotos && (
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardContent className="p-0">
              <label
                className="aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 rounded-md"
                role="gridcell"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="sr-only"
                  aria-label="Upload a photo to this run"
                />
                {isUploading ? (
                  <div className="text-center" role="status" aria-live="polite">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Uploading {uploadProgress}%</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mb-2" aria-hidden="true" />
                    <p className="text-sm text-muted-foreground text-center px-2">
                      Upload Photo
                    </p>
                  </>
                )}
              </label>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Empty State */}
      {photos.length === 0 && allowUpload && (
        <div className="text-center py-8">
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No photos yet</p>
          {session?.user ? (
            <p className="text-sm text-muted-foreground">
              Be the first to share a photo from this run!
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sign in to upload photos
            </p>
          )}
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog open={selectedPhotoIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent
          className="max-w-4xl w-full h-[90vh] p-0"
          ref={lightboxRef}
          aria-describedby={selectedPhoto?.caption ? "photo-caption" : undefined}
        >
          {selectedPhoto && (
            <>
              <DialogHeader className="p-4 pb-0">
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span>Photo by {selectedPhoto.uploadedBy.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground" aria-live="polite">
                      {selectedPhotoIndex! + 1} of {photos.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeLightbox}
                      aria-label="Close photo viewer"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 relative">
                <Image
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption || `Photo ${selectedPhotoIndex! + 1}`}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />

                {/* Navigation Buttons */}
                {photos.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                      onClick={() => navigatePhoto('prev')}
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                      onClick={() => navigatePhoto('next')}
                      aria-label="Next photo"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </>
                )}
              </div>

              {selectedPhoto.caption && (
                <div className="p-4 pt-0">
                  <p id="photo-caption" className="text-sm text-muted-foreground">
                    {selectedPhoto.caption}
                  </p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
