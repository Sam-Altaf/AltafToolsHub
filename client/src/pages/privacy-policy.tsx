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
      "This privacy policy explains how we handle any information we collect and your rights regarding that information.",
      "**Our Core Promise**: We believe in absolute transparency about data practices. We collect the absolute minimum data necessary to provide our services, and we never sell, trade, or share your information with third parties for marketing purposes.",
      "**Privacy by Design**: Every feature we build starts with privacy considerations. We actively choose architectures and technologies that minimize data collection and maximize user control.",
      "**Zero-Knowledge Architecture**: Our tools are designed so that we have zero knowledge of your file contents, file names, or what you do with our tools. This isn't just a promise - it's technically impossible for us to access your data."
    ]
  },
  {
    icon: Server,
    title: "Data Collection & Processing",
    content: [
      "**Client-Side Processing Only**: All file manipulation, conversion, and compression happens entirely in your browser. We do not upload, store, or have access to any files you process using our tools.",
      "**No Server Storage**: Since all processing is client-side, your files are never transmitted to our servers. They remain on your device throughout the entire process.",
      "**Automatic Deletion**: Processed files exist only in your browser's memory during the session and are automatically cleared when you close the tab or navigate away.",
      "**Browser Isolation**: All processing occurs within your browser's sandbox environment, completely isolated from our servers and other users. This ensures that even if our website were compromised, your files would remain secure.",
      "**WebAssembly Security**: We use WebAssembly for performance-critical operations, which runs in a secure sandbox with no access to your system beyond what you explicitly provide.",
      "**No Background Processing**: We don't use service workers or background scripts that could access your data when you're not actively using our tools.",
      "**Memory Management**: Our tools actively manage memory usage and clear all temporary data structures immediately after processing completes. This prevents any residual data from remaining in browser memory.",
      "**Processing Transparency**: You can verify our client-side processing claim by monitoring your network traffic - you'll see no file uploads to our servers."
    ]
  },
  {
    icon: Cookie,
    title: "Cookie Usage & Local Storage",
    content: [
      "We use cookies and local storage minimally and transparently. Here's our complete cookie policy:",
      "**Necessary Cookies (Always Active)**: Session management cookies that expire when you close your browser, security tokens for CSRF protection, and cookie consent preferences (stored for 365 days).",
      "**Analytics Cookies (Optional)**: We use privacy-focused analytics that create anonymous usage statistics, aggregated page view tracking, tool usage metrics (which tools are used, not what you do with them), and performance monitoring for page load times.",
      "**Functional Cookies (Optional)**: These remember your theme preference (light/dark mode), language settings if applicable, default tool preferences, and recently used tools for quick access.",
      "**Local Storage Usage**: We never store file data in local storage. Only UI preferences and non-sensitive settings are saved. All local storage can be cleared via browser settings, and we provide a 'Clear All Data' option.",
      "**Third-Party Cookies**: We do NOT use any third-party tracking cookies, advertising cookies, or social media cookies. We respect Do Not Track browser signals.",
      "**Cookie Control**: You can manage all cookies through our consent banner, your browser settings, or by using Do Not Track signals which we fully honor."
    ]
  },
  {
    icon: Users,
    title: "Information We Collect",
    content: [
      "We collect minimal information, and here's exactly what that means:",
      "**Anonymous Analytics Data**: Page views and navigation paths (which pages you visit), tool usage frequency (which tools are used, not what you do with them), browser type and version for compatibility, operating system for optimization, screen resolution for responsive design, referrer URL (how you found us), country/region from IP address (then IP is discarded), and session duration.",
      "**Technical Information**: JavaScript error logs (not your data), performance metrics like page load times, feature usage statistics (which buttons are clicked), and browser capabilities for feature detection.",
      "**What We DON'T Collect**: Your name or identity, email address (unless you contact us), IP addresses (only used for country detection then deleted), device identifiers or fingerprints, any content from your files, file names or metadata, browsing history from other sites, or precise location data.",
      "**Voluntary Information**: Support requests via email (kept for 90 days), feedback and suggestions, bug reports and feature requests. If you contact us, we only keep the minimum information needed to respond to your inquiry.",
      "**Aggregation and Anonymization**: All analytics data is aggregated and anonymized. We cannot identify individual users from this data, and we don't attempt to re-identify anonymized data."
    ]
  },
  {
    icon: Lock,
    title: "Your Rights Under GDPR & CCPA",
    content: [
      "We respect your privacy rights under all applicable laws, including GDPR (European Union) and CCPA (California):",
      "**Right to Access (GDPR Article 15)**: Request a copy of any personal data we hold about you. Receive information about how we process your data. Get details about data sharing (we don't share your data). Response provided within 30 days.",
      "**Right to Rectification (GDPR Article 16)**: Correct any inaccurate personal information. Complete any incomplete personal data. Update outdated information.",
      "**Right to Erasure - 'Right to be Forgotten' (GDPR Article 17)**: Request complete deletion of your personal data. We'll delete all data unless legally required to retain. Confirmation of deletion provided within 72 hours.",
      "**Right to Restrict Processing (GDPR Article 18)**: Limit how we use your data. Suspend processing while concerns are addressed. Maintain data without using it.",
      "**Right to Data Portability (GDPR Article 20)**: Receive your data in a structured, machine-readable format. Transfer your data to another service. Direct transfer where technically feasible.",
      "**Right to Object (GDPR Article 21)**: Object to processing for marketing (we don't do marketing), automated decision-making (we don't use this), or profiling (we don't profile users).",
      "**California Privacy Rights (CCPA)**: Right to know what information is collected. Right to delete personal information. Right to opt-out of sale (we never sell data). Right to non-discrimination for exercising rights.",
      "**How to Exercise Your Rights**: Email altaftoolshub@gmail.com with subject 'Privacy Rights Request'. Include the type of request and any relevant details. We may ask to verify your identity for security. Response within 30 days (GDPR) or 45 days (CCPA).",
      "**Children's Privacy**: Our service is not directed to children under 16. We don't knowingly collect data from children. Parents can contact us to remove any data."
    ]
  },
  {
    icon: Globe,
    title: "Third-Party Services & Data Sharing",
    content: [
      "We carefully limit third-party services to protect your privacy:",
      "**Content Delivery Network (CDN)**: We use CDN services like Cloudflare for faster loading. They only serve static website assets (CSS, JavaScript, images) and have no access to your file data. CDN providers only see anonymous page requests.",
      "**Analytics Service**: We use privacy-focused analytics (not Google Analytics) that provide anonymous, aggregated usage statistics. No personal identifiers or tracking cookies are used. Data is aggregated and cannot identify individuals.",
      "**Web Hosting**: Our secure hosting provider serves only static files. No user data or files are stored on servers. The host has no access to or knowledge of your file processing.",
      "**Email Service (Support Only)**: Email provider for altaftoolshub@gmail.com handles only support communications. Emails are retained for 90 days then deleted. No automated email marketing or tracking.",
      "**What We DON'T Use**: No Google Analytics or similar invasive tracking. No Facebook Pixel or social media tracking. No advertising networks or ad tracking. No third-party cookies. No session recording tools. No heat mapping or user behavior tracking. No A/B testing tools that track individuals. No customer data platforms or CRMs.",
      "**Data Sharing Policy**: We NEVER sell your data. We NEVER share data for marketing purposes. We NEVER provide data to data brokers. We only share data when legally required by valid court order (we've never been required to). Any service we use must sign data processing agreements ensuring your privacy.",
      "**International Data Transfers**: As a browser-based service, your data stays on your device. No international data transfers occur for file processing. Website assets may be served from global CDN locations for speed."
    ]
  },
  {
    icon: FileText,
    title: "Data Security Measures",
    content: [
      "We implement multiple layers of security to protect your privacy:",
      "**Infrastructure Security**: HTTPS/TLS 1.3 encryption for all connections. HTTP Strict Transport Security (HSTS) enabled. Content Security Policy (CSP) headers to prevent XSS attacks. X-Frame-Options to prevent clickjacking. Regular security audits and updates. Subresource Integrity (SRI) for external resources.",
      "**Application Security**: All file processing in isolated browser sandbox. No server-side file processing or storage. Input validation and sanitization. Protection against XSS and injection attacks. Regular dependency updates and security patches. Secure coding practices and code reviews.",
      "**Data Protection**: Files never leave your device - zero transmission risk. No data interception possible as no uploads occur. Automatic memory clearing after processing. No persistent storage of file data. No caching of sensitive information. Browser sandbox isolation from other sites.",
      "**Open Source Security**: Using well-maintained, audited libraries like PDF.js and pdf-lib. Regular security updates for all dependencies. Transparency in our processing methods. Community-reviewed code where applicable. No proprietary black-box processing.",
      "**Incident Response Plan**: 24-hour response time for security issues. Immediate patching of critical vulnerabilities. Transparent communication about any incidents. Security incident log (none to date). Regular security training for our team.",
      "**Compliance & Standards**: GDPR compliant data handling practices. CCPA compliant privacy practices. OWASP security guidelines followed. Privacy by Design and Default principles. ISO 27001 best practices adopted where applicable.",
      "**User Security Recommendations**: Always use HTTPS connection (enforced by our site). Keep your browser updated for latest security patches. Don't process sensitive files on public computers. Clear browser cache after processing sensitive documents."
    ]
  },
  {
    icon: Mail,
    title: "Contact, Updates & Accountability",
    content: [
      "**Privacy Contact Information**: Email: altaftoolshub@gmail.com for all privacy inquiries. Response time: Within 48 hours for general inquiries, within 30 days for formal rights requests. Please include 'Privacy' in subject line for faster routing.",
      "**Data Protection Practices**: While not legally required for our scale, we voluntarily follow enterprise-level data protection practices. Annual privacy reviews and audits. Regular staff training on privacy practices. Privacy impact assessments for new features.",
      "**Policy Update Procedures**: This policy is reviewed quarterly and updated as needed. Significant changes are announced via website banner for 30 days. Previous policy versions are available upon request. Major changes trigger email notifications if you've contacted us.",
      "**Transparency Commitments**: Annual transparency report starting 2025. Disclosure of any government data requests (none to date). Security incident disclosure within 72 hours of discovery (none to date). Regular updates on our privacy practices and improvements.",
      "**International Compliance**: EU Users: Full GDPR compliance with all rights respected. UK Users: UK GDPR compliance maintained. California Users: Full CCPA compliance including new CPRA requirements. Canadian Users: PIPEDA compliance. Australian Users: Privacy Act 1988 compliance. We apply the highest privacy standard globally regardless of your location.",
      "**Legal Basis for Processing (GDPR)**: Legitimate Interest for improving our services and fixing bugs. Consent for optional analytics cookies. Legal Obligation if ever required by law. No processing for marketing or profiling purposes.",
      "**Data Retention Periods**: Analytics data: Aggregated and kept for 12 months. Error logs: 30 days then permanently deleted. Support emails: 90 days then permanently deleted. No file data ever retained. Cookie preferences: 365 days. All data deletion is permanent and irreversible.",
      "**Dispute Resolution**: First contact us directly - we aim to resolve all issues within 30 days. EU users can lodge complaints with their supervisory authority. California users have Attorney General complaint rights. We support alternative dispute resolution where appropriate.",
      "**Privacy Policy Acceptance**: By using our services, you acknowledge you've read and understood this policy. Continued use after policy updates constitutes acceptance of changes. You can stop using our services at any time if you disagree with our policies."
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
              Last updated: January 20, 2025
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
              href="mailto:altaftoolshub@gmail.com?subject=Privacy%20Question%20-%20AltafToolsHub" 
              className="text-primary hover:underline font-medium"
              data-testid="link-privacy-email"
            >
              altaftoolshub@gmail.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}