import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Image,
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Download,
  Upload,
  Settings,
  Layers,
  Shield,
  HelpCircle,
  ChevronRight,
  BookOpen,
  Target,
  Clock,
  Move
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

export default function HowToConvertJpgToPdf() {
  // HowTo Schema for SEO
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Convert JPG Images to PDF Documents",
    description: "Learn how to convert JPG, PNG, and other image formats to PDF documents online for free",
    image: "https://altaftoolshub.com/images/jpg-to-pdf-guide.png",
    totalTime: "PT2M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0"
    },
    supply: [],
    tool: [{
      "@type": "HowToTool",
      name: "AltafToolsHub JPG to PDF Converter"
    }],
    step: [
      {
        "@type": "HowToStep",
        name: "Select images",
        text: "Upload one or more JPG or PNG images",
        image: "https://altaftoolshub.com/images/jpg-step1.png"
      },
      {
        "@type": "HowToStep",
        name: "Arrange order",
        text: "Drag and drop to arrange image order in the PDF",
        image: "https://altaftoolshub.com/images/jpg-step2.png"
      },
      {
        "@type": "HowToStep",
        name: "Configure settings",
        text: "Choose page size, orientation, and margins",
        image: "https://altaftoolshub.com/images/jpg-step3.png"
      },
      {
        "@type": "HowToStep",
        name: "Convert to PDF",
        text: "Click convert and download your PDF",
        image: "https://altaftoolshub.com/images/jpg-step4.png"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I convert multiple images to one PDF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! You can upload multiple JPG, PNG, or other image files and combine them into a single PDF document. You can also arrange the order of pages before conversion."
        }
      },
      {
        "@type": "Question",
        name: "What image formats are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our tool supports JPG, JPEG, PNG, GIF, BMP, and WebP formats. All common image types can be converted to PDF."
        }
      },
      {
        "@type": "Question",
        name: "Will my images lose quality during conversion?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, our tool preserves the original image quality. You can choose compression settings if you want to reduce file size, but the default setting maintains full quality."
        }
      }
    ]
  };

  useSEO({
    title: "How to Convert JPG to PDF - Complete Guide",
    description: "Learn how to convert JPG, PNG and other images to PDF documents online free. Create multi-page PDFs from photos with our step-by-step guide.",
    path: "/guides/how-to-convert-jpg-to-pdf",
    keywords: "convert JPG to PDF, image to PDF converter, JPG to PDF guide, photo to PDF, PNG to PDF",
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
              <BreadcrumbPage>How to Convert JPG to PDF</BreadcrumbPage>
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
              How to Convert JPG Images to PDF Documents
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create professional PDF documents from your images with just a few clicks
            </p>
            
            {/* Quick Info */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">4 min read</span>
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
              <Link href="/jpg-to-pdf" data-testid="try-tool-jpg-to-pdf">
                <Image className="w-4 h-4 mr-2" />
                Try JPG to PDF Converter
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
              <h2 className="text-2xl font-bold mb-4">Why Convert Images to PDF?</h2>
              <p className="text-muted-foreground mb-4">
                Converting images to PDF format is essential for creating professional documents, portfolios, reports, 
                and presentations. PDFs maintain formatting across all devices and are universally accepted for document sharing.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Multi-page Documents</p>
                    <p className="text-sm text-muted-foreground">Combine multiple images into one file</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Professional Sharing</p>
                    <p className="text-sm text-muted-foreground">Standard format for business</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Preserved Quality</p>
                    <p className="text-sm text-muted-foreground">Maintain image resolution</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step by Step Guide */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Image className="w-6 h-6 text-primary" />
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
                    <h3 className="text-lg font-semibold mb-2">Select Your Images</h3>
                    <p className="text-muted-foreground mb-3">
                      Upload one or more image files to convert:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Click "Choose Files" to select multiple images at once</li>
                      <li>Or drag and drop images directly onto the tool</li>
                      <li>Supported formats: JPG, PNG, GIF, BMP, WebP</li>
                      <li>No limit on the number of images</li>
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
                    <h3 className="text-lg font-semibold mb-2">Arrange Image Order</h3>
                    <p className="text-muted-foreground mb-3">
                      Organize your images in the desired sequence:
                    </p>
                    <Alert className="mb-3">
                      <Move className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Tip:</strong> Drag and drop images to reorder them. The order you set will be the page order in your PDF.
                      </AlertDescription>
                    </Alert>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Preview thumbnails of all uploaded images</li>
                      <li>Remove unwanted images with the delete button</li>
                      <li>Add more images if needed</li>
                    </ul>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Layers className="w-8 h-8 text-primary/50" />
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
                    <h3 className="text-lg font-semibold mb-2">Configure PDF Settings</h3>
                    <p className="text-muted-foreground mb-3">
                      Customize your PDF output:
                    </p>
                    <div className="space-y-3">
                      <Alert>
                        <Settings className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Page Size:</strong> Letter, A4, Legal, or Custom dimensions
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <Settings className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Orientation:</strong> Portrait or Landscape
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <Settings className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Margins:</strong> None, Small, Normal, or Large
                        </AlertDescription>
                      </Alert>
                    </div>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Settings className="w-8 h-8 text-primary/50" />
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
                    <h3 className="text-lg font-semibold mb-2">Convert and Download</h3>
                    <p className="text-muted-foreground mb-3">
                      Click "Convert to PDF" and download your document. The conversion happens instantly in your browser.
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
                    <strong>Image Resolution:</strong> Use high-resolution images (300 DPI or higher) for print-quality PDFs
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Consistent Sizing:</strong> Use images with similar dimensions for a professional look
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>File Naming:</strong> The PDF will be named based on the first image - rename it before conversion
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Compression:</strong> Choose "Optimize for Web" if you'll be emailing or uploading the PDF
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
                  <AccordionTrigger>Images appear rotated in the PDF?</AccordionTrigger>
                  <AccordionContent>
                    Some cameras save rotation data separately. Use the rotation controls in our tool to correct orientation before conversion, or pre-rotate images on your device.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>PDF file size is too large?</AccordionTrigger>
                  <AccordionContent>
                    Enable compression in the settings or reduce image dimensions before conversion. You can also use our PDF Compressor tool after conversion.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Images look blurry in the PDF?</AccordionTrigger>
                  <AccordionContent>
                    Ensure you're using high-resolution source images. Avoid excessive compression and maintain original image quality settings.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can't select multiple images?</AccordionTrigger>
                  <AccordionContent>
                    Hold Ctrl (Windows) or Cmd (Mac) while clicking to select multiple files. Alternatively, drag and drop all images at once onto the upload area.
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
                  <AccordionTrigger>How many images can I convert at once?</AccordionTrigger>
                  <AccordionContent>
                    There's no hard limit on the number of images. You can convert hundreds of images into a single PDF, though very large batches may take longer to process.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger>What's the maximum image size supported?</AccordionTrigger>
                  <AccordionContent>
                    Individual images can be up to 50MB each. The total size of all images combined should not exceed 200MB for optimal performance.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger>Can I add text or annotations to the PDF?</AccordionTrigger>
                  <AccordionContent>
                    This tool focuses on image conversion. For adding text or annotations, convert to PDF first, then use a PDF editor to add content.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-4">
                  <AccordionTrigger>Will EXIF data be preserved?</AccordionTrigger>
                  <AccordionContent>
                    Basic image data is preserved, but detailed EXIF metadata may be removed for privacy and file size optimization.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-5">
                  <AccordionTrigger>Can I convert other formats like HEIC or RAW?</AccordionTrigger>
                  <AccordionContent>
                    Currently, we support JPG, PNG, GIF, BMP, and WebP. For HEIC or RAW files, convert them to JPG first using your device's photo app.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Convert Your Images?</h2>
              <p className="text-muted-foreground mb-6">
                Create professional PDF documents from your images in seconds with our free tool.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="btn-gradient text-white">
                  <Link href="/jpg-to-pdf" data-testid="cta-jpg-to-pdf">
                    Try JPG to PDF Converter
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
              <Link href="/guides/how-to-compress-pdf" className="block">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">How to Compress PDF Files</h3>
                        <p className="text-sm text-muted-foreground">Reduce PDF file size after conversion</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/guides/how-to-extract-text-from-pdf" className="block">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">How to Extract Text from PDF</h3>
                        <p className="text-sm text-muted-foreground">Extract text from scanned PDFs</p>
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