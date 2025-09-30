import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Lock, 
  Image, 
  QrCode, 
  Type,
  Key,
  ArrowRight,
  BookOpen,
  Clock,
  Users,
  CheckCircle,
  Star,
  Zap,
  Shield,
  HelpCircle,
  FilePlus,
  Scissors,
  Crop,
  Layers,
  RotateCw,
  FileX,
  FileSearch,
  FileImage,
  Hash,
  Droplets,
  Calculator
} from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { ContactSupportSection } from "@/components/contact-support";
import { allTools } from "@/lib/tools-data";

const guides = [
  {
    id: "compress-pdf",
    title: "How to Compress PDF Files",
    description: "Learn the best techniques to reduce PDF file size without losing quality",
    icon: FileText,
    href: "/guides/how-to-compress-pdf",
    category: "PDF Tools",
    readTime: "5 min read",
    difficulty: "Easy",
    popular: true
  },
  {
    id: "unlock-pdf",
    title: "How to Unlock PDF Files",
    description: "Step-by-step guide to remove password protection from PDFs",
    icon: Lock,
    href: "/guides/how-to-unlock-pdf",
    category: "PDF Tools",
    readTime: "3 min read",
    difficulty: "Easy",
    popular: true
  },
  {
    id: "jpg-to-pdf",
    title: "How to Convert JPG to PDF",
    description: "Complete guide to converting images to PDF documents",
    icon: Image,
    href: "/guides/how-to-convert-jpg-to-pdf",
    category: "Conversion",
    readTime: "4 min read",
    difficulty: "Easy",
    popular: false
  },
  {
    id: "generate-qr",
    title: "How to Generate QR Codes",
    description: "Everything you need to know about creating QR codes",
    icon: QrCode,
    href: "/guides/how-to-generate-qr-code",
    category: "Utilities",
    readTime: "6 min read",
    difficulty: "Easy",
    popular: false
  },
  {
    id: "extract-text",
    title: "How to Extract Text from PDF",
    description: "Extract and convert text from PDF documents using OCR",
    icon: Type,
    href: "/guides/how-to-extract-text-from-pdf",
    category: "PDF Tools",
    readTime: "5 min read",
    difficulty: "Medium",
    popular: false
  },
  {
    id: "generate-password",
    title: "How to Generate Secure Passwords",
    description: "Create strong, unique passwords for better security",
    icon: Key,
    href: "/guides/how-to-generate-password",
    category: "Security",
    readTime: "4 min read",
    difficulty: "Easy",
    popular: false
  },
  {
    id: "merge-pdf",
    title: "How to Merge Multiple PDFs",
    description: "Combine multiple PDF files into one seamless document with perfect formatting",
    icon: FilePlus,
    href: "/blog/how-to-merge-pdf",
    category: "PDF Tools",
    readTime: "3 min read",
    difficulty: "Easy",
    popular: false
  },
  {
    id: "split-pdf",
    title: "How to Split PDF Files",
    description: "Divide PDF documents into separate files by page ranges or custom requirements",
    icon: Scissors,
    href: "/blog/how-to-split-pdf",
    category: "PDF Tools",
    readTime: "4 min read",
    difficulty: "Easy",
    popular: false
  },
  {
    id: "crop-pdf",
    title: "How to Crop PDF Pages",
    description: "Remove unwanted margins, headers, and whitespace from PDF documents",
    icon: Crop,
    href: "/blog/how-to-crop-pdf",
    category: "PDF Tools",
    readTime: "5 min read",
    difficulty: "Intermediate",
    popular: false
  },
  {
    id: "organize-pdf",
    title: "How to Organize PDF Pages",
    description: "Rearrange, rotate, and manage PDF pages for perfect document structure",
    icon: Layers,
    href: "/blog/how-to-organize-pdf",
    category: "PDF Tools",
    readTime: "6 min read",
    difficulty: "Intermediate",
    popular: false
  },
  {
    id: "rotate-pdf",
    title: "How to Rotate PDF Pages",
    description: "Fix page orientation issues and rotate PDF pages to the correct angle",
    icon: RotateCw,
    href: "/blog/how-to-rotate-pdf",
    category: "PDF Tools",
    readTime: "2 min read",
    difficulty: "Easy",
    popular: false
  },
  {
    id: "remove-pages",
    title: "How to Remove Pages from PDF",
    description: "Delete unwanted or blank pages from your PDF documents quickly",
    icon: FileX,
    href: "/blog/how-to-remove-pages",
    category: "PDF Tools",
    readTime: "3 min read",
    difficulty: "Easy",
    popular: false
  },
  {
    id: "extract-pages",
    title: "How to Extract Pages from PDF",
    description: "Save specific pages from PDFs as separate files for targeted sharing",
    icon: FileSearch,
    href: "/blog/how-to-extract-pages",
    category: "PDF Tools",
    readTime: "4 min read",
    difficulty: "Easy",
    popular: false
  },
  {
    id: "extract-images",
    title: "How to Extract Images from PDF",
    description: "Save all embedded images from PDF files in original quality",
    icon: FileImage,
    href: "/blog/how-to-extract-images",
    category: "PDF Tools",
    readTime: "5 min read",
    difficulty: "Intermediate",
    popular: false
  },
  {
    id: "add-page-number",
    title: "How to Add Page Numbers to PDF",
    description: "Insert professional page numbers with custom formatting and positioning",
    icon: Hash,
    href: "/blog/how-to-add-page-number",
    category: "PDF Tools",
    readTime: "4 min read",
    difficulty: "Intermediate",
    popular: false
  },
  {
    id: "watermark-pdf",
    title: "How to Add Watermark to PDF",
    description: "Protect your documents with custom text or image watermarks",
    icon: Droplets,
    href: "/blog/how-to-watermark-pdf",
    category: "PDF Tools",
    readTime: "6 min read",
    difficulty: "Advanced",
    popular: false
  },
  {
    id: "word-counter",
    title: "How to Count Words Efficiently",
    description: "Accurately count words, characters, and paragraphs in any text",
    icon: Calculator,
    href: "/tools/word-counter",
    category: "Utility Tools",
    readTime: "3 min read",
    difficulty: "Easy",
    popular: false
  }
];

const categories = ["All", "PDF Tools", "Conversion", "Utilities", "Security"];

export default function GuidesPage() {
  // Generate structured data for guides
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "How-To Guides - AltafToolsHub",
    description: "Comprehensive guides and tutorials for using free online PDF tools and utilities",
    url: "https://altaftoolshub.app/guides",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: guides.length,
      itemListElement: guides.map((guide, index) => ({
        "@type": "HowTo",
        position: index + 1,
        name: guide.title,
        description: guide.description,
        url: `https://altaftoolshub.app${guide.href}`
      }))
    }
  };

  useSEO({
    title: "How-To Guides & Tutorials - Free PDF Tools",
    description: "Learn how to compress PDFs, unlock protected files, convert images to PDF, and more with our comprehensive step-by-step guides",
    path: "/guides",
    keywords: "how to guides, PDF tutorials, compress PDF guide, unlock PDF tutorial, JPG to PDF guide, QR code generator tutorial",
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
            <BookOpen className="w-3 h-3 mr-1" />
            Learning Center
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            How-To Guides & Tutorials
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Master our free tools with step-by-step guides, tips, and best practices
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Step-by-Step Instructions</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Quick Solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Privacy Focused</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Guides */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-2">Popular Guides</h2>
            <p className="text-muted-foreground">Most viewed tutorials by our users</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        {guide.popular && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="mt-4 text-xl">{guide.title}</CardTitle>
                      <CardDescription className="mt-2">{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {guide.readTime}
                        </span>
                        <Badge variant="outline">{guide.difficulty}</Badge>
                        <Badge variant="outline">{guide.category}</Badge>
                      </div>
                      <Button asChild className="w-full group">
                        <Link href={guide.href} data-testid={`guide-link-${guide.id}`}>
                          Read Guide
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
            <p className="text-muted-foreground text-lg">
              Explore additional resources and comparisons
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Tool Comparisons
                </CardTitle>
                <CardDescription>
                  Compare our tools with other popular services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link 
                    href="/compare/pdf-compressor-comparison" 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
                    data-testid="link-pdf-comparison"
                  >
                    <span className="text-sm font-medium">PDF Compressor Comparison</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                  <Link 
                    href="/compare/online-pdf-tools-2025" 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
                    data-testid="link-pdf-tools-2025"
                  >
                    <span className="text-sm font-medium">Best Online PDF Tools 2025</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Learning Resources
                </CardTitle>
                <CardDescription>
                  Deep dive into file formats and best practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/resources" data-testid="link-resources">
                    Visit Resource Center
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tool Cards Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground text-lg">
              Apply what you've learned with our powerful, free online tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allTools
              .filter(tool => tool.available)
              .slice(0, 8)
              .map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link href={tool.href}>
                      <Card 
                        className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group hover:border-primary/50 bg-gradient-to-br from-background to-muted/20"
                        data-testid={`tool-card-${tool.id}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tool.color} p-2 text-white group-hover:scale-110 transition-transform`}>
                              <Icon className="w-full h-full" />
                            </div>
                            <div className="flex gap-1">
                              {tool.popular && (
                                <Badge variant="secondary" className="text-xs">
                                  Popular
                                </Badge>
                              )}
                              {tool.new && (
                                <Badge className="text-xs bg-green-500 text-white">
                                  New
                                </Badge>
                              )}
                            </div>
                          </div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {tool.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {tool.description}
                          </p>
                          <div className="flex items-center text-primary">
                            <span className="text-sm font-medium">Try Now</span>
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
          </div>

          <div className="text-center mt-12">
            <Link href="/all-tools">
              <Button size="lg" className="group">
                Explore All Tools
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ContactSupportSection />
    </div>
  );
}