'use client';

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoGalleryImage {
  src: string;
  alt: string;
}

interface PhotoGalleryProps {
  images: PhotoGalleryImage[];
  layout?: 'grid' | 'carousel';
  onClickImage?: (image: PhotoGalleryImage, index: number) => void;
  className?: string;
}

/**
 * PhotoGallery Component
 *
 * A component for displaying images in either grid or carousel layout.
 *
 * @param images - Array of images to display
 * @param layout - Layout type: 'grid' or 'carousel' (default: 'grid')
 * @param onClickImage - Optional callback when an image is clicked
 * @param className - Optional additional classes
 */
function PhotoGallery({
  images,
  layout = 'grid',
  onClickImage,
  className,
}: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={cn('p-8 text-center text-muted-foreground', className)}>
        No images to display
      </div>
    );
  }

  const handleImageClick = (image: PhotoGalleryImage, index: number) => {
    if (onClickImage) {
      onClickImage(image, index);
    }
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (layout === 'carousel') {
    return (
      <div className={cn('relative', className)}>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="w-full h-64 object-cover cursor-pointer"
            onClick={() => handleImageClick(images[currentIndex], currentIndex)}
          />
          
          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        
        {images.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                )}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Grid layout
  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
        className
      )}
    >
      {images.map((image, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleImageClick(image, index)}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-32 object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default PhotoGallery;
