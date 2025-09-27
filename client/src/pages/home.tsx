import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Lock, Image, Shield, Zap, QrCode, Key, FileSearch } from "lucide-react";
import { LogoIcon } from "@/components/logo";

export default function Home() {
  const availableTools = [
    {
      id: "compress-pdf",
      title: "PDF Compressor",
      description: "Reduce PDF file size while maintaining quality",
      icon: FileText,
      href: "/compress-pdf",
      category: "PDF Tools",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      id: "unlock-pdf", 
      title: "PDF Unlocker",
      description: "Remove passwords from PDF files securely",
      icon: Lock,
      href: "/unlock-pdf",
      category: "PDF Tools",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: "jpg-to-pdf",
      title: "JPG to PDF",
      description: "Convert images to PDF format instantly",
      icon: Image,
      href: "/jpg-to-pdf",
      category: "PDF Tools", 
      gradient: "from-cyan-500 to-teal-500"
    },
    {
      id: "qr-generator",
      title: "QR Generator", 
      description: "Create QR codes instantly for any text or URL",
      icon: QrCode,
      href: "/qr-generator",
      category: "Utility Tools",
      gradient: "from-teal-500 to-green-500"
    },
    {
      id: "password-generator",
      title: "Password Generator",
      description: "Generate secure passwords with custom settings",
      icon: Key,
      href: "/password-generator", 
      category: "Utility Tools",
      gradient: "from-green-500 to-yellow-500"
    },
    {
      id: "extract-text",
      title: "Text Extractor",
      description: "Extract text from images using OCR technology",
      icon: FileSearch,
      href: "/extract-text",
      category: "Utility Tools",
      gradient: "from-yellow-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden pt-20 pb-24 sm:pt-32 sm:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20"></div>
        <div className="container relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24">
                <LogoIcon className="w-full h-full" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
              Privacy-First File Tools
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Professional file processing tools that work entirely in your browser. 
              <span className="text-primary font-semibold"> Your files never leave your device.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/compress-pdf">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <Zap className="w-5 h-5 mr-2" />
                  Try PDF Compressor
                </Button>
              </Link>
              <Link href="/all-tools">
                <Button size="lg" variant="outline" className="px-10 py-6 text-lg font-semibold">
                  Browse All Tools
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">60+</div>
                <div className="text-sm text-muted-foreground">Total Tools</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">6</div>
                <div className="text-sm text-muted-foreground">Available Now</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Privacy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">Free</div>
                <div className="text-sm text-muted-foreground">Forever</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Tools Section */}
      <section id="tools-section" className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Available Tools</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start using these professional-grade tools right now. More coming soon!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {availableTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.id} href={tool.href}>
                  <Card className="group p-6 h-full cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="flex flex-col h-full">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {tool.description}
                        </p>
                        <div className="text-xs text-primary font-medium">
                          {tool.category}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/all-tools">
              <Button size="lg" variant="outline">
                View All Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Why Choose AltafToolsHub?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the benefits of truly private file processing
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "100% Privacy",
                description: "All processing happens in your browser. Your files never leave your device.",
                gradient: "from-purple-500 to-blue-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Instant processing with no delays or server wait times.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: FileText,
                title: "Professional Quality",
                description: "Enterprise-grade tools with professional results.",
                gradient: "from-cyan-500 to-teal-500"
              },
              {
                icon: Shield,
                title: "Free Forever",
                description: "Professional-grade tools, completely free. No limits, no subscriptions.",
                gradient: "from-teal-500 to-green-500"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}