import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  FileQuestion, 
  Zap, 
  HelpCircle,
  Lock,
  Globe,
  Download,
  Mail,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { Link } from "wouter";
import { useSEO, generateFAQSchema } from "@/hooks/use-seo";
import { ContactSupportSection } from "@/components/contact-support";

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  questions: {
    question: string;
    answer: string;
  }[];
}

const faqCategories: FAQCategory[] = [
  {
    id: "privacy-security",
    title: "Privacy & Security",
    icon: Shield,
    questions: [
      {
        question: "Are my files really safe when using AltafToolsHub?",
        answer: "Absolutely! Your files are 100% safe because they never leave your device. All processing happens directly in your browser using client-side JavaScript. We don't upload, store, or have access to any of your files. Once you close the browser tab, all traces of your files are gone."
      },
      {
        question: "Do you store or track my files?",
        answer: "No, we never store or track your files. All file processing is done locally on your device. We don't use cookies to track files, and we don't have servers that store your documents. Your privacy is our top priority."
      },
      {
        question: "Can AltafToolsHub access my processed files?",
        answer: "No, we cannot access your files at any point. The entire processing happens in your browser's memory. Even our own team cannot see what files you're working with. This is the beauty of client-side processing."
      },
      {
        question: "Is it safe to process sensitive documents?",
        answer: "Yes, it's completely safe to process sensitive documents like contracts, financial statements, or personal information. Since files never leave your device and we can't access them, you maintain complete control and privacy over your sensitive data."
      },
      {
        question: "Do you comply with GDPR and privacy regulations?",
        answer: "Yes, we fully comply with GDPR and other privacy regulations. Since we don't collect, store, or process any personal data on our servers, we exceed the requirements of most privacy laws. Your data stays on your device at all times."
      }
    ]
  },
  {
    id: "file-processing",
    title: "File Processing",
    icon: FileQuestion,
    questions: [
      {
        question: "What file types are supported?",
        answer: "We support a wide range of file types including PDF, JPG, PNG, GIF, BMP, TIFF, WEBP, DOC, DOCX, TXT, and more. Each tool specifies which file types it accepts. We're constantly adding support for new formats."
      },
      {
        question: "Is there a file size limit?",
        answer: "There's no strict file size limit imposed by our tools since processing happens on your device. However, larger files (100MB+) may take longer to process depending on your device's capabilities. Your browser's memory is the only limitation."
      },
      {
        question: "Can I process multiple files at once?",
        answer: "Yes, many of our tools support batch processing. You can select multiple files and process them simultaneously. The exact number depends on your device's capabilities and available memory."
      },
      {
        question: "Why is processing faster than other online tools?",
        answer: "Our tools are faster because there's no upload or download time. Traditional online tools need to upload your file to a server, process it, and download it back. We skip all of that by processing everything locally on your device."
      },
      {
        question: "Do the tools work offline?",
        answer: "Once a tool page is loaded, it can work offline since all processing happens in your browser. However, you need an internet connection to initially load the tool. After that, you can disconnect and continue working."
      }
    ]
  },
  {
    id: "technical",
    title: "Technical Questions",
    icon: Zap,
    questions: [
      {
        question: "What browsers are supported?",
        answer: "AltafToolsHub works on all modern browsers including Chrome (90+), Firefox (88+), Safari (14+), and Edge (90+). For the best experience, we recommend using the latest version of Chrome or Firefox."
      },
      {
        question: "Do I need to install any software?",
        answer: "No installation required! All our tools run directly in your web browser. You don't need to download or install any software, plugins, or extensions. Just open the website and start using the tools immediately."
      },
      {
        question: "Why do some tools take time to load initially?",
        answer: "Some tools need to load processing libraries when you first open them. These libraries enable advanced features like PDF manipulation or image processing. Once loaded, the tools work instantly. The libraries are cached for faster loading on repeat visits."
      },
      {
        question: "Can I use the tools on mobile devices?",
        answer: "Yes, all our tools are fully responsive and work on mobile devices. However, some resource-intensive operations may perform better on desktop devices with more processing power and memory."
      },
      {
        question: "How accurate are the compression tools?",
        answer: "Our compression tools use advanced algorithms to achieve target file sizes while maintaining optimal quality. The PDF compressor, for example, can accurately hit specific size targets (like 100KB or 500KB) within a 5% margin while preserving readability."
      }
    ]
  },
  {
    id: "general",
    title: "General Questions",
    icon: HelpCircle,
    questions: [
      {
        question: "Is AltafToolsHub really free?",
        answer: "Yes, AltafToolsHub is 100% free to use. All tools are available without any payment, subscription, or registration. We don't have premium tiers or hidden costs. Every feature you see is free forever."
      },
      {
        question: "Do I need to create an account?",
        answer: "No account needed! You can use all our tools immediately without signing up, logging in, or providing any personal information. We believe in making tools accessible to everyone without barriers."
      },
      {
        question: "How many tools are available?",
        answer: "We currently offer 49 tools (17 available, 32 coming soon) and are constantly adding more. Our tools cover PDF processing, image conversion, QR code generation, text utilities, calculators, and many other categories."
      },
      {
        question: "Can I suggest new tools or features?",
        answer: "Absolutely! We love hearing from our users. Send your suggestions to support@altaftoolshub.app. We review all suggestions and prioritize tools that would benefit the most users."
      },
      {
        question: "Why choose AltafToolsHub over other online tools?",
        answer: "AltafToolsHub offers unique advantages: 100% privacy (no uploads), faster processing (no server delays), no registration required, no file limits, no watermarks, and it's completely free. Plus, our tools work offline once loaded."
      },
      {
        question: "How can I report a bug or issue?",
        answer: "If you encounter any issues, please email us at support@altaftoolshub.app with details about the problem, the tool you were using, and your browser information. We typically respond within 24 hours."
      }
    ]
  }
];

const allFAQs = faqCategories.flatMap(category => 
  category.questions.map(q => ({
    question: q.question,
    answer: q.answer
  }))
);

export default function FAQPage() {
  const faqSchema = generateFAQSchema(allFAQs);

  useSEO({
    title: "FAQ - Frequently Asked Questions",
    description: "Find answers to all your questions about AltafToolsHub's free PDF tools. Learn about file safety, 100% privacy guarantee, browser-based processing, supported formats, and technical requirements. Get help with PDF compression, conversion, and more.",
    path: "/faq",
    keywords: "altaftoolshub faq, pdf tools help, frequently asked questions, file safety questions, browser-based tools support, privacy tools faq, pdf compression help, file conversion support, online tools help 2025",
    ogImage: "https://altaftoolshub.com/og-faq.png",
    structuredData: faqSchema,
    additionalMetaTags: [
      { name: "application-name", content: "FAQ - AltafToolsHub" },
      { property: "article:section", content: "Support" },
      { property: "article:author", content: "AltafToolsHub" },
      { name: "robots", content: "index, follow, max-snippet:-1" }
    ]
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container-section">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-primary to-blue-600 text-white border-0 shadow-md">
              <HelpCircle className="w-3 h-3 mr-1" />
              Help Center
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-primary">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about AltafToolsHub's privacy-first file tools
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 border-b">
        <div className="container-section">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground">Quick Jump:</span>
            {faqCategories.map((category) => {
              const Icon = category.icon;
              return (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                  data-testid={`faq-jump-${category.id}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.title}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12">
        <div className="container-section">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  id={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                    <Badge variant="secondary" className="ml-auto">
                      {category.questions.length} questions
                    </Badge>
                  </div>

                  <Card className="overflow-hidden">
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((item, index) => (
                        <AccordionItem
                          key={index}
                          value={`${category.id}-${index}`}
                          className="border-b last:border-0"
                          data-testid={`faq-item-${category.id}-${index}`}
                        >
                          <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 transition-colors text-left">
                            <span className="font-medium pr-4">{item.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4">
                            <p className="text-muted-foreground leading-relaxed">
                              {item.answer}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Help Section */}
      <section className="py-12 bg-muted/30">
        <div className="container-section">
          <Card className="p-8 text-center max-w-2xl mx-auto">
            <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Can't find what you're looking for?</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help with any questions not covered in the FAQ
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:altaftoolshub@gmail.com?subject=Support%20Request%20-%20AltafToolsHub" data-testid="faq-email-button">
                <Button size="lg" className="btn-gradient text-white">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
              </a>
              <Link href="/all-tools">
                <Button size="lg" variant="outline">
                  <Globe className="w-4 h-4 mr-2" />
                  Browse Tools
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Support Section */}
      <ContactSupportSection />
    </div>
  );
}