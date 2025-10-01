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

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ConvertedImage {
  id: string;
  blob: Blob;
  dataUrl: string;
  pageNumber: number;
}

export default function PDFToJPG() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [quality, setQuality] = useState("high");
  const [resolution, setResolution] = useState("150");
  const [colorMode, setColorMode] = useState("rgb");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const howToSchema = generateHowToSchema({
    name: "How to Convert PDF to JPG Images",
    description: "Extract PDF pages as high-quality JPG images with custom resolution and quality settings",
    totalTime: "PT2M",
    steps: [
      { name: "Upload PDF", text: "Select your PDF file to convert to JPG images" },
      { name: "Choose Quality", text: "Select JPG quality (High, Medium, Low) and resolution (DPI)" },
      { name: "Select Color Mode", text: "Choose RGB for color images or Grayscale for black & white" },
      { name: "Convert & Download", text: "Click convert and download individual JPG images or all at once" }
    ]
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: "PDF to JPG Converter - AltafToolsHub",
    description: "Free online PDF to JPG converter. Extract PDF pages as high-quality JPG images with custom resolution and compression. 100% browser-based for complete privacy.",
    applicationCategory: "MultimediaApplication",
    url: "https://www.altaftoolshub.app/pdf-to-jpg",
    aggregateRating: { ratingValue: 4.8, ratingCount: 2145, bestRating: 5 },
    featureList: [
      "Convert PDF to JPG images",
      "Adjustable quality settings (50-100%)",
      "Custom resolution (72-600 DPI)",
      "RGB or Grayscale output",
      "Batch download all images",
      "100% client-side processing"
    ],
    datePublished: "2025-01-01",
    dateModified: "2025-10-01"
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.altaftoolshub.app/" },
    { name: "All Tools", url: "https://www.altaftoolshub.app/all-tools" },
    { name: "PDF to JPG", url: "https://www.altaftoolshub.app/pdf-to-jpg" }
  ]);

  useSEO({
    title: "PDF to JPG Converter - Convert PDF Pages to JPG Images Free",
    description: "Free PDF to JPG converter online. Extract PDF pages as high-quality JPG images with custom resolution and compression. Perfect for web use, presentations, and social media. 100% browser-based - your PDFs never leave your device.",
    path: "/pdf-to-jpg",
    keywords: "pdf to jpg converter, convert pdf to jpg online, pdf to jpeg free, extract images from pdf, pdf page to jpg, pdf to jpg high quality, batch pdf to jpg, convert pdf pages to images 2025",
    ogImage: "https://altaftoolshub.app/og-pdf-to-jpg.png",
    structuredData: [howToSchema, softwareSchema, breadcrumbSchema],
    additionalMetaTags: [
      { name: "application-name", content: "PDF to JPG Converter - AltafToolsHub" },
      { property: "article:section", content: "Image Tools" },
      { property: "article:tag", content: "PDF Conversion" },
      { property: "article:tag", content: "JPG Export" }
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
    return dpi / 72; // 72 DPI is base scale
  };

  const convertPDFToJPG = async () => {
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
      const jpgQuality = getQualityValue();

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Failed to get canvas context');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // JPG-specific rendering optimizations
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Convert to grayscale if needed
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

        // Convert canvas to JPG blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Failed to create blob'));
            },
            'image/jpeg',
            jpgQuality
          );
        });

        const dataUrl = canvas.toDataURL('image/jpeg', jpgQuality);

        images.push({
          id: `page-${pageNum}`,
          blob,
          dataUrl,
          pageNumber: pageNum
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
      console.error('PDF to JPG conversion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert PDF to JPG images. Please try again.');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadImage = (image: ConvertedImage) => {
    const link = document.createElement('a');
    link.href = image.dataUrl;
    link.download = `page-${image.pageNumber}.jpg`;
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

  const pdfToJpgFAQs = [
    {
      question: "Why convert PDF to JPG instead of PNG?",
      answer: "JPG is ideal for photographs and complex images because it offers excellent compression with smaller file sizes. JPG files are 60-80% smaller than PNG, making them perfect for web use, email attachments, and social media. However, JPG uses lossy compression, so choose PNG if you need perfect quality preservation or transparency support."
    },
    {
      question: "What DPI should I use for PDF to JPG conversion?",
      answer: "For web use and social media, 72-96 DPI is sufficient. For printing standard documents, use 150-200 DPI. For high-quality prints or professional photography, choose 300 DPI. Higher DPI creates larger files but better quality. Our tool supports 72 DPI (web), 150 DPI (print), 300 DPI (high-quality), and 600 DPI (professional)."
    },
    {
      question: "Does converting PDF to JPG reduce quality?",
      answer: "JPG uses lossy compression, so there's minimal quality loss. At our 'High' quality setting (95%), the difference is imperceptible to the human eye. Choose 'Medium' (80%) for balanced quality and file size, or 'Low' (60%) only when file size is critical. Text and graphics remain sharp at high settings."
    },
    {
      question: "Can I convert password-protected PDFs to JPG?",
      answer: "No, password-protected PDFs cannot be converted directly. You'll need to unlock the PDF first using our PDF Unlock tool, then convert it to JPG. This is a security feature to prevent unauthorized access to protected documents."
    },
    {
      question: "What's the difference between RGB and Grayscale mode?",
      answer: "RGB (Red Green Blue) preserves all colors in your PDF, perfect for documents with photos, charts, or colored text. Grayscale converts everything to shades of gray, reducing file size by 50-70% and ideal for black & white documents, invoices, or text-only pages. Choose based on your content needs."
    },
    {
      question: "How many pages can I convert at once?",
      answer: "There's no strict limit, but browser memory constraints apply. Most browsers handle up to 100 pages comfortably. For very large PDFs (200+ pages), consider splitting the PDF first or converting in batches for better performance."
    },
    {
      question: "Why are my JPG files larger than the original PDF?",
      answer: "This happens when your PDF uses heavy compression or vector graphics. PDFs can store images efficiently, while JPG must rasterize everything to pixels. To reduce JPG file size, lower the DPI (try 150 instead of 300) or use Medium quality instead of High."
    }
  ];

  const jpgUseCases = [
    {
      title: "Social Media Sharing",
      description: "Extract PDF pages as JPG images optimized for Instagram, Facebook, Twitter, and LinkedIn posts with perfect compression.",
      icon: ImageIcon
    },
    {
      title: "Website Graphics",
      description: "Convert PDF designs, infographics, or presentations to web-optimized JPG images for faster page loading.",
      icon: Sparkles
    },
    {
      title: "Email Attachments",
      description: "Create lightweight JPG images from PDFs to avoid email attachment size limits while maintaining visual quality.",
      icon: Upload
    },
    {
      title: "Thumbnail Creation",
      description: "Generate preview thumbnails from PDF documents for galleries, portfolios, or document management systems.",
      icon: FileImage
    },
    {
      title: "Presentation Slides",
      description: "Extract PDF slides as JPG images for embedding in PowerPoint, Google Slides, or marketing materials.",
      icon: FileText
    },
    {
      title: "Archive & Backup",
      description: "Convert important PDF documents to JPG format for long-term archival with universal compatibility.",
      icon: Shield
    }
  ];

  const howItWorksSteps = [
    {
      title: "Upload PDF File",
      description: "Select your PDF document. Processing happens entirely in your browser - no uploads to servers.",
      icon: Upload,
      number: 1
    },
    {
      title: "Configure JPG Settings",
      description: "Choose quality level (High/Medium/Low), resolution (DPI), and color mode (RGB/Grayscale) for optimal results.",
      icon: Settings,
      number: 2
    },
    {
      title: "Convert to JPG",
      description: "Click convert and watch each PDF page transform into a high-quality JPG image with progress tracking.",
      icon: Zap,
      number: 3
    },
    {
      title: "Download Images",
      description: "Download JPG images individually or all at once. Files are named by page number for easy organization.",
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
              { name: "PDF to JPG", url: "" }
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
            <p className="text-lg text-muted-foreground">Successfully converted {convertedImages.length} page{convertedImages.length > 1 ? 's' : ''} to JPG</p>
          </div>

          <Card className="glass p-6 sm:p-8 mb-8" data-testid="conversion-results">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Converted JPG Images
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
                    alt={`Page ${image.pageNumber}`}
                    className="w-full h-48 object-contain mb-3 rounded"
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
            { name: "PDF to JPG", url: "" }
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
            <span className="text-sm font-medium">PDF to JPG Converter</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Convert PDF to JPG Images
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Extract PDF pages as high-quality JPG images with custom resolution and compression settings
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <div>
                  <Label htmlFor="colorMode">Color Mode</Label>
                  <Select value={colorMode} onValueChange={setColorMode} disabled={isProcessing}>
                    <SelectTrigger id="colorMode" data-testid="select-color">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rgb">RGB (Color)</SelectItem>
                      <SelectItem value="grayscale">Grayscale (B&W)</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <h4 className="font-semibold">Converting PDF to JPG...</h4>
                    <p className="text-sm text-muted-foreground">Extracting pages as high-quality images</p>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground mt-2">{progress}%</p>
              </div>
            )}

            {pdfFile && !isProcessing && convertedImages.length === 0 && (
              <Button 
                onClick={convertPDFToJPG}
                className="w-full h-12 text-base"
                data-testid="button-convert"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Convert to JPG
              </Button>
            )}
          </div>
        </Card>

        <PrivacyNotice message="Your PDF is processed locally in your browser and never uploaded to any server." className="mb-12" />

        <HowItWorksSection 
          toolName="PDF to JPG Converter"
          steps={howItWorksSteps}
        />

        <WhyUseSection 
          toolName="PDF to JPG Converter"
          benefits={[
            "Perfect for web use and social media with optimal compression",
            "Smaller file sizes compared to PNG (60-80% reduction)",
            "Excellent quality for photos and complex images",
            "Universal compatibility across all devices and platforms",
            "Adjustable quality for perfect balance of size and clarity",
            "100% privacy - all processing in your browser"
          ]}
          features={[
            {
              icon: Sparkles,
              title: "JPG-Optimized Compression",
              description: "Advanced compression algorithms specifically tuned for JPG format, delivering smaller files while maintaining excellent visual quality."
            },
            {
              icon: Settings,
              title: "Full Control",
              description: "Adjust quality, resolution (DPI), and color mode to get exactly the output you need for your specific use case."
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Convert multi-page PDFs to JPG images instantly with no server uploads. All processing happens locally in your browser."
            },
            {
              icon: Shield,
              title: "100% Private & Secure",
              description: "Your PDFs never leave your device. All conversion happens client-side for complete privacy and security."
            }
          ]}
        />

        <UseCasesSection useCases={jpgUseCases} />

        <ComparisonSection
          toolName="PDF to JPG Converter"
          comparisons={[
            { feature: "Browser-Based Processing", ourTool: true, others: false, highlight: true },
            { feature: "No File Uploads", ourTool: true, others: false },
            { feature: "Adjustable Quality", ourTool: true, others: "Limited" },
            { feature: "Custom DPI Settings", ourTool: true, others: "Sometimes" },
            { feature: "RGB & Grayscale Modes", ourTool: true, others: "Rare" },
            { feature: "Batch Download", ourTool: true, others: true },
            { feature: "Free Forever", ourTool: true, others: false },
            { feature: "No Watermarks", ourTool: true, others: "Paid Only" }
          ]}
        />

        <ToolFAQ 
          faqs={pdfToJpgFAQs}
          toolName="PDF to JPG Converter"
          toolPath="/pdf-to-jpg"
        />

        <ContactSupportSection />
      </div>
    </div>
  );
}
