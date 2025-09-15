// Simple EXIF orientation reader for image files
export interface ExifData {
  orientation?: number;
}

export const getExifOrientation = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const view = new DataView(e.target?.result as ArrayBuffer);
      
      if (view.getUint16(0, false) !== 0xFFD8) {
        // Not a JPEG file
        resolve(1);
        return;
      }
      
      const length = view.byteLength;
      let offset = 2;
      
      while (offset < length) {
        if (view.getUint16(offset + 2, false) <= 8) {
          resolve(1);
          return;
        }
        
        const marker = view.getUint16(offset, false);
        offset += 2;
        
        if (marker === 0xFFE1) {
          // EXIF marker
          const exifLength = view.getUint16(offset, false);
          offset += 2;
          
          const exifStart = offset;
          
          // Check for "Exif" header
          if (view.getUint32(offset, false) !== 0x45786966) {
            resolve(1);
            return;
          }
          
          offset += 6;
          
          const tiffStart = offset;
          const byteOrder = view.getUint16(offset, false);
          const littleEndian = byteOrder === 0x4949;
          
          offset += 2;
          
          if (view.getUint16(offset, littleEndian) !== 0x002A) {
            resolve(1);
            return;
          }
          
          offset += 2;
          const ifdOffset = view.getUint32(offset, littleEndian);
          offset = tiffStart + ifdOffset;
          
          if (offset >= view.byteLength) {
            resolve(1);
            return;
          }
          
          const entries = view.getUint16(offset, littleEndian);
          offset += 2;
          
          for (let i = 0; i < entries; i++) {
            const tag = view.getUint16(offset, littleEndian);
            
            if (tag === 0x0112) {
              // Orientation tag
              const orientation = view.getUint16(offset + 8, littleEndian);
              resolve(orientation);
              return;
            }
            
            offset += 12;
          }
          
          resolve(1);
          return;
        } else {
          // Skip other markers
          const markerLength = view.getUint16(offset, false);
          offset += markerLength;
        }
      }
      
      resolve(1);
    };
    
    reader.onerror = () => resolve(1);
    reader.readAsArrayBuffer(file.slice(0, 65536)); // Read first 64KB for EXIF
  });
};

// Apply orientation transformation to canvas context
export const applyExifOrientation = (ctx: CanvasRenderingContext2D, orientation: number, width: number, height: number) => {
  switch (orientation) {
    case 2:
      // Flip horizontal
      ctx.transform(-1, 0, 0, 1, width, 0);
      break;
    case 3:
      // Rotate 180°
      ctx.transform(-1, 0, 0, -1, width, height);
      break;
    case 4:
      // Flip vertical
      ctx.transform(1, 0, 0, -1, 0, height);
      break;
    case 5:
      // Rotate 90° CW + flip horizontal
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      // Rotate 90° CW
      ctx.transform(0, 1, -1, 0, height, 0);
      break;
    case 7:
      // Rotate 90° CCW + flip horizontal
      ctx.transform(0, -1, -1, 0, height, width);
      break;
    case 8:
      // Rotate 90° CCW
      ctx.transform(0, -1, 1, 0, 0, width);
      break;
    default:
      // Normal orientation (1) or unknown
      break;
  }
};

// Get canvas dimensions after orientation transform
export const getOrientedDimensions = (width: number, height: number, orientation: number) => {
  if (orientation >= 5 && orientation <= 8) {
    // 90° rotations swap width and height
    return { width: height, height: width };
  }
  return { width, height };
};