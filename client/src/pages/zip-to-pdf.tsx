import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Check, AlertCircle, FileArchive, ArrowLeft, FileText, 
  Sparkles, Zap, Shield, Upload as UploadIcon, Upload, X, Download, Loader2, Book 
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

interface ExtractedPDF {
  id: string;
  name: string;
  blob: Blob;
  size: number;
}

export default function ZIPToPDF() {
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedPDFs, setExtractedPDFs] = useState<ExtractedPDF[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Generate structured data for SEO
  const howToSchema = generateHowToSchema({
    name: "How to Extract PDFs from ZIP Archive",
    description: "Learn how to extract PDF files from compressed ZIP archives quickly and easily",
    totalTime: "PT2M",
    steps: [
      { 
        name: "Upload ZIP", 
        text: "Click the upload area or drag and drop your ZIP file containing PDF documents."
      },
      { 
        name: "Extract PDFs", 
        text: "Click 'Extract PDF Files' to automatically extract all PDFs from the ZIP archive."
      },
      { 
        name: "Review PDFs", 
        text: "View the list of extracted PDF files with their names and sizes."
      },
      { 
        name: "Download", 
        text: "Download individual PDFs or all at once using the bulk download option."
      }
    ]
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: "ZIP to PDF Extractor - AltafToolsHub",
    description: "Free online tool to extract PDF files from ZIP archives. 100% browser-based processing ensures your files stay private and secure.",
    applicationCategory: "UtilitiesApplication",
    url: "https://www.altaftoolshub.app/zip-to-pdf",
    aggregateRating: { ratingValue: 4.9, ratingCount: 756, bestRating: 5 },
    featureList: [
      "Extract PDFs from ZIP",
      "100% client-side processing",
      "No file upload to servers",
      "Selective extraction",
      "Batch download",
      "Works offline once loaded"
    ],
    datePublished: "2025-01-01",
    dateModified: "2025-09-30"
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.altaftoolshub.app/" },
    { name: "All Tools", url: "https://www.altaftoolshub.app/all-tools" },
    { name: "ZIP to PDF", url: "https://www.altaftoolshub.app/zip-to-pdf" }
  ]);

  useSEO({
    title: "ZIP to PDF Extractor - Extract PDF Files from ZIP Archives Free",
    description: "Free online ZIP to PDF extractor. Extract and download PDF files from ZIP archives instantly. 100% browser-based, no uploads. Access compressed PDF collections with privacy-first extraction.",
    path: "/zip-to-pdf",
    keywords: "zip to pdf, extract pdf from zip, unzip pdfs, zip extractor, pdf archive extractor, download pdfs from zip, extract compressed pdfs, zip to pdf converter, access pdfs in zip, pdf file extractor 2025",
    ogImage: "https://altaftoolshub.app/og-zip-to-pdf.png",
    structuredData: [howToSchema, softwareSchema, breadcrumbSchema],
    additionalMetaTags: [
      { name: "application-name", content: "ZIP to PDF Extractor - AltafToolsHub" },
      { property: "article:section", content: "Utility Tools" },
      { property: "article:tag", content: "File Extraction" },
      { property: "article:tag", content: "ZIP Archive" },
      { property: "article:tag", content: "PDF Access" }
    ]
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.includes('zip') && !file.name.toLowerCase().endsWith('.zip')) {
      setError('Please select a ZIP file.');
      return;
    }

    setZipFile(file);
    setExtractedPDFs([]);
    setError(null);
  }, []);

  const clearAll = () => {
    setZipFile(null);
    setExtractedPDFs([]);
    setError(null);
    setProgress(0);
  };

  const extractPDFs = async () => {
    if (!zipFile) {
      setError('Please select a ZIP file first.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    scrollToProcessing();

    try {
      setProgress(10);
      
      // Load ZIP file
      const zip = new JSZip();
      const zipContents = await zip.loadAsync(zipFile);
      
      setProgress(30);

      // Find all PDF files in the archive
      const pdfFiles: ExtractedPDF[] = [];
      const fileNames = Object.keys(zipContents.files);
      const pdfFileNames = fileNames.filter(name => 
        name.toLowerCase().endsWith('.pdf') && !zipContents.files[name].dir
      );

      if (pdfFileNames.length === 0) {
        throw new Error('No PDF files found in the ZIP archive.');
      }

      setProgress(50);

      // Track filenames to detect and handle duplicates (consistent with PDF to ZIP tool)
      const usedFilenames = new Set<string>();
      
      // Helper function to get unique filename (matches PDF to ZIP implementation)
      const getUniqueFilename = (originalName: string): string => {
        if (!usedFilenames.has(originalName)) {
          usedFilenames.add(originalName);
          return originalName;
        }
        
        // Extract name and extension
        const lastDotIndex = originalName.lastIndexOf('.');
        const name = lastDotIndex > 0 ? originalName.substring(0, lastDotIndex) : originalName;
        const ext = lastDotIndex > 0 ? originalName.substring(lastDotIndex) : '';
        
        // Find next available number
        let counter = 1;
        let newName = `${name} (${counter})${ext}`;
        while (usedFilenames.has(newName)) {
          counter++;
          newName = `${name} (${counter})${ext}`;
        }
        
        usedFilenames.add(newName);
        return newName;
      };

      // Extract each PDF with duplicate name handling
      const progressPerFile = 40 / pdfFileNames.length;
      
      for (let i = 0; i < pdfFileNames.length; i++) {
        const fileName = pdfFileNames[i];
        const file = zipContents.files[fileName];
        
        const blob = await file.async('blob');
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        
        // Extract just the filename (remove any path)
        const cleanName = fileName.split('/').pop() || fileName;
        
        // Get unique filename (handles duplicates automatically)
        const uniqueName = getUniqueFilename(cleanName);
        
        pdfFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          name: uniqueName,
          blob: pdfBlob,
          size: pdfBlob.size
        });
        
        setProgress(50 + (i + 1) * progressPerFile);
      }

      setProgress(100);

      setTimeout(() => {
        setExtractedPDFs(pdfFiles);
        setIsProcessing(false);
        setProgress(0);

        // Scroll to download section
        setTimeout(() => {
          const downloadSection = document.querySelector('[data-testid="extracted-pdfs-section"]');
          if (downloadSection) {
            downloadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }, 300);

    } catch (err) {
      console.error('ZIP extraction error:', err);
      setError(err instanceof Error ? err.message : 'Failed to extract PDFs from ZIP archive. The file may be corrupted or password-protected.');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadPDF = (pdf: ExtractedPDF) => {
    const url = URL.createObjectURL(pdf.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = pdf.name;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const downloadAllPDFs = () => {
    extractedPDFs.forEach((pdf, index) => {
      setTimeout(() => {
        downloadPDF(pdf);
      }, index * 200); // Stagger downloads
    });
  };

  // FAQ data specific to ZIP to PDF
  const zipToPdfFAQs = [
    {
      question: "How do I extract PDF files from a ZIP archive?",
      answer: "Simply upload your ZIP file using the upload area. Once uploaded, click 'Extract PDF Files' and our tool will automatically find and extract all PDF documents from the archive. You can then download them individually or all at once."
    },
    {
      question: "Is it safe to extract PDFs using this tool?",
      answer: "Yes, completely safe. All extraction happens in your browser using JavaScript. Your ZIP file and PDFs never leave your device and are not uploaded to any server. This ensures maximum privacy and security for your documents."
    },
    {
      question: "Can I extract PDFs from password-protected ZIP files?",
      answer: "Unfortunately, browser-based JavaScript cannot decrypt password-protected ZIP archives due to security limitations. You'll need to use desktop software like 7-Zip or WinRAR to extract password-protected archives first."
    },
    {
      question: "What if my ZIP file contains folders with PDFs?",
      answer: "No problem! Our tool recursively searches through all folders in the ZIP archive and extracts PDFs from any location. The folder structure is flattened, and all PDFs are presented in a single list for easy access."
    },
    {
      question: "Can I extract only specific PDFs from the ZIP?",
      answer: "Yes! After extraction, you'll see a complete list of all PDF files. You can download them individually by clicking the download button next to each file, or use the 'Download All' button to get everything at once."
    },
    {
      question: "Why does my ZIP file say 'No PDF files found'?",
      answer: "This means the ZIP archive doesn't contain any files with the .pdf extension. Double-check your ZIP file to ensure it actually contains PDF documents. The tool only extracts files specifically named with .pdf extension."
    },
    {
      question: "Is there a file size limit for ZIP extraction?",
      answer: "The only limit is your browser's available memory. Most modern browsers can handle ZIP files up to several hundred megabytes. For very large archives (1GB+), extraction may be slower or fail due to memory constraints."
    }
  ];

  // Use cases specific to ZIP to PDF
  const zipToPdfUseCases = [
    {
      title: "Email Attachments",
      description: "Quickly access PDF documents received in compressed ZIP format via email without needing to save them locally.",
      icon: Download
    },
    {
      title: "Document Archives",
      description: "Extract specific PDFs from large document archives without extracting the entire ZIP file to your hard drive.",
      icon: FileArchive
    },
    {
      title: "Shared Collections",
      description: "Access PDF files shared by colleagues or clients in compressed format for collaboration and review.",
      icon: FileText
    },
    {
      title: "Backup Recovery",
      description: "Retrieve important PDF documents from backup ZIP archives without restoring the entire backup.",
      icon: Shield
    },
    {
      title: "Course Materials",
      description: "Students can extract lecture notes, assignments, and reading materials from compressed course packages.",
      icon: Book
    },
    {
      title: "Report Distribution",
      description: "Business users can quickly extract specific reports or documents from compressed quarterly packages.",
      icon: Sparkles
    }
  ];

  // How it works steps
  const howItWorksSteps = [
    {
      title: "Upload ZIP Archive",
      description: "Select or drag and drop your ZIP file containing PDF documents. No installation required.",
      icon: UploadIcon
    },
    {
      title: "Extract PDFs",
      description: "Click the extract button and our tool scans the ZIP archive to find all PDF files automatically.",
      icon: FileArchive
    },
    {
      title: "Preview List",
      description: "See all extracted PDFs with their names and file sizes. Choose which ones you want to download.",
      icon: FileText
    },
    {
      title: "Download Files",
      description: "Download individual PDFs or all at once with the bulk download option.",
      icon: Download
    }
  ];

  if (extractedPDFs.length > 0) {
    return (
      <div className="min-h-screen pattern-bg">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumbs 
            items={[
              { name: "All Tools", url: "/all-tools" },
              { name: "ZIP to PDF", url: "" }
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">PDFs Extracted Successfully!</h1>
            <p className="text-lg text-muted-foreground">Found {extractedPDFs.length} PDF {extractedPDFs.length === 1 ? 'file' : 'files'} in the archive</p>
          </div>

          <Card className="glass p-6 sm:p-8" data-testid="extracted-pdfs-section">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Extracted PDF Files
              </h3>
              <Button
                onClick={downloadAllPDFs}
                className="flex items-center gap-2"
                data-testid="button-download-all"
              >
                <Download className="w-4 h-4" />
                Download All
              </Button>
            </div>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {extractedPDFs.map((pdf, index) => (
                <div 
                  key={pdf.id}
                  className="flex items-center justify-between p-4 bg-background/50 rounded-lg hover:bg-background/70 transition-colors"
                  data-testid={`pdf-item-${index}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{pdf.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(pdf.size)}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => downloadPDF(pdf)}
                    variant="outline"
                    size="sm"
                    className="ml-2 flex-shrink-0"
                    data-testid={`button-download-${index}`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <Button 
                onClick={clearAll}
                variant="outline"
                className="w-full"
                data-testid="button-extract-another"
              >
                Extract Another ZIP
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
            { name: "All Tools", url: "/all-tools" },
            { name: "ZIP to PDF", url: "" }
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
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Extract PDFs from ZIP</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            ZIP to PDF Extractor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Extract and download PDF files from ZIP archives instantly with 100% privacy
          </p>
        </div>

        {/* Main Tool Section */}
        <Card className="glass p-6 sm:p-8 mb-12" data-testid="upload-section">
          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileArchive className="w-5 h-5 text-primary" />
                Upload ZIP Archive
              </h3>
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".zip,application/zip,application/x-zip-compressed"
                multiple={false}
                maxSize={500 * 1024 * 1024}
                title="Upload ZIP File"
                description="Drag and drop your ZIP archive here or click to browse"
              />
              {zipFile && (
                <div className="mt-4 p-4 glass rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileArchive className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{zipFile.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(zipFile.size)}</p>
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
                    <h4 className="font-semibold">Extracting PDF Files...</h4>
                    <p className="text-sm text-muted-foreground">Scanning and extracting PDFs from archive</p>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground mt-2">{progress}%</p>
              </div>
            )}

            {/* Action Button */}
            {zipFile && !isProcessing && extractedPDFs.length === 0 && (
              <Button 
                onClick={extractPDFs}
                className="w-full h-12 text-base"
                data-testid="button-extract"
              >
                <Upload className="w-5 h-5 mr-2" />
                Extract PDF Files
              </Button>
            )}
          </div>
        </Card>

        <PrivacyNotice message="Your files are processed locally in your browser and never uploaded to any server." className="mb-12" />

        {/* SEO Content Sections */}
        <HowItWorksSection 
          toolName="ZIP to PDF Extractor"
          steps={howItWorksSteps.map((step, index) => ({
            ...step,
            number: index + 1
          }))}
        />

        <WhyUseSection 
          toolName="ZIP to PDF Extractor"
          benefits={[
            "Complete privacy - all extraction happens in your browser",
            "No file uploads to servers - instant local processing",
            "Fast extraction with detailed file information",
            "Free forever with no registration required",
            "Extract from nested folders automatically",
            "Works offline once loaded"
          ]}
          features={[
            {
              icon: Shield,
              title: "100% Private & Secure",
              description: "All extraction happens in your browser. Your ZIP file and PDFs never leave your device, ensuring complete privacy and security."
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Extract PDFs instantly without uploading files to servers. No waiting, no delays - just instant extraction."
            },
            {
              icon: FileArchive,
              title: "Recursive Extraction",
              description: "Automatically finds and extracts PDFs from any folder depth within the ZIP archive."
            },
            {
              icon: Check,
              title: "Free Forever",
              description: "No registration, no subscriptions, no hidden fees. Extract unlimited PDFs from ZIP archives completely free."
            }
          ]}
        />

        <UseCasesSection 
          useCases={zipToPdfUseCases}
        />

        <ComparisonSection
          toolName="ZIP to PDF Extractor"
          comparisons={[
            { feature: "Browser-Based Processing", ourTool: true, others: false, highlight: true },
            { feature: "No File Uploads", ourTool: true, others: false },
            { feature: "Unlimited Extractions", ourTool: true, others: "Limited" },
            { feature: "Batch Download", ourTool: true, others: true },
            { feature: "Free Forever", ourTool: true, others: false },
            { feature: "Recursive Folder Scan", ourTool: true, others: "Sometimes" },
            { feature: "File Size Display", ourTool: true, others: "Sometimes" },
            { feature: "Instant Processing", ourTool: true, others: "Queue Wait" }
          ]}
        />

        <ToolFAQ 
          faqs={zipToPdfFAQs}
          toolName="ZIP to PDF Extractor"
          toolPath="/zip-to-pdf"
        />

        <ContactSupportSection />
      </div>
    </div>
  );
}
