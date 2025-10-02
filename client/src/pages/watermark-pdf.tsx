import { useState, useCallback, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Droplets, Shield, Check, AlertCircle, Download, ArrowLeft, 
  FileText, Type, Image as ImageIcon, Sparkles, Zap, Settings,
  Upload, Lock, ChevronRight, Layers, Bold, Italic, Underline,
  Target, Gauge, Book, FileDown, CheckCircle2, Grid3x3
} from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { useSEO } from "@/hooks/use-seo";
import { 
  generateToolPageSchemas, 
  generateEnhancedHowToSchema, 
  generateEnhancedBreadcrumbSchema 
} from "@/lib/structured-data";
import { PDFDocument, rgb, degrees, StandardFonts, PDFFont, PDFPage, PDFImage } from "pdf-lib";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import PrivacyNotice from "@/components/privacy-notice";
import { ContactSupportSection } from "@/components/contact-support";
import { scrollToProcessing } from "@/lib/scroll-utils";
import { generateSmartFileName } from "@/lib/smart-file-namer";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from 'pdfjs-dist';
import ToolSEO, { toolFAQs } from "@/components/seo/tool-seo";

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

type WatermarkType = 'text' | 'image';
type Position = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type FontFamily = 'Helvetica' | 'Times' | 'Courier';
type Layer = 'over' | 'below';

interface WatermarkResult {
  originalSize: number;
  watermarkedSize: number;
  watermarkedBlob: Blob;
  pagesProcessed: number;
}

interface PageThumbnail {
  pageNum: number;
  dataUrl: string;
}

export default function WatermarkPDF() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [position, setPosition] = useState<Position>('center');
  const [opacity, setOpacity] = useState([50]);
  const [transparencyPreset, setTransparencyPreset] = useState("50");
  const [fontSize, setFontSize] = useState([36]);
  const [fontFamily, setFontFamily] = useState<FontFamily>('Helvetica');
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [imageSize, setImageSize] = useState([30]);
  const [color, setColor] = useState('#FF0000');
  const [rotation, setRotation] = useState(0);
  const [layer, setLayer] = useState<Layer>('over');
  const [mosaicMode, setMosaicMode] = useState(false);
  const [mosaicSpacing, setMosaicSpacing] = useState([150]);
  const [allPages, setAllPages] = useState(true);
  const [fromPage, setFromPage] = useState(1);
  const [toPage, setToPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [result, setResult] = useState<WatermarkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
  const { toast } = useToast();

  const toolData = {
    id: "watermark-pdf",
    title: "Add Watermark to PDF",
    description: "Protect your documents with custom text or image watermarks",
    extendedDescription: "Add professional text or image watermarks to PDF files. Customize opacity, position, size, rotation, and apply to specific pages. Perfect for branding, copyright protection, and document security.",
    features: [
      "Text & image watermarks",
      "9 position options with visual grid",
      "Adjustable opacity & transparency presets",
      "Custom colors & fonts",
      "Rotation control (0-270°)",
      "Layer control (over/below content)",
      "Mosaic pattern mode",
      "Page range selection",
      "Real-time preview thumbnails",
      "100% client-side processing"
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
        text: "Choose between text or image watermark. Customize text, font, color, or upload an image.",
        image: "/images/watermark-step2-configure.png"
      },
      { 
        name: "Position & Customize", 
        text: "Use the visual position grid, adjust opacity, rotation, and choose layer placement.",
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
    title: "Add Watermark to PDF - Professional Watermarking Tool | AltafToolsHub",
    description: "Add custom text or image watermarks to PDF files online. Professional watermarking with position grid, rotation, transparency, and mosaic mode. Free & secure - 100% browser-based processing.",
    path: "/watermark-pdf",
    keywords: "pdf watermark, add watermark to pdf, pdf protection, watermark pdf online, text watermark, image watermark, pdf branding, document watermark, pdf security, mosaic watermark",
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

  const positions: Position[] = [
    'top-left', 'top-center', 'top-right',
    'middle-left', 'center', 'middle-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ];

  const getPositionCoordinates = (pageWidth: number, pageHeight: number, pos: Position = position) => {
    const positionsMap = {
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
    return positionsMap[pos];
  };

  // Sync transparency preset with slider
  useEffect(() => {
    const presetValue = parseInt(transparencyPreset);
    if (opacity[0] !== presetValue) {
      setOpacity([presetValue]);
    }
  }, [transparencyPreset]);

  // Sync slider with nearest preset
  useEffect(() => {
    const currentOpacity = opacity[0];
    const presets = [0, 25, 50, 75, 100];
    const nearest = presets.reduce((prev, curr) => 
      Math.abs(curr - currentOpacity) < Math.abs(prev - currentOpacity) ? curr : prev
    );
    if (transparencyPreset !== nearest.toString()) {
      setTransparencyPreset(nearest.toString());
    }
  }, [opacity]);

  // Generate thumbnails when PDF is loaded
  const generateThumbnails = async (file: File) => {
    setIsLoadingThumbnails(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const thumbnailsToShow = Math.min(6, totalPages);
      const thumbnailPromises: Promise<PageThumbnail>[] = [];

      for (let i = 1; i <= thumbnailsToShow; i++) {
        thumbnailPromises.push(
          (async () => {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 0.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            if (!context) throw new Error('Failed to get canvas context');
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
              canvasContext: context,
              viewport: viewport,
              canvas: canvas
            }).promise;

            return {
              pageNum: i,
              dataUrl: canvas.toDataURL()
            };
          })()
        );
      }

      const generatedThumbnails = await Promise.all(thumbnailPromises);
      setThumbnails(generatedThumbnails);
    } catch (err) {
      console.error('Failed to generate thumbnails:', err);
    } finally {
      setIsLoadingThumbnails(false);
    }
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
      const pageCount = doc.getPageCount();
      
      setSelectedFile(file);
      setPdfDoc(doc);
      setResult(null);
      setError(null);
      setToPage(pageCount);
      
      toast({
        title: "File Loaded",
        description: `PDF loaded with ${pageCount} pages`
      });

      // Generate thumbnails
      await generateThumbnails(file);

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

  const getFont = async (doc: PDFDocument): Promise<PDFFont> => {
    let baseFont: StandardFonts;
    
    if (fontFamily === 'Helvetica') {
      if (isBold && isItalic) baseFont = StandardFonts.HelveticaBoldOblique;
      else if (isBold) baseFont = StandardFonts.HelveticaBold;
      else if (isItalic) baseFont = StandardFonts.HelveticaOblique;
      else baseFont = StandardFonts.Helvetica;
    } else if (fontFamily === 'Times') {
      if (isBold && isItalic) baseFont = StandardFonts.TimesRomanBoldItalic;
      else if (isBold) baseFont = StandardFonts.TimesRomanBold;
      else if (isItalic) baseFont = StandardFonts.TimesRomanItalic;
      else baseFont = StandardFonts.TimesRoman;
    } else {
      if (isBold && isItalic) baseFont = StandardFonts.CourierBoldOblique;
      else if (isBold) baseFont = StandardFonts.CourierBold;
      else if (isItalic) baseFont = StandardFonts.CourierOblique;
      else baseFont = StandardFonts.Courier;
    }

    return await doc.embedFont(baseFont);
  };

  const drawWatermarkOnPage = async (
    page: PDFPage,
    doc: PDFDocument,
    font?: PDFFont,
    image?: PDFImage
  ) => {
    const { width, height } = page.getSize();
    const rgbColor = hexToRgb(color);

    const drawSingleWatermark = (xPos: number, yPos: number) => {
      if (watermarkType === 'text' && font) {
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize[0]);
        const centerPosition = position.includes('center') || position.includes('middle');
        const textX = centerPosition ? xPos - (textWidth / 2) : xPos;
        
        page.drawText(watermarkText, {
          x: textX,
          y: yPos,
          size: fontSize[0],
          font: font,
          color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
          opacity: opacity[0] / 100,
          rotate: degrees(rotation)
        });

        // Draw underline if enabled
        if (isUnderline) {
          const underlineOffset = fontSize[0] * 0.15; // Distance below text baseline
          const underlineThickness = Math.max(1, fontSize[0] * 0.05);
          
          // Calculate underline position with rotation-aware offsets
          const rotationRad = (rotation * Math.PI) / 180;
          const deltaX = Math.sin(rotationRad) * underlineOffset;
          const deltaY = -Math.cos(rotationRad) * underlineOffset; // Negative because PDF y-axis goes up
          
          const underlineX = textX + deltaX;
          const underlineY = yPos + deltaY;
          
          // Draw underline as a rectangle that rotates with the text
          page.drawRectangle({
            x: underlineX,
            y: underlineY,
            width: textWidth,
            height: underlineThickness,
            color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
            opacity: opacity[0] / 100,
            rotate: degrees(rotation) // Apply same rotation as text
          });
        }
      } else if (watermarkType === 'image' && image) {
        const imgWidth = (width * imageSize[0]) / 100;
        const imgHeight = (image.height / image.width) * imgWidth;
        
        page.drawImage(image, {
          x: xPos - imgWidth / 2,
          y: yPos - imgHeight / 2,
          width: imgWidth,
          height: imgHeight,
          opacity: opacity[0] / 100,
          rotate: degrees(rotation)
        });
      }
    };

    if (mosaicMode) {
      const spacing = mosaicSpacing[0];
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          drawSingleWatermark(x + spacing / 2, y + spacing / 2);
        }
      }
    } else {
      const coords = getPositionCoordinates(width, height);
      drawSingleWatermark(coords.x, coords.y);
    }
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
        const from = Math.max(1, Math.min(fromPage, totalPages));
        const to = Math.max(from, Math.min(toPage, totalPages));
        pagesToWatermark = Array.from({ length: to - from + 1 }, (_, i) => from + i);
      }

      let font: PDFFont | undefined;
      let image: PDFImage | undefined;

      if (watermarkType === 'text') {
        setProgressMessage("Embedding font...");
        font = await getFont(pdfDoc);
      } else {
        setProgressMessage("Embedding image...");
        const imageBytes = await watermarkImage!.arrayBuffer();
        image = watermarkImage!.type.includes('png') 
          ? await pdfDoc.embedPng(imageBytes)
          : await pdfDoc.embedJpg(imageBytes);
      }

      // For 'below' layer, create a copy of the original PDF once (not in loop)
      let originalPdfCopy: PDFDocument | null = null;
      if (layer === 'below') {
        const originalBytes = await pdfDoc.save();
        originalPdfCopy = await PDFDocument.load(originalBytes);
      }

      // Apply watermarks to pages
      for (let i = 0; i < pagesToWatermark.length; i++) {
        const pageIndex = pagesToWatermark[i] - 1;
        setProgress(Math.round(((i + 0.5) / pagesToWatermark.length) * 100));
        setProgressMessage(`Watermarking page ${pagesToWatermark[i]} of ${totalPages}...`);
        
        const page = pdfDoc.getPage(pageIndex);
        
        if (layer === 'below' && originalPdfCopy) {
          // For 'below' layer: embed original page as a form XObject, draw watermark first, then draw page on top
          setProgressMessage(`Applying watermark below content on page ${pagesToWatermark[i]}...`);
          
          // Embed the original page from the copy we made earlier
          const [embeddedPage] = await pdfDoc.embedPages([originalPdfCopy.getPage(pageIndex)]);
          
          // Clear the current page content (remove existing Contents)
          page.node.set(page.node.context.obj('Contents'), page.node.context.obj([]));
          
          // Draw watermark first (on empty page)
          await drawWatermarkOnPage(page, pdfDoc, font, image);
          
          // Draw the original page content on top
          const { width, height } = page.getSize();
          page.drawPage(embeddedPage, {
            x: 0,
            y: 0,
            width: width,
            height: height
          });
        } else {
          // 'over' layer - standard watermarking (draw on top of existing content)
          await drawWatermarkOnPage(page, pdfDoc, font, image);
        }
        
        setProgress(Math.round(((i + 1) / pagesToWatermark.length) * 100));
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
      console.error('Watermarking error:', err);
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
    setThumbnails([]);
  };

  // Processing state
  if (isProcessing) {
    return (
      <div className="min-h-screen pattern-bg">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">Professional Watermarking</h1>
            <p className="text-lg text-muted-foreground">Adding watermark to your PDF...</p>
          </div>

          <Card className="glass p-12 text-center">
            <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Droplets className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Applying Watermark...</h3>
            <p className="text-muted-foreground mb-6" data-testid="text-progress-message">
              {progressMessage || "Processing your PDF"}
            </p>
            <div className="max-w-md mx-auto">
              <Progress value={progress} className="h-3 mb-3" data-testid="progress-watermark" />
              <p className="text-sm font-medium gradient-text">{progress}% complete</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Result state
  if (result) {
    return (
      <div className="min-h-screen pattern-bg">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <Link href="/all-tools?category=pdf-security">
              <Button variant="ghost" className="mb-4" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to PDF Tools
              </Button>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">Professional Watermarking</h1>
            <p className="text-lg text-muted-foreground">Your PDF has been watermarked successfully!</p>
          </div>

          <Card className="glass p-8">
            <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-center mb-8">Watermarking Complete!</h3>
            
            <div className="space-y-3 mb-8">
              <div className="glass rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="font-medium">Original Size</span>
                </div>
                <span className="text-sm font-bold" data-testid="text-original-size">{formatFileSize(result.originalSize)}</span>
              </div>

              <div className="glass rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-primary" />
                  <span className="font-medium">Watermarked Size</span>
                </div>
                <span className="text-sm font-bold" data-testid="text-watermarked-size">{formatFileSize(result.watermarkedSize)}</span>
              </div>

              <div className="glass rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-medium">Pages Processed</span>
                </div>
                <span className="text-sm font-bold" data-testid="text-pages-processed">{result.pagesProcessed}</span>
              </div>
            </div>

            <Button 
              onClick={downloadWatermarkedPdf}
              className="w-full btn-gradient text-white font-semibold mb-4"
              size="lg"
              id="download-button"
              data-testid="button-download"
            >
              <FileDown className="w-5 h-5 mr-2" />
              Download Watermarked PDF
            </Button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={reset}
                size="lg"
                data-testid="button-watermark-another"
              >
                Watermark Another File
              </Button>
              <Link href="/all-tools?category=pdf-security">
                <Button variant="ghost" size="lg" className="w-full" data-testid="button-back-tools">
                  Back to All Tools
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pattern-bg">
      <ToolSEO 
        toolName="PDF Watermark"
        description="Add professional watermarks to PDF files with advanced customization options"
        category="UtilitiesApplication"
        faqs={[]}
        rating={{ value: 4.8, count: 412 }}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumbs 
          items={[
            { name: "PDF Security", url: "/all-tools?category=pdf-security" },
            { name: "Watermark PDF", url: "/watermark-pdf" }
          ]}
        />

        <div className="text-center mb-10">
          <Link href="/all-tools?category=pdf-security">
            <Button 
              variant="ghost" 
              className="mb-4" 
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to PDF Tools
            </Button>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white mb-6 shadow-md">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Professional Watermarking</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-primary">
            Add Watermark to PDF
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Protect your documents with custom watermarks. Advanced controls for position, rotation, transparency, and more.
          </p>
        </div>

        <PrivacyNotice message="Your PDFs are processed entirely in your browser. Files never leave your device." />

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          <Card className="glass p-4 text-center" data-testid="card-feature-private">
            <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">100% Private</p>
          </Card>
          <Card className="glass p-4 text-center" data-testid="card-feature-instant">
            <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Instant Results</p>
          </Card>
          <Card className="glass p-4 text-center" data-testid="card-feature-secure">
            <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Secure Processing</p>
          </Card>
        </div>

        {!selectedFile ? (
          <FileUpload
            onFileSelect={handleFileSelect}
            accept="application/pdf"
            maxSize={100 * 1024 * 1024}
            title="Upload your PDF file"
            description="Drag & drop or click to select"
            className="mb-8"
            data-testid="upload-watermark-pdf"
          />
        ) : (
          <>
            {error && (
              <Alert className="mb-6 border-destructive/20 bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription data-testid="text-error">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-6 mb-8" id="config-section">
              {/* Left Column: PDF Preview with Thumbnails */}
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  PDF Preview
                </h3>
                
                <div className="glass rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate" data-testid="text-filename">{selectedFile.name}</span>
                    <span className="text-sm font-bold gradient-text flex-shrink-0 ml-2" data-testid="text-filesize">
                      {formatFileSize(selectedFile.size)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pdfDoc?.getPageCount()} pages
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-3">Page Thumbnails</h4>
                  {isLoadingThumbnails ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-muted/20 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" data-testid="container-thumbnails">
                      {thumbnails.map((thumb) => (
                        <div key={thumb.pageNum} className="relative group">
                          <div className="aspect-[3/4] border-2 border-muted rounded overflow-hidden bg-white">
                            <img 
                              src={thumb.dataUrl} 
                              alt={`Page ${thumb.pageNum}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            Page {thumb.pageNum}
                          </div>
                          {/* Watermark preview indicator */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-primary/10 backdrop-blur-sm p-2 rounded">
                              <Droplets className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {thumbnails.length > 0 && pdfDoc && thumbnails.length < pdfDoc.getPageCount() && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Showing first {thumbnails.length} of {pdfDoc.getPageCount()} pages
                    </p>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  onClick={reset}
                  className="w-full"
                  data-testid="button-upload-different"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Different File
                </Button>
              </Card>

              {/* Right Column: Watermark Options */}
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Watermark Options
                </h3>

                <Tabs value={watermarkType} onValueChange={(v) => setWatermarkType(v as WatermarkType)} className="mb-6">
                  <TabsList className="grid w-full grid-cols-2" data-testid="tabs-watermark-type">
                    <TabsTrigger value="text" data-testid="tab-text">
                      <Type className="w-4 h-4 mr-2" />
                      Place Text
                    </TabsTrigger>
                    <TabsTrigger value="image" data-testid="tab-image">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Place Image
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4 mt-4">
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
                      <Label htmlFor="fontFamily">Font Family</Label>
                      <Select value={fontFamily} onValueChange={(v) => setFontFamily(v as FontFamily)}>
                        <SelectTrigger id="fontFamily" className="mt-2" data-testid="select-font-family">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Helvetica">Arial / Helvetica</SelectItem>
                          <SelectItem value="Times">Times New Roman</SelectItem>
                          <SelectItem value="Courier">Courier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="mb-2 block">Text Formatting</Label>
                      <div className="flex gap-2" data-testid="container-text-formatting">
                        <Button 
                          variant={isBold ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => setIsBold(!isBold)}
                          data-testid="button-bold"
                        >
                          <Bold className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant={isItalic ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => setIsItalic(!isItalic)}
                          data-testid="button-italic"
                        >
                          <Italic className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant={isUnderline ? "default" : "outline"} 
                          size="sm" 
                          onClick={() => setIsUnderline(!isUnderline)}
                          disabled
                          title="Underline coming soon"
                          data-testid="button-underline"
                        >
                          <Underline className="w-4 h-4" />
                        </Button>
                      </div>
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
                        data-testid="slider-font-size"
                      />
                    </div>

                    <div>
                      <Label htmlFor="color">Text Color</Label>
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
                          data-testid="input-color-hex"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4 mt-4">
                    <div>
                      <Label>Watermark Image</Label>
                      <FileUpload
                        accept="image/png,image/jpeg,image/jpg"
                        onFileSelect={handleImageUpload}
                        className="mt-2 min-h-[150px]"
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
                        min={5}
                        max={100}
                        step={5}
                        className="mt-2"
                        data-testid="slider-image-size"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Visual Position Grid */}
                <div className="mb-4">
                  <Label className="mb-3 block flex items-center gap-2">
                    <Grid3x3 className="w-4 h-4" />
                    Position
                  </Label>
                  <div className="grid grid-cols-3 gap-2 p-4 border rounded" data-testid="grid-position">
                    {positions.map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setPosition(pos)}
                        className={cn(
                          "aspect-square border-2 rounded flex items-center justify-center transition-all hover:bg-muted/50",
                          position === pos ? "border-primary bg-primary/10" : "border-muted"
                        )}
                        data-testid={`button-position-${pos}`}
                      >
                        {position === pos && <div className="w-3 h-3 bg-primary rounded-full" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transparency Controls */}
                <div className="mb-4">
                  <Label htmlFor="transparencyPreset">Transparency</Label>
                  <Select value={transparencyPreset} onValueChange={setTransparencyPreset}>
                    <SelectTrigger id="transparencyPreset" className="mt-2" data-testid="select-transparency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No transparency (0%)</SelectItem>
                      <SelectItem value="25">25% transparent</SelectItem>
                      <SelectItem value="50">50% transparent</SelectItem>
                      <SelectItem value="75">75% transparent</SelectItem>
                      <SelectItem value="100">Fully transparent (100%)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Slider
                    value={opacity}
                    onValueChange={setOpacity}
                    min={0}
                    max={100}
                    step={5}
                    className="mt-3"
                    data-testid="slider-opacity"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {opacity[0]}%
                  </p>
                </div>

                {/* Rotation Control */}
                <div className="mb-4">
                  <Label htmlFor="rotation">Rotation</Label>
                  <Select value={rotation.toString()} onValueChange={(v) => setRotation(parseInt(v))}>
                    <SelectTrigger id="rotation" className="mt-2" data-testid="select-rotation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Do not rotate (0°)</SelectItem>
                      <SelectItem value="45">45°</SelectItem>
                      <SelectItem value="90">90°</SelectItem>
                      <SelectItem value="180">180°</SelectItem>
                      <SelectItem value="270">270°</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Layer Options */}
                <div className="mb-4">
                  <Label className="mb-3 block">Layer</Label>
                  <div className="grid grid-cols-2 gap-3" data-testid="container-layer-options">
                    <button
                      onClick={() => setLayer('over')}
                      className={cn(
                        "p-4 border-2 rounded text-center cursor-pointer transition-all hover:bg-muted/50",
                        layer === 'over' ? "border-primary bg-primary/10" : "border-muted"
                      )}
                      data-testid="button-layer-over"
                    >
                      <Layers className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Over content</p>
                    </button>
                    <button
                      onClick={() => setLayer('below')}
                      className={cn(
                        "p-4 border-2 rounded text-center cursor-pointer transition-all hover:bg-muted/50",
                        layer === 'below' ? "border-primary bg-primary/10" : "border-muted"
                      )}
                      data-testid="button-layer-below"
                    >
                      <Layers className="w-6 h-6 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">Below content</p>
                    </button>
                  </div>
                </div>

                {/* Mosaic Mode */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mosaicMode" className="cursor-pointer">Mosaic Mode (Repeat Pattern)</Label>
                    <Checkbox 
                      id="mosaicMode"
                      checked={mosaicMode}
                      onCheckedChange={(checked) => setMosaicMode(checked as boolean)}
                      data-testid="checkbox-mosaic-mode"
                    />
                  </div>
                  {mosaicMode && (
                    <div className="mt-3">
                      <Label htmlFor="mosaicSpacing">Pattern Spacing: {mosaicSpacing[0]}px</Label>
                      <Slider
                        id="mosaicSpacing"
                        value={mosaicSpacing}
                        onValueChange={setMosaicSpacing}
                        min={50}
                        max={300}
                        step={10}
                        className="mt-2"
                        data-testid="slider-mosaic-spacing"
                      />
                    </div>
                  )}
                </div>

                {/* Page Range */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <Label htmlFor="allPages" className="cursor-pointer">Apply to All Pages</Label>
                    <Checkbox 
                      id="allPages"
                      checked={allPages}
                      onCheckedChange={(checked) => setAllPages(checked as boolean)}
                      data-testid="checkbox-all-pages"
                    />
                  </div>
                  {!allPages && pdfDoc && (
                    <div className="grid grid-cols-2 gap-4" data-testid="container-page-range">
                      <div>
                        <Label htmlFor="fromPage">From Page</Label>
                        <Input
                          id="fromPage"
                          type="number"
                          min={1}
                          max={pdfDoc.getPageCount()}
                          value={fromPage}
                          onChange={(e) => setFromPage(Math.max(1, Math.min(parseInt(e.target.value) || 1, pdfDoc.getPageCount())))}
                          className="mt-2"
                          data-testid="input-from-page"
                        />
                      </div>
                      <div>
                        <Label htmlFor="toPage">To Page</Label>
                        <Input
                          id="toPage"
                          type="number"
                          min={1}
                          max={pdfDoc.getPageCount()}
                          value={toPage}
                          onChange={(e) => setToPage(Math.max(1, Math.min(parseInt(e.target.value) || 1, pdfDoc.getPageCount())))}
                          className="mt-2"
                          data-testid="input-to-page"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={addWatermark}
                  className="w-full btn-gradient text-white font-semibold"
                  size="lg"
                  data-testid="button-add-watermark"
                >
                  <Droplets className="w-5 h-5 mr-2" />
                  Add Watermark
                </Button>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* SEO Sections */}
      <ContactSupportSection />
    </div>
  );
}
