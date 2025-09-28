import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  QrCode,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Download,
  Settings,
  Palette,
  Shield,
  HelpCircle,
  ChevronRight,
  BookOpen,
  Target,
  Clock,
  Link as LinkIcon,
  Mail,
  Phone,
  Wifi,
  MapPin,
  CreditCard
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

export default function HowToGenerateQRCode() {
  // HowTo Schema for SEO
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Generate QR Codes for Free",
    description: "Learn how to create custom QR codes for URLs, text, WiFi, email, and more using our free online QR code generator",
    image: "https://altaftoolshub.com/images/qr-code-guide.png",
    totalTime: "PT3M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0"
    },
    supply: [],
    tool: [{
      "@type": "HowToTool",
      name: "AltafToolsHub QR Code Generator"
    }],
    step: [
      {
        "@type": "HowToStep",
        name: "Choose QR code type",
        text: "Select what type of QR code you want to create",
        image: "https://altaftoolshub.com/images/qr-step1.png"
      },
      {
        "@type": "HowToStep",
        name: "Enter your content",
        text: "Input the URL, text, or information for your QR code",
        image: "https://altaftoolshub.com/images/qr-step2.png"
      },
      {
        "@type": "HowToStep",
        name: "Customize design",
        text: "Choose colors and size for your QR code",
        image: "https://altaftoolshub.com/images/qr-step3.png"
      },
      {
        "@type": "HowToStep",
        name: "Download QR code",
        text: "Generate and download your QR code in PNG or SVG format",
        image: "https://altaftoolshub.com/images/qr-step4.png"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do QR codes expire?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Static QR codes (like the ones our tool generates) never expire. They will work forever as long as the content they link to remains available."
        }
      },
      {
        "@type": "Question",
        name: "How much data can a QR code hold?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "QR codes can hold up to 4,296 alphanumeric characters or 7,089 numeric characters. However, for best scanning reliability, keep content under 300 characters."
        }
      },
      {
        "@type": "Question",
        name: "Can I track QR code scans?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Static QR codes don't have built-in tracking. For analytics, you can use URL shorteners with tracking features or create dynamic QR codes with tracking services."
        }
      }
    ]
  };

  useSEO({
    title: "How to Generate QR Codes - Complete Guide 2025",
    description: "Learn how to create custom QR codes for free. Generate QR codes for URLs, WiFi, emails, phone numbers and more with our step-by-step guide.",
    path: "/guides/how-to-generate-qr-code",
    keywords: "generate QR code, create QR code free, QR code generator guide, custom QR codes, QR code tutorial",
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
              <BreadcrumbPage>How to Generate QR Code</BreadcrumbPage>
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
              How to Generate Custom QR Codes
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create QR codes for websites, WiFi, contact info, and more in seconds
            </p>
            
            {/* Quick Info */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">6 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm">Difficulty: Easy</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-sm">No Registration</span>
              </div>
            </div>

            <Button asChild size="lg" className="btn-gradient text-white">
              <Link href="/qr-generator" data-testid="try-tool-qr-generator">
                <QrCode className="w-4 h-4 mr-2" />
                Try QR Code Generator
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
              <h2 className="text-2xl font-bold mb-4">What Are QR Codes Used For?</h2>
              <p className="text-muted-foreground mb-4">
                QR (Quick Response) codes are versatile tools for sharing information instantly. From restaurant menus to 
                event tickets, WiFi passwords to payment links, QR codes make digital interactions seamless.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Instant Access</p>
                    <p className="text-sm text-muted-foreground">One scan to connect or visit</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Contactless Sharing</p>
                    <p className="text-sm text-muted-foreground">Perfect for hygiene and speed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Trackable</p>
                    <p className="text-sm text-muted-foreground">Monitor engagement rates</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Types */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Types of QR Codes You Can Create</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <LinkIcon className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">URL/Website</p>
                    <p className="text-sm text-muted-foreground">Direct links to any webpage</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Wifi className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">WiFi Network</p>
                    <p className="text-sm text-muted-foreground">Auto-connect to WiFi with password</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">Pre-filled email with subject and body</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Phone/SMS</p>
                    <p className="text-sm text-muted-foreground">Direct dial or pre-written text message</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">GPS coordinates or addresses</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Payment</p>
                    <p className="text-sm text-muted-foreground">PayPal, Venmo, or crypto addresses</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step by Step Guide */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <QrCode className="w-6 h-6 text-primary" />
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
                    <h3 className="text-lg font-semibold mb-2">Select QR Code Type</h3>
                    <p className="text-muted-foreground mb-3">
                      Choose the type of QR code based on your needs:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>URL - For websites and online content</li>
                      <li>Text - For plain text messages</li>
                      <li>WiFi - For network credentials</li>
                      <li>Email - For contact forms</li>
                      <li>VCard - For contact information</li>
                    </ul>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Settings className="w-8 h-8 text-primary/50" />
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
                    <h3 className="text-lg font-semibold mb-2">Enter Your Content</h3>
                    <p className="text-muted-foreground mb-3">
                      Input the information for your QR code:
                    </p>
                    <Alert className="mb-3">
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Pro Tip:</strong> Keep URLs short using a URL shortener for cleaner QR codes that scan faster
                      </AlertDescription>
                    </Alert>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Ensure URLs include https:// or http://</li>
                      <li>Double-check spelling and formatting</li>
                      <li>Test special characters compatibility</li>
                    </ul>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <LinkIcon className="w-8 h-8 text-primary/50" />
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
                    <h3 className="text-lg font-semibold mb-2">Customize Design</h3>
                    <p className="text-muted-foreground mb-3">
                      Personalize your QR code appearance:
                    </p>
                    <div className="space-y-3">
                      <Alert>
                        <Palette className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Colors:</strong> Choose foreground and background colors (ensure high contrast)
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <Settings className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Size:</strong> Select dimensions from 200x200 to 1000x1000 pixels
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <Settings className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Error Correction:</strong> Higher levels allow QR codes to work even if partially damaged
                        </AlertDescription>
                      </Alert>
                    </div>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Palette className="w-8 h-8 text-primary/50" />
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
                    <h3 className="text-lg font-semibold mb-2">Generate and Download</h3>
                    <p className="text-muted-foreground mb-3">
                      Click "Generate QR Code" and download in your preferred format:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>PNG - Best for digital use and printing</li>
                      <li>SVG - Vector format for scaling without quality loss</li>
                      <li>Test scan before distributing</li>
                    </ul>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Download className="w-8 h-8 text-primary/50" />
                      <span className="ml-2 text-muted-foreground">Screenshot Placeholder</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips and Best Practices */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Best Practices for QR Codes
              </h2>
              <div className="space-y-3">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Size Matters:</strong> Minimum 2x2 cm for print, larger for distance scanning
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>High Contrast:</strong> Dark colors on light backgrounds scan best
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Test First:</strong> Always test with multiple devices before mass distribution
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Add Context:</strong> Include a call-to-action like "Scan for Menu" or "Connect to WiFi"
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Avoid Clutter:</strong> Keep 'quiet zone' (white space) around QR code
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
                  <AccordionTrigger>QR code won't scan?</AccordionTrigger>
                  <AccordionContent>
                    Check contrast ratio, ensure adequate size, clean camera lens, improve lighting, and verify the QR code isn't damaged or distorted.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>QR code looks blurry when printed?</AccordionTrigger>
                  <AccordionContent>
                    Generate at higher resolution (at least 300 DPI for print). Use SVG format for perfect scaling or create at larger pixel dimensions.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Content too long for QR code?</AccordionTrigger>
                  <AccordionContent>
                    Use URL shorteners for long links, reduce text content, or split information across multiple QR codes. Consider dynamic QR codes for frequently changing content.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Need to update QR code content?</AccordionTrigger>
                  <AccordionContent>
                    Static QR codes can't be edited. Use URL redirects you control, or consider dynamic QR code services for editable content.
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
                  <AccordionTrigger>Are QR codes free to create and use?</AccordionTrigger>
                  <AccordionContent>
                    Yes, creating and using QR codes is completely free. There are no licensing fees or restrictions on commercial use of standard QR codes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger>How secure are QR codes?</AccordionTrigger>
                  <AccordionContent>
                    QR codes themselves are just data containers. Security depends on the content - avoid sharing sensitive information directly. For WiFi, the password is visible to anyone who scans.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger>Can QR codes work offline?</AccordionTrigger>
                  <AccordionContent>
                    Yes, QR codes containing text, WiFi credentials, or contact info work offline. URL-based codes need internet to access the linked content.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-4">
                  <AccordionTrigger>What's the scanning distance for QR codes?</AccordionTrigger>
                  <AccordionContent>
                    Rule of thumb: scanning distance is 10x the QR code width. A 10cm QR code can be scanned from about 1 meter away with a good camera.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-5">
                  <AccordionTrigger>Can I add a logo to my QR code?</AccordionTrigger>
                  <AccordionContent>
                    Yes, but it requires careful implementation to maintain scannability. Use high error correction and keep the logo small (under 30% of QR code area).
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Start Creating QR Codes Now</h2>
              <p className="text-muted-foreground mb-6">
                Generate unlimited QR codes for free with our easy-to-use tool.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="btn-gradient text-white">
                  <Link href="/qr-generator" data-testid="cta-qr-generator">
                    Create QR Code
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
              <Link href="/guides/how-to-generate-password" className="block">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">How to Generate Secure Passwords</h3>
                        <p className="text-sm text-muted-foreground">Create strong passwords for accounts</p>
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
                        <LinkIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">How to Convert JPG to PDF</h3>
                        <p className="text-sm text-muted-foreground">Create PDFs from images</p>
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