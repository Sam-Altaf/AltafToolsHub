import { useEffect } from "react";

// Performance optimization hook for Core Web Vitals
export function usePerformanceOptimization() {
  useEffect(() => {
    // Preconnect to external domains
    const preconnectDomains = [
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com'
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Font optimization will be handled by the existing font loading system
    // Skip preloading non-existent font files

    // Optimize images with loading="lazy" where appropriate
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach((img, index) => {
      // First 3 images load eagerly (above fold), rest lazy
      if (index < 3) {
        img.setAttribute('loading', 'eager');
      } else {
        img.setAttribute('loading', 'lazy');
      }
    });

    // Prefetch critical routes
    const criticalRoutes = [
      '/compress-pdf',
      '/unlock-pdf', 
      '/qr-generator',
      '/all-tools'
    ];

    criticalRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });

  }, []);
}

// Critical CSS injection
export function injectCriticalCSS() {
  const criticalCSS = `
    /* Critical above-the-fold styles */
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .nav-header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
    }
    
    .loading-skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    /* Core layout styles */
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #8b5cf6, #3b82f6);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      transition: transform 0.2s ease;
    }
    
    .btn-primary:hover {
      transform: translateY(-1px);
    }
  `;

  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
}

// Resource hints for better performance
export function addResourceHints() {
  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
    { rel: 'dns-prefetch', href: '//www.googletagmanager.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    { rel: 'preload', href: '/favicon.svg', as: 'image', type: 'image/svg+xml' }
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    Object.entries(hint).forEach(([key, value]) => {
      if (key === 'crossOrigin') {
        link.crossOrigin = value as string;
      } else {
        link.setAttribute(key, value as string);
      }
    });
    document.head.appendChild(link);
  });
}

// Defer non-critical CSS
export function deferNonCriticalCSS() {
  const nonCriticalCSS = [
    '/assets/css/animations.css',
    '/assets/css/components.css'
  ];

  nonCriticalCSS.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    
    // Fallback for browsers that don't support preload
    const noscript = document.createElement('noscript');
    const fallbackLink = document.createElement('link');
    fallbackLink.rel = 'stylesheet';
    fallbackLink.href = href;
    noscript.appendChild(fallbackLink);
    
    document.head.appendChild(link);
    document.head.appendChild(noscript);
  });
}

// Web Vitals monitoring
export function initWebVitalsMonitoring() {
  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    
    if (window.gtag) {
      window.gtag('event', 'lcp_measurement', {
        value: Math.round(lastEntry.startTime),
        metric_name: 'largest_contentful_paint'
      });
    }
  });

  if (PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  }

  // First Input Delay (FID) / Interaction to Next Paint (INP)
  const fidObserver = new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach((entry: any) => {
      if (window.gtag) {
        window.gtag('event', 'fid_measurement', {
          value: Math.round((entry.processingStart || entry.startTime) - entry.startTime),
          metric_name: 'first_input_delay'
        });
      }
    });
  });

  if (PerformanceObserver.supportedEntryTypes.includes('first-input')) {
    fidObserver.observe({ type: 'first-input', buffered: true });
  }

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    
    if (window.gtag) {
      window.gtag('event', 'cls_measurement', {
        value: Math.round(clsValue * 1000),
        metric_name: 'cumulative_layout_shift'
      });
    }
  });

  if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  }
}

// Optimize third-party scripts
export function optimizeThirdPartyScripts() {
  // Defer Google Analytics until user interaction
  let analyticsLoaded = false;
  
  const loadAnalytics = () => {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    
    // Analytics already loaded in index.html, this is for additional optimization
    if (window.gtag) {
      window.gtag('config', 'G-26X6DS9BXF', {
        send_page_view: true,
        cookie_flags: 'max-age=7200;secure;samesite=none'
      });
    }
  };

  // Load analytics on first user interaction
  const interactionEvents = ['scroll', 'click', 'keydown', 'touchstart'];
  const onFirstInteraction = () => {
    loadAnalytics();
    interactionEvents.forEach(event => {
      document.removeEventListener(event, onFirstInteraction, true);
    });
  };

  interactionEvents.forEach(event => {
    document.addEventListener(event, onFirstInteraction, true);
  });

  // Fallback: load after 3 seconds if no interaction
  setTimeout(loadAnalytics, 3000);
}