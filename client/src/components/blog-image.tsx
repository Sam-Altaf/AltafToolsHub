import { useState, useEffect, useRef } from "react";
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

// Static image component for known paths with Intersection Observer
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
  const [shouldLoad, setShouldLoad] = useState(priority); // Only load if priority or in viewport
  const imgRef = useRef<HTMLDivElement | null>(null);

  // Convert @assets path to direct static URL
  let imagePath = '';
  if (src) {
    if (src.startsWith('@assets/')) {
      imagePath = src.replace('@assets/', '/attached_assets/');
    } else if (src.startsWith('/attached_assets/')) {
      imagePath = src;
    } else {
      imagePath = `/attached_assets/${src}`;
    }
  }

  useEffect(() => {
    // If priority, load immediately
    if (priority || shouldLoad) return;

    // Create intersection observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Load 200px before entering viewport
        threshold: 0.01
      }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (observer && currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [priority, shouldLoad]);

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
    <div ref={imgRef} className={cn("relative", className)}>
      {!isLoaded && !error && (
        <Skeleton 
          className="absolute inset-0 w-full h-full" 
          data-testid="image-loading-skeleton-static"
        />
      )}
      {shouldLoad && (
        <img
          src={imagePath}
          alt={alt}
          className={cn(
            className,
            !isLoaded && !error ? "opacity-0" : "opacity-100",
            "transition-opacity duration-300"
          )}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
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
      )}
    </div>
  );
}