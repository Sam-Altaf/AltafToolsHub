import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Lock, 
  Image, 
  QrCode, 
  Scissors,
  Layers,
  RotateCw,
  FileX,
  Crop,
  FileOutput,
  FileDown,
  ArrowLeft,
  ChevronRight,
  Shield,
  Clock,
  Globe,
  Download,
  Upload
} from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const toolCategories = [
  {
    name: "PDF Compression",
    icon: FileDown,
    tools: [
      {
        name: "Compress PDF",
        href: "/compress-pdf",
        icon: FileDown,
        description: "Reduce PDF file size while maintaining quality",
        steps: [
          "Upload your PDF file by clicking or dragging",
          "Choose compression level (10KB to 5MB)",
          "Click 'Compress PDF' to start processing",
          "Download your compressed file instantly"
        ],
        tips: [
          "Higher compression = smaller file but lower quality",
          "Use 'Balanced' mode for optimal quality/size ratio",
          "Files are processed locally in your browser"
        ]
      }
    ]
  },
  {
    name: "PDF Security",
    icon: Lock,
    tools: [
      {
        name: "Unlock PDF",
        href: "/unlock-pdf",
        icon: Lock,
        description: "Remove password protection from PDFs",
        steps: [
          "Upload your password-protected PDF",
          "Enter the PDF password you know",
          "Click 'Unlock PDF' to remove protection",
          "Download the unlocked file"
        ],
        tips: [
          "You must know the password to unlock",
          "Original file quality is preserved",
          "Password never leaves your browser"
        ]
      }
    ]
  },
  {
    name: "PDF Conversion",
    icon: Image,
    tools: [
      {
        name: "JPG to PDF",
        href: "/jpg-to-pdf",
        icon: Image,
        description: "Convert images to PDF documents",
        steps: [
          "Upload one or more image files",
          "Arrange images in desired order",
          "Set page size and orientation",
          "Click 'Convert to PDF' and download"
        ],
        tips: [
          "Supports JPG, PNG, GIF, WebP formats",
          "Drag to reorder images",
          "Combine multiple images into one PDF"
        ]
      }
    ]
  },
  {
    name: "PDF Organization",
    icon: Layers,
    tools: [
      {
        name: "Merge PDF",
        href: "/merge-pdf",
        icon: FileText,
        description: "Combine multiple PDFs into one",
        steps: [
          "Upload multiple PDF files",
          "Drag to arrange file order",
          "Click 'Merge PDFs' to combine",
          "Download the merged PDF"
        ],
        tips: [
          "No limit on number of files",
          "Preview before merging",
          "Preserves all content and formatting"
        ]
      },
      {
        name: "Split PDF",
        href: "/split-pdf",
        icon: Scissors,
        description: "Divide PDF into separate documents",
        steps: [
          "Upload your PDF file",
          "Choose split method (ranges, single pages, fixed size)",
          "Enter page ranges or size",
          "Download split files individually or as ZIP"
        ],
        tips: [
          "Use ranges like '1-5, 10-15'",
          "Extract specific pages easily",
          "Batch download available"
        ]
      },
      {
        name: "Organize PDF",
        href: "/organize-pdf",
        icon: Layers,
        description: "Rearrange, rotate, and manage pages",
        steps: [
          "Upload your PDF file",
          "Drag pages to reorder",
          "Rotate, duplicate, or delete pages",
          "Apply changes and download"
        ],
        tips: [
          "Visual page thumbnails",
          "Select multiple pages at once",
          "Undo/redo support"
        ]
      },
      {
        name: "Rotate PDF",
        href: "/rotate-pdf",
        icon: RotateCw,
        description: "Fix page orientation issues",
        steps: [
          "Upload your PDF file",
          "Select pages to rotate",
          "Choose rotation angle (90°, 180°, 270°)",
          "Apply rotation and download"
        ],
        tips: [
          "Rotate individual or all pages",
          "Preview before applying",
          "Fix scanned document orientation"
        ]
      }
    ]
  },
  {
    name: "PDF Editing",
    icon: Crop,
    tools: [
      {
        name: "Remove Pages",
        href: "/remove-pages",
        icon: FileX,
        description: "Delete unwanted pages from PDF",
        steps: [
          "Upload your PDF file",
          "Click pages to select for removal",
          "Click 'Remove Pages' to process",
          "Download the updated PDF"
        ],
        tips: [
          "Visual page selection",
          "Select multiple pages",
          "Original file remains unchanged"
        ]
      },
      {
        name: "Crop PDF",
        href: "/crop-pdf",
        icon: Crop,
        description: "Trim PDF page margins",
        steps: [
          "Upload your PDF file",
          "Adjust crop area visually",
          "Apply to all or specific pages",
          "Download cropped PDF"
        ],
        tips: [
          "Remove unwanted margins",
          "Use preset sizes",
          "Preview before applying"
        ]
      },
      {
        name: "Extract Pages",
        href: "/extract-pages",
        icon: FileOutput,
        description: "Extract specific pages from PDF",
        steps: [
          "Upload your PDF file",
          "Enter page numbers to extract",
          "Click 'Extract Pages'",
          "Download extracted pages as new PDF"
        ],
        tips: [
          "Use ranges: 1-5, 8, 10-15",
          "Creates new PDF with selected pages",
          "Original PDF unchanged"
        ]
      }
    ]
  },
  {
    name: "Other Tools",
    icon: QrCode,
    tools: [
      {
        name: "QR Code Generator",
        href: "/qr-generator",
        icon: QrCode,
        description: "Create QR codes for any content",
        steps: [
          "Enter text, URL, or data",
          "Customize QR code appearance",
          "Set size and error correction",
          "Download as PNG or SVG"
        ],
        tips: [
          "Supports WiFi, vCard, SMS formats",
          "Add logo or custom colors",
          "High-resolution output"
        ]
      },
      {
        name: "Password Generator",
        href: "/password-generator",
        icon: Shield,
        description: "Generate secure passwords",
        steps: [
          "Set password length",
          "Choose character types",
          "Generate password",
          "Copy to clipboard"
        ],
        tips: [
          "Use 16+ characters for security",
          "Include symbols and numbers",
          "Generate multiple at once"
        ]
      }
    ]
  }
];

export default function Documentation() {
  useSEO({
    title: "Documentation - Complete Guide to All Tools | AltafToolsHub",
    description: "Comprehensive documentation and user guides for all PDF tools and utilities. Learn how to compress, merge, split, convert, and edit PDFs with step-by-step instructions.",
    path: "/documentation",
    keywords: "pdf tools documentation, user guide, how to use pdf tools, pdf help, tool instructions, pdf tutorial",
    ogImage: "https://www.altaftoolshub.app/og-documentation.png",
    additionalMetaTags: [
      { name: "robots", content: "index, follow" },
      { property: "article:section", content: "Documentation" }
    ]
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 via-primary/5 to-transparent py-16 relative overflow-hidden">
        <div className="container-section">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="mb-8 gap-2 hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Documentation & Guides
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Complete step-by-step guides for using all our PDF tools and utilities. 
              Learn how to process your files efficiently and securely.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Badge variant="secondary" className="px-3 py-1">
                <Shield className="w-3 h-3 mr-1" />
                100% Browser-Based
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Clock className="w-3 h-3 mr-1" />
                No Registration Required
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Globe className="w-3 h-3 mr-1" />
                Works Offline
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* General Guidelines */}
      <section className="py-12 border-b">
        <div className="container-section">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">General Guidelines</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-primary" />
                  File Upload
                </h3>
                <p className="text-muted-foreground mb-4">
                  All tools support drag-and-drop or click-to-upload. Files are processed 
                  entirely in your browser and never sent to any server.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Privacy & Security
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your files remain on your device. All processing uses WebAssembly and 
                  JavaScript in your browser. No data is stored or transmitted.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Download className="w-4 h-4 text-primary" />
                  Download Results
                </h3>
                <p className="text-muted-foreground mb-4">
                  Processed files download automatically. Your browser may ask where to 
                  save. Original files remain unchanged.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Offline Support
                </h3>
                <p className="text-muted-foreground mb-4">
                  Once loaded, most tools work offline. Only initial page load requires 
                  internet connection to download the processing libraries.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="py-12">
        <div className="container-section">
          <h2 className="text-3xl font-bold mb-8">Tool Documentation</h2>
          
          <Tabs defaultValue={toolCategories[0].name} className="w-full">
            <TabsList className="w-full flex-wrap h-auto p-1 gap-1">
              {toolCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger 
                    key={category.name} 
                    value={category.name}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {toolCategories.map((category) => (
              <TabsContent key={category.name} value={category.name} className="mt-8">
                <div className="grid gap-6">
                  {category.tools.map((tool) => {
                    const ToolIcon = tool.icon;
                    return (
                      <Card key={tool.name} className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <ToolIcon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-1">{tool.name}</h3>
                            <p className="text-muted-foreground mb-4">{tool.description}</p>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3">How to Use:</h4>
                                <ol className="space-y-2">
                                  {tool.steps.map((step, index) => (
                                    <li key={index} className="flex gap-2">
                                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
                                        {index + 1}
                                      </span>
                                      <span className="text-sm text-muted-foreground">{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-3">Tips & Best Practices:</h4>
                                <ul className="space-y-2">
                                  {tool.tips.map((tip, index) => (
                                    <li key={index} className="flex gap-2">
                                      <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                      <span className="text-sm text-muted-foreground">{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            <Link href={tool.href}>
                              <Button className="mt-6">
                                Try {tool.name}
                                <ChevronRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-muted/30">
        <div className="container-section">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Are my files safe?</h3>
                <p className="text-muted-foreground">
                  Yes, absolutely. All file processing happens directly in your browser using 
                  client-side JavaScript. Your files never leave your device and we have no 
                  access to them.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Is there a file size limit?</h3>
                <p className="text-muted-foreground">
                  No strict limits, but very large files (&gt;100MB) may be slow to process 
                  depending on your device's capabilities. The processing happens locally, 
                  so it depends on your browser and device memory.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Do I need to create an account?</h3>
                <p className="text-muted-foreground">
                  No, all tools are completely free and require no registration. Just visit 
                  the tool page and start using it immediately.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Can I use the tools offline?</h3>
                <p className="text-muted-foreground">
                  Once the tool page loads, most features work offline since processing is 
                  done locally. You need internet only for the initial page load.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">What browsers are supported?</h3>
                <p className="text-muted-foreground">
                  Modern versions of Chrome, Firefox, Safari, and Edge are fully supported. 
                  We recommend using the latest browser version for best performance.
                </p>
              </div>
            </div>
            
            <Link href="/faq">
              <Button variant="outline" className="mt-6">
                View All FAQs
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-12">
        <div className="container-section">
          <Card className="p-8 bg-gradient-to-br from-primary/5 via-background to-primary/10">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                If you couldn't find what you're looking for or need assistance with a specific 
                use case, our support team is here to help.
              </p>
              <a href="mailto:altaftoolshub@gmail.com?subject=Documentation%20Help%20Request">
                <Button size="lg">
                  Contact Support
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}