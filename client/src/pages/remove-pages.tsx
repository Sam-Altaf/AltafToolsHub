import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { FileX, Upload, Download, FileText, Loader2, ArrowLeft, Shield, Trash2 } from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { PDFDocument } from "pdf-lib";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - using local worker for privacy
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PageData {
  pageNumber: number;
  thumbnail?: string;
}

export default function RemovePages() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedPdf, setProcessedPdf] = useState<Uint8Array | null>(null);
  const { toast } = useToast();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Remove PDF Pages - AltafToolsHub",
    "description": "Free online tool to remove unwanted pages from PDF documents",
    "url": "https://www.altaftoolshub.com/remove-pages",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "ratingCount": "923"
    }
  };

  useSEO({
    title: "Remove PDF Pages Online Free - Delete Unwanted Pages | AltafToolsHub",
    description: "Free online tool to remove unwanted pages from PDF documents. Select and delete specific pages while preserving quality. 100% client-side processing.",
    path: "/remove-pages",
    keywords: "remove pdf pages, delete pdf pages, pdf page remover, pdf page deletion, remove pages from pdf",
    ogImage: "https://www.altaftoolshub.com/og-remove-pages.png",
    structuredData: [structuredData],
    additionalMetaTags: [
      { name: "application-name", content: "Remove PDF Pages - AltafToolsHub" },
      { property: "article:section", content: "PDF Tools" }
    ]
  });

  const generateThumbnails = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const pageDatas: PageData[] = [];
      
      for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
          intent: 'display'
        } as any).promise;
        
        pageDatas.push({
          pageNumber: i,
          thumbnail: canvas.toDataURL('image/jpeg', 0.5)
        });
      }
      
      // Add remaining pages without thumbnails
      for (let i = 21; i <= pdf.numPages; i++) {
        pageDatas.push({ pageNumber: i });
      }
      
      return pageDatas;
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
      
      setPdfFile(file);
      setPdfDoc(doc);
      setProcessedPdf(null);
      setSelectedPages(new Set());
      
      setProgress(30);
      const pageDatas = await generateThumbnails(file);
      setPages(pageDatas);
      setProgress(0);
      
      toast({
        title: "File Loaded",
        description: `PDF loaded with ${doc.getPageCount()} pages`,
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

  const togglePageSelection = (pageNum: number) => {
    const newSelection = new Set(selectedPages);
    if (newSelection.has(pageNum)) {
      newSelection.delete(pageNum);
    } else {
      newSelection.add(pageNum);
    }
    setSelectedPages(newSelection);
  };

  const removePages = async () => {
    if (!pdfDoc || !pdfFile) {
      toast({
        title: "No file loaded",
        description: "Please upload a PDF file first",
        variant: "destructive"
      });
      return;
    }

    if (selectedPages.size === 0) {
      toast({
        title: "No pages selected",
        description: "Please select pages to remove",
        variant: "destructive"
      });
      return;
    }

    if (selectedPages.size >= pages.length) {
      toast({
        title: "Cannot remove all pages",
        description: "At least one page must remain",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const newPdf = await PDFDocument.create();
      const totalPages = pdfDoc.getPageCount();
      const pagesToKeep: number[] = [];
      
      for (let i = 0; i < totalPages; i++) {
        if (!selectedPages.has(i + 1)) {
          pagesToKeep.push(i);
        }
      }

      for (let i = 0; i < pagesToKeep.length; i++) {
        setProgress(Math.round(((i + 0.5) / pagesToKeep.length) * 100));
        const [page] = await newPdf.copyPages(pdfDoc, [pagesToKeep[i]]);
        newPdf.addPage(page);
        setProgress(Math.round(((i + 1) / pagesToKeep.length) * 100));
      }

      const pdfBytes = await newPdf.save();
      setProcessedPdf(pdfBytes);
      
      toast({
        title: "Success!",
        description: `Removed ${selectedPages.size} page(s) from PDF`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove pages",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadPdf = () => {
    if (!processedPdf || !pdfFile) return;
    
    const blob = new Blob([processedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfFile.name.replace('.pdf', '_edited.pdf');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setPdfFile(null);
    setPdfDoc(null);
    setPages([]);
    setProcessedPdf(null);
    setSelectedPages(new Set());
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
          <span className="text-foreground">Remove Pages</span>
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
              Remove <span className="gradient-text">PDF Pages</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Delete unwanted pages from your PDF documents. Select specific pages to remove while keeping the rest.
            </p>
          </div>

          {/* Privacy Notice */}
          <Alert className="mb-6">
            <Shield className="w-4 h-4" />
            <AlertDescription>
              Your PDFs are processed entirely in your browser. Files never leave your device.
            </AlertDescription>
          </Alert>

          <Card className="p-8 mb-8">
            {!processedPdf ? (
              <>
                {!pdfFile ? (
                  <FileUpload
                    accept="application/pdf"
                    onFileSelect={handleFileUpload}
                    className="h-48"
                    title="Drop PDF file here or click to select"
                    description="Select a PDF to remove pages"
                  />
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

                    {pages.length > 0 && (
                      <>
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium">
                              Select pages to remove ({selectedPages.size} selected)
                            </h2>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPages(new Set())}
                              disabled={selectedPages.size === 0}
                              data-testid="button-clear-selection"
                            >
                              Clear Selection
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                            {pages.map((page) => (
                              <div
                                key={page.pageNumber}
                                className={cn(
                                  "relative cursor-pointer border-2 rounded-lg p-2 transition-all",
                                  selectedPages.has(page.pageNumber)
                                    ? "border-destructive bg-destructive/10"
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
                                    />
                                  ) : (
                                    <FileText className="w-6 h-6 text-muted-foreground" />
                                  )}
                                </div>
                                <p className="text-xs text-center mt-1">
                                  {page.pageNumber}
                                </p>
                                {selectedPages.has(page.pageNumber) && (
                                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
                                    <Trash2 className="w-3 h-3 text-destructive-foreground" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <p className="text-sm text-muted-foreground text-center mt-4">
                            Click pages to mark them for removal
                          </p>
                        </div>

                        {isProcessing && (
                          <div className="mb-6">
                            <Progress value={progress} className="h-2" />
                            <p className="text-sm text-center mt-2 text-muted-foreground">
                              Removing pages... {progress}%
                            </p>
                          </div>
                        )}

                        <div className="flex gap-4">
                          <Button
                            onClick={removePages}
                            disabled={isProcessing || selectedPages.size === 0}
                            className="flex-1"
                            variant="destructive"
                            data-testid="button-remove"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Removing...
                              </>
                            ) : (
                              <>
                                <FileX className="w-4 h-4 mr-2" />
                                Remove {selectedPages.size > 0 ? `${selectedPages.size} ` : ''}Page{selectedPages.size !== 1 ? 's' : ''}
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
                  <FileX className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Pages Removed Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  Your PDF has been updated with the selected pages removed
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={downloadPdf} size="lg" data-testid="button-download">
                    <Download className="w-4 h-4 mr-2" />
                    Download Updated PDF
                  </Button>
                  <Button onClick={reset} variant="outline" size="lg" data-testid="button-process-another">
                    Process Another PDF
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Features Section */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Visual page selection with thumbnails</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Remove multiple pages at once</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Preserves original PDF quality</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Works with PDFs of any size</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}