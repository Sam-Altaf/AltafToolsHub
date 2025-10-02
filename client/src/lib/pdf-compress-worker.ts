// WebWorker for parallel PDF page processing
self.onmessage = async function(e) {
  const { pageData, quality, scale, pageIndex } = e.data;
  
  try {
    // Create offscreen canvas for compression
    const canvas = new OffscreenCanvas(pageData.width * scale, pageData.height * scale);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    
    // Scale and draw
    ctx.scale(scale, scale);
    ctx.putImageData(pageData.imageData, 0, 0);
    
    // Convert to JPEG with quality
    const blob = await canvas.convertToBlob({
      type: 'image/jpeg',
      quality: quality
    });
    
    // Convert to data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      self.postMessage({
        success: true,
        pageIndex,
        dataUrl: reader.result,
        size: blob.size
      });
    };
    reader.readAsDataURL(blob);
  } catch (error: any) {
    self.postMessage({
      success: false,
      pageIndex,
      error: error.message
    });
  }
};

// Export for TypeScript module resolution
export {};