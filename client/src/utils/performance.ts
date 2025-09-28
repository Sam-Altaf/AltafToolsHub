// Performance monitoring utility using Web Vitals
import { onCLS, onFCP, onINP, onLCP, onTTFB, Metric } from 'web-vitals';

// Performance thresholds (in milliseconds)
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  CLS: { good: 0.1, needsImprovement: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
  INP: { good: 200, needsImprovement: 500 }, // Interaction to Next Paint
};

// Metric rating helper
function getRating(value: number, metric: keyof typeof THRESHOLDS): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

// Format metric value for display
function formatMetricValue(name: string, value: number): string {
  // CLS is a unitless value, others are in milliseconds
  if (name === 'CLS') {
    return value.toFixed(3);
  }
  return `${Math.round(value)}ms`;
}

// Custom performance marks
export function markPerformance(name: string) {
  if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
    window.performance.mark(name);
  }
}

// Measure between two marks
export function measurePerformance(name: string, startMark: string, endMark?: string) {
  if (typeof window !== 'undefined' && window.performance && window.performance.measure) {
    try {
      if (endMark) {
        window.performance.measure(name, startMark, endMark);
      } else {
        window.performance.measure(name, startMark);
      }
      
      const measures = window.performance.getEntriesByName(name, 'measure');
      const lastMeasure = measures[measures.length - 1];
      
      if (lastMeasure && process.env.NODE_ENV === 'development') {
        console.log(`⏱ Performance: ${name} took ${lastMeasure.duration.toFixed(2)}ms`);
      }
      
      return lastMeasure?.duration;
    } catch (error) {
      console.warn('Performance measurement error:', error);
    }
  }
  return null;
}

// Log metric to console in development
function logMetric(metric: Metric) {
  if (process.env.NODE_ENV === 'development') {
    const rating = getRating(metric.value, metric.name as keyof typeof THRESHOLDS);
    const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
    const formattedValue = formatMetricValue(metric.name, metric.value);
    
    console.log(
      `${emoji} ${metric.name}: ${formattedValue} (${rating})`,
      {
        value: metric.value,
        rating,
        navigationType: metric.navigationType,
        id: metric.id,
        delta: metric.delta,
      }
    );
  }
}

// Send metrics to analytics (placeholder - implement based on your analytics provider)
function sendToAnalytics(metric: Metric) {
  // In production, send metrics to your analytics service
  // Example for Google Analytics:
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: getRating(metric.value, metric.name as keyof typeof THRESHOLDS),
    });
  }
  
  // You can also batch metrics and send them to your own endpoint
  if (process.env.NODE_ENV === 'production') {
    // Example: Queue metrics for batch sending
    queueMetric(metric);
  }
}

// Queue for batching metrics
let metricsQueue: Metric[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

function queueMetric(metric: Metric) {
  metricsQueue.push(metric);
  
  // Flush queue after 5 seconds or when it reaches 10 metrics
  if (metricsQueue.length >= 10) {
    flushMetrics();
  } else if (!flushTimeout) {
    flushTimeout = setTimeout(flushMetrics, 5000);
  }
}

function flushMetrics() {
  if (metricsQueue.length === 0) return;
  
  // Send batched metrics to your analytics endpoint
  const payload = {
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    metrics: metricsQueue.map(m => ({
      name: m.name,
      value: m.value,
      rating: getRating(m.value, m.name as keyof typeof THRESHOLDS),
      id: m.id,
    })),
  };
  
  // Example: Send to your analytics endpoint
  // fetch('/api/metrics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // }).catch(console.error);
  
  // Clear queue
  metricsQueue = [];
  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }
}

// Initialize Web Vitals monitoring
export function initWebVitals() {
  if (typeof window === 'undefined') return;
  
  // Core Web Vitals
  onLCP((metric) => {
    logMetric(metric);
    sendToAnalytics(metric);
  });
  
  onCLS((metric) => {
    logMetric(metric);
    sendToAnalytics(metric);
  });
  
  // Additional metrics
  onFCP((metric) => {
    logMetric(metric);
    sendToAnalytics(metric);
  });
  
  onTTFB((metric) => {
    logMetric(metric);
    sendToAnalytics(metric);
  });
  
  onINP((metric) => {
    logMetric(metric);
    sendToAnalytics(metric);
  });
  
  // Log initial page load performance
  if (window.performance && window.performance.timing) {
    const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
    if (loadTime > 0 && process.env.NODE_ENV === 'development') {
      console.log(`📊 Page Load Time: ${loadTime}ms`);
    }
  }
  
  // Monitor long tasks
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50 && process.env.NODE_ENV === 'development') {
            console.warn(`⚠️ Long Task Detected: ${entry.duration.toFixed(2)}ms`, entry);
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Long task monitoring not supported
    }
  }
  
  // Flush metrics on page unload
  if ('addEventListener' in window) {
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        flushMetrics();
      }
    });
    
    window.addEventListener('beforeunload', () => {
      flushMetrics();
    });
  }
}

// Export a function to manually report custom metrics
export function reportCustomMetric(name: string, value: number, unit: string = 'ms') {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📈 Custom Metric - ${name}: ${value}${unit}`);
  }
  
  // Send to analytics if needed
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'custom_metric', {
      metric_name: name,
      value: Math.round(value),
      unit,
    });
  }
}

// Helper to measure component render time
export function measureComponentPerformance(componentName: string) {
  const startMark = `${componentName}-start`;
  const endMark = `${componentName}-end`;
  
  return {
    start: () => markPerformance(startMark),
    end: () => {
      markPerformance(endMark);
      const duration = measurePerformance(`${componentName}-render`, startMark, endMark);
      if (duration && duration > 16 && process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ Slow component render: ${componentName} took ${duration.toFixed(2)}ms`);
      }
      return duration;
    },
  };
}