import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Image as ImageIcon, Check, X, Download, AlertCircle, ArrowLeft,
  FileImage, Settings, Sparkles, Zap, Shield, FileText, Upload
} from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { useSEO, generateHowToSchema, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import PrivacyNotice from "@/components/privacy-notice";
import { WhyUseSection, UseCasesSection, ComparisonSection, HowItWorksSection } from "@/components/seo/tool-features";
import { ToolFAQ } from "@/components/seo/tool-faq";
import { ContactSupportSection } from "@/components/contact-support";
import { scrollToProcessing } from "@/lib/scroll-utils";
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface ConvertedImage {
  id: string;
  blob: Blob;
  dataUrl: string;
  pageNumber: number;
  format: string;
}

export default function PDFToImages() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [format, setFormat] = useState("png");
  const [quality, setQuality] = useState("high");
  const [resolution, setResolution] = useState("150");
  const [colorMode, setColorMode] = useState("rgba");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const howToSchema = generateHowToSchema({
    name: "How to Convert PDF to Images",
    description: "Extract PDF pages as images in JPG, PNG, or WEBP format with custom settings",
    totalTime: "PT2M",
    steps: [
      { name: "Upload PDF", text: "Select your PDF file to convert to images" },
      { name: "Choose Format", text: "Select output format: JPG (small), PNG (quality), or WEBP (modern)" },
      { name: "Configure Settings", text: "Adjust quality, resolution, and color settings for your needs" },
      { name: "Convert & Download", text: "Click convert and download individual images or all at once" }
    ]
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: "PDF to Images Converter - AltafToolsHub",
    description: "Free online PDF to Images converter. Extract PDF pages as JPG, PNG, or WEBP images with custom quality and resolution. Choose the perfect format for your needs. 100% browser-based.",
    applicationCategory: "MultimediaApplication",
    url: "https://www.altaftoolshub.app/pdf-to-images",
    aggregateRating: { ratingValue: 4.8, ratingCount: 2543, bestRating: 5 },
    featureList: [
      "Convert PDF to JPG, PNG, or WEBP",
      "Choose best format for your needs",
      "Adjustable quality and resolution",
      "RGB, RGBA, or Grayscale modes",
      "Batch download all images",
      "100% client-side processing"
    ],
    datePublished: "2025-01-01",
    dateModified: "2025-10-01"
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.altaftoolshub.app/" },
    { name: "All Tools", url: "https://www.altaftoolshub.app/all-tools" },
    { name: "PDF to Images", url: "https://www.altaftoolshub.app/pdf-to-images" }
  ]);

  useSEO({
    title: "PDF to Images Converter - Convert PDF to JPG, PNG, WEBP Free",
    description: "Free PDF to Images converter online. Extract PDF pages as JPG, PNG, or WEBP images with custom quality and resolution. Choose the perfect format for web, print, or sharing. 100% browser-based - your PDFs never leave your device.",
    path: "/pdf-to-images",
    keywords: "pdf to images converter, convert pdf to images online, pdf to jpg png webp, extract images from pdf, pdf page to image, pdf to picture converter, batch pdf to images 2025",
    ogImage: "https://altaftoolshub.app/og-pdf-to-images.png",
    structuredData: [howToSchema, softwareSchema, breadcrumbSchema],
    additionalMetaTags: [
      { name: "application-name", content: "PDF to Images Converter - AltafToolsHub" },
      { property: "article:section", content: "Image Tools" },
      { property: "article:tag", content: "PDF Conversion" },
      { property: "article:tag", content: "Image Export" }
    ]
  });

  const handleFileSelect = (file: File) => {
    if (!file.type.includes('pdf')) {
      setError('Please select a PDF file.');
      return;
    }
    setPdfFile(file);
    setConvertedImages([]);
    setError(null);
  };

  const getQualityValue = () => {
    switch (quality) {
      case "low": return 0.6;
      case "medium": return 0.8;
      case "high": return 0.95;
      default: return 0.95;
    }
  };

  const getDPIScale = () => {
    const dpi = parseInt(resolution);
    return dpi / 72;
  };

  const getFileExtension = () => {
    return format;
  };

  const getMimeType = () => {
    switch (format) {
      case "jpg": return "image/jpeg";
      case "png": return "image/png";
      case "webp": return "image/webp";
      default: return "image/png";
    }
  };

  const convertPDFToImages = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    scrollToProcessing();

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      setProgress(10);

      const images: ConvertedImage[] = [];
      const scale = getDPIScale();
      const qualityValue = getQualityValue();

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const enableAlpha = (format === 'png' || format === 'webp') && colorMode === 'rgba';
        const context = canvas.getContext('2d', { 
          alpha: enableAlpha,
          willReadFrequently: false 
        });
        if (!context) throw new Error('Failed to get canvas context');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // High-quality rendering
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        // Handle background based on format
        if (enableAlpha) {
          // Clear with transparent background for PNG/WEBP RGBA mode
          context.clearRect(0, 0, canvas.width, canvas.height);
        } else if (format === 'jpg') {
          // JPG doesn't support transparency - fill with white background
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
        }

        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas
        }).promise;

        // Apply grayscale if needed
        if (colorMode === "grayscale") {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = gray;
            data[i + 1] = gray;
            data[i + 2] = gray;
          }
          
          context.putImageData(imageData, 0, 0);
        }

        // Convert canvas to selected format
        const blob = await new Promise<Blob>((resolve, reject) => {
          const mimeType = getMimeType();
          
          if (format === 'png') {
            // PNG - lossless, no quality parameter
            canvas.toBlob(
              (blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Failed to create blob'));
              },
              mimeType
            );
          } else {
            // JPG or WEBP - with quality parameter
            canvas.toBlob(
              (blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Failed to create blob'));
              },
              mimeType,
              qualityValue
            );
          }
        });

        const dataUrl = format === 'png' 
          ? canvas.toDataURL(getMimeType())
          : canvas.toDataURL(getMimeType(), qualityValue);

        images.push({
          id: `page-${pageNum}`,
          blob,
          dataUrl,
          pageNumber: pageNum,
          format: format.toUpperCase()
        });

        setProgress(10 + Math.round((pageNum / numPages) * 80));
      }

      setProgress(100);

      setTimeout(() => {
        setConvertedImages(images);
        setIsProcessing(false);
        setProgress(0);

        setTimeout(() => {
          const resultsSection = document.querySelector('[data-testid="conversion-results"]');
          if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }, 300);

    } catch (err) {
      console.error('PDF to Images conversion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert PDF to images. Please try again.');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadImage = (image: ConvertedImage) => {
    const link = document.createElement('a');
    link.href = image.dataUrl;
    link.download = `page-${image.pageNumber}.${getFileExtension()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = () => {
    convertedImages.forEach((image, index) => {
      setTimeout(() => {
        downloadImage(image);
      }, index * 200);
    });
  };

  const clearAll = () => {
    setPdfFile(null);
    setConvertedImages([]);
    setError(null);
    setProgress(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const pdfToImagesFAQs = [
    {
      question: "Which format should I choose: JPG, PNG, or WEBP?",
      answer: "JPG is best for photographs and complex images when file size matters (social media, web). PNG is perfect for graphics, logos, text, and screenshots requiring lossless quality or transparency. WEBP offers the best of both - excellent compression like JPG with transparency support like PNG, but has limited compatibility with older browsers and software."
    },
    {
      question: "What's the advantage of having format choice?",
      answer: "Different formats excel at different tasks. With format choice, you can optimize each PDF conversion for its specific use case: JPG for web sharing (smallest files), PNG for quality preservation (graphics/text), or WEBP for modern web applications (best compression + transparency). This flexibility saves you from converting between formats later."
    },
    {
      question: "Does WEBP really reduce file size?",
      answer: "Yes! WEBP typically produces 25-35% smaller files than JPG at the same quality level and 25-50% smaller than PNG for images with similar visual quality. Google developed WEBP specifically for web use. However, support is limited in older software like Photoshop CS6 or Windows Photo Viewer on Windows 7/8."
    },
    {
      question: "Can I preserve transparency with this tool?",
      answer: "Yes, if you select PNG or WEBP format with RGBA color mode. JPG does not support transparency and will render transparent areas as white. For logos, graphics, or any image with transparent backgrounds, choose PNG (universal compatibility) or WEBP (modern, smaller files)."
    },
    {
      question: "What resolution should I use for different purposes?",
      answer: "72 DPI for web/social media (screens), 150 DPI for standard printing (documents, flyers), 300 DPI for high-quality printing (magazines, professional photos), 600 DPI for professional graphics or archival purposes. Higher DPI creates larger files but more detail. Match your DPI to your end use."
    },
    {
      question: "Why are my image files different sizes with different formats?",
      answer: "Each format uses different compression algorithms. JPG heavily compresses (small files, slight quality loss), PNG preserves perfectly (larger files, zero loss), WEBP balances both (small files with excellent quality). Additionally, PNG files with transparency or complex graphics may be larger than simplified JPG versions."
    },
    {
      question: "Can I convert password-protected PDFs?",
      answer: "No, you must unlock password-protected PDFs first using our PDF Unlock tool, then convert to images. This is a security measure to prevent unauthorized access to protected documents."
    },
    {
      question: "How do I batch convert multiple PDFs to images?",
      answer: "Currently, you can convert one PDF at a time, but all pages within that PDF are converted in one operation. You can download all resulting images at once using the 'Download All' button. For multiple separate PDF files, repeat the process for each file."
    }
  ];

  const imageUseCases = [
    {
      title: "Choose Format by Purpose",
      description: "Select JPG for web sharing, PNG for quality graphics, or WEBP for modern web applications - all from one tool.",
      icon: Sparkles
    },
    {
      title: "Social Media Posts",
      description: "Convert PDFs to optimized JPG or WEBP images perfect for Instagram, Facebook, Twitter, and LinkedIn with smaller file sizes.",
      icon: ImageIcon
    },
    {
      title: "Professional Graphics",
      description: "Extract logos, diagrams, and graphics as lossless PNG images with transparency for design work and presentations.",
      icon: FileImage
    },
    {
      title: "Web Optimization",
      description: "Create modern WEBP images for your website to reduce page load times by 25-50% while maintaining visual quality.",
      icon: Zap
    },
    {
      title: "Documentation & Tutorials",
      description: "Generate high-quality PNG screenshots from technical PDFs for wikis, guides, and training materials.",
      icon: FileText
    },
    {
      title: "Email Attachments",
      description: "Convert PDFs to compressed JPG images to avoid email size limits while sharing documents quickly.",
      icon: Upload
    }
  ];

  const howItWorksSteps = [
    {
      title: "Upload PDF File",
      description: "Select your PDF document. All processing happens in your browser - no server uploads required.",
      icon: Upload,
      number: 1
    },
    {
      title: "Choose Image Format",
      description: "Select JPG (small, web), PNG (quality, transparency), or WEBP (modern, efficient) based on your needs.",
      icon: Settings,
      number: 2
    },
    {
      title: "Configure Settings",
      description: "Adjust quality, resolution (DPI), and color mode (RGB/RGBA/Grayscale) for optimal results.",
      icon: Sparkles,
      number: 3
    },
    {
      title: "Convert & Download",
      description: "Click convert and download images individually or all at once. Files are named by page number.",
      icon: Download,
      number: 4
    }
  ];

  if (convertedImages.length > 0) {
    return (
      <div className="min-h-screen pattern-bg">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Breadcrumbs 
            items={[
              { name: "All Tools", url: "/all-tools" },
              { name: "PDF to Images", url: "" }
            ]}
          />

          <div className="text-center mb-8">
            <Link href="/all-tools">
              <Button variant="ghost" className="mb-4" asChild data-testid="button-back">
                <span>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tools
                </span>
              </Button>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">Conversion Complete!</h1>
            <p className="text-lg text-muted-foreground">Successfully converted {convertedImages.length} page{convertedImages.length > 1 ? 's' : ''} to {convertedImages[0]?.format || 'images'}</p>
          </div>

          <Card className="glass p-6 sm:p-8 mb-8" data-testid="conversion-results">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Converted Images ({convertedImages[0]?.format})
              </h3>
              <Button
                onClick={downloadAllImages}
                className="flex items-center gap-2"
                data-testid="button-download-all"
              >
                <Download className="w-4 h-4" />
                Download All
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {convertedImages.map((image) => (
                <div 
                  key={image.id}
                  className="glass rounded-lg p-4 hover:bg-background/70 transition-colors"
                  data-testid={`image-${image.pageNumber}`}
                >
                  <img 
                    src={image.dataUrl} 
                    alt={`PDF page ${image.pageNumber} converted to ${image.format || 'image'}`}
                    width="300"
                    height="192"
                    className="w-full h-48 object-contain mb-3 rounded"
                    loading="lazy"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Page {image.pageNumber}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(image.blob.size)}</p>
                    </div>
                    <Button
                      onClick={() => downloadImage(image)}
                      variant="outline"
                      size="sm"
                      data-testid={`button-download-${image.pageNumber}`}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <Button 
                onClick={clearAll}
                variant="outline"
                className="w-full"
                data-testid="button-convert-another"
              >
                Convert Another PDF
              </Button>
            </div>
          </Card>

          <PrivacyNotice message="Your PDF is processed locally in your browser and never uploaded to any server." className="mb-8" />
          
          <ContactSupportSection />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pattern-bg">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs 
          items={[
            { name: "All Tools", url: "/all-tools" },
            { name: "PDF to Images", url: "" }
          ]}
        />

        <div className="text-center mb-8">
          <Link href="/all-tools">
            <Button variant="ghost" className="mb-4" asChild data-testid="button-back-to-tools">
              <span>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </span>
            </Button>
          </Link>
          
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <ImageIcon className="w-4 h-4" />
            <span className="text-sm font-medium">PDF to Images Converter</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Convert PDF to Images
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Extract PDF pages as JPG, PNG, or WEBP images - choose the perfect format for your needs
          </p>
        </div>

        <Card className="glass p-6 sm:p-8 mb-12" data-testid="upload-section">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload PDF File
              </h3>
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".pdf,application/pdf"
                multiple={false}
                maxSize={100 * 1024 * 1024}
                title="Upload PDF"
                description="Drag and drop your PDF here or click to browse"
              />
              {pdfFile && (
                <div className="mt-4 p-4 glass rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{pdfFile.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(pdfFile.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    disabled={isProcessing}
                    data-testid="button-clear"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {pdfFile && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="format">Output Format</Label>
                    <Select value={format} onValueChange={setFormat} disabled={isProcessing}>
                      <SelectTrigger id="format" data-testid="select-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jpg">JPG (Small, Web)</SelectItem>
                        <SelectItem value="png">PNG (Quality, Transparency)</SelectItem>
                        <SelectItem value="webp">WEBP (Modern, Efficient)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {format !== 'png' && (
                    <div>
                      <Label htmlFor="quality">Quality</Label>
                      <Select value={quality} onValueChange={setQuality} disabled={isProcessing}>
                        <SelectTrigger id="quality" data-testid="select-quality">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High (95%)</SelectItem>
                          <SelectItem value="medium">Medium (80%)</SelectItem>
                          <SelectItem value="low">Low (60%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="resolution">Resolution (DPI)</Label>
                    <Select value={resolution} onValueChange={setResolution} disabled={isProcessing}>
                      <SelectTrigger id="resolution" data-testid="select-resolution">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="72">72 DPI (Web)</SelectItem>
                        <SelectItem value="150">150 DPI (Standard Print)</SelectItem>
                        <SelectItem value="300">300 DPI (High Quality)</SelectItem>
                        <SelectItem value="600">600 DPI (Professional)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="colorMode">Color Mode</Label>
                    <Select value={colorMode} onValueChange={setColorMode} disabled={isProcessing}>
                      <SelectTrigger id="colorMode" data-testid="select-color">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rgba">
                          {format === 'png' || format === 'webp' ? 'RGBA (Color + Transparency)' : 'RGB (Color)'}
                        </SelectItem>
                        <SelectItem value="grayscale">Grayscale (B&W)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isProcessing && (
              <div className="glass rounded-lg p-6" data-testid="processing-section">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <div>
                    <h4 className="font-semibold">Converting PDF to {format.toUpperCase()}...</h4>
                    <p className="text-sm text-muted-foreground">Extracting pages as high-quality images</p>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground mt-2">{progress}%</p>
              </div>
            )}

            {pdfFile && !isProcessing && convertedImages.length === 0 && (
              <Button 
                onClick={convertPDFToImages}
                className="w-full h-12 text-base"
                data-testid="button-convert"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Convert to {format.toUpperCase()}
              </Button>
            )}
          </div>
        </Card>

        <PrivacyNotice message="Your PDF is processed locally in your browser and never uploaded to any server." className="mb-12" />

        <HowItWorksSection 
          toolName="PDF to Images Converter"
          steps={howItWorksSteps}
        />

        <WhyUseSection 
          toolName="PDF to Images Converter"
          benefits={[
            "Choose the perfect format - JPG, PNG, or WEBP",
            "Optimize file size vs quality for your specific needs",
            "Transparency support with PNG and WEBP formats",
            "Modern WEBP format for 25-50% smaller files",
            "One tool for all image format needs",
            "100% privacy - all processing in your browser"
          ]}
          features={[
            {
              icon: Sparkles,
              title: "Format Flexibility",
              description: "Choose between JPG (smallest), PNG (highest quality + transparency), or WEBP (best balance) based on your specific requirements."
            },
            {
              icon: Settings,
              title: "Customizable Output",
              description: "Adjust quality, resolution (DPI), and color mode independently for each conversion to get exactly what you need."
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Convert multi-page PDFs instantly with no server uploads. All processing happens locally in your browser."
            },
            {
              icon: Shield,
              title: "100% Private & Secure",
              description: "Your PDFs never leave your device. All conversion happens client-side for complete privacy and security."
            }
          ]}
        />

        <UseCasesSection useCases={imageUseCases} />

        <ComparisonSection
          toolName="PDF to Images Converter"
          comparisons={[
            { feature: "Browser-Based Processing", ourTool: true, others: false, highlight: true },
            { feature: "No File Uploads", ourTool: true, others: false },
            { feature: "Multiple Format Options", ourTool: "JPG/PNG/WEBP", others: "1-2 formats" },
            { feature: "Transparency Support", ourTool: true, others: "PNG only" },
            { feature: "WEBP Format Support", ourTool: true, others: false },
            { feature: "Custom DPI Settings", ourTool: true, others: "Sometimes" },
            { feature: "Quality Control", ourTool: true, others: "Limited" },
            { feature: "Free Forever", ourTool: true, others: false },
            { feature: "No Watermarks", ourTool: true, others: "Paid Only" }
          ]}
        />

        <ToolFAQ 
          faqs={pdfToImagesFAQs}
          toolName="PDF to Images Converter"
          toolPath="/pdf-to-images"
        />

        <ContactSupportSection />
      </div>
    </div>
  );
}
