import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker in a Vite-safe way
export const configurePDFJSWorker = () => {
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    // Use the bundled worker from pdfjs-dist
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).href;
  }
};

// Configure worker and return pdfjsLib for use
export const getPDFJS = () => {
  configurePDFJSWorker();
  return pdfjsLib;
};