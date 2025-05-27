import * as React from 'react';
import { cn } from '@/lib/utils';
import { MAP_DIMENSIONS, CSS_CLASSES } from '@/lib/constants/ui';

interface MapEmbedProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  src: string;
  title: string;
  width?: string;
  height?: string;
}

/**
 * MapEmbed Component
 *
 * A simple wrapper for embedding maps via iframe.
 *
 * @param src - The source URL for the map embed (e.g., Google Maps embed URL)
 * @param title - The title attribute for the iframe (for accessibility)
 * @param width - Optional width of the map (default: from MAP_DIMENSIONS.DEFAULT_WIDTH)
 * @param height - Optional height of the map (default: from MAP_DIMENSIONS.EMBED_HEIGHT)
 * @param className - Optional additional classes
 */
function MapEmbed({
  src,
  title,
  width = MAP_DIMENSIONS.DEFAULT_WIDTH,
  height = MAP_DIMENSIONS.EMBED_HEIGHT,
  className,
  ...props
}: MapEmbedProps) {
  return (
    <iframe
      src={src}
      title={title}
      width={width}
      height={height}
      className={cn(CSS_CLASSES.MAP_CONTAINER, className)}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      {...props}
    />
  );
}

export default MapEmbed;
