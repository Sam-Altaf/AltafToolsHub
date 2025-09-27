import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
  const [location] = useLocation();
  const previousLocation = useRef(location);

  useEffect(() => {
    // Only scroll to top if it's an actual route change (different path)
    // Don't scroll if it's just a hash change or same page state update
    const currentPath = location.split('#')[0].split('?')[0];
    const previousPath = previousLocation.current.split('#')[0].split('?')[0];
    
    if (currentPath !== previousPath) {
      // Small delay to ensure page has rendered
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    }
    
    previousLocation.current = location;
  }, [location]);

  return null;
}