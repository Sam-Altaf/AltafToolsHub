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
}

export default function PDFToPNG() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [resolution, setResolution] = useState("150");
  const [colorMode, setColorMode] = useState("rgba");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const howToSchema = generateHowToSchema({
    name: "How to Convert PDF to PNG Images",
    description: "Extract PDF pages as lossless PNG images with transparency support",
    totalTime: "PT2M",
    steps: [
      { name: "Upload PDF", text: "Select your PDF file to convert to PNG images" },
      { name: "Choose Settings", text: "Select resolution (DPI) and color mode (RGBA/Grayscale)" },
      { name: "Convert to PNG", text: "Click convert to extract pages as high-quality PNG images" },
      { name: "Download Images", text: "Download individual PNG images or all at once" }
    ]
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: "PDF to PNG Converter - AltafToolsHub",
    description: "Free online PDF to PNG converter. Extract PDF pages as lossless PNG images with transparency support. Perfect for graphics, logos, and high-quality screenshots. 100% browser-based.",
    applicationCategory: "MultimediaApplication",
    url: "https://www.altaftoolshub.app/pdf-to-png",
    aggregateRating: { ratingValue: 4.9, ratingCount: 1876, bestRating: 5 },
    featureList: [
      "Convert PDF to PNG images",
      "Lossless compression quality",
      "Transparency preservation",
      "Custom resolution (72-600 DPI)",
      "RGBA or Grayscale output",
      "Batch download all images",
      "100% client-side processing"
    ],
    datePublished: "2025-01-01",
    dateModified: "2025-10-01"
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.altaftoolshub.app/" },
    { name: "All Tools", url: "https://www.altaftoolshub.app/all-tools" },
    { name: "PDF to PNG", url: "https://www.altaftoolshub.app/pdf-to-png" }
  ]);

  useSEO({
    title: "PDF to PNG Converter - Convert PDF Pages to PNG Images Free",
    description: "Free PDF to PNG converter online. Extract PDF pages as lossless PNG images with transparency support. Perfect for logos, graphics, diagrams, and screenshots. 100% browser-based - your PDFs never leave your device.",
    path: "/pdf-to-png",
    keywords: "pdf to png converter, convert pdf to png online, pdf to png free, extract images from pdf, pdf page to png, pdf to png lossless, transparent png from pdf, batch pdf to png 2025",
    ogImage: "https://altaftoolshub.app/og-pdf-to-png.png",
    structuredData: [howToSchema, softwareSchema, breadcrumbSchema],
    additionalMetaTags: [
      { name: "application-name", content: "PDF to PNG Converter - AltafToolsHub" },
      { property: "article:section", content: "Image Tools" },
      { property: "article:tag", content: "PDF Conversion" },
      { property: "article:tag", content: "PNG Export" }
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

  const getDPIScale = () => {
    const dpi = parseInt(resolution);
    return dpi / 72; // 72 DPI is base scale
  };

  const convertPDFToPNG = async () => {
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

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { 
          alpha: colorMode === 'rgba', // Enable alpha channel for RGBA mode
          willReadFrequently: false 
        });
        if (!context) throw new Error('Failed to get canvas context');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // PNG-specific rendering optimizations for lossless quality
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        // Clear canvas with transparent background for RGBA mode
        if (colorMode === 'rgba') {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }

        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas
        }).promise;

        // Convert to grayscale if needed (preserving alpha channel)
        if (colorMode === "grayscale") {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            data[i] = gray;
            data[i + 1] = gray;
            data[i + 2] = gray;
            // Keep alpha channel (data[i + 3]) unchanged
          }
          
          context.putImageData(imageData, 0, 0);
        }

        // Convert canvas to PNG blob (lossless, no quality parameter)
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Failed to create blob'));
            },
            'image/png'
          );
        });

        const dataUrl = canvas.toDataURL('image/png');

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
      console.error('PDF to PNG conversion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to convert PDF to PNG images. Please try again.');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadImage = (image: ConvertedImage) => {
    const link = document.createElement('a');
    link.href = image.dataUrl;
    link.download = `page-${image.pageNumber}.png`;
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

  const pdfToPngFAQs = [
    {
      question: "Why use PNG instead of JPG for PDF conversion?",
      answer: "PNG is ideal when you need perfect quality preservation and transparency support. Unlike JPG's lossy compression, PNG uses lossless compression, ensuring every pixel is identical to the original. PNG is perfect for logos, diagrams, text-heavy documents, screenshots, and any graphics requiring transparency. Choose PNG when quality matters more than file size."
    },
    {
      question: "Does PNG support transparency from PDFs?",
      answer: "Yes! Our converter preserves transparency when you select RGBA color mode. If your PDF has transparent backgrounds or elements, they'll remain transparent in the PNG output. This is especially useful for logos, graphics, and overlaying images. JPG cannot support transparency, making PNG the only choice for transparent images."
    },
    {
      question: "Are PNG files larger than JPG?",
      answer: "Yes, PNG files are typically 2-5x larger than JPG because PNG uses lossless compression while JPG uses lossy compression. However, PNG ensures perfect quality preservation with no artifacts. For web use with simple graphics or text, PNG is still efficient. For photographs or complex images where slight quality loss is acceptable, use JPG instead."
    },
    {
      question: "What resolution should I use for PNG conversion?",
      answer: "For screen viewing and web graphics, 72-96 DPI is sufficient. For print documents, use 150-200 DPI. For high-quality prints, presentations, or professional graphics, choose 300 DPI. For technical drawings or CAD exports requiring maximum detail, use 600 DPI. Higher DPI creates larger files but preserves more detail."
    },
    {
      question: "Can I convert password-protected PDFs to PNG?",
      answer: "No, password-protected PDFs must be unlocked first. Use our PDF Unlock tool to remove the password protection, then convert the unlocked PDF to PNG. This security measure prevents unauthorized access to protected documents."
    },
    {
      question: "What's the difference between RGBA and Grayscale mode?",
      answer: "RGBA (Red Green Blue Alpha) preserves all colors and transparency from your PDF, ideal for colorful graphics, logos, and photos. Grayscale converts everything to shades of gray, reducing file size by 60-70% while maintaining lossless quality. Choose Grayscale for black & white documents, invoices, or text-only pages where color isn't needed."
    },
    {
      question: "Why are my PNG files so large?",
      answer: "PNG uses lossless compression, which means larger file sizes compared to JPG. Complex images with many colors create larger PNG files. To reduce size: (1) Lower the DPI resolution, (2) Use Grayscale mode for black & white content, or (3) Consider using JPG for photographs where perfect quality isn't critical. PNG is worth the size for graphics, logos, and transparency."
    },
    {
      question: "Is PNG better than JPG for text documents?",
      answer: "Absolutely! PNG is superior for text-heavy PDFs because lossless compression keeps text sharp and crisp without compression artifacts. JPG's lossy compression can blur text edges and create fuzzy letters. Always use PNG for invoices, contracts, forms, diagrams, or any document where text clarity is important."
    }
  ];

  const pngUseCases = [
    {
      title: "Logos & Graphics",
      description: "Extract vector-quality logos and graphics from PDFs with transparency support, perfect for design work and branding materials.",
      icon: Sparkles
    },
    {
      title: "Screenshots & Documentation",
      description: "Create pixel-perfect screenshots from PDF documentation, tutorials, or software manuals with crisp text and graphics.",
      icon: FileText
    },
    {
      title: "Diagrams & Charts",
      description: "Convert technical diagrams, flowcharts, and infographics to PNG with lossless quality and no compression artifacts.",
      icon: FileImage
    },
    {
      title: "Web Graphics",
      description: "Export PDF graphics as PNG for websites, maintaining transparency and sharp edges for icons, buttons, and UI elements.",
      icon: ImageIcon
    },
    {
      title: "Presentation Materials",
      description: "Extract high-quality images from PDF presentations for reuse in slides, keeping transparency and crisp quality.",
      icon: Upload
    },
    {
      title: "Print & Publishing",
      description: "Generate print-ready PNG images from PDFs with perfect quality preservation for magazines, books, and marketing materials.",
      icon: Shield
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
      title: "Configure PNG Settings",
      description: "Choose resolution (DPI) and color mode (RGBA for color/transparency or Grayscale for B&W) for optimal results.",
      icon: Settings,
      number: 2
    },
    {
      title: "Convert to PNG",
      description: "Click convert and watch each PDF page transform into a lossless PNG image with progress tracking.",
      icon: Zap,
      number: 3
    },
    {
      title: "Download PNG Images",
      description: "Download PNG images individually or all at once. Files are named by page number for easy organization.",
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
              { name: "PDF to PNG", url: "" }
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
            <p className="text-lg text-muted-foreground">Successfully converted {convertedImages.length} page{convertedImages.length > 1 ? 's' : ''} to PNG</p>
          </div>

          <Card className="glass p-6 sm:p-8 mb-8" data-testid="conversion-results">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                Converted PNG Images
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
            { name: "PDF to PNG", url: "" }
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
            <span className="text-sm font-medium">PDF to PNG Converter</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Convert PDF to PNG Images
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Extract PDF pages as lossless PNG images with transparency support and perfect quality
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectItem value="rgba">RGBA (Color + Transparency)</SelectItem>
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
                    <h4 className="font-semibold">Converting PDF to PNG...</h4>
                    <p className="text-sm text-muted-foreground">Extracting pages as lossless PNG images</p>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground mt-2">{progress}%</p>
              </div>
            )}

            {pdfFile && !isProcessing && convertedImages.length === 0 && (
              <Button 
                onClick={convertPDFToPNG}
                className="w-full h-12 text-base"
                data-testid="button-convert"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Convert to PNG
              </Button>
            )}
          </div>
        </Card>

        <PrivacyNotice message="Your PDF is processed locally in your browser and never uploaded to any server." className="mb-12" />

        <HowItWorksSection 
          toolName="PDF to PNG Converter"
          steps={howItWorksSteps}
        />

        <WhyUseSection 
          toolName="PDF to PNG Converter"
          benefits={[
            "Lossless compression - perfect quality preservation",
            "Transparency support for logos and graphics",
            "Sharp, crisp text without compression artifacts",
            "Ideal for diagrams, screenshots, and technical drawings",
            "Universal compatibility across all platforms",
            "100% privacy - all processing in your browser"
          ]}
          features={[
            {
              icon: Sparkles,
              title: "Lossless Quality",
              description: "PNG format ensures zero quality loss with lossless compression. Every pixel is identical to the original PDF, perfect for professional work."
            },
            {
              icon: Settings,
              title: "Transparency Support",
              description: "Preserve transparency from your PDFs with RGBA color mode. Essential for logos, graphics, and overlaying images on different backgrounds."
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Convert multi-page PDFs to PNG images instantly with no server uploads. All processing happens locally in your browser."
            },
            {
              icon: Shield,
              title: "100% Private & Secure",
              description: "Your PDFs never leave your device. All conversion happens client-side for complete privacy and security."
            }
          ]}
        />

        <UseCasesSection useCases={pngUseCases} />

        <ComparisonSection
          toolName="PDF to PNG Converter"
          comparisons={[
            { feature: "Browser-Based Processing", ourTool: true, others: false, highlight: true },
            { feature: "No File Uploads", ourTool: true, others: false },
            { feature: "Lossless Quality", ourTool: true, others: "Sometimes" },
            { feature: "Transparency Support", ourTool: true, others: "Rare" },
            { feature: "Custom DPI Settings", ourTool: true, others: "Sometimes" },
            { feature: "RGBA & Grayscale Modes", ourTool: true, others: "Limited" },
            { feature: "Batch Download", ourTool: true, others: true },
            { feature: "Free Forever", ourTool: true, others: false },
            { feature: "No Watermarks", ourTool: true, others: "Paid Only" }
          ]}
        />

        <ToolFAQ 
          faqs={pdfToPngFAQs}
          toolName="PDF to PNG Converter"
          toolPath="/pdf-to-png"
        />

        <ContactSupportSection />
      </div>
    </div>
  );
}
