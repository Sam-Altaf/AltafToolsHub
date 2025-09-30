// Lazy load heavy libraries to improve initial load performance

// PDF libraries - only load when needed
export const loadPdfLib = () => import('pdf-lib');
export const loadPdfLibWithEncrypt = () => import('pdf-lib-with-encrypt');
export const loadPdfjs = async () => {
  const pdfjsLib = await import('pdfjs-dist');
  // Configure worker path
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  return pdfjsLib;
};

// Tesseract for OCR - very heavy, load on demand
export const loadTesseract = () => import('tesseract.js');

// Heavy UI libraries
export const loadFramerMotion = () => import('framer-motion');
export const loadRecharts = () => import('recharts');

// Utility to preload libraries after initial render
export const preloadHeavyLibraries = () => {
  // Preload after a delay to not block initial render
  setTimeout(() => {
    // Start preloading commonly used heavy libraries
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        // Preload PDF libraries as they're commonly used
        loadPdfjs().catch(() => {});
        loadPdfLib().catch(() => {});
      });
    }
  }, 3000);
};

// Check if we're in a low-end device
export const isLowEndDevice = () => {
  // Check for low memory
  const memory = (navigator as any).deviceMemory;
  if (memory && memory < 4) return true;
  
  // Check for slow connection
  const connection = (navigator as any).connection;
  if (connection && connection.effectiveType && connection.effectiveType === '2g') return true;
  
  return false;
};

// Defer non-critical work
export const deferWork = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback);
  } else {
    setTimeout(callback, 100);
  }
};