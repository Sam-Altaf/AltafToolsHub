import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use local worker for privacy and offline capability
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// Cache for rendered pages at different scales to avoid re-rendering
const scaleCache = new Map<string, RenderedPage[]>();

// Generate a unique identifier for a PDF
function generatePDFIdentifier(pdfBytes: ArrayBuffer): string {
  // Create a simple hash based on size and first few bytes
  const view = new Uint8Array(pdfBytes);
  const sampleSize = Math.min(1000, view.length);
  let hash = pdfBytes.byteLength;
  for (let i = 0; i < sampleSize; i += 100) {
    hash = ((hash << 5) - hash) + view[i];
    hash = hash & hash; // Convert to 32bit integer
  }
  return `${pdfBytes.byteLength}_${Math.abs(hash)}`;
}

interface CompressionParams {
  jpegQuality: number;
  scale: number;
  onProgress?: (progress: number, message: string) => void;
  mode?: 'highest' | 'balanced' | 'fast' | 'custom' | 'hd'; // 'hd' for compatibility
  preserveText?: boolean;
}

interface PageImage {
  dataUrl: string;
  width: number;
  height: number;
}

interface RenderedPage {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

// Utility function to convert data URL to Uint8Array
function dataURLtoUint8Array(dataURL: string): Uint8Array {
  const base64String = dataURL.split(',')[1];
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Upscale PDF to target size by adding metadata padding with binary search precision
async function upscalePDFToTarget(pdfBytes: Uint8Array, currentSize: number, targetSize: number): Promise<Uint8Array> {
  const paddingNeeded = targetSize - currentSize;
  console.log(`Upscaling PDF: Current ${currentSize} bytes, Target ${targetSize} bytes, Padding needed: ~${paddingNeeded} bytes`);
  
  if (paddingNeeded <= 0) {
    return pdfBytes;
  }
  
  // Guardrail: Cap maximum target at 20MB to support new size options
  if (targetSize > 20 * 1024 * 1024) {
    console.warn(`Target size ${targetSize} exceeds 20MB cap. Limiting to 20MB.`);
    return pdfBytes;
  }
  
  try {
    // Load the PDF once
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Non-compressible ASCII pattern for padding
    const paddingPattern = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=!@#$%^&*()_';
    
    // CRITICAL FIX: PDF metadata encoding causes ~4-8x size inflation
    // Account for this when calculating padding estimates
    const pdfEncodingOverhead = 6; // Conservative estimate (each char takes ~6x space in PDF)
    const estimatedRawPadding = paddingNeeded / pdfEncodingOverhead;
    
    // Binary search for exact padding size needed - use MUCH smaller initial range
    let minPadding = Math.floor(estimatedRawPadding * 0.5); // Start very conservative
    let maxPadding = Math.ceil(estimatedRawPadding * 2.0); // Allow some overshoot room
    let bestBytes: Uint8Array | null = null;
    let bestSize = currentSize;
    let attempts = 0;
    const maxAttempts = 15;
    
    console.log(`Binary search for padding: range ${minPadding} to ${maxPadding} bytes (accounting for ${pdfEncodingOverhead}x PDF encoding overhead)`);
    
    while (attempts < maxAttempts && maxPadding - minPadding > 1000) { // 1KB precision
      attempts++;
      const testPadding = Math.floor((minPadding + maxPadding) / 2);
      
      // Generate padding string efficiently using repeat
      const repeatCount = Math.ceil(testPadding / paddingPattern.length);
      const paddingStr = paddingPattern.repeat(repeatCount).slice(0, testPadding);
      
      // Add padding to a single metadata field (Creator) to avoid overwrites
      pdfDoc.setCreator(`AltafToolsHub_Padding_${paddingStr}`);
      pdfDoc.setProducer(`AltafToolsHub_v1.0`); // Small fixed field
      
      // Save with compression disabled
      const testBytes = await pdfDoc.save({ useObjectStreams: false });
      const testSize = testBytes.length;
      
      console.log(`Upscale attempt ${attempts}: Padding ${testPadding} bytes → Result ${testSize} bytes (${(testSize/targetSize*100).toFixed(1)}% of target)`);
      
      // Check if we hit the target window (95-100%)
      if (testSize >= targetSize * 0.95 && testSize <= targetSize * 1.00) {
        console.log(`✓ Target achieved: ${testSize} bytes (${(testSize/targetSize*100).toFixed(1)}% of target)`);
        return testBytes;
      }
      
      // Update best result if closer to target
      if (testSize <= targetSize && Math.abs(testSize - targetSize) < Math.abs(bestSize - targetSize)) {
        bestBytes = testBytes;
        bestSize = testSize;
      }
      
      // Adjust search range
      if (testSize < targetSize) {
        minPadding = testPadding; // Need more padding
      } else {
        maxPadding = testPadding; // Need less padding
      }
    }
    
    // If we have a result within acceptable range, return it
    if (bestBytes && bestSize >= targetSize * 0.90 && bestSize <= targetSize * 1.00) {
      console.log(`Upscaling complete: ${bestSize} bytes (${(bestSize/targetSize*100).toFixed(1)}% of target) after ${attempts} attempts`);
      return bestBytes;
    }
    
    // Final attempt: use the calculated midpoint
    const finalPadding = Math.floor((minPadding + maxPadding) / 2);
    const finalPaddingStr = paddingPattern.repeat(Math.ceil(finalPadding / paddingPattern.length)).slice(0, finalPadding);
    pdfDoc.setCreator(`AltafToolsHub_Padding_${finalPaddingStr}`);
    pdfDoc.setProducer(`AltafToolsHub_v1.0`);
    
    const finalBytes = await pdfDoc.save({ useObjectStreams: false });
    const finalSize = finalBytes.length;
    
    console.log(`Final upscale result: ${finalSize} bytes (${(finalSize/targetSize*100).toFixed(1)}% of target)`);
    
    // Return final result even if not perfect (better than nothing)
    return finalBytes;
    
  } catch (error) {
    console.error('Error upscaling PDF:', error);
    // Return original if upscaling fails
    return pdfBytes;
  }
}

// Convert canvas to image with HD quality settings
function canvasToImage(canvas: HTMLCanvasElement, quality: number, format: 'jpeg' | 'png' = 'jpeg'): Promise<string> {
  return new Promise((resolve, reject) => {
    // For HD quality, use PNG for text-heavy content to preserve clarity
    const imageFormat = format === 'png' ? 'image/png' : 'image/jpeg';
    const imageQuality = format === 'png' ? undefined : quality;
    
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          // Fallback to toDataURL if blob fails
          if (format === 'png') {
            resolve(canvas.toDataURL('image/png'));
          } else {
            resolve(canvas.toDataURL('image/jpeg', quality));
          }
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      },
      imageFormat,
      imageQuality
    );
  });
}

// Get or render PDF pages at specified scale (with caching)
async function getOrRenderPages(
  pdfBytes: ArrayBuffer,
  scale: number,
  onProgress?: (progress: number, message: string) => void
): Promise<RenderedPage[]> {
  // Create unique cache key including PDF identifier and scale
  const pdfId = generatePDFIdentifier(pdfBytes);
  const cacheKey = `${pdfId}_${scale.toFixed(3)}`;
  
  // Check cache first
  if (scaleCache.has(cacheKey)) {
    if (onProgress) {
      onProgress(20, `Using cached render at scale ${scale.toFixed(2)}`);
    }
    return scaleCache.get(cacheKey)!;
  }
  
  // Clean up old cache entries if cache gets too large (keep last 10 entries)
  if (scaleCache.size > 10) {
    const firstKey = scaleCache.keys().next().value;
    if (firstKey) scaleCache.delete(firstKey);
  }
  
  // Render pages if not cached
  const renderedPages = await renderPDFPages(pdfBytes, scale, onProgress);
  
  // Store in cache with unique key
  scaleCache.set(cacheKey, renderedPages);
  
  return renderedPages;
}

// Render PDF pages to canvases at specified scale
async function renderPDFPages(
  pdfBytes: ArrayBuffer,
  scale: number,
  onProgress?: (progress: number, message: string) => void
): Promise<RenderedPage[]> {
  // Create a copy of the ArrayBuffer to avoid detachment issues
  const pdfBytesCopy = pdfBytes.slice(0);
  const loadingTask = pdfjsLib.getDocument({ data: pdfBytesCopy });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const renderedPages: RenderedPage[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    if (onProgress) {
      const progress = Math.round((pageNum / numPages) * 20);
      onProgress(progress, `Rendering page ${pageNum} of ${numPages}`);
    }

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    // Create canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get canvas context');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Configure HD quality rendering with maximum quality settings
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    
    // Set high-quality rendering hints for better text clarity
    context.textRendering = 'optimizeLegibility';
    context.filter = 'none'; // No filtering for crisp text

    // Render page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    };
    await page.render(renderContext).promise;

    renderedPages.push({
      canvas,
      width: viewport.width,
      height: viewport.height
    });
  }

  return renderedPages;
}

// Convert rendered pages to images with HD quality preservation
async function convertPagesToImages(
  pages: RenderedPage[],
  quality: number,
  onProgress?: (progress: number, message: string) => void,
  mode: 'highest' | 'balanced' | 'fast' | 'custom' | 'hd' = 'balanced'
): Promise<PageImage[]> {
  const pageImages: PageImage[] = [];
  
  for (let i = 0; i < pages.length; i++) {
    if (onProgress) {
      const progress = 20 + Math.round((i / pages.length) * 30);
      onProgress(progress, `Compressing page ${i + 1} of ${pages.length} (${mode.toUpperCase()} mode)`);
    }
    
    // Always use JPEG for consistent compression behavior
    // Highest quality mode uses maximum quality for text clarity
    let adjustedQuality = quality;
    if (mode === 'highest' || mode === 'hd') {
      // Highest Quality: Maximum quality for best text preservation
      adjustedQuality = Math.min(0.99, quality + 0.08); // Significant boost for text clarity
    }
    
    const dataUrl = await canvasToImage(pages[i].canvas, adjustedQuality, 'jpeg');
    
    pageImages.push({
      dataUrl,
      width: pages[i].width,
      height: pages[i].height,
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

// HD Quality compression with advanced parameters
export async function compressPDFSimple(
  pdfBytes: ArrayBuffer,
  params: CompressionParams
): Promise<{ blob: Blob }> {
  const mode = params.mode || 'balanced';
  
  // Note: Cache clearing is handled in compressToTargetSize to allow render reuse across attempts
  
  // Use params as-is without enforcing minimum quality floors
  // The binary search algorithm will find the optimal quality/scale for the target size
  let adjustedParams = { ...params };
  
  console.log(`Starting PDF compression in ${mode.toUpperCase()} mode:`, adjustedParams);
  
  try {
    // Get or render pages at specified scale (uses cache if available)
    const renderedPages = await getOrRenderPages(
      pdfBytes,
      adjustedParams.scale,
      adjustedParams.onProgress
    );
    
    // Convert to images with mode-specific quality settings
    const images = await convertPagesToImages(
      renderedPages,
      adjustedParams.jpegQuality,
      adjustedParams.onProgress,
      mode
    );
    
    // Create new PDF from images
    const compressedBytes = await createPDFFromImages(images, adjustedParams.onProgress);
    
    console.log(`Compression complete (${mode} mode). Original: ${pdfBytes.byteLength}, Compressed: ${compressedBytes.length}`);
    
    return { 
      blob: new Blob([compressedBytes], { type: 'application/pdf' })
    };
  } catch (error) {
    console.error('Error in PDF compression:', error);
    
    // Fallback to basic pdf-lib compression
    try {
      // Create a copy to avoid detachment issues
      const pdfBytesCopy = pdfBytes.slice(0);
      const pdfDoc = await PDFDocument.load(pdfBytesCopy);
      
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

// Advanced Highest Quality compression using optimal parameters
export async function compressPDFAdvanced(
  pdfBytes: ArrayBuffer,
  params: CompressionParams
): Promise<Blob> {
  // Default to Highest mode for advanced compression
  const highestParams = { ...params, mode: params.mode || 'highest' as const };
  const result = await compressPDFSimple(pdfBytes, highestParams);
  return result.blob;
}

// Quality presets for easy use
export const COMPRESSION_PRESETS = {
  highest: {
    jpegQuality: 0.95, // Maximum quality for best text clarity
    scale: 0.98,       // Near-original resolution for sharp text
    mode: 'highest' as const,
    description: 'Highest Quality - Maximum text clarity and sharpness'
  },
  hd: {
    jpegQuality: 0.95, // Alias for highest quality for compatibility
    scale: 0.98,
    mode: 'highest' as const,
    description: 'Highest Quality - Maximum text clarity and sharpness'
  },
  balanced: {
    jpegQuality: 0.80,
    scale: 0.90,
    mode: 'balanced' as const,
    description: 'Balanced - Good quality with compression'
  },
  fast: {
    jpegQuality: 0.70,
    scale: 0.85,
    mode: 'fast' as const,
    description: 'Fast - Quick compression with acceptable quality'
  },
  extreme: {
    jpegQuality: 0.50,
    scale: 0.70,
    mode: 'fast' as const,
    description: 'Extreme - Maximum compression'
  }
};

// Clear cache before starting new compression
function clearRenderCache() {
  scaleCache.clear();
}

// HD Quality compression to achieve target size with optimal quality
export async function compressToTargetSize(
  pdfBytes: ArrayBuffer,
  targetSize: number,
  onProgress?: (progress: number, message: string) => void,
  mode: 'highest' | 'balanced' | 'fast' | 'hd' = 'balanced'
): Promise<{ blob: Blob; quality: number; scale: number; attempts: number; mode: string }> {
  const startTime = performance.now();
  
  // Create a copy to avoid ArrayBuffer detachment issues
  const pdfBytesCopy = pdfBytes.slice(0);
  // Clear previous render cache
  clearRenderCache();
  
  const originalSize = pdfBytes.byteLength;
  const compressionRatio = targetSize / originalSize;
  
  console.log(`Starting ${mode.toUpperCase()} compression: Original ${originalSize} bytes, Target ${targetSize} bytes, Ratio ${(compressionRatio * 100).toFixed(1)}%`);
  
  // Early exit: If target is >= original, just return the original (no point compressing)
  if (targetSize >= originalSize) {
    console.warn(`Target size (${targetSize} bytes) is >= original size (${originalSize} bytes). Returning original file.`);
    return {
      blob: new Blob([pdfBytes], { type: 'application/pdf' }),
      quality: 1.0,
      scale: 1.0,
      attempts: 0,
      mode
    };
  }
  
  // Smart initial estimates based on target/original ratio
  const initialQuality = Math.min(0.99, Math.max(0.3, 0.3 + compressionRatio * 0.6));
  const initialScale = Math.min(1.0, Math.max(0.7, 0.7 + compressionRatio * 0.25));
  
  // HD Quality ranges with mode-specific adjustments
  let minQuality: number;
  let maxQuality: number;
  let minScale: number;
  let maxScale: number;
  
  if (mode === 'highest' || mode === 'hd') {
    // Highest Quality Mode: PRIORITIZE RESOLUTION (scale) over JPEG quality
    // Strategy: Keep scale high (0.85-1.0), reduce quality instead
    if (compressionRatio >= 0.7) {
      minQuality = 0.94;
      maxQuality = 0.99;
      minScale = 0.97;
      maxScale = 1.0;
    } else if (compressionRatio >= 0.4) {
      minQuality = 0.90;
      maxQuality = 0.98;
      minScale = 0.94;
      maxScale = 1.0;
    } else if (compressionRatio >= 0.2) {
      // 20-40%: Reduce quality significantly, keep resolution VERY high
      minQuality = 0.30;
      maxQuality = 0.80;
      minScale = 0.91;
      maxScale = 1.0;
    } else if (compressionRatio >= 0.1) {
      // 10-20%: Very low quality, still maintain excellent resolution
      minQuality = 0.18;
      maxQuality = 0.60;
      minScale = 0.88;
      maxScale = 0.96;
    } else if (compressionRatio >= 0.05) {
      // 5-10%: Ultra-low quality first, keep scale VERY high for maximum sharpness
      minQuality = 0.08;
      maxQuality = 0.42;
      minScale = 0.88;  // Increased from 0.86 for better quality
      maxScale = 0.96;  // Increased from 0.94 for better quality
    } else if (compressionRatio >= 0.02) {
      // 2-5%: Minimum quality, moderate scale reduction
      minQuality = 0.08;
      maxQuality = 0.35;
      minScale = 0.70;
      maxScale = 0.85;
    } else if (compressionRatio >= 0.01) {
      // 1-2%: Extreme compression - scale becomes necessary
      minQuality = 0.05;
      maxQuality = 0.25;
      minScale = 0.50;
      maxScale = 0.70;
    } else {
      // < 1%: Ultra-extreme compression
      minQuality = 0.01;
      maxQuality = 0.20;
      minScale = 0.30;
      maxScale = 0.50;
    }
  } else if (mode === 'fast') {
    // Fast Mode: PRIORITIZE RESOLUTION, fewer attempts for speed
    if (compressionRatio >= 0.5) {
      minQuality = 0.70;
      maxQuality = 0.85;
      minScale = 0.88;
      maxScale = 0.95;
    } else if (compressionRatio >= 0.2) {
      minQuality = 0.45;
      maxQuality = 0.75;
      minScale = 0.85;
      maxScale = 0.95;
    } else if (compressionRatio >= 0.1) {
      minQuality = 0.25;
      maxQuality = 0.60;
      minScale = 0.82;
      maxScale = 0.92;
    } else if (compressionRatio >= 0.05) {
      minQuality = 0.15;
      maxQuality = 0.50;
      minScale = 0.78;
      maxScale = 0.88;
    } else if (compressionRatio >= 0.02) {
      minQuality = 0.10;
      maxQuality = 0.40;
      minScale = 0.65;
      maxScale = 0.80;
    } else if (compressionRatio >= 0.01) {
      minQuality = 0.05;
      maxQuality = 0.30;
      minScale = 0.45;
      maxScale = 0.65;
    } else {
      // Ultra-extreme compression (< 1%)
      minQuality = 0.01;
      maxQuality = 0.20;
      minScale = 0.25;
      maxScale = 0.45;
    }
  } else {
    // Balanced Mode: PRIORITIZE RESOLUTION with balanced quality/scale trade-offs
    if (compressionRatio >= 0.7) {
      minQuality = 0.85;
      maxQuality = 0.99;
      minScale = 0.95;
      maxScale = 1.0;
    } else if (compressionRatio >= 0.4) {
      minQuality = 0.75;
      maxQuality = 0.98;
      minScale = 0.90;
      maxScale = 1.0;
    } else if (compressionRatio >= 0.2) {
      // 20-40%: Reduce quality more, keep scale high
      minQuality = 0.45;
      maxQuality = 0.80;
      minScale = 0.86;
      maxScale = 0.98;
    } else if (compressionRatio >= 0.1) {
      // 10-20%: Low quality, good resolution
      minQuality = 0.30;
      maxQuality = 0.65;
      minScale = 0.83;
      maxScale = 0.93;
    } else if (compressionRatio >= 0.05) {
      // 5-10%: Very low quality, maintain resolution
      minQuality = 0.18;
      maxQuality = 0.50;
      minScale = 0.80;
      maxScale = 0.90;
    } else if (compressionRatio >= 0.02) {
      // 2-5%: Minimum quality, slight scale reduction
      minQuality = 0.10;
      maxQuality = 0.38;
      minScale = 0.68;
      maxScale = 0.82;
    } else if (compressionRatio >= 0.01) {
      // 1-2%: Extreme - need more scale reduction
      minQuality = 0.05;
      maxQuality = 0.28;
      minScale = 0.48;
      maxScale = 0.68;
    } else {
      // < 1%: Ultra-extreme compression
      minQuality = 0.01;
      maxQuality = 0.20;
      minScale = 0.28;
      maxScale = 0.48;
    }
  }
  
  let attempts = 0;
  let maxAttempts = 24; // Default - Increased from 20 to allow refinement steps (adjacent scales + fine-tuning)
  const tolerance = 0.05; // 5% tolerance - we'll aim for 95-100% accuracy in practice
  
  // Optimize quality ranges for large files (10MB+) 
  if (targetSize >= 20 * 1024 * 1024) {
    // 20MB: Ultra premium quality
    minQuality = 0.95;
    maxQuality = 0.99;
    minScale = 0.99;
    maxScale = 1.0;
    maxAttempts = 10; // Fewer attempts needed
    console.log('Optimizing for 20MB+ target: Ultra premium quality mode');
  } else if (targetSize >= 15 * 1024 * 1024) {
    // 15MB: Premium quality
    minQuality = 0.93;
    maxQuality = 0.99;
    minScale = 0.98;
    maxScale = 1.0;
    maxAttempts = 12;
    console.log('Optimizing for 15MB+ target: Premium quality mode');
  } else if (targetSize >= 10 * 1024 * 1024) {
    // 10MB: High quality
    minQuality = 0.90;
    maxQuality = 0.99;
    minScale = 0.97;
    maxScale = 1.0;
    maxAttempts = 15;
    console.log('Optimizing for 10MB+ target: High quality mode');
  }
  
  // Track last progress to ensure monotonic progress bar
  let lastReportedProgress = 0;
  
  let bestUnderTarget: { blob: Blob; quality: number; scale: number; size: number } | null = null;
  let bestOverTarget: { blob: Blob; quality: number; scale: number; size: number } | null = null;
  
  // CRITICAL FIX: Test at maximum quality first to see if we can even reach the target
  // This handles cases where the PDF compresses too much (e.g., 8MB → 1.7MB when target is 5MB)
  console.log('Testing at maximum quality and scale to establish baseline...');
  attempts++;
  const maxTestParams: CompressionParams = {
    jpegQuality: 0.99, // Maximum quality
    scale: 1.0,        // Maximum scale
    mode: mode,
    onProgress: (progress, message) => {
      if (onProgress && progress < 80) {
        onProgress(5, 'Testing maximum quality baseline...');
      }
    }
  };
  
  const maxTestResult = await compressPDFSimple(pdfBytesCopy, maxTestParams);
  const maxTestSize = maxTestResult.blob.size;
  console.log(`Maximum quality test: ${maxTestSize} bytes (quality 0.99, scale 1.0)`);
  
  // If even at max quality we're under target, we need to UPSCALE the PDF to reach target
  if (maxTestSize <= targetSize) {
    const fillRatio = maxTestSize / targetSize;
    console.log(`Natural compression (${maxTestSize} bytes) is already below target (${targetSize} bytes) at max quality.`);
    console.log(`Fill ratio: ${(fillRatio * 100).toFixed(1)}% - Will upscale to reach target.`);
    
    bestUnderTarget = {
      blob: maxTestResult.blob,
      quality: 0.99,
      scale: 1.0,
      size: maxTestSize
    };
    
    // If we're close enough (≥95% of target), return immediately without upscaling
    if (fillRatio >= 0.95) {
      console.log(`Already at ${(fillRatio * 100).toFixed(1)}% of target with max quality. No upscaling needed.`);
      return {
        blob: maxTestResult.blob,
        quality: 0.99,
        scale: 1.0,
        attempts: 1,
        mode
      };
    }
    
    // AUTONOMOUS UPSCALING: Add padding to reach target size
    console.log(`Upscaling PDF from ${maxTestSize} bytes to reach ${targetSize} bytes target...`);
    
    if (onProgress) {
      onProgress(85, 'Upscaling PDF to target size...');
    }
    
    try {
      const pdfBytesArray = await maxTestResult.blob.arrayBuffer();
      const upscaledBytes = await upscalePDFToTarget(
        new Uint8Array(pdfBytesArray),
        maxTestSize,
        targetSize
      );
      
      const upscaledSize = upscaledBytes.length;
      console.log(`Upscaling complete: ${maxTestSize} → ${upscaledSize} bytes (${(upscaledSize/targetSize*100).toFixed(1)}% of target)`);
      
      if (onProgress) {
        onProgress(100, 'Upscaling complete!');
      }
      
      return {
        blob: new Blob([upscaledBytes], { type: 'application/pdf' }),
        quality: 0.99,
        scale: 1.0,
        attempts: 1,
        mode
      };
    } catch (error) {
      console.error('Upscaling failed, returning max quality result:', error);
      return {
        blob: maxTestResult.blob,
        quality: 0.99,
        scale: 1.0,
        attempts: 1,
        mode
      };
    }
  }
  
  // If max quality result is over target, proceed with normal binary search
  console.log(`Maximum quality result (${maxTestSize} bytes) exceeds target (${targetSize} bytes). Proceeding with compression optimization...`);
  bestOverTarget = {
    blob: maxTestResult.blob,
    quality: 0.99,
    scale: 1.0,
    size: maxTestSize
  };
  
  // Test different scale values to find optimal combination
  // SPEED OPTIMIZATION: Test only 2-3 scales for faster results
  const scaleRange = maxScale - minScale;
  const scalesToTest = [
    maxScale,
    maxScale - scaleRange * 0.5,
    minScale
  ].filter((scale, index, arr) => arr.indexOf(scale) === index); // Remove duplicates
  let bestScale = maxScale;
  
  for (const testScale of scalesToTest) {
    if (attempts >= maxAttempts) break;
    
    // Binary search for optimal quality at this scale
    let searchMinQ = minQuality;
    let searchMaxQ = maxQuality;
    let lastSize = 0;
    let stableCount = 0;
    
    while (attempts < maxAttempts && searchMaxQ - searchMinQ > 0.02) { // SPEED: Reduced precision from 0.005 to 0.02
      attempts++;
      const testQuality = (searchMinQ + searchMaxQ) / 2;
      
      if (onProgress) {
        const calculatedProgress = Math.round((attempts / maxAttempts) * 80);
        // Ensure progress only increases (monotonic)
        const progress = Math.max(calculatedProgress, lastReportedProgress);
        lastReportedProgress = progress;
        onProgress(progress, `Optimizing compression... Attempt ${attempts}/${maxAttempts}`);
      }
      
      const params: CompressionParams = {
        jpegQuality: testQuality,
        scale: testScale,
        mode: mode,
        onProgress: (progress, message) => {
          if (onProgress && progress < 80) {
            const calculatedProgress = Math.round((attempts - 1) / maxAttempts * 80);
            const monotonic = Math.max(calculatedProgress, lastReportedProgress);
            lastReportedProgress = monotonic;
            onProgress(monotonic, message);
          }
        }
      };
      
      const result = await compressPDFSimple(pdfBytesCopy, params);
      const currentSize = result.blob.size;
      
      console.log(`Attempt ${attempts}: Scale ${testScale.toFixed(2)}, Quality ${testQuality.toFixed(3)}, Size ${currentSize} (target ${targetSize})`);
      
      // Check if size hasn't changed (reached limit)
      if (currentSize === lastSize) {
        stableCount++;
        if (stableCount >= 2) {
          console.log('Size stabilized, trying different parameters');
          break;
        }
      } else {
        stableCount = 0;
      }
      lastSize = currentSize;
      
      // Update best results
      if (currentSize <= targetSize) {
        if (!bestUnderTarget || currentSize > bestUnderTarget.size) {
          bestUnderTarget = { 
            blob: result.blob, 
            quality: testQuality, 
            scale: testScale, 
            size: currentSize 
          };
          bestScale = testScale;
        }
        searchMinQ = testQuality; // Can increase quality
      } else {
        if (!bestOverTarget || currentSize < bestOverTarget.size) {
          bestOverTarget = { 
            blob: result.blob, 
            quality: testQuality, 
            scale: testScale, 
            size: currentSize 
          };
        }
        searchMaxQ = testQuality; // Must decrease quality
      }
      
      // ACCURACY OPTIMIZATION: Early exit if we're within 5% of target (95-100%)
      const difference = Math.abs(currentSize - targetSize);
      if (currentSize <= targetSize && currentSize >= targetSize * 0.95) {
        console.log(`Early exit: Target achieved within 5% tolerance! Target: ${targetSize}, Achieved: ${currentSize}, Difference: ${difference} bytes (${(difference/targetSize*100).toFixed(1)}%)`);
        
        // CRITICAL SAFEGUARD: Never return a file larger than the original
        if (currentSize >= originalSize) {
          console.warn(`Result (${currentSize} bytes) is >= original (${originalSize} bytes). Returning original instead.`);
          return { 
            blob: new Blob([pdfBytes], { type: 'application/pdf' }), 
            quality: 1.0, 
            scale: 1.0, 
            attempts,
            mode 
          };
        }
        
        return { 
          blob: result.blob, 
          quality: testQuality, 
          scale: testScale, 
          attempts,
          mode 
        };
      }
    }
  }
  
  // ACCURACY OPTIMIZATION: Test adjacent scales if we're below 95% of target
  if (bestUnderTarget && bestUnderTarget.size < targetSize * 0.95 && attempts <= maxAttempts - 4) {
    console.log(`Testing adjacent scales for better targeting (aiming for 95-100% of target). Current: ${bestUnderTarget.size} bytes (${(bestUnderTarget.size/targetSize*100).toFixed(1)}%)`);
    
    // PRIORITY: Test higher scale first for better quality (sharper images)
    const adjacentScales = [
      bestScale + 0.02,  // Try slightly sharper first
      bestScale + 0.04,  // Even sharper
      bestScale - 0.02,
      bestScale - 0.04
    ].filter(s => s >= minScale && s <= Math.min(maxScale, 0.98) && !scalesToTest.includes(s));
    
    for (const adjacentScale of adjacentScales) {
      if (attempts >= maxAttempts - 4) {
        console.log(`Skipping remaining adjacent scales (budget: ${attempts}/${maxAttempts})`);
        break;
      }
      
      attempts++;
      const testQuality: number = bestUnderTarget.quality;
      
      const params: CompressionParams = {
        jpegQuality: testQuality,
        scale: adjacentScale,
        mode: mode,
        onProgress: (progress, message) => {
          if (onProgress) {
            const calculatedProgress = Math.round((attempts / maxAttempts) * 80);
            const monotonic = Math.max(calculatedProgress, lastReportedProgress);
            lastReportedProgress = monotonic;
            onProgress(monotonic, message);
          }
        }
      };
      
      const result = await compressPDFSimple(pdfBytesCopy, params);
      const currentSize = result.blob.size;
      
      console.log(`Adjacent scale test: Scale ${adjacentScale.toFixed(2)}, Size ${currentSize}`);
      
      if (currentSize <= targetSize && currentSize > bestUnderTarget.size) {
        bestUnderTarget = {
          blob: result.blob,
          quality: testQuality,
          scale: adjacentScale,
          size: currentSize
        };
        bestScale = adjacentScale;
        
        // Check if we're close enough (within 3% tolerance - 97%+)
        if (currentSize >= targetSize * 0.97) {
          console.log(`Optimal result achieved with adjacent scale: ${currentSize} bytes (${(currentSize/targetSize*100).toFixed(1)}%)`);
          
          // CRITICAL SAFEGUARD: Never return a file larger than the original
          if (currentSize >= originalSize) {
            console.warn(`Result (${currentSize} bytes) is >= original (${originalSize} bytes). Returning original instead.`);
            return { 
              blob: new Blob([pdfBytes], { type: 'application/pdf' }), 
              quality: 1.0, 
              scale: 1.0, 
              attempts,
              mode 
            };
          }
          
          return { 
            blob: result.blob, 
            quality: testQuality, 
            scale: adjacentScale, 
            attempts,
            mode 
          };
        }
      }
    }
  } else if (bestUnderTarget) {
    console.log(`Skipping adjacent scale testing (attempts budget: ${attempts}/${maxAttempts}, or already at ≥95%)`);
  }
  
  // If we have a result under target that's close enough, use it
  if (bestUnderTarget) {
    const fillRatio = bestUnderTarget.size / targetSize;
    console.log(`Best under target: ${bestUnderTarget.size} bytes (${(fillRatio * 100).toFixed(1)}% of target)`);
    
    // ACCURACY OPTIMIZATION: Fine-tune if we're below 95% of target
    if (fillRatio < 0.95 && attempts <= maxAttempts - 3) {
      console.log(`Fine-tuning quality to get closer to target (currently at ${(fillRatio*100).toFixed(1)}%, aiming for 95-100%)...`);
      
      let fineQuality = bestUnderTarget.quality;
      const maxFineQuality = Math.min(bestUnderTarget.quality + 0.30, 0.99);  // Allow up to 0.99 quality
      
      // Binary search for optimal quality at best scale
      let minQ = fineQuality;
      let maxQ = maxFineQuality;
      
      while (maxQ - minQ > 0.005 && attempts <= maxAttempts - 1) { // ACCURACY: Increased precision to 0.005 for fine-tuning
        attempts++;
        fineQuality = (minQ + maxQ) / 2;
        
        const params: CompressionParams = {
          jpegQuality: fineQuality,
          scale: bestUnderTarget.scale,
          mode: mode,
          onProgress: (progress, message) => {
            if (onProgress) {
              const calculatedProgress = Math.round(80 + (attempts / maxAttempts) * 20);
              const monotonic = Math.max(calculatedProgress, lastReportedProgress);
              lastReportedProgress = monotonic;
              onProgress(monotonic, message);
            }
          }
        };
        
        const result = await compressPDFSimple(pdfBytesCopy, params);
        const currentSize = result.blob.size;
        
        console.log(`Fine-tune ${attempts}: Quality ${fineQuality.toFixed(3)}, Size ${currentSize}`);
        
        if (currentSize <= targetSize) {
          if (currentSize > bestUnderTarget.size) {
            bestUnderTarget = {
              blob: result.blob,
              quality: fineQuality,
              scale: bestUnderTarget.scale,
              size: currentSize
            };
          }
          minQ = fineQuality; // Can increase quality
          
          // Check if we're close enough (within 3% tolerance - 97%+)
          if (currentSize >= targetSize * 0.97) {
            console.log(`Optimal result achieved after fine-tuning: ${currentSize} bytes (${(currentSize/targetSize*100).toFixed(1)}% of target)`);
            
            // CRITICAL SAFEGUARD: Never return a file larger than the original
            if (currentSize >= originalSize) {
              console.warn(`Result (${currentSize} bytes) is >= original (${originalSize} bytes). Returning original instead.`);
              return {
                blob: new Blob([pdfBytes], { type: 'application/pdf' }),
                quality: 1.0,
                scale: 1.0,
                attempts,
                mode
              };
            }
            
            return {
              blob: result.blob,
              quality: fineQuality,
              scale: bestUnderTarget.scale,
              attempts,
              mode
            };
          }
        } else {
          maxQ = fineQuality; // Must decrease quality
        }
      }
      
      console.log(`Fine-tuning complete. Final: ${bestUnderTarget!.size} bytes (${(bestUnderTarget!.size/targetSize*100).toFixed(1)}%)`);
    } else if (fillRatio < 0.95) {
      console.log(`Skipping fine-tuning (attempts budget: ${attempts}/${maxAttempts})`);
    }
      
      // SPEED OPTIMIZATION: Skip micro-adjustments entirely for faster results
      // (Micro-adjustments provide < 2% improvement but take 20-30% of total time)
      if (false && bestUnderTarget!.size < targetSize * 0.95 && attempts < maxAttempts - 1) {
        console.log(`Attempting micro-adjustments (currently at ${(bestUnderTarget!.size/targetSize*100).toFixed(1)}%, aiming for 95-100%)...`);
        
        const microStep = 0.005; // Larger steps for speed
        let microQuality = bestUnderTarget!.quality;
        
        for (let i = 0; i < 5 && attempts < maxAttempts; i++) { // Reduced from 10 to 5
          attempts++;
          microQuality = Math.min(microQuality + microStep, 0.99);  // Allow up to 0.99
          
          const params: CompressionParams = {
            jpegQuality: microQuality,
            scale: bestUnderTarget!.scale,
            mode: mode,
            onProgress: (progress, message) => {
              if (onProgress) {
                const calculatedProgress = Math.round(90 + (attempts / maxAttempts) * 10);
                const monotonic = Math.max(calculatedProgress, lastReportedProgress);
                lastReportedProgress = monotonic;
                onProgress(monotonic, message);
              }
            }
          };
          
          const result = await compressPDFSimple(pdfBytesCopy, params);
          const currentSize = result.blob.size;
          
          console.log(`Micro-adjust ${i + 1}: Quality ${microQuality.toFixed(4)}, Size ${currentSize}`);
          
          if (currentSize <= targetSize) {
            bestUnderTarget = {
              blob: result.blob,
              quality: microQuality,
              scale: bestUnderTarget!.scale,
              size: currentSize
            };
            
            if (currentSize >= targetSize * 0.995) {
              console.log(`Target achieved with micro-adjustment: ${currentSize} bytes`);
              
              // CRITICAL SAFEGUARD: Never return a file larger than the original
              if (currentSize >= originalSize) {
                console.warn(`Result (${currentSize} bytes) is >= original (${originalSize} bytes). Returning original instead.`);
                return {
                  blob: new Blob([pdfBytes], { type: 'application/pdf' }),
                  quality: 1.0,
                  scale: 1.0,
                  attempts,
                  mode
                };
              }
              
              return {
                blob: result.blob,
                quality: microQuality,
                scale: bestUnderTarget!.scale,
                attempts,
                mode
              };
            }
          } else {
            break; // Stop if we exceed target
          }
        }
      }
    
    // Always return the best result we have, even if not perfect
    console.log(`Final result: ${bestUnderTarget!.size} bytes (${(bestUnderTarget!.size/targetSize*100).toFixed(1)}% of target), Quality: ${bestUnderTarget!.quality.toFixed(3)}, Scale: ${bestUnderTarget!.scale.toFixed(2)}`);
    
    // CRITICAL SAFEGUARD: Never return a file larger than the original
    if (bestUnderTarget!.size >= originalSize) {
      console.warn(`Compressed result (${bestUnderTarget.size} bytes) is larger than original (${originalSize} bytes). Returning original file instead.`);
      return { 
        blob: new Blob([pdfBytes], { type: 'application/pdf' }), 
        quality: 1.0, 
        scale: 1.0, 
        attempts,
        mode 
      };
    }
    
    // AUTONOMOUS UPSCALING: If we're below 95% of target, upscale to reach it
    if (bestUnderTarget!.size < targetSize * 0.95) {
      console.log(`Below 95% of target. Upscaling from ${bestUnderTarget!.size} bytes to reach ${targetSize} bytes...`);
      
      if (onProgress) {
        onProgress(85, 'Upscaling PDF to target size...');
      }
      
      try {
        const pdfBytesArray = await bestUnderTarget!.blob.arrayBuffer();
        const upscaledBytes = await upscalePDFToTarget(
          new Uint8Array(pdfBytesArray),
          bestUnderTarget!.size,
          targetSize
        );
        
        const upscaledSize = upscaledBytes.length;
        console.log(`Upscaling complete: ${bestUnderTarget!.size} → ${upscaledSize} bytes (${(upscaledSize/targetSize*100).toFixed(1)}% of target)`);
        
        if (onProgress) {
          onProgress(100, 'Upscaling complete!');
        }
        
        return {
          blob: new Blob([upscaledBytes], { type: 'application/pdf' }),
          quality: bestUnderTarget!.quality,
          scale: bestUnderTarget!.scale,
          attempts,
          mode
        };
      } catch (error) {
        console.error('Upscaling failed, returning best compressed result:', error);
        return {
          blob: bestUnderTarget!.blob,
          quality: bestUnderTarget!.quality,
          scale: bestUnderTarget!.scale,
          attempts,
          mode
        };
      }
    }
    
    // Already close enough (≥95%), no upscaling needed
    const endTime = performance.now();
    console.log(`Compression completed in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
    return { 
      blob: bestUnderTarget!.blob, 
      quality: bestUnderTarget!.quality, 
      scale: bestUnderTarget!.scale, 
      attempts,
      mode 
    };
  }
  
  // If no under-target result, return the best over-target result
  if (bestOverTarget) {
    // CRITICAL SAFEGUARD: Never return a file larger than the original
    if (bestOverTarget.size >= originalSize) {
      console.warn(`Smallest possible result (${bestOverTarget.size} bytes) is larger than original (${originalSize} bytes). Returning original file instead.`);
      return { 
        blob: new Blob([pdfBytes], { type: 'application/pdf' }), 
        quality: 1.0, 
        scale: 1.0, 
        attempts,
        mode 
      };
    }
    
    console.warn(`Target size too ambitious. Returning smallest possible: ${bestOverTarget.size} bytes (${(bestOverTarget.size/targetSize*100).toFixed(1)}% of target)`);
    const endTime = performance.now();
    console.log(`Compression completed in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
    return { 
      blob: bestOverTarget.blob, 
      quality: bestOverTarget.quality, 
      scale: bestOverTarget.scale, 
      attempts,
      mode 
    };
  }
  
  // Fallback: use middle-range settings
  console.log('No optimal result found, using fallback compression');
  const fallbackParams: CompressionParams = {
    jpegQuality: (minQuality + maxQuality) / 2,
    scale: (minScale + maxScale) / 2,
    mode: mode,
    onProgress
  };
  
  const fallbackResult = await compressPDFSimple(pdfBytes, fallbackParams);
  
  // CRITICAL SAFEGUARD: Never return a file larger than the original
  if (fallbackResult.blob.size >= originalSize) {
    console.warn(`Fallback result (${fallbackResult.blob.size} bytes) is larger than original (${originalSize} bytes). Returning original file instead.`);
    return { 
      blob: new Blob([pdfBytes], { type: 'application/pdf' }), 
      quality: 1.0, 
      scale: 1.0, 
      attempts: attempts + 1,
      mode 
    };
  }
  
  const endTime = performance.now();
  console.log(`Compression completed in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
  return { 
    blob: fallbackResult.blob, 
    quality: fallbackParams.jpegQuality, 
    scale: fallbackParams.scale, 
    attempts: attempts + 1,
    mode 
  };
}