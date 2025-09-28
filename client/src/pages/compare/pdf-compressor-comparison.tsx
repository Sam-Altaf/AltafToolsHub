import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText,
  Check,
  X,
  ArrowRight,
  Shield,
  Zap,
  DollarSign,
  Users,
  Star,
  Globe,
  Lock,
  Clock,
  ChevronRight,
  Award,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { ContactSupportSection } from "@/components/contact-support";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const competitors = [
  {
    name: "AltafToolsHub",
    logo: FileText,
    rating: 5,
    pricing: "Free Forever",
    monthlyPrice: "$0",
    fileLimit: "Unlimited",
    features: {
      compression: true,
      batchProcessing: true,
      ocr: true,
      editing: true,
      conversion: true,
      merging: true,
      splitting: true,
      watermark: true,
      encryption: true,
      eSign: false,
    },
    privacy: {
      browserBased: true,
      noUpload: true,
      noStorage: true,
      noTracking: true,
      gdprCompliant: true,
    },
    pros: [
      "100% free with no limits",
      "Complete privacy - files never leave browser",
      "No registration required",
      "Fast processing",
      "Multiple tools available"
    ],
    cons: [
      "No cloud storage",
      "No mobile apps yet",
      "No e-signature feature"
    ],
    highlight: true
  },
  {
    name: "SmallPDF",
    logo: Globe,
    rating: 4.5,
    pricing: "Freemium",
    monthlyPrice: "$12-24",
    fileLimit: "2 files/day (free)",
    features: {
      compression: true,
      batchProcessing: true,
      ocr: true,
      editing: true,
      conversion: true,
      merging: true,
      splitting: true,
      watermark: true,
      encryption: true,
      eSign: true,
    },
    privacy: {
      browserBased: false,
      noUpload: false,
      noStorage: false,
      noTracking: false,
      gdprCompliant: true,
    },
    pros: [
      "Professional features",
      "E-signature support",
      "Mobile apps available",
      "Cloud integration",
      "Team collaboration"
    ],
    cons: [
      "Limited free usage",
      "Files uploaded to servers",
      "Expensive for individuals",
      "Requires registration for full features"
    ],
    highlight: false
  },
  {
    name: "iLovePDF",
    logo: Globe,
    rating: 4.3,
    pricing: "Freemium",
    monthlyPrice: "$7-15",
    fileLimit: "3 files/day (free)",
    features: {
      compression: true,
      batchProcessing: true,
      ocr: true,
      editing: true,
      conversion: true,
      merging: true,
      splitting: true,
      watermark: true,
      encryption: true,
      eSign: false,
    },
    privacy: {
      browserBased: false,
      noUpload: false,
      noStorage: false,
      noTracking: false,
      gdprCompliant: true,
    },
    pros: [
      "Affordable premium plans",
      "Good compression quality",
      "Batch processing",
      "API available",
      "Desktop app"
    ],
    cons: [
      "Daily limits on free tier",
      "Files processed on servers",
      "Watermarks on free tier",
      "Ads in free version"
    ],
    highlight: false
  },
  {
    name: "Adobe Acrobat",
    logo: Globe,
    rating: 4.7,
    pricing: "Premium Only",
    monthlyPrice: "$20-30",
    fileLimit: "Free trial only",
    features: {
      compression: true,
      batchProcessing: true,
      ocr: true,
      editing: true,
      conversion: true,
      merging: true,
      splitting: true,
      watermark: true,
      encryption: true,
      eSign: true,
    },
    privacy: {
      browserBased: false,
      noUpload: false,
      noStorage: false,
      noTracking: false,
      gdprCompliant: true,
    },
    pros: [
      "Industry standard",
      "Most comprehensive features",
      "Professional tools",
      "Excellent OCR",
      "Enterprise support"
    ],
    cons: [
      "Very expensive",
      "No free tier",
      "Requires software installation",
      "Steep learning curve",
      "Overkill for basic needs"
    ],
    highlight: false
  }
];

export default function PDFCompressorComparison() {
  // Generate comparison schema for SEO
  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "PDF Compressor Comparison 2025",
    description: "Compare the best PDF compression tools: AltafToolsHub vs SmallPDF vs iLovePDF vs Adobe",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: competitors.map((tool, index) => ({
        "@type": "SoftwareApplication",
        position: index + 1,
        name: tool.name,
        applicationCategory: "PDF Tools",
        offers: {
          "@type": "Offer",
          price: tool.monthlyPrice === "$0" ? "0" : tool.monthlyPrice,
          priceCurrency: "USD"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: tool.rating,
          bestRating: "5"
        }
      }))
    }
  };

  useSEO({
    title: "PDF Compressor Comparison 2025 - Best PDF Compression Tools",
    description: "Compare top PDF compressors: AltafToolsHub vs SmallPDF vs iLovePDF vs Adobe. Features, pricing, privacy comparison. Find the best free PDF compressor.",
    path: "/compare/pdf-compressor-comparison",
    keywords: "PDF compressor comparison, best PDF compression tool, SmallPDF alternative, iLovePDF vs SmallPDF, free PDF compressor",
    structuredData: comparisonSchema
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
              <BreadcrumbPage>PDF Compressor Comparison</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto text-center"
        >
          <Badge variant="secondary" className="mb-4">
            <TrendingUp className="w-3 h-3 mr-1" />
            Updated for 2025
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            PDF Compressor Comparison
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Compare the top PDF compression tools to find the perfect solution for your needs
          </p>
          
          {/* Quick Winner */}
          <div className="inline-flex items-center gap-2 p-4 bg-primary/10 rounded-lg mb-8">
            <Award className="w-6 h-6 text-primary" />
            <span className="font-semibold">Best Overall:</span>
            <span>AltafToolsHub - 100% Free, Private & Unlimited</span>
          </div>
        </motion.div>
      </section>

      {/* Quick Comparison Table */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Quick Comparison</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>PDF Compressor Tools Comparison - Last Updated: January 2025</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tool</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>File Limit</TableHead>
                      <TableHead>Privacy</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {competitors.map((tool) => (
                      <TableRow key={tool.name} className={tool.highlight ? "bg-primary/5" : ""}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {tool.name}
                            {tool.highlight && (
                              <Badge variant="default" className="ml-2">
                                <Star className="w-3 h-3 mr-1" />
                                Best Value
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{tool.pricing}</div>
                            <div className="text-sm text-muted-foreground">{tool.monthlyPrice}</div>
                          </div>
                        </TableCell>
                        <TableCell>{tool.fileLimit}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {tool.privacy.browserBased ? (
                              <Badge variant="outline" className="text-xs">
                                <Shield className="w-3 h-3 mr-1" />
                                Private
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Cloud
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {Object.values(tool.features).filter(Boolean).length}/10 features
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{tool.rating}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Detailed Comparison */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Detailed Feature Comparison</h2>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {competitors.map((tool) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className={tool.highlight ? "border-primary shadow-lg" : ""}>
                  {tool.highlight && (
                    <div className="bg-primary text-white px-4 py-2 text-center">
                      <span className="font-semibold">⭐ Recommended Choice</span>
                    </div>
                  )}
                  <CardContent className="pt-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          {tool.name}
                          {tool.highlight && <Badge variant="default">Best Value</Badge>}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(tool.rating) 
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">({tool.rating}/5)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{tool.monthlyPrice}</div>
                        <div className="text-sm text-muted-foreground">{tool.pricing}</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-4">
                      <h4 className="font-semibold text-sm">Features:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(tool.features).map(([feature, available]) => (
                          <div key={feature} className="flex items-center gap-2 text-sm">
                            {available ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <X className="w-4 h-4 text-red-500" />
                            )}
                            <span className={!available ? "text-muted-foreground" : ""}>
                              {feature.charAt(0).toUpperCase() + feature.slice(1).replace(/([A-Z])/g, ' $1')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Privacy */}
                    <div className="space-y-3 mb-4">
                      <h4 className="font-semibold text-sm">Privacy & Security:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(tool.privacy).map(([privacy, available]) => (
                          <div key={privacy} className="flex items-center gap-2 text-sm">
                            {available ? (
                              <Shield className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-500" />
                            )}
                            <span className={!available ? "text-muted-foreground" : ""}>
                              {privacy.charAt(0).toUpperCase() + privacy.slice(1).replace(/([A-Z])/g, ' $1')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pros & Cons */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-green-600">Pros:</h4>
                        <ul className="space-y-1">
                          {tool.pros.map((pro, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-red-600">Cons:</h4>
                        <ul className="space-y-1">
                          {tool.cons.map((con, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* CTA */}
                    {tool.highlight && (
                      <Button asChild className="w-full btn-gradient text-white">
                        <Link href="/compress-pdf" data-testid="try-altaftoolshub">
                          Try AltafToolsHub Free
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Why AltafToolsHub Stands Out</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">100% Free Forever</h3>
                  <p className="text-sm text-muted-foreground">
                    No hidden costs, no premium tiers, no credit card required. Ever.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Complete Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Your files never leave your browser. No uploads, no storage, no tracking.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Instant Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Browser-based processing means no wait times or server queues.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-6">
              <h2 className="text-3xl font-bold mb-4">Start Compressing PDFs for Free</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of users who trust AltafToolsHub for secure, private PDF compression
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="btn-gradient text-white">
                  <Link href="/compress-pdf" data-testid="cta-compress-pdf">
                    Try PDF Compressor
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/guides/how-to-compress-pdf" data-testid="cta-guide">
                    Read How-To Guide
                    <ChevronRight className="w-4 h-4 ml-2" />
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