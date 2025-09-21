import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { Hash, Upload, Download, FileText, Loader2, ArrowLeft, Shield } from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import * as pdfjsLib from 'pdfjs-dist';
import { ContactSupportSection } from "@/components/contact-support";

// Configure PDF.js worker - using local worker for privacy
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type Format = 'numeric' | 'page-of-total' | 'roman' | 'alphabetic';

export default function AddPageNumber() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [position, setPosition] = useState<Position>('bottom-center');
  const [format, setFormat] = useState<Format>('page-of-total');
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState([12]);
  const [margin, setMargin] = useState([30]);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [numberedPdf, setNumberedPdf] = useState<Uint8Array | null>(null);
  const { toast } = useToast();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Add Page Numbers to PDF - AltafToolsHub",
    "description": "Free online tool to add page numbers to PDF documents",
    "url": "https://www.altaftoolshub.app/add-page-number",
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
      "ratingCount": "1265"
    }
  };

  useSEO({
    title: "Add Page Numbers to PDF Online Free - Customize Position & Format | AltafToolsHub",
    description: "Free online tool to add page numbers to PDF documents. Choose position, format, font size, and custom text. 100% client-side processing.",
    path: "/add-page-number",
    keywords: "add page numbers pdf, pdf page numbering, number pdf pages, pdf page counter, page numbers tool",
    ogImage: "https://www.altaftoolshub.app/og-add-page-number.png",
    structuredData: [structuredData],
    additionalMetaTags: [
      { name: "application-name", content: "PDF Page Number Tool - AltafToolsHub" },
      { property: "article:section", content: "PDF Tools" }
    ]
  });

  const generatePreview = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.0 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return "";
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport,
        intent: 'display'
      } as any).promise;
      
      // Draw preview page number
      context.fillStyle = 'red';
      context.font = `${fontSize[0] * 2}px Arial`;
      const text = formatPageNumber(1, 10);
      const coords = getPositionCoordinates(canvas.width, canvas.height, context.measureText(text).width);
      context.fillText(text, coords.x, coords.y);
      
      return canvas.toDataURL('image/jpeg', 0.9);
    } catch (error) {
      console.error('Error generating preview:', error);
      return "";
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
      setNumberedPdf(null);
      
      // Generate preview
      setProgress(50);
      const preview = await generatePreview(file);
      setPreviewUrl(preview);
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
  }, [fontSize, toast]);

  const formatPageNumber = (pageNum: number, total: number): string => {
    let formatted = "";
    
    switch (format) {
      case 'numeric':
        formatted = `${pageNum}`;
        break;
      case 'page-of-total':
        formatted = `${pageNum} of ${total}`;
        break;
      case 'roman':
        formatted = toRoman(pageNum);
        break;
      case 'alphabetic':
        formatted = toAlphabetic(pageNum);
        break;
    }
    
    return `${prefix}${formatted}${suffix}`;
  };

  const toRoman = (num: number): string => {
    const romanNumerals: [number, string][] = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let result = '';
    for (const [value, numeral] of romanNumerals) {
      while (num >= value) {
        result += numeral;
        num -= value;
      }
    }
    return result.toLowerCase();
  };

  const toAlphabetic = (num: number): string => {
    let result = '';
    while (num > 0) {
      num--;
      result = String.fromCharCode(65 + (num % 26)) + result;
      num = Math.floor(num / 26);
    }
    return result;
  };

  const getPositionCoordinates = (pageWidth: number, pageHeight: number, textWidth: number) => {
    const m = margin[0];
    const positions = {
      'top-left': { x: m, y: m },
      'top-center': { x: (pageWidth - textWidth) / 2, y: m },
      'top-right': { x: pageWidth - textWidth - m, y: m },
      'bottom-left': { x: m, y: pageHeight - m },
      'bottom-center': { x: (pageWidth - textWidth) / 2, y: pageHeight - m },
      'bottom-right': { x: pageWidth - textWidth - m, y: pageHeight - m }
    };
    return positions[position];
  };

  const addPageNumbers = async () => {
    if (!pdfDoc || !pdfFile) {
      toast({
        title: "No file loaded",
        description: "Please upload a PDF file first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const totalPages = pdfDoc.getPageCount();

      for (let i = 0; i < totalPages; i++) {
        setProgress(Math.round(((i + 0.5) / totalPages) * 100));
        
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();
        
        const pageNumber = startNumber + i;
        const text = formatPageNumber(pageNumber, totalPages);
        const textWidth = font.widthOfTextAtSize(text, fontSize[0]);
        const coords = getPositionCoordinates(width, height, textWidth);
        
        page.drawText(text, {
          x: coords.x,
          y: coords.y,
          size: fontSize[0],
          font: font,
          color: rgb(0, 0, 0)
        });
        
        setProgress(Math.round(((i + 1) / totalPages) * 100));
      }

      const pdfBytes = await pdfDoc.save();
      setNumberedPdf(pdfBytes);
      
      toast({
        title: "Success!",
        description: "Page numbers added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add page numbers",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadNumberedPdf = () => {
    if (!numberedPdf || !pdfFile) return;
    
    const blob = new Blob([numberedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfFile.name.replace('.pdf', '_numbered.pdf');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setPdfFile(null);
    setPdfDoc(null);
    setNumberedPdf(null);
    setPreviewUrl("");
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
          <span className="text-foreground">Add Page Numbers</span>
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
              Add <span className="gradient-text">Page Numbers</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Add customizable page numbers to your PDF documents. 
              Choose position, format, and style for professional pagination.
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
            {!numberedPdf ? (
              <>
                {!pdfFile ? (
                  <FileUpload
                    accept="application/pdf"
                    onFileSelect={handleFileUpload}
                    className="h-48"
                    title="Drop PDF file here or click to select"
                    description="Select a PDF to add page numbers"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {previewUrl && (
                        <div>
                          <h3 className="font-medium mb-3">Preview</h3>
                          <div className="border rounded-lg overflow-hidden bg-muted/50">
                            <img 
                              src={previewUrl} 
                              alt="PDF Preview with page number" 
                              className="w-full h-auto"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="font-medium mb-3">Page Number Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="position">Position</Label>
                            <Select value={position} onValueChange={(v) => setPosition(v as Position)}>
                              <SelectTrigger id="position" data-testid="select-position">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="top-left">Top Left</SelectItem>
                                <SelectItem value="top-center">Top Center</SelectItem>
                                <SelectItem value="top-right">Top Right</SelectItem>
                                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                <SelectItem value="bottom-center">Bottom Center</SelectItem>
                                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="format">Format</Label>
                            <Select value={format} onValueChange={(v) => setFormat(v as Format)}>
                              <SelectTrigger id="format" data-testid="select-format">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="numeric">1, 2, 3...</SelectItem>
                                <SelectItem value="page-of-total">1 of 10, 2 of 10...</SelectItem>
                                <SelectItem value="roman">i, ii, iii...</SelectItem>
                                <SelectItem value="alphabetic">A, B, C...</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="startNumber">Start Number</Label>
                            <Input
                              id="startNumber"
                              type="number"
                              value={startNumber}
                              onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                              min={1}
                              data-testid="input-start-number"
                            />
                          </div>

                          <div>
                            <Label htmlFor="fontSize">Font Size: {fontSize[0]}pt</Label>
                            <Slider
                              id="fontSize"
                              value={fontSize}
                              onValueChange={setFontSize}
                              min={8}
                              max={24}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <Label htmlFor="margin">Margin: {margin[0]}px</Label>
                            <Slider
                              id="margin"
                              value={margin}
                              onValueChange={setMargin}
                              min={10}
                              max={100}
                              step={5}
                              className="w-full"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="prefix">Prefix (optional)</Label>
                              <Input
                                id="prefix"
                                value={prefix}
                                onChange={(e) => setPrefix(e.target.value)}
                                placeholder="Page "
                                data-testid="input-prefix"
                              />
                            </div>
                            <div>
                              <Label htmlFor="suffix">Suffix (optional)</Label>
                              <Input
                                id="suffix"
                                value={suffix}
                                onChange={(e) => setSuffix(e.target.value)}
                                placeholder=""
                                data-testid="input-suffix"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {isProcessing && (
                      <div className="mb-6">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-center mt-2 text-muted-foreground">
                          Adding page numbers... {progress}%
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        onClick={addPageNumbers}
                        disabled={isProcessing}
                        className="flex-1"
                        data-testid="button-add-numbers"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Adding Numbers...
                          </>
                        ) : (
                          <>
                            <Hash className="w-4 h-4 mr-2" />
                            Add Page Numbers
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
                  <Hash className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Page Numbers Added Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  Your PDF now has page numbers in {position.replace('-', ' ')} position
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={downloadNumberedPdf} size="lg" data-testid="button-download">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button onClick={reset} variant="outline" size="lg" data-testid="button-number-another">
                    Number Another PDF
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Why Use Section */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Why Use Our Page Number Tool?</h2>
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Multiple positioning options for flexibility</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Various numbering formats (numeric, roman, alphabetic)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Customizable font size and margins</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Add prefix and suffix text</span>
              </p>
            </div>
          </Card>

          {/* Use Cases */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Common Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">📚 Academic Papers</h3>
                <p className="text-sm text-muted-foreground">Add page numbers to thesis, dissertations, and research papers</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">📊 Business Reports</h3>
                <p className="text-sm text-muted-foreground">Professional pagination for annual reports and proposals</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">📖 E-books</h3>
                <p className="text-sm text-muted-foreground">Add page numbers to digital books and manuals</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">⚖️ Legal Documents</h3>
                <p className="text-sm text-muted-foreground">Number pages for contracts and legal filings</p>
              </div>
            </div>
          </Card>

          {/* FAQ */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Can I skip certain pages?</h3>
                <p className="text-sm text-muted-foreground">Currently, page numbers are added to all pages. Use the start number option to begin counting from a specific number.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Can I change the font color?</h3>
                <p className="text-sm text-muted-foreground">Page numbers are currently added in black. Custom colors may be added in future updates.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">What about existing page numbers?</h3>
                <p className="text-sm text-muted-foreground">New page numbers are added on top of existing content. Remove existing numbers first if needed.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Can I use custom fonts?</h3>
                <p className="text-sm text-muted-foreground">Currently using standard Helvetica font. Custom fonts may be added in future updates.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ContactSupportSection />
    </div>

  );
}
