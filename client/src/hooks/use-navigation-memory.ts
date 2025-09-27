import * as React from 'react';
import { useLocation } from 'wouter';

interface PageState {
  path: string;
  scrollY: number;
  timestamp: number;
}

// Store for page states
const pageStates = new Map<string, PageState>();
const MAX_HISTORY = 50; // Maximum number of pages to remember

// Persist current page to localStorage
const CURRENT_PAGE_KEY = 'altaftoolshub_current_page';
const SCROLL_POSITIONS_KEY = 'altaftoolshub_scroll_positions';

// Load saved scroll positions from localStorage on startup
if (typeof window !== 'undefined') {
  const savedPositions = localStorage.getItem(SCROLL_POSITIONS_KEY);
  if (savedPositions) {
    try {
      const positions = JSON.parse(savedPositions);
      Object.entries(positions).forEach(([path, state]: [string, any]) => {
        pageStates.set(path, state);
      });
    } catch (e) {
      console.error('Failed to load scroll positions:', e);
    }
  }
}

export function useNavigationMemory() {
  const [location, navigate] = useLocation();
  const previousLocationRef = React.useRef<string>('');
  const restoringScrollRef = React.useRef(false);
  const hasRestoredRef = React.useRef(false);

  // On initial load, check if we should restore to a different page
  React.useEffect(() => {
    if (!hasRestoredRef.current) {
      hasRestoredRef.current = true;
      const savedPage = localStorage.getItem(CURRENT_PAGE_KEY);
      if (savedPage && savedPage !== location && savedPage !== '/') {
        // Navigate to the saved page
        navigate(savedPage);
      }
    }
  }, []);

  React.useEffect(() => {
    // Save current page to localStorage
    if (location) {
      localStorage.setItem(CURRENT_PAGE_KEY, location);
    }

    // Save scroll position when leaving a page
    const handleBeforeUnload = () => {
      if (previousLocationRef.current) {
        pageStates.set(previousLocationRef.current, {
          path: previousLocationRef.current,
          scrollY: window.scrollY,
          timestamp: Date.now()
        });
      }
      
      // Save all scroll positions to localStorage
      const positions: Record<string, PageState> = {};
      pageStates.forEach((value, key) => {
        positions[key] = value;
      });
      localStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(positions));
    };

    // Save scroll position periodically
    const handleScroll = () => {
      if (!restoringScrollRef.current && location) {
        pageStates.set(location, {
          path: location,
          scrollY: window.scrollY,
          timestamp: Date.now()
        });
        
        // Also save to localStorage periodically
        const positions: Record<string, PageState> = {};
        pageStates.forEach((value, key) => {
          positions[key] = value;
        });
        localStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(positions));
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

  React.useEffect(() => {
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