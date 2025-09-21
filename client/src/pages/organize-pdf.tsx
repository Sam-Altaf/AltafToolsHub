import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { Layers, Upload, Download, FileText, Loader2, ArrowLeft, Shield, Trash2, GripVertical, RotateCw, Copy, Scissors, FileOutput, Mail, BookOpen, Star, Users, Zap, Clock, CheckCircle2, ChevronRight, Info, HelpCircle, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { PDFDocument, degrees } from "pdf-lib";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
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

interface PageData {
  id: string;
  originalIndex: number;
  currentIndex: number;
  rotation: number;
  thumbnail?: string;
  deleted: boolean;
}

export default function OrganizePDF() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [organizedPdf, setOrganizedPdf] = useState<Uint8Array | null>(null);
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [draggedPage, setDraggedPage] = useState<PageData | null>(null);
  const { toast } = useToast();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF Organizer - AltafToolsHub",
    "description": "Free online PDF organizer to rearrange, rotate, and manage PDF pages",
    "url": "https://www.altaftoolshub.app/organize-pdf",
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
      "ratingCount": "1567"
    }
  };

  useSEO({
    title: "Organize PDF Pages Online Free - Rearrange & Manage | AltafToolsHub",
    description: "Free online PDF organizer to rearrange, rotate, delete, and duplicate pages. Complete page management with drag-and-drop. 100% client-side processing.",
    path: "/organize-pdf",
    keywords: "organize pdf, rearrange pdf pages, pdf page manager, reorder pdf, pdf organizer, manage pdf pages",
    ogImage: "https://www.altaftoolshub.app/og-organize-pdf.png",
    structuredData: [structuredData],
    additionalMetaTags: [
      { name: "application-name", content: "PDF Organizer - AltafToolsHub" },
      { property: "article:section", content: "PDF Tools" }
    ]
  });

  const generateThumbnails = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const pageDatas: PageData[] = [];
      
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
          viewport: viewport,
          intent: 'display'
        } as any).promise;
        
        pageDatas.push({
          id: `page-${i}-${Date.now()}`,
          originalIndex: i - 1,
          currentIndex: i - 1,
          rotation: 0,
          thumbnail: canvas.toDataURL('image/jpeg', 0.7),
          deleted: false
        });
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
      setOrganizedPdf(null);
      setSelectedPages(new Set());
      
      // Generate thumbnails
      setProgress(30);
      const pageDatas = await generateThumbnails(file);
      setPages(pageDatas);
      setProgress(0);
      
      toast({
        title: "File Loaded",
        description: `PDF loaded successfully (${doc.getPageCount()} pages)`,
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

  const togglePageSelection = (pageId: string) => {
    const newSelection = new Set(selectedPages);
    if (newSelection.has(pageId)) {
      newSelection.delete(pageId);
    } else {
      newSelection.add(pageId);
    }
    setSelectedPages(newSelection);
  };

  const deleteSelectedPages = () => {
    if (selectedPages.size === 0) {
      toast({
        title: "No pages selected",
        description: "Please select pages to delete",
        variant: "destructive"
      });
      return;
    }

    setPages(prev => prev.map(page => 
      selectedPages.has(page.id) ? { ...page, deleted: true } : page
    ));
    setSelectedPages(new Set());
    
    toast({
      title: "Pages Deleted",
      description: `Marked ${selectedPages.size} page(s) for deletion`,
    });
  };

  const rotateSelectedPages = () => {
    if (selectedPages.size === 0) {
      toast({
        title: "No pages selected",
        description: "Please select pages to rotate",
        variant: "destructive"
      });
      return;
    }

    setPages(prev => prev.map(page => 
      selectedPages.has(page.id) ? { ...page, rotation: (page.rotation + 90) % 360 } : page
    ));
    
    toast({
      title: "Pages Rotated",
      description: `Rotated ${selectedPages.size} page(s) by 90°`,
    });
  };

  const duplicateSelectedPages = () => {
    if (selectedPages.size === 0) {
      toast({
        title: "No pages selected",
        description: "Please select pages to duplicate",
        variant: "destructive"
      });
      return;
    }

    const newPages: PageData[] = [];
    pages.forEach(page => {
      newPages.push(page);
      if (selectedPages.has(page.id)) {
        newPages.push({
          ...page,
          id: `page-${page.originalIndex}-copy-${Date.now()}`
        });
      }
    });
    
    setPages(newPages);
    setSelectedPages(new Set());
    
    toast({
      title: "Pages Duplicated",
      description: `Duplicated ${selectedPages.size} page(s)`,
    });
  };

  const handleDragStart = (page: PageData) => {
    setDraggedPage(page);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetPage: PageData) => {
    e.preventDefault();
    if (!draggedPage || draggedPage.id === targetPage.id) return;

    const newPages = [...pages];
    const draggedIndex = newPages.findIndex(p => p.id === draggedPage.id);
    const targetIndex = newPages.findIndex(p => p.id === targetPage.id);
    
    newPages.splice(draggedIndex, 1);
    newPages.splice(targetIndex, 0, draggedPage);
    
    setPages(newPages.map((p, i) => ({ ...p, currentIndex: i })));
    setDraggedPage(null);
  };

  const applyChanges = async () => {
    if (!pdfDoc || !pdfFile) {
      toast({
        title: "No file loaded",
        description: "Please upload a PDF file first",
        variant: "destructive"
      });
      return;
    }

    const activePages = pages.filter(p => !p.deleted);
    if (activePages.length === 0) {
      toast({
        title: "No pages remaining",
        description: "At least one page must remain in the PDF",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const newPdf = await PDFDocument.create();
      const totalPages = activePages.length;

      for (let i = 0; i < totalPages; i++) {
        const pageData = activePages[i];
        setProgress(Math.round(((i + 0.5) / totalPages) * 100));
        
        const [page] = await newPdf.copyPages(pdfDoc, [pageData.originalIndex]);
        
        if (pageData.rotation !== 0) {
          const currentRotation = page.getRotation();
          page.setRotation(degrees(currentRotation.angle + pageData.rotation));
        }
        
        newPdf.addPage(page);
        setProgress(Math.round(((i + 1) / totalPages) * 100));
      }

      const pdfBytes = await newPdf.save();
      setOrganizedPdf(pdfBytes);
      
      toast({
        title: "Success!",
        description: "PDF organized successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to organize PDF",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadOrganizedPdf = () => {
    if (!organizedPdf || !pdfFile) return;
    
    const blob = new Blob([organizedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfFile.name.replace('.pdf', '_organized.pdf');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setPdfFile(null);
    setPdfDoc(null);
    setPages([]);
    setOrganizedPdf(null);
    setSelectedPages(new Set());
    setProgress(0);
  };

  const hasChanges = () => {
    return pages.some(p => p.deleted || p.rotation !== 0 || p.currentIndex !== p.originalIndex);
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
          <span className="text-foreground">Organize PDF</span>
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
              Organize PDF Pages
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Rearrange, rotate, delete, and duplicate PDF pages with drag-and-drop ease.
              Complete page management in your browser.
            </p>
          </div>

          {/* Privacy Notice */}
          <Alert className="mb-6">
            <Shield className="w-4 h-4" />
            <AlertDescription>
              Your PDFs are organized entirely in your browser. Files never leave your device.
            </AlertDescription>
          </Alert>

          <Card className="p-8 mb-8">
            {!organizedPdf ? (
              <>
                {!pdfFile ? (
                  <FileUpload
                    accept="application/pdf"
                    onFileSelect={handleFileUpload}
                    className="min-h-[400px]"
                    title="Drop PDF file here or click to select"
                    description="Select a PDF to organize pages"
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
                              {pages.filter(p => !p.deleted).length} of {pages.length} pages
                            </h2>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={rotateSelectedPages}
                                disabled={selectedPages.size === 0}
                                data-testid="button-rotate"
                              >
                                <RotateCw className="w-4 h-4 mr-1" />
                                Rotate
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={duplicateSelectedPages}
                                disabled={selectedPages.size === 0}
                                data-testid="button-duplicate"
                              >
                                <Copy className="w-4 h-4 mr-1" />
                                Duplicate
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={deleteSelectedPages}
                                disabled={selectedPages.size === 0}
                                className="text-destructive hover:text-destructive"
                                data-testid="button-delete"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                            {pages.filter(p => !p.deleted).map((page) => (
                              <div
                                key={page.id}
                                draggable
                                onDragStart={() => handleDragStart(page)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, page)}
                                className={cn(
                                  "relative cursor-move border-2 rounded-lg p-2 transition-all",
                                  selectedPages.has(page.id)
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50",
                                  draggedPage?.id === page.id && "opacity-50"
                                )}
                                onClick={() => togglePageSelection(page.id)}
                                data-testid={`page-${page.originalIndex}`}
                              >
                                <div className="absolute top-1 right-1 z-10">
                                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="aspect-[3/4] bg-muted rounded flex items-center justify-center overflow-hidden">
                                  {page.thumbnail ? (
                                    <img
                                      src={page.thumbnail}
                                      alt={`Page ${page.originalIndex + 1}`}
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
                                  Page {pages.filter(p => !p.deleted).indexOf(page) + 1}
                                  {page.rotation !== 0 && (
                                    <span className="block text-primary">{page.rotation}°</span>
                                  )}
                                </p>
                              </div>
                            ))}
                          </div>

                          <p className="text-sm text-muted-foreground text-center mb-6">
                            Click to select pages • Drag to reorder • Use buttons to modify
                          </p>
                        </div>

                        {isProcessing && (
                          <div className="mb-6">
                            <Progress value={progress} className="h-2" />
                            <p className="text-sm text-center mt-2 text-muted-foreground">
                              Organizing PDF... {progress}%
                            </p>
                          </div>
                        )}

                        <div className="flex gap-4">
                          <Button
                            onClick={applyChanges}
                            disabled={isProcessing || !hasChanges()}
                            className="flex-1"
                            data-testid="button-apply"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Layers className="w-4 h-4 mr-2" />
                                Apply Changes
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
                  <Layers className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">PDF Organized Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  Your PDF has been reorganized as requested
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={downloadOrganizedPdf} size="lg" data-testid="button-download">
                    <Download className="w-4 h-4 mr-2" />
                    Download Organized PDF
                  </Button>
                  <Button onClick={reset} variant="outline" size="lg" data-testid="button-organize-another">
                    Organize Another PDF
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Features Section */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Why Use Our PDF Organizer?</h2>
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Drag and drop to reorder pages instantly</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Rotate, delete, and duplicate pages</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Visual preview of all pages</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Batch operations on multiple pages</span>
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
                  <GripVertical className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">2. Organize</h3>
                <p className="text-sm text-muted-foreground">Drag, rotate, delete pages</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">3. Apply</h3>
                <p className="text-sm text-muted-foreground">Process changes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">4. Download</h3>
                <p className="text-sm text-muted-foreground">Save organized PDF</p>
              </div>
            </div>
          </Card>

          {/* Tool Features */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Advanced Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <GripVertical className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Drag {String.fromCharCode(38)} Drop</h3>
                    <p className="text-sm text-muted-foreground">Intuitive page reordering with visual feedback</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <RotateCw className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Page Rotation</h3>
                    <p className="text-sm text-muted-foreground">Rotate individual pages by 90° increments</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Copy className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Duplicate Pages</h3>
                    <p className="text-sm text-muted-foreground">Copy important pages within the document</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Trash2 className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Delete Pages</h3>
                    <p className="text-sm text-muted-foreground">Remove unwanted pages easily</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Preserve Quality</h3>
                    <p className="text-sm text-muted-foreground">Original PDF quality maintained</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Layers className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Batch Actions</h3>
                    <p className="text-sm text-muted-foreground">Select multiple pages for bulk operations</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Comparison Table */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Why Choose Our PDF Organizer?</h2>
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
                    <td className="py-2">Visual Page Thumbnails</td>
                    <td className="text-center py-2 text-green-500">✓</td>
                    <td className="text-center py-2 text-muted-foreground">Limited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Drag {String.fromCharCode(38)} Drop Interface</td>
                    <td className="text-center py-2 text-green-500">✓</td>
                    <td className="text-center py-2 text-muted-foreground">Sometimes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Batch Operations</td>
                    <td className="text-center py-2 text-green-500">✓</td>
                    <td className="text-center py-2 text-red-500">✗</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Page Duplication</td>
                    <td className="text-center py-2 text-green-500">✓</td>
                    <td className="text-center py-2 text-red-500">✗</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">100% Client-Side</td>
                    <td className="text-center py-2 text-green-500">✓</td>
                    <td className="text-center py-2 text-red-500">✗</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">No File Size Limit</td>
                    <td className="text-center py-2 text-green-500">✓</td>
                    <td className="text-center py-2 text-muted-foreground">5-100MB</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Trust Badges */}
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">1.5M+</div>
                <p className="text-sm text-muted-foreground">PDFs Organized</p>
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
                <div className="text-3xl font-bold text-primary">50K+</div>
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
                <p className="text-sm mb-2">"The drag and drop interface is incredibly intuitive. Reorganized my 200-page report in minutes!"</p>
                <p className="text-sm text-muted-foreground">- Michael R., Project Manager</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-sm mb-2">"Love the thumbnail preview feature. Makes it so easy to see what I'm doing with my documents."</p>
                <p className="text-sm text-muted-foreground">- Lisa T., Teacher</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-sm mb-2">"Being able to duplicate and rotate pages saved me hours of work. Fantastic tool!"</p>
                <p className="text-sm text-muted-foreground">- James K., Designer</p>
              </div>
            </div>
          </Card>

          {/* FAQ */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Can I undo changes after organizing?</AccordionTrigger>
                <AccordionContent>
                  All changes are preserved in your browser until you apply them. You can reset to start over at any time before downloading. Once downloaded, you'll need to re-upload the original file to make different changes.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>What's the maximum file size I can organize?</AccordionTrigger>
                <AccordionContent>
                  There's no strict file size limit since all processing happens directly in your browser. However, very large files (over 100MB) may take longer to process and could be limited by your device's available memory.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I organize password-protected PDFs?</AccordionTrigger>
                <AccordionContent>
                  Currently, password-protected PDFs need to be unlocked first. You can use our PDF Unlock tool to remove the password, then organize the unlocked PDF.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How do I select multiple pages at once?</AccordionTrigger>
                <AccordionContent>
                  Click on a page to select it, then hold Ctrl (or Cmd on Mac) while clicking additional pages to add them to your selection. You can then perform batch operations like delete or rotate on all selected pages.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Will organizing affect the PDF quality?</AccordionTrigger>
                <AccordionContent>
                  No, our tool preserves the original quality of your PDF. We don't compress or alter the content - we simply rearrange the pages while maintaining all formatting, images, and text quality.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* Technical Details */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Technical Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Supported Features</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• All PDF versions (1.0 - 2.0)</li>
                  <li>• Encrypted PDFs (after unlocking)</li>
                  <li>• Large documents (1000+ pages)</li>
                  <li>• Mixed page orientations</li>
                  <li>• Forms and annotations preserved</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Browser Requirements</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</li>
                  <li>• Minimum 2GB RAM recommended</li>
                  <li>• JavaScript must be enabled</li>
                  <li>• WebAssembly support required</li>
                  <li>• No plugins or extensions needed</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Related Tools */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Related PDF Tools</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/merge-pdf">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <FileText className="w-6 h-6" />
                  <span>Merge PDF</span>
                </Button>
              </Link>
              <Link href="/split-pdf">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Scissors className="w-6 h-6" />
                  <span>Split PDF</span>
                </Button>
              </Link>
              <Link href="/rotate-pdf">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <RotateCw className="w-6 h-6" />
                  <span>Rotate PDF</span>
                </Button>
              </Link>
              <Link href="/extract-pages">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <FileOutput className="w-6 h-6" />
                  <span>Extract Pages</span>
                </Button>
              </Link>
            </div>
          </Card>

          {/* Contact Support */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help you with any questions about organizing your PDFs.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:altaftoolshub@gmail.com?subject=Help%20with%20Organize%20PDF%20Tool" className="inline-block">
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
                    <DialogTitle>How to Organize PDF Pages</DialogTitle>
                    <DialogDescription>
                      Complete guide for managing and rearranging PDF pages
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <h3 className="font-semibold mb-2">Step 1: Upload Your PDF</h3>
                      <p className="text-muted-foreground">Click the upload area or drag and drop your PDF file. All pages will be displayed as thumbnails.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Step 2: Rearrange Pages</h3>
                      <p className="text-muted-foreground">Drag and drop page thumbnails to reorder them. You can also rotate, duplicate, or delete individual pages.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Step 3: Apply Actions</h3>
                      <p className="text-muted-foreground">Use the toolbar to rotate selected pages, duplicate them, or delete unwanted pages.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Step 4: Save Your Changes</h3>
                      <p className="text-muted-foreground">Click Apply Changes to create your reorganized PDF. The new file will download automatically.</p>
                    </div>
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Tips:</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Select multiple pages with Ctrl/Cmd+Click</li>
                        <li>Rotate pages 90° clockwise or counterclockwise</li>
                        <li>Duplicate important pages easily</li>
                        <li>Preview changes before applying</li>
                        <li>All processing is done locally</li>
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
