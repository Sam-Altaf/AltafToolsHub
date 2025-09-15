import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use local worker for privacy and offline capability
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface CompressionParams {
  jpegQuality: number;
  scale: number;
  onProgress?: (progress: number, message: string) => void;
}

interface PageImage {
  dataUrl: string;
  width: number;
  height: number;
}

interface CachedPage {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

// Utility function to convert data URL to Uint8Array
function dataURLtoUint8Array(dataURL: string): Uint8Array {
  // Remove the data URL prefix to get base64 string
  const base64String = dataURL.split(',')[1];
  
  // Decode base64 to binary string
  const binaryString = atob(base64String);
  
  // Convert binary string to Uint8Array
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes;
}

// Convert canvas to JPEG with specific quality
function canvasToJPEG(canvas: HTMLCanvasElement, quality: number): Promise<string> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(canvas.toDataURL('image/jpeg', quality));
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      },
      'image/jpeg',
      quality
    );
  });
}

// Render PDF pages to canvases at base resolution (cached for reuse)
async function renderPagesToCanvases(
  pdfBytes: ArrayBuffer,
  scale: number,
  onProgress?: (progress: number, message: string) => void
): Promise<CachedPage[]> {
  const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const cachedPages: CachedPage[] = [];

  // Enhance render scale for better quality (render at higher resolution)
  const enhancedScale = scale * 1.5; // Render at 1.5x the target scale for better quality

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    if (onProgress) {
      const progress = Math.round((pageNum / numPages) * 30);
      onProgress(progress, `Rendering page ${pageNum} of ${numPages}`);
    }

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: enhancedScale });

    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get canvas context');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    };
    await page.render(renderContext).promise;

    cachedPages.push({
      canvas,
      width: viewport.width,
      height: viewport.height,
    });
  }

  return cachedPages;
}

// Convert cached canvases to images with specific quality
async function convertCanvasesToImages(
  cachedPages: CachedPage[],
  quality: number,
  onProgress?: (progress: number, message: string) => void
): Promise<PageImage[]> {
  const pageImages: PageImage[] = [];
  
  for (let i = 0; i < cachedPages.length; i++) {
    if (onProgress) {
      const progress = 30 + Math.round((i / cachedPages.length) * 20);
      onProgress(progress, `Compressing page ${i + 1} of ${cachedPages.length}`);
    }
    
    // Convert to JPEG with quality
    const dataUrl = await canvasToJPEG(cachedPages[i].canvas, quality);
    
    // Adjust dimensions to account for enhanced render scale
    // Since we rendered at 1.5x scale, we need to scale down dimensions
    pageImages.push({
      dataUrl,
      width: cachedPages[i].width / 1.5, // Scale back down
      height: cachedPages[i].height / 1.5, // Scale back down
    });
  }
  
  return pageImages;
}

// Create PDF from images
async function createPDFFromImages(
  images: PageImage[],
  onProgress?: (progress: number, message: string) => void
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  
  for (let i = 0; i < images.length; i++) {
    if (onProgress) {
      const progress = 50 + Math.round((i / images.length) * 40);
      onProgress(progress, `Building PDF page ${i + 1} of ${images.length}`);
    }

    const imageData = images[i].dataUrl;
    
    // Convert data URL to Uint8Array for pdf-lib
    const imageBytes = dataURLtoUint8Array(imageData);
    
    // Embed image
    let embeddedImage;
    if (imageData.startsWith('data:image/jpeg')) {
      embeddedImage = await pdfDoc.embedJpg(imageBytes);
    } else if (imageData.startsWith('data:image/png')) {
      embeddedImage = await pdfDoc.embedPng(imageBytes);
    } else {
      throw new Error('Unsupported image format');
    }

    // Create page with image dimensions
    const page = pdfDoc.addPage([images[i].width, images[i].height]);
    
    // Draw image on page
    page.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: images[i].width,
      height: images[i].height,
    });
  }

  // Save with optimization
  const pdfBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 50,
    updateFieldAppearances: false,
  });

  if (onProgress) {
    onProgress(95, 'Finalizing compression...');
  }

  return pdfBytes;
}

// Simple compression using PDF.js and canvas with caching
export async function compressPDFSimple(
  pdfBytes: ArrayBuffer,
  params: CompressionParams,
  cachedPages?: CachedPage[]
): Promise<{ blob: Blob; cachedPages?: CachedPage[] }> {
  console.log('Starting canvas-based PDF compression with params:', params);
  
  try {
    // Use cached pages if available, otherwise render them
    let pagesToUse = cachedPages;
    if (!pagesToUse) {
      pagesToUse = await renderPagesToCanvases(
        pdfBytes,
        params.scale,
        params.onProgress
      );
    }
    
    // Convert canvases to images with specified quality
    const images = await convertCanvasesToImages(
      pagesToUse,
      params.jpegQuality,
      params.onProgress
    );
    
    // Create new PDF from images
    const compressedBytes = await createPDFFromImages(images, params.onProgress);
    
    console.log('Compression complete. Original size:', pdfBytes.byteLength, 'Compressed size:', compressedBytes.length);
    
    return { 
      blob: new Blob([compressedBytes], { type: 'application/pdf' }),
      cachedPages: pagesToUse
    };
  } catch (error) {
    console.error('Error in canvas-based PDF compression:', error);
    
    // Fallback to basic pdf-lib compression
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Remove metadata
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('Compressed');
      pdfDoc.setCreator('PDF Compressor');
      
      // Get pages for potential scaling
      const pages = pdfDoc.getPages();
      if (params.scale !== 1) {
        pages.forEach(page => {
          const { width, height } = page.getSize();
          page.setSize(width * params.scale, height * params.scale);
          page.scale(params.scale, params.scale);
        });
      }
      
      const fallbackBytes = await pdfDoc.save({
        useObjectStreams: false,
        addDefaultPage: false,
        objectsPerTick: 10,
        updateFieldAppearances: false,
      });
      
      return { blob: new Blob([fallbackBytes], { type: 'application/pdf' }) };
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw error;
    }
  }
}

// Advanced compression with binary search for target size
export async function compressPDFAdvanced(
  pdfBytes: ArrayBuffer,
  params: CompressionParams
): Promise<Blob> {
  // For advanced compression, use moderate quality reduction to preserve readability
  const advancedParams = {
    ...params,
    jpegQuality: Math.max(params.jpegQuality * 0.85, 0.6), // Never go below 60% quality
    scale: Math.max(params.scale * 0.9, 0.75), // Maintain at least 75% scale
  };
  
  const result = await compressPDFSimple(pdfBytes, advancedParams);
  return result.blob;
}

// Binary search to find optimal compression parameters for target size
export async function compressToTargetSize(
  pdfBytes: ArrayBuffer,
  targetSize: number,
  onProgress?: (progress: number, message: string) => void
): Promise<{ blob: Blob; quality: number; scale: number; attempts: number }> {
  // Calculate compression ratio to determine quality range
  const originalSize = pdfBytes.byteLength;
  const compressionRatio = targetSize / originalSize;
  
  // Adaptive quality ranges based on compression ratio
  let minQuality: number;
  let maxQuality: number;
  let minScale: number;
  let maxScale: number;
  
  if (compressionRatio > 0.5) {
    // Target is > 50% of original (light compression)
    minQuality = 0.85;
    maxQuality = 0.98;
    minScale = 0.9;
    maxScale = 1.1; // Allow slight upscaling for quality
  } else if (compressionRatio > 0.25) {
    // Target is 25-50% of original (moderate compression)
    minQuality = 0.7;
    maxQuality = 0.92;
    minScale = 0.8;
    maxScale = 1.0;
  } else if (compressionRatio > 0.1) {
    // Target is 10-25% of original (significant compression)
    minQuality = 0.6;
    maxQuality = 0.85;
    minScale = 0.7;
    maxScale = 0.95;
  } else {
    // Target is < 10% of original (extreme compression)
    minQuality = 0.5; // Never go below 50% quality
    maxQuality = 0.8;
    minScale = 0.6;
    maxScale = 0.9;
  }
  
  let attempts = 0;
  const maxAttempts = 15;
  const tolerance = 0.08; // 8% tolerance for better quality
  
  let bestResult: { blob: Blob; quality: number; scale: number; size: number } | null = null;
  let lastResult: Blob | null = null;
  let cachedPages: CachedPage[] | undefined = undefined;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    // Calculate current parameters
    const quality = (minQuality + maxQuality) / 2;
    const scale = (minScale + maxScale) / 2;
    
    if (onProgress) {
      const overallProgress = Math.round(10 + (attempts / maxAttempts) * 80);
      onProgress(overallProgress, `Optimizing compression... Attempt ${attempts}/${maxAttempts}`);
    }
    
    // Compress with current parameters, reusing cached pages
    const params: CompressionParams = {
      jpegQuality: quality,
      scale: scale,
      onProgress: (progress, message) => {
        if (onProgress) {
          // Scale progress for this attempt
          const attemptProgress = Math.round(10 + ((attempts - 1) / maxAttempts) * 80 + (progress / 100) * (80 / maxAttempts));
          onProgress(attemptProgress, message);
        }
      }
    };
    
    const result = await compressPDFSimple(pdfBytes, params, cachedPages);
    const compressedBlob = result.blob;
    
    // Cache the rendered pages for reuse (only on first attempt)
    if (!cachedPages && result.cachedPages) {
      cachedPages = result.cachedPages;
    }
    
    const currentSize = compressedBlob.size;
    
    // Update best result if this is closer to target
    if (!bestResult || Math.abs(currentSize - targetSize) < Math.abs(bestResult.size - targetSize)) {
      bestResult = { blob: compressedBlob, quality, scale, size: currentSize };
    }
    
    // Check if we're close enough to target
    // For larger files, prioritize quality over exact size match
    const effectiveTolerance = compressionRatio > 0.5 ? 0.15 : tolerance; // 15% tolerance for light compression
    if (Math.abs(currentSize - targetSize) <= targetSize * effectiveTolerance) {
      console.log(`Target achieved in ${attempts} attempts. Target: ${targetSize}, Achieved: ${currentSize}`);
      return { blob: compressedBlob, quality, scale, attempts };
    }
    
    // Adjust parameters based on result
    if (currentSize > targetSize) {
      // File is too large, reduce quality/scale
      // For light compression, be more conservative with quality reduction
      const qualityStep = compressionRatio > 0.5 ? 0.02 : 0.05;
      const scaleStep = compressionRatio > 0.5 ? 0.02 : 0.05;
      
      if (quality > minQuality + qualityStep) {
        maxQuality = quality;
      }
      if (scale > minScale + scaleStep) {
        maxScale = scale;
      }
    } else {
      // File is too small, increase quality/scale
      const qualityStep = compressionRatio > 0.5 ? 0.02 : 0.05;
      const scaleStep = compressionRatio > 0.5 ? 0.02 : 0.05;
      
      if (quality < maxQuality - qualityStep) {
        minQuality = quality;
      }
      if (scale < maxScale - scaleStep) {
        minScale = scale;
      }
    }
    
    // Check if we've converged
    if (maxQuality - minQuality < 0.02 && maxScale - minScale < 0.02) {
      console.log(`Converged after ${attempts} attempts`);
      break;
    }
    
    lastResult = compressedBlob;
  }
  
  // Return best result found
  if (bestResult) {
    console.log(`Best result after ${attempts} attempts. Target: ${targetSize}, Achieved: ${bestResult.size}`);
    return { blob: bestResult.blob, quality: bestResult.quality, scale: bestResult.scale, attempts };
  }
  
  // Fallback to last result
  if (lastResult) {
    return { blob: lastResult, quality: (minQuality + maxQuality) / 2, scale: (minScale + maxScale) / 2, attempts };
  }
  
  throw new Error('Failed to compress PDF to target size');
}