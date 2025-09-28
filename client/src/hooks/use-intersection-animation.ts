import { useEffect, useRef, useState } from 'react';

interface UseIntersectionAnimationOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionAnimationOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;

  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || (triggerOnce && hasAnimated)) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        
        if (inView) {
          setIsInView(true);
          
          if (triggerOnce) {
            setHasAnimated(true);
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated, triggerOnce, threshold, rootMargin]);

  return { ref, isInView };
}

// Performance-optimized variant for multiple elements
export function useBatchIntersectionAnimation<T extends HTMLElement = HTMLDivElement>(
  elements: T[],
  options: UseIntersectionAnimationOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = options;

  const [visibleElements, setVisibleElements] = useState<Set<T>>(new Set());

  useEffect(() => {
    if (!elements.length) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setVisibleElements(new Set(elements));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as T;
          
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set(Array.from(prev).concat(element)));
            
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setVisibleElements((prev) => {
              const newSet = new Set(prev);
              newSet.delete(element);
              return newSet;
            });
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    elements.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [elements, triggerOnce, threshold, rootMargin]);

  return visibleElements;
}

// Hook for staggered animations
export function useStaggeredAnimation<T extends HTMLElement = HTMLDivElement>(
  itemCount: number,
  options: UseIntersectionAnimationOptions & { staggerDelay?: number } = {}
) {
  const {
    threshold = 0.05,
    rootMargin = '0px',
    triggerOnce = true,
    staggerDelay = 50
  } = options;

  const containerRef = useRef<T>(null);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setVisibleItems(Array.from({ length: itemCount }, (_, i) => i));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger the appearance of items
          const delays = Array.from({ length: itemCount }, (_, i) => i * staggerDelay);
          
          delays.forEach((delay, index) => {
            setTimeout(() => {
              setVisibleItems((prev) => [...prev, index]);
            }, delay);
          });

          if (triggerOnce) {
            observer.unobserve(container);
          }
        } else if (!triggerOnce) {
          setVisibleItems([]);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [itemCount, triggerOnce, threshold, rootMargin, staggerDelay]);

  return { containerRef, visibleItems };
}

// Performance monitoring hook
export function useAnimationPerformance() {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationId: number;

    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime.current + 1000) {
        setFps(Math.round((frameCount.current * 1000) / (currentTime - lastTime.current)));
        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    // Only measure in development
    if (process.env.NODE_ENV === 'development') {
      animationId = requestAnimationFrame(measureFPS);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return { fps };
}