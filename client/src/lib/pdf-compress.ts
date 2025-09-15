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
  baseScale: number; // Track the scale used for base rendering
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

  // Fixed base scale for high-quality base rendering
  const baseScale = 2.0; // Always render at 2x for high quality base

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    if (onProgress) {
      const progress = Math.round((pageNum / numPages) * 30);
      onProgress(progress, `Rendering page ${pageNum} of ${numPages}`);
    }

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: baseScale });

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
      baseScale: baseScale
    });
  }

  return cachedPages;
}

// Resample cached canvases to a specific scale
function resampleCanvases(
  cachedPages: CachedPage[],
  targetScale: number
): HTMLCanvasElement[] {
  const resampledCanvases: HTMLCanvasElement[] = [];
  
  for (const cachedPage of cachedPages) {
    // Calculate new dimensions based on target scale relative to base scale
    const scaleFactor = targetScale / cachedPage.baseScale;
    const newWidth = Math.round(cachedPage.width * scaleFactor);
    const newHeight = Math.round(cachedPage.height * scaleFactor);
    
    // Create new canvas with target dimensions
    const newCanvas = document.createElement('canvas');
    const newContext = newCanvas.getContext('2d');
    if (!newContext) throw new Error('Failed to get canvas context for resampling');
    
    newCanvas.width = newWidth;
    newCanvas.height = newHeight;
    
    // Configure high-quality image smoothing
    newContext.imageSmoothingEnabled = true;
    newContext.imageSmoothingQuality = 'high';
    
    // Draw the cached canvas onto the new canvas with scaling
    newContext.drawImage(
      cachedPage.canvas,
      0, 0, cachedPage.width, cachedPage.height,
      0, 0, newWidth, newHeight
    );
    
    resampledCanvases.push(newCanvas);
  }
  
  return resampledCanvases;
}

// Convert canvases to images with specific quality
async function convertCanvasesToImages(
  canvases: HTMLCanvasElement[],
  quality: number,
  onProgress?: (progress: number, message: string) => void
): Promise<PageImage[]> {
  const pageImages: PageImage[] = [];
  
  for (let i = 0; i < canvases.length; i++) {
    if (onProgress) {
      const progress = 30 + Math.round((i / canvases.length) * 20);
      onProgress(progress, `Compressing page ${i + 1} of ${canvases.length}`);
    }
    
    // Convert to JPEG with quality
    const dataUrl = await canvasToJPEG(canvases[i], quality);
    
    pageImages.push({
      dataUrl,
      width: canvases[i].width,
      height: canvases[i].height,
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
    
    // Resample canvases to the target scale
    const resampledCanvases = resampleCanvases(pagesToUse, params.scale);
    
    // Convert canvases to images with specified quality
    const images = await convertCanvasesToImages(
      resampledCanvases,
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
  
  // New quality/scale ranges with higher quality for better results
  let minQuality: number;
  let maxQuality: number;
  let minScale: number;
  let maxScale: number;
  
  if (compressionRatio >= 0.5) {
    // Light compression (target is ≥50% of original)
    minQuality = 0.92;
    maxQuality = 0.99;
    minScale = 0.95;
    maxScale = 1.0;
  } else if (compressionRatio >= 0.25) {
    // Moderate compression (target is 25-50% of original)
    minQuality = 0.75;
    maxQuality = 0.97;
    minScale = 0.85;
    maxScale = 1.0;
  } else if (compressionRatio >= 0.1) {
    // Significant compression (target is 10-25% of original)
    minQuality = 0.6;
    maxQuality = 0.9;
    minScale = 0.75;
    maxScale = 0.95;
  } else {
    // Extreme compression (target is <10% of original)
    minQuality = 0.4;
    maxQuality = 0.75;
    minScale = 0.6;
    maxScale = 0.9;
  }
  
  let attempts = 0;
  const maxAttempts = 22; // Increased attempts for better precision
  const tolerance = 0.025; // Fixed 2.5% tolerance
  
  let bestUnder: { blob: Blob; quality: number; scale: number; size: number } | null = null;
  let bestOver: { blob: Blob; quality: number; scale: number; size: number } | null = null;
  let cachedPages: CachedPage[] | undefined = undefined;
  
  // Two-phase search approach
  // Phase 1: Test multiple scales to find the best one
  const scalesToTest = [minScale, (minScale + maxScale) / 2, maxScale];
  const scaleResults: { scale: number; bestQuality: number; bestSize: number; blob: Blob }[] = [];
  
  for (const testScale of scalesToTest) {
    if (onProgress) {
      const phaseProgress = Math.round(10 + (scalesToTest.indexOf(testScale) / scalesToTest.length) * 30);
      onProgress(phaseProgress, `Testing scale ${testScale.toFixed(2)}...`);
    }
    
    // Binary search for best quality at this scale
    let scaleMinQ = minQuality;
    let scaleMaxQ = maxQuality;
    let scaleBestResult: { quality: number; size: number; blob: Blob } | null = null;
    
    for (let i = 0; i < 5; i++) { // 5 iterations per scale
      attempts++;
      const testQuality = (scaleMinQ + scaleMaxQ) / 2;
      
      const params: CompressionParams = {
        jpegQuality: testQuality,
        scale: testScale,
        onProgress: (progress, message) => {
          if (onProgress) {
            const attemptProgress = Math.round(10 + (attempts / maxAttempts) * 70);
            onProgress(attemptProgress, message);
          }
        }
      };
      
      const result = await compressPDFSimple(pdfBytes, params, cachedPages);
      const compressedBlob = result.blob;
      
      // Cache the rendered pages for reuse
      if (!cachedPages && result.cachedPages) {
        cachedPages = result.cachedPages;
      }
      
      const currentSize = compressedBlob.size;
      
      // Track best result for this scale
      if (!scaleBestResult || Math.abs(currentSize - targetSize) < Math.abs(scaleBestResult.size - targetSize)) {
        scaleBestResult = { quality: testQuality, size: currentSize, blob: compressedBlob };
      }
      
      // Update overall best results
      if (currentSize <= targetSize) {
        if (!bestUnder || currentSize > bestUnder.size) {
          bestUnder = { blob: compressedBlob, quality: testQuality, scale: testScale, size: currentSize };
        }
        scaleMinQ = testQuality; // Can increase quality
      } else {
        if (!bestOver || currentSize < bestOver.size) {
          bestOver = { blob: compressedBlob, quality: testQuality, scale: testScale, size: currentSize };
        }
        scaleMaxQ = testQuality; // Must decrease quality
      }
      
      // Check if we've hit the target within tolerance
      if (Math.abs(currentSize - targetSize) <= targetSize * tolerance) {
        console.log(`Target achieved at scale ${testScale} in ${attempts} attempts. Target: ${targetSize}, Achieved: ${currentSize}`);
        return { blob: compressedBlob, quality: testQuality, scale: testScale, attempts };
      }
    }
    
    if (scaleBestResult) {
      scaleResults.push({
        scale: testScale,
        bestQuality: scaleBestResult.quality,
        bestSize: scaleBestResult.size,
        blob: scaleBestResult.blob
      });
    }
  }
  
  // Phase 2: Fine-tune on the best scale
  let bestScale = maxScale;
  let bestScaleResult = scaleResults[0];
  
  for (const result of scaleResults) {
    if (result.bestSize <= targetSize && (!bestScaleResult || result.bestSize > bestScaleResult.bestSize)) {
      bestScaleResult = result;
      bestScale = result.scale;
    } else if (!bestScaleResult || Math.abs(result.bestSize - targetSize) < Math.abs(bestScaleResult.bestSize - targetSize)) {
      bestScaleResult = result;
      bestScale = result.scale;
    }
  }
  
  // Fine-tune on the best scale
  let fineMinQ = Math.max(minQuality, bestScaleResult.bestQuality - 0.1);
  let fineMaxQ = Math.min(maxQuality, bestScaleResult.bestQuality + 0.1);
  
  while (attempts < maxAttempts) {
    attempts++;
    const quality = (fineMinQ + fineMaxQ) / 2;
    
    if (onProgress) {
      const overallProgress = Math.round(40 + (attempts / maxAttempts) * 50);
      onProgress(overallProgress, `Fine-tuning compression... Attempt ${attempts}/${maxAttempts}`);
    }
    
    const params: CompressionParams = {
      jpegQuality: quality,
      scale: bestScale,
      onProgress: (progress, message) => {
        if (onProgress) {
          const attemptProgress = Math.round(40 + ((attempts - 1) / maxAttempts) * 50);
          onProgress(attemptProgress, message);
        }
      }
    };
    
    const result = await compressPDFSimple(pdfBytes, params, cachedPages);
    const compressedBlob = result.blob;
    const currentSize = compressedBlob.size;
    
    // Update best results
    if (currentSize <= targetSize) {
      if (!bestUnder || currentSize > bestUnder.size) {
        bestUnder = { blob: compressedBlob, quality, scale: bestScale, size: currentSize };
      }
      fineMinQ = quality;
    } else {
      if (!bestOver || currentSize < bestOver.size) {
        bestOver = { blob: compressedBlob, quality, scale: bestScale, size: currentSize };
      }
      fineMaxQ = quality;
    }
    
    // Check if we've hit the target within tolerance
    if (Math.abs(currentSize - targetSize) <= targetSize * tolerance) {
      console.log(`Target achieved in ${attempts} attempts. Target: ${targetSize}, Achieved: ${currentSize}`);
      return { blob: compressedBlob, quality, scale: bestScale, attempts };
    }
    
    // Check if we've converged (very small quality range)
    if (fineMaxQ - fineMinQ < 0.01) {
      console.log(`Converged after ${attempts} attempts`);
      break;
    }
  }
  
  // Return the best result (prefer largest under target, or smallest over if no under)
  if (bestUnder) {
    console.log(`Best under target after ${attempts} attempts. Target: ${targetSize}, Achieved: ${bestUnder.size}`);
    return { blob: bestUnder.blob, quality: bestUnder.quality, scale: bestUnder.scale, attempts };
  } else if (bestOver) {
    console.log(`Could not achieve target, returning best over after ${attempts} attempts. Target: ${targetSize}, Achieved: ${bestOver.size}`);
    return { blob: bestOver.blob, quality: bestOver.quality, scale: bestOver.scale, attempts };
  }
  
  // Fallback: if we somehow have no results, use moderate settings
  const fallbackParams: CompressionParams = {
    jpegQuality: 0.8,
    scale: 0.9,
    onProgress
  };
  
  const fallbackResult = await compressPDFSimple(pdfBytes, fallbackParams, cachedPages);
  console.log(`Fallback compression used. Target: ${targetSize}, Achieved: ${fallbackResult.blob.size}`);
  return { blob: fallbackResult.blob, quality: 0.8, scale: 0.9, attempts };
}