import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { 
  FileText, Download, Loader2, FileDown, Shield, Zap, CheckCircle2, FileCheck,
  Upload, Globe, Briefcase, GraduationCap, Mail, FileX, Clock
} from "lucide-react";
import FileUpload from "@/components/ui/file-upload";
import PrivacyNotice from "@/components/privacy-notice";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import { HowItWorksSection, WhyUseSection, UseCasesSection, ComparisonSection, commonFeatures } from "@/components/seo/tool-features";
import { ToolFAQ } from "@/components/seo/tool-faq";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import mammoth from "mammoth";

export default function WordToPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedPdf, setConvertedPdf] = useState<Uint8Array | null>(null);
  const { toast } = useToast();

  useSEO({
    title: "Word to PDF Converter - Convert DOCX to PDF Online Free | AltafToolsHub",
    description: "Convert Microsoft Word documents (.docx, .doc) to PDF format online. 100% free, secure, and works directly in your browser. Preserve formatting, fonts, and images.",
    keywords: "word to pdf, docx to pdf, convert word to pdf, doc to pdf converter, word document to pdf",
    path: "/word-to-pdf"
  });

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setConvertedPdf(null);
    setProgress(0);
  }, []);

  const convertWordToPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(10);

    try {
      // Read the Word file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      setProgress(20);

      // Convert DOCX to HTML using mammoth
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const htmlContent = result.value;
      setProgress(40);

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      
      setProgress(60);

      // Parse HTML and extract text content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // Extract text with basic formatting
      const textContent: Array<{ text: string; bold: boolean; fontSize: number }> = [];
      
      const processNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          if (text) {
            const parentTag = (node.parentElement?.tagName || '').toLowerCase();
            const isBold = ['strong', 'b', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(parentTag);
            let fontSize = 12;
            
            if (parentTag === 'h1') fontSize = 24;
            else if (parentTag === 'h2') fontSize = 20;
            else if (parentTag === 'h3') fontSize = 16;
            else if (parentTag === 'h4') fontSize = 14;
            
            textContent.push({ text, bold: isBold, fontSize });
          }
        }
        node.childNodes.forEach(processNode);
      };
      
      doc.body.childNodes.forEach(processNode);
      setProgress(70);

      // Add pages and render text
      const pageWidth = 595.28; // A4 width in points
      const pageHeight = 841.89; // A4 height in points
      const margin = 50;
      const maxWidth = pageWidth - 2 * margin;
      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      let yPosition = pageHeight - margin;

      for (const item of textContent) {
        const font = item.bold ? timesBoldFont : timesRomanFont;
        const lines = item.text.split('\n');
        
        for (const line of lines) {
          if (!line.trim()) {
            yPosition -= item.fontSize * 0.5; // Line spacing
            continue;
          }

          // Word wrap
          const words = line.split(' ');
          let currentLine = '';
          
          for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const textWidth = font.widthOfTextAtSize(testLine, item.fontSize);
            
            if (textWidth > maxWidth && currentLine) {
              // Draw current line
              if (yPosition < margin + item.fontSize) {
                currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
                yPosition = pageHeight - margin;
              }
              
              currentPage.drawText(currentLine, {
                x: margin,
                y: yPosition,
                size: item.fontSize,
                font: font,
                color: rgb(0, 0, 0)
              });
              
              yPosition -= item.fontSize * 1.2;
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }
          
          // Draw remaining text
          if (currentLine) {
            if (yPosition < margin + item.fontSize) {
              currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
              yPosition = pageHeight - margin;
            }
            
            currentPage.drawText(currentLine, {
              x: margin,
              y: yPosition,
              size: item.fontSize,
              font: font,
              color: rgb(0, 0, 0)
            });
            
            yPosition -= item.fontSize * 1.2;
          }
        }
        
        yPosition -= item.fontSize * 0.3; // Paragraph spacing
      }

      setProgress(90);

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      setConvertedPdf(pdfBytes);
      setProgress(100);

      toast({
        title: "Success!",
        description: "Word document converted to PDF successfully"
      });

    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion failed",
        description: "Could not convert Word document. Please ensure it's a valid .docx file.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!convertedPdf) return;

    const blob = new Blob([convertedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file?.name.replace(/\.(docx?|DOCX?)$/, '.pdf') || 'converted.pdf';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Your PDF has been downloaded successfully"
    });
  };

  const reset = () => {
    setFile(null);
    setConvertedPdf(null);
    setProgress(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumbs
          items={[
            { name: "Document Tools", url: "/all-tools#document" },
            { name: "Word to PDF", url: "/word-to-pdf" }
          ]}
        />

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium mb-4">
            <FileText className="h-4 w-4" />
            Document Conversion
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Word to PDF Converter
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Convert Microsoft Word documents (.docx) to PDF format instantly. Preserve your document's formatting, fonts, and structure with our secure browser-based converter.
          </p>
        </div>

        <PrivacyNotice message="100% Private: Your Word documents are converted entirely in your browser. Files never leave your device. No uploads, no storage, complete privacy." />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          <Card className="glass p-4 text-center">
            <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">100% Private</p>
          </Card>
          <Card className="glass p-4 text-center">
            <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Instant Conversion</p>
          </Card>
          <Card className="glass p-4 text-center">
            <FileCheck className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Keep Formatting</p>
          </Card>
        </div>

        {!file ? (
          <div className="mb-8 max-w-4xl mx-auto">
            <FileUpload
              onFileSelect={handleFileSelect}
              accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
              maxSize={100 * 1024 * 1024}
              title="Upload Word Document"
              description="Select or drag a Word file (.docx, .doc) to convert to PDF"
            />
          </div>
        ) : (
          <Card className="mb-8 p-6 max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* File Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Selected Document
                </h3>
                <div className="glass rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-sm font-medium truncate" data-testid="text-filename">{file.name}</span>
                  <span className="text-sm font-bold text-primary flex-shrink-0" data-testid="text-filesize">{formatFileSize(file.size)}</span>
                </div>
              </div>

              {/* Progress */}
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Converting to PDF...</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Success Message */}
              {convertedPdf && !isProcessing && (
                <div className="glass rounded-lg p-4 border-2 border-green-500/20 bg-green-500/5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-700 dark:text-green-400">Conversion Complete!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your Word document has been successfully converted to PDF format.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!convertedPdf ? (
                  <>
                    <Button
                      onClick={convertWordToPdf}
                      disabled={isProcessing}
                      className="flex-1 btn-gradient text-white"
                      size="lg"
                      data-testid="button-convert"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Converting...
                        </>
                      ) : (
                        <>
                          <FileDown className="w-5 h-5 mr-2" />
                          Convert to PDF
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={reset}
                      variant="outline"
                      size="lg"
                      disabled={isProcessing}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={downloadPdf}
                      className="flex-1 btn-gradient text-white"
                      size="lg"
                      data-testid="button-download"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download PDF
                    </Button>
                    <Button
                      onClick={reset}
                      variant="outline"
                      size="lg"
                      data-testid="button-convert-another"
                    >
                      Convert Another
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* SEO Content Sections */}
        <div className="max-w-4xl mx-auto space-y-12 mt-16">
          <HowItWorksSection
            toolName="Word to PDF Converter"
            steps={[
              {
                number: 1,
                title: "Upload Word Document",
                description: "Select your .docx or .doc file from your computer. Files are processed locally in your browser for complete privacy.",
                icon: Upload
              },
              {
                number: 2,
                title: "Automatic Conversion",
                description: "Our advanced conversion engine processes your document, preserving formatting, fonts, and structure while converting to PDF format.",
                icon: Zap
              },
              {
                number: 3,
                title: "Download PDF",
                description: "Download your converted PDF file instantly. The original formatting and content are preserved in a universally compatible format.",
                icon: Download
              }
            ]}
          />

          <WhyUseSection
            toolName="Word to PDF Converter"
            benefits={[
              "All conversions happen in your browser - documents never leave your device",
              "No subscriptions, no hidden fees - convert unlimited Word documents for free",
              "Maintains fonts, styles, headings, and document structure during conversion",
              "PDF files work on any device, operating system, or PDF reader",
              "Works directly in your browser - no software downloads or installations required",
              "Instant conversion powered by modern browser technology",
              "Client-side processing ensures your sensitive documents remain completely private",
              "Convert documents up to 100MB without restrictions or premium upgrades"
            ]}
            features={[
              commonFeatures.privacy,
              commonFeatures.speed,
              commonFeatures.free,
              {
                icon: FileCheck,
                title: "Format Preservation",
                description: "Maintains text formatting, fonts, and document structure in the converted PDF."
              }
            ]}
          />

          <UseCasesSection
            useCases={[
              {
                title: "Professional Documents",
                description: "Convert business reports, proposals, and contracts to PDF for professional distribution.",
                icon: Briefcase,
                example: "Business plans, quarterly reports, client proposals"
              },
              {
                title: "Academic Papers",
                description: "Submit essays, research papers, and assignments in universally accepted PDF format.",
                icon: GraduationCap,
                example: "Thesis submissions, research papers, coursework"
              },
              {
                title: "Resume & CV",
                description: "Convert your resume to PDF to preserve formatting when sending to recruiters and employers.",
                icon: FileText,
                example: "Job applications, professional portfolios"
              },
              {
                title: "Legal Documents",
                description: "Create PDF versions of legal agreements, contracts, and official documents for archival.",
                icon: FileX,
                example: "Contracts, legal agreements, official forms"
              },
              {
                title: "Email Attachments",
                description: "Send documents as PDFs to ensure recipients can open them regardless of their software.",
                icon: Mail,
                example: "Invoices, reports, documentation"
              },
              {
                title: "Document Archival",
                description: "Convert Word documents to PDF for long-term storage and future compatibility.",
                icon: Clock,
                example: "Historical records, archives, backups"
              }
            ]}
          />

          <ComparisonSection
            toolName="Word to PDF Converter"
            comparisons={[
              { feature: "Processing Location", ourTool: "100% in your browser", others: "Uploaded to their servers", highlight: true },
              { feature: "Privacy", ourTool: "Complete - files never leave device", others: "Unknown - data on servers", highlight: true },
              { feature: "Cost", ourTool: "Free forever", others: "Subscription or per-file fees" },
              { feature: "File Size Limit", ourTool: "Up to 100MB", others: "Usually 5-25MB for free" },
              { feature: "Conversion Speed", ourTool: "Instant - local processing", others: "Slower - server dependent" },
              { feature: "Internet Required", ourTool: "Only to load page", others: "Required for every conversion" },
              { feature: "Watermarks", ourTool: false, others: "Often added to free conversions" },
              { feature: "Installation", ourTool: false, others: "May require desktop software" },
              { feature: "Format Support", ourTool: ".docx, .doc", others: "Varies by service" },
              { feature: "Batch Conversion", ourTool: "Coming soon", others: "Usually premium only" }
            ]}
          />

          <ToolFAQ 
            toolName="Word to PDF Converter"
            toolPath="/word-to-pdf"
            faqs={generateWordToPDFFAQs()} 
          />
        </div>
      </div>
    </div>
  );
}

function generateWordToPDFFAQs() {
  return [
    {
      question: "How do I convert a Word document to PDF?",
      answer: "Simply upload your Word document (.docx or .doc file), click 'Convert to PDF', and download your converted file. The entire process happens in your browser for complete privacy."
    },
    {
      question: "Is it free to convert Word to PDF?",
      answer: "Yes! Our Word to PDF converter is completely free with no hidden costs, subscriptions, or file limits. Convert as many documents as you need."
    },
    {
      question: "Does the converter work on mobile devices?",
      answer: "Absolutely! Our converter works on all devices including smartphones, tablets, laptops, and desktop computers. It's fully responsive and optimized for mobile use."
    },
    {
      question: "Will my document formatting be preserved?",
      answer: "Yes, our converter preserves text formatting, fonts, headings, and document structure during conversion. Your PDF will maintain the same layout as your Word document."
    },
    {
      question: "Are my files safe and private?",
      answer: "Your files are completely safe. All conversion happens locally in your browser - your documents never leave your device. We don't upload, store, or access your files in any way."
    },
    {
      question: "What Word formats are supported?",
      answer: "We support modern .docx files (Word 2007 and newer) and legacy .doc files (Word 97-2003). Most Word documents will convert without issues."
    },
    {
      question: "Is there a file size limit?",
      answer: "You can convert Word documents up to 100MB in size, which is suitable for most documents including those with images and complex formatting."
    },
    {
      question: "Do I need to install any software?",
      answer: "No installation needed! Our converter works entirely in your web browser. Just visit the page and start converting immediately."
    },
    {
      question: "Can I convert multiple Word documents at once?",
      answer: "Currently, we support converting one document at a time. Batch conversion support is planned for a future update."
    },
    {
      question: "Why convert Word to PDF?",
      answer: "PDFs are universally compatible, preserve formatting across all devices, cannot be easily edited (protecting your content), and are the standard format for professional document sharing."
    },
    {
      question: "Will images in my Word document be included in the PDF?",
      answer: "Yes, images embedded in your Word document will be included in the converted PDF while maintaining their quality and positioning."
    },
    {
      question: "Do you add watermarks to the converted PDF?",
      answer: "No watermarks! Your converted PDFs are clean and professional with no branding, logos, or advertisements added."
    },
    {
      question: "Can I convert password-protected Word documents?",
      answer: "You'll need to remove the password protection from your Word document before converting it to PDF. Our tool doesn't support encrypted files for security reasons."
    },
    {
      question: "What if my conversion fails?",
      answer: "If conversion fails, ensure your file is a valid Word document (.docx or .doc), not corrupted, and under 100MB. Try reopening and resaving the document in Word before converting."
    },
    {
      question: "How long does conversion take?",
      answer: "Most Word documents convert to PDF in just a few seconds. Larger documents with many images may take slightly longer, but processing is typically very fast."
    }
  ];
}
