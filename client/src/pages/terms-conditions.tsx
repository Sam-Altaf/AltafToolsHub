import { Card } from "@/components/ui/card";
import { ScrollText, Shield, AlertCircle, Users, Globe, Scale, Ban, Mail } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";

const sections = [
  {
    icon: ScrollText,
    title: "Terms of Service",
    content: [
      "Welcome to AltafToolsHub. These Terms and Conditions (\"Terms\") govern your use of our website and services.",
      "By accessing or using AltafToolsHub, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our services.",
      "Our services are provided \"as is\" for personal and commercial use, subject to the restrictions outlined in these Terms."
    ]
  },
  {
    icon: Shield,
    title: "Service Description",
    content: [
      "**Client-Side Processing**: AltafToolsHub provides browser-based file manipulation tools that process files entirely on your device. No files are uploaded to our servers.",
      "**Free to Use**: All tools are currently provided free of charge for both personal and commercial use.",
      "**No Registration Required**: You can use our services without creating an account or providing personal information.",
      "**Service Availability**: While we strive for 100% uptime, we cannot guarantee uninterrupted access to our services."
    ]
  },
  {
    icon: Users,
    title: "User Responsibilities",
    content: [
      "**Legal Use Only**: You agree to use our services only for lawful purposes and in accordance with these Terms.",
      "**File Ownership**: You must own or have the necessary rights to any files you process using our tools.",
      "**Data Backup**: You are responsible for maintaining backups of your files. We are not liable for any data loss.",
      "**Security**: You are responsible for the security of your device and files. Ensure you're using our services on secure, malware-free systems."
    ]
  },
  {
    icon: Ban,
    title: "Prohibited Uses",
    content: [
      "You may not use our services to:",
      "• Process files containing illegal, harmful, or malicious content",
      "• Violate any applicable laws or regulations",
      "• Infringe upon intellectual property rights of others",
      "• Attempt to reverse engineer, decompile, or hack our services",
      "• Use automated systems or bots to access our services in a manner that impairs performance",
      "• Misrepresent the source or ownership of processed files"
    ]
  },
  {
    icon: AlertCircle,
    title: "Limitation of Liability",
    content: [
      "**No Warranties**: Our services are provided \"as is\" without any warranties, express or implied.",
      "**Data Loss**: We are not responsible for any data loss or corruption that may occur during file processing.",
      "**Indirect Damages**: We shall not be liable for any indirect, incidental, special, or consequential damages.",
      "**Maximum Liability**: Our total liability shall not exceed the amount you paid for using our services (which is currently zero).",
      "**Force Majeure**: We are not liable for any failure to perform due to circumstances beyond our reasonable control."
    ]
  },
  {
    icon: Globe,
    title: "Intellectual Property",
    content: [
      "**Our Content**: All content on AltafToolsHub, including text, graphics, logos, and software, is our property or licensed to us.",
      "**Your Files**: You retain all rights to the files you process. We do not claim any ownership of your content.",
      "**Feedback**: Any feedback or suggestions you provide may be used by us without compensation or attribution.",
      "**Open Source**: Some components of our service use open-source software, subject to their respective licenses."
    ]
  },
  {
    icon: Scale,
    title: "Privacy & Data Protection",
    content: [
      "**Privacy First**: We process all files locally in your browser. Your files never leave your device.",
      "**No Data Collection**: We don't collect, store, or have access to the contents of your files.",
      "**Analytics**: We use privacy-focused analytics to improve our services. No personal data is collected.",
      "**Compliance**: We comply with GDPR and other applicable data protection regulations.",
      "For more details, please refer to our Privacy Policy."
    ]
  },
  {
    icon: Mail,
    title: "Changes & Contact",
    content: [
      "**Terms Updates**: We reserve the right to modify these Terms at any time. Significant changes will be notified on our website.",
      "**Continued Use**: Your continued use of our services after changes constitutes acceptance of the new Terms.",
      "**Severability**: If any provision of these Terms is found invalid, the remaining provisions shall continue in effect.",
      "**Contact Us**: For questions about these Terms, contact us at legal@altaftoolshub.com",
      "**Governing Law**: These Terms are governed by the laws of the jurisdiction where we operate."
    ]
  }
];

const faqs = [
  {
    question: "Can I use AltafToolsHub for commercial purposes?",
    answer: "Yes, our tools are free for both personal and commercial use. However, you must ensure you have the rights to process the files you're working with."
  },
  {
    question: "What happens to my files after processing?",
    answer: "Your files are processed entirely in your browser and never leave your device. Once you close the tab or navigate away, all file data is automatically cleared from memory."
  },
  {
    question: "Are there any file size limits?",
    answer: "File size limits depend on your device's available memory since all processing happens locally. Generally, files up to several hundred MB can be processed on most modern devices."
  },
  {
    question: "Do you store or have access to my files?",
    answer: "No. All file processing happens in your browser using client-side JavaScript. We have no access to your files and cannot see, store, or retrieve them."
  }
];

export default function TermsConditions() {
  useSEO({
    title: "Terms & Conditions - AltafToolsHub | Service Agreement",
    description: "Read our terms of service for using AltafToolsHub's privacy-focused file tools. Understand your rights and responsibilities.",
    path: "/terms"
  });

  return (
    <div className="min-h-screen pattern-bg">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6">
              <ScrollText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-lg text-muted-foreground">
              Please read these terms carefully before using our services
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Effective Date: January 1, 2024
            </p>
          </div>

          {/* Quick Summary */}
          <Card className="glass mb-8 p-6 border-2 border-primary/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Quick Summary
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Free to use for personal and commercial purposes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>All processing happens in your browser - we never see your files</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>You retain all rights to your files</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Service provided "as is" without warranties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>We respect your privacy and comply with data protection laws</span>
              </li>
            </ul>
          </Card>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="glass p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                        <div className="space-y-3">
                          {section.content.map((paragraph, pIndex) => (
                            <p 
                              key={pIndex} 
                              className="text-muted-foreground leading-relaxed"
                              dangerouslySetInnerHTML={{ 
                                __html: paragraph
                                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-medium">$1</strong>')
                                  .replace(/^• /gm, '<span class="ml-4">• </span>')
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* FAQs Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                >
                  <Card className="glass p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Acceptance Notice */}
          <Card className="glass mt-8 p-6 bg-primary/5 border-primary/20">
            <h3 className="text-xl font-semibold mb-3">Acceptance of Terms</h3>
            <p className="text-muted-foreground leading-relaxed">
              By using AltafToolsHub, you acknowledge that you have read, understood, and agree to be 
              bound by these Terms and Conditions. If you do not agree with any part of these terms, 
              please do not use our services. We reserve the right to update these terms at any time, 
              and your continued use constitutes acceptance of any changes.
            </p>
          </Card>

          {/* Contact Section */}
          <div className="text-center mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
            <Scale className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Legal Questions?</h3>
            <p className="text-muted-foreground mb-4">
              Contact our legal team for any questions about these terms.
            </p>
            <a 
              href="mailto:legal@altaftoolshub.com" 
              className="text-primary hover:underline font-medium"
              data-testid="link-legal-email"
            >
              legal@altaftoolshub.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}