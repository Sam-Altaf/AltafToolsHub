import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';

interface PageState {
  path: string;
  scrollY: number;
  timestamp: number;
}

// Store for page states
const pageStates = new Map<string, PageState>();
const MAX_HISTORY = 50; // Maximum number of pages to remember

export function useNavigationMemory() {
  const [location] = useLocation();
  const previousLocationRef = useRef<string>('');
  const restoringScrollRef = useRef(false);

  useEffect(() => {
    // Save scroll position when leaving a page
    const handleBeforeUnload = () => {
      if (previousLocationRef.current) {
        pageStates.set(previousLocationRef.current, {
          path: previousLocationRef.current,
          scrollY: window.scrollY,
          timestamp: Date.now()
        });
      }
    };

    // Save scroll position periodically
    const handleScroll = () => {
      if (!restoringScrollRef.current && location) {
        pageStates.set(location, {
          path: location,
          scrollY: window.scrollY,
          timestamp: Date.now()
        });
      }
    };

    // Debounce scroll handler
    let scrollTimeout: NodeJS.Timeout;
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('scroll', debouncedScroll);

    // Cleanup old entries if too many
    if (pageStates.size > MAX_HISTORY) {
      const sortedEntries = Array.from(pageStates.entries())
        .sort((a, b) => b[1].timestamp - a[1].timestamp);
      pageStates.clear();
      sortedEntries.slice(0, MAX_HISTORY).forEach(([key, value]) => {
        pageStates.set(key, value);
      });
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', debouncedScroll);
      clearTimeout(scrollTimeout);
    };
  }, [location]);

  useEffect(() => {
    // Save previous location's scroll position
    if (previousLocationRef.current && previousLocationRef.current !== location) {
      const scrollY = window.scrollY;
      pageStates.set(previousLocationRef.current, {
        path: previousLocationRef.current,
        scrollY,
        timestamp: Date.now()
      });
    }

    // Restore scroll position for current location
    const savedState = pageStates.get(location);
    if (savedState && location === savedState.path) {
      restoringScrollRef.current = true;
      
      // Use requestAnimationFrame for smoother restoration
      requestAnimationFrame(() => {
        window.scrollTo({
          top: savedState.scrollY,
          behavior: 'instant' as ScrollBehavior
        });
        
        // Reset flag after a small delay
        setTimeout(() => {
          restoringScrollRef.current = false;
        }, 100);
      });
    }

    previousLocationRef.current = location;
  }, [location]);

  return {
    clearHistory: () => pageStates.clear(),
    getHistory: () => Array.from(pageStates.values())
  };
}