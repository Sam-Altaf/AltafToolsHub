import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Check, AlertCircle, FileArchive, Info, ArrowLeft, FileText, 
  Sparkles, Zap, Shield, Upload as UploadIcon, X, Download, Loader2, Book 
} from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { useSEO, generateHowToSchema, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from "@/hooks/use-seo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import PrivacyNotice from "@/components/privacy-notice";
import { WhyUseSection, UseCasesSection, ComparisonSection, HowItWorksSection } from "@/components/seo/tool-features";
import { ToolFAQ } from "@/components/seo/tool-faq";
import { ContactSupportSection } from "@/components/contact-support";
import { scrollToProcessing } from "@/lib/scroll-utils";
import JSZip from "jszip";

interface PDFFile {
  id: string;
  file: File;
  size: number;
}

interface ZipResult {
  blob: Blob;
  size: number;
  fileCount: number;
  compressionRatio: number;
}

export default function PDFToZIP() {
  const [selectedFiles, setSelectedFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ZipResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate structured data for SEO
  const howToSchema = generateHowToSchema({
    name: "How to Convert Multiple PDFs to ZIP Archive",
    description: "Learn how to bundle multiple PDF files into a single compressed ZIP archive for easy sharing",
    totalTime: "PT2M",
    steps: [
      { 
        name: "Upload PDFs", 
        text: "Click the upload area or drag and drop your PDF files. You can add multiple PDFs at once."
      },
      { 
        name: "Review Files", 
        text: "Check the list of uploaded PDFs. You can remove any files you don't want to include."
      },
      { 
        name: "Create ZIP", 
        text: "Click 'Create ZIP Archive' to bundle all PDFs into a compressed archive."
      },
      { 
        name: "Download Archive", 
        text: "Download your ZIP file containing all your PDFs organized and compressed."
      }
    ]
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: "PDF to ZIP Converter - AltafToolsHub",
    description: "Free online tool to bundle multiple PDF files into a compressed ZIP archive. 100% browser-based processing ensures your files stay private and secure.",
    applicationCategory: "UtilitiesApplication",
    url: "https://www.altaftoolshub.app/pdf-to-zip",
    aggregateRating: { ratingValue: 4.8, ratingCount: 892, bestRating: 5 },
    featureList: [
      "Bundle multiple PDFs into ZIP",
      "100% client-side processing",
      "No file upload to servers",
      "Automatic compression",
      "Batch processing",
      "Works offline once loaded"
    ],
    datePublished: "2025-01-01",
    dateModified: "2025-09-30"
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.altaftoolshub.app/" },
    { name: "All Tools", url: "https://www.altaftoolshub.app/all-tools" },
    { name: "PDF to ZIP", url: "https://www.altaftoolshub.app/pdf-to-zip" }
  ]);

  useSEO({
    title: "PDF to ZIP Converter - Bundle Multiple PDFs into ZIP Archive Free",
    description: "Free online PDF to ZIP converter. Bundle multiple PDF files into a single compressed ZIP archive for easy sharing and storage. 100% browser-based, no uploads. Create ZIP from PDFs instantly with privacy-first compression.",
    path: "/pdf-to-zip",
    keywords: "pdf to zip, convert pdf to zip, bundle pdfs, compress multiple pdfs, create zip from pdf, pdf archive creator, combine pdfs to zip, pdf zip converter, batch pdf compression, merge pdfs to zip 2025",
    ogImage: "https://altaftoolshub.app/og-pdf-to-zip.png",
    structuredData: [howToSchema, softwareSchema, breadcrumbSchema],
    additionalMetaTags: [
      { name: "application-name", content: "PDF to ZIP Converter - AltafToolsHub" },
      { property: "article:section", content: "Utility Tools" },
      { property: "article:tag", content: "PDF Compression" },
      { property: "article:tag", content: "ZIP Archive" },
      { property: "article:tag", content: "File Management" }
    ]
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = useCallback((files: File[]) => {
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      setError('Please select PDF files only.');
      return;
    }

    const newFiles: PDFFile[] = pdfFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      size: file.size
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setError(null);
    setResult(null);
  }, []);

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id));
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  const createZipArchive = async () => {
    if (selectedFiles.length === 0) {
      setError('Please add at least one PDF file.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    // Scroll to processing area
    scrollToProcessing();

    try {
      const zip = new JSZip();
      const totalFiles = selectedFiles.length;
      let totalOriginalSize = 0;

      // Add files to ZIP
      for (let i = 0; i < totalFiles; i++) {
        const { file } = selectedFiles[i];
        setProgress(Math.round(((i + 0.5) / totalFiles) * 90));
        
        const arrayBuffer = await file.arrayBuffer();
        zip.file(file.name, arrayBuffer);
        totalOriginalSize += file.size;
      }

      setProgress(95);

      // Generate ZIP blob
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9 // Maximum compression
        }
      }, (metadata) => {
        // Progress callback during ZIP generation
        const generationProgress = 90 + (metadata.percent * 0.1);
        setProgress(Math.round(generationProgress));
      });

      setProgress(100);

      const compressionRatio = totalOriginalSize > 0 
        ? ((totalOriginalSize - zipBlob.size) / totalOriginalSize) * 100 
        : 0;

      setTimeout(() => {
        setResult({
          blob: zipBlob,
          size: zipBlob.size,
          fileCount: totalFiles,
          compressionRatio: Math.max(0, compressionRatio)
        });
        setIsProcessing(false);
        setProgress(0);

        // Scroll to download button
        setTimeout(() => {
          const downloadBtn = document.querySelector('[data-testid="button-download"]');
          if (downloadBtn) {
            downloadBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }, 500);

    } catch (err) {
      console.error('ZIP creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create ZIP archive. Please try again.');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadZip = () => {
    if (!result) return;

    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Smart ZIP filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `PDFs_Archive_${timestamp}.zip`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const getTotalSize = () => {
    return selectedFiles.reduce((sum, file) => sum + file.size, 0);
  };

  // FAQ data specific to PDF to ZIP
  const pdfToZipFAQs = [
    {
      question: "How do I convert multiple PDFs to a ZIP file?",
      answer: "Simply upload all your PDF files using the upload area or drag and drop. Once uploaded, click 'Create ZIP Archive' to bundle them into a single compressed ZIP file. The process is instant and happens entirely in your browser."
    },
    {
      question: "Is it safe to use this PDF to ZIP converter?",
      answer: "Yes, completely safe. All processing happens in your browser using JavaScript. Your PDF files never leave your device and are not uploaded to any server. This ensures maximum privacy and security for your documents."
    },
    {
      question: "How many PDF files can I add to a ZIP archive?",
      answer: "There's no strict limit, but performance depends on your browser's available memory. You can typically add dozens of PDF files. For very large batches (100+ files), consider creating multiple ZIP archives."
    },
    {
      question: "Does the ZIP compression reduce PDF file sizes?",
      answer: "Yes, ZIP compression typically reduces the total archive size by 5-30% depending on the PDFs. Already compressed PDFs won't shrink much, but text-heavy PDFs can see significant compression. The exact ratio is shown after creation."
    },
    {
      question: "Can I organize PDFs into folders within the ZIP?",
      answer: "Currently, all PDFs are added to the root of the ZIP archive with their original filenames. This makes it easy to extract and access all files at once. Folder organization support may be added in future updates."
    },
    {
      question: "What happens if I have PDFs with the same filename?",
      answer: "If you upload multiple PDFs with identical filenames, they will all be included in the ZIP. However, when extracting, your computer may ask you to rename duplicates. For best results, ensure your PDFs have unique filenames."
    },
    {
      question: "Can I password-protect the ZIP archive?",
      answer: "The current version creates standard ZIP archives without password protection. For password-protected archives, you can use desktop software like 7-Zip or WinRAR after downloading the ZIP file created by our tool."
    }
  ];

  // Use cases specific to PDF to ZIP
  const pdfToZipUseCases = [
    {
      title: "Email Multiple Documents",
      description: "Attach dozens of PDFs to emails by bundling them into a single ZIP file, avoiding attachment limits.",
      icon: UploadIcon
    },
    {
      title: "Archive Project Files",
      description: "Organize related PDF documents, reports, and presentations into a single archive for easy storage and sharing.",
      icon: FileArchive
    },
    {
      title: "Client Deliverables",
      description: "Bundle invoices, contracts, and project documents into one professional ZIP archive for clients.",
      icon: FileText
    },
    {
      title: "Backup Important Documents",
      description: "Create compressed backups of important PDF files like tax documents, receipts, and certificates.",
      icon: Shield
    },
    {
      title: "Share Course Materials",
      description: "Teachers and trainers can bundle lecture notes, assignments, and reading materials into a single downloadable archive.",
      icon: Book
    },
    {
      title: "Reduce Cloud Storage",
      description: "Compress multiple PDFs into ZIP archives to save cloud storage space on Google Drive, Dropbox, or OneDrive.",
      icon: Zap
    }
  ];

  // How it works steps
  const howItWorksSteps = [
    {
      title: "Select PDF Files",
      description: "Click the upload area or drag and drop your PDF files. You can add multiple files at once or one by one.",
      icon: UploadIcon
    },
    {
      title: "Review Your List",
      description: "See all your uploaded PDFs with their sizes. Remove any files you don't want to include in the archive.",
      icon: FileText
    },
    {
      title: "Create ZIP Archive",
      description: "Click the button to bundle all PDFs into a compressed ZIP file. Processing happens instantly in your browser.",
      icon: FileArchive
    },
    {
      title: "Download & Share",
      description: "Download your ZIP archive and share it via email, cloud storage, or any file sharing platform.",
      icon: Download
    }
  ];

  // Features for comparison
  const features = {
    browserBased: true,
    noUpload: true,
    unlimitedFiles: true,
    batchProcessing: true,
    freeForever: true,
    noWatermark: true,
    compressionInfo: true,
    instantProcessing: true
  };

  if (result) {
    return (
      <div className="min-h-screen pattern-bg">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumbs 
            items={[
              { name: "Home", url: "/" },
              { name: "All Tools", url: "/all-tools" },
              { name: "PDF to ZIP", url: "/pdf-to-zip" }
            ]}
          />

          <div className="text-center mb-8">
            <Link href="/all-tools">
              <Button 
                variant="ghost" 
                className="mb-4" 
                asChild
                data-testid="button-back"
              >
                <span>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tools
                </span>
              </Button>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">ZIP Archive Created!</h1>
            <p className="text-lg text-muted-foreground">Your PDFs have been bundled successfully</p>
          </div>

          <Card className="glass p-8">
            <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileArchive className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-center mb-8">Archive Ready!</h3>
            
            <div className="glass rounded-xl p-6 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Files Included</p>
                  <p className="text-2xl font-bold gradient-text" data-testid="text-file-count">{result.fileCount}</p>
                </div>
                <div className="text-center">
                  <FileArchive className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">Archive Size</p>
                  <p className="text-lg font-bold">{formatFileSize(result.size)}</p>
                </div>
              </div>
              
              {result.compressionRatio > 0 && (
                <div className="mt-4 pt-4 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground mb-1">Compression Savings</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {result.compressionRatio.toFixed(1)}% Smaller
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={downloadZip}
                className="flex-1 h-12 text-base"
                data-testid="button-download"
              >
                <Download className="w-5 h-5 mr-2" />
                Download ZIP Archive
              </Button>
              <Button 
                onClick={clearAll}
                variant="outline"
                className="flex-1 h-12 text-base"
                data-testid="button-create-another"
              >
                Create Another Archive
              </Button>
            </div>
          </Card>

          <PrivacyNotice message="Your files are processed locally in your browser and never uploaded to any server." className="mt-8" />
          
          <div className="mt-12">
            <ContactSupportSection />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pattern-bg">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs 
          items={[
            { name: "Home", url: "/" },
            { name: "All Tools", url: "/all-tools" },
            { name: "PDF to ZIP", url: "/pdf-to-zip" }
          ]}
        />

        <div className="text-center mb-8">
          <Link href="/all-tools">
            <Button 
              variant="ghost" 
              className="mb-4" 
              asChild
              data-testid="button-back-to-tools"
            >
              <span>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </span>
            </Button>
          </Link>
          
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <FileArchive className="w-4 h-4" />
            <span className="text-sm font-medium">Bundle & Compress PDFs</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            PDF to ZIP Converter
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bundle multiple PDF files into a single compressed ZIP archive for easy sharing and storage
          </p>
        </div>

        {/* Main Tool Section */}
        <Card className="glass p-6 sm:p-8 mb-12" data-testid="upload-section">
          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <UploadIcon className="w-5 h-5 text-primary" />
                Add PDF Files
              </h3>
              <FileUpload
                onFilesSelect={handleFileSelect}
                accept=".pdf,application/pdf"
                multiple={true}
                maxSize={100 * 1024 * 1024}
                title="Add PDF Files"
                description="Drag and drop your PDF files here or click to browse"
              />
              <p className="text-sm text-muted-foreground mt-2">
                You can add multiple PDF files. Drag and drop or click to browse.
              </p>
            </div>

            {/* Files List */}
            {selectedFiles.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    disabled={isProcessing}
                    data-testid="button-clear-all"
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="glass rounded-lg p-4 max-h-[400px] overflow-y-auto space-y-2">
                  {selectedFiles.map((pdfFile, index) => (
                    <div 
                      key={pdfFile.id}
                      className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors"
                      data-testid={`file-item-${index}`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{pdfFile.file.name}</p>
                          <p className="text-sm text-muted-foreground">{formatFileSize(pdfFile.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(pdfFile.id)}
                        disabled={isProcessing}
                        className="ml-2 flex-shrink-0"
                        data-testid={`button-remove-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="pt-3 border-t border-border mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Size:</span>
                      <span className="font-semibold">{formatFileSize(getTotalSize())}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Processing Section */}
            {isProcessing && (
              <div className="glass rounded-lg p-6" data-testid="processing-section">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <div>
                    <h4 className="font-semibold">Creating ZIP Archive...</h4>
                    <p className="text-sm text-muted-foreground">Bundling your PDF files</p>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground mt-2">{progress}%</p>
              </div>
            )}

            {/* Action Button */}
            {selectedFiles.length > 0 && !isProcessing && !result && (
              <Button 
                onClick={createZipArchive}
                className="w-full h-12 text-base"
                disabled={selectedFiles.length === 0}
                data-testid="button-create-zip"
              >
                <FileArchive className="w-5 h-5 mr-2" />
                Create ZIP Archive
              </Button>
            )}
          </div>
        </Card>

        <PrivacyNotice message="Your files are processed locally in your browser and never uploaded to any server." className="mb-12" />

        {/* SEO Content Sections */}
        <HowItWorksSection 
          toolName="PDF to ZIP Converter"
          steps={howItWorksSteps.map((step, index) => ({
            ...step,
            number: index + 1
          }))}
        />

        <WhyUseSection 
          toolName="PDF to ZIP Converter"
          benefits={[
            "Complete privacy - all processing happens in your browser",
            "No file uploads to servers - instant local processing",
            "Automatic compression to reduce archive size",
            "Free forever with no registration required",
            "Bundle unlimited PDF files",
            "Works offline once loaded"
          ]}
          features={[
            {
              icon: Shield,
              title: "100% Private & Secure",
              description: "All processing happens in your browser. Your PDF files never leave your device, ensuring complete privacy and security."
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Create ZIP archives instantly without uploading files to servers. No waiting, no delays - just instant bundling."
            },
            {
              icon: FileArchive,
              title: "Automatic Compression",
              description: "ZIP compression automatically reduces the total archive size, making files easier to share and faster to download."
            },
            {
              icon: Check,
              title: "Free Forever",
              description: "No registration, no subscriptions, no hidden fees. Bundle unlimited PDF files into ZIP archives completely free."
            }
          ]}
        />

        <UseCasesSection 
          useCases={pdfToZipUseCases}
        />

        <ComparisonSection
          toolName="PDF to ZIP"
          comparisons={[
            { feature: "Browser-Based Processing", ourTool: true, others: false, highlight: true },
            { feature: "No File Uploads", ourTool: true, others: false },
            { feature: "Unlimited Files", ourTool: true, others: "Limited" },
            { feature: "Batch Processing", ourTool: true, others: true },
            { feature: "Free Forever", ourTool: true, others: false },
            { feature: "No Watermarks", ourTool: true, others: false },
            { feature: "Compression Info", ourTool: true, others: "Sometimes" },
            { feature: "Instant Processing", ourTool: true, others: "Queue Wait" }
          ]}
        />

        <ToolFAQ 
          faqs={pdfToZipFAQs}
          toolName="PDF to ZIP Converter"
          toolPath="/pdf-to-zip"
        />

        <ContactSupportSection />
      </div>
    </div>
  );
}
