import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { FileOutput, Upload, Download, FileText, Loader2, ArrowLeft, Shield, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { PDFDocument } from "pdf-lib";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - using local worker for privacy
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PageThumbnail {
  pageNum: number;
  imageUrl: string;
  selected: boolean;
}

export default function ExtractPages() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pageRange, setPageRange] = useState<string>("");
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [pageThumbnails, setPageThumbnails] = useState<PageThumbnail[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedPdf, setExtractedPdf] = useState<Uint8Array | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Extract PDF Pages - AltafToolsHub",
    "description": "Free online tool to extract specific pages from PDF documents",
    "url": "https://www.altaftoolshub.com/extract-pages",
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
      "ratingCount": "1432"
    }
  };

  useSEO({
    title: "Extract PDF Pages Online Free - Select & Save Specific Pages | AltafToolsHub",
    description: "Free online PDF page extractor to save specific pages from PDF documents. Visual selection, range input, and instant extraction. 100% client-side processing.",
    path: "/extract-pages",
    keywords: "extract pdf pages, pdf page extractor, save pdf pages, select pdf pages, pdf extraction tool",
    ogImage: "https://www.altaftoolshub.com/og-extract-pages.png",
    structuredData: [structuredData],
    additionalMetaTags: [
      { name: "application-name", content: "PDF Page Extractor - AltafToolsHub" },
      { property: "article:section", content: "PDF Tools" }
    ]
  });

  const generateThumbnails = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const thumbnails: PageThumbnail[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
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
        
        thumbnails.push({
          pageNum: i,
          imageUrl: canvas.toDataURL('image/jpeg', 0.7),
          selected: false
        });
        
        setProgress(Math.round((i / pdf.numPages) * 100));
      }
      
      return thumbnails;
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
      setTotalPages(doc.getPageCount());
      setExtractedPdf(null);
      setSelectedPages(new Set());
      setPageRange("");
      
      // Generate thumbnails
      setProgress(20);
      const thumbnails = await generateThumbnails(file);
      setPageThumbnails(thumbnails);
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

  const parsePageRange = (range: string): Set<number> => {
    const pages = new Set<number>();
    const parts = range.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= Math.min(end, totalPages); i++) {
            if (i >= 1 && i <= totalPages) pages.add(i);
          }
        }
      } else {
        const num = parseInt(trimmed);
        if (!isNaN(num) && num >= 1 && num <= totalPages) {
          pages.add(num);
        }
      }
    }
    
    return pages;
  };

  const handlePageRangeChange = (value: string) => {
    setPageRange(value);
    const pages = parsePageRange(value);
    setSelectedPages(pages);
    
    // Update thumbnails selection
    setPageThumbnails(prev => prev.map(thumb => ({
      ...thumb,
      selected: pages.has(thumb.pageNum)
    })));
  };

  const togglePageSelection = (pageNum: number) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(pageNum)) {
      newSelected.delete(pageNum);
    } else {
      newSelected.add(pageNum);
    }
    setSelectedPages(newSelected);
    
    // Update thumbnails
    setPageThumbnails(prev => prev.map(thumb => ({
      ...thumb,
      selected: thumb.pageNum === pageNum ? !thumb.selected : thumb.selected
    })));
    
    // Update page range input
    const sortedPages = Array.from(newSelected).sort((a, b) => a - b);
    setPageRange(sortedPages.join(', '));
  };

  const extractPages = async () => {
    if (!pdfDoc || selectedPages.size === 0) {
      toast({
        title: "No pages selected",
        description: "Please select pages to extract",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const newPdf = await PDFDocument.create();
      const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);
      
      for (let i = 0; i < sortedPages.length; i++) {
        const pageNum = sortedPages[i];
        setProgress(Math.round(((i + 0.5) / sortedPages.length) * 100));
        
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
        newPdf.addPage(copiedPage);
        
        setProgress(Math.round(((i + 1) / sortedPages.length) * 100));
      }

      const pdfBytes = await newPdf.save();
      setExtractedPdf(pdfBytes);
      
      toast({
        title: "Success!",
        description: `Extracted ${sortedPages.length} pages successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract pages",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadExtractedPdf = () => {
    if (!extractedPdf || !pdfFile) return;
    
    const blob = new Blob([extractedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfFile.name.replace('.pdf', '_extracted.pdf');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setPdfFile(null);
    setPdfDoc(null);
    setExtractedPdf(null);
    setPageThumbnails([]);
    setSelectedPages(new Set());
    setPageRange("");
    setTotalPages(0);
    setProgress(0);
  };

  const selectAllPages = () => {
    const allPages = new Set<number>();
    for (let i = 1; i <= totalPages; i++) {
      allPages.add(i);
    }
    setSelectedPages(allPages);
    setPageRange(`1-${totalPages}`);
    setPageThumbnails(prev => prev.map(thumb => ({ ...thumb, selected: true })));
  };

  const clearSelection = () => {
    setSelectedPages(new Set());
    setPageRange("");
    setPageThumbnails(prev => prev.map(thumb => ({ ...thumb, selected: false })));
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
          <span className="text-foreground">Extract Pages</span>
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
              Extract <span className="gradient-text">PDF Pages</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select and extract specific pages from your PDF documents. 
              Create new PDFs with only the pages you need.
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
            {!extractedPdf ? (
              <>
                {!pdfFile ? (
                  <FileUpload
                    accept="application/pdf"
                    onFileSelect={handleFileUpload}
                    className="h-48"
                    title="Drop PDF file here or click to select"
                    description="Select a PDF to extract pages from"
                  />
                ) : (
                  <>
                    {progress > 0 && progress < 100 && !isProcessing && (
                      <div className="mb-6">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-center mt-2 text-muted-foreground">
                          Loading pages... {progress}%
                        </p>
                      </div>
                    )}

                    {pageThumbnails.length > 0 && (
                      <>
                        <div className="mb-6">
                          <Label htmlFor="pageRange" className="mb-2 block">
                            Enter page range (e.g., 1-3, 5, 7-10)
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="pageRange"
                              value={pageRange}
                              onChange={(e) => handlePageRangeChange(e.target.value)}
                              placeholder="1-3, 5, 7-10"
                              className="flex-1"
                              data-testid="input-page-range"
                            />
                            <Button
                              onClick={selectAllPages}
                              variant="outline"
                              size="sm"
                              data-testid="button-select-all"
                            >
                              Select All
                            </Button>
                            <Button
                              onClick={clearSelection}
                              variant="outline"
                              size="sm"
                              data-testid="button-clear"
                            >
                              Clear
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedPages.size} of {totalPages} pages selected
                          </p>
                        </div>

                        <div className="mb-6">
                          <h3 className="font-medium mb-3">Click pages to select/deselect</h3>
                          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 max-h-96 overflow-y-auto p-2">
                            {pageThumbnails.map((thumb) => (
                              <div
                                key={thumb.pageNum}
                                onClick={() => togglePageSelection(thumb.pageNum)}
                                className={`cursor-pointer transition-all ${
                                  thumb.selected 
                                    ? 'ring-2 ring-primary ring-offset-2' 
                                    : 'hover:ring-2 hover:ring-primary/50'
                                }`}
                                data-testid={`page-thumb-${thumb.pageNum}`}
                              >
                                <div className="relative">
                                  <img
                                    src={thumb.imageUrl}
                                    alt={`Page ${thumb.pageNum}`}
                                    className="w-full h-auto border rounded"
                                  />
                                  {thumb.selected && (
                                    <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-1">
                                      <CheckCircle className="w-4 h-4" />
                                    </div>
                                  )}
                                  <div className="text-center text-xs mt-1">
                                    Page {thumb.pageNum}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {isProcessing && (
                      <div className="mb-6">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-center mt-2 text-muted-foreground">
                          Extracting pages... {progress}%
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        onClick={extractPages}
                        disabled={isProcessing || selectedPages.size === 0}
                        className="flex-1"
                        data-testid="button-extract"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Extracting...
                          </>
                        ) : (
                          <>
                            <FileOutput className="w-4 h-4 mr-2" />
                            Extract {selectedPages.size} Page{selectedPages.size !== 1 ? 's' : ''}
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
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FileOutput className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Pages Extracted Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  {selectedPages.size} pages have been extracted to a new PDF
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={downloadExtractedPdf} size="lg" data-testid="button-download">
                    <Download className="w-4 h-4 mr-2" />
                    Download Extracted PDF
                  </Button>
                  <Button onClick={reset} variant="outline" size="lg" data-testid="button-extract-another">
                    Extract More Pages
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Why Use Section */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Why Use Our PDF Page Extractor?</h2>
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Visual page selection with thumbnails</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Flexible range input (e.g., 1-5, 8, 10-15)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Preserves original formatting and quality</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Extract any combination of pages</span>
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
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">2. Select Pages</h3>
                <p className="text-sm text-muted-foreground">Choose pages to extract</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileOutput className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">3. Extract</h3>
                <p className="text-sm text-muted-foreground">Create new PDF</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">4. Download</h3>
                <p className="text-sm text-muted-foreground">Save extracted PDF</p>
              </div>
            </div>
          </Card>

          {/* Use Cases */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Common Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">📝 Document Sharing</h3>
                <p className="text-sm text-muted-foreground">Extract only relevant pages to share with colleagues</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">📚 Study Materials</h3>
                <p className="text-sm text-muted-foreground">Create focused study guides from textbook chapters</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">📋 Report Sections</h3>
                <p className="text-sm text-muted-foreground">Extract specific sections from lengthy reports</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">📄 Legal Documents</h3>
                <p className="text-sm text-muted-foreground">Isolate specific clauses or sections for review</p>
              </div>
            </div>
          </Card>

          {/* FAQ */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Can I extract non-consecutive pages?</h3>
                <p className="text-sm text-muted-foreground">Yes, you can select any combination of pages using ranges and individual page numbers (e.g., 1-3, 7, 9-12).</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Does extraction maintain the original quality?</h3>
                <p className="text-sm text-muted-foreground">Yes, extracted pages retain the exact quality and formatting of the original PDF.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Can I reorder pages during extraction?</h3>
                <p className="text-sm text-muted-foreground">Pages are extracted in their original order. Use our Organize PDF tool to reorder pages.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Is there a limit to how many pages I can extract?</h3>
                <p className="text-sm text-muted-foreground">No, you can extract any number of pages from your PDF, from a single page to all pages.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Can I extract the same page multiple times?</h3>
                <p className="text-sm text-muted-foreground">Currently, each page is extracted once. To duplicate pages, use our PDF editor tools.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}