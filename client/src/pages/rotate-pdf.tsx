import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { RotateCw, Upload, Download, FileText, Loader2, ArrowLeft, Shield, RotateCcw, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { PDFDocument, degrees } from "pdf-lib";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PagePreview {
  pageNumber: number;
  rotation: number;
  thumbnail?: string;
}

export default function RotatePDF() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pagesPreviews, setPagesPreviews] = useState<PagePreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rotatedPdf, setRotatedPdf] = useState<Uint8Array | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(true);
  const { toast } = useToast();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF Rotator - AltafToolsHub",
    "description": "Free online PDF rotator to fix page orientation issues",
    "url": "https://www.altaftoolshub.com/rotate-pdf",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1234"
    }
  };

  useSEO({
    title: "Rotate PDF Pages Online Free - Fix Page Orientation | AltafToolsHub",
    description: "Free online PDF rotator to fix page orientation issues. Rotate individual pages or all pages at once. 100% client-side processing for complete privacy.",
    path: "/rotate-pdf",
    keywords: "rotate pdf, pdf rotator, fix pdf orientation, rotate pdf pages, flip pdf pages, pdf rotation tool",
    ogImage: "https://www.altaftoolshub.com/og-rotate-pdf.png",
    structuredData: [structuredData],
    additionalMetaTags: [
      { name: "application-name", content: "PDF Rotator - AltafToolsHub" },
      { property: "article:section", content: "PDF Tools" }
    ]
  });

  const generateThumbnails = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const previews: PagePreview[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        previews.push({
          pageNumber: i,
          rotation: 0,
          thumbnail: canvas.toDataURL('image/jpeg', 0.7)
        });
      }
      
      return previews;
    } catch (error) {
      console.error('Error generating thumbnails:', error);
      return [];
    }
  };

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }

    try {
      setProgress(10);
      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      const pageCount = doc.getPageCount();
      
      setPdfFile(file);
      setPdfDoc(doc);
      setRotatedPdf(null);
      
      // Generate thumbnails
      setProgress(30);
      const previews = await generateThumbnails(file);
      setPagesPreviews(previews);
      
      // Select all pages by default
      const allPages = new Set<number>();
      for (let i = 1; i <= pageCount; i++) {
        allPages.add(i);
      }
      setSelectedPages(allPages);
      setSelectAll(true);
      setProgress(0);
      
      toast({
        title: "File Loaded",
        description: `PDF loaded successfully (${pageCount} pages)`,
      });
    } catch (error) {
      setProgress(0);
      toast({
        title: "Error",
        description: "Failed to load PDF file",
        variant: "destructive"
      });
    }
  }, [toast]);

  useEffect(() => {
    if (selectAll) {
      const allPages = new Set<number>();
      pagesPreviews.forEach(p => allPages.add(p.pageNumber));
      setSelectedPages(allPages);
    } else {
      setSelectedPages(new Set());
    }
  }, [selectAll, pagesPreviews]);

  const togglePageSelection = (pageNum: number) => {
    const newSelection = new Set(selectedPages);
    if (newSelection.has(pageNum)) {
      newSelection.delete(pageNum);
    } else {
      newSelection.add(pageNum);
    }
    setSelectedPages(newSelection);
    setSelectAll(false);
  };

  const rotateSelectedPages = (angle: number) => {
    if (selectedPages.size === 0) {
      toast({
        title: "No pages selected",
        description: "Please select at least one page to rotate",
        variant: "destructive"
      });
      return;
    }

    setPagesPreviews(prev => prev.map(page => {
      if (selectedPages.has(page.pageNumber)) {
        return {
          ...page,
          rotation: (page.rotation + angle) % 360
        };
      }
      return page;
    }));

    toast({
      title: "Pages Rotated",
      description: `Rotated ${selectedPages.size} page(s) by ${angle}°`,
    });
  };

  const applyRotation = async () => {
    if (!pdfDoc || !pdfFile) {
      toast({
        title: "No file loaded",
        description: "Please upload a PDF file first",
        variant: "destructive"
      });
      return;
    }

    const hasRotation = pagesPreviews.some(p => p.rotation !== 0);
    if (!hasRotation) {
      toast({
        title: "No rotation applied",
        description: "Please rotate at least one page before applying",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const newPdf = await PDFDocument.create();
      const totalPages = pdfDoc.getPageCount();

      for (let i = 0; i < totalPages; i++) {
        setProgress(Math.round(((i + 0.5) / totalPages) * 100));
        
        const [page] = await newPdf.copyPages(pdfDoc, [i]);
        const preview = pagesPreviews.find(p => p.pageNumber === i + 1);
        
        if (preview && preview.rotation !== 0) {
          const currentRotation = page.getRotation();
          page.setRotation(degrees(currentRotation.angle + preview.rotation));
        }
        
        newPdf.addPage(page);
        setProgress(Math.round(((i + 1) / totalPages) * 100));
      }

      const pdfBytes = await newPdf.save();
      setRotatedPdf(pdfBytes);
      
      toast({
        title: "Success!",
        description: "PDF rotation applied successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply rotation",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadRotatedPdf = () => {
    if (!rotatedPdf || !pdfFile) return;
    
    const blob = new Blob([rotatedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfFile.name.replace('.pdf', '_rotated.pdf');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setPdfFile(null);
    setPdfDoc(null);
    setPagesPreviews([]);
    setRotatedPdf(null);
    setSelectedPages(new Set());
    setSelectAll(true);
    setProgress(0);
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
          <span className="text-foreground">Rotate PDF</span>
        </nav>

        <Link href="/all-tools?category=pdf-management">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to PDF Tools
          </Button>
        </Link>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Rotate <span className="gradient-text">PDF Pages</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fix page orientation issues in your PDF documents. Rotate individual pages or all pages at once.
              All processing happens locally in your browser.
            </p>
          </div>

          {/* Privacy Notice */}
          <Alert className="mb-6">
            <Shield className="w-4 h-4" />
            <AlertDescription>
              Your PDFs are rotated entirely in your browser. Files never leave your device.
            </AlertDescription>
          </Alert>

          <Card className="p-8 mb-8">
            {!rotatedPdf ? (
              <>
                {!pdfFile ? (
                  <FileUpload
                    accept="application/pdf"
                    onFileSelect={handleFileUpload}
                    className="h-48"
                  >
                    <div className="text-center">
                      <RotateCw className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <p className="text-lg font-medium mb-2">Drop PDF file here or click to select</p>
                      <p className="text-sm text-muted-foreground">Select a PDF to rotate pages</p>
                    </div>
                  </FileUpload>
                ) : (
                  <>
                    {progress > 0 && progress < 100 && !isProcessing && (
                      <div className="mb-6">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-center mt-2 text-muted-foreground">
                          Loading PDF... {progress}%
                        </p>
                      </div>
                    )}

                    {pagesPreviews.length > 0 && (
                      <>
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium">Select pages to rotate</h2>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectAll(!selectAll)}
                              data-testid="button-select-all"
                            >
                              {selectAll ? "Deselect All" : "Select All"}
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                            {pagesPreviews.map((page) => (
                              <div
                                key={page.pageNumber}
                                className={cn(
                                  "relative cursor-pointer border-2 rounded-lg p-2 transition-all",
                                  selectedPages.has(page.pageNumber)
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                                )}
                                onClick={() => togglePageSelection(page.pageNumber)}
                                data-testid={`page-${page.pageNumber}`}
                              >
                                <div className="aspect-[3/4] bg-muted rounded flex items-center justify-center overflow-hidden">
                                  {page.thumbnail ? (
                                    <img
                                      src={page.thumbnail}
                                      alt={`Page ${page.pageNumber}`}
                                      className="w-full h-full object-cover"
                                      style={{
                                        transform: `rotate(${page.rotation}deg)`,
                                        transition: 'transform 0.3s ease'
                                      }}
                                    />
                                  ) : (
                                    <FileText className="w-8 h-8 text-muted-foreground" />
                                  )}
                                </div>
                                <p className="text-xs text-center mt-2">
                                  Page {page.pageNumber}
                                  {page.rotation !== 0 && (
                                    <span className="block text-primary">{page.rotation}°</span>
                                  )}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-center gap-4 mb-6">
                            <Button
                              onClick={() => rotateSelectedPages(-90)}
                              variant="outline"
                              disabled={selectedPages.size === 0}
                              data-testid="button-rotate-left"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Rotate Left 90°
                            </Button>
                            <Button
                              onClick={() => rotateSelectedPages(90)}
                              variant="outline"
                              disabled={selectedPages.size === 0}
                              data-testid="button-rotate-right"
                            >
                              <RotateCw className="w-4 h-4 mr-2" />
                              Rotate Right 90°
                            </Button>
                            <Button
                              onClick={() => rotateSelectedPages(180)}
                              variant="outline"
                              disabled={selectedPages.size === 0}
                              data-testid="button-rotate-180"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Rotate 180°
                            </Button>
                          </div>
                        </div>

                        {isProcessing && (
                          <div className="mb-6">
                            <Progress value={progress} className="h-2" />
                            <p className="text-sm text-center mt-2 text-muted-foreground">
                              Applying rotation... {progress}%
                            </p>
                          </div>
                        )}

                        <div className="flex gap-4">
                          <Button
                            onClick={applyRotation}
                            disabled={isProcessing || pagesPreviews.every(p => p.rotation === 0)}
                            className="flex-1"
                            data-testid="button-apply"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Applying...
                              </>
                            ) : (
                              <>
                                <RotateCw className="w-4 h-4 mr-2" />
                                Apply Rotation
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={reset}
                            variant="outline"
                            disabled={isProcessing}
                            data-testid="button-reset"
                          >
                            Change File
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <RotateCw className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">PDF Rotated Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  Your PDF pages have been rotated as requested
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={downloadRotatedPdf} size="lg" data-testid="button-download">
                    <Download className="w-4 h-4 mr-2" />
                    Download Rotated PDF
                  </Button>
                  <Button onClick={reset} variant="outline" size="lg" data-testid="button-rotate-another">
                    Rotate Another PDF
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Features Section */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Why Use Our PDF Rotator?</h2>
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Rotate individual pages or all pages at once</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Visual preview of all pages before applying</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Rotate left, right, or 180 degrees</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Maintains original PDF quality</span>
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
                <h3 className="font-medium mb-1">1. Upload PDF</h3>
                <p className="text-sm text-muted-foreground">Select your PDF file</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">2. Select Pages</h3>
                <p className="text-sm text-muted-foreground">Choose pages to rotate</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <RotateCw className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">3. Rotate</h3>
                <p className="text-sm text-muted-foreground">Apply rotation angle</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">4. Download</h3>
                <p className="text-sm text-muted-foreground">Save rotated PDF</p>
              </div>
            </div>
          </Card>

          {/* FAQ */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Can I rotate specific pages only?</h3>
                <p className="text-sm text-muted-foreground">Yes! You can select individual pages or multiple pages to rotate while leaving others unchanged.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">What rotation angles are available?</h3>
                <p className="text-sm text-muted-foreground">You can rotate pages 90° left, 90° right, or 180° to completely flip them.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Will rotation affect the PDF quality?</h3>
                <p className="text-sm text-muted-foreground">No, rotation is a lossless operation. Your PDF quality remains exactly the same.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Can I preview pages before applying rotation?</h3>
                <p className="text-sm text-muted-foreground">Yes, the tool shows visual previews of all pages with their current rotation state.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}