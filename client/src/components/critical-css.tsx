import { useEffect } from "react";

// Critical CSS component for above-the-fold optimization
export default function CriticalCSS() {
  useEffect(() => {
    // Inject critical CSS styles
    const criticalStyles = `
      <style id="critical-css">
        /* Critical Path CSS - Above the fold styles */
        
        /* Reset and base styles */
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        html {
          line-height: 1.15;
          -webkit-text-size-adjust: 100%;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        
        body {
          font-family: inherit;
          line-height: 1.6;
          color: #1a1a1a;
          background: #ffffff;
        }
        
        /* Dark mode base */
        .dark {
          color: #ffffff;
          background: #0a0a0a;
        }
        
        /* Header and navigation - critical for LCP */
        .nav-header {
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .dark .nav-header {
          background: rgba(10, 10, 10, 0.95);
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }
        
        /* Hero section - critical for LCP */
        .hero-section {
          min-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem 1rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
        
        .dark .hero-section {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }
        
        /* Typography - critical for LCP */
        .hero-title {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
        
        .hero-subtitle {
          font-size: clamp(1.1rem, 3vw, 1.25rem);
          color: #64748b;
          margin-bottom: 2rem;
          max-width: 600px;
        }
        
        .dark .hero-subtitle {
          color: #94a3b8;
        }
        
        /* Buttons - critical for interaction */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          font-size: 1rem;
          line-height: 1.5;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%);
          color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px -8px rgba(139, 92, 246, 0.6);
        }
        
        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #374151;
        }
        
        .dark .btn-secondary {
          background: rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.1);
          color: #d1d5db;
        }
        
        /* Layout containers */
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .container-lg {
          max-width: 1400px;
        }
        
        /* Grid system */
        .grid {
          display: grid;
          gap: 1.5rem;
        }
        
        .grid-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-3 { grid-template-columns: repeat(3, 1fr); }
        
        @media (max-width: 768px) {
          .grid-2, .grid-3 {
            grid-template-columns: 1fr;
          }
        }
        
        /* Card components - visible above fold */
        .card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .dark .card {
          background: rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.1);
        }
        
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        /* Loading states */
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 0.25rem;
        }
        
        .dark .skeleton {
          background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
          background-size: 200% 100%;
        }
        
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        /* Logo and branding */
        .logo {
          height: 2.5rem;
          width: auto;
        }
        
        /* Utility classes */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        
        .mt-4 { margin-top: 1rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mt-8 { margin-top: 2rem; }
        .mb-8 { margin-bottom: 2rem; }
        
        .pt-4 { padding-top: 1rem; }
        .pb-4 { padding-bottom: 1rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        
        /* Responsive utilities */
        @media (max-width: 640px) {
          .container { padding: 0 0.75rem; }
          .hero-section { padding: 1.5rem 0.75rem; }
          .card { padding: 1.5rem; }
        }
        
        /* Font display optimization */
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 300 900;
          font-display: swap;
          src: url('/fonts/inter-var.woff2') format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
        
        /* Performance optimizations */
        img {
          max-width: 100%;
          height: auto;
        }
        
        /* Prevent layout shift */
        .aspect-video {
          aspect-ratio: 16/9;
        }
        
        .aspect-square {
          aspect-ratio: 1/1;
        }
      </style>
    `;

    // Inject critical CSS into head if not already present
    if (!document.getElementById('critical-css')) {
      document.head.insertAdjacentHTML('afterbegin', criticalStyles);
    }

    // Remove critical CSS after full stylesheet loads
    const removeCriticalCSS = () => {
      const criticalCSSElement = document.getElementById('critical-css');
      if (criticalCSSElement) {
        setTimeout(() => {
          criticalCSSElement.remove();
        }, 1000); // Give time for main CSS to load
      }
    };

    // Remove when main CSS is loaded
    if (document.readyState === 'complete') {
      removeCriticalCSS();
    } else {
      window.addEventListener('load', removeCriticalCSS);
    }

  }, []);

  return null;
}