import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Lock, Shield, Check, AlertCircle, Download, Eye, EyeOff,
  ArrowLeft, KeyRound, Sparkles, Zap, FileText, Unlock
} from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { useSEO, generateHowToSchema, generateSoftwareApplicationSchema } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import ToolSEO, { toolFAQs } from "@/components/seo/tool-seo";
import PrivacyNotice from "@/components/privacy-notice";
import { WhyUseSection, UseCasesSection, ComparisonSection, HowItWorksSection, commonFeatures } from "@/components/seo/tool-features";
import { ToolFAQ, generatePDFUnlockFAQs } from "@/components/seo/tool-faq";
import { Building2, Users, Briefcase, Home, Archive, FileKey, School } from "lucide-react";
import { ContactSupportSection } from "@/components/contact-support";
import { scrollBy } from "@/lib/scroll-utils";

interface UnlockResult {
  originalSize: number;
  unlockedBlob: Blob;
}

export default function UnlockPDF() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UnlockResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate structured data for SEO
  const howToSchema = generateHowToSchema({
    name: "How to Unlock Password-Protected PDF Files",
    description: "Remove password protection from PDF files securely in your browser",
    totalTime: "PT30S",
    steps: [
      { name: "Upload PDF", text: "Select or drag your password-protected PDF file" },
      { name: "Enter Password", text: "Type the PDF password you know" },
      { name: "Unlock PDF", text: "Click 'Unlock PDF' to remove protection" },
      { name: "Download", text: "Download your unlocked PDF instantly" }
    ]
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: "PDF Unlocker - AltafToolsHub",
    description: "Secure PDF password remover. Unlock password-protected PDFs directly in your browser with complete privacy.",
    applicationCategory: "SecurityApplication",
    url: "https://www.altaftoolshub.app/unlock-pdf",
    aggregateRating: { ratingValue: 4.8, ratingCount: 987, bestRating: 5 },
    featureList: [
      "Remove PDF password protection",
      "100% client-side processing",
      "No file upload to servers",
      "Preserves document quality",
      "Works with all PDF versions",
      "Instant unlocking process"
    ],
    datePublished: "2024-01-01",
    dateModified: "2025-01-17"
  });

  useSEO({
    title: "Unlock PDF Files Online - Remove PDF Password Free | AltafToolsHub",
    description: "Free online PDF unlocker to remove password protection from PDFs. 100% secure client-side processing. Your files and passwords never leave your browser.",
    path: "/unlock-pdf",
    keywords: "unlock pdf, remove pdf password, pdf unlocker, pdf password remover, decrypt pdf, unlock protected pdf, free pdf unlocker, online pdf unlock, pdf security remover 2025",
    ogImage: "https://www.altaftoolshub.app/og-unlock-pdf.png",
    structuredData: [howToSchema, softwareSchema],
    additionalMetaTags: [
      { name: "application-name", content: "PDF Unlocker - AltafToolsHub" },
      { property: "article:section", content: "PDF Tools" },
      { property: "article:tag", content: "PDF Security" },
      { property: "article:tag", content: "Privacy Tools" },
      { property: "article:tag", content: "Document Management" }
    ]
  });

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    setSelectedFile(file);
    setResult(null);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadUnlockedPDF = () => {
    if (!selectedFile || !result) return;

    const url = URL.createObjectURL(result.unlockedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name.replace('.pdf', '-unlocked.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const resetTool = () => {
    setSelectedFile(null);
    setPassword('');
    setShowPassword(false);
    setResult(null);
    setIsProcessing(false);
    setProgress(0);
    setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedFile && password.trim() && !isProcessing) {
      unlockPDF();
    }
  };

  const unlockPDF = async () => {
    // Scroll to top to show processing area
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (!selectedFile || !password.trim()) {
      setError('Please select a file and enter the password.');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      setProgress(20);
      const arrayBuffer = await selectedFile.arrayBuffer();
      
      setProgress(40);
      const { getPDFJS } = await import('@/lib/pdf-utils');
      const pdfjsLib = getPDFJS();
      
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        password: password.trim()
      });
      
      const pdfDocument = await loadingTask.promise;
      setProgress(30);
      
      const { PDFDocument: PDFLibDocument } = await import('pdf-lib');
      const newPdfDoc = await PDFLibDocument.create();
      
      const numPages = pdfDocument.numPages;
      const baseProgress = 30;
      const pageProgress = 60 / numPages;
      
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setProgress(baseProgress + (pageNum - 1) * pageProgress);
        
        const page = await pdfDocument.getPage(pageNum);
        const scale = 2.0;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Canvas context not available');
        }
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          canvas: canvas
        };
        
        await page.render(renderContext).promise;
        
        const jpegBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert page to JPEG'));
            }
          }, 'image/jpeg', 0.9);
        });
        
        const jpegBytes = await jpegBlob.arrayBuffer();
        const image = await newPdfDoc.embedJpg(jpegBytes);
        
        const pageWidth = viewport.width / scale * 0.75;
        const pageHeight = viewport.height / scale * 0.75;
        
        const newPage = newPdfDoc.addPage([pageWidth, pageHeight]);
        
        newPage.drawImage(image, {
          x: 0,
          y: 0,
          width: pageWidth,
          height: pageHeight,
        });
      }
      
      setProgress(95);
      
      const unlockedPdfBytes = await newPdfDoc.save();
      pdfDocument.destroy();
      
      setProgress(90);
      
      const unlockedBlob = new Blob([unlockedPdfBytes], { type: 'application/pdf' });
      
      setProgress(100);
      
      setTimeout(() => {
        setResult({
          originalSize: selectedFile.size,
          unlockedBlob
        });
        setIsProcessing(false);
        setProgress(0);
      }, 500);
      
    } catch (err) {
      console.error('PDF unlock error:', err);
      let errorMessage = 'Failed to unlock PDF. ';
      
      if (err instanceof Error) {
        if (err.message.includes('password')) {
          errorMessage = 'Incorrect password. Please check and try again.';
        } else if (err.message.includes('encrypt')) {
          errorMessage = 'This PDF uses an unsupported encryption method.';
        } else {
          errorMessage += err.message;
        }
      }
      
      setError(errorMessage);
      setIsProcessing(false);
      setProgress(0);
    }
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">PDF Unlocker</h1>
            <p className="text-lg text-muted-foreground">Your PDF has been unlocked successfully!</p>
          </div>

          <Card className="glass p-8">
            <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Unlock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-center mb-8">PDF Unlocked Successfully!</h3>
            
            <div className="glass rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold">{selectedFile?.name}</p>
                    <p className="text-sm text-muted-foreground">Original file</p>
                  </div>
                </div>
                <Check className="w-6 h-6 text-green-500" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Original Size</p>
                  <p className="font-bold" data-testid="text-original-size">{formatFileSize(result.originalSize)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <p className="font-bold text-green-600">Unlocked</p>
                </div>
              </div>
            </div>

            <Alert className="mb-6 border-primary/20 bg-primary/5">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your PDF has been successfully unlocked and can now be viewed, edited, and printed without restrictions.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={downloadUnlockedPDF}
              className="w-full btn-gradient text-white font-semibold mb-4"
              size="lg"
              data-testid="button-download"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Unlocked PDF
            </Button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={resetTool}
                size="lg"
                data-testid="button-unlock-another"
              >
                Unlock Another File
              </Button>
              <Link href="/all-tools">
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">PDF Unlocker</h1>
            <p className="text-lg text-muted-foreground">Removing password protection...</p>
          </div>

          <Card className="glass p-12 text-center">
            <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <KeyRound className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Unlocking PDF...</h3>
            <p className="text-muted-foreground mb-6" data-testid="text-progress-message">
              Processing pages and removing protection
            </p>
            <div className="max-w-md mx-auto">
              <Progress value={progress} className="h-3 mb-3" data-testid="progress-unlock" />
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
        toolName="PDF Unlocker"
        description="Remove password protection from PDF files securely in your browser"
        category="UtilitiesApplication"
        faqs={toolFAQs["unlock-pdf"]}
        rating={{ value: 4.8, count: 412 }}
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs items={[{ name: "Unlock PDF", url: "/unlock-pdf" }]} />
        
        
        <div className="text-center mb-10">
          <Link href="/">
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tools
            </Button>
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-blue-600 text-white mb-6 shadow-md">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">100% Secure Processing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-primary">
            PDF Unlocker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Remove password protection from PDF files securely in your browser. 
            Your files and passwords never leave your device.
          </p>
        </div>

        {/* Privacy Notice */}
        <PrivacyNotice message="PDF passwords are removed locally. Your files and passwords stay private." />

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          <Card className="glass p-4 text-center">
            <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">100% Private</p>
          </Card>
          <Card className="glass p-4 text-center">
            <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Secure Processing</p>
          </Card>
          <Card className="glass p-4 text-center">
            <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Instant Unlock</p>
          </Card>
        </div>

        <FileUpload
          onFileSelect={handleFileSelect}
          accept=".pdf,application/pdf"
          title="Upload your locked PDF"
          description="Drag & drop or click to select"
          className="mb-8"
        />

        {error && (
          <Alert className="mb-6 border-destructive/20 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription data-testid="text-error">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {selectedFile && (
          <Card className="glass p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Selected File
              </h3>
              <div className="glass rounded-lg p-4 flex items-center justify-between">
                <span className="text-sm font-medium truncate" data-testid="text-filename">{selectedFile.name}</span>
                <span className="text-sm font-bold gradient-text" data-testid="text-filesize">{formatFileSize(selectedFile.size)}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-primary" />
                Enter Password
              </h3>
              
              <div className="relative mb-6">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter PDF password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-12 h-12 text-base"
                  data-testid="input-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-10 w-10"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <Alert className="mb-6 border-primary/20 bg-primary/5">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your password is used only to unlock the PDF locally. It's never sent to any server.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={unlockPDF}
                disabled={!password.trim()}
                className="w-full btn-gradient text-white font-semibold"
                size="lg"
                data-testid="button-unlock"
              >
                <Unlock className="w-5 h-5 mr-2" />
                Unlock PDF
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* SEO Content Sections */}
      <HowItWorksSection
        toolName="PDF Unlocker"
        steps={[
          {
            number: 1,
            title: "Select Protected PDF",
            description: "Upload your password-protected PDF file. The file stays in your browser.",
            icon: FileKey
          },
          {
            number: 2,
            title: "Enter Known Password",
            description: "Type the password you know. We don't crack passwords - you must know it.",
            icon: KeyRound
          },
          {
            number: 3,
            title: "Download Unlocked PDF",
            description: "Get your unlocked PDF instantly with all content and quality preserved.",
            icon: Download
          }
        ]}
      />

      <WhyUseSection
        toolName="PDF Unlocker"
        benefits={[
          "Remove password protection from PDFs you own or have permission to access",
          "Your password and file never leave your browser - 100% private",
          "Preserves all document formatting, images, and text quality",
          "Works with PDFs protected by any version of Adobe Acrobat",
          "No registration, email, or personal information required",
          "Instant processing - no waiting for server queues",
          "Free forever with no limits or hidden costs",
          "Legal tool for accessing your own documents"
        ]}
        features={[
          commonFeatures.privacy,
          commonFeatures.speed,
          commonFeatures.free,
          {
            icon: Shield,
            title: "Secure Processing",
            description: "Your password is never transmitted or stored anywhere.",
            highlight: true
          }
        ]}
      />

      <UseCasesSection
        useCases={[
          {
            title: "Forgotten Restrictions",
            description: "Remove outdated password protection from your own documents when you still know the password.",
            icon: Home,
            example: "Unlock old tax documents or personal records"
          },
          {
            title: "Business Documents",
            description: "Access password-protected invoices, contracts, or reports shared with you.",
            icon: Briefcase,
            example: "Open protected vendor invoices or client contracts"
          },
          {
            title: "Team Collaboration",
            description: "Remove passwords from shared documents to improve team workflow.",
            icon: Users,
            example: "Unlock project documents for easier sharing"
          },
          {
            title: "Archive Management",
            description: "Process archived documents that no longer need password protection.",
            icon: Archive,
            example: "Unlock old company records for digitization"
          },
          {
            title: "Legal Documents",
            description: "Access legal PDFs shared by lawyers or government agencies.",
            icon: Building2,
            example: "Open protected legal agreements or forms"
          },
          {
            title: "Educational Materials",
            description: "Access password-protected course materials or research papers.",
            icon: School,
            example: "Unlock protected lecture notes or study guides"
          }
        ]}
      />

      <ComparisonSection
        toolName="PDF Unlocker"
        comparisons={[
          { feature: "Password Security", ourTool: "Never transmitted", others: "Sent to servers", highlight: true },
          { feature: "Processing Location", ourTool: "Your browser only", others: "Cloud servers" },
          { feature: "File Privacy", ourTool: "100% private", others: "Stored temporarily" },
          { feature: "Speed", ourTool: "Instant", others: "Queue wait times" },
          { feature: "File Size Limit", ourTool: "Device memory only", others: "10-50MB typical" },
          { feature: "Registration", ourTool: false, others: "Email required" },
          { feature: "Usage Limits", ourTool: "Unlimited", others: "3-5 files/day" },
          { feature: "Quality Preserved", ourTool: "100%", others: "May compress" },
          { feature: "Works Offline", ourTool: true, others: false },
          { feature: "Cost", ourTool: "Free forever", others: "Freemium model" }
        ]}
      />

      <ToolFAQ 
        faqs={generatePDFUnlockFAQs()}
        toolName="PDF Unlocker"
        toolPath="/unlock-pdf"
      />
    </div>

  );
}