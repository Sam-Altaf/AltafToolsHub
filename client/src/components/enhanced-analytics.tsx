import { useEffect } from "react";
import { useLocation } from "wouter";

// Type definitions for global analytics functions
declare global {
  interface Window {
    gtag: (command: string, targetId?: string | Date, config?: any) => void;
    trackEngagement: (eventName: string, parameters?: any) => void;
  }
}

// Enhanced Analytics Component for User Engagement Tracking
// This component tracks user behavior without compromising privacy
export default function EnhancedAnalytics() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Track page views with enhanced parameters
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-26X6DS9BXF', {
        page_title: document.title,
        page_location: window.location.href,
        content_group1: getPageCategory(location),
        custom_parameter_1: getToolCategory(location),
      });
      
      // Track page engagement
      trackPageEngagement(location);
    }
  }, [location]);
  
  // Track user engagement patterns
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let startTime = Date.now();
    let isVisible = true;
    
    // Track time spent on page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (!isVisible) {
          startTime = Date.now();
          isVisible = true;
        }
      } else {
        if (isVisible) {
          const timeSpent = Date.now() - startTime;
          if (window.trackEngagement) {
            window.trackEngagement('page_engagement', {
              engagementTime: timeSpent,
              page_path: location,
              engagement_type: 'visibility_change'
            });
          }
          isVisible = false;
        }
      }
    };
    
    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 90].includes(scrollPercent)) {
          if (window.trackEngagement) {
            window.trackEngagement('scroll_depth', {
              scroll_percent: scrollPercent,
              page_path: location,
              engagement_type: 'scroll_milestone'
            });
          }
        }
      }
    };
    
    // Track user interactions
    const trackInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      
      if (['button', 'a', 'input'].includes(tagName)) {
        if (window.trackEngagement) {
          window.trackEngagement('user_interaction', {
            element_type: tagName,
            element_text: target.textContent?.slice(0, 50) || '',
            page_path: location,
            interaction_type: event.type
          });
        }
      }
    };
    
    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    document.addEventListener('click', trackInteraction);
    
    // Track session end
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime;
      if (window.trackEngagement) {
        window.trackEngagement('session_end', {
          engagementTime: timeSpent,
          maxScrollDepth,
          page_path: location,
          engagement_type: 'session_complete'
        });
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', trackScrollDepth);
      document.removeEventListener('click', trackInteraction);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location]);
  
  return null;
}

// Helper functions for categorizing pages and tools
function getPageCategory(path: string): string {
  if (path === '/') return 'homepage';
  if (path === '/all-tools') return 'tools_overview';
  if (path.includes('/compress-pdf') || path.includes('/unlock-pdf') || path.includes('/jpg-to-pdf')) return 'pdf_tools';
  if (path.includes('/qr-generator') || path.includes('/password-generator')) return 'utility_tools';
  if (path === '/privacy' || path === '/terms') return 'legal_pages';
  if (path === '/blog' || path === '/faq') return 'content_pages';
  return 'other';
}

function getToolCategory(path: string): string {
  if (path.includes('pdf')) return 'pdf_management';
  if (path.includes('qr-generator')) return 'qr_generation';
  if (path.includes('password-generator')) return 'security_tools';
  if (path.includes('extract-text')) return 'text_processing';
  return 'general';
}

function trackPageEngagement(path: string) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'page_view_enhanced', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: path,
    page_category: getPageCategory(path),
    tool_category: getToolCategory(path),
    user_agent: navigator.userAgent,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    connection_type: (navigator as any).connection?.effectiveType || 'unknown',
    privacy_mode: 'client_side_processing'
  });
}

// Performance monitoring
export function trackPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  // Core Web Vitals tracking
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'navigation') {
        const navigationEntry = entry as PerformanceNavigationTiming;
        
        window.gtag('event', 'page_performance', {
          page_load_time: navigationEntry.loadEventEnd - navigationEntry.fetchStart,
          dom_content_loaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart,
          first_contentful_paint: 0, // Will be captured separately
          time_to_interactive: navigationEntry.domInteractive - navigationEntry.fetchStart,
          page_path: window.location.pathname
        });
      }
    }
  });
  
  if (PerformanceObserver.supportedEntryTypes.includes('navigation')) {
    observer.observe({ type: 'navigation', buffered: true });
  }
  
  // Core Web Vitals - CLS, FID, LCP
  if ('web-vitals' in window) {
    // This would be imported from web-vitals library if installed
    // For now, we'll track basic performance metrics
  }
}

// Error tracking
export function trackErrors() {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('error', (event) => {
    if (window.trackEngagement) {
      window.trackEngagement('javascript_error', {
        error_message: event.message,
        error_source: event.filename,
        error_line: event.lineno,
        error_column: event.colno,
        page_path: window.location.pathname,
        engagement_type: 'error_tracking'
      });
    }
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    if (window.trackEngagement) {
      window.trackEngagement('promise_rejection', {
        error_message: event.reason?.toString() || 'Unhandled promise rejection',
        page_path: window.location.pathname,
        engagement_type: 'error_tracking'
      });
    }
  });
}

// Make tracking functions available globally
if (typeof window !== 'undefined') {
  window.trackPerformanceMetrics = trackPerformanceMetrics;
  window.trackErrors = trackErrors;
}