import { useEffect } from "react";

// Font optimization component for Web Font performance
export default function FontOptimization() {
  useEffect(() => {
    // Optimize font loading with font-display: swap
    const optimizeFonts = () => {
      // Add font-display: swap to existing font faces
      const style = document.createElement('style');
      style.textContent = `
        /* Font optimization for Core Web Vitals */
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 100 900;
          font-display: swap; /* Prevents invisible text during font load */
          src: url('/fonts/inter-var.woff2') format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
        
        /* Fallback font stack for better performance */
        body, .font-inter {
          font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }
        
        /* Prevent layout shift during font loading */
        .font-loading {
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
          visibility: hidden;
        }
        
        .font-loaded {
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          visibility: visible;
        }
      `;
      document.head.appendChild(style);
    };

    // Preload critical fonts
    const preloadFonts = () => {
      const fonts = [
        { href: '/fonts/inter-var.woff2', type: 'font/woff2' }
      ];

      fonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = font.type;
        link.crossOrigin = 'anonymous';
        link.href = font.href;
        document.head.appendChild(link);
      });
    };

    // Font loading API optimization
    const optimizeWithFontAPI = async () => {
      if ('fonts' in document) {
        try {
          // Load Inter font family
          const interFont = new FontFace(
            'Inter',
            'url(/fonts/inter-var.woff2) format("woff2")',
            {
              style: 'normal',
              weight: '100 900',
              display: 'swap'
            }
          );

          await interFont.load();
          (document.fonts as any).add(interFont);
          
          // Add font-loaded class to body
          document.body.classList.add('font-loaded');
          document.body.classList.remove('font-loading');
          
          // Track font loading performance
          if (window.trackEngagement) {
            window.trackEngagement('font_loaded', {
              font_family: 'Inter',
              load_time: Date.now(),
              method: 'font_loading_api'
            });
          }
        } catch (error) {
          console.warn('Font Loading API failed, falling back to CSS:', error);
          document.body.classList.add('font-loaded');
          document.body.classList.remove('font-loading');
        }
      }
    };

    // Initialize font optimization
    document.body.classList.add('font-loading');
    optimizeFonts();
    preloadFonts();
    optimizeWithFontAPI();

    // Fallback timeout for font loading
    setTimeout(() => {
      if (!document.body.classList.contains('font-loaded')) {
        document.body.classList.add('font-loaded');
        document.body.classList.remove('font-loading');
      }
    }, 3000);

  }, []);

  return null;
}

// Font loading detection hook
export function useFontLoading() {
  useEffect(() => {
    if ('fonts' in document) {
      // Check if fonts are already loaded
      if ((document.fonts as any).check('16px Inter')) {
        document.body.classList.add('font-loaded');
        document.body.classList.remove('font-loading');
      } else {
        // Wait for fonts to load
        (document.fonts as any).ready.then(() => {
          document.body.classList.add('font-loaded');
          document.body.classList.remove('font-loading');
        });
      }
    }
  }, []);
}

// Preconnect to font providers
export function addFontPreconnects() {
  const providers = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  providers.forEach(provider => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = provider;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}