import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { Scissors, Upload, Download, FileText, Loader2, ArrowLeft, Shield, FileSearch } from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { PDFDocument } from "pdf-lib";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF Splitter - AltafToolsHub",
    "description": "Free online PDF splitter to divide PDF files into separate documents",
    "url": "https://www.altaftoolshub.com/split-pdf",
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
      "ratingCount": "1456"
    }
  };

  useSEO({
    title: "Split PDF Online Free - Divide PDF by Pages | AltafToolsHub",
    description: "Free online PDF splitter to divide PDF files by page ranges, extract single pages, or split into fixed sizes. 100% client-side processing for privacy.",
    path: "/split-pdf",
    keywords: "split pdf, divide pdf, pdf splitter, extract pdf pages, split pdf online, pdf page separator",
    ogImage: "https://www.altaftoolshub.com/og-split-pdf.png",
    structuredData: [structuredData],
    additionalMetaTags: [
      { name: "application-name", content: "PDF Splitter - AltafToolsHub" },
      { property: "article:section", content: "PDF Tools" }
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
    if (!pdfDoc || !pdfFile) {
      toast({
        title: "No file selected",
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
      let ranges: Array<[number, number]> = [];

      // Determine page ranges based on split mode
      if (splitMode === "range") {
        ranges = parsePageRanges(pageRanges);
        if (ranges.length === 0) {
          throw new Error("Invalid page ranges");
        }
      } else if (splitMode === "single") {
        // Split into individual pages
        for (let i = 1; i <= totalPages; i++) {
          ranges.push([i, i]);
        }
      } else if (splitMode === "fixed") {
        // Split by fixed page count
        const size = parseInt(fixedSize);
        for (let i = 1; i <= totalPages; i += size) {
          ranges.push([i, Math.min(i + size - 1, totalPages)]);
        }
      }

      // Process each range
      for (let i = 0; i < ranges.length; i++) {
        const [start, end] = ranges[i];
        setProgress(Math.round(((i + 0.5) / ranges.length) * 100));

        const newPdf = await PDFDocument.create();
        const pagesToCopy = [];
        for (let p = start - 1; p < end; p++) {
          pagesToCopy.push(p);
        }

        const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
        copiedPages.forEach(page => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        const baseName = pdfFile.name.replace('.pdf', '');
        
        results.push({
          name: `${baseName}_pages_${start}-${end}.pdf`,
          data: pdfBytes,
          pages: start === end ? `Page ${start}` : `Pages ${start}-${end}`
        });

        setProgress(Math.round(((i + 1) / ranges.length) * 100));
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

  const downloadAll = () => {
    splitResults.forEach((result, index) => {
      setTimeout(() => downloadResult(result), index * 200);
    });
  };

  const reset = () => {
    setPdfFile(null);
    setPdfDoc(null);
    setTotalPages(0);
    setSplitResults([]);
    setPageRanges("");
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

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Split <span className="gradient-text">PDF Files</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Divide PDF documents by page ranges, extract single pages, or split into fixed sizes.
              All processing happens locally in your browser.
            </p>
          </div>

          {/* Privacy Notice */}
          <Alert className="mb-6">
            <Shield className="w-4 h-4" />
            <AlertDescription>
              Your PDFs are split entirely in your browser. Files never leave your device.
            </AlertDescription>
          </Alert>

          <Card className="p-8 mb-8">
            {splitResults.length === 0 ? (
              <>
                {!pdfFile ? (
                  <FileUpload
                    accept="application/pdf"
                    onFileSelect={handleFileUpload}
                    className="h-48"
                    title="Drop PDF file here or click to select"
                    description="Select a PDF to split"
                  />
                ) : (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
                        <FileText className="w-8 h-8 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">{pdfFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {totalPages} page{totalPages !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={reset}
                          data-testid="button-change-file"
                        >
                          Change File
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="text-base mb-4 block">Split Mode</Label>
                        <RadioGroup value={splitMode} onValueChange={(value) => setSplitMode(value as any)}>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <RadioGroupItem value="range" id="range" />
                              <div className="flex-1">
                                <Label htmlFor="range" className="cursor-pointer">
                                  <div className="font-medium">Custom Ranges</div>
                                  <div className="text-sm text-muted-foreground">
                                    Specify page ranges (e.g., 1-3, 5, 7-10)
                                  </div>
                                </Label>
                                {splitMode === "range" && (
                                  <Input
                                    placeholder="e.g., 1-3, 5, 7-10"
                                    value={pageRanges}
                                    onChange={(e) => setPageRanges(e.target.value)}
                                    className="mt-2"
                                    data-testid="input-page-ranges"
                                  />
                                )}
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <RadioGroupItem value="single" id="single" />
                              <Label htmlFor="single" className="cursor-pointer">
                                <div className="font-medium">Extract All Pages</div>
                                <div className="text-sm text-muted-foreground">
                                  Save each page as a separate PDF file
                                </div>
                              </Label>
                            </div>

                            <div className="flex items-start gap-3">
                              <RadioGroupItem value="fixed" id="fixed" />
                              <div className="flex-1">
                                <Label htmlFor="fixed" className="cursor-pointer">
                                  <div className="font-medium">Fixed Page Count</div>
                                  <div className="text-sm text-muted-foreground">
                                    Split into files with fixed number of pages
                                  </div>
                                </Label>
                                {splitMode === "fixed" && (
                                  <Input
                                    type="number"
                                    min="1"
                                    max={totalPages}
                                    value={fixedSize}
                                    onChange={(e) => setFixedSize(e.target.value)}
                                    className="mt-2 w-32"
                                    data-testid="input-fixed-size"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      {isProcessing && (
                        <div>
                          <Progress value={progress} className="h-2" />
                          <p className="text-sm text-center mt-2 text-muted-foreground">
                            Splitting PDF... {progress}%
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={splitPDF}
                        disabled={isProcessing}
                        className="w-full"
                        size="lg"
                        data-testid="button-split"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Splitting...
                          </>
                        ) : (
                          <>
                            <Scissors className="w-4 h-4 mr-2" />
                            Split PDF
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <FileSearch className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">PDF Split Successfully!</h2>
                  <p className="text-muted-foreground">
                    Your PDF has been split into {splitResults.length} file{splitResults.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {splitResults.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      data-testid={`split-result-${index}`}
                    >
                      <FileText className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{result.name}</p>
                        <p className="text-xs text-muted-foreground">{result.pages}</p>
                      </div>
                      <Button
                        onClick={() => downloadResult(result)}
                        size="sm"
                        variant="outline"
                        data-testid={`download-${index}`}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button onClick={downloadAll} className="flex-1" data-testid="button-download-all">
                    <Download className="w-4 h-4 mr-2" />
                    Download All Files
                  </Button>
                  <Button onClick={reset} variant="outline" className="flex-1" data-testid="button-split-another">
                    Split Another PDF
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Features Section */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Why Use Our PDF Splitter?</h2>
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Three flexible split modes for any use case</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Extract specific pages or page ranges</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Split large PDFs into manageable sizes</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Batch download all split files at once</span>
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
                <p className="text-sm text-muted-foreground">Select the PDF to split</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileSearch className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">2. Choose Mode</h3>
                <p className="text-sm text-muted-foreground">Select how to split</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Scissors className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">3. Split PDF</h3>
                <p className="text-sm text-muted-foreground">Process the split</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">4. Download</h3>
                <p className="text-sm text-muted-foreground">Save split files</p>
              </div>
            </div>
          </Card>

          {/* FAQ */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">What split modes are available?</h3>
                <p className="text-sm text-muted-foreground">You can split by custom page ranges (e.g., 1-5, 7-10), extract all pages individually, or split into files with a fixed number of pages.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Can I extract specific pages?</h3>
                <p className="text-sm text-muted-foreground">Yes! Use the custom ranges mode to specify exact pages or page ranges you want to extract, separated by commas.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">What happens to the original PDF?</h3>
                <p className="text-sm text-muted-foreground">The original PDF remains unchanged. The tool creates new PDF files based on your split settings.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Is there a limit on PDF size?</h3>
                <p className="text-sm text-muted-foreground">No fixed limit. The tool can handle large PDFs, limited only by your browser's available memory.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}