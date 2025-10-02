import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Droplets, Shield, Check, AlertCircle, Download, ArrowLeft, 
  FileText, Type, Image as ImageIcon, Sparkles, Zap, Settings,
  Upload, Eye, Lock, Globe, Star, ChevronRight, Layers,
  Target, Gauge, Book, FileDown, CheckCircle2, Info
} from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import ProcessingLoader from "@/components/ui/processing-loader";
import { useSEO } from "@/hooks/use-seo";
import { 
  generateToolPageSchemas, 
  generateEnhancedHowToSchema, 
  generateEnhancedBreadcrumbSchema 
} from "@/lib/structured-data";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import PrivacyNotice from "@/components/privacy-notice";
import { ContactSupportSection } from "@/components/contact-support";
import { scrollToProcessing } from "@/lib/scroll-utils";
import { generateSmartFileName } from "@/lib/smart-file-namer";
import { useToast } from "@/hooks/use-toast";

type WatermarkType = 'text' | 'image';
type Position = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type FontWeight = 'normal' | 'bold';

interface WatermarkResult {
  originalSize: number;
  watermarkedSize: number;
  watermarkedBlob: Blob;
  pagesProcessed: number;
}

export default function WatermarkPDF() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [position, setPosition] = useState<Position>('center');
  const [opacity, setOpacity] = useState([50]);
  const [fontSize, setFontSize] = useState([36]);
  const [fontWeight, setFontWeight] = useState<FontWeight>('bold');
  const [imageSize, setImageSize] = useState([30]);
  const [color, setColor] = useState('#FF0000');
  const [allPages, setAllPages] = useState(true);
  const [pageRange, setPageRange] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [result, setResult] = useState<WatermarkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const toolData = {
    id: "watermark-pdf",
    title: "Add Watermark to PDF",
    description: "Protect your documents with custom text or image watermarks",
    extendedDescription: "Add professional text or image watermarks to PDF files. Customize opacity, position, size, and apply to specific pages. Perfect for branding, copyright protection, and document security.",
    features: [
      "Text & image watermarks",
      "9 position options",
      "Adjustable opacity & size",
      "Custom colors & fonts",
      "Page range selection",
      "Batch watermarking",
      "100% client-side processing",
      "No file upload required"
    ],
    category: "pdf-security",
    href: "/watermark-pdf"
  };

  const schemas = generateToolPageSchemas(toolData);
  
  const howToSchema = generateEnhancedHowToSchema({
    name: "How to Add Watermark to PDF",
    description: "Learn how to add custom watermarks to PDF documents for protection and branding",
    totalTime: "PT2M",
    difficulty: "Easy",
    category: "PDF Processing",
    steps: [
      { 
        name: "Upload PDF File", 
        text: "Click the upload area or drag and drop your PDF file. Files up to 100MB are supported.",
        image: "/images/watermark-step1-upload.png"
      },
      { 
        name: "Configure Watermark", 
        text: "Choose between text or image watermark. Enter text or upload an image file.",
        image: "/images/watermark-step2-configure.png"
      },
      { 
        name: "Position & Customize", 
        text: "Select position, adjust opacity, size, and choose which pages to watermark.",
        image: "/images/watermark-step3-customize.png"
      },
      { 
        name: "Download Protected PDF", 
        text: "Click 'Add Watermark' and download your protected PDF instantly.",
        image: "/images/watermark-step4-download.png"
      }
    ]
  });

  const breadcrumbSchema = generateEnhancedBreadcrumbSchema([
    { name: "PDF Security", url: "/all-tools?category=pdf-security" },
    { name: "Watermark PDF", url: "/watermark-pdf" }
  ]);

  useSEO({
    title: "Add Watermark to PDF - Protect Documents | AltafToolsHub",
    description: "Add custom text or image watermarks to PDF files online. Protect your documents with professional branding. Adjust opacity, position, and apply to all pages. Free & secure - 100% browser-based processing.",
    path: "/watermark-pdf",
    keywords: "pdf watermark, add watermark to pdf, pdf protection, watermark pdf online, text watermark, image watermark, pdf branding, document watermark, pdf security",
    ogImage: "https://www.altaftoolshub.app/og-watermark-pdf.png",
    structuredData: [howToSchema, ...schemas, breadcrumbSchema],
    additionalMetaTags: [
      { name: "application-name", content: "PDF Watermark Tool - AltafToolsHub" },
      { property: "article:section", content: "PDF Security" },
      { property: "article:tag", content: "PDF Watermark" },
      { property: "article:tag", content: "Document Protection" }
    ]
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 1, g: 0, b: 0 };
  };

  const getPositionCoordinates = (pageWidth: number, pageHeight: number) => {
    const positions = {
      'top-left': { x: 50, y: pageHeight - 50 },
      'top-center': { x: pageWidth / 2, y: pageHeight - 50 },
      'top-right': { x: pageWidth - 50, y: pageHeight - 50 },
      'middle-left': { x: 50, y: pageHeight / 2 },
      'center': { x: pageWidth / 2, y: pageHeight / 2 },
      'middle-right': { x: pageWidth - 50, y: pageHeight / 2 },
      'bottom-left': { x: 50, y: 50 },
      'bottom-center': { x: pageWidth / 2, y: 50 },
      'bottom-right': { x: pageWidth - 50, y: 50 }
    };
    return positions[position];
  };

  const handleFileSelect = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
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
      
      setSelectedFile(file);
      setPdfDoc(doc);
      setResult(null);
      setError(null);
      
      toast({
        title: "File Loaded",
        description: `PDF loaded with ${doc.getPageCount()} pages`
      });

      setTimeout(() => {
        const configSection = document.getElementById('config-section');
        if (configSection) {
          configSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } catch (err) {
      setError('Failed to load PDF file');
      toast({
        title: "Error",
        description: "Failed to load PDF file",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file (PNG/JPG)",
        variant: "destructive"
      });
      return;
    }
    setWatermarkImage(file);
    toast({
      title: "Image Loaded",
      description: "Watermark image loaded successfully"
    });
  };

  const parsePageRange = (range: string, totalPages: number): number[] => {
    if (!range.trim()) return [];
    
    const pages: number[] = [];
    const parts = range.split(',');
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        if (start && end && start <= totalPages && end <= totalPages) {
          for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i);
          }
        }
      } else {
        const pageNum = parseInt(part.trim());
        if (pageNum && pageNum <= totalPages && !pages.includes(pageNum)) {
          pages.push(pageNum);
        }
      }
    }
    
    return pages.sort((a, b) => a - b);
  };

  const addWatermark = async () => {
    if (!pdfDoc || !selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }

    if (watermarkType === 'text' && !watermarkText.trim()) {
      setError('Please enter watermark text.');
      return;
    }

    if (watermarkType === 'image' && !watermarkImage) {
      setError('Please upload a watermark image.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setProgressMessage("Initializing watermark process...");

    scrollToProcessing();

    try {
      const totalPages = pdfDoc.getPageCount();
      let pagesToWatermark: number[];

      if (allPages) {
        pagesToWatermark = Array.from({ length: totalPages }, (_, i) => i + 1);
      } else {
        pagesToWatermark = parsePageRange(pageRange, totalPages);
        if (pagesToWatermark.length === 0) {
          setError('Invalid page range. Use format: 1,3,5-7');
          setIsProcessing(false);
          return;
        }
      }

      const rgbColor = hexToRgb(color);

      if (watermarkType === 'text') {
        setProgressMessage("Embedding font...");
        const font = fontWeight === 'bold' 
          ? await pdfDoc.embedFont(StandardFonts.HelveticaBold)
          : await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        for (let i = 0; i < pagesToWatermark.length; i++) {
          const pageIndex = pagesToWatermark[i] - 1;
          setProgress(Math.round(((i + 0.5) / pagesToWatermark.length) * 100));
          setProgressMessage(`Watermarking page ${pagesToWatermark[i]} of ${totalPages}...`);
          
          const page = pdfDoc.getPage(pageIndex);
          const { width, height } = page.getSize();
          
          const textWidth = font.widthOfTextAtSize(watermarkText, fontSize[0]);
          const coords = getPositionCoordinates(width, height);
          
          const centerPosition = position.includes('center') || position.includes('middle');
          
          page.drawText(watermarkText, {
            x: centerPosition ? coords.x - (textWidth / 2) : coords.x,
            y: coords.y,
            size: fontSize[0],
            font: font,
            color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
            opacity: opacity[0] / 100
          });
          
          setProgress(Math.round(((i + 1) / pagesToWatermark.length) * 100));
        }
      } else {
        setProgressMessage("Embedding image...");
        const imageBytes = await watermarkImage!.arrayBuffer();
        const image = watermarkImage!.type.includes('png') 
          ? await pdfDoc.embedPng(imageBytes)
          : await pdfDoc.embedJpg(imageBytes);
        
        for (let i = 0; i < pagesToWatermark.length; i++) {
          const pageIndex = pagesToWatermark[i] - 1;
          setProgress(Math.round(((i + 0.5) / pagesToWatermark.length) * 100));
          setProgressMessage(`Watermarking page ${pagesToWatermark[i]} of ${totalPages}...`);
          
          const page = pdfDoc.getPage(pageIndex);
          const { width, height } = page.getSize();
          
          const imgWidth = (width * imageSize[0]) / 100;
          const imgHeight = (image.height / image.width) * imgWidth;
          
          const coords = getPositionCoordinates(width, height);
          
          page.drawImage(image, {
            x: coords.x - imgWidth / 2,
            y: coords.y - imgHeight / 2,
            width: imgWidth,
            height: imgHeight,
            opacity: opacity[0] / 100
          });
          
          setProgress(Math.round(((i + 1) / pagesToWatermark.length) * 100));
        }
      }

      setProgressMessage("Saving watermarked PDF...");
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      setResult({
        originalSize: selectedFile.size,
        watermarkedSize: blob.size,
        watermarkedBlob: blob,
        pagesProcessed: pagesToWatermark.length
      });

      setProgressMessage("Watermark added successfully!");
      toast({
        title: "Success!",
        description: `Watermark added to ${pagesToWatermark.length} page${pagesToWatermark.length > 1 ? 's' : ''}`
      });

      setTimeout(() => {
        const downloadBtn = document.getElementById('download-button');
        if (downloadBtn) {
          downloadBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    } catch (err) {
      setError('Failed to add watermark. Please try again.');
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
    if (!result || !selectedFile) return;
    
    const url = URL.createObjectURL(result.watermarkedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generateSmartFileName({
      originalName: selectedFile.name,
      operation: 'watermark'
    }).suggested;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setSelectedFile(null);
    setPdfDoc(null);
    setResult(null);
    setWatermarkImage(null);
    setError(null);
    setProgress(0);
    setProgressMessage("");
  };

  return (
    <div className="min-h-screen relative">
      <Breadcrumbs 
        items={[
          { name: "PDF Security", url: "/all-tools?category=pdf-security" },
          { name: "Watermark PDF", url: "/watermark-pdf" }
        ]}
      />

      <Link href="/all-tools?category=pdf-security">
        <Button variant="ghost" className="mb-4 ml-4" data-testid="button-back">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to PDF Tools
        </Button>
      </Link>

      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden hero-gradient">
        <div className="hero-circuit" />
        
        <div className="container-section py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 mb-6">
              <Droplets className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Add Watermark to PDF
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Protect your documents with custom text or image watermarks. Add professional branding while maintaining document quality.
            </p>

            <PrivacyNotice message="100% private - All processing happens in your browser. Files never leave your device." />
          </div>
        </div>
      </section>

      <div className="container-section py-12">
        <div className="max-w-6xl mx-auto">
          {/* File Upload Section */}
          <Card className="p-8 mb-8" data-testid="upload-section">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Upload className="w-6 h-6 text-primary" />
              Upload PDF File
            </h2>
            
            {!selectedFile ? (
              <FileUpload
                accept="application/pdf"
                maxSize={100 * 1024 * 1024}
                onFileSelect={handleFileSelect}
                className="min-h-[300px]"
                title="Drop PDF file here or click to select"
                description="Maximum file size: 100MB"
                data-testid="upload-watermark-pdf"
              />
            ) : (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle2 className="w-4 h-4" />
                  <AlertDescription>
                    <strong>{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)}) - {pdfDoc?.getPageCount()} pages
                  </AlertDescription>
                </Alert>
                
                <Button variant="outline" onClick={reset} data-testid="button-upload-new">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Different File
                </Button>
              </div>
            )}
          </Card>

          {/* Watermark Configuration Section */}
          {selectedFile && pdfDoc && !result && (
            <Card className="p-8 mb-8" id="config-section" data-testid="config-section">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6 text-primary" />
                Configure Watermark
              </h2>

              <Tabs value={watermarkType} onValueChange={(v) => setWatermarkType(v as WatermarkType)}>
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="text" className="flex-1" data-testid="button-choose-text">
                    <Type className="w-4 h-4 mr-2" />
                    Text Watermark
                  </TabsTrigger>
                  <TabsTrigger value="image" className="flex-1" data-testid="button-choose-image">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Image Watermark
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-6">
                  <div>
                    <Label htmlFor="watermarkText">Watermark Text</Label>
                    <Input
                      id="watermarkText"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="Enter watermark text"
                      className="mt-2"
                      data-testid="input-watermark-text"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fontSize">Font Size: {fontSize[0]}px</Label>
                    <Slider
                      id="fontSize"
                      value={fontSize}
                      onValueChange={setFontSize}
                      min={8}
                      max={72}
                      step={2}
                      className="mt-2"
                      data-testid="input-font-size"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fontWeight">Font Weight</Label>
                    <Select value={fontWeight} onValueChange={(v) => setFontWeight(v as FontWeight)}>
                      <SelectTrigger id="fontWeight" className="mt-2" data-testid="select-font-weight">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="color">Color</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="color"
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-20 h-10"
                        data-testid="input-color"
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

                <TabsContent value="image" className="space-y-6">
                  <div>
                    <Label>Watermark Image</Label>
                    <FileUpload
                      accept="image/png,image/jpeg,image/jpg"
                      onFileSelect={handleImageUpload}
                      className="mt-2 min-h-[200px]"
                      title="Upload watermark image"
                      description="PNG or JPG format"
                      maxSize={5 * 1024 * 1024}
                      data-testid="upload-watermark-image"
                    />
                    {watermarkImage && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Selected: {watermarkImage.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="imageSize">Image Size: {imageSize[0]}% of page width</Label>
                    <Slider
                      id="imageSize"
                      value={imageSize}
                      onValueChange={setImageSize}
                      min={10}
                      max={80}
                      step={5}
                      className="mt-2"
                      data-testid="input-image-size"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-6 mt-6">
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Select value={position} onValueChange={(v) => setPosition(v as Position)}>
                    <SelectTrigger id="position" className="mt-2" data-testid="select-position">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="top-center">Top Center</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="middle-left">Middle Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="middle-right">Middle Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="bottom-center">Bottom Center</SelectItem>
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
                    min={0}
                    max={100}
                    step={5}
                    className="mt-2"
                    data-testid="input-opacity"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allPages"
                    checked={allPages}
                    onCheckedChange={(checked) => setAllPages(checked as boolean)}
                    data-testid="checkbox-all-pages"
                  />
                  <Label htmlFor="allPages" className="cursor-pointer">
                    Apply to all pages
                  </Label>
                </div>

                {!allPages && (
                  <div>
                    <Label htmlFor="pageRange">Page Range</Label>
                    <Input
                      id="pageRange"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                      placeholder="e.g., 1,3,5-7"
                      className="mt-2"
                      data-testid="input-page-range"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter page numbers separated by commas. Use hyphens for ranges (e.g., 1,3,5-7)
                    </p>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={addWatermark}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                  data-testid="button-process"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Droplets className="w-5 h-5 mr-2" />
                      Add Watermark
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* Processing Section */}
          {isProcessing && (
            <Card className="p-8 mb-8" id="processing-section" data-testid="processing-section">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Adding Watermark</h3>
                <Progress value={progress} className="mb-4" />
                <p className="text-sm text-muted-foreground">{progressMessage}</p>
              </div>
            </Card>
          )}

          {/* Download Section */}
          {result && (
            <Card className="p-8 mb-8" data-testid="download-section">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">Watermark Added Successfully!</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-muted-foreground mb-1">Original Size</p>
                    <p className="font-semibold">{formatFileSize(result.originalSize)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-muted-foreground mb-1">Final Size</p>
                    <p className="font-semibold">{formatFileSize(result.watermarkedSize)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-muted-foreground mb-1">Pages Watermarked</p>
                    <p className="font-semibold">{result.pagesProcessed}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={downloadWatermarkedPdf}
                    size="lg"
                    id="download-button"
                    data-testid="button-download"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Watermarked PDF
                  </Button>
                  
                  <Button
                    onClick={reset}
                    variant="outline"
                    size="lg"
                    data-testid="button-process-another"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Process Another File
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* How It Works Section */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: Upload, title: "Upload PDF", description: "Select or drag your PDF file to begin" },
                { icon: Settings, title: "Configure Watermark", description: "Choose text or image and customize settings" },
                { icon: Target, title: "Position & Customize", description: "Select position, opacity, and target pages" },
                { icon: Download, title: "Download Protected PDF", description: "Get your watermarked PDF instantly" }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Features Grid */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-8 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Type, title: "Text & Image Watermarks", description: "Add custom text or upload image watermarks" },
                { icon: Target, title: "Custom Positioning", description: "9 position options for precise placement" },
                { icon: Gauge, title: "Opacity Control", description: "Adjust transparency from 0-100%" },
                { icon: Layers, title: "Batch Watermarking", description: "Apply to all pages or specific ranges" },
                { icon: FileText, title: "Multiple Page Support", description: "Watermark PDFs with unlimited pages" },
                { icon: Shield, title: "Privacy-First Processing", description: "100% browser-based, no uploads" }
              ].map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* FAQ Section */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1">
                <AccordionTrigger>What is a PDF watermark?</AccordionTrigger>
                <AccordionContent>
                  A PDF watermark is text or an image overlaid on PDF pages to identify ownership, protect copyright, or mark documents as confidential, draft, or approved. Watermarks can be visible or transparent.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq-2">
                <AccordionTrigger>Can I add both text and image watermarks?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can choose to add either a text watermark or an image watermark. Text watermarks let you customize font size, color, and weight. Image watermarks support PNG and JPG formats with adjustable size.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq-3">
                <AccordionTrigger>How do I control watermark transparency?</AccordionTrigger>
                <AccordionContent>
                  Use the opacity slider to adjust transparency from 0% (invisible) to 100% (fully opaque). A typical watermark uses 30-50% opacity to be visible without obscuring the document content.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq-4">
                <AccordionTrigger>Can I watermark specific pages only?</AccordionTrigger>
                <AccordionContent>
                  Yes! Uncheck "Apply to all pages" and enter your desired page range (e.g., 1,3,5-7 for pages 1, 3, and 5 through 7). This is useful for watermarking only certain sections of a document.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq-5">
                <AccordionTrigger>Is my document secure?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! All processing happens entirely in your browser using JavaScript. Your PDF never leaves your device or gets uploaded to any server. This ensures complete privacy and security for sensitive documents.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq-6">
                <AccordionTrigger>What file formats are supported?</AccordionTrigger>
                <AccordionContent>
                  The tool accepts PDF files for watermarking. For watermark images, you can use PNG or JPG formats. The watermarked output is always a PDF file.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="faq-7">
                <AccordionTrigger>Is there a file size limit?</AccordionTrigger>
                <AccordionContent>
                  PDFs up to 100MB can be watermarked. Watermark images should be under 5MB. Processing time increases with file size and number of pages, but all processing happens locally on your device for maximum speed and privacy.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* Benefits Section */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Add Watermarks to PDFs?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Lock, title: "Copyright Protection", description: "Protect your intellectual property and prevent unauthorized use" },
                { icon: Star, title: "Professional Branding", description: "Add your logo or company name for brand recognition" },
                { icon: Eye, title: "Document Status", description: "Mark documents as draft, confidential, or approved" },
                { icon: Globe, title: "Ownership Claims", description: "Clearly establish document ownership and authenticity" }
              ].map((benefit, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Privacy Guarantee Section */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Your Privacy is Guaranteed</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Unlike other PDF tools that upload your files to their servers, our watermark tool processes everything directly in your browser. Your sensitive documents never leave your device, ensuring complete privacy and security.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="text-sm">
                  <Check className="w-3 h-3 mr-1" />
                  No File Upload
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Check className="w-3 h-3 mr-1" />
                  100% Browser-Based
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Check className="w-3 h-3 mr-1" />
                  Zero Data Collection
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Check className="w-3 h-3 mr-1" />
                  Works Offline
                </Badge>
              </div>
            </div>
          </Card>

          {/* Related Tools Section */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Related PDF Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { href: "/compress-pdf", icon: FileDown, title: "Compress PDF", description: "Reduce PDF file size while maintaining quality" },
                { href: "/protect-pdf", icon: Lock, title: "Protect PDF", description: "Add password protection to your PDFs" },
                { href: "/sign-pdf", icon: FileText, title: "Sign PDF", description: "Add digital signatures to PDF documents" }
              ].map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <tool.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 flex items-center gap-2">
                          {tool.title}
                          <ChevronRight className="w-4 h-4" />
                        </h3>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Card>

          {/* Contact Support Section */}
          <ContactSupportSection />
        </div>
      </div>
    </div>
  );
}
