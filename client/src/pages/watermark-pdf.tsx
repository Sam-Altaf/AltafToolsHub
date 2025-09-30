import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSEO, generateHowToSchema, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from "@/hooks/use-seo";
import { Droplets, Upload, Download, FileText, Loader2, ArrowLeft, Shield, Type, Image, Book } from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as pdfjsLib from 'pdfjs-dist';
import { ContactSupportSection } from "@/components/contact-support";

// Configure PDF.js worker - using local worker for privacy
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

type WatermarkType = 'text' | 'image';
type Position = 'center' | 'diagonal' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export default function WatermarkPDF() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [position, setPosition] = useState<Position>('diagonal');
  const [opacity, setOpacity] = useState([30]);
  const [fontSize, setFontSize] = useState([48]);
  const [rotation, setRotation] = useState([45]);
  const [color, setColor] = useState('#FF0000');
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [watermarkedPdf, setWatermarkedPdf] = useState<Uint8Array | null>(null);
  const { toast } = useToast();

  // Generate structured data for SEO
  const howToSchema = generateHowToSchema({
    name: "How to Add Watermark to PDF",
    description: "Add text or image watermarks to PDF documents for protection",
    totalTime: "PT1M",
    steps: [
      { name: "Upload PDF", text: "Select or drag your PDF file" },
      { name: "Choose Watermark Type", text: "Select text or image watermark" },
      { name: "Customize Settings", text: "Adjust opacity, position, rotation, and size" },
      { name: "Download Result", text: "Download your watermarked PDF instantly" }
    ]
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: "Watermark PDF - AltafToolsHub",
    description: "Free online tool to add text or image watermarks to PDF documents. Customize opacity, position, rotation, and color. 100% browser-based for complete privacy.",
    applicationCategory: "BusinessApplication",
    url: "https://www.altaftoolshub.app/watermark-pdf",
    aggregateRating: { ratingValue: 4.9, ratingCount: 1543, bestRating: 5 },
    featureList: [
      "Text and image watermarks",
      "Adjustable opacity and rotation",
      "6 position presets",
      "Custom colors and fonts",
      "Live preview",
      "100% client-side processing"
    ],
    datePublished: "2024-01-01",
    dateModified: "2025-01-20"
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "PDF Tools", url: "/all-tools?category=pdf" },
    { name: "Watermark PDF", url: "/watermark-pdf" }
  ]);

  useSEO({
    title: "Watermark PDF Online Free - Add Text & Image Watermarks | AltafToolsHub",
    description: "Free online PDF watermarking tool. Add custom text or image watermarks with adjustable opacity, position, and rotation. 100% client-side processing.",
    path: "/watermark-pdf",
    keywords: "watermark pdf, add watermark to pdf, pdf watermark tool, text watermark, image watermark, pdf protection",
    ogImage: "https://www.altaftoolshub.app/og-watermark-pdf.png",
    structuredData: [howToSchema, softwareSchema, breadcrumbSchema],
    additionalMetaTags: [
      { name: "application-name", content: "PDF Watermark Tool - AltafToolsHub" },
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
      
      // Draw preview watermark
      context.save();
      context.globalAlpha = opacity[0] / 100;
      context.fillStyle = color;
      context.font = `${fontSize[0]}px Arial`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      if (position === 'diagonal' || position === 'center') {
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate((rotation[0] * Math.PI) / 180);
        context.fillText(watermarkText, 0, 0);
      } else {
        const positions = {
          'top-left': { x: 100, y: 100 },
          'top-right': { x: canvas.width - 100, y: 100 },
          'bottom-left': { x: 100, y: canvas.height - 100 },
          'bottom-right': { x: canvas.width - 100, y: canvas.height - 100 }
        };
        const pos = positions[position] || { x: canvas.width / 2, y: canvas.height / 2 };
        context.fillText(watermarkText, pos.x, pos.y);
      }
      
      context.restore();
      
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
      setWatermarkedPdf(null);
      
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
  }, [watermarkText, opacity, fontSize, rotation, color, position, toast]);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    setWatermarkImage(file);
    toast({
      title: "Image Loaded",
      description: "Watermark image loaded successfully",
    });
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  };

  const getPositionCoordinates = (pageWidth: number, pageHeight: number, textWidth: number, textHeight: number) => {
    const positions = {
      'center': { x: pageWidth / 2, y: pageHeight / 2 },
      'diagonal': { x: pageWidth / 2, y: pageHeight / 2 },
      'top-left': { x: 100, y: pageHeight - 100 },
      'top-right': { x: pageWidth - 100, y: pageHeight - 100 },
      'bottom-left': { x: 100, y: 100 },
      'bottom-right': { x: pageWidth - 100, y: 100 }
    };
    return positions[position];
  };

  const addWatermark = async () => {
    // Scroll to top to show processing area
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (!pdfDoc || !pdfFile) {
      toast({
        title: "No file loaded",
        description: "Please upload a PDF file first",
        variant: "destructive"
      });
      return;
    }

    if (watermarkType === 'text' && !watermarkText) {
      toast({
        title: "No watermark text",
        description: "Please enter watermark text",
        variant: "destructive"
      });
      return;
    }

    if (watermarkType === 'image' && !watermarkImage) {
      toast({
        title: "No watermark image",
        description: "Please upload a watermark image",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const totalPages = pdfDoc.getPageCount();
      const rgbColor = hexToRgb(color);

      if (watermarkType === 'text') {
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        for (let i = 0; i < totalPages; i++) {
          setProgress(Math.round(((i + 0.5) / totalPages) * 100));
          
          const page = pdfDoc.getPage(i);
          const { width, height } = page.getSize();
          
          const textWidth = font.widthOfTextAtSize(watermarkText, fontSize[0]);
          const textHeight = font.heightAtSize(fontSize[0]);
          const coords = getPositionCoordinates(width, height, textWidth, textHeight);
          
          page.drawText(watermarkText, {
            x: coords.x - (position === 'diagonal' || position === 'center' ? textWidth / 2 : 0),
            y: coords.y,
            size: fontSize[0],
            font: font,
            color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
            opacity: opacity[0] / 100,
            rotate: position === 'diagonal' ? degrees(rotation[0]) : degrees(0)
          });
          
          setProgress(Math.round(((i + 1) / totalPages) * 100));
        }
      } else {
        // Handle image watermark
        const imageBytes = await watermarkImage!.arrayBuffer();
        const image = watermarkImage!.type.includes('png') 
          ? await pdfDoc.embedPng(imageBytes)
          : await pdfDoc.embedJpg(imageBytes);
        
        for (let i = 0; i < totalPages; i++) {
          setProgress(Math.round(((i + 0.5) / totalPages) * 100));
          
          const page = pdfDoc.getPage(i);
          const { width, height } = page.getSize();
          
          const scale = 0.3; // Scale down image to 30% of page width
          const imgWidth = width * scale;
          const imgHeight = (image.height / image.width) * imgWidth;
          
          const coords = getPositionCoordinates(width, height, imgWidth, imgHeight);
          
          page.drawImage(image, {
            x: coords.x - imgWidth / 2,
            y: coords.y - imgHeight / 2,
            width: imgWidth,
            height: imgHeight,
            opacity: opacity[0] / 100,
            rotate: position === 'diagonal' ? degrees(rotation[0]) : degrees(0)
          });
          
          setProgress(Math.round(((i + 1) / totalPages) * 100));
        }
      }

      const pdfBytes = await pdfDoc.save();
      setWatermarkedPdf(pdfBytes);
      
      toast({
        title: "Success!",
        description: "Watermark added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add watermark",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadWatermarkedPdf = () => {
    if (!watermarkedPdf || !pdfFile) return;
    
    const blob = new Blob([watermarkedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfFile.name.replace('.pdf', '_watermarked.pdf');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setPdfFile(null);
    setPdfDoc(null);
    setWatermarkedPdf(null);
    setWatermarkImage(null);
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
          <span className="text-foreground">Watermark PDF</span>
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
              Add Watermark to PDF
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Protect your PDFs with custom text or image watermarks. 
              Adjust opacity, position, and rotation for perfect branding.
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
            {!watermarkedPdf ? (
              <>
                {!pdfFile ? (
                  <FileUpload
                    accept="application/pdf"
                    onFileSelect={handleFileUpload}
                    className="min-h-[400px]"
                    title="Drop PDF file here or click to select"
                    description="Select a PDF to add watermark"
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
                          <div className="border rounded-lg bg-muted/50 p-4">
                            <img 
                              src={previewUrl} 
                              alt="PDF Preview with watermark" 
                              className="w-full aspect-square object-contain"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="font-medium mb-3">Watermark Settings</h3>
                        
                        <Tabs value={watermarkType} onValueChange={(v) => setWatermarkType(v as WatermarkType)}>
                          <TabsList className="w-full mb-4">
                            <TabsTrigger value="text" className="flex-1">
                              <Type className="w-4 h-4 mr-2" />
                              Text
                            </TabsTrigger>
                            <TabsTrigger value="image" className="flex-1">
                              <Image className="w-4 h-4 mr-2" />
                              Image
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="text" className="space-y-4">
                            <div>
                              <Label htmlFor="watermarkText">Watermark Text</Label>
                              <Input
                                id="watermarkText"
                                value={watermarkText}
                                onChange={(e) => setWatermarkText(e.target.value)}
                                placeholder="Enter watermark text"
                                data-testid="input-watermark-text"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="fontSize">Font Size: {fontSize[0]}pt</Label>
                              <Slider
                                id="fontSize"
                                value={fontSize}
                                onValueChange={setFontSize}
                                min={12}
                                max={120}
                                step={4}
                                className="w-full"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="color">Color</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="color"
                                  type="color"
                                  value={color}
                                  onChange={(e) => setColor(e.target.value)}
                                  className="w-20 h-10"
                                />
                                <Input
                                  value={color}
                                  onChange={(e) => setColor(e.target.value)}
                                  placeholder="#FF0000"
                                  className="flex-1"
                                />
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="image" className="space-y-4">
                            <div>
                              <Label>Watermark Image</Label>
                              <FileUpload
                                accept="image/*"
                                onFileSelect={handleImageUpload}
                                className="aspect-square"
                                title="Upload watermark image"
                                description="JPG, PNG supported"
                                maxSize={5 * 1024 * 1024}
                              />
                            </div>
                          </TabsContent>
                        </Tabs>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="position">Position</Label>
                            <Select value={position} onValueChange={(v) => setPosition(v as Position)}>
                              <SelectTrigger id="position" data-testid="select-position">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="center">Center</SelectItem>
                                <SelectItem value="diagonal">Diagonal</SelectItem>
                                <SelectItem value="top-left">Top Left</SelectItem>
                                <SelectItem value="top-right">Top Right</SelectItem>
                                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="opacity">Opacity: {opacity[0]}%</Label>
                            <Slider
                              id="opacity"
                              value={opacity}
                              onValueChange={setOpacity}
                              min={10}
                              max={100}
                              step={5}
                              className="w-full"
                            />
                          </div>

                          {position === 'diagonal' && (
                            <div>
                              <Label htmlFor="rotation">Rotation: {rotation[0]}°</Label>
                              <Slider
                                id="rotation"
                                value={rotation}
                                onValueChange={setRotation}
                                min={0}
                                max={90}
                                step={5}
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {isProcessing && (
                      <div className="mb-6">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-center mt-2 text-muted-foreground">
                          Adding watermark... {progress}%
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        onClick={addWatermark}
                        disabled={isProcessing}
                        className="flex-1"
                        data-testid="button-add-watermark"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Adding Watermark...
                          </>
                        ) : (
                          <>
                            <Droplets className="w-4 h-4 mr-2" />
                            Add Watermark
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
                  <Droplets className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Watermark Added Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  Your PDF now has a {watermarkType} watermark
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={downloadWatermarkedPdf} size="lg" data-testid="button-download">
                    <Download className="w-4 h-4 mr-2" />
                    Download Watermarked PDF
                  </Button>
                  <Button onClick={reset} variant="outline" size="lg" data-testid="button-watermark-another">
                    Watermark Another PDF
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Why Use Section */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Why Use Our Watermark Tool?</h2>
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Support for both text and image watermarks</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Adjustable opacity for subtle branding</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Multiple positioning options</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Custom rotation for diagonal watermarks</span>
              </p>
            </div>
          </Card>

          {/* Blog Link */}
          <div className="mb-8">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <Book className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Want to learn more? </span>
                  <Link href="/guides/how-to-add-watermark-to-pdf" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline transition-colors">
                    Read our complete guide: How to Add Watermark to PDF
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Common Use Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">🔒 Document Protection</h3>
                <p className="text-sm text-muted-foreground">Add "CONFIDENTIAL" or "DRAFT" watermarks to sensitive documents</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">🏢 Company Branding</h3>
                <p className="text-sm text-muted-foreground">Add company logos to business documents and proposals</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">©️ Copyright Notice</h3>
                <p className="text-sm text-muted-foreground">Protect intellectual property with copyright watermarks</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">📋 Status Indicators</h3>
                <p className="text-sm text-muted-foreground">Mark documents as "APPROVED", "VOID", or "SAMPLE"</p>
              </div>
            </div>
          </Card>

          {/* FAQ */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Can I remove watermarks later?</h3>
                <p className="text-sm text-muted-foreground">Watermarks become part of the PDF. Keep the original file if you need a version without watermarks.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">What image formats are supported?</h3>
                <p className="text-sm text-muted-foreground">JPG and PNG images are supported for image watermarks.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Can I add different watermarks to different pages?</h3>
                <p className="text-sm text-muted-foreground">Currently, the same watermark is applied to all pages. For page-specific watermarks, process pages separately.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Does watermarking affect PDF quality?</h3>
                <p className="text-sm text-muted-foreground">No, watermarks are added as an overlay without affecting the original content quality.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ContactSupportSection />
    </div>

  );
}
