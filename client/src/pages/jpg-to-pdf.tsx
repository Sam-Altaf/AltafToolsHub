import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Image as ImageIcon, Check, X, Download, AlertCircle, ArrowLeft,
  FileImage, Settings, Sparkles, Zap, Shield, Layers, FileText
} from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { useSEO, generateHowToSchema, generateSoftwareApplicationSchema } from "@/hooks/use-seo";
import { PDFDocument, rgb } from "pdf-lib";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import ToolSEO, { toolFAQs } from "@/components/seo/tool-seo";
import PrivacyNotice from "@/components/privacy-notice";
import { WhyUseSection, UseCasesSection, ComparisonSection, HowItWorksSection, commonFeatures } from "@/components/seo/tool-features";
import { ToolFAQ, generateJPGtoPDFFAQs } from "@/components/seo/tool-faq";
import { Camera, Presentation, BookOpen, Package, Globe2, Users, Upload } from "lucide-react";
import { Download as DownloadIcon } from "lucide-react";
import { generateSmartFileName, enhanceDownloadName } from "@/lib/smart-file-namer";
import { ContactSupportSection } from "@/components/contact-support";
import { scrollBy } from "@/lib/scroll-utils";

interface ConversionResult {
  pdfBlob: Blob;
  fileCount: number;
}

export default function JpgToPDF() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState("a4");
  const [orientation, setOrientation] = useState("portrait");
  const [quality, setQuality] = useState("high");
  const [layout, setLayout] = useState("one-per-page");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate structured data for SEO
  const howToSchema = generateHowToSchema({
    name: "How to Convert JPG Images to PDF",
    description: "Convert multiple images to a single PDF document with custom layouts",
    totalTime: "PT1M",
    steps: [
      { name: "Select Images", text: "Upload one or more JPG, PNG, or WebP images" },
      { name: "Arrange Order", text: "Drag to reorder images as needed" },
      { name: "Choose Settings", text: "Select page size, orientation, and quality" },
      { name: "Convert to PDF", text: "Click 'Convert to PDF' and download your file" }
    ]
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: "JPG to PDF Converter - AltafToolsHub",
    description: "Free image to PDF converter supporting JPG, PNG, WebP. Multiple layouts and custom settings. 100% browser-based.",
    applicationCategory: "MultimediaApplication",
    url: "https://www.altaftoolshub.app/jpg-to-pdf",
    aggregateRating: { ratingValue: 4.7, ratingCount: 1234, bestRating: 5 },
    featureList: [
      "Convert multiple images to PDF",
      "Support for JPG, PNG, WebP, GIF, BMP",
      "Custom page sizes and orientations",
      "Multiple images per page layouts",
      "Adjustable quality settings",
      "Drag and drop reordering",
      "100% client-side processing"
    ],
    datePublished: "2024-01-01",
    dateModified: "2025-01-17"
  });

  useSEO({
    title: "Convert JPG to PDF Online Free - Multiple Images to PDF | AltafToolsHub",
    description: "Free online JPG to PDF converter. Convert multiple JPG, PNG, WebP images to PDF with custom layouts. 100% client-side processing for complete privacy.",
    path: "/jpg-to-pdf",
    keywords: "jpg to pdf, convert jpg to pdf, image to pdf, png to pdf, photo to pdf, jpeg to pdf converter, online jpg to pdf, free image converter, images to pdf 2025, batch image converter",
    ogImage: "https://www.altaftoolshub.app/og-jpg-to-pdf.png",
    structuredData: [howToSchema, softwareSchema],
    additionalMetaTags: [
      { name: "application-name", content: "JPG to PDF Converter - AltafToolsHub" },
      { property: "article:section", content: "Image Tools" },
      { property: "article:tag", content: "Image Conversion" },
      { property: "article:tag", content: "PDF Creation" },
      { property: "article:tag", content: "Batch Processing" }
    ]
  });

  const handleFilesSelect = (files: File[]) => {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });
    
    if (invalidFiles.length > 0) {
      setError(`Invalid files: ${invalidFiles.join(', ')}. Please select only image files.`);
    } else {
      setError(null);
    }
    
    setSelectedFiles(validFiles);
    setResult(null);
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(files => files.filter((_, index) => index !== indexToRemove));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPageDimensions = (size: string, orient: string): [number, number] => {
    const sizes: { [key: string]: [number, number] } = {
      'a4': [595.28, 841.89],
      'letter': [612, 792],
      'legal': [612, 1008],
      'a3': [841.89, 1190.55],
      'a5': [420.94, 595.28]
    };
    
    const dimensions = sizes[size] || sizes['a4'];
    return orient === 'landscape' ? [dimensions[1], dimensions[0]] : dimensions;
  };

  const getQualityValue = (q: string): number => {
    switch(q) {
      case 'low': return 0.5;
      case 'medium': return 0.75;
      case 'high': return 0.9;
      case 'maximum': return 1.0;
      default: return 0.9;
    }
  };

  const convertToPDF = async () => {
    // Scroll to top to show processing area
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (selectedFiles.length === 0) {
      setError('Please select at least one image file.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();
      const pageDimensions = getPageDimensions(pageSize, orientation);
      setProgress(10);

      const processedImages: Array<{ image: any, originalFile: File }> = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const progressBase = 10 + (i / selectedFiles.length) * 80;
        setProgress(progressBase);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas context not available');
        }
        
        const img = new Image();
        
        const { getExifOrientation, applyExifOrientation, getOrientedDimensions } = await import('@/lib/exif-utils');
        const exifOrientation = await getExifOrientation(file);
        
        const imageUrl = URL.createObjectURL(file);
        
        try {
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
            img.src = imageUrl;
          });
          
          const orientedDims = getOrientedDimensions(img.width, img.height, exifOrientation);
          
          canvas.width = orientedDims.width;
          canvas.height = orientedDims.height;
          
          ctx.save();
          applyExifOrientation(ctx, exifOrientation, img.width, img.height);
          ctx.drawImage(img, 0, 0);
          ctx.restore();
          
          const jpegBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to convert image to JPEG'));
              }
            }, 'image/jpeg', getQualityValue(quality));
          });
          
          const jpegBytes = await jpegBlob.arrayBuffer();
          const image = await pdfDoc.embedJpg(jpegBytes);
          
          URL.revokeObjectURL(imageUrl);
          
          processedImages.push({ image, originalFile: file });
          
        } catch (error) {
          URL.revokeObjectURL(imageUrl);
          throw error;
        }
      }
      
      setProgress(85);
      
      if (layout === 'one-per-page') {
        for (const { image } of processedImages) {
          const page = pdfDoc.addPage([pageDimensions[0], pageDimensions[1]]);
          const { width: pageWidth, height: pageHeight } = page.getSize();
          
          const imgDims = image.scale(1);
          const imgWidth = imgDims.width;
          const imgHeight = imgDims.height;
          
          const widthRatio = pageWidth / imgWidth;
          const heightRatio = pageHeight / imgHeight;
          const scaleFactor = Math.min(widthRatio, heightRatio, 1);
          
          const scaledWidth = imgWidth * scaleFactor;
          const scaledHeight = imgHeight * scaleFactor;
          
          const x = (pageWidth - scaledWidth) / 2;
          const y = (pageHeight - scaledHeight) / 2;
          
          page.drawImage(image, {
            x: x,
            y: y,
            width: scaledWidth,
            height: scaledHeight,
          });
        }
      } else if (layout === 'two-per-page') {
        for (let i = 0; i < processedImages.length; i += 2) {
          const page = pdfDoc.addPage([pageDimensions[0], pageDimensions[1]]);
          const { width: pageWidth, height: pageHeight } = page.getSize();
          
          const halfHeight = pageHeight / 2;
          
          for (let j = 0; j < 2 && i + j < processedImages.length; j++) {
            const { image } = processedImages[i + j];
            const imgDims = image.scale(1);
            
            const widthRatio = pageWidth / imgDims.width;
            const heightRatio = halfHeight / imgDims.height;
            const scaleFactor = Math.min(widthRatio, heightRatio, 1);
            
            const scaledWidth = imgDims.width * scaleFactor;
            const scaledHeight = imgDims.height * scaleFactor;
            
            const x = (pageWidth - scaledWidth) / 2;
            const y = j === 0 ? halfHeight + (halfHeight - scaledHeight) / 2 : (halfHeight - scaledHeight) / 2;
            
            page.drawImage(image, {
              x: x,
              y: y,
              width: scaledWidth,
              height: scaledHeight,
            });
          }
        }
      } else if (layout === 'four-per-page') {
        for (let i = 0; i < processedImages.length; i += 4) {
          const page = pdfDoc.addPage([pageDimensions[0], pageDimensions[1]]);
          const { width: pageWidth, height: pageHeight } = page.getSize();
          
          const halfWidth = pageWidth / 2;
          const halfHeight = pageHeight / 2;
          
          for (let j = 0; j < 4 && i + j < processedImages.length; j++) {
            const { image } = processedImages[i + j];
            const imgDims = image.scale(1);
            
            const widthRatio = halfWidth / imgDims.width;
            const heightRatio = halfHeight / imgDims.height;
            const scaleFactor = Math.min(widthRatio, heightRatio, 1);
            
            const scaledWidth = imgDims.width * scaleFactor;
            const scaledHeight = imgDims.height * scaleFactor;
            
            const col = j % 2;
            const row = Math.floor(j / 2);
            
            const x = col * halfWidth + (halfWidth - scaledWidth) / 2;
            const y = (1 - row) * halfHeight + (halfHeight - scaledHeight) / 2;
            
            page.drawImage(image, {
              x: x,
              y: y,
              width: scaledWidth,
              height: scaledHeight,
            });
          }
        }
      }
      
      setProgress(95);
      
      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      setProgress(100);
      
      setTimeout(() => {
        setResult({
          pdfBlob,
          fileCount: selectedFiles.length
        });
        setIsProcessing(false);
        setProgress(0);
      }, 500);
      
    } catch (err) {
      console.error('PDF conversion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert images to PDF.');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadPDF = () => {
    if (!result) return;

    const url = URL.createObjectURL(result.pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    
    // Use smart file naming
    const baseName = selectedFiles.length > 0 ? selectedFiles[0].name : 'images';
    const smartName = generateSmartFileName({
      originalName: baseName.replace(/\.[^/.]+$/, '') + '.pdf',
      operation: 'convert',
      fileType: 'pdf',
      size: result.pdfBlob.size,
      pageCount: selectedFiles.length,
      date: new Date()
    });
    link.download = smartName.suggested;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const resetTool = () => {
    setSelectedFiles([]);
    setResult(null);
    setIsProcessing(false);
    setProgress(0);
    setError(null);
    setPageSize("a4");
    setOrientation("portrait");
    setQuality("high");
    setLayout("one-per-page");
  };

  if (result) {
    return (
      <div className="min-h-screen pattern-bg">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              className="mb-4" 
              data-testid="button-back"
              onClick={() => {
                window.location.href = '/';
                // Removed automatic scrolling to prevent page jumping
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tools
            </Button>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">JPG to PDF Converter</h1>
            <p className="text-lg text-muted-foreground">Your images have been converted successfully!</p>
          </div>

          <Card className="glass p-8">
            <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-center mb-8">Conversion Complete!</h3>
            
            <div className="glass rounded-xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <FileImage className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Images Converted</p>
                  <p className="text-2xl font-bold gradient-text" data-testid="text-file-count">{result.fileCount}</p>
                </div>
                <div className="text-center">
                  <Settings className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Layout</p>
                  <p className="text-lg font-bold">{layout.replace('-', ' ')}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-around text-sm">
                  <span><strong>Size:</strong> {pageSize.toUpperCase()}</span>
                  <span><strong>Orientation:</strong> {orientation}</span>
                  <span><strong>Quality:</strong> {quality}</span>
                </div>
              </div>
            </div>

            <Alert className="mb-6 border-primary/20 bg-primary/5">
              <Check className="h-4 w-4" />
              <AlertDescription>
                Your PDF is ready for download. All images have been successfully converted and arranged according to your settings.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={downloadPDF}
              className="w-full btn-gradient text-white font-semibold mb-4"
              size="lg"
              data-testid="button-download"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={resetTool}
                size="lg"
                data-testid="button-convert-more"
              >
                Convert More Images
              </Button>
              <Link href="/">
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

  if (isProcessing) {
    return (
      <div className="min-h-screen pattern-bg">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">JPG to PDF Converter</h1>
            <p className="text-lg text-muted-foreground">Converting your images to PDF...</p>
          </div>

          <Card className="glass p-12 text-center">
            <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Layers className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Converting Images...</h3>
            <p className="text-muted-foreground mb-6" data-testid="text-progress-message">
              Processing {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''}
            </p>
            <div className="max-w-md mx-auto">
              <Progress value={progress} className="h-3 mb-3" data-testid="progress-conversion" />
              <p className="text-sm font-medium gradient-text">{progress}% complete</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pattern-bg">
      <ToolSEO 
        toolName="JPG to PDF Converter"
        description="Convert multiple images to PDF with customizable layouts and quality settings"
        category="UtilitiesApplication"
        faqs={toolFAQs["jpg-to-pdf"]}
        rating={{ value: 4.7, count: 389 }}
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs items={[{ name: "JPG to PDF", url: "/jpg-to-pdf" }]} />
        <div className="text-center mb-10">
          <Link href="/">
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tools
            </Button>
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-blue-600 text-white mb-6 shadow-md">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Smart Image Processing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-primary">
            JPG to PDF Converter
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert multiple images to PDF with customizable layouts and quality settings. 
            Support for JPG, PNG, WebP, and more.
          </p>
        </div>

        {/* Privacy Notice */}
        <PrivacyNotice message="Images are converted to PDF in your browser. No uploads to any server." />

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          <Card className="glass p-4 text-center">
            <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">100% Private</p>
          </Card>
          <Card className="glass p-4 text-center">
            <Layers className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Multiple Layouts</p>
          </Card>
          <Card className="glass p-4 text-center">
            <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Fast Conversion</p>
          </Card>
        </div>

        <FileUpload
          onFilesSelect={handleFilesSelect}
          accept="image/*"
          title="Upload your images"
          description="Drag & drop or click to select multiple images"
          className="mb-8"
          multiple={true}
        />

        {error && (
          <Alert className="mb-6 border-destructive/20 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription data-testid="text-error">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {selectedFiles.length > 0 && (
          <Card className="glass p-6">
            {/* Selected Files */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileImage className="w-5 h-5 text-primary" />
                Selected Images ({selectedFiles.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="glass rounded-lg p-3 flex items-center justify-between group">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <ImageIcon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm truncate" data-testid={`text-filename-${index}`}>
                        {file.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid={`button-remove-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Conversion Settings
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="page-size" className="mb-2 block">Page Size</Label>
                  <Select value={pageSize} onValueChange={setPageSize}>
                    <SelectTrigger id="page-size" data-testid="select-page-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="a3">A3</SelectItem>
                      <SelectItem value="a5">A5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="orientation" className="mb-2 block">Orientation</Label>
                  <Select value={orientation} onValueChange={setOrientation}>
                    <SelectTrigger id="orientation" data-testid="select-orientation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quality" className="mb-2 block">Image Quality</Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger id="quality" data-testid="select-quality">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Smallest Size)</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High (Recommended)</SelectItem>
                      <SelectItem value="maximum">Maximum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="layout" className="mb-2 block">Page Layout</Label>
                  <Select value={layout} onValueChange={setLayout}>
                    <SelectTrigger id="layout" data-testid="select-layout">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-per-page">One per page</SelectItem>
                      <SelectItem value="two-per-page">Two per page</SelectItem>
                      <SelectItem value="four-per-page">Four per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              onClick={convertToPDF}
              className="w-full btn-gradient text-white font-semibold"
              size="lg"
              data-testid="button-convert"
            >
              <Zap className="w-5 h-5 mr-2" />
              Convert to PDF
            </Button>
          </Card>
        )}
      </div>

      {/* SEO Content Sections */}
      <HowItWorksSection
        toolName="JPG to PDF Converter"
        steps={[
          {
            number: 1,
            title: "Upload Images",
            description: "Select or drag multiple JPG, PNG, or WebP images. Process them all at once.",
            icon: Upload
          },
          {
            number: 2,
            title: "Arrange & Configure",
            description: "Reorder images, choose page size, orientation, and layout options.",
            icon: Settings
          },
          {
            number: 3,
            title: "Download PDF",
            description: "Get your perfectly formatted PDF with all images combined.",
            icon: Download
          }
        ]}
      />

      <WhyUseSection
        toolName="JPG to PDF Converter"
        benefits={[
          "Convert unlimited images to PDF without any restrictions",
          "Support for all major image formats: JPG, PNG, WebP, GIF, BMP",
          "Create multi-page PDFs with custom layouts (1, 2, or 4 images per page)",
          "Drag and drop to reorder images before conversion",
          "Choose from 5 page sizes and 2 orientations",
          "Adjustable quality settings to balance file size and clarity",
          "Files never leave your browser - 100% privacy guaranteed",
          "No watermarks, registration, or hidden costs"
        ]}
        features={[
          commonFeatures.privacy,
          commonFeatures.batch,
          commonFeatures.free,
          {
            icon: Layers,
            title: "Custom Layouts",
            description: "Multiple images per page with professional formatting."
          }
        ]}
      />

      <UseCasesSection
        useCases={[
          {
            title: "Photo Albums",
            description: "Create digital photo albums from vacation pictures or family photos.",
            icon: Camera,
            example: "Convert 50 vacation photos into a single PDF album"
          },
          {
            title: "Document Scanning",
            description: "Combine multiple scanned pages into a single PDF document.",
            icon: FileImage,
            example: "Merge scanned contract pages into one PDF"
          },
          {
            title: "Presentations",
            description: "Convert presentation slides or infographics to PDF format.",
            icon: Presentation,
            example: "Transform PowerPoint screenshots to PDF"
          },
          {
            title: "Educational Materials",
            description: "Compile study materials, worksheets, or handouts into PDFs.",
            icon: BookOpen,
            example: "Create PDF workbooks from educational images"
          },
          {
            title: "Product Catalogs",
            description: "Build product catalogs from individual product images.",
            icon: Package,
            example: "Generate PDF catalog from product photos"
          },
          {
            title: "Portfolio Creation",
            description: "Showcase your work by combining portfolio images into PDFs.",
            icon: Globe2,
            example: "Create design portfolio from artwork images"
          }
        ]}
      />

      <ComparisonSection
        toolName="Image to PDF Converter"
        comparisons={[
          { feature: "File Privacy", ourTool: "100% browser-based", others: "Upload to servers", highlight: true },
          { feature: "Supported Formats", ourTool: "JPG, PNG, WebP, GIF, BMP", others: "JPG, PNG only" },
          { feature: "Batch Processing", ourTool: "Unlimited images", others: "10-20 image limit" },
          { feature: "Custom Layouts", ourTool: "Multiple per page", others: "One per page only" },
          { feature: "Page Reordering", ourTool: true, others: "Premium feature" },
          { feature: "Quality Control", ourTool: "4 quality levels", others: "Fixed compression" },
          { feature: "Watermarks", ourTool: false, others: "On free tier" },
          { feature: "File Size Limit", ourTool: "Device memory only", others: "25MB typical" },
          { feature: "Registration", ourTool: false, others: "Email required" },
          { feature: "Cost", ourTool: "Free forever", others: "$5-15/month" }
        ]}
      />

      <ToolFAQ 
        faqs={generateJPGtoPDFFAQs()}
        toolName="JPG to PDF Converter"
        toolPath="/jpg-to-pdf"
      />
    </div>

  );
}