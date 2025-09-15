import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use local worker for privacy and offline capability
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// Cache for rendered pages at different scales to avoid re-rendering
const scaleCache = new Map<string, RenderedPage[]>();

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

// Convert canvas to JPEG with specific quality using blob for better performance
function canvasToJPEG(canvas: HTMLCanvasElement, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          // Fallback to toDataURL if blob fails
          resolve(canvas.toDataURL('image/jpeg', quality));
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      },
      'image/jpeg',
      quality
    );
  });
}

// Get or render PDF pages at specified scale (with caching)
async function getOrRenderPages(
  pdfBytes: ArrayBuffer,
  scale: number,
  onProgress?: (progress: number, message: string) => void
): Promise<RenderedPage[]> {
  // Use scale as cache key with 3 decimal precision
  const cacheKey = scale.toFixed(3);
  
  // Check cache first
  if (scaleCache.has(cacheKey)) {
    if (onProgress) {
      onProgress(20, `Using cached render at scale ${scale.toFixed(2)}`);
    }
    return scaleCache.get(cacheKey)!;
  }
  
  // Render pages if not cached
  const renderedPages = await renderPDFPages(pdfBytes, scale, onProgress);
  
  // Store in cache
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

    // Configure high-quality rendering
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

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

// Convert rendered pages to JPEG images with specified quality
async function convertPagesToImages(
  pages: RenderedPage[],
  quality: number,
  onProgress?: (progress: number, message: string) => void
): Promise<PageImage[]> {
  const pageImages: PageImage[] = [];
  
  for (let i = 0; i < pages.length; i++) {
    if (onProgress) {
      const progress = 20 + Math.round((i / pages.length) * 30);
      onProgress(progress, `Compressing page ${i + 1} of ${pages.length}`);
    }
    
    const dataUrl = await canvasToJPEG(pages[i].canvas, quality);
    
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

// Simple compression with specific parameters
export async function compressPDFSimple(
  pdfBytes: ArrayBuffer,
  params: CompressionParams
): Promise<{ blob: Blob }> {
  console.log('Starting PDF compression with params:', params);
  
  try {
    // Get or render pages at specified scale (uses cache if available)
    const renderedPages = await getOrRenderPages(
      pdfBytes,
      params.scale,
      params.onProgress
    );
    
    // Convert to images with specified quality
    const images = await convertPagesToImages(
      renderedPages,
      params.jpegQuality,
      params.onProgress
    );
    
    // Create new PDF from images
    const compressedBytes = await createPDFFromImages(images, params.onProgress);
    
    console.log('Compression complete. Original size:', pdfBytes.byteLength, 'Compressed size:', compressedBytes.length);
    
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

// Advanced compression using optimal parameters
export async function compressPDFAdvanced(
  pdfBytes: ArrayBuffer,
  params: CompressionParams
): Promise<Blob> {
  const result = await compressPDFSimple(pdfBytes, params);
  return result.blob;
}

// Clear cache before starting new compression
function clearRenderCache() {
  scaleCache.clear();
}

// Compress PDF to achieve target size with optimal quality
export async function compressToTargetSize(
  pdfBytes: ArrayBuffer,
  targetSize: number,
  onProgress?: (progress: number, message: string) => void
): Promise<{ blob: Blob; quality: number; scale: number; attempts: number }> {
  // Create a copy to avoid ArrayBuffer detachment issues
  const pdfBytesCopy = pdfBytes.slice(0);
  // Clear previous render cache
  clearRenderCache();
  
  const originalSize = pdfBytes.byteLength;
  const compressionRatio = targetSize / originalSize;
  
  console.log(`Starting compression: Original ${originalSize} bytes, Target ${targetSize} bytes, Ratio ${(compressionRatio * 100).toFixed(1)}%`);
  
  // Professional-grade quality ranges based on compression ratio
  let minQuality: number;
  let maxQuality: number;
  let minScale: number;
  let maxScale: number;
  
  if (compressionRatio >= 0.7) {
    // Light compression (target is ≥70% of original)
    minQuality = 0.85;
    maxQuality = 0.99;  // Increased from 0.95 to allow reaching targets
    minScale = 0.95;
    maxScale = 1.0;
  } else if (compressionRatio >= 0.4) {
    // Moderate compression (target is 40-70% of original)
    minQuality = 0.75;
    maxQuality = 0.98;  // CRITICAL: Increased from 0.90 to reach 5MB from 10MB files
    minScale = 0.90;
    maxScale = 1.0;
  } else if (compressionRatio >= 0.2) {
    // Significant compression (target is 20-40% of original)
    minQuality = 0.65;
    maxQuality = 0.95;  // Increased from 0.85 for better targeting
    minScale = 0.85;
    maxScale = 1.0;
  } else if (compressionRatio >= 0.1) {
    // Heavy compression (target is 10-20% of original)
    minQuality = 0.55;
    maxQuality = 0.90;  // Increased from 0.75 for better range
    minScale = 0.75;
    maxScale = 0.95;
  } else {
    // Extreme compression (target is <10% of original)
    minQuality = 0.40;
    maxQuality = 0.80;  // Increased from 0.65
    minScale = 0.60;
    maxScale = 0.90;
  }
  
  let attempts = 0;
  const maxAttempts = 25; // Reduced since we're using cached renders
  const tolerance = 0.02; // 2% tolerance
  
  let bestUnderTarget: { blob: Blob; quality: number; scale: number; size: number } | null = null;
  let bestOverTarget: { blob: Blob; quality: number; scale: number; size: number } | null = null;
  
  // Test different scale values to find optimal combination
  const scalesToTest = [maxScale, (minScale + maxScale) / 2, minScale];
  let bestScale = maxScale;
  
  for (const testScale of scalesToTest) {
    if (attempts >= maxAttempts) break;
    
    // Binary search for optimal quality at this scale
    let searchMinQ = minQuality;
    let searchMaxQ = maxQuality;
    let lastSize = 0;
    let stableCount = 0;
    
    while (attempts < maxAttempts && searchMaxQ - searchMinQ > 0.005) {
      attempts++;
      const testQuality = (searchMinQ + searchMaxQ) / 2;
      
      if (onProgress) {
        const progress = Math.round((attempts / maxAttempts) * 80);
        onProgress(progress, `Optimizing compression... Attempt ${attempts}/${maxAttempts}`);
      }
      
      const params: CompressionParams = {
        jpegQuality: testQuality,
        scale: testScale,
        onProgress: (progress, message) => {
          if (onProgress && progress < 80) {
            const attemptProgress = Math.round((attempts - 1) / maxAttempts * 80);
            onProgress(attemptProgress, message);
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
      
      // Check if we've hit the target within tolerance
      const difference = Math.abs(currentSize - targetSize);
      if (difference <= targetSize * tolerance) {
        console.log(`Target achieved! Target: ${targetSize}, Achieved: ${currentSize}, Difference: ${difference} bytes (${(difference/targetSize*100).toFixed(1)}%)`);
        return { 
          blob: result.blob, 
          quality: testQuality, 
          scale: testScale, 
          attempts 
        };
      }
    }
  }
  
  // Test adjacent scales for better targeting
  if (bestUnderTarget && bestUnderTarget.size < targetSize * 0.90 && attempts < maxAttempts - 5) {
    console.log('Testing adjacent scales for better targeting...');
    
    const adjacentScales = [
      bestScale + 0.02,
      bestScale + 0.05,
      bestScale - 0.02,
      bestScale - 0.05
    ].filter(s => s >= minScale && s <= maxScale && !scalesToTest.includes(s));
    
    for (const adjacentScale of adjacentScales) {
      if (attempts >= maxAttempts - 3) break;
      
      attempts++;
      const testQuality: number = bestUnderTarget.quality;
      
      const params: CompressionParams = {
        jpegQuality: testQuality,
        scale: adjacentScale,
        onProgress: (progress, message) => {
          if (onProgress) {
            const attemptProgress = Math.round((attempts / maxAttempts) * 80);
            onProgress(attemptProgress, message);
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
        
        // Check if we're close enough
        if (currentSize >= targetSize * 0.98) {
          console.log(`Optimal result achieved with adjacent scale: ${currentSize} bytes`);
          return { 
            blob: result.blob, 
            quality: testQuality, 
            scale: adjacentScale, 
            attempts 
          };
        }
      }
    }
  }
  
  // If we have a result under target that's close enough, use it
  if (bestUnderTarget) {
    const fillRatio = bestUnderTarget.size / targetSize;
    console.log(`Best under target: ${bestUnderTarget.size} bytes (${(fillRatio * 100).toFixed(1)}% of target)`);
    
    // Try to get closer to target by fine-tuning quality upward
    if (fillRatio < 0.98 && attempts < maxAttempts) {
      console.log('Fine-tuning quality to get closer to target...');
      
      let fineQuality = bestUnderTarget.quality;
      const maxFineQuality = Math.min(bestUnderTarget.quality + 0.25, 0.99);  // Allow up to 0.99 quality
      
      // Binary search for optimal quality at best scale
      let minQ = fineQuality;
      let maxQ = maxFineQuality;
      
      while (maxQ - minQ > 0.005 && attempts < maxAttempts) {
        attempts++;
        fineQuality = (minQ + maxQ) / 2;
        
        const params: CompressionParams = {
          jpegQuality: fineQuality,
          scale: bestUnderTarget.scale,
          onProgress: (progress, message) => {
            if (onProgress) {
              const attemptProgress = Math.round(80 + (attempts / maxAttempts) * 20);
              onProgress(attemptProgress, message);
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
          
          // Check if we're close enough
          if (currentSize >= targetSize * 0.98) {
            console.log(`Optimal result achieved: ${currentSize} bytes (${(currentSize/targetSize*100).toFixed(1)}% of target)`);
            return {
              blob: result.blob,
              quality: fineQuality,
              scale: bestUnderTarget.scale,
              attempts
            };
          }
        } else {
          maxQ = fineQuality; // Must decrease quality
        }
      }
      
      // Final micro-adjustments with very small steps
      if (bestUnderTarget.size < targetSize * 0.98 && attempts < maxAttempts) {
        console.log('Attempting micro-adjustments...');
        
        const microStep = 0.002;
        let microQuality = bestUnderTarget.quality;
        
        for (let i = 0; i < 10 && attempts < maxAttempts; i++) {
          attempts++;
          microQuality = Math.min(microQuality + microStep, 0.99);  // Allow up to 0.99
          
          const params: CompressionParams = {
            jpegQuality: microQuality,
            scale: bestUnderTarget.scale,
            onProgress: (progress, message) => {
              if (onProgress) {
                const attemptProgress = Math.round(90 + (attempts / maxAttempts) * 10);
                onProgress(attemptProgress, message);
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
              scale: bestUnderTarget.scale,
              size: currentSize
            };
            
            if (currentSize >= targetSize * 0.98) {
              console.log(`Target achieved with micro-adjustment: ${currentSize} bytes`);
              return {
                blob: result.blob,
                quality: microQuality,
                scale: bestUnderTarget.scale,
                attempts
              };
            }
          } else {
            break; // Stop if we exceed target
          }
        }
      }
    }
    
    // If best result is still way below target, try higher qualities
    if (bestUnderTarget.size < targetSize * 0.5 && attempts < maxAttempts + 10) {
      console.log('Result too small, trying higher qualities to get closer to target...');
      
      // Try qualities up to 0.99
      for (let q = Math.max(bestUnderTarget.quality, 0.9); q <= 0.99; q += 0.01) {
        attempts++;
        const params: CompressionParams = {
          jpegQuality: q,
          scale: bestUnderTarget.scale,
          onProgress: (progress, message) => {
            if (onProgress) {
              onProgress(95, `Fine-tuning to reach target...`);
            }
          }
        };
        
        const result = await compressPDFSimple(pdfBytesCopy, params);
        const currentSize = result.blob.size;
        
        console.log(`High quality attempt: Quality ${q.toFixed(2)}, Size ${currentSize}`);
        
        if (currentSize <= targetSize) {
          bestUnderTarget = {
            blob: result.blob,
            quality: q,
            scale: bestUnderTarget.scale,
            size: currentSize
          };
          
          // If we're getting close, stop
          if (currentSize >= targetSize * 0.95) {
            console.log(`Reached close to target with high quality: ${currentSize} bytes`);
            break;
          }
        } else {
          break; // Exceeded target
        }
      }
    }
    
    // Always return the best result we have, even if not perfect
    console.log(`Final result: ${bestUnderTarget.size} bytes (${(bestUnderTarget.size/targetSize*100).toFixed(1)}% of target), Quality: ${bestUnderTarget.quality.toFixed(3)}, Scale: ${bestUnderTarget.scale.toFixed(2)}`);
    
    // Log a warning if we couldn't get close, but still return the result
    if (bestUnderTarget.size < targetSize * 0.98) {
      console.warn(`Note: Could not achieve exact target. Best achieved: ${bestUnderTarget.size} bytes (${(bestUnderTarget.size/targetSize*100).toFixed(1)}% of target)`);
    }
    
    return { 
      blob: bestUnderTarget.blob, 
      quality: bestUnderTarget.quality, 
      scale: bestUnderTarget.scale, 
      attempts 
    };
  }
  
  // If no under-target result, return the best over-target result
  if (bestOverTarget) {
    console.warn(`Target size too ambitious. Returning smallest possible: ${bestOverTarget.size} bytes (${(bestOverTarget.size/targetSize*100).toFixed(1)}% of target)`);
    return { 
      blob: bestOverTarget.blob, 
      quality: bestOverTarget.quality, 
      scale: bestOverTarget.scale, 
      attempts 
    };
  }
  
  // Fallback: use middle-range settings
  console.log('No optimal result found, using fallback compression');
  const fallbackParams: CompressionParams = {
    jpegQuality: (minQuality + maxQuality) / 2,
    scale: (minScale + maxScale) / 2,
    onProgress
  };
  
  const fallbackResult = await compressPDFSimple(pdfBytes, fallbackParams);
  return { 
    blob: fallbackResult.blob, 
    quality: fallbackParams.jpegQuality, 
    scale: fallbackParams.scale, 
    attempts: attempts + 1 
  };
}