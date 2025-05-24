import * as React from "react";
import { cn } from "@/lib/utils";

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
 * @param width - Optional width of the map (default: "100%")
 * @param height - Optional height of the map (default: "450px")
 * @param className - Optional additional classes
 */
function MapEmbed({
  src,
  title,
  width = "100%",
  height = "450px",
  className,
  ...props
}: MapEmbedProps) {
  return (
    <iframe
      src={src}
      title={title}
      width={width}
      height={height}
      className={cn("border-0 rounded-md", className)}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      {...props}
    />
  );
}

export default MapEmbed;
