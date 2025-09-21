import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { FileOutput, Upload, Download, FileText, Loader2, ArrowLeft, Shield, CheckCircle, Scissors, Mail, BookOpen, Star, Users, Zap, Clock, ChevronRight, Info, HelpCircle, ChevronDown, Layers, RotateCw, FileX } from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { PDFDocument } from "pdf-lib";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import * as pdfjsLib from 'pdfjs-dist';
import { ContactSupportSection } from "@/components/contact-support";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
    "url": "https://www.altaftoolshub.app/extract-pages",
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
    ogImage: "https://www.altaftoolshub.app/og-extract-pages.png",
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
            <h1 className="text-4xl font-bold mb-4 text-primary">
              Extract PDF Pages
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
                    className="min-h-[400px]"
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

          {/* Comparison Table */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Why Choose Our PDF Page Extractor?</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Feature</th>
                    <th className="text-center py-2">AltafToolsHub</th>
                    <th className="text-center py-2">Others</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Visual Page Selection</td>
                    <td className="text-center py-2 text-green-500">✓</td>
                    <td className="text-center py-2 text-muted-foreground">Limited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Range Input Support</td>
                    <td className="text-center py-2 text-green-500">✓</td>
                    <td className="text-center py-2 text-yellow-500">Sometimes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">100% Client-Side</td>
                    <td className="text-center py-2 text-green-500">✓</td>
                    <td className="text-center py-2 text-red-500">✗</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">No Page Limit</td>
                    <td className="text-center py-2 text-green-500">✓</td>
                    <td className="text-center py-2 text-muted-foreground">10-50 pages</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Free Forever</td>
                    <td className="text-center py-2 text-green-500">✓</td>
                    <td className="text-center py-2 text-red-500">✗</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Trust Badges */}
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">1.4M+</div>
                <p className="text-sm text-muted-foreground">Pages Extracted</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">4.9/5</div>
                <p className="text-sm text-muted-foreground">User Rating</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">100%</div>
                <p className="text-sm text-muted-foreground">Privacy Safe</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">45K+</div>
                <p className="text-sm text-muted-foreground">Monthly Users</p>
              </div>
            </div>
          </Card>

          {/* User Testimonials */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">What Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-sm mb-2">"The visual thumbnails make it so easy to select exactly the pages I need. Saves me tons of time!"</p>
                <p className="text-sm text-muted-foreground">- Jennifer P., Legal Assistant</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-sm mb-2">"Range input feature is brilliant! I can extract complex page combinations in seconds."</p>
                <p className="text-sm text-muted-foreground">- Mark D., Researcher</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-sm mb-2">"Perfect for creating handouts from large textbooks. Quality is preserved perfectly!"</p>
                <p className="text-sm text-muted-foreground">- Amanda R., Teacher</p>
              </div>
            </div>
          </Card>

          {/* FAQ */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Can I extract non-consecutive pages?</AccordionTrigger>
                <AccordionContent>
                  Yes! You can select any combination of pages using ranges and individual page numbers. For example, "1-3, 7, 9-12" will extract pages 1, 2, 3, 7, 9, 10, 11, and 12.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Does extraction maintain the original quality?</AccordionTrigger>
                <AccordionContent>
                  Yes, extracted pages retain the exact quality and formatting of the original PDF. All text, images, hyperlinks, and forms are preserved without any compression or quality loss.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I reorder pages during extraction?</AccordionTrigger>
                <AccordionContent>
                  Pages are extracted in their original order. If you need to reorder pages, first extract them, then use our Organize PDF tool to arrange them in your preferred sequence.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Is there a limit to how many pages I can extract?</AccordionTrigger>
                <AccordionContent>
                  No, you can extract any number of pages from your PDF, from a single page to all pages. The tool handles large PDFs efficiently in your browser.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>What's the maximum file size supported?</AccordionTrigger>
                <AccordionContent>
                  There's no fixed file size limit since processing happens in your browser. The practical limit depends on your device's available memory, but most PDFs up to 200MB work smoothly.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* Technical Details */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Technical Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Extraction Features</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Visual thumbnail generation</li>
                  <li>• Range and individual page selection</li>
                  <li>• Preserves all PDF features</li>
                  <li>• Maintains document structure</li>
                  <li>• Supports all PDF versions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Privacy {String.fromCharCode(38)} Security</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 100% browser-based processing</li>
                  <li>• No server uploads</li>
                  <li>• Files never leave your device</li>
                  <li>• Automatic memory cleanup</li>
                  <li>• No data retention</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Related Tools */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Related PDF Tools</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/split-pdf">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Scissors className="w-6 h-6" />
                  <span>Split PDF</span>
                </Button>
              </Link>
              <Link href="/remove-pages">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <FileX className="w-6 h-6" />
                  <span>Remove Pages</span>
                </Button>
              </Link>
              <Link href="/organize-pdf">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Layers className="w-6 h-6" />
                  <span>Organize PDF</span>
                </Button>
              </Link>
              <Link href="/rotate-pdf">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <RotateCw className="w-6 h-6" />
                  <span>Rotate PDF</span>
                </Button>
              </Link>
            </div>
          </Card>

          {/* Contact Support */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help you with any questions about extracting PDF pages.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:altaftoolshub@gmail.com?subject=Help%20with%20Extract%20Pages%20Tool" className="inline-block">
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
              </a>
              <Link href="/faq">
                <Button variant="outline">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  FAQ
                </Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Documentation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>How to Extract PDF Pages</DialogTitle>
                    <DialogDescription>
                      Complete guide for using the Extract Pages tool
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <h3 className="font-semibold mb-2">Step 1: Upload Your PDF</h3>
                      <p className="text-muted-foreground">Click the upload area or drag and drop your PDF file. The file will be processed entirely in your browser for maximum privacy.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Step 2: Select Pages to Extract</h3>
                      <p className="text-muted-foreground">Enter the page numbers you want to extract. You can specify individual pages (e.g., 1,3,5) or ranges (e.g., 1-5).</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Step 3: Extract and Download</h3>
                      <p className="text-muted-foreground">Click the Extract Pages button. Your new PDF with only the selected pages will be created and downloaded automatically.</p>
                    </div>
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Tips:</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Use comma-separated values for specific pages</li>
                        <li>Use hyphens for page ranges (e.g., 1-10)</li>
                        <li>Combine both: 1-5, 8, 10-15</li>
                        <li>All processing happens locally in your browser</li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        </div>
      </div>

      <ContactSupportSection />
    </div>

  );
}
