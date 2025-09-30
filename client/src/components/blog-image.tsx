import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function BlogImage({ 
  src, 
  alt, 
  className,
  fallbackClassName,
  priority = false,
  onLoad,
  onError 
}: BlogImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      setError(true);
      return;
    }

    // Convert the @assets path to a dynamic import
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Extract the path from @assets/...
        const assetPath = src.replace('@assets/', '');
        
        // Dynamic import of the image
        const imageModule = await import(`/attached_assets/${assetPath}`);
        setImageUrl(imageModule.default);
        setLoading(false);
        onLoad?.();
      } catch (err) {
        console.error(`Failed to load image: ${src}`, err);
        setError(true);
        setLoading(false);
        onError?.();
      }
    };

    loadImage();
  }, [src, onLoad, onError]);

  if (loading) {
    return (
      <Skeleton 
        className={cn("w-full h-full", className)} 
        data-testid="image-loading-skeleton"
      />
    );
  }

  if (error || !imageUrl) {
    return (
      <div 
        className={cn(
          "w-full h-full bg-muted flex items-center justify-center",
          fallbackClassName || className
        )}
        data-testid="image-error-fallback"
      >
        <div className="text-center text-muted-foreground">
          <ImageOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      onError={() => {
        setError(true);
        onError?.();
      }}
      data-testid="blog-image"
    />
  );
}

// Static image component for known paths
export function BlogImageStatic({ 
  src, 
  alt, 
  className,
  priority = false 
}: { 
  src: string; 
  alt: string; 
  className?: string;
  priority?: boolean;
}) {
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Convert @assets path to direct static URL
  let imagePath = '';
  if (src) {
    if (src.startsWith('@assets/')) {
      // Replace @assets/ with /attached_assets/ for static serving
      imagePath = src.replace('@assets/', '/attached_assets/');
    } else if (src.startsWith('/attached_assets/')) {
      // Already has the correct path
      imagePath = src;
    } else {
      // Assume it's a relative path in attached_assets
      imagePath = `/attached_assets/${src}`;
    }
  }

  if (!src || error) {
    return (
      <div 
        className={cn(
          "w-full h-full bg-muted flex items-center justify-center",
          className
        )}
        data-testid="image-error-fallback-static"
      >
        <div className="text-center text-muted-foreground">
          <ImageOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {!isLoaded && !error && (
        <Skeleton 
          className="absolute inset-0" 
          data-testid="image-loading-skeleton-static"
        />
      )}
      <img
        src={imagePath}
        alt={alt}
        className={cn(
          className,
          !isLoaded && !error ? "opacity-0" : "opacity-100",
          "transition-opacity duration-300"
        )}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => {
          setIsLoaded(true);
        }}
        onError={() => {
          console.error(`Failed to load image: ${imagePath}`);
          setError(true);
          setIsLoaded(false);
        }}
        data-testid="blog-image-static"
      />
    </div>
  );
}