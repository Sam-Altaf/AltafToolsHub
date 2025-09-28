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
  Star,
  Globe,
  Lock,
  ChevronRight,
  Award,
  TrendingUp,
  Users,
  Sparkles,
  Layers,
  Gauge
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

const pdfTools = [
  {
    name: "AltafToolsHub",
    category: "All-in-One Free",
    description: "Comprehensive free PDF toolkit with complete privacy",
    rating: 5,
    userBase: "50K+",
    pricing: "Free",
    bestFor: "Privacy-conscious users, students, small businesses",
    features: {
      pdfTools: 15,
      freeUsage: "Unlimited",
      privacy: "100% Browser-based",
      registration: "Not required",
      ads: "No",
      watermarks: "No",
      apiAccess: "Coming soon",
      mobileApp: "Web-based",
    },
    strengths: [
      "Completely free forever",
      "No file uploads to servers",
      "No registration needed",
      "Fast browser processing",
      "Multiple tool categories"
    ],
    weaknesses: [
      "No cloud storage",
      "No collaboration features",
      "Limited to browser capability"
    ],
    recommended: true
  },
  {
    name: "SmallPDF",
    category: "Premium Professional",
    description: "Professional PDF suite with team collaboration",
    rating: 4.5,
    userBase: "40M+",
    pricing: "$12-24/mo",
    bestFor: "Teams, businesses, professional use",
    features: {
      pdfTools: 21,
      freeUsage: "2 files/day",
      privacy: "Server-based",
      registration: "Required for full",
      ads: "No",
      watermarks: "No (paid)",
      apiAccess: "Yes",
      mobileApp: "iOS/Android",
    },
    strengths: [
      "Professional features",
      "Team collaboration",
      "Cloud integration",
      "Mobile apps",
      "API access"
    ],
    weaknesses: [
      "Expensive for individuals",
      "Very limited free tier",
      "Files uploaded to servers"
    ],
    recommended: false
  },
  {
    name: "iLovePDF",
    category: "Freemium Popular",
    description: "Popular PDF tools with affordable premium options",
    rating: 4.3,
    userBase: "25M+",
    pricing: "$7-15/mo",
    bestFor: "Casual users, freelancers",
    features: {
      pdfTools: 20,
      freeUsage: "3 files/day",
      privacy: "Server-based",
      registration: "Optional",
      ads: "Yes (free)",
      watermarks: "Yes (free)",
      apiAccess: "Yes",
      mobileApp: "iOS/Android",
    },
    strengths: [
      "Good free tier",
      "Affordable premium",
      "Batch processing",
      "Desktop app",
      "API available"
    ],
    weaknesses: [
      "Ads in free version",
      "Watermarks on free",
      "Server processing"
    ],
    recommended: false
  },
  {
    name: "PDF24",
    category: "Free Alternative",
    description: "Free PDF tools with desktop software option",
    rating: 4.1,
    userBase: "10M+",
    pricing: "Free",
    bestFor: "Desktop users, offline work",
    features: {
      pdfTools: 28,
      freeUsage: "Unlimited",
      privacy: "Desktop option",
      registration: "Not required",
      ads: "Minimal",
      watermarks: "No",
      apiAccess: "No",
      mobileApp: "No",
    },
    strengths: [
      "Many tools available",
      "Desktop software",
      "Free to use",
      "No registration",
      "Offline option"
    ],
    weaknesses: [
      "Dated interface",
      "Slower processing",
      "No mobile apps"
    ],
    recommended: false
  },
  {
    name: "Adobe Acrobat",
    category: "Industry Standard",
    description: "Professional PDF creator and editor",
    rating: 4.7,
    userBase: "100M+",
    pricing: "$20-30/mo",
    bestFor: "Enterprise, professionals, advanced editing",
    features: {
      pdfTools: 30,
      freeUsage: "7-day trial",
      privacy: "Cloud-based",
      registration: "Required",
      ads: "No",
      watermarks: "No",
      apiAccess: "Yes",
      mobileApp: "iOS/Android",
    },
    strengths: [
      "Industry standard",
      "Most features",
      "Best OCR quality",
      "Enterprise support",
      "Integration ecosystem"
    ],
    weaknesses: [
      "Very expensive",
      "No free tier",
      "Complex for basic needs",
      "Requires installation"
    ],
    recommended: false
  },
  {
    name: "Sejda",
    category: "Developer Friendly",
    description: "PDF tools with good API and automation",
    rating: 4.2,
    userBase: "5M+",
    pricing: "$5-15/mo",
    bestFor: "Developers, automation needs",
    features: {
      pdfTools: 30,
      freeUsage: "3 tasks/day",
      privacy: "Server-based",
      registration: "Optional",
      ads: "No",
      watermarks: "No",
      apiAccess: "Yes",
      mobileApp: "Web-based",
    },
    strengths: [
      "Good API",
      "Automation friendly",
      "Fair pricing",
      "Many tools",
      "Clean interface"
    ],
    weaknesses: [
      "Limited free tier",
      "Server processing",
      "Less known brand"
    ],
    recommended: false
  }
];

const categories = [
  {
    name: "Compression",
    tools: ["Compress PDF", "Optimize PDF", "Reduce Size"],
    icon: Gauge
  },
  {
    name: "Conversion",
    tools: ["PDF to Word", "JPG to PDF", "Excel to PDF"],
    icon: Layers
  },
  {
    name: "Editing",
    tools: ["Edit PDF", "Annotate", "Fill Forms"],
    icon: FileText
  },
  {
    name: "Security",
    tools: ["Lock PDF", "Unlock PDF", "Sign PDF"],
    icon: Lock
  },
  {
    name: "Organization",
    tools: ["Merge PDF", "Split PDF", "Rotate Pages"],
    icon: Sparkles
  }
];

export default function OnlinePDFTools2025() {
  // Generate comparison schema for SEO
  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Best Online PDF Tools 2025",
    description: "Compare the best online PDF tools and services for 2025. Free and paid options reviewed.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: pdfTools.map((tool, index) => ({
        "@type": "SoftwareApplication",
        position: index + 1,
        name: tool.name,
        description: tool.description,
        applicationCategory: "PDF Software",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: tool.rating,
          bestRating: "5"
        }
      }))
    }
  };

  useSEO({
    title: "Best Online PDF Tools 2025 - Complete Comparison Guide",
    description: "Compare the top online PDF tools for 2025. Reviews of free and paid PDF editors, converters, and compressors. Find the perfect PDF solution.",
    path: "/compare/online-pdf-tools-2025",
    keywords: "best online PDF tools 2025, PDF editor comparison, free PDF tools, PDF converter reviews, online PDF services",
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
              <BreadcrumbPage>Online PDF Tools 2025</BreadcrumbPage>
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
            2025 Edition
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Best Online PDF Tools in 2025
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Comprehensive comparison of the top PDF services to help you choose the right tool
          </p>
          
          {/* Key Stats */}
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">6</div>
                <p className="text-sm text-muted-foreground">Top Services Reviewed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">30+</div>
                <p className="text-sm text-muted-foreground">Features Compared</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">200M+</div>
                <p className="text-sm text-muted-foreground">Combined Users</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Category Overview */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">PDF Tool Categories</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.name} className="hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{category.name}</h3>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {category.tools.map((tool) => (
                          <li key={tool}>{tool}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Comparison Table */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Feature Comparison Matrix</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Comprehensive PDF Tools Comparison - Updated January 2025</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Service</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Free Usage</TableHead>
                      <TableHead>Privacy</TableHead>
                      <TableHead>Tools</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pdfTools.map((tool) => (
                      <TableRow key={tool.name} className={tool.recommended ? "bg-primary/5" : ""}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {tool.name}
                            {tool.recommended && (
                              <Badge variant="default" className="text-xs">
                                <Award className="w-3 h-3 mr-1" />
                                Top Pick
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{tool.category}</TableCell>
                        <TableCell>
                          <Badge variant={tool.pricing === "Free" ? "secondary" : "outline"}>
                            {tool.pricing}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{tool.features.freeUsage}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={tool.features.privacy.includes("Browser") ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {tool.features.privacy.includes("Browser") ? (
                              <>
                                <Shield className="w-3 h-3 mr-1" />
                                Private
                              </>
                            ) : (
                              "Cloud"
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{tool.features.pdfTools}+</TableCell>
                        <TableCell className="text-sm">{tool.features.mobileApp}</TableCell>
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

      {/* Detailed Reviews */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Detailed Service Reviews</h2>
          
          <div className="space-y-6">
            {pdfTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={tool.recommended ? "border-primary shadow-lg" : ""}>
                  {tool.recommended && (
                    <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold flex items-center gap-2">
                          <Award className="w-5 h-5" />
                          Editor's Choice 2025
                        </span>
                        <Badge variant="secondary" className="bg-white text-primary">
                          Best Overall
                        </Badge>
                      </div>
                    </div>
                  )}
                  <CardContent className="pt-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                      {/* Overview */}
                      <div className="lg:col-span-1">
                        <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                        <Badge variant="outline" className="mb-3">{tool.category}</Badge>
                        <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Rating</span>
                            <div className="flex items-center gap-1">
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
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Users</span>
                            <Badge variant="secondary">{tool.userBase}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Pricing</span>
                            <span className="font-semibold text-primary">{tool.pricing}</span>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <p className="text-xs font-semibold mb-1">Best For:</p>
                          <p className="text-xs">{tool.bestFor}</p>
                        </div>
                      </div>

                      {/* Features & Strengths/Weaknesses */}
                      <div className="lg:col-span-2">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Features */}
                          <div>
                            <h4 className="font-semibold mb-3">Key Features</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>PDF Tools</span>
                                <Badge variant="outline">{tool.features.pdfTools}+</Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Free Usage</span>
                                <span className="font-medium">{tool.features.freeUsage}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Registration</span>
                                <span className="font-medium">{tool.features.registration}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Ads</span>
                                <span className="font-medium">{tool.features.ads}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Watermarks</span>
                                <span className="font-medium">{tool.features.watermarks}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>API Access</span>
                                <span className="font-medium">{tool.features.apiAccess}</span>
                              </div>
                            </div>
                          </div>

                          {/* Pros & Cons */}
                          <div>
                            <div className="mb-4">
                              <h4 className="font-semibold mb-2 text-green-600">Strengths</h4>
                              <ul className="space-y-1">
                                {tool.strengths.slice(0, 3).map((strength, i) => (
                                  <li key={i} className="text-sm flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2 text-red-600">Weaknesses</h4>
                              <ul className="space-y-1">
                                {tool.weaknesses.map((weakness, i) => (
                                  <li key={i} className="text-sm flex items-start gap-2">
                                    <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <span>{weakness}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* CTA for recommended */}
                        {tool.recommended && (
                          <div className="mt-6 flex gap-4">
                            <Button asChild className="btn-gradient text-white">
                              <Link href="/all-tools" data-testid="try-altaftoolshub-tools">
                                Explore All Tools
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                            <Button asChild variant="outline">
                              <Link href="/guides" data-testid="view-guides">
                                View Guides
                                <ChevronRight className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendation Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <Card className="border-primary">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Our Recommendations</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Badge className="mb-3">Best Free Option</Badge>
                  <h3 className="font-semibold mb-2">AltafToolsHub</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Perfect for privacy-conscious users who want unlimited free access to essential PDF tools
                  </p>
                  <Button asChild size="sm" className="btn-gradient text-white">
                    <Link href="/all-tools">
                      Try Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>

                <div className="text-center">
                  <Badge className="mb-3" variant="secondary">Best Premium</Badge>
                  <h3 className="font-semibold mb-2">SmallPDF</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ideal for teams and businesses needing advanced features and collaboration
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <span>Learn More</span>
                  </Button>
                </div>

                <div className="text-center">
                  <Badge className="mb-3" variant="secondary">Best Value</Badge>
                  <h3 className="font-semibold mb-2">iLovePDF</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Good balance of features and pricing for individual professionals
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <span>Learn More</span>
                  </Button>
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
              <h2 className="text-3xl font-bold mb-4">Start Using the Best Free PDF Tools</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                No registration, no uploads, no limits. Process PDFs securely in your browser.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="btn-gradient text-white">
                  <Link href="/all-tools" data-testid="cta-all-tools">
                    Explore All Tools
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/compress-pdf" data-testid="cta-compress">
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