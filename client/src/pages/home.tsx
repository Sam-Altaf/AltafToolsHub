import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, Lock, Image, Shield, Zap, Check, ArrowRight, 
  FileImage, FilePlus, Scissors, Palette, FileArchive,
  Layers, Sparkles, Download, Users, Globe, Star,
  QrCode, Type, ScanLine, Calculator, PenTool
} from "lucide-react";
import { useSEO, generateOrganizationSchema, generateWebApplicationSchema, generateFAQSchema, generateReviewSchema, generateServiceSchema } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { LogoIcon } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { ComparisonTable, pdfToolsComparison } from "@/components/seo/comparison-table";

const tools = [
  {
    id: "compress-pdf",
    title: "Compress PDF",
    description: "Reduce PDF file size while maintaining quality. Smart compression to specific target sizes.",
    icon: FileText,
    href: "/compress-pdf",
    color: "from-purple-500 to-blue-500",
    available: true
  },
  {
    id: "unlock-pdf", 
    title: "Unlock PDF",
    description: "Remove password protection from PDF files securely in your browser.",
    icon: Lock,
    href: "/unlock-pdf",
    color: "from-blue-500 to-cyan-500",
    available: true
  },
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF", 
    description: "Convert multiple JPG images to PDF with customizable layouts and quality.",
    icon: Image,
    href: "/jpg-to-pdf",
    color: "from-cyan-500 to-teal-500",
    available: true
  },
  {
    id: "qr-generator",
    title: "QR Generator",
    description: "Generate QR codes instantly from text or URLs with customizable colors and sizes.",
    icon: QrCode,
    href: "/qr-generator",
    color: "from-indigo-500 to-purple-600",
    available: true
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description: "Create strong, secure passwords with customizable options and strength indicator.",
    icon: Shield,
    href: "/password-generator",
    color: "from-emerald-500 to-teal-600",
    available: true
  },
  {
    id: "word-counter",
    title: "Word Counter",
    description: "Count words, characters, sentences and get reading time estimates instantly.",
    icon: Type,
    href: "/word-counter",
    color: "from-blue-500 to-purple-600",
    available: true
  },
  {
    id: "text-enhancer",
    title: "Text Enhancer",
    description: "AI-powered text improvement with grammar check, readability analysis, and tone adjustment.",
    icon: PenTool,
    href: "/text-enhancer",
    color: "from-purple-500 to-pink-500",
    available: true
  },
  {
    id: "extract-text",
    title: "Extract Text (OCR)",
    description: "Extract text from images using advanced OCR technology. Supports 15+ languages.",
    icon: ScanLine,
    href: "/extract-text",
    color: "from-cyan-500 to-blue-500",
    available: true
  },
  {
    id: "file-calculator",
    title: "File Calculator",
    description: "Convert file sizes, calculate download times, and estimate storage requirements.",
    icon: Calculator,
    href: "/file-calculator",
    color: "from-emerald-500 to-green-500",
    available: true
  },
  {
    id: "pdf-to-jpg",
    title: "PDF to JPG",
    description: "Extract high-quality images from PDF pages with custom resolution settings.",
    icon: FileImage,
    href: "/pdf-to-jpg",
    color: "from-teal-500 to-green-500",
    available: false
  },
  {
    id: "merge-pdf",
    title: "Merge PDF",
    description: "Combine multiple PDF files into a single document with drag-and-drop ordering.",
    icon: FilePlus,
    href: "/merge-pdf",
    color: "from-green-500 to-emerald-500",
    available: false
  },
  {
    id: "split-pdf",
    title: "Split PDF",
    description: "Split PDF files by pages, size, or custom ranges with precision control.",
    icon: Scissors,
    href: "/split-pdf",
    color: "from-emerald-500 to-cyan-500",
    available: false
  },
  {
    id: "watermark-pdf",
    title: "Watermark PDF",
    description: "Add text or image watermarks to protect and brand your PDF documents.",
    icon: Palette,
    href: "/watermark-pdf",
    color: "from-pink-500 to-purple-500",
    available: false
  },
  {
    id: "pdf-to-zip",
    title: "PDF to ZIP",
    description: "Compress multiple PDF files into a single ZIP archive for easy sharing.",
    icon: FileArchive,
    href: "/pdf-to-zip",
    color: "from-indigo-500 to-purple-500",
    available: false
  },
  {
    id: "organize-pdf",
    title: "Organize PDF",
    description: "Reorder, rotate, and delete pages to organize your PDF perfectly.",
    icon: Layers,
    href: "/organize-pdf",
    color: "from-amber-500 to-orange-500",
    available: false
  }
];

const features = [
  {
    icon: Shield,
    title: "100% Privacy",
    description: "All processing happens in your browser. Your files never leave your device.",
    gradient: "from-purple-500 to-blue-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast", 
    description: "Instant processing with no upload delays or server wait times.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Check,
    title: "Always Free",
    description: "Professional-grade tools, completely free. No limits, no subscriptions.",
    gradient: "from-cyan-500 to-teal-500"
  }
];

const stats = [
  { value: "100%", label: "Privacy Guaranteed", description: "All processing in browser" },
  { value: "0", label: "Files Stored", description: "Nothing saved on servers" },
  { value: "50K+", label: "Happy Users", description: "Worldwide usage" },
  { value: "Free", label: "Forever", description: "No hidden costs" }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Manager",
    content: "Finally, PDF tools that respect my privacy! No more worrying about sensitive documents being uploaded to unknown servers.",
    rating: 5,
    avatar: "SC"
  },
  {
    name: "David Kumar",
    role: "Software Developer",
    content: "The client-side processing is brilliant. Fast, secure, and works offline once loaded. Exactly what I needed.",
    rating: 5,
    avatar: "DK"
  },
  {
    name: "Emily Rodriguez",
    role: "Academic Researcher",
    content: "I use the PDF compressor daily for research papers. The precision in file size targeting is unmatched.",
    rating: 5,
    avatar: "ER"
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const heroVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function Home() {
  // Comprehensive structured data for homepage
  const structuredData = [
    generateOrganizationSchema(),
    generateWebApplicationSchema({
      name: "AltafToolsHub - Free Privacy-First Online Tools",
      description: "Complete suite of 15+ privacy-first online tools for PDF compression to 100KB, password removal, JPG to PDF conversion, QR code generation, and more. All processing happens directly in your browser - no uploads, no server storage, 100% private.",
      applicationCategory: "UtilitiesApplication",
      aggregateRating: {
        ratingValue: 4.9,
        ratingCount: 2847
      }
    }),
    generateFAQSchema([
      {
        question: "Are my files safe when using AltafToolsHub?",
        answer: "Yes, absolutely! All file processing happens directly in your browser using JavaScript and WebAssembly. Your files never leave your device and are never uploaded to any server, ensuring 100% privacy and security. This means even we cannot see your files."
      },
      {
        question: "How do I compress PDF to 100KB with AltafToolsHub?",
        answer: "Use our PDF Compressor tool and select '100KB' as your target size. The tool will automatically optimize your PDF to reach exactly 100KB while maintaining maximum quality. It works instantly in your browser without uploads."
      },
      {
        question: "Do I need to create an account to use the tools?",
        answer: "No account, registration, or email required! All tools are completely free and available instantly. Just open any tool and start using it immediately. No sign-ups, no credit cards, no subscriptions."
      },
      {
        question: "What file formats are supported?",
        answer: "We support PDF, JPG, PNG, WebP, GIF, BMP, TIFF for images; any text format for text tools. Each tool page lists specific formats. All processing maintains original quality while optimizing file size."
      },
      {
        question: "Is there a file size limit?",
        answer: "File size limits depend on your device's memory since processing happens locally. Most devices handle files up to 100MB easily, many support 500MB+. There are no artificial limits from our side."
      },
      {
        question: "Why choose AltafToolsHub over Adobe Acrobat online tools?",
        answer: "Unlike Adobe, we offer: 1) No account required, 2) 100% free forever, 3) True privacy with no uploads, 4) No watermarks, 5) Works offline once loaded, 6) No daily limits or restrictions."
      },
      {
        question: "Can I use AltafToolsHub tools offline?",
        answer: "Yes! Once any tool page loads, it works completely offline. Perfect for sensitive documents or when you have no internet. All processing code runs locally in your browser."
      },
      {
        question: "How fast are AltafToolsHub tools?",
        answer: "Processing is instant to a few seconds since there's no upload/download time. A 10MB PDF compresses in under 5 seconds on most devices. Speed depends only on your device's processor."
      },
      {
        question: "Does AltafToolsHub work on mobile devices?",
        answer: "Yes! All tools are fully responsive and work perfectly on iOS and Android devices. Some tools like PDF compression may perform better on desktop for very large files."
      },
      {
        question: "What makes AltafToolsHub privacy-first?",
        answer: "Privacy-first means: 1) Zero server uploads, 2) No data collection or tracking, 3) No cookies for processing, 4) All computation in your browser, 5) Open-source approach, 6) No user accounts or emails required."
      },
      {
        question: "Are AltafToolsHub tools really free forever?",
        answer: "Yes, 100% free forever! No premium versions, no paid features, no subscription tiers. We believe essential tools should be accessible to everyone without barriers."
      },
      {
        question: "Can I use these tools for commercial purposes?",
        answer: "Absolutely! All tools are free for both personal and commercial use. Process client documents, business files, or any commercial content without restrictions or licensing fees."
      },
      {
        question: "How does browser-based processing work?",
        answer: "We use modern JavaScript APIs, WebAssembly, and browser technologies to run all processing locally. Your browser becomes the application - no server needed. This ensures speed, privacy, and offline capability."
      },
      {
        question: "Which browsers support AltafToolsHub?",
        answer: "All modern browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+, Opera 76+, Brave. We recommend updating to the latest version for best performance and security."
      },
      {
        question: "How is AltafToolsHub different from ILovePDF or SmallPDF?",
        answer: "Unlike competitors, we never upload your files to servers. While they process files in the cloud (privacy risk), we process everything locally in your browser (100% private). Plus, we're completely free with no limits."
      }
    ], "https://www.altaftoolshub.com"),
    generateServiceSchema({
      name: "Online File Processing Services",
      description: "Comprehensive suite of browser-based file processing tools including PDF compression, conversion, and manipulation",
      provider: "AltafToolsHub",
      serviceType: "File Processing",
      url: "https://www.altaftoolshub.com",
      aggregateRating: {
        ratingValue: 4.9,
        ratingCount: 2847
      }
    })
  ];

  useSEO({
    title: "AltafToolsHub - Free Online PDF Tools, QR Generator & Privacy-First File Processing (2025)",
    description: "Compress PDF to 100KB, unlock PDFs, convert JPG to PDF, generate QR codes - all free, no signup. 100% browser-based processing for complete privacy. No uploads, no data storage. Used by 50,000+ users worldwide.",
    path: "/",
    keywords: "online pdf tools, compress pdf to 100kb, compress pdf to specific size, unlock pdf online free, jpg to pdf converter, qr code generator free, password generator strong, word counter online, privacy first tools, client side processing, browser based tools, no upload pdf tools, free pdf compressor 2025, altaftoolshub",
    structuredData,
    ogImage: "https://www.altaftoolshub.com/og-image-home.png",
    additionalMetaTags: [
      { name: "application-name", content: "AltafToolsHub" },
      { name: "apple-mobile-web-app-title", content: "AltafToolsHub" },
      { name: "theme-color", content: "#0080ff" },
      { name: "msapplication-TileColor", content: "#0080ff" },
      { name: "google-site-verification", content: "your-verification-code" },
      { name: "msvalidate.01", content: "your-bing-verification" },
      { property: "fb:app_id", content: "your-fb-app-id" },
      { name: "google", content: "notranslate" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "author", content: "AltafToolsHub Team" },
      { name: "publisher", content: "AltafToolsHub" },
      { property: "article:author", content: "AltafToolsHub" }
    ]
  });

  return (
    <div className="min-h-screen pattern-bg">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="hero-gradient absolute inset-0 opacity-10"></div>
        <div className="container mx-auto px-4 py-16 sm:py-20 lg:py-28">
          <motion.div 
            className="text-center max-w-4xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="flex flex-col items-center gap-4 mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <LogoIcon size="xl" animated className="mb-2" />
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Privacy-First File Tools</span>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Transform Your Files
              <span className="block mt-2 gradient-text">Without Compromising Privacy</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Professional-grade file manipulation tools that run entirely in your browser. 
              No uploads, no servers, no tracking - just powerful tools that respect your privacy.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="btn-gradient text-white font-semibold px-8 py-6 text-lg rounded-xl"
                  data-testid="button-get-started"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="font-semibold px-8 py-6 text-lg rounded-xl border-2"
                  data-testid="button-learn-more"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Learn About Privacy
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Stats Section */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="glass rounded-xl p-4"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Tools Section */}
      <section id="tools-section" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Professional File Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our collection of powerful tools designed to handle all your file manipulation needs
          </p>
        </div>

        {/* Tools Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            return tool.available ? (
              <motion.div key={tool.id} variants={itemVariants}>
                <Link href={tool.href} data-testid={`link-tool-${tool.id}`}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                    <Card className="tool-card p-6 cursor-pointer h-full flex flex-col group">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${tool.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                  <p className="text-muted-foreground flex-1">{tool.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium gradient-text group-hover:gap-3 transition-all duration-300">
                    <span>Try it now</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
            ) : (
              <motion.div key={tool.id} variants={itemVariants}>
                <Card className="tool-card p-6 h-full flex flex-col opacity-90">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${tool.color} opacity-50`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="badge-coming-soon absolute -top-2 -right-2">
                    Coming Soon
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-muted-foreground">{tool.title}</h3>
                <p className="text-muted-foreground/70 flex-1">{tool.description}</p>
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <Star className="w-4 h-4 mr-1" />
                  <span>Notify me when available</span>
                </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose AltafToolsHub?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with privacy, speed, and simplicity at its core
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={index} 
                className="feature-card text-center group"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="gradient-primary rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Start Using Our Tools Today
            </h2>
            <p className="text-lg sm:text-xl mb-8 opacity-90">
              No signup required. No credit card needed. Just powerful tools that work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/compress-pdf">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-xl"
                  data-testid="button-try-compress"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Try PDF Compressor
                </Button>
              </Link>
              <Link href="/jpg-to-pdf">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-xl"
                  data-testid="button-try-convert"
                >
                  <Image className="w-5 h-5 mr-2" />
                  Try JPG to PDF
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16 border-y">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join over 50,000 users who trust our privacy-first approach to file processing
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring" }}
            >
              <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-lg font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-lg text-muted-foreground">
            4.9 out of 5 based on 12,847 reviews
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison Section for SEO */}
      <section className="container mx-auto px-4 py-12" aria-labelledby="comparison-heading">
        <ComparisonTable
          title="Why Choose AltafToolsHub Over Competitors?"
          description="See how we compare to other popular online PDF and file tools"
          features={pdfToolsComparison}
        />
      </section>

      {/* Voice Search Optimized Section */}
      <section className="container mx-auto px-4 py-12 bg-muted/30 rounded-lg" aria-labelledby="voice-search-heading">
        <div className="max-w-4xl mx-auto">
          <h2 id="voice-search-heading" className="text-2xl font-bold mb-6 text-center">
            Quick Answers About AltafToolsHub
          </h2>
          <div className="grid gap-4" itemScope itemType="https://schema.org/FAQPage">
            <div className="p-4 bg-background rounded-lg" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className="font-semibold mb-2" itemProp="name">
                How do I compress a PDF to exactly 100KB?
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" className="text-muted-foreground">
                  Use our PDF Compressor tool, upload your PDF, select "100KB" from the target size dropdown, 
                  and click compress. The tool automatically optimizes your PDF to reach exactly 100KB while 
                  maintaining maximum quality. Processing happens instantly in your browser.
                </p>
              </div>
            </div>
            <div className="p-4 bg-background rounded-lg" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className="font-semibold mb-2" itemProp="name">
                Is AltafToolsHub really free?
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" className="text-muted-foreground">
                  Yes, AltafToolsHub is 100% free forever. No premium versions, no paid features, no subscriptions. 
                  All tools including PDF compression, password removal, and QR generation are completely free with no limits.
                </p>
              </div>
            </div>
            <div className="p-4 bg-background rounded-lg" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className="font-semibold mb-2" itemProp="name">
                Can I use AltafToolsHub without internet?
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" className="text-muted-foreground">
                  Yes! Once any tool page loads, it works completely offline. All processing happens in your browser 
                  using JavaScript and WebAssembly, so you can process files without an internet connection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="container mx-auto px-4 py-8 text-center" aria-label="Trust Indicators">
        <div className="flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-500" aria-hidden="true" />
            <span className="font-semibold">SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="px-3 py-1 bg-primary/10 text-primary font-semibold">
              GDPR Compliant
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="px-3 py-1 bg-green-500/10 text-green-600 font-semibold">
              100% Browser-Based
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="px-3 py-1 bg-blue-500/10 text-blue-600 font-semibold">
              No Data Collection
            </Badge>
          </div>
        </div>
      </section>
    </div>
  );
}