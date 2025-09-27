import { useEffect } from "react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 80,
  sizes,
  placeholder = 'empty',
  blurDataURL,
  className,
  ...props
}: OptimizedImageProps) {
  const isWebPSupported = typeof window !== 'undefined' && 
    (window as any).WebPSupport !== false;

  // Generate responsive image URLs
  const generateSrcSet = (originalSrc: string) => {
    const baseSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '');
    const ext = isWebPSupported ? 'webp' : originalSrc.match(/\.(jpg|jpeg|png)$/i)?.[1] || 'jpg';
    
    const sizes = [320, 480, 640, 768, 1024, 1280, 1536];
    return sizes
      .filter(size => !width || size <= width * 2) // Don't generate larger than 2x the display size
      .map(size => `${baseSrc}-${size}w.${ext} ${size}w`)
      .join(', ');
  };

  // Generate optimized src
  const getOptimizedSrc = (originalSrc: string) => {
    if (!width && !quality) return originalSrc;
    
    const baseSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '');
    const ext = isWebPSupported ? 'webp' : originalSrc.match(/\.(jpg|jpeg|png)$/i)?.[1] || 'jpg';
    
    return `${baseSrc}-${width || 800}w.${ext}`;
  };

  useEffect(() => {
    // Preload critical images
    if (priority && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getOptimizedSrc(src);
      if (sizes) link.setAttribute('imagesizes', sizes);
      document.head.appendChild(link);
    }
  }, [src, priority, sizes]);

  const optimizedSrc = getOptimizedSrc(src);
  const srcSet = generateSrcSet(src);

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      className={className}
      style={{
        ...(placeholder === 'blur' && blurDataURL && {
          backgroundImage: `url(${blurDataURL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }),
        ...(width && height && {
          aspectRatio: `${width}/${height}`,
        }),
      }}
      {...props}
    />
  );
}

// WebP detection
export function detectWebPSupport() {
  if (typeof window === 'undefined') return false;
  
  return new Promise<boolean>((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      const supported = webP.height === 2;
      (window as any).WebPSupport = supported;
      resolve(supported);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

// Image lazy loading optimization
export function optimizeImageLoading() {
  if (typeof window === 'undefined') return;

  // Native lazy loading support check
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach((img: any) => {
      img.src = img.dataset.src;
      img.loading = 'lazy';
    });
    return;
  }

  // Intersection Observer fallback for older browsers
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || img.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  const images = document.querySelectorAll('img[data-src]');
  images.forEach(img => {
    imageObserver.observe(img);
  });
}

// Generate blur placeholder data URL
export function generateBlurPlaceholder(width: number = 4, height: number = 3): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = width;
  canvas.height = height;
  
  if (ctx) {
    // Create a simple gradient blur placeholder
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL('image/jpeg', 0.1);
}