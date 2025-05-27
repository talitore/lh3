"use client"

import React, { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  AlertCircle,
  Check,
  Camera
} from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface PhotoUploadProps {
  runId: string
  onUploadComplete?: (photos: UploadedPhoto[]) => void
  maxFiles?: number
  maxFileSize?: number // in MB
  allowedTypes?: string[]
  className?: string
}

interface UploadedPhoto {
  id: string
  url: string
  caption?: string
}

interface UploadingFile {
  file: File
  preview: string
  progress: number
  status: 'uploading' | 'success' | 'error'
  caption: string
  error?: string
}

export function PhotoUpload({
  runId,
  onUploadComplete,
  maxFiles = 10,
  maxFileSize = 5, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ""
}: PhotoUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Please use JPEG, PNG, or WebP.`
    }
    
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB.`
    }
    
    return null
  }

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    
    if (uploadingFiles.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`)
      return
    }

    const validFiles: UploadingFile[] = []
    
    fileArray.forEach(file => {
      const error = validateFile(file)
      if (error) {
        toast.error(error)
        return
      }

      const preview = URL.createObjectURL(file)
      validFiles.push({
        file,
        preview,
        progress: 0,
        status: 'uploading',
        caption: ''
      })
    })

    if (validFiles.length > 0) {
      setUploadingFiles(prev => [...prev, ...validFiles])
      validFiles.forEach(uploadFile => uploadPhoto(uploadFile))
    }
  }, [uploadingFiles.length, maxFiles, maxFileSize, allowedTypes])

  const uploadPhoto = async (uploadingFile: UploadingFile) => {
    try {
      // Get signed URL for upload
      const signedUrlResponse = await fetch('/api/photos/signed-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: uploadingFile.file.name,
          fileType: uploadingFile.file.type,
          runId
        }),
      })

      if (!signedUrlResponse.ok) {
        throw new Error('Failed to get upload URL')
      }

      const { signedUrl, photoId } = await signedUrlResponse.json()

      // Upload to S3 with progress tracking
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadingFiles(prev => 
            prev.map(f => 
              f.file === uploadingFile.file 
                ? { ...f, progress }
                : f
            )
          )
        }
      })

      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          // Confirm upload with our API
          try {
            const confirmResponse = await fetch(`/api/photos/${photoId}/confirm`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                caption: uploadingFile.caption || null
              }),
            })

            if (confirmResponse.ok) {
              const photo = await confirmResponse.json()
              
              setUploadingFiles(prev => 
                prev.map(f => 
                  f.file === uploadingFile.file 
                    ? { ...f, status: 'success', progress: 100 }
                    : f
                )
              )

              if (onUploadComplete) {
                onUploadComplete([photo])
              }

              toast.success('Photo uploaded successfully')
            } else {
              throw new Error('Failed to confirm upload')
            }
          } catch (confirmError) {
            throw new Error('Upload completed but failed to save photo details')
          }
        } else {
          throw new Error(`Upload failed with status ${xhr.status}`)
        }
      })

      xhr.addEventListener('error', () => {
        throw new Error('Upload failed')
      })

      xhr.open('PUT', signedUrl)
      xhr.setRequestHeader('Content-Type', uploadingFile.file.type)
      xhr.send(uploadingFile.file)

    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      
      setUploadingFiles(prev => 
        prev.map(f => 
          f.file === uploadingFile.file 
            ? { ...f, status: 'error', error: errorMessage }
            : f
        )
      )
      
      toast.error(errorMessage)
    }
  }

  const removeFile = (file: File) => {
    setUploadingFiles(prev => {
      const updated = prev.filter(f => f.file !== file)
      // Clean up preview URL
      const fileToRemove = prev.find(f => f.file === file)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return updated
    })
  }

  const updateCaption = (file: File, caption: string) => {
    setUploadingFiles(prev => 
      prev.map(f => 
        f.file === file 
          ? { ...f, caption }
          : f
      )
    )
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }

  const getStatusIcon = (status: UploadingFile['status']) => {
    switch (status) {
      case 'uploading':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <div className="text-center">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Photos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop photos here, or click to select files
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Photos
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Max {maxFiles} files, {maxFileSize}MB each. JPEG, PNG, WebP supported.
            </p>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Uploading Photos</h4>
          {uploadingFiles.map((uploadingFile, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={uploadingFile.preview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {uploadingFile.file.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(uploadingFile.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(uploadingFile.file)}
                          disabled={uploadingFile.status === 'uploading'}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {uploadingFile.status === 'uploading' && (
                      <Progress value={uploadingFile.progress} className="h-2" />
                    )}
                    
                    {uploadingFile.status === 'error' && uploadingFile.error && (
                      <p className="text-sm text-red-600">{uploadingFile.error}</p>
                    )}
                    
                    <div>
                      <Label htmlFor={`caption-${index}`} className="text-xs">
                        Caption (optional)
                      </Label>
                      <Input
                        id={`caption-${index}`}
                        value={uploadingFile.caption}
                        onChange={(e) => updateCaption(uploadingFile.file, e.target.value)}
                        placeholder="Add a caption..."
                        className="text-sm"
                        disabled={uploadingFile.status === 'uploading'}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
