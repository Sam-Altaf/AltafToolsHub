import { useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Upload, FileText, Image, FileSpreadsheet, FileVideo, FileAudio, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FileDropZoneProps {
  className?: string;
}

const fileTypeToTool: Record<string, { path: string; name: string; icon: any }> = {
  // PDF
  'application/pdf': { path: '/compress-pdf', name: 'PDF Tools', icon: FileText },
  // Images
  'image/jpeg': { path: '/jpg-to-pdf', name: 'JPG to PDF', icon: Image },
  'image/jpg': { path: '/jpg-to-pdf', name: 'JPG to PDF', icon: Image },
  'image/png': { path: '/jpg-to-pdf', name: 'Image to PDF', icon: Image },
  'image/gif': { path: '/jpg-to-pdf', name: 'Image to PDF', icon: Image },
  'image/webp': { path: '/jpg-to-pdf', name: 'Image to PDF', icon: Image },
  'image/svg+xml': { path: '/jpg-to-pdf', name: 'Image to PDF', icon: Image },
  // Text Documents
  'text/plain': { path: '/extract-text', name: 'Extract Text', icon: FileText },
  'application/msword': { path: '/extract-text', name: 'Document Tools', icon: FileText },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { path: '/extract-text', name: 'Document Tools', icon: FileText },
  // Spreadsheets - redirect to file calculator
  'application/vnd.ms-excel': { path: '/file-calculator', name: 'File Calculator', icon: FileSpreadsheet },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { path: '/file-calculator', name: 'File Calculator', icon: FileSpreadsheet },
  // Default file tools
  'application/zip': { path: '/file-calculator', name: 'File Calculator', icon: File },
  'application/x-rar-compressed': { path: '/file-calculator', name: 'File Calculator', icon: File },
  'application/x-7z-compressed': { path: '/file-calculator', name: 'File Calculator', icon: File },
};

export function FileDropZone({ className }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [detectedFile, setDetectedFile] = useState<{ name: string; type: string; tool: any } | null>(null);
  const [, setLocation] = useLocation();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if we're leaving the drop zone completely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const tool = fileTypeToTool[file.type] || { 
        path: '/', 
        name: 'Unknown File Type', 
        icon: File 
      };
      
      setDetectedFile({
        name: file.name,
        type: file.type,
        tool
      });

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        setLocation(tool.path);
        setDetectedFile(null);
      }, 2000);
    }
  }, [setLocation]);

  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        isDragging && "scale-105",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-testid="file-drop-zone"
    >
      {/* Drop Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center"
          >
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-primary animate-bounce" />
              <p className="text-lg font-semibold">Drop your file here</p>
              <p className="text-sm text-muted-foreground">We'll automatically detect the right tool</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Detection Popup */}
      <AnimatePresence>
        {detectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50 bg-background border rounded-lg shadow-lg p-4 min-w-[300px]"
          >
            <div className="flex items-start gap-3">
              <detectedFile.tool.icon className="w-8 h-8 text-primary flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-sm">File Detected!</p>
                <p className="text-xs text-muted-foreground mt-1">{detectedFile.name}</p>
                <p className="text-xs text-primary mt-2">
                  Redirecting to {detectedFile.tool.name}...
                </p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-1 mt-3 overflow-hidden">
              <motion.div
                className="bg-primary h-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Text */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
        <p className="text-xs text-muted-foreground/60 flex items-center gap-2">
          <Upload className="w-3 h-3" />
          Drag & drop any file to get started
        </p>
      </div>
    </div>
  );
}