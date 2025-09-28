import { memo, useCallback, useMemo, useState, useRef, useEffect, ComponentType, RefObject, DependencyList, ReactNode } from 'react';
import { measureComponentPerformance } from './performance';

// HOC to add performance monitoring to components
export function withPerformanceMonitoring<P extends object>(
  Component: ComponentType<P>,
  componentName: string
) {
  return memo((props: P) => {
    const perfMeasure = measureComponentPerformance(componentName);
    
    // Start performance measurement
    perfMeasure.start();
    
    // Render component
    const result = <Component {...props} />;
    
    // End performance measurement
    requestAnimationFrame(() => {
      perfMeasure.end();
    });
    
    return result;
  });
}

// Optimized list renderer with virtualization support
export function OptimizedList<T>({
  items,
  renderItem,
  keyExtractor,
  itemHeight,
  containerHeight,
  overscan = 3,
  className,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  className?: string;
}) {
  // If no virtualization needed, render normally
  if (!itemHeight || !containerHeight) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={keyExtractor(item, index)}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    );
  }

  // Calculate visible range for virtualization
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight);
  
  const displayStart = Math.max(0, visibleStart - overscan);
  const displayEnd = Math.min(items.length, visibleEnd + overscan);

  const visibleItems = useMemo(
    () => items.slice(displayStart, displayEnd),
    [items, displayStart, displayEnd]
  );

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: containerHeight, overflowY: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => {
          const actualIndex = displayStart + index;
          return (
            <div
              key={keyExtractor(item, actualIndex)}
              style={{
                position: 'absolute',
                top: actualIndex * itemHeight,
                left: 0,
                right: 0,
                height: itemHeight,
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Debounced value hook for optimizing frequent updates
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttled callback hook
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args) => {
      const now = Date.now();
      
      if (now - lastRun.current >= delay) {
        lastRun.current = now;
        callback(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          lastRun.current = Date.now();
          callback(...args);
        }, delay - (now - lastRun.current));
      }
    }) as T,
    [callback, delay]
  );
}

// Lazy load hook for components
export function useLazyLoad(
  threshold = 0.1,
  rootMargin = '100px'
): [RefObject<HTMLDivElement>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isVisible];
}

// Memoized event handler creator
export function useMemoizedHandler<T extends (...args: any[]) => any>(
  handler: T,
  deps: DependencyList
): T {
  return useCallback(handler, deps);
}

// Optimized state update that batches multiple updates
export function useBatchedState<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  const pendingUpdates = useRef<Partial<T>>({});
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchedSetState = useCallback((updates: Partial<T>) => {
    pendingUpdates.current = { ...pendingUpdates.current, ...updates };
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setState((prevState) => ({ ...prevState, ...pendingUpdates.current }));
      pendingUpdates.current = {};
    }, 0);
  }, []);

  return [state, batchedSetState] as const;
}

// HOC for adding React.memo with custom comparison
export function memoWithProps<P extends object>(
  Component: ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean
) {
  return memo(Component, propsAreEqual);
}

// Default props comparison for memo
export function shallowEqual(prevProps: any, nextProps: any): boolean {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  
  for (const key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }
  
  return true;
}

// Deep comparison for complex props
export function deepEqual(prevProps: any, nextProps: any): boolean {
  if (prevProps === nextProps) return true;
  
  if (typeof prevProps !== 'object' || typeof nextProps !== 'object') {
    return prevProps === nextProps;
  }
  
  if (prevProps === null || nextProps === null) {
    return prevProps === nextProps;
  }
  
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  
  for (const key of prevKeys) {
    if (!deepEqual(prevProps[key], nextProps[key])) {
      return false;
    }
  }
  
  return true;
}