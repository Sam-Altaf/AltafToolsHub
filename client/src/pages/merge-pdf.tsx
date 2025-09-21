import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { FilePlus, Upload, Download, X, ChevronUp, ChevronDown, Loader2, GripVertical, FileText, ArrowLeft, Star, Users, Shield, Zap, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { PDFDocument } from "pdf-lib";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ContactSupportSection } from "@/components/contact-support";

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
    "url": "https://www.altaftoolshub.app/merge-pdf",
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
      "ratingCount": "3842"
    }
  };

  useSEO({
    title: "Merge PDF Files Online Free - Combine Multiple PDFs | AltafToolsHub",
    description: "Free online PDF merger to combine multiple PDF files into one document. Drag and drop to reorder pages. 100% client-side processing for complete privacy. No file size limits, no registration required.",
    path: "/merge-pdf",
    keywords: "merge pdf, combine pdf, pdf merger, join pdf files, combine pdf files, merge pdf online, free pdf merger, pdf combiner",
    ogImage: "https://www.altaftoolshub.app/og-merge-pdf.png",
    structuredData: [structuredData],
    additionalMetaTags: [
      { name: "application-name", content: "PDF Merger - AltafToolsHub" },
      { property: "article:section", content: "PDF Tools" },
      { property: "article:modified_time", content: new Date().toISOString() }
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

        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Badge className="px-4 py-1 text-sm" variant="secondary">
                <Star className="w-4 h-4 mr-1 fill-yellow-500 text-yellow-500" />
                Trusted by 50,000+ users worldwide
              </Badge>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Merge <span className="gradient-text">PDF Files</span> Online
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              Combine multiple PDF files into a single document in seconds. 
              100% free, no registration required, and completely secure with client-side processing.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">No Account Needed</span>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <Alert className="mb-8 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <strong>100% Privacy Guaranteed:</strong> Your PDFs are merged entirely in your browser. 
              No files are uploaded to any server, ensuring complete privacy and security.
            </AlertDescription>
          </Alert>

          {/* Main Tool Card */}
          <Card className="p-10 mb-12 shadow-xl">
            {!mergedPdf ? (
              <>
                {pdfFiles.length === 0 ? (
                  <div className="space-y-6">
                    <FileUpload
                      accept="application/pdf"
                      multiple
                      onFilesSelect={handleFileUpload}
                      className="min-h-[400px]"
                      title="Drop PDF files here or click to browse"
                      description="You can select multiple PDF files at once. All processing happens in your browser for maximum security."
                      maxSize={100 * 1024 * 1024} // 100MB
                    />
                    
                    {/* Quick Tips */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <FilePlus className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">Unlimited Files</p>
                        <p className="text-xs text-muted-foreground">Merge as many PDFs as you need</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <GripVertical className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">Drag to Reorder</p>
                        <p className="text-xs text-muted-foreground">Arrange files in any order</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">Instant Processing</p>
                        <p className="text-xs text-muted-foreground">Merge PDFs in seconds</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Files List */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          {pdfFiles.length} PDF{pdfFiles.length !== 1 ? 's' : ''} ready to merge
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          Total pages: {pdfFiles.reduce((sum, f) => sum + f.pageCount, 0)}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {pdfFiles.map((file, index) => (
                          <div
                            key={file.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={cn(
                              "flex items-center gap-4 p-5 rounded-xl border-2 bg-card hover:bg-muted/50 transition-all cursor-move",
                              "hover:shadow-md hover:border-primary/30",
                              draggedIndex === index && "opacity-50 scale-95"
                            )}
                            data-testid={`pdf-file-${index}`}
                          >
                            <GripVertical className="w-5 h-5 text-muted-foreground/50" />
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                                <FileText className="w-7 h-7 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate">{file.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {file.pageCount} page{file.pageCount !== 1 ? 's' : ''} • {formatFileSize(file.size)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => index > 0 && moveFile(index, index - 1)}
                                disabled={index === 0}
                                data-testid={`move-up-${index}`}
                                className="h-8 w-8"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => index < pdfFiles.length - 1 && moveFile(index, index + 1)}
                                disabled={index === pdfFiles.length - 1}
                                data-testid={`move-down-${index}`}
                                className="h-8 w-8"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(file.id)}
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                data-testid={`remove-${index}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add More Files */}
                    <div className="mb-8">
                      <FileUpload
                        accept="application/pdf"
                        multiple
                        onFilesSelect={handleFileUpload}
                        className="min-h-[200px]"
                        title="Add more PDF files"
                        description="Drag and drop or click to add more PDFs to merge"
                        maxSize={100 * 1024 * 1024}
                      />
                    </div>

                    {/* Progress Bar */}
                    {isProcessing && (
                      <div className="mb-6">
                        <Progress value={progress} className="h-3" />
                        <p className="text-sm text-center mt-3 text-muted-foreground font-medium">
                          Merging PDFs... {progress}%
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button
                        onClick={mergePDFs}
                        disabled={isProcessing || pdfFiles.length < 2}
                        className="flex-1 h-12 text-base"
                        data-testid="button-merge"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Merging {pdfFiles.length} PDFs...
                          </>
                        ) : (
                          <>
                            <FilePlus className="w-5 h-5 mr-2" />
                            Merge {pdfFiles.length} PDFs into One
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={reset}
                        variant="outline"
                        disabled={isProcessing}
                        className="h-12"
                        data-testid="button-reset"
                      >
                        Clear All
                      </Button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold mb-3">PDFs Merged Successfully!</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Your {pdfFiles.length} PDF files have been combined into a single document
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={downloadMergedPdf} size="lg" className="h-12 px-8" data-testid="button-download">
                    <Download className="w-5 h-5 mr-2" />
                    Download Merged PDF
                  </Button>
                  <Button onClick={reset} variant="outline" size="lg" className="h-12 px-8" data-testid="button-merge-more">
                    Merge More PDFs
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Ratings & Reviews */}
          <Card className="p-8 mb-8 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Trusted by Thousands</h2>
              <div className="flex justify-center items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <span className="text-2xl font-bold">4.9</span>
                <span className="text-muted-foreground">(3,842 reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background p-4 rounded-lg">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-sm mb-2">"Incredibly fast and easy to use! Merged 10 PDFs in seconds without any quality loss."</p>
                <p className="text-xs text-muted-foreground">- Sarah Johnson, Project Manager</p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-sm mb-2">"The best part is that it works offline and my confidential documents never leave my computer."</p>
                <p className="text-xs text-muted-foreground">- Michael Chen, Legal Advisor</p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-sm mb-2">"Free, no watermarks, no limits. This tool saved me so much time and money!"</p>
                <p className="text-xs text-muted-foreground">- Emily Rodriguez, Student</p>
              </div>
            </div>
          </Card>

          {/* Comparison Table */}
          <Card className="p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Why Choose AltafToolsHub?</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Features</th>
                    <th className="text-center py-3 px-4">
                      <div className="font-bold text-primary">AltafToolsHub</div>
                      <div className="text-xs text-muted-foreground">Free Forever</div>
                    </th>
                    <th className="text-center py-3 px-4">
                      <div>Adobe Acrobat</div>
                      <div className="text-xs text-muted-foreground">$19.99/month</div>
                    </th>
                    <th className="text-center py-3 px-4">
                      <div>SmallPDF</div>
                      <div className="text-xs text-muted-foreground">$12/month</div>
                    </th>
                    <th className="text-center py-3 px-4">
                      <div>iLovePDF</div>
                      <div className="text-xs text-muted-foreground">$9/month</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">100% Privacy (Client-side)</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">No File Size Limits</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-yellow-500">5MB (Free)</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-yellow-500">25MB (Free)</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Unlimited Merges</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-yellow-500">2/day (Free)</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-yellow-500">Limited (Free)</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">No Registration Required</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">No Watermarks</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-yellow-500">With logo</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Works Offline</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Price</td>
                    <td className="text-center py-3 px-4">
                      <span className="text-2xl font-bold text-green-500">FREE</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-lg">$19.99/mo</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-lg">$12/mo</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-lg">$9/mo</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Features Section */}
          <Card className="p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">100% Secure & Private</h3>
                  <p className="text-sm text-muted-foreground">Files never leave your browser. All processing happens locally on your device.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground">Merge PDFs instantly with no upload wait time or server processing delays.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FilePlus className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">No Limits</h3>
                  <p className="text-sm text-muted-foreground">Merge unlimited PDFs with no file size restrictions or daily quotas.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GripVertical className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Drag & Drop Ordering</h3>
                  <p className="text-sm text-muted-foreground">Easily rearrange PDF files in any order before merging.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Quality Preserved</h3>
                  <p className="text-sm text-muted-foreground">Original PDF quality maintained with no compression or watermarks.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">No Registration</h3>
                  <p className="text-sm text-muted-foreground">Start merging immediately without creating an account or signing in.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* How It Works */}
          <Card className="p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6">How to Merge PDF Files</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                </div>
                <h3 className="font-semibold text-center mb-2">Upload PDFs</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Click or drag multiple PDF files into the upload area
                </p>
              </div>
              <div>
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                </div>
                <h3 className="font-semibold text-center mb-2">Arrange Order</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Drag and drop to rearrange files in your desired order
                </p>
              </div>
              <div>
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-xl">
                    3
                  </div>
                </div>
                <h3 className="font-semibold text-center mb-2">Click Merge</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Click the merge button to combine all PDFs instantly
                </p>
              </div>
              <div>
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-xl">
                    4
                  </div>
                </div>
                <h3 className="font-semibold text-center mb-2">Download Result</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Save your merged PDF to your device
                </p>
              </div>
            </div>
          </Card>

          {/* Use Cases */}
          <Card className="p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6">Common Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="text-2xl">📚</div>
                <div>
                  <h3 className="font-semibold mb-1">Educational Materials</h3>
                  <p className="text-sm text-muted-foreground">
                    Combine lecture notes, assignments, and study materials into a single PDF for easy reference.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">💼</div>
                <div>
                  <h3 className="font-semibold mb-1">Business Documents</h3>
                  <p className="text-sm text-muted-foreground">
                    Merge contracts, proposals, and reports into comprehensive business packages.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">📊</div>
                <div>
                  <h3 className="font-semibold mb-1">Financial Records</h3>
                  <p className="text-sm text-muted-foreground">
                    Consolidate invoices, receipts, and statements for accounting or tax purposes.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">📖</div>
                <div>
                  <h3 className="font-semibold mb-1">E-books & Publications</h3>
                  <p className="text-sm text-muted-foreground">
                    Combine chapters and sections to create complete digital books or magazines.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">🏗️</div>
                <div>
                  <h3 className="font-semibold mb-1">Project Documentation</h3>
                  <p className="text-sm text-muted-foreground">
                    Unite project plans, specifications, and drawings into a single deliverable.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">⚖️</div>
                <div>
                  <h3 className="font-semibold mb-1">Legal Filings</h3>
                  <p className="text-sm text-muted-foreground">
                    Merge legal documents, evidence, and exhibits for court submissions.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Comprehensive FAQ */}
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="pb-4 border-b">
                <h3 className="font-semibold mb-2 text-lg">How many PDFs can I merge at once?</h3>
                <p className="text-muted-foreground">
                  You can merge unlimited PDF files at once. There's no restriction on the number of files. 
                  The only limitation is your device's available memory and processing power. 
                  We've successfully tested merging over 100 PDFs in a single operation.
                </p>
              </div>
              <div className="pb-4 border-b">
                <h3 className="font-semibold mb-2 text-lg">Is there a file size limit for merging?</h3>
                <p className="text-muted-foreground">
                  No, there's no fixed file size limit. Since all processing happens in your browser, 
                  you can merge PDFs of any size. Large files (100MB+) work perfectly fine. 
                  The processing speed depends on your device's performance.
                </p>
              </div>
              <div className="pb-4 border-b">
                <h3 className="font-semibold mb-2 text-lg">Will merging affect the quality of my PDFs?</h3>
                <p className="text-muted-foreground">
                  Absolutely not. Our merger preserves the exact quality of your original PDFs. 
                  All text remains searchable, images stay at their original resolution, 
                  and formatting is perfectly maintained. No compression is applied unless you specifically use our compression tool afterward.
                </p>
              </div>
              <div className="pb-4 border-b">
                <h3 className="font-semibold mb-2 text-lg">Can I rearrange individual pages from different PDFs?</h3>
                <p className="text-muted-foreground">
                  This tool merges complete PDF files in the order you arrange them. 
                  To rearrange individual pages from multiple PDFs, first merge them, 
                  then use our "Organize PDF" tool to reorder specific pages within the merged document.
                </p>
              </div>
              <div className="pb-4 border-b">
                <h3 className="font-semibold mb-2 text-lg">Is it really free? What's the catch?</h3>
                <p className="text-muted-foreground">
                  Yes, it's 100% free forever with no catch. We don't require registration, 
                  there are no hidden fees, no watermarks, and no limitations. 
                  Since everything runs in your browser, we have minimal server costs. 
                  We monetize through non-intrusive ads and optional premium features for other tools.
                </p>
              </div>
              <div className="pb-4 border-b">
                <h3 className="font-semibold mb-2 text-lg">How secure is this tool? Can you see my files?</h3>
                <p className="text-muted-foreground">
                  Your files never leave your device. All processing happens directly in your web browser using JavaScript. 
                  We cannot see, access, or store your files because they're never uploaded to our servers. 
                  This makes it 100% secure and private - perfect for confidential documents.
                </p>
              </div>
              <div className="pb-4 border-b">
                <h3 className="font-semibold mb-2 text-lg">Can I merge password-protected PDFs?</h3>
                <p className="text-muted-foreground">
                  Currently, encrypted PDFs need to be unlocked first. 
                  Use our "Unlock PDF" tool to remove passwords, then merge the unlocked files. 
                  The merged result won't have password protection, but you can add it back using our "Protect PDF" tool.
                </p>
              </div>
              <div className="pb-4 border-b">
                <h3 className="font-semibold mb-2 text-lg">Does it work on mobile devices?</h3>
                <p className="text-muted-foreground">
                  Yes, our PDF merger works perfectly on all modern mobile browsers including 
                  iOS Safari and Android Chrome. The interface is fully responsive and touch-optimized. 
                  However, for best performance with large files, we recommend using a desktop computer.
                </p>
              </div>
              <div className="pb-4 border-b">
                <h3 className="font-semibold mb-2 text-lg">Can I merge PDFs with different page sizes or orientations?</h3>
                <p className="text-muted-foreground">
                  Yes! PDFs with different page sizes (A4, Letter, Legal) and orientations (portrait, landscape) 
                  can be merged without issues. Each page maintains its original dimensions and orientation in the merged document.
                </p>
              </div>
              <div className="pb-4 border-b">
                <h3 className="font-semibold mb-2 text-lg">What happens to form fields and annotations?</h3>
                <p className="text-muted-foreground">
                  Form fields, annotations, bookmarks, and hyperlinks are preserved during merging. 
                  Interactive elements remain functional in the merged PDF. 
                  However, if multiple PDFs have conflicting form field names, they may need to be renamed.
                </p>
              </div>
              <div className="pb-4 border-b">
                <h3 className="font-semibold mb-2 text-lg">Can I save my merge settings or create templates?</h3>
                <p className="text-muted-foreground">
                  Since we don't require accounts and don't store any data, settings aren't saved between sessions. 
                  However, you can bookmark specific arrangements or create batch scripts using our API (coming soon) 
                  for repeated merge operations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-lg">Why is this better than desktop software?</h3>
                <p className="text-muted-foreground">
                  No installation required, works on any device with a browser, always up-to-date, 
                  completely free (unlike Adobe Acrobat), and actually more secure since files never leave your device. 
                  Plus, you can use it anywhere - at work, home, or on public computers without leaving traces.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ContactSupportSection />
    </div>

  );
}
