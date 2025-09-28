import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Type,
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Download,
  Upload,
  Settings,
  Eye,
  Shield,
  HelpCircle,
  ChevronRight,
  BookOpen,
  Target,
  Clock,
  Copy,
  Search,
  Languages
} from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function HowToExtractTextFromPDF() {
  // HowTo Schema for SEO
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Extract Text from PDF Files with OCR",
    description: "Learn how to extract and convert text from PDF documents, including scanned PDFs, using our free OCR tool",
    image: "https://altaftoolshub.com/images/extract-text-guide.png",
    totalTime: "PT3M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0"
    },
    supply: [],
    tool: [{
      "@type": "HowToTool",
      name: "AltafToolsHub Text Extractor with OCR"
    }],
    step: [
      {
        "@type": "HowToStep",
        name: "Upload PDF file",
        text: "Upload your PDF document to the text extractor",
        image: "https://altaftoolshub.com/images/extract-step1.png"
      },
      {
        "@type": "HowToStep",
        name: "Select extraction mode",
        text: "Choose between text extraction or OCR for scanned documents",
        image: "https://altaftoolshub.com/images/extract-step2.png"
      },
      {
        "@type": "HowToStep",
        name: "Process the document",
        text: "Click Extract Text to process your PDF",
        image: "https://altaftoolshub.com/images/extract-step3.png"
      },
      {
        "@type": "HowToStep",
        name: "Copy or download text",
        text: "Copy the extracted text or download as a text file",
        image: "https://altaftoolshub.com/images/extract-step4.png"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I extract text from scanned PDFs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Our tool uses advanced OCR (Optical Character Recognition) technology to extract text from scanned documents and images within PDFs."
        }
      },
      {
        "@type": "Question",
        name: "What languages does OCR support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our OCR supports multiple languages including English, Spanish, French, German, Italian, Portuguese, and many more. The tool automatically detects the language."
        }
      },
      {
        "@type": "Question",
        name: "Is the formatting preserved?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Basic text is extracted, but complex formatting, tables, and layouts may not be perfectly preserved. The tool focuses on accurate text extraction."
        }
      }
    ]
  };

  useSEO({
    title: "How to Extract Text from PDF - OCR Guide",
    description: "Learn how to extract text from PDF files including scanned documents. Free OCR tool with step-by-step guide for converting PDFs to editable text.",
    path: "/guides/how-to-extract-text-from-pdf",
    keywords: "extract text from PDF, PDF OCR, PDF to text converter, extract text from scanned PDF, PDF text extraction guide",
    structuredData: [howToSchema, faqSchema]
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/guides">Guides</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>How to Extract Text from PDF</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto"
        >
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              Complete Guide
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How to Extract Text from PDF Files
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Convert PDFs to editable text using advanced OCR technology
            </p>
            
            {/* Quick Info */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">5 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm">Difficulty: Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-sm">100% Private</span>
              </div>
            </div>

            <Button asChild size="lg" className="btn-gradient text-white">
              <Link href="/extract-text" data-testid="try-tool-extract-text">
                <Type className="w-4 h-4 mr-2" />
                Try Text Extractor Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Why Extract Text from PDFs?</h2>
              <p className="text-muted-foreground mb-4">
                Extracting text from PDFs allows you to edit, search, translate, and repurpose content locked in PDF format. 
                This is especially valuable for scanned documents, receipts, contracts, and research papers.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Make Editable</p>
                    <p className="text-sm text-muted-foreground">Convert static PDFs to editable text</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Enable Search</p>
                    <p className="text-sm text-muted-foreground">Make content searchable and indexable</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Accessibility</p>
                    <p className="text-sm text-muted-foreground">Help screen readers access content</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Types of PDFs */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Understanding PDF Types</h2>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Text-Based PDFs
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Created from word processors or web pages. Text can be selected and copied directly. OCR not needed.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Scanned PDFs
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Created from scanners or cameras. Essentially images of text. Requires OCR to extract text.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary" />
                    Mixed PDFs
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Contains both selectable text and scanned images. May need both extraction methods.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step by Step Guide */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Type className="w-6 h-6 text-primary" />
                Step-by-Step Instructions
              </h2>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      1
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-2">Upload Your PDF</h3>
                    <p className="text-muted-foreground mb-3">
                      Navigate to our Text Extractor tool and upload your PDF:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Click "Choose File" or drag and drop</li>
                      <li>Supports files up to 50MB</li>
                      <li>Works with single or multi-page PDFs</li>
                    </ul>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary/50" />
                      <span className="ml-2 text-muted-foreground">Screenshot Placeholder</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      2
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-2">Choose Extraction Method</h3>
                    <p className="text-muted-foreground mb-3">
                      Select the appropriate extraction method:
                    </p>
                    <div className="space-y-3">
                      <Alert>
                        <Type className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Standard Extraction:</strong> For PDFs with selectable text (faster)
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <Eye className="h-4 w-4" />
                        <AlertDescription>
                          <strong>OCR Mode:</strong> For scanned documents or images (more processing time)
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <Languages className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Language:</strong> Select document language for better OCR accuracy
                        </AlertDescription>
                      </Alert>
                    </div>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Settings className="w-8 h-8 text-primary/50" />
                      <span className="ml-2 text-muted-foreground">Screenshot Placeholder</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      3
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-2">Extract the Text</h3>
                    <p className="text-muted-foreground mb-3">
                      Click "Extract Text" and wait for processing. OCR may take 10-30 seconds per page depending on complexity.
                    </p>
                    <Alert className="mb-3">
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Tip:</strong> The tool will automatically detect if OCR is needed based on your PDF content
                      </AlertDescription>
                    </Alert>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Search className="w-8 h-8 text-primary/50" />
                      <span className="ml-2 text-muted-foreground">Screenshot Placeholder</span>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      4
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-2">Copy or Download Text</h3>
                    <p className="text-muted-foreground mb-3">
                      Once extraction is complete:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Review extracted text in the preview window</li>
                      <li>Copy to clipboard with one click</li>
                      <li>Download as .txt file</li>
                      <li>Edit directly in the text area</li>
                    </ul>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Copy className="w-8 h-8 text-primary/50" />
                      <span className="ml-2 text-muted-foreground">Screenshot Placeholder</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips and Tricks */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Tips for Best OCR Results
              </h2>
              <div className="space-y-3">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Image Quality:</strong> Higher resolution scans (300 DPI or more) produce better OCR results
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Clean Scans:</strong> Ensure documents are straight, well-lit, and free from shadows
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Font Size:</strong> Text should be at least 10pt for accurate recognition
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Language Selection:</strong> Choose the correct language for better accuracy
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Review Results:</strong> Always proofread OCR output for errors, especially with numbers
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Common Problems */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-orange-500" />
                Common Problems & Solutions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Text extraction returns gibberish or symbols?</AccordionTrigger>
                  <AccordionContent>
                    The PDF is likely scanned or image-based. Switch to OCR mode. If the issue persists, check if the document uses special fonts or is in a different language.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>OCR accuracy is poor?</AccordionTrigger>
                  <AccordionContent>
                    Improve scan quality if possible. Ensure proper language selection. For handwritten text, OCR may have limitations. Try preprocessing the image (increasing contrast, removing noise).
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Tables and formatting are lost?</AccordionTrigger>
                  <AccordionContent>
                    Text extraction focuses on content, not layout. For maintaining table structure, consider copying tables separately or using specialized table extraction tools.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Some pages extract but others don't?</AccordionTrigger>
                  <AccordionContent>
                    Mixed PDFs may have some pages as text and others as images. Process the entire document with OCR mode enabled for consistent results.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary" />
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1">
                  <AccordionTrigger>Is text extraction really free?</AccordionTrigger>
                  <AccordionContent>
                    Yes, our text extraction and OCR service is completely free with no limits on the number of PDFs you can process.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger>What file formats can I save extracted text in?</AccordionTrigger>
                  <AccordionContent>
                    Currently, we support plain text (.txt) format. You can copy the text and paste it into any word processor for other formats.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger>Can I extract text from password-protected PDFs?</AccordionTrigger>
                  <AccordionContent>
                    You'll need to unlock the PDF first using our PDF Unlocker tool, then extract the text from the unlocked version.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-4">
                  <AccordionTrigger>How accurate is the OCR technology?</AccordionTrigger>
                  <AccordionContent>
                    Our OCR achieves 95-99% accuracy on clear, printed text. Accuracy depends on scan quality, font type, and language. Handwritten text has lower accuracy.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-5">
                  <AccordionTrigger>Can I batch process multiple PDFs?</AccordionTrigger>
                  <AccordionContent>
                    Currently, files are processed one at a time. For batch processing, you can process files sequentially without page limits.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Extract Text from Your PDFs?</h2>
              <p className="text-muted-foreground mb-6">
                Convert PDFs to editable text instantly with our free OCR-powered tool.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="btn-gradient text-white">
                  <Link href="/extract-text" data-testid="cta-extract-text">
                    Try Text Extractor
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/guides" data-testid="cta-more-guides">
                    More Guides
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Guides */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Guides</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/guides/how-to-unlock-pdf" className="block">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">How to Unlock PDF Files</h3>
                        <p className="text-sm text-muted-foreground">Remove passwords before extraction</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/guides/how-to-compress-pdf" className="block">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">How to Compress PDF Files</h3>
                        <p className="text-sm text-muted-foreground">Reduce file size before processing</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}