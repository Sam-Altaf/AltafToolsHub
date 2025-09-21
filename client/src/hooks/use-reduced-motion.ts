import { useState, useEffect } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * Returns true if user has set prefers-reduced-motion: reduce
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is available (for SSR compatibility)
    if (typeof window === 'undefined') {
      return;
    }

    // Initial check
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Utility function to get animation variants based on reduced motion preference
 */
export function getMotionProps(reducedMotion: boolean, normalProps: any, reducedProps?: any) {
  if (reducedMotion) {
    return reducedProps || {
      initial: false,
      animate: false,
      transition: { duration: 0 },
      whileHover: {},
      whileTap: {},
    };
  }
  return normalProps;
}