import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText,
  Lock,
  Image,
  QrCode,
  Key,
  Shield,
  BookOpen,
  GraduationCap,
  FileSearch,
  Layers,
  Info,
  ArrowRight,
  ChevronRight,
  Lightbulb,
  HelpCircle,
  Download,
  Upload,
  Settings,
  CheckCircle2,
  Zap,
  Globe,
  Users,
  TrendingUp,
  Unlock
} from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { ContactSupportSection } from "@/components/contact-support";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const resourceSections = [
  {
    id: "pdf-format",
    title: "PDF File Format Guide",
    icon: FileText,
    description: "Everything you need to know about PDF files",
    content: {
      overview: "Portable Document Format (PDF) is a file format developed by Adobe in 1993 to present documents consistently across different platforms and devices.",
      topics: [
        {
          title: "What is a PDF?",
          content: "PDF stands for Portable Document Format. It's a universal file format that preserves fonts, images, graphics, and layout of any source document, regardless of the computer or software used to create it."
        },
        {
          title: "PDF Structure",
          content: "PDFs consist of objects like text, fonts, graphics, and images. They use a fixed layout, meaning content appears the same on any device."
        },
        {
          title: "PDF Versions",
          content: "PDF has evolved from version 1.0 to 2.0, with each version adding features like encryption, digital signatures, 3D content, and more."
        },
        {
          title: "Common PDF Types",
          content: "Text PDFs (searchable), Scanned PDFs (image-based), Interactive PDFs (with forms), and Tagged PDFs (accessible)."
        }
      ]
    }
  },
  {
    id: "compression",
    title: "Understanding PDF Compression",
    icon: Layers,
    description: "Learn how PDF compression works and best practices",
    content: {
      overview: "PDF compression reduces file size by optimizing how data is stored, making files easier to share and store without significant quality loss.",
      topics: [
        {
          title: "How Compression Works",
          content: "PDF compression uses algorithms to remove redundant data, optimize images, and restructure document elements. Common methods include ZIP compression for text and JPEG compression for images."
        },
        {
          title: "Lossless vs Lossy",
          content: "Lossless compression preserves all data (best for text), while lossy compression removes some data permanently (used for images). Most PDF compressors use a combination."
        },
        {
          title: "Compression Levels",
          content: "High Quality: 10-20% reduction, minimal quality loss. Medium: 30-50% reduction, slight quality loss. Low: 60-80% reduction, noticeable quality loss."
        },
        {
          title: "Best Practices",
          content: "Use high quality for printing, medium for general sharing, low for quick previews. Always keep original files. Test compression on sample pages first."
        }
      ]
    }
  },
  {
    id: "security",
    title: "PDF Security Best Practices",
    icon: Lock,
    description: "Protect your PDFs and maintain privacy",
    content: {
      overview: "PDF security features help protect sensitive information through encryption, passwords, and permissions management.",
      topics: [
        {
          title: "Password Protection",
          content: "Two types: User passwords (open document) and Owner passwords (modify permissions). Use strong, unique passwords for each document."
        },
        {
          title: "Encryption Standards",
          content: "Modern PDFs use AES 256-bit encryption. Older standards (40-bit, 128-bit) are less secure. Always use the highest available encryption."
        },
        {
          title: "Digital Signatures",
          content: "Digital signatures verify document authenticity and detect tampering. They're legally binding in many jurisdictions."
        },
        {
          title: "Privacy Tips",
          content: "Remove metadata before sharing, use browser-based tools to avoid uploads, redact sensitive information properly, and verify permissions before distribution."
        }
      ]
    }
  },
  {
    id: "image-conversion",
    title: "Image to PDF Conversion Tips",
    icon: Image,
    description: "Convert images to PDF like a pro",
    content: {
      overview: "Converting images to PDF is useful for creating portfolios, documents, and presentations while maintaining quality and organization.",
      topics: [
        {
          title: "Image Formats",
          content: "JPG/JPEG: Best for photos. PNG: Best for graphics with transparency. GIF: Animated images. BMP: Uncompressed, large files. WebP: Modern format with good compression."
        },
        {
          title: "Resolution Guidelines",
          content: "Screen viewing: 72-150 DPI. Professional printing: 300 DPI. Large format printing: 150-200 DPI. Higher DPI means larger file size but better quality."
        },
        {
          title: "Page Layout",
          content: "Consider orientation (portrait vs landscape), margins for binding, consistent sizing across pages, and logical page order for multi-page documents."
        },
        {
          title: "Optimization Tips",
          content: "Compress images before conversion, use consistent dimensions, remove unnecessary metadata, and batch process for efficiency."
        }
      ]
    }
  },
  {
    id: "qr-codes",
    title: "QR Code Usage Guide",
    icon: QrCode,
    description: "Master QR codes for business and personal use",
    content: {
      overview: "QR (Quick Response) codes are two-dimensional barcodes that store information readable by smartphones and QR scanners.",
      topics: [
        {
          title: "QR Code Types",
          content: "Static QR codes: Fixed content, can't be edited. Dynamic QR codes: Editable content via redirect URLs. Different data types: URLs, text, WiFi, contact info, payments."
        },
        {
          title: "Business Applications",
          content: "Restaurant menus, business cards, event tickets, product information, payment processing, customer feedback, marketing campaigns, and inventory tracking."
        },
        {
          title: "Design Best Practices",
          content: "Minimum size: 2x2 cm for close scanning. High contrast required (dark on light). Keep quiet zone (white space) around code. Test on multiple devices."
        },
        {
          title: "Security Considerations",
          content: "QR codes can link to malicious sites. Always verify destination before sharing. Use URL shorteners you control. Consider expiration for sensitive content."
        }
      ]
    }
  },
  {
    id: "passwords",
    title: "Password Security Guide",
    icon: Key,
    description: "Create and manage strong passwords effectively",
    content: {
      overview: "Strong passwords are your first line of defense against unauthorized access to your accounts and sensitive information.",
      topics: [
        {
          title: "Password Strength",
          content: "Strong passwords are 12+ characters, include uppercase, lowercase, numbers, and symbols, avoid dictionary words and personal info, and are unique for each account."
        },
        {
          title: "Password Managers",
          content: "Password managers securely store all passwords, generate random passwords, auto-fill login forms, and sync across devices. Popular options: Bitwarden, 1Password, LastPass."
        },
        {
          title: "Two-Factor Authentication",
          content: "2FA adds an extra security layer beyond passwords. Types: SMS (least secure), authenticator apps (better), hardware keys (best). Enable on all important accounts."
        },
        {
          title: "Common Mistakes",
          content: "Reusing passwords across sites, using personal information, simple substitutions (@ for a), writing passwords down insecurely, sharing passwords, and ignoring breach notifications."
        }
      ]
    }
  }
];

const quickGuides = [
  {
    title: "Reduce PDF Size for Email",
    icon: Zap,
    time: "2 min",
    steps: ["Open PDF Compressor", "Upload your file", "Select Medium compression", "Download optimized file"]
  },
  {
    title: "Create Multi-Page PDF from Images",
    icon: Layers,
    time: "3 min",
    steps: ["Open JPG to PDF tool", "Upload all images", "Arrange order", "Convert and download"]
  },
  {
    title: "Remove PDF Password",
    icon: Unlock,
    time: "1 min",
    steps: ["Open PDF Unlocker", "Upload protected PDF", "Enter password", "Download unlocked file"]
  },
  {
    title: "Generate QR Code for Website",
    icon: QrCode,
    time: "1 min",
    steps: ["Open QR Generator", "Enter URL", "Customize design", "Download QR code"]
  }
];

export default function ResourcesPage() {
  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "PDF Tools Learning Center",
    description: "Comprehensive resource center for PDF tools, security, and best practices",
    url: "https://altaftoolshub.app/resources",
    educationalLevel: "Beginner to Advanced",
    learningResourceType: "Guide",
    teaches: [
      "PDF file format",
      "PDF compression",
      "PDF security",
      "Image conversion",
      "QR code generation",
      "Password security"
    ]
  };

  useSEO({
    title: "PDF Learning Center & Resources - AltafToolsHub",
    description: "Comprehensive guides on PDF formats, compression, security, image conversion, QR codes, and password best practices. Free learning resources.",
    path: "/resources",
    keywords: "PDF resources, PDF guide, PDF security, compression guide, QR code guide, password security, PDF learning center",
    structuredData
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-50" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto text-center relative z-10"
        >
          <Badge variant="secondary" className="mb-4">
            <GraduationCap className="w-3 h-3 mr-1" />
            Learning Center
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            PDF Tools Resource Center
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Everything you need to know about PDFs, security, and document management
          </p>
          
          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6 pb-4">
                <div className="text-2xl font-bold text-primary">6</div>
                <p className="text-sm text-muted-foreground">Topics Covered</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 pb-4">
                <div className="text-2xl font-bold text-primary">24+</div>
                <p className="text-sm text-muted-foreground">Detailed Guides</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 pb-4">
                <div className="text-2xl font-bold text-primary">100%</div>
                <p className="text-sm text-muted-foreground">Free Access</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 pb-4">
                <div className="text-2xl font-bold text-primary">2025</div>
                <p className="text-sm text-muted-foreground">Updated</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Quick Start Guides */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Quick Start Guides</h2>
            <p className="text-muted-foreground">Popular tasks you can complete in minutes</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <Card key={guide.title} className="hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs">{guide.time}</Badge>
                    </div>
                    <h3 className="font-semibold mb-3">{guide.title}</h3>
                    <ol className="space-y-1">
                      {guide.steps.map((step, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="font-semibold text-primary">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Resource Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="pdf-format" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
              {resourceSections.map((section) => {
                const Icon = section.icon;
                return (
                  <TabsTrigger 
                    key={section.id} 
                    value={section.id}
                    className="flex items-center gap-2 text-xs"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{section.title.split(' ')[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {resourceSections.map((section) => {
              const Icon = section.icon;
              return (
                <TabsContent key={section.id} value={section.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        {section.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {section.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Alert className="mb-6">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Overview:</strong> {section.content.overview}
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-6">
                        {section.content.topics.map((topic, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-l-4 border-primary/30 pl-4"
                          >
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                              {topic.title}
                            </h3>
                            <p className="text-muted-foreground">{topic.content}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Related Tools */}
                      <div className="mt-8 p-4 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-yellow-500" />
                          Try Related Tools
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {section.id === "pdf-format" && (
                            <>
                              <Button asChild size="sm" variant="outline">
                                <Link href="/compress-pdf">PDF Compressor</Link>
                              </Button>
                              <Button asChild size="sm" variant="outline">
                                <Link href="/merge-pdf">Merge PDF</Link>
                              </Button>
                            </>
                          )}
                          {section.id === "compression" && (
                            <>
                              <Button asChild size="sm" variant="outline">
                                <Link href="/compress-pdf">Compress PDF</Link>
                              </Button>
                              <Button asChild size="sm" variant="outline">
                                <Link href="/guides/how-to-compress-pdf">Compression Guide</Link>
                              </Button>
                            </>
                          )}
                          {section.id === "security" && (
                            <>
                              <Button asChild size="sm" variant="outline">
                                <Link href="/unlock-pdf">Unlock PDF</Link>
                              </Button>
                              <Button asChild size="sm" variant="outline">
                                <Link href="/password-generator">Password Generator</Link>
                              </Button>
                            </>
                          )}
                          {section.id === "image-conversion" && (
                            <>
                              <Button asChild size="sm" variant="outline">
                                <Link href="/jpg-to-pdf">JPG to PDF</Link>
                              </Button>
                              <Button asChild size="sm" variant="outline">
                                <Link href="/guides/how-to-convert-jpg-to-pdf">Conversion Guide</Link>
                              </Button>
                            </>
                          )}
                          {section.id === "qr-codes" && (
                            <>
                              <Button asChild size="sm" variant="outline">
                                <Link href="/qr-generator">QR Generator</Link>
                              </Button>
                              <Button asChild size="sm" variant="outline">
                                <Link href="/guides/how-to-generate-qr-code">QR Guide</Link>
                              </Button>
                            </>
                          )}
                          {section.id === "passwords" && (
                            <>
                              <Button asChild size="sm" variant="outline">
                                <Link href="/password-generator">Password Generator</Link>
                              </Button>
                              <Button asChild size="sm" variant="outline">
                                <Link href="/guides/how-to-generate-password">Password Guide</Link>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Common questions about PDF tools and document management</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What's the difference between PDF/A and regular PDF?</AccordionTrigger>
                  <AccordionContent>
                    PDF/A is an archival format designed for long-term preservation. It embeds all fonts, prohibits encryption, and ensures documents remain accessible for decades. Regular PDFs are more flexible but may not display consistently over time.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I edit a scanned PDF?</AccordionTrigger>
                  <AccordionContent>
                    Scanned PDFs are essentially images. To edit text, you need OCR (Optical Character Recognition) to convert the image to editable text. Our Extract Text tool can help with this process.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How secure is browser-based PDF processing?</AccordionTrigger>
                  <AccordionContent>
                    Browser-based processing is very secure because files never leave your device. All processing happens locally using JavaScript, meaning your documents aren't uploaded to any server.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>What's the best PDF compression ratio?</AccordionTrigger>
                  <AccordionContent>
                    It depends on usage: For email, aim for 1-5MB (medium compression). For archival, use minimal compression. For web preview, maximum compression is fine. Generally, 30-50% reduction maintains good quality.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Do QR codes expire?</AccordionTrigger>
                  <AccordionContent>
                    Static QR codes (like those our tool generates) never expire. The code will work forever as long as the content it links to remains available. Dynamic QR codes can expire based on the service provider.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>How long should my password be?</AccordionTrigger>
                  <AccordionContent>
                    Minimum 12 characters, ideally 16+. Length is more important than complexity. A 20-character passphrase is stronger than an 8-character password with symbols. Use our password generator for secure options.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Explore More Resources</h2>
            <p className="text-muted-foreground">Dive deeper with our comprehensive guides and tools</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  How-To Guides
                </CardTitle>
                <CardDescription>
                  Step-by-step tutorials for all our tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Detailed walkthroughs with screenshots and tips for getting the most out of each tool.
                </p>
                <Button asChild className="w-full">
                  <Link href="/guides" data-testid="link-guides">
                    View All Guides
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Tool Comparisons
                </CardTitle>
                <CardDescription>
                  Compare our tools with alternatives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  In-depth comparisons of features, pricing, and privacy across different platforms.
                </p>
                <Button asChild className="w-full">
                  <Link href="/compare/online-pdf-tools-2025" data-testid="link-comparisons">
                    View Comparisons
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Use Cases
                </CardTitle>
                <CardDescription>
                  Real-world applications and examples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover how professionals use our tools in various industries and scenarios.
                </p>
                <Button asChild className="w-full">
                  <Link href="/use-cases" data-testid="link-use-cases">
                    Explore Use Cases
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-6">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Put your knowledge into practice with our free, secure PDF tools
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="btn-gradient text-white">
                  <Link href="/all-tools" data-testid="cta-all-tools">
                    Explore All Tools
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/compress-pdf" data-testid="cta-try-compressor">
                    Try PDF Compressor
                    <Zap className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <ContactSupportSection />
    </div>
  );
}