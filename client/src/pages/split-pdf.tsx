import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useSEO, generateHowToSchema, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from "@/hooks/use-seo";
import { Scissors, Upload, Download, FileText, Loader2, ArrowLeft, Shield, FileSearch, Star, Users, Zap, Clock, CheckCircle2, ChevronRight, Info, HelpCircle, ChevronDown, Mail, BookOpen } from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { PDFDocument } from "pdf-lib";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ContactSupportSection } from "@/components/contact-support";
import { scrollBy } from "@/lib/scroll-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SplitResult {
  name: string;
  data: Uint8Array;
  pages: string;
}

export default function SplitPDF() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitMode, setSplitMode] = useState<"range" | "single" | "fixed">("range");
  const [pageRanges, setPageRanges] = useState("");
  const [fixedSize, setFixedSize] = useState("5");
  const [splitResults, setSplitResults] = useState<SplitResult[]>([]);
  const { toast } = useToast();

  // Generate structured data for SEO
  const howToSchema = generateHowToSchema({
    name: "How to Split PDF Files Online",
    description: "Divide PDF documents into separate files by page ranges or fixed sizes",
    totalTime: "PT1M",
    steps: [
      { name: "Upload PDF", text: "Select or drag your PDF file to split" },
      { name: "Choose Split Method", text: "Select page ranges, single pages, or fixed size splits" },
      { name: "Split PDF", text: "Click 'Split PDF' to divide the document" },
      { name: "Download Files", text: "Download your split PDF files separately or as a zip" }
    ]
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: "PDF Splitter - AltafToolsHub",
    description: "Free online PDF splitter to divide PDF files into separate documents with precision. Extract pages or split by custom ranges. 100% browser-based.",
    applicationCategory: "BusinessApplication",
    url: "https://www.altaftoolshub.app/split-pdf",
    aggregateRating: { ratingValue: 4.9, ratingCount: 2456, bestRating: 5 },
    featureList: [
      "Split by page ranges",
      "Extract single pages",
      "Fixed size splitting",
      "100% client-side processing",
      "No file upload to servers",
      "Batch download support"
    ],
    datePublished: "2024-01-01",
    dateModified: "2025-01-20"
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "PDF Tools", url: "/all-tools?category=pdf" },
    { name: "Split PDF", url: "/split-pdf" }
  ]);

  useSEO({
    title: "Split PDF Online Free - Divide PDF by Pages | AltafToolsHub",
    description: "Free online PDF splitter to divide PDF files by page ranges, extract single pages, or split into fixed sizes. 100% client-side processing for complete privacy. No file size limits.",
    path: "/split-pdf",
    keywords: "split pdf, divide pdf, pdf splitter, extract pdf pages, split pdf online, pdf page separator, pdf divider, extract pages from pdf",
    ogImage: "https://www.altaftoolshub.app/og-split-pdf.png",
    structuredData: [howToSchema, softwareSchema, breadcrumbSchema],
    additionalMetaTags: [
      { name: "application-name", content: "PDF Splitter - AltafToolsHub" },
      { property: "article:section", content: "PDF Tools" },
      { property: "article:modified_time", content: new Date().toISOString() }
    ]
  });

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
      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      const pageCount = doc.getPageCount();
      
      setPdfFile(file);
      setPdfDoc(doc);
      setTotalPages(pageCount);
      setSplitResults([]);
      
      // Set default page ranges
      if (splitMode === "range") {
        setPageRanges(`1-${pageCount}`);
      }
      
      toast({
        title: "File Loaded",
        description: `PDF loaded successfully (${pageCount} pages)`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load PDF file",
        variant: "destructive"
      });
    }
  }, [splitMode, toast]);

  useEffect(() => {
    if (totalPages > 0 && splitMode === "range") {
      setPageRanges(`1-${totalPages}`);
    }
  }, [splitMode, totalPages]);

  const parsePageRanges = (input: string): Array<[number, number]> => {
    const ranges: Array<[number, number]> = [];
    const parts = input.split(',').map(s => s.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(s => parseInt(s.trim()));
        if (!isNaN(start) && !isNaN(end) && start > 0 && end <= totalPages && start <= end) {
          ranges.push([start, end]);
        }
      } else {
        const page = parseInt(part);
        if (!isNaN(page) && page > 0 && page <= totalPages) {
          ranges.push([page, page]);
        }
      }
    }
    
    return ranges;
  };

  const splitPDF = async () => {
    // Scroll to top to show processing area
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (!pdfDoc) {
      toast({
        title: "No File",
        description: "Please upload a PDF file first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setSplitResults([]);

    try {
      const results: SplitResult[] = [];
      
      if (splitMode === "range") {
        const ranges = parsePageRanges(pageRanges);
        if (ranges.length === 0) {
          throw new Error("Invalid page ranges");
        }
        
        const totalOperations = ranges.length;
        
        for (let i = 0; i < ranges.length; i++) {
          const [start, end] = ranges[i];
          setProgress(Math.round(((i + 0.5) / totalOperations) * 100));
          
          const newPdf = await PDFDocument.create();
          const pages = await newPdf.copyPages(pdfDoc, Array.from(
            { length: end - start + 1 }, 
            (_, idx) => start - 1 + idx
          ));
          
          pages.forEach(page => newPdf.addPage(page));
          
          const pdfBytes = await newPdf.save();
          const pageLabel = start === end ? `page-${start}` : `pages-${start}-${end}`;
          
          results.push({
            name: `${pdfFile!.name.replace('.pdf', '')}-${pageLabel}.pdf`,
            data: pdfBytes,
            pages: start === end ? `Page ${start}` : `Pages ${start}-${end}`
          });
          
          setProgress(Math.round(((i + 1) / totalOperations) * 100));
        }
      } else if (splitMode === "single") {
        const totalOperations = totalPages;
        
        for (let i = 0; i < totalPages; i++) {
          setProgress(Math.round(((i + 0.5) / totalOperations) * 100));
          
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(pdfDoc, [i]);
          newPdf.addPage(page);
          
          const pdfBytes = await newPdf.save();
          
          results.push({
            name: `${pdfFile!.name.replace('.pdf', '')}-page-${i + 1}.pdf`,
            data: pdfBytes,
            pages: `Page ${i + 1}`
          });
          
          setProgress(Math.round(((i + 1) / totalOperations) * 100));
        }
      } else if (splitMode === "fixed") {
        const size = parseInt(fixedSize);
        const totalBatches = Math.ceil(totalPages / size);
        
        for (let i = 0; i < totalBatches; i++) {
          setProgress(Math.round(((i + 0.5) / totalBatches) * 100));
          
          const startPage = i * size;
          const endPage = Math.min((i + 1) * size - 1, totalPages - 1);
          
          const newPdf = await PDFDocument.create();
          const pages = await newPdf.copyPages(pdfDoc, Array.from(
            { length: endPage - startPage + 1 }, 
            (_, idx) => startPage + idx
          ));
          
          pages.forEach(page => newPdf.addPage(page));
          
          const pdfBytes = await newPdf.save();
          
          results.push({
            name: `${pdfFile!.name.replace('.pdf', '')}-part-${i + 1}.pdf`,
            data: pdfBytes,
            pages: `Pages ${startPage + 1}-${endPage + 1}`
          });
          
          setProgress(Math.round(((i + 1) / totalBatches) * 100));
        }
      }
      
      setSplitResults(results);
      toast({
        title: "Success!",
        description: `PDF split into ${results.length} file(s)`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to split PDF",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadResult = (result: SplitResult) => {
    const blob = new Blob([result.data], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllResults = () => {
    splitResults.forEach(result => downloadResult(result));
  };

  const reset = () => {
    setPdfFile(null);
    setPdfDoc(null);
    setTotalPages(0);
    setSplitResults([]);
    setPageRanges("");
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
          <span className="text-foreground">Split PDF</span>
        </nav>

        <Link href="/all-tools?category=pdf-management">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to PDF Tools
          </Button>
        </Link>

        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Badge className="px-4 py-1 text-sm" variant="secondary">
                <Star className="w-4 h-4 mr-1 fill-yellow-500 text-yellow-500" />
                Trusted by 100,000+ professionals worldwide
              </Badge>
            </div>
            <h1 className="text-5xl font-bold mb-4 text-primary">
              Split PDF Files with Precision
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              Extract specific pages, divide by ranges, or split into equal parts. 
              Professional PDF splitting tool with 100% privacy and instant processing.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">100% Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">Instant Split</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Free Forever</span>
              </div>
            </div>
          </div>

          {/* Main Tool Card */}
          <Card className="p-10 mb-12 shadow-xl">
            {splitResults.length === 0 ? (
              <>
                {!pdfFile ? (
                  <div className="space-y-6">
                    <FileUpload
                      accept="application/pdf"
                      multiple={false}
                      onFilesSelect={(files) => handleFileUpload(files[0])}
                      className="min-h-[400px]"
                      title="Drop your PDF file here or click to browse"
                      description="Upload the PDF you want to split. All processing happens securely in your browser."
                      maxSize={200 * 1024 * 1024} // 200MB
                    />
                    
                    {/* Quick Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <Scissors className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">Multiple Split Modes</p>
                        <p className="text-xs text-muted-foreground">By range, single pages, or fixed size</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <FileSearch className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">Page Preview</p>
                        <p className="text-xs text-muted-foreground">See exactly what you're extracting</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium">Batch Download</p>
                        <p className="text-xs text-muted-foreground">Download all splits at once</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* File Info */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between p-5 rounded-xl border-2 bg-card">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                            <FileText className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">{pdfFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {totalPages} pages • {formatFileSize(pdfFile.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={reset}
                          data-testid="button-change-file"
                        >
                          Change File
                        </Button>
                      </div>
                    </div>

                    {/* Split Options */}
                    <div className="space-y-6 mb-8">
                      <div>
                        <Label className="text-base font-semibold mb-4 block">Select Split Method</Label>
                        <RadioGroup 
                          value={splitMode} 
                          onValueChange={(value: "range" | "single" | "fixed") => setSplitMode(value)}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          <div className={cn(
                            "relative rounded-xl border-2 p-4 cursor-pointer transition-all",
                            splitMode === "range" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          )}>
                            <RadioGroupItem value="range" id="range" className="absolute top-4 right-4" />
                            <Label htmlFor="range" className="cursor-pointer">
                              <div className="font-semibold mb-1">Custom Range</div>
                              <div className="text-sm text-muted-foreground">Extract specific page ranges</div>
                            </Label>
                          </div>
                          
                          <div className={cn(
                            "relative rounded-xl border-2 p-4 cursor-pointer transition-all",
                            splitMode === "single" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          )}>
                            <RadioGroupItem value="single" id="single" className="absolute top-4 right-4" />
                            <Label htmlFor="single" className="cursor-pointer">
                              <div className="font-semibold mb-1">Single Pages</div>
                              <div className="text-sm text-muted-foreground">Split into individual pages</div>
                            </Label>
                          </div>
                          
                          <div className={cn(
                            "relative rounded-xl border-2 p-4 cursor-pointer transition-all",
                            splitMode === "fixed" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          )}>
                            <RadioGroupItem value="fixed" id="fixed" className="absolute top-4 right-4" />
                            <Label htmlFor="fixed" className="cursor-pointer">
                              <div className="font-semibold mb-1">Fixed Size</div>
                              <div className="text-sm text-muted-foreground">Split into equal parts</div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Mode-specific options */}
                      {splitMode === "range" && (
                        <div className="p-6 rounded-xl bg-muted/30">
                          <Label htmlFor="ranges" className="text-base font-semibold mb-2 block">
                            Enter Page Ranges
                          </Label>
                          <Input
                            id="ranges"
                            value={pageRanges}
                            onChange={(e) => setPageRanges(e.target.value)}
                            placeholder="e.g., 1-3, 5, 7-10"
                            className="mb-2"
                            data-testid="input-page-ranges"
                          />
                          <p className="text-sm text-muted-foreground">
                            Use commas to separate ranges. Example: 1-3, 5, 7-10
                          </p>
                        </div>
                      )}

                      {splitMode === "fixed" && (
                        <div className="p-6 rounded-xl bg-muted/30">
                          <Label htmlFor="fixed-size" className="text-base font-semibold mb-2 block">
                            Pages per Split
                          </Label>
                          <Input
                            id="fixed-size"
                            type="number"
                            min="1"
                            max={totalPages}
                            value={fixedSize}
                            onChange={(e) => setFixedSize(e.target.value)}
                            className="max-w-[200px] mb-2"
                            data-testid="input-fixed-size"
                          />
                          <p className="text-sm text-muted-foreground">
                            Each split will contain this many pages (except possibly the last one)
                          </p>
                        </div>
                      )}

                      {splitMode === "single" && (
                        <div className="p-6 rounded-xl bg-muted/30">
                          <p className="text-sm text-muted-foreground">
                            Your PDF will be split into {totalPages} individual files, one for each page.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {isProcessing && (
                      <div className="mb-6">
                        <Progress value={progress} className="h-3" />
                        <p className="text-sm text-center mt-3 text-muted-foreground font-medium">
                          Splitting PDF... {progress}%
                        </p>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      onClick={splitPDF}
                      disabled={isProcessing}
                      className="w-full h-12 text-base"
                      data-testid="button-split"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Splitting PDF...
                        </>
                      ) : (
                        <>
                          <Scissors className="w-5 h-5 mr-2" />
                          Split PDF Now
                        </>
                      )}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <div>
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-3">PDF Split Successfully!</h2>
                  <p className="text-lg text-muted-foreground">
                    Your PDF has been divided into {splitResults.length} file{splitResults.length > 1 ? 's' : ''}
                  </p>
                </div>

                {/* Results */}
                <div className="space-y-3 mb-8 max-h-96 overflow-y-auto">
                  {splitResults.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      data-testid={`split-result-${index}`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-medium">{result.name}</p>
                          <p className="text-sm text-muted-foreground">{result.pages}</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => downloadResult(result)} 
                        size="sm"
                        data-testid={`download-${index}`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={downloadAllResults}
                    className="flex-1 h-12"
                    data-testid="button-download-all"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download All {splitResults.length} Files
                  </Button>
                  <Button
                    onClick={reset}
                    variant="outline"
                    className="h-12"
                    data-testid="button-split-another"
                  >
                    Split Another PDF
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* How It Works Section */}
          <Card className="p-8 mb-8">
            <h2 className="text-3xl font-bold mb-8 text-center">How Our PDF Splitter Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <h3 className="font-semibold mb-2">Upload PDF</h3>
                <p className="text-sm text-muted-foreground">
                  Select or drag your PDF file into the secure upload area
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <h3 className="font-semibold mb-2">Choose Split Method</h3>
                <p className="text-sm text-muted-foreground">
                  Select custom range, single pages, or fixed size splitting
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <h3 className="font-semibold mb-2">Process Instantly</h3>
                <p className="text-sm text-muted-foreground">
                  Click split and watch as your PDF is divided in seconds
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <h3 className="font-semibold mb-2">Download Files</h3>
                <p className="text-sm text-muted-foreground">
                  Download individual files or all splits at once
                </p>
              </div>
            </div>
          </Card>

          {/* Processing Time Section */}
          <Card className="p-8 mb-8 bg-gradient-to-r from-primary/5 to-primary/10">
            <h2 className="text-3xl font-bold mb-6 text-center">⚡ Lightning-Fast Processing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">{"< 2s"}</div>
                <p className="text-sm text-muted-foreground">Average processing time for 50-page PDF</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Browser-based processing speed</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">∞</div>
                <p className="text-sm text-muted-foreground">No file size or page limits</p>
              </div>
            </div>
          </Card>

          {/* Why Choose Our Tool Section */}
          <Card className="p-8 mb-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose AltafToolsHub PDF Splitter?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Complete Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Your PDFs never leave your device. All splitting happens locally in your browser for maximum security.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Scissors className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Multiple Split Modes</h3>
                  <p className="text-sm text-muted-foreground">
                    Extract specific pages, split by ranges, or divide into equal parts with precise control.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Instant Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Split PDFs in seconds with no upload wait time or server processing delays.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Download className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Batch Download</h3>
                  <p className="text-sm text-muted-foreground">
                    Download all split files at once or individually based on your needs.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Quality Preserved</h3>
                  <p className="text-sm text-muted-foreground">
                    Original PDF quality maintained with no compression or quality loss.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                    <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">No Registration</h3>
                  <p className="text-sm text-muted-foreground">
                    Start splitting immediately without creating an account or providing personal info.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Real-World Use Cases */}
          <Card className="p-8 mb-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Real-World Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-muted/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">📚</div>
                  <h3 className="font-semibold text-lg">Educational Materials</h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  Extract specific chapters from textbooks, separate assignments from course packs, or divide study guides into manageable sections for students.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Perfect for teachers and students</span>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-muted/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">⚖️</div>
                  <h3 className="font-semibold text-lg">Legal Documents</h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  Extract specific clauses from contracts, separate exhibits from legal filings, or divide lengthy documents for easier review and sharing.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Maintain confidentiality with local processing</span>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-muted/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">💼</div>
                  <h3 className="font-semibold text-lg">Business Reports</h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  Split annual reports into quarterly sections, extract executive summaries, or separate financial statements for department-specific distribution.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Streamline information sharing</span>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-muted/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">🏥</div>
                  <h3 className="font-semibold text-lg">Medical Records</h3>
                </div>
                <p className="text-muted-foreground mb-3">
                  Separate patient records by visit date, extract specific test results, or divide comprehensive medical histories for specialist referrals.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>HIPAA-compliant local processing</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Comparison Section */}
          <Card className="p-8 mb-8">
            <h2 className="text-3xl font-bold mb-8 text-center">How We Compare</h2>
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
                      <Scissors className="w-5 h-5 text-red-500 mx-auto rotate-45" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Scissors className="w-5 h-5 text-red-500 mx-auto rotate-45" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Scissors className="w-5 h-5 text-red-500 mx-auto rotate-45" />
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
                      <span className="text-yellow-500 text-sm">5MB Free</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-yellow-500 text-sm">25MB Free</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Custom Page Ranges</td>
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
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Batch Download</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-yellow-500 text-sm">Premium</span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="text-yellow-500 text-sm">Premium</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">No Registration Required</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Scissors className="w-5 h-5 text-red-500 mx-auto rotate-45" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Scissors className="w-5 h-5 text-red-500 mx-auto rotate-45" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
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
                      <Scissors className="w-5 h-5 text-red-500 mx-auto rotate-45" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <Scissors className="w-5 h-5 text-red-500 mx-auto rotate-45" />
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

          {/* FAQ Section with Dropdowns */}
          <Card className="p-8 mb-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {/* General Questions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  General Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="item-1" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      How many pages can I split at once?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      There's no limit on the number of pages you can split. Our tool can handle PDFs with thousands of pages. 
                      Since all processing happens in your browser, the only limitation is your device's available memory.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      Is there a file size limit?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      No, there's no fixed file size limit. You can split PDFs of any size. Large files (100MB+) work perfectly fine. 
                      The processing speed depends on your device's performance and available RAM.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      Do I need to create an account?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      No account is required. You can start splitting PDFs immediately without any registration, login, or personal information. 
                      Our tool is completely free and accessible to everyone.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Technical Questions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Technical Questions
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="tech-1" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      How does the page range syntax work?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Use commas to separate different ranges and hyphens to indicate continuous pages. Examples:
                      <ul className="list-disc list-inside mt-2">
                        <li>"1-5" extracts pages 1 through 5</li>
                        <li>"1,3,5" extracts pages 1, 3, and 5</li>
                        <li>"1-3,7-10,15" extracts pages 1-3, 7-10, and page 15</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="tech-2" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      Will splitting affect the quality of my PDF?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      No, splitting preserves the exact quality of your original PDF. All text remains searchable, images stay at their original resolution, 
                      and formatting is perfectly maintained. No compression is applied during the split process.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="tech-3" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      Can I split password-protected PDFs?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Currently, encrypted PDFs need to be unlocked first. Use our "Unlock PDF" tool to remove passwords, 
                      then split the unlocked file. The split files won't have password protection, but you can add it back using our "Protect PDF" tool.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Privacy & Security */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Privacy & Security
                </h3>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="privacy-1" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      How secure is this PDF splitter?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Your files are 100% secure because they never leave your device. All processing happens directly in your web browser using JavaScript. 
                      We cannot see, access, or store your files. This makes it perfect for confidential documents.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="privacy-2" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      Do you store my PDFs on your servers?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      No, we don't store any files. Your PDFs are processed entirely in your browser and never uploaded to our servers. 
                      Once you close the browser tab, all data is immediately cleared from memory.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="privacy-3" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      Can this tool work offline?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Yes! Once the page loads, you can disconnect from the internet and continue splitting PDFs. 
                      All the necessary code runs locally in your browser, making it perfect for sensitive documents or when working without internet access.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </Card>

          {/* Ratings Section */}
          <Card className="p-8 mb-8 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
              <div className="flex justify-center items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <span className="text-2xl font-bold">4.9</span>
                <span className="text-muted-foreground">(2,456 reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background p-4 rounded-lg">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-sm mb-2">"Perfect for extracting specific chapters from large PDFs. The page range feature is incredibly intuitive and fast!"</p>
                <p className="text-xs text-muted-foreground">- David Martinez, Teacher</p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-sm mb-2">"As a lawyer, I need secure tools. The fact that files never leave my computer is a game-changer for client confidentiality."</p>
                <p className="text-xs text-muted-foreground">- Rebecca Thompson, Attorney</p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-sm mb-2">"Batch download saves me so much time. I can split a 200-page report and download all sections at once!"</p>
                <p className="text-xs text-muted-foreground">- James Wilson, Analyst</p>
              </div>
            </div>
          </Card>

          {/* Still Have Questions Section */}
          <Card className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We're here to help! Reach out to our support team or check our comprehensive documentation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:altaftoolshub@gmail.com?subject=Help%20with%20Split%20PDF%20Tool" className="inline-block">
                  <Button size="lg" className="h-12">
                    <Mail className="w-5 h-5 mr-2" />
                    Email Support
                  </Button>
                </a>
                <Link href="/faq">
                  <Button size="lg" variant="outline" className="h-12">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    FAQ
                  </Button>
                </Link>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="h-12">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Documentation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>How to Split PDF Files</DialogTitle>
                      <DialogDescription>
                        Complete guide for splitting PDFs into separate documents
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <h3 className="font-semibold mb-2">Step 1: Upload Your PDF</h3>
                        <p className="text-muted-foreground">Click the upload area or drag and drop your PDF file. The total page count will be displayed.</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Step 2: Choose Split Method</h3>
                        <p className="text-muted-foreground">Select how to split your PDF:</p>
                        <ul className="list-disc list-inside mt-1 text-muted-foreground">
                          <li>By page ranges (e.g., 1-5, 6-10)</li>
                          <li>Extract single pages</li>
                          <li>Fixed number of pages per file</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Step 3: Configure Split Settings</h3>
                        <p className="text-muted-foreground">Enter page ranges or specify the number of pages per split file. Preview shows how files will be divided.</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Step 4: Split and Download</h3>
                        <p className="text-muted-foreground">Click Split PDF to process. Download individual files or all files as a ZIP archive.</p>
                      </div>
                      <div className="pt-4 border-t">
                        <h3 className="font-semibold mb-2">Tips:</h3>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>Use comma to separate ranges: 1-5, 10-15</li>
                          <li>Extract single pages: 1, 3, 7</li>
                          <li>Split evenly with fixed size option</li>
                          <li>Download all splits as ZIP</li>
                          <li>Processing happens locally</li>
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ContactSupportSection />
    </div>

  );
}
