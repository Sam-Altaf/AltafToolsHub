import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { FilePlus, Upload, Download, X, ChevronUp, ChevronDown, Loader2, GripVertical, FileText, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { PDFDocument } from "pdf-lib";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

interface PDFFile {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  file: File;
  arrayBuffer?: ArrayBuffer;
}

export default function MergePDF() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedPdf, setMergedPdf] = useState<Uint8Array | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF Merger - AltafToolsHub",
    "description": "Free online PDF merger to combine multiple PDFs into one document",
    "url": "https://www.altaftoolshub.com/merge-pdf",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1842"
    }
  };

  useSEO({
    title: "Merge PDF Files Online Free - Combine Multiple PDFs | AltafToolsHub",
    description: "Free online PDF merger to combine multiple PDF files into one document. Drag and drop to reorder pages. 100% client-side processing for complete privacy.",
    path: "/merge-pdf",
    keywords: "merge pdf, combine pdf, pdf merger, join pdf files, combine pdf files, merge pdf online, free pdf merger",
    ogImage: "https://www.altaftoolshub.com/og-merge-pdf.png",
    structuredData: [structuredData],
    additionalMetaTags: [
      { name: "application-name", content: "PDF Merger - AltafToolsHub" },
      { property: "article:section", content: "PDF Tools" }
    ]
  });

  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.type === 'application/pdf');
    
    if (validFiles.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please upload only PDF files",
        variant: "destructive"
      });
      return;
    }

    const newPdfFiles: PDFFile[] = [];
    
    for (const file of validFiles) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        
        newPdfFiles.push({
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          pageCount,
          file,
          arrayBuffer
        });
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to load ${file.name}`,
          variant: "destructive"
        });
      }
    }

    setPdfFiles(prev => [...prev, ...newPdfFiles]);
    toast({
      title: "Files Added",
      description: `Added ${newPdfFiles.length} PDF file(s)`,
    });
  }, [toast]);

  const removeFile = (id: string) => {
    setPdfFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    setPdfFiles(prev => {
      const newFiles = [...prev];
      const [removed] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, removed);
      return newFiles;
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      moveFile(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) {
      toast({
        title: "Not enough files",
        description: "Please add at least 2 PDF files to merge",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const mergedPdf = await PDFDocument.create();
      const totalFiles = pdfFiles.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = pdfFiles[i];
        setProgress(Math.round(((i + 0.5) / totalFiles) * 100));
        
        const pdfDoc = await PDFDocument.load(file.arrayBuffer!);
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        
        pages.forEach(page => mergedPdf.addPage(page));
        setProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      const mergedPdfBytes = await mergedPdf.save();
      setMergedPdf(mergedPdfBytes);
      
      toast({
        title: "Success!",
        description: "PDFs merged successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to merge PDFs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadMergedPdf = () => {
    if (!mergedPdf) return;
    
    const blob = new Blob([mergedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged-document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setPdfFiles([]);
    setMergedPdf(null);
    setProgress(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen pattern-bg">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/all-tools?category=pdf-management" className="hover:text-primary transition-colors">PDF Tools</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Merge PDF</span>
        </nav>

        <Link href="/all-tools?category=pdf-management">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to PDF Tools
          </Button>
        </Link>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Merge <span className="gradient-text">PDF Files</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combine multiple PDF files into a single document. Drag and drop to reorder pages.
              Your files are processed securely in your browser.
            </p>
          </div>

          {/* Privacy Notice */}
          <Alert className="mb-6">
            <Shield className="w-4 h-4" />
            <AlertDescription>
              Your PDFs are merged entirely in your browser. Files never leave your device.
            </AlertDescription>
          </Alert>

          <Card className="p-8 mb-8">
            {!mergedPdf ? (
              <>
                {pdfFiles.length === 0 ? (
                  <FileUpload
                    accept="application/pdf"
                    multiple
                    onFilesSelect={handleFileUpload}
                    className="h-64"
                    title="Drop PDF files here or click to select"
                    description="Support multiple PDF files"
                  />
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {pdfFiles.map((file, index) => (
                        <div
                          key={file.id}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-move",
                            draggedIndex === index && "opacity-50"
                          )}
                          data-testid={`pdf-file-${index}`}
                        >
                          <GripVertical className="w-5 h-5 text-muted-foreground" />
                          <FileText className="w-8 h-8 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {file.pageCount} page{file.pageCount !== 1 ? 's' : ''} • {formatFileSize(file.size)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => index > 0 && moveFile(index, index - 1)}
                              disabled={index === 0}
                              data-testid={`move-up-${index}`}
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => index < pdfFiles.length - 1 && moveFile(index, index + 1)}
                              disabled={index === pdfFiles.length - 1}
                              data-testid={`move-down-${index}`}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(file.id)}
                              className="text-destructive hover:text-destructive"
                              data-testid={`remove-${index}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <FileUpload
                      accept="application/pdf"
                      multiple
                      onFilesSelect={handleFileUpload}
                      className="h-32 mb-6"
                      title="Add more PDF files"
                      description="Drag and drop or click to add more PDFs"
                    />

                    {isProcessing && (
                      <div className="mb-6">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-center mt-2 text-muted-foreground">
                          Merging PDFs... {progress}%
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        onClick={mergePDFs}
                        disabled={isProcessing || pdfFiles.length < 2}
                        className="flex-1"
                        data-testid="button-merge"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Merging...
                          </>
                        ) : (
                          <>
                            <FilePlus className="w-4 h-4 mr-2" />
                            Merge {pdfFiles.length} PDFs
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={reset}
                        variant="outline"
                        disabled={isProcessing}
                        data-testid="button-reset"
                      >
                        Clear All
                      </Button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">PDFs Merged Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  Your files have been combined into a single PDF document
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={downloadMergedPdf} size="lg" data-testid="button-download">
                    <Download className="w-4 h-4 mr-2" />
                    Download Merged PDF
                  </Button>
                  <Button onClick={reset} variant="outline" size="lg" data-testid="button-merge-more">
                    Merge More PDFs
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Features Section */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Why Use Our PDF Merger?</h2>
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Combine multiple PDFs without quality loss</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Drag and drop to reorder pages</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>No file size limitations</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Works offline after page loads</span>
              </p>
            </div>
          </Card>

          {/* How It Works */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">1. Upload PDFs</h3>
                <p className="text-sm text-muted-foreground">Select or drag multiple PDF files</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <GripVertical className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">2. Arrange Order</h3>
                <p className="text-sm text-muted-foreground">Drag to reorder files</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <FilePlus className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">3. Merge Files</h3>
                <p className="text-sm text-muted-foreground">Click to combine PDFs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">4. Download</h3>
                <p className="text-sm text-muted-foreground">Save merged PDF</p>
              </div>
            </div>
          </Card>

          {/* FAQ */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">How many PDFs can I merge at once?</h3>
                <p className="text-sm text-muted-foreground">You can merge unlimited PDF files at once. The only limitation is your device's processing power and available memory.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Will merging affect the quality of my PDFs?</h3>
                <p className="text-sm text-muted-foreground">No, merging preserves the original quality of all PDFs. All pages, images, and text remain exactly as they were.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Can I rearrange pages after merging?</h3>
                <p className="text-sm text-muted-foreground">You can rearrange the order of PDF files before merging. For page-level reorganization, use our Organize PDF tool.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">What's the maximum file size for merging?</h3>
                <p className="text-sm text-muted-foreground">There's no fixed limit. The tool can handle large files, limited only by your browser's memory capacity.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}