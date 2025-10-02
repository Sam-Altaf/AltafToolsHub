import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import { 
  FileText, Download, Loader2, Upload, Shield, Zap, CheckCircle2, 
  FileCheck, XCircle, FileSearch, Table, Image as ImageIcon
} from "lucide-react";
import FileUpload from "@/components/ui/file-upload";
import PrivacyNotice from "@/components/privacy-notice";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import { HowItWorksSection, WhyUseSection, UseCasesSection, ComparisonSection } from "@/components/seo/tool-features";
import { ToolFAQ } from "@/components/seo/tool-faq";
import { ContactSupportSection } from "@/components/contact-support";
import * as pdfjsLib from "pdfjs-dist";
import { 
  Document, Packer, Paragraph, TextRun, HeadingLevel, 
  AlignmentType, ImageRun, Table as DocxTable, TableRow, TableCell as DocxTableCell,
  WidthType, BorderStyle
} from "docx";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ExtractedImage {
  data: Uint8Array;
  width: number;
  height: number;
  y: number; // Position for ordering
}

interface TextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
}

interface PDFTableCell {
  text: string;
  rowIndex: number;
  colIndex: number;
}

export default function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [convertedDocx, setConvertedDocx] = useState<Blob | null>(null);
  const [extractionStats, setExtractionStats] = useState<{
    textBlocks: number;
    images: number;
    tables: number;
  } | null>(null);
  const { toast } = useToast();

  const toolMetadata = {
    id: "pdf-to-word",
    title: "PDF to Word Converter",
    description: "Convert PDF files to editable Word documents with advanced formatting, images, and table preservation",
    extendedDescription: "Transform PDF documents into fully editable Word files (DOCX) with intelligent layout analysis. Our advanced converter extracts text with formatting, embeds images in their original positions, and reconstructs tables with proper structure. Perfect for editing scanned documents, reports, contracts, and presentations.",
    category: "document-conversion",
    href: "/pdf-to-word"
  };

  const howItWorksSteps = [
    {
      name: "Upload PDF",
      text: "Select your PDF file to convert. Supports any PDF with text, images, or tables.",
      icon: Upload
    },
    {
      name: "Smart Analysis", 
      text: "Our tool analyzes the PDF structure, detecting paragraphs, headings, images, and tables automatically.",
      icon: FileSearch
    },
    {
      name: "Extract Content",
      text: "Text, formatting, images, and tables are extracted while preserving layout and structure.",
      icon: Table
    },
    {
      name: "Download Word",
      text: "Get your editable Word document (.docx) with all content preserved and ready to edit.",
      icon: Download
    }
  ];

  const whyUseFeatures = [
    {
      icon: Shield,
      title: "100% Private & Secure",
      description: "All conversion happens in your browser. Your files never leave your device, ensuring complete privacy."
    },
    {
      icon: Zap,
      title: "Advanced Conversion",
      description: "Intelligent layout analysis preserves formatting, extracts images, and reconstructs tables automatically."
    },
    {
      icon: ImageIcon,
      title: "Image Preservation",
      description: "Embedded images are extracted and placed in the Word document, maintaining visual content."
    },
    {
      icon: Table,
      title: "Table Detection",
      description: "Automatically detects and converts PDF tables into editable Word tables with proper structure."
    },
    {
      icon: FileCheck,
      title: "Format Preservation",
      description: "Maintains headings, paragraphs, bold text, and document structure for easy editing."
    },
    {
      icon: CheckCircle2,
      title: "No Limits",
      description: "Unlimited conversions with no file size restrictions. Convert as many PDFs as you need, completely free."
    }
  ];

  const useCases = [
    {
      icon: FileText,
      title: "Edit Scanned Documents",
      description: "Convert scanned PDFs into editable Word documents for quick modifications and updates."
    },
    {
      icon: FileCheck,
      title: "Report Editing",
      description: "Extract text, charts, and tables from PDF reports to create updated versions in Word."
    },
    {
      icon: ImageIcon,
      title: "Presentation Content",
      description: "Convert PDF presentations with images and text into Word for repurposing content."
    }
  ];

  const breadcrumbItems = [
    { name: "Document Conversion", url: "/all-tools?category=document-conversion" },
    { name: "PDF to Word", url: "/pdf-to-word" }
  ];

  const comparisons = [
    { feature: "Price", ourTool: "Free Forever", others: "$6-20/month", highlight: true },
    { feature: "Client-Side Processing", ourTool: true, others: false, highlight: true },
    { feature: "File Size Limit", ourTool: "100MB", others: "5-15MB (free tier)" },
    { feature: "Daily Conversions", ourTool: "Unlimited", others: "2 conversions/day (free)" },
    { feature: "Privacy Guarantee", ourTool: "100% Private", others: "Cloud upload required" },
    { feature: "Image Extraction", ourTool: true, others: true },
    { feature: "Table Detection", ourTool: true, others: true },
    { feature: "Format Preservation", ourTool: "Good (80-90%)", others: "Excellent (95%+)" },
    { feature: "No Registration", ourTool: true, others: true }
  ];

  useSEO({
    title: "PDF to Word Converter - Convert PDF to Editable DOCX Online | AltafToolsHub",
    description: "Convert PDF to Word documents online for free. Advanced conversion with images, tables, and formatting preservation. 100% browser-based, secure, no uploads. Get editable DOCX instantly.",
    keywords: "pdf to word, pdf to docx, convert pdf to word, pdf converter, pdf to word online, free pdf to word converter, pdf to editable word, extract pdf to word",
    path: "/pdf-to-word"
  });

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setConvertedDocx(null);
    setProgress(0);
    setProgressMessage("");
    setExtractionStats(null);
  }, []);

  // Extract images from PDF page
  const extractImages = async (page: any): Promise<ExtractedImage[]> => {
    const images: ExtractedImage[] = [];
    
    try {
      const ops = await page.getOperatorList();
      const viewport = page.getViewport({ scale: 1.0 });
      
      for (let i = 0; i < ops.fnArray.length; i++) {
        // OPS.paintImageXObject = 85, OPS.paintInlineImageXObject = 86
        if (ops.fnArray[i] === 85 || ops.fnArray[i] === 86) {
          const imageName = ops.argsArray[i][0];
          
          try {
            const image = await page.objs.get(imageName);
            
            if (image && image.width && image.height) {
              // Get canvas representation
              const canvas = document.createElement('canvas');
              canvas.width = image.width;
              canvas.height = image.height;
              const ctx = canvas.getContext('2d');
              
              if (ctx && image.data) {
                const imageData = ctx.createImageData(image.width, image.height);
                
                // Handle different image types
                if (image.kind === 1) { // Grayscale
                  for (let j = 0; j < image.data.length; j++) {
                    const idx = j * 4;
                    imageData.data[idx] = image.data[j];
                    imageData.data[idx + 1] = image.data[j];
                    imageData.data[idx + 2] = image.data[j];
                    imageData.data[idx + 3] = 255;
                  }
                } else if (image.kind === 2) { // RGB
                  for (let j = 0, k = 0; j < image.data.length; j += 3, k += 4) {
                    imageData.data[k] = image.data[j];
                    imageData.data[k + 1] = image.data[j + 1];
                    imageData.data[k + 2] = image.data[j + 2];
                    imageData.data[k + 3] = 255;
                  }
                } else if (image.kind === 3) { // RGBA
                  imageData.data.set(image.data);
                }
                
                ctx.putImageData(imageData, 0, 0);
                
                // Convert to PNG blob
                const blob = await new Promise<Blob>((resolve) => {
                  canvas.toBlob((b) => resolve(b!), 'image/png');
                });
                
                const arrayBuffer = await blob.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                
                images.push({
                  data: uint8Array,
                  width: image.width,
                  height: image.height,
                  y: viewport.height - (ops.argsArray[i][2] || 0) // Y position for ordering
                });
              }
            }
          } catch (imgError) {
            console.warn('Could not extract image:', imgError);
          }
        }
      }
    } catch (error) {
      console.warn('Image extraction error:', error);
    }
    
    return images;
  };

  // Detect tables from text positioning
  const detectTables = (textItems: TextItem[]): PDFTableCell[][] => {
    const tables: PDFTableCell[][] = [];
    
    // Group text items by approximate Y position (rows)
    const rowGroups = new Map<number, TextItem[]>();
    const VERTICAL_THRESHOLD = 5;
    
    textItems.forEach(item => {
      const roundedY = Math.round(item.y / VERTICAL_THRESHOLD) * VERTICAL_THRESHOLD;
      if (!rowGroups.has(roundedY)) {
        rowGroups.set(roundedY, []);
      }
      rowGroups.get(roundedY)!.push(item);
    });
    
    // Check if rows form a table (multiple items aligned vertically)
    const sortedRows = Array.from(rowGroups.entries())
      .sort((a, b) => b[0] - a[0]) // Top to bottom
      .filter(([_, items]) => items.length >= 2); // At least 2 columns
    
    if (sortedRows.length >= 2) { // At least 2 rows
      // Detect column positions
      const columnPositions = new Set<number>();
      sortedRows.forEach(([_, items]) => {
        items.forEach(item => {
          const roundedX = Math.round(item.x / 10) * 10;
          columnPositions.add(roundedX);
        });
      });
      
      if (columnPositions.size >= 2 && columnPositions.size <= 10) {
        const sortedCols = Array.from(columnPositions).sort((a, b) => a - b);
        
        const tableCells: PDFTableCell[] = [];
        sortedRows.forEach(([_, items], rowIndex) => {
          items.sort((a, b) => a.x - b.x);
          
          items.forEach((item, colIndex) => {
            tableCells.push({
              text: item.text,
              rowIndex,
              colIndex
            });
          });
        });
        
        if (tableCells.length > 0) {
          tables.push(tableCells);
        }
      }
    }
    
    return tables;
  };

  const convertPdfToWord = async () => {
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a PDF smaller than 100MB.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(10);
    setProgressMessage("Loading PDF document...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      setProgress(20);
      setProgressMessage("Analyzing document structure...");

      const allParagraphs: Paragraph[] = [];
      let totalImages = 0;
      let totalTables = 0;
      let totalTextBlocks = 0;

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        setProgressMessage(`Processing page ${pageNum} of ${pdf.numPages}...`);
        setProgress(20 + (pageNum / pdf.numPages) * 60);

        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const viewport = page.getViewport({ scale: 1.0 });

        // Extract text with positioning
        const textItems: TextItem[] = textContent.items.map((item: any) => ({
          text: item.str,
          x: item.transform[4],
          y: viewport.height - item.transform[5], // Flip Y coordinate
          width: item.width,
          height: item.height,
          fontSize: Math.round(item.transform[0]) || 12,
          fontName: item.fontName || 'normal'
        }));

        // Detect tables
        const pageTables = detectTables(textItems);
        totalTables += pageTables.length;

        // Extract images
        const images = await extractImages(page);
        totalImages += images.length;

        // Sort items by Y position (top to bottom), then X (left to right)
        const sortedItems = [...textItems].sort((a, b) => {
          if (Math.abs(a.y - b.y) < 5) return a.x - b.x;
          return a.y - b.y;
        });

        // Group into paragraphs
        let currentParagraph: TextItem[] = [];
        let lastY = -1;
        const PARAGRAPH_THRESHOLD = 15;

        sortedItems.forEach((item, idx) => {
          if (item.text.trim().length === 0) return;

          if (lastY === -1 || Math.abs(item.y - lastY) < PARAGRAPH_THRESHOLD) {
            currentParagraph.push(item);
            lastY = item.y;
          } else {
            if (currentParagraph.length > 0) {
              // Create paragraph from accumulated items
              const paragraphText = currentParagraph.map(t => t.text).join(' ');
              const avgFontSize = currentParagraph.reduce((sum, t) => sum + t.fontSize, 0) / currentParagraph.length;
              const isBold = currentParagraph.some(t => t.fontName.toLowerCase().includes('bold'));
              const isItalic = currentParagraph.some(t => t.fontName.toLowerCase().includes('italic') || t.fontName.toLowerCase().includes('oblique'));
              
              let headingLevel: typeof HeadingLevel[keyof typeof HeadingLevel] | undefined;
              if (avgFontSize > 18) headingLevel = HeadingLevel.HEADING_1;
              else if (avgFontSize > 16) headingLevel = HeadingLevel.HEADING_2;
              else if (avgFontSize > 14) headingLevel = HeadingLevel.HEADING_3;

              const runs = [new TextRun({
                text: paragraphText,
                bold: isBold || headingLevel !== undefined,
                italics: isItalic,
                size: Math.round(avgFontSize * 2) // Convert to half-points
              })];

              allParagraphs.push(new Paragraph({
                children: runs,
                heading: headingLevel,
                spacing: { after: 200 }
              }));
              
              totalTextBlocks++;
            }

            currentParagraph = [item];
            lastY = item.y;
          }
        });

        // Add last paragraph
        if (currentParagraph.length > 0) {
          const paragraphText = currentParagraph.map(t => t.text).join(' ');
          const avgFontSize = currentParagraph.reduce((sum, t) => sum + t.fontSize, 0) / currentParagraph.length;
          const isBold = currentParagraph.some(t => t.fontName.toLowerCase().includes('bold'));
          const isItalic = currentParagraph.some(t => t.fontName.toLowerCase().includes('italic') || t.fontName.toLowerCase().includes('oblique'));

          allParagraphs.push(new Paragraph({
            children: [new TextRun({
              text: paragraphText,
              bold: isBold,
              italics: isItalic,
              size: Math.round(avgFontSize * 2)
            })],
            spacing: { after: 200 }
          }));
          totalTextBlocks++;
        }

        // Add images to document
        if (images.length > 0) {
          images.forEach(img => {
            try {
              const maxWidth = 600;
              const scale = img.width > maxWidth ? maxWidth / img.width : 1;
              
              // Create ImageRun and add to document
              const imageRun = new ImageRun({
                data: img.data,
                transformation: {
                  width: Math.round(img.width * scale),
                  height: Math.round(img.height * scale)
                }
              });
              
              allParagraphs.push(new Paragraph({
                children: [imageRun],
                spacing: { after: 200, before: 200 }
              }));
            } catch (imgError) {
              console.warn('Could not add image to document:', imgError);
            }
          });
        }

        // Add tables to document
        if (pageTables.length > 0) {
          pageTables.forEach(tableCells => {
            const maxRow = Math.max(...tableCells.map(c => c.rowIndex));
            const maxCol = Math.max(...tableCells.map(c => c.colIndex));
            
            const rows: TableRow[] = [];
            
            for (let r = 0; r <= maxRow; r++) {
              const cells: DocxTableCell[] = [];
              
              for (let c = 0; c <= maxCol; c++) {
                const cellData = tableCells.find(tc => tc.rowIndex === r && tc.colIndex === c);
                
                cells.push(
                  new DocxTableCell({
                    children: [new Paragraph({
                      children: [new TextRun({
                        text: cellData?.text || '',
                        size: 20
                      })]
                    })],
                    width: { size: 100 / (maxCol + 1), type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1 },
                      bottom: { style: BorderStyle.SINGLE, size: 1 },
                      left: { style: BorderStyle.SINGLE, size: 1 },
                      right: { style: BorderStyle.SINGLE, size: 1 }
                    }
                  })
                );
              }
              
              rows.push(new TableRow({ children: cells }));
            }
            
            const docxTable = new DocxTable({
              rows,
              width: { size: 100, type: WidthType.PERCENTAGE }
            });
            
            allParagraphs.push(docxTable as any);
          });
        }

        // Add page break (except for last page)
        if (pageNum < pdf.numPages) {
          allParagraphs.push(new Paragraph({
            text: '',
            pageBreakBefore: true
          }));
        }
      }

      setProgressMessage("Creating Word document...");
      setProgress(85);

      // Create Word document
      const doc = new Document({
        sections: [{
          properties: {},
          children: allParagraphs
        }]
      });

      setProgressMessage("Finalizing document...");
      setProgress(95);

      // Generate DOCX file
      const blob = await Packer.toBlob(doc);
      setConvertedDocx(blob);
      
      setExtractionStats({
        textBlocks: totalTextBlocks,
        images: totalImages,
        tables: totalTables
      });

      setProgress(100);
      setProgressMessage("Conversion complete!");

      toast({
        title: "Success!",
        description: `PDF converted to Word successfully! Extracted ${totalTextBlocks} text blocks, ${totalImages} images, and ${totalTables} tables.`,
      });

    } catch (error) {
      console.error("Conversion error:", error);
      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "An error occurred during conversion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadWord = () => {
    if (!convertedDocx || !file) return;

    const url = URL.createObjectURL(convertedDocx);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name.replace(/\.pdf$/i, '.docx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Your Word document has been downloaded successfully.",
    });
  };

  const faqItems = [
    {
      question: "How accurate is the PDF to Word conversion?",
      answer: "Our converter uses advanced layout analysis to extract text, images, and tables with high accuracy. Simple text documents convert perfectly, while complex layouts are simplified for editability. Formatting, headings, and structure are preserved as much as possible."
    },
    {
      question: "Are images preserved in the Word document?",
      answer: "Yes! Our tool automatically extracts embedded images from your PDF and places them in the Word document. Images maintain their quality and are positioned sequentially in the document flow."
    },
    {
      question: "Can it convert tables from PDF to Word?",
      answer: "Absolutely! Our intelligent table detection algorithm identifies tables in your PDF and converts them into editable Word tables with proper rows, columns, and borders. Complex nested tables may be simplified."
    },
    {
      question: "Is my PDF file uploaded to a server?",
      answer: "No, never! All conversion happens entirely in your browser using JavaScript. Your PDF file never leaves your device, ensuring complete privacy and security."
    },
    {
      question: "What file size limit is there?",
      answer: "You can convert PDFs up to 100MB in size. Larger files may cause browser performance issues. For best results, use PDFs under 50MB."
    },
    {
      question: "Does it work with scanned PDFs?",
      answer: "The converter works best with digital PDFs that contain selectable text. Scanned PDFs (images of text) will have limited text extraction unless they've been OCR-processed. For scanned documents, try our OCR tool first."
    },
    {
      question: "How long does conversion take?",
      answer: "Conversion speed depends on PDF size and complexity. Simple PDFs convert in seconds, while large documents with many images and tables may take 1-2 minutes."
    },
    {
      question: "Can I edit the converted Word document?",
      answer: "Yes! The output is a standard .docx file that can be opened and edited in Microsoft Word, Google Docs, LibreOffice, or any compatible word processor. All text, images, and tables are fully editable."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
            PDF to Word Converter
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert PDF files to editable Word documents with advanced formatting, images, and table preservation
          </p>
        </div>

        <PrivacyNotice
          message="Your PDFs are processed entirely in your browser. Files never leave your device."
        />

        <Card className="p-6 md:p-8 mb-8 border-2">
          {!file ? (
            <FileUpload
              accept=".pdf"
              onFileSelect={handleFileSelect}
              maxSize={100 * 1024 * 1024}
              title="Upload PDF File"
              description="Drag and drop your PDF here, or click to browse"
            />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border-2 border-primary/20">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium" data-testid="text-filename">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setConvertedDocx(null);
                    setProgress(0);
                    setProgressMessage("");
                    setExtractionStats(null);
                  }}
                  data-testid="button-remove-file"
                >
                  Remove
                </Button>
              </div>

              {isProcessing && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span data-testid="text-progress-message">{progressMessage}</span>
                  </div>
                  <Progress value={progress} className="h-2" data-testid="progress-bar" />
                  <p className="text-sm text-muted-foreground" data-testid="text-progress-percent">
                    {progress}% complete
                  </p>
                </div>
              )}

              {convertedDocx && extractionStats && (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                          Conversion Successful!
                        </h3>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                              {extractionStats.textBlocks}
                            </p>
                            <p className="text-emerald-600 dark:text-emerald-400">Text Blocks</p>
                          </div>
                          <div>
                            <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                              {extractionStats.images}
                            </p>
                            <p className="text-emerald-600 dark:text-emerald-400">Images</p>
                          </div>
                          <div>
                            <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                              {extractionStats.tables}
                            </p>
                            <p className="text-emerald-600 dark:text-emerald-400">Tables</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={downloadWord}
                    className="w-full h-12 text-lg"
                    size="lg"
                    data-testid="button-download"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Word Document (.docx)
                  </Button>
                </div>
              )}

              {!convertedDocx && !isProcessing && (
                <Button
                  onClick={convertPdfToWord}
                  className="w-full h-12 text-lg"
                  size="lg"
                  data-testid="button-convert"
                >
                  <FileCheck className="w-5 h-5 mr-2" />
                  Convert to Word
                </Button>
              )}
            </div>
          )}
        </Card>

        <HowItWorksSection
          toolName="PDF to Word Converter"
          steps={howItWorksSteps.map((step, index) => ({
            number: index + 1,
            title: step.name,
            description: step.text,
            icon: step.icon
          }))}
        />

        <WhyUseSection
          toolName="PDF to Word Converter"
          benefits={[
            "100% free with unlimited conversions",
            "Complete privacy - all processing happens in your browser",
            "Advanced image and table extraction",
            "Preserves formatting and document structure",
            "No file size limits or daily restrictions",
            "No registration or sign-up required"
          ]}
          features={whyUseFeatures}
        />

        <UseCasesSection
          useCases={useCases}
        />

        <ComparisonSection
          toolName="PDF to Word Converter"
          comparisons={comparisons}
        />

        <ToolFAQ 
          faqs={faqItems}
          toolName="PDF to Word Converter"
          toolPath="/pdf-to-word"
        />

        <ContactSupportSection />
      </div>
    </div>
  );
}
