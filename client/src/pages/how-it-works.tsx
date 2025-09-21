import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Globe,
  Cpu,
  Lock,
  Zap,
  CloudOff,
  FileCheck,
  Download,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  Code,
  Layers,
  RefreshCw,
  Eye,
  Server,
  Timer,
  BarChart3,
  MonitorSmartphone
} from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";

const HowItWorks = () => {
  useSEO({
    title: "How It Works - Privacy-First File Processing | AltafToolsHub",
    description: "Learn how AltafToolsHub processes your files directly in your browser using WebAssembly and JavaScript. No uploads, no servers, complete privacy.",
    path: "/how-it-works",
    keywords: "browser-based processing, WebAssembly, client-side, privacy, file security, no upload tools, offline processing"
  });

  const steps = [
    {
      number: "01",
      title: "Select Your Tool",
      description: "Choose from our 60+ tools for PDF, image, text, and QR code processing.",
      icon: FileCheck,
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "02",
      title: "Process Locally",
      description: "Your files are processed entirely in your browser using advanced WebAssembly technology.",
      icon: Cpu,
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "03",
      title: "Download Results",
      description: "Get your processed files instantly. No waiting for server processing or downloads.",
      icon: Download,
      color: "from-green-500 to-emerald-500"
    }
  ];

  const technologies = [
    {
      name: "WebAssembly",
      description: "High-performance code execution in the browser for complex file operations.",
      icon: Code,
      benefits: ["Native speed", "Secure sandbox", "Cross-platform"]
    },
    {
      name: "JavaScript Workers",
      description: "Background processing that doesn't freeze your browser interface.",
      icon: Layers,
      benefits: ["Parallel processing", "Non-blocking UI", "Efficient memory use"]
    },
    {
      name: "PDF.js & pdf-lib",
      description: "Industry-standard libraries for PDF manipulation and rendering.",
      icon: FileCheck,
      benefits: ["Full PDF support", "Encryption handling", "Form processing"]
    },
    {
      name: "Canvas API",
      description: "Browser-native image processing and manipulation capabilities.",
      icon: Eye,
      benefits: ["Image conversion", "Real-time preview", "Quality control"]
    }
  ];

  const privacyFeatures = [
    {
      title: "Zero Server Upload",
      description: "Files never leave your device. All processing happens in your browser's secure sandbox.",
      icon: CloudOff
    },
    {
      title: "No Data Storage",
      description: "We don't store, log, or have any access to your files or their contents.",
      icon: Server
    },
    {
      title: "Instant Processing",
      description: "No network delays. Processing speed depends only on your device's capabilities.",
      icon: Zap
    },
    {
      title: "Works Offline",
      description: "Once loaded, tools work without internet connection. Perfect for sensitive documents.",
      icon: Globe
    },
    {
      title: "Memory Cleared",
      description: "All file data is automatically cleared from memory when you close the tab.",
      icon: RefreshCw
    },
    {
      title: "End-to-End Privacy",
      description: "Your files remain encrypted and private throughout the entire process.",
      icon: Lock
    }
  ];

  const faqs = [
    {
      question: "Is it really 100% client-side?",
      answer: "Yes! You can verify this by monitoring your network traffic while using our tools. You'll see no file uploads to our servers - only the initial page load."
    },
    {
      question: "How can browser-based tools be so powerful?",
      answer: "Modern browsers support WebAssembly, which provides near-native performance. Combined with JavaScript workers and optimized algorithms, we achieve professional-grade processing entirely in your browser."
    },
    {
      question: "What happens to my files after processing?",
      answer: "Files exist only in your browser's temporary memory during processing. They're automatically cleared when you close the tab or navigate away. We never have access to them."
    },
    {
      question: "Can you see what files I'm processing?",
      answer: "No. Since all processing happens on your device, we have zero visibility into what files you process, their contents, or how you use our tools."
    },
    {
      question: "What file sizes can you handle?",
      answer: "Most tools handle files up to 100MB efficiently. Larger files may work but could be slower depending on your device's RAM and processing power."
    },
    {
      question: "Do the tools work on mobile devices?",
      answer: "Yes! Our tools work on any modern browser including mobile Safari and Chrome. Performance may vary based on your device's capabilities."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-primary/3 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container-section relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4" variant="secondary">
              <Shield className="w-3 h-3 mr-1" />
              Privacy-First Technology
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              How AltafToolsHub Works
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Experience the future of file processing: powerful tools that run entirely in your browser.
              No uploads, no servers, no compromises on privacy or performance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/all-tools">
                <Button size="lg" className="gap-2" data-testid="button-explore-tools">
                  Explore Tools
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/documentation">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-view-docs">
                  View Documentation
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simple 3-Step Process */}
      <section className="py-16 bg-muted/30">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Three Simple Steps</h2>
            <p className="text-lg text-muted-foreground">
              From file selection to download in seconds, all without leaving your browser
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full relative overflow-hidden group hover:shadow-lg transition-all">
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                  <div className="relative">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${step.color} mb-4`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-muted-foreground/20 absolute top-0 right-0">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Modern Web Technology</h2>
            <p className="text-lg text-muted-foreground">
              We leverage cutting-edge browser capabilities to deliver desktop-quality tools
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <tech.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{tech.name}</h3>
                      <p className="text-muted-foreground mb-4">{tech.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {tech.benefits.map((benefit, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="secondary">
              <Lock className="w-3 h-3 mr-1" />
              Privacy by Design
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Privacy is Guaranteed</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Unlike traditional online tools that upload your files to servers, our tools process everything
              locally in your browser. This isn't just a promise - it's technically impossible for us to access your data.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {privacyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all group">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-16">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Performance You Can Trust</h2>
            <p className="text-lg text-muted-foreground">
              Our tools deliver professional results without compromising on speed or quality
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Timer, value: "<3s", label: "Average Processing Time" },
              { icon: FileCheck, value: "100MB+", label: "Max File Size" },
              { icon: BarChart3, value: "99.9%", label: "Success Rate" },
              { icon: MonitorSmartphone, value: "All Modern", label: "Browsers Supported" }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <metric.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our browser-based processing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 h-full">
                  <h3 className="text-lg font-semibold mb-3 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground pl-7">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience Privacy-First Tools?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust AltafToolsHub for secure, fast, and free file processing.
                No registration required, start using our tools instantly.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/all-tools">
                  <Button size="lg" className="gap-2" data-testid="button-start-now">
                    Start Using Tools Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/use-cases">
                  <Button size="lg" variant="outline" className="gap-2" data-testid="button-view-use-cases">
                    View Use Cases
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;