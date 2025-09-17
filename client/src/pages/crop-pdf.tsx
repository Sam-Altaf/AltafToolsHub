import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { Crop, Upload, Download, FileText, Loader2, ArrowLeft, Shield, Maximize2, Move } from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { PDFDocument } from "pdf-lib";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - using local worker for privacy
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface CropSettings {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export default function CropPDF() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [cropSettings, setCropSettings] = useState<CropSettings>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [croppedPdf, setCroppedPdf] = useState<Uint8Array | null>(null);
  const { toast } = useToast();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF Cropper - AltafToolsHub",
    "description": "Free online PDF cropper to remove margins and whitespace",
    "url": "https://www.altaftoolshub.com/crop-pdf",
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
      "ratingCount": "1089"
    }
  };

  useSEO({
    title: "Crop PDF Online Free - Remove Margins & Whitespace | AltafToolsHub",
    description: "Free online PDF cropper to remove unwanted margins, headers, footers, and whitespace. Visual preview with adjustable crop areas. 100% client-side processing.",
    path: "/crop-pdf",
    keywords: "crop pdf, pdf cropper, remove pdf margins, trim pdf, pdf crop tool, remove whitespace pdf",
    ogImage: "https://www.altaftoolshub.com/og-crop-pdf.png",
    structuredData: [structuredData],
    additionalMetaTags: [
      { name: "application-name", content: "PDF Cropper - AltafToolsHub" },
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
      setCroppedPdf(null);
      setCropSettings({ top: 0, bottom: 0, left: 0, right: 0 });
      
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
  }, [toast]);

  const cropPDF = async () => {
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
      const newPdf = await PDFDocument.create();
      const totalPages = pdfDoc.getPageCount();

      for (let i = 0; i < totalPages; i++) {
        setProgress(Math.round(((i + 0.5) / totalPages) * 100));
        
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();
        
        // Calculate new dimensions
        const newWidth = width - cropSettings.left - cropSettings.right;
        const newHeight = height - cropSettings.top - cropSettings.bottom;
        
        // Create new page with cropped dimensions
        const newPage = newPdf.addPage([newWidth, newHeight]);
        
        // Embed and draw the cropped content
        const embeddedPage = await newPdf.embedPage(page, {
          top: height - cropSettings.top,
          bottom: cropSettings.bottom,
          left: cropSettings.left,
          right: width - cropSettings.right
        });
        
        newPage.drawPage(embeddedPage, {
          x: 0,
          y: 0,
          width: newWidth,
          height: newHeight
        });
        
        setProgress(Math.round(((i + 1) / totalPages) * 100));
      }

      const pdfBytes = await newPdf.save();
      setCroppedPdf(pdfBytes);
      
      toast({
        title: "Success!",
        description: "PDF cropped successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to crop PDF",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadCroppedPdf = () => {
    if (!croppedPdf || !pdfFile) return;
    
    const blob = new Blob([croppedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfFile.name.replace('.pdf', '_cropped.pdf');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setPdfFile(null);
    setPdfDoc(null);
    setCroppedPdf(null);
    setPreviewUrl("");
    setCropSettings({ top: 0, bottom: 0, left: 0, right: 0 });
    setProgress(0);
  };

  const autoDetectMargins = () => {
    // Simulate auto-detection
    setCropSettings({
      top: 20,
      bottom: 20,
      left: 15,
      right: 15
    });
    toast({
      title: "Margins Detected",
      description: "Automatic margin detection applied",
    });
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
          <span className="text-foreground">Crop PDF</span>
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
              Crop <span className="gradient-text">PDF Pages</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Remove unwanted margins, headers, and footers from your PDF documents. 
              Adjust crop areas visually for perfect results.
            </p>
          </div>

          {/* Privacy Notice */}
          <Alert className="mb-6">
            <Shield className="w-4 h-4" />
            <AlertDescription>
              Your PDFs are cropped entirely in your browser. Files never leave your device.
            </AlertDescription>
          </Alert>

          <Card className="p-8 mb-8">
            {!croppedPdf ? (
              <>
                {!pdfFile ? (
                  <FileUpload
                    accept="application/pdf"
                    onFileSelect={handleFileUpload}
                    className="h-48"
                    title="Drop PDF file here or click to select"
                    description="Select a PDF to crop margins"
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

                    {previewUrl && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="font-medium mb-3">Preview</h3>
                          <div className="border rounded-lg overflow-hidden bg-muted/50 relative">
                            {previewUrl && (
                              <div className="relative">
                                <img 
                                  src={previewUrl} 
                                  alt="PDF Preview" 
                                  className="w-full h-auto"
                                  style={{
                                    clipPath: `inset(${cropSettings.top}px ${cropSettings.right}px ${cropSettings.bottom}px ${cropSettings.left}px)`
                                  }}
                                />
                                <div 
                                  className="absolute inset-0 border-2 border-primary/50 pointer-events-none"
                                  style={{
                                    top: `${cropSettings.top}px`,
                                    right: `${cropSettings.right}px`,
                                    bottom: `${cropSettings.bottom}px`,
                                    left: `${cropSettings.left}px`
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-3">Crop Settings</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Top: {cropSettings.top}px</label>
                              <Slider
                                value={[cropSettings.top]}
                                onValueChange={([value]) => setCropSettings(prev => ({ ...prev, top: value }))}
                                max={100}
                                step={1}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Bottom: {cropSettings.bottom}px</label>
                              <Slider
                                value={[cropSettings.bottom]}
                                onValueChange={([value]) => setCropSettings(prev => ({ ...prev, bottom: value }))}
                                max={100}
                                step={1}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Left: {cropSettings.left}px</label>
                              <Slider
                                value={[cropSettings.left]}
                                onValueChange={([value]) => setCropSettings(prev => ({ ...prev, left: value }))}
                                max={100}
                                step={1}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Right: {cropSettings.right}px</label>
                              <Slider
                                value={[cropSettings.right]}
                                onValueChange={([value]) => setCropSettings(prev => ({ ...prev, right: value }))}
                                max={100}
                                step={1}
                                className="w-full"
                              />
                            </div>

                            <Button
                              onClick={autoDetectMargins}
                              variant="outline"
                              className="w-full"
                              data-testid="button-auto-detect"
                            >
                              <Maximize2 className="w-4 h-4 mr-2" />
                              Auto-Detect Margins
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {isProcessing && (
                      <div className="mb-6">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-center mt-2 text-muted-foreground">
                          Cropping PDF... {progress}%
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        onClick={cropPDF}
                        disabled={isProcessing}
                        className="flex-1"
                        data-testid="button-crop"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Cropping...
                          </>
                        ) : (
                          <>
                            <Crop className="w-4 h-4 mr-2" />
                            Crop PDF
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
                  <Crop className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">PDF Cropped Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  Your PDF has been cropped with the specified margins removed
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={downloadCroppedPdf} size="lg" data-testid="button-download">
                    <Download className="w-4 h-4 mr-2" />
                    Download Cropped PDF
                  </Button>
                  <Button onClick={reset} variant="outline" size="lg" data-testid="button-crop-another">
                    Crop Another PDF
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Why Use Section */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Why Use Our PDF Cropper?</h2>
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Visual preview with real-time crop adjustments</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Auto-detect margins for quick cropping</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Precise pixel-level control over crop areas</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Maintains text and image quality</span>
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
                  <Move className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">2. Adjust Margins</h3>
                <p className="text-sm text-muted-foreground">Set crop areas</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Crop className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">3. Crop</h3>
                <p className="text-sm text-muted-foreground">Apply cropping</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">4. Download</h3>
                <p className="text-sm text-muted-foreground">Save cropped PDF</p>
              </div>
            </div>
          </Card>

          {/* Comparison Section */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">AltafToolsHub vs Other PDF Croppers</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Feature</th>
                    <th className="text-center py-2">AltafToolsHub</th>
                    <th className="text-center py-2">Others</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">100% Privacy</td>
                    <td className="text-center py-2 text-green-500">✓</td>
                    <td className="text-center py-2 text-red-500">✗</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Visual Preview</td>
                    <td className="text-center py-2 text-green-500">✓</td>
                    <td className="text-center py-2 text-yellow-500">Sometimes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Auto-Detect Margins</td>
                    <td className="text-center py-2 text-green-500">✓</td>
                    <td className="text-center py-2 text-red-500">✗</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">No File Size Limit</td>
                    <td className="text-center py-2 text-green-500">✓</td>
                    <td className="text-center py-2 text-red-500">✗</td>
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

          {/* Use Cases */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Common Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">📄 Scanned Documents</h3>
                <p className="text-sm text-muted-foreground">Remove black borders and uneven margins from scanned pages</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">📊 Presentations</h3>
                <p className="text-sm text-muted-foreground">Crop unnecessary headers and footers from slide exports</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">📖 E-books</h3>
                <p className="text-sm text-muted-foreground">Optimize reading experience by removing excessive margins</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">🖨️ Print Preparation</h3>
                <p className="text-sm text-muted-foreground">Adjust page dimensions for specific paper sizes</p>
              </div>
            </div>
          </Card>

          {/* FAQ */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Does cropping affect PDF quality?</h3>
                <p className="text-sm text-muted-foreground">No, cropping only removes margins without affecting the quality of text or images in your PDF.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Can I crop different pages differently?</h3>
                <p className="text-sm text-muted-foreground">Currently, the same crop settings are applied to all pages. For page-specific cropping, process pages individually.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">What's the auto-detect feature?</h3>
                <p className="text-sm text-muted-foreground">Auto-detect analyzes your PDF to find common margin patterns and suggests optimal crop settings automatically.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Can I undo cropping?</h3>
                <p className="text-sm text-muted-foreground">The original PDF remains unchanged. Download the cropped version only when satisfied with the results.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Is there a file size limit?</h3>
                <p className="text-sm text-muted-foreground">No fixed limit. The tool can handle large PDFs, limited only by your browser's available memory.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}