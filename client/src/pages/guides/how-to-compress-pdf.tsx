import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Download,
  Upload,
  Settings,
  Zap,
  Shield,
  HelpCircle,
  ChevronRight,
  BookOpen,
  Target,
  Clock
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

export default function HowToCompressPDF() {
  // HowTo Schema for SEO
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Compress PDF Files Without Losing Quality",
    description: "Learn how to reduce PDF file size while maintaining quality using our free online PDF compressor tool",
    image: "https://altaftoolshub.com/images/compress-pdf-guide.png",
    totalTime: "PT2M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0"
    },
    supply: [],
    tool: [{
      "@type": "HowToTool",
      name: "AltafToolsHub PDF Compressor"
    }],
    step: [
      {
        "@type": "HowToStep",
        name: "Upload your PDF",
        text: "Click the upload button or drag and drop your PDF file into the tool",
        image: "https://altaftoolshub.com/images/step1.png"
      },
      {
        "@type": "HowToStep",
        name: "Select compression level",
        text: "Choose from High, Medium, or Low compression based on your needs",
        image: "https://altaftoolshub.com/images/step2.png"
      },
      {
        "@type": "HowToStep",
        name: "Compress the PDF",
        text: "Click the Compress button and wait for processing",
        image: "https://altaftoolshub.com/images/step3.png"
      },
      {
        "@type": "HowToStep",
        name: "Download compressed file",
        text: "Download your compressed PDF file",
        image: "https://altaftoolshub.com/images/step4.png"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Will compressing my PDF reduce its quality?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our tool offers different compression levels. High compression maintains excellent quality while still reducing file size. Medium and Low compression offer more size reduction with minimal quality loss."
        }
      },
      {
        "@type": "Question",
        name: "How much can I reduce my PDF file size?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "File size reduction varies based on content. Text-heavy PDFs can be reduced by 60-80%, while image-heavy PDFs typically see 30-50% reduction without noticeable quality loss."
        }
      },
      {
        "@type": "Question",
        name: "Is it safe to compress sensitive PDFs online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Our tool processes everything in your browser. Your files never leave your device and are not uploaded to any server, ensuring complete privacy and security."
        }
      }
    ]
  };

  useSEO({
    title: "How to Compress PDF Files - Complete Guide 2025",
    description: "Learn how to compress PDF files online for free. Reduce PDF size without losing quality using our step-by-step guide and best practices.",
    path: "/guides/how-to-compress-pdf",
    keywords: "how to compress PDF, reduce PDF size, PDF compression guide, compress PDF online free, PDF file size reducer",
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
              <BreadcrumbPage>How to Compress PDF</BreadcrumbPage>
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
              How to Compress PDF Files Without Losing Quality
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Learn the best techniques to reduce PDF file size while maintaining document quality
            </p>
            
            {/* Quick Info */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">5 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm">Difficulty: Easy</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-sm">100% Private</span>
              </div>
            </div>

            <Button asChild size="lg" className="btn-gradient text-white">
              <Link href="/compress-pdf" data-testid="try-tool-compress-pdf">
                <Zap className="w-4 h-4 mr-2" />
                Try PDF Compressor Now
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
              <h2 className="text-2xl font-bold mb-4">Why Compress PDF Files?</h2>
              <p className="text-muted-foreground mb-4">
                PDF compression is essential for sharing documents via email, uploading to websites, or saving storage space. 
                Large PDF files can be problematic for email attachments (often limited to 25MB) and slow to upload or download.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Email Ready</p>
                    <p className="text-sm text-muted-foreground">Fit within email size limits</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Faster Uploads</p>
                    <p className="text-sm text-muted-foreground">Quick sharing and transfers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Save Storage</p>
                    <p className="text-sm text-muted-foreground">Reduce disk space usage</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step by Step Guide */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
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
                    <h3 className="text-lg font-semibold mb-2">Upload Your PDF File</h3>
                    <p className="text-muted-foreground mb-3">
                      Navigate to our PDF Compressor tool and upload your file using one of these methods:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Click the "Choose File" button and select from your device</li>
                      <li>Drag and drop your PDF directly onto the upload area</li>
                      <li>Paste from clipboard if you've copied a PDF</li>
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
                    <h3 className="text-lg font-semibold mb-2">Choose Compression Level</h3>
                    <p className="text-muted-foreground mb-3">
                      Select the compression level that best suits your needs:
                    </p>
                    <div className="space-y-3">
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          <strong>High Quality:</strong> Minimal compression, best for professional documents
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Medium Quality:</strong> Balanced compression, ideal for most uses
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Low Quality:</strong> Maximum compression, best for drafts or previews
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
                    <h3 className="text-lg font-semibold mb-2">Compress Your PDF</h3>
                    <p className="text-muted-foreground mb-3">
                      Click the "Compress PDF" button. The tool will process your file entirely in your browser - 
                      no uploads to servers, ensuring complete privacy.
                    </p>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-8 h-8 text-primary/50" />
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
                    <h3 className="text-lg font-semibold mb-2">Download Compressed File</h3>
                    <p className="text-muted-foreground mb-3">
                      Once compression is complete, download your optimized PDF. The tool will show you the 
                      size reduction percentage and new file size.
                    </p>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Download className="w-8 h-8 text-primary/50" />
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
                Tips for Best Results
              </h2>
              <div className="space-y-3">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>For Email:</strong> Use Medium or Low quality to ensure files stay under 25MB limit
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>For Printing:</strong> Stick with High quality to maintain text clarity and image sharpness
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>For Web Upload:</strong> Medium quality offers the best balance between size and quality
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Batch Processing:</strong> Compress multiple files at once for efficiency
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
                  <AccordionTrigger>PDF still too large after compression?</AccordionTrigger>
                  <AccordionContent>
                    Try using a lower quality setting or consider splitting the PDF into multiple smaller files. 
                    Image-heavy PDFs may need image optimization before compression.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Text appears blurry after compression?</AccordionTrigger>
                  <AccordionContent>
                    This typically happens with the Low quality setting. Try Medium or High quality instead. 
                    Text-only PDFs compress well even at High quality.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Images lose too much quality?</AccordionTrigger>
                  <AccordionContent>
                    Use High quality compression for PDFs with important images. Consider optimizing images 
                    before creating the PDF for better results.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Compression taking too long?</AccordionTrigger>
                  <AccordionContent>
                    Large files may take longer to process. Ensure you have a stable internet connection and 
                    sufficient device resources. Try closing other browser tabs if needed.
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
                  <AccordionTrigger>Is PDF compression really free?</AccordionTrigger>
                  <AccordionContent>
                    Yes, our PDF compression tool is completely free with no hidden costs, watermarks, or limitations on the number of files you can compress.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger>Are my files secure during compression?</AccordionTrigger>
                  <AccordionContent>
                    Absolutely! All processing happens in your browser. Your files never leave your device and aren't uploaded to any server, ensuring complete privacy.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger>What's the maximum file size I can compress?</AccordionTrigger>
                  <AccordionContent>
                    Our tool can handle files up to 100MB. For larger files, consider splitting them first or using our batch processing feature.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-4">
                  <AccordionTrigger>Can I compress password-protected PDFs?</AccordionTrigger>
                  <AccordionContent>
                    You'll need to unlock the PDF first using our PDF Unlocker tool, then compress it. You can re-apply password protection after compression if needed.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-5">
                  <AccordionTrigger>How much can I expect to reduce file size?</AccordionTrigger>
                  <AccordionContent>
                    It varies by content type: text-heavy PDFs can see 60-80% reduction, mixed content typically 40-60%, and image-heavy PDFs around 30-50% without significant quality loss.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Compress Your PDFs?</h2>
              <p className="text-muted-foreground mb-6">
                Start reducing your PDF file sizes now with our free, secure, and easy-to-use tool.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="btn-gradient text-white">
                  <Link href="/compress-pdf" data-testid="cta-compress-pdf">
                    Try PDF Compressor
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
                        <p className="text-sm text-muted-foreground">Remove password protection from PDFs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/guides/how-to-convert-jpg-to-pdf" className="block">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">How to Convert JPG to PDF</h3>
                        <p className="text-sm text-muted-foreground">Convert images to PDF documents</p>
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