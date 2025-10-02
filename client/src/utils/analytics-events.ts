// Enhanced Analytics Event Tracking
// Tracks user interactions, conversions, and errors

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
    dataLayer: any[];
  }
}

// Event Categories
export const EVENT_CATEGORIES = {
  TOOL_USAGE: 'tool_usage',
  CONVERSION: 'conversion',
  USER_INTERACTION: 'user_interaction',
  ERROR: 'error',
  PERFORMANCE: 'performance',
  ENGAGEMENT: 'engagement',
} as const;

// Tool Usage Events
export function trackToolStart(toolName: string, fileSize?: number) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'tool_start', {
    event_category: EVENT_CATEGORIES.TOOL_USAGE,
    event_label: toolName,
    file_size: fileSize,
    timestamp: new Date().toISOString(),
  });
}

export function trackToolComplete(
  toolName: string,
  processingTime: number,
  inputSize?: number,
  outputSize?: number
) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const compressionRatio = inputSize && outputSize 
    ? ((1 - outputSize / inputSize) * 100).toFixed(2)
    : null;
  
  window.gtag('event', 'tool_complete', {
    event_category: EVENT_CATEGORIES.TOOL_USAGE,
    event_label: toolName,
    processing_time: Math.round(processingTime),
    input_size: inputSize,
    output_size: outputSize,
    compression_ratio: compressionRatio,
    timestamp: new Date().toISOString(),
  });
  
  // Also track as conversion
  window.gtag('event', 'conversion', {
    event_category: EVENT_CATEGORIES.CONVERSION,
    event_label: `${toolName}_completion`,
    value: 1,
  });
}

export function trackToolError(
  toolName: string,
  errorType: string,
  errorMessage?: string
) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'tool_error', {
    event_category: EVENT_CATEGORIES.ERROR,
    event_label: toolName,
    error_type: errorType,
    error_message: errorMessage?.substring(0, 150), // Limit length
    timestamp: new Date().toISOString(),
  });
}

// File Download Events
export function trackFileDownload(
  toolName: string,
  fileType: string,
  fileSize: number
) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'file_download', {
    event_category: EVENT_CATEGORIES.CONVERSION,
    event_label: toolName,
    file_type: fileType,
    file_size: fileSize,
    timestamp: new Date().toISOString(),
  });
  
  // Track as conversion
  window.gtag('event', 'conversion', {
    event_category: EVENT_CATEGORIES.CONVERSION,
    event_label: 'file_download',
    value: 1,
  });
}

// User Interaction Events
export function trackButtonClick(buttonName: string, location: string) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'button_click', {
    event_category: EVENT_CATEGORIES.USER_INTERACTION,
    event_label: buttonName,
    location: location,
  });
}

export function trackFileUpload(toolName: string, fileType: string, fileSize: number) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'file_upload', {
    event_category: EVENT_CATEGORIES.USER_INTERACTION,
    event_label: toolName,
    file_type: fileType,
    file_size: fileSize,
  });
}

export function trackSettingsChange(settingName: string, value: string | number) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'settings_change', {
    event_category: EVENT_CATEGORIES.USER_INTERACTION,
    event_label: settingName,
    value: String(value),
  });
}

// Error Tracking
export function trackError(
  errorType: 'runtime' | 'network' | 'validation' | 'unknown',
  errorMessage: string,
  componentName?: string,
  stack?: string
) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'exception', {
    description: errorMessage.substring(0, 150),
    fatal: errorType === 'runtime',
    event_category: EVENT_CATEGORIES.ERROR,
    error_type: errorType,
    component: componentName,
    stack_trace: stack?.substring(0, 500), // Limit stack trace
  });
}

// Engagement Events
export function trackSocialShare(platform: string, contentType: string) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'share', {
    event_category: EVENT_CATEGORIES.ENGAGEMENT,
    method: platform,
    content_type: contentType,
  });
}

export function trackSearch(searchTerm: string, resultsCount: number) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'search', {
    event_category: EVENT_CATEGORIES.ENGAGEMENT,
    search_term: searchTerm,
    results_count: resultsCount,
  });
}

export function trackOutboundLink(url: string, linkText: string) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'click', {
    event_category: 'outbound_link',
    event_label: url,
    link_text: linkText,
    transport_type: 'beacon',
  });
}

// User Journey Tracking
export function trackUserJourney(
  step: string,
  toolName: string,
  stepNumber: number,
  totalSteps: number
) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'user_journey', {
    event_category: EVENT_CATEGORIES.ENGAGEMENT,
    event_label: toolName,
    step: step,
    step_number: stepNumber,
    total_steps: totalSteps,
    progress_percentage: Math.round((stepNumber / totalSteps) * 100),
  });
}

// Scroll Depth Tracking
export function initScrollTracking() {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const scrollDepths = [25, 50, 75, 100];
  const tracked = new Set<number>();
  
  const trackScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    scrollDepths.forEach(depth => {
      if (scrollPercent >= depth && !tracked.has(depth)) {
        tracked.add(depth);
        window.gtag?.('event', 'scroll_depth', {
          event_category: EVENT_CATEGORIES.ENGAGEMENT,
          event_label: `${depth}%`,
          value: depth,
        });
      }
    });
  };
  
  let scrollTimeout: NodeJS.Timeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(trackScroll, 300);
  }, { passive: true });
}

// Session Duration Tracking
export function trackSessionDuration() {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const sessionStart = Date.now();
  
  const sendDuration = () => {
    const duration = Math.round((Date.now() - sessionStart) / 1000); // in seconds
    
    window.gtag?.('event', 'session_duration', {
      event_category: EVENT_CATEGORIES.ENGAGEMENT,
      value: duration,
      session_start: new Date(sessionStart).toISOString(),
    });
  };
  
  // Send on page unload
  window.addEventListener('beforeunload', sendDuration);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendDuration();
    }
  });
}
