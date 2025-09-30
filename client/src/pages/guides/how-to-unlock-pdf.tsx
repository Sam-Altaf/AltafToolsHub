import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Lock,
  Unlock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Download,
  Upload,
  Shield,
  HelpCircle,
  ChevronRight,
  BookOpen,
  Target,
  Clock,
  Key,
  FileText
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

export default function HowToUnlockPDF() {
  // HowTo Schema for SEO
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Unlock Password-Protected PDF Files",
    description: "Learn how to remove password protection from PDF files safely and securely using our free online tool",
    image: "https://altaftoolshub.app/images/unlock-pdf-guide.png",
    totalTime: "PT1M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0"
    },
    supply: [],
    tool: [{
      "@type": "HowToTool",
      name: "AltafToolsHub PDF Unlocker"
    }],
    step: [
      {
        "@type": "HowToStep",
        name: "Upload protected PDF",
        text: "Upload your password-protected PDF file to the tool",
        image: "https://altaftoolshub.app/images/unlock-step1.png"
      },
      {
        "@type": "HowToStep",
        name: "Enter password",
        text: "Enter the password for the PDF file",
        image: "https://altaftoolshub.app/images/unlock-step2.png"
      },
      {
        "@type": "HowToStep",
        name: "Unlock PDF",
        text: "Click the Unlock button to remove protection",
        image: "https://altaftoolshub.app/images/unlock-step3.png"
      },
      {
        "@type": "HowToStep",
        name: "Download unlocked file",
        text: "Download your unlocked PDF file",
        image: "https://altaftoolshub.app/images/unlock-step4.png"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is it legal to unlock PDF files?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, it's legal to unlock PDF files that you own or have permission to modify. Always ensure you have the right to unlock the document before proceeding."
        }
      },
      {
        "@type": "Question",
        name: "Can I unlock a PDF without the password?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, our tool requires the original password to unlock PDFs. This ensures security and prevents unauthorized access to protected documents."
        }
      },
      {
        "@type": "Question",
        name: "Is my password stored anywhere?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, your password is never stored. All processing happens in your browser, and neither the file nor the password is uploaded to any server."
        }
      }
    ]
  };

  useSEO({
    title: "How to Unlock PDF Files - Remove Password Protection",
    description: "Learn how to unlock password-protected PDF files safely. Step-by-step guide to remove PDF passwords online free with complete privacy.",
    path: "/guides/how-to-unlock-pdf",
    keywords: "unlock PDF, remove PDF password, PDF unlocker guide, unlock protected PDF, PDF password remover",
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
              <BreadcrumbPage>How to Unlock PDF</BreadcrumbPage>
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
              How to Unlock Password-Protected PDF Files
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Remove password protection from PDFs safely and maintain complete privacy
            </p>
            
            {/* Quick Info */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">3 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm">Difficulty: Easy</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-sm">100% Secure</span>
              </div>
            </div>

            <Button asChild size="lg" className="btn-gradient text-white">
              <Link href="/unlock-pdf" data-testid="try-tool-unlock-pdf">
                <Unlock className="w-4 h-4 mr-2" />
                Try PDF Unlocker Now
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
              <h2 className="text-2xl font-bold mb-4">Why Remove PDF Password Protection?</h2>
              <p className="text-muted-foreground mb-4">
                Password-protected PDFs can be inconvenient when you need to edit, print, or share documents frequently. 
                Removing password protection from your own PDFs makes them more accessible while maintaining control over who can view them.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Edit Freely</p>
                    <p className="text-sm text-muted-foreground">Modify content without restrictions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Easy Sharing</p>
                    <p className="text-sm text-muted-foreground">Share without password hassles</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Print Access</p>
                    <p className="text-sm text-muted-foreground">Print documents without limits</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step by Step Guide */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary" />
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
                    <h3 className="text-lg font-semibold mb-2">Upload Your Protected PDF</h3>
                    <p className="text-muted-foreground mb-3">
                      Navigate to our PDF Unlocker tool and upload your password-protected file:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Click "Choose File" to select from your device</li>
                      <li>Or drag and drop the PDF into the upload area</li>
                      <li>File size limit: 100MB</li>
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
                    <h3 className="text-lg font-semibold mb-2">Enter the PDF Password</h3>
                    <p className="text-muted-foreground mb-3">
                      Type the password for your PDF in the secure input field:
                    </p>
                    <Alert className="mb-3">
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Security Note:</strong> Your password is processed locally in your browser and never sent to any server
                      </AlertDescription>
                    </Alert>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Key className="w-8 h-8 text-primary/50" />
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
                    <h3 className="text-lg font-semibold mb-2">Unlock the PDF</h3>
                    <p className="text-muted-foreground mb-3">
                      Click the "Unlock PDF" button. The tool will verify the password and remove all restrictions from your document.
                    </p>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Unlock className="w-8 h-8 text-primary/50" />
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
                    <h3 className="text-lg font-semibold mb-2">Download Unlocked File</h3>
                    <p className="text-muted-foreground mb-3">
                      Once unlocked, download your PDF. It's now free from all password restrictions and ready for editing, printing, or sharing.
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
                    <strong>Keep Original:</strong> Always keep a backup of the original password-protected PDF
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Password Manager:</strong> Store PDF passwords in a password manager for easy access
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Batch Processing:</strong> Unlock multiple PDFs with the same password at once
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Re-protect if Needed:</strong> You can always add new password protection later
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
                  <AccordionTrigger>Incorrect password error?</AccordionTrigger>
                  <AccordionContent>
                    Double-check the password for typos. PDFs are case-sensitive. Try copying and pasting the password if you have it saved elsewhere.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>PDF has both owner and user passwords?</AccordionTrigger>
                  <AccordionContent>
                    You'll need the owner password to remove all restrictions. The user password only allows viewing. Contact the document owner if you don't have the owner password.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Still can't edit after unlocking?</AccordionTrigger>
                  <AccordionContent>
                    Some PDFs have form restrictions or are scanned images. Try our PDF editor tool or OCR text extraction for scanned documents.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>File too large to process?</AccordionTrigger>
                  <AccordionContent>
                    Files over 100MB need to be compressed first. Use our PDF Compressor tool, then unlock the compressed version.
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
                  <AccordionTrigger>Is it safe to unlock PDFs online?</AccordionTrigger>
                  <AccordionContent>
                    Yes, our tool is completely safe. All processing happens in your browser - your files and passwords never leave your device or get uploaded to any server.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger>Can I unlock PDFs without knowing the password?</AccordionTrigger>
                  <AccordionContent>
                    No, our tool requires the correct password. This security measure ensures only authorized users can unlock protected documents.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger>Will unlocking change the PDF content?</AccordionTrigger>
                  <AccordionContent>
                    No, unlocking only removes password protection. All content, formatting, and quality remain exactly the same.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-4">
                  <AccordionTrigger>Can I re-lock the PDF after unlocking?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can add new password protection anytime using PDF editing software or online tools.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-5">
                  <AccordionTrigger>Is this service really free?</AccordionTrigger>
                  <AccordionContent>
                    Yes, completely free with no hidden costs, watermarks, or usage limits. Unlock as many PDFs as you need.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Unlock Your PDFs?</h2>
              <p className="text-muted-foreground mb-6">
                Remove password protection from your PDFs instantly with our free, secure tool.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="btn-gradient text-white">
                  <Link href="/unlock-pdf" data-testid="cta-unlock-pdf">
                    Try PDF Unlocker
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
                        <p className="text-sm text-muted-foreground">Reduce PDF file size without losing quality</p>
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
                        <p className="text-sm text-muted-foreground">Extract and convert text using OCR</p>
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