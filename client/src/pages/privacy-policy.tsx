import { Card } from "@/components/ui/card";
import { Shield, Lock, Cookie, Mail, Globe, FileText, Users, Server } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";

const sections = [
  {
    icon: Shield,
    title: "Our Privacy Commitment",
    content: [
      "At AltafToolsHub, your privacy is our top priority. We've built our entire platform around the principle of maximum privacy protection.",
      "All file processing happens directly in your browser using WebAssembly and JavaScript. Your files never leave your device, and we never have access to them.",
      "This privacy policy explains how we handle any information we collect and your rights regarding that information."
    ]
  },
  {
    icon: Server,
    title: "Data Collection & Processing",
    content: [
      "**Client-Side Processing Only**: All file manipulation, conversion, and compression happens entirely in your browser. We do not upload, store, or have access to any files you process using our tools.",
      "**No Server Storage**: Since all processing is client-side, your files are never transmitted to our servers. They remain on your device throughout the entire process.",
      "**Automatic Deletion**: Processed files exist only in your browser's memory during the session and are automatically cleared when you close the tab or navigate away."
    ]
  },
  {
    icon: Cookie,
    title: "Cookie Usage",
    content: [
      "We use cookies to improve your experience on our website. Here's how:",
      "**Necessary Cookies**: Essential for the website to function properly. These include session cookies and security cookies.",
      "**Analytics Cookies**: Help us understand how visitors interact with our website. We use privacy-focused analytics that don't track individual users.",
      "**Functional Cookies**: Remember your preferences such as theme selection (light/dark mode) and language settings.",
      "You can manage your cookie preferences at any time through the cookie consent banner or your browser settings."
    ]
  },
  {
    icon: Users,
    title: "Information We Collect",
    content: [
      "**Anonymous Analytics**: We collect aggregated, anonymous data about page views, tool usage, and general traffic patterns to improve our services.",
      "**Error Reports**: If our tools encounter an error, we may collect anonymous error logs to help us fix issues. These never contain your file data.",
      "**Voluntary Information**: Information you provide when contacting us via email for support or feedback.",
      "**No Personal Data from Files**: We never collect, see, or store any data from the files you process."
    ]
  },
  {
    icon: Lock,
    title: "Your Rights & Control",
    content: [
      "**Access**: You have the right to request information about any data we have about you (which is minimal by design).",
      "**Deletion**: You can request deletion of any information we might have about you.",
      "**Opt-Out**: You can opt out of analytics cookies at any time through our cookie preferences.",
      "**Data Portability**: You can request a copy of any data we have about you in a portable format.",
      "**No Account Required**: We don't require accounts or registration, further protecting your privacy."
    ]
  },
  {
    icon: Globe,
    title: "Third-Party Services",
    content: [
      "**Analytics**: We use privacy-focused analytics services that don't track individual users or use cookies for tracking.",
      "**CDN**: We use content delivery networks to serve our website faster, but they don't have access to your processed files.",
      "**No Advertising**: We don't use any advertising networks or tracking pixels.",
      "**No Social Media Tracking**: We don't use social media plugins that could track your activity."
    ]
  },
  {
    icon: FileText,
    title: "Data Security",
    content: [
      "**HTTPS Only**: Our entire website is served over HTTPS, ensuring encrypted connections.",
      "**Browser Sandbox**: File processing happens within your browser's security sandbox, isolated from other websites.",
      "**No Data Transmission**: Since files aren't uploaded, there's no risk of interception during transmission.",
      "**Open Source Libraries**: We use well-maintained, open-source libraries for file processing."
    ]
  },
  {
    icon: Mail,
    title: "Contact & Updates",
    content: [
      "**Privacy Questions**: For any privacy-related questions or concerns, contact us at privacy@altaftoolshub.com",
      "**Policy Updates**: We'll notify users of any significant changes to this privacy policy through a prominent notice on our website.",
      "**Response Time**: We aim to respond to all privacy-related inquiries within 48 hours.",
      "**Transparency Reports**: We commit to transparency about any data requests we receive (though we have no user data to share)."
    ]
  }
];

export default function PrivacyPolicy() {
  useSEO({
    title: "Privacy Policy - AltafToolsHub | Your Privacy is Our Priority",
    description: "Learn how AltafToolsHub protects your privacy with 100% client-side file processing. No uploads, no tracking, complete privacy.",
    path: "/privacy"
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Your privacy matters. Learn how we protect it.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: January 2024
            </p>
          </div>

          {/* Key Privacy Features */}
          <Card className="glass mb-8 p-6 border-2 border-primary/20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Client-side processing</p>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">0</div>
                <p className="text-sm text-muted-foreground">Files uploaded to servers</p>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">Never</div>
                <p className="text-sm text-muted-foreground">Your data leaves your device</p>
              </div>
            </div>
          </Card>

          {/* Privacy Policy Sections */}
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

          {/* GDPR Compliance Notice */}
          <Card className="glass mt-8 p-6 bg-primary/5 border-primary/20">
            <h3 className="text-xl font-semibold mb-3">GDPR Compliance</h3>
            <p className="text-muted-foreground leading-relaxed">
              AltafToolsHub is fully compliant with the General Data Protection Regulation (GDPR). 
              We respect the privacy rights of all users, regardless of location. Our client-side 
              processing approach means we collect minimal data by design, giving you complete control 
              over your information.
            </p>
          </Card>

          {/* Contact Section */}
          <div className="text-center mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Questions About Privacy?</h3>
            <p className="text-muted-foreground mb-4">
              We're here to help with any privacy concerns you may have.
            </p>
            <a 
              href="mailto:privacy@altaftoolshub.com" 
              className="text-primary hover:underline font-medium"
              data-testid="link-privacy-email"
            >
              privacy@altaftoolshub.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}