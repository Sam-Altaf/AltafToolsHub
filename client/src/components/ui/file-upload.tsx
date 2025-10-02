import { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  X, Upload, FileText, Image as ImageIcon, File, 
  CheckCircle2, AlertCircle, Loader2 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onFilesSelect?: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  title: string;
  description: string;
  className?: string;
  multiple?: boolean;
}

export default function FileUpload({
  onFileSelect,
  onFilesSelect,
  accept = "*",
  maxSize = 100 * 1024 * 1024, // 100MB default
  title,
  description,
  className = "",
  multiple = false
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return ImageIcon;
    if (file.type === 'application/pdf') return FileText;
    return File;
  };

  const validateFile = async (file: File): Promise<boolean> => {
    setError(null);
    
    if (maxSize && file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return false;
    }

    // Check if file type matches accept pattern
    if (accept && accept !== "*") {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileExtension = `.${file.name.split('.').pop()}`;
      const isAccepted = acceptedTypes.some(type => 
        type === file.type || 
        type.endsWith('/*') && file.type.startsWith(type.replace('/*', '')) ||
        type === fileExtension
      );
      
      if (!isAccepted) {
        setError(`File type not accepted. Please upload ${accept} files only.`);
        return false;
      }
    }
    
    return true;
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setIsValidating(true);
    const isValid = await validateFile(file);
    setIsValidating(false);
    
    if (!isValid) return;

    setSelectedFile(file);
    setError(null);
    onFileSelect?.(file);
  }, [onFileSelect, maxSize, accept]);

  const handleFilesSelect = useCallback(async (files: File[]) => {
    setIsValidating(true);
    const validFiles = [];
    
    for (const file of files) {
      const isValid = await validateFile(file);
      if (isValid) {
        validFiles.push(file);
      }
    }
    
    setIsValidating(false);
    
    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      setError(null);
      onFilesSelect?.(validFiles);
    }
  }, [onFilesSelect, maxSize, accept]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      if (multiple) {
        const filesArray = Array.from(e.dataTransfer.files);
        handleFilesSelect(filesArray);
      } else {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    }
  }, [handleFileSelect, handleFilesSelect, multiple]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  }, [isDragOver]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only set dragOver to false if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragOver(false);
    }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (multiple) {
        const filesArray = Array.from(e.target.files);
        handleFilesSelect(filesArray);
      } else {
        handleFileSelect(e.target.files[0]);
      }
    }
  }, [handleFileSelect, handleFilesSelect, multiple]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  const resetFiles = () => {
    setSelectedFiles([]);
    setError(null);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelect?.(newFiles);
  };

  return (
    <Card className={cn("overflow-hidden flex flex-col", className)}>
      <div className="p-6 flex-1 flex flex-col">
        <div
          className={cn(
            "drag-area relative flex-1 flex flex-col items-center justify-center p-8 text-center transition-all duration-300 cursor-pointer min-h-[250px]",
            isDragOver && "dragover",
            isValidating && "pointer-events-none opacity-70"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isValidating && document.getElementById('file-input')?.click()}
          data-testid="file-drop-area"
        >
          {isValidating ? (
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          ) : (
            <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-10 h-10 text-white" />
            </div>
          )}
          
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6">{description}</p>
          
          <Button 
            className="btn-gradient text-white relative z-10 px-6 py-2.5"
            disabled={isValidating}
            data-testid="button-select-file"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById('file-input')?.click();
            }}
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Select {multiple ? 'Files' : 'File'}
              </>
            )}
          </Button>
          
          <input
            type="file"
            id="file-input"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={handleInputChange}
            disabled={isValidating}
            data-testid="input-file"
          />
          
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-muted-foreground">
            <span>or drag and drop</span>
            <span className="hidden sm:inline">•</span>
            <span>Max size: {Math.round(maxSize / 1024 / 1024)}MB</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          </div>
        )}

        {/* Single File Display */}
        {selectedFile && !multiple && (
          <div className="mt-6">
            <div className="glass rounded-xl p-4 border border-primary/20" data-testid="file-info">
              <div className="flex items-center gap-4">
                <div className="gradient-primary w-12 h-12 rounded-lg flex items-center justify-center">
                  {(() => {
                    const Icon = getFileIcon(selectedFile);
                    return <Icon className="w-6 h-6 text-white" />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate" data-testid="text-file-name">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span data-testid="text-file-size">{formatFileSize(selectedFile.size)}</span>
                    {selectedFile.type && (
                      <span className="ml-2">• {selectedFile.type.split('/')[1]?.toUpperCase() || 'File'}</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetFile();
                    }}
                    className="hover:bg-destructive/10 hover:text-destructive"
                    data-testid="button-remove-file"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Multiple Files Display */}
        {selectedFiles.length > 0 && multiple && (
          <div className="mt-6" data-testid="files-info">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold" data-testid="text-files-count">
                  {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                </h4>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFiles}
                className="hover:bg-destructive/10 hover:text-destructive"
                data-testid="button-remove-all-files"
              >
                Clear All
              </Button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedFiles.map((file, index) => {
                const Icon = getFileIcon(file);
                return (
                  <div 
                    key={index} 
                    className="glass rounded-lg p-3 flex items-center gap-3 group hover:border-primary/30 transition-all"
                  >
                    <div className="gradient-primary w-10 h-10 rounded-lg flex items-center justify-center opacity-80 group-hover:opacity-100">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" data-testid={`text-file-name-${index}`}>
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span data-testid={`text-file-size-${index}`}>{formatFileSize(file.size)}</span>
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity"
                      data-testid={`button-remove-file-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}