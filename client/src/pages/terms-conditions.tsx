import { Card } from "@/components/ui/card";
import { ScrollText, Shield, AlertCircle, Users, Globe, Scale, Ban, Mail } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";

const sections = [
  {
    icon: ScrollText,
    title: "Terms of Service Agreement",
    content: [
      "Welcome to AltafToolsHub. These Terms and Conditions (\"Terms\") govern your use of our website and services.",
      "By accessing or using AltafToolsHub, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our services.",
      "Our services are provided \"as is\" for personal and commercial use, subject to the restrictions outlined in these Terms.",
      "**Acceptance of Terms**: By using our services, you represent that you are at least 16 years old and have the legal capacity to enter into these Terms. If you are using our services on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.",
      "**Modifications to Terms**: We reserve the right to modify these Terms at any time. We will notify users of significant changes via a notice on our website. Your continued use of our services after such modifications constitutes acceptance of the updated Terms. We encourage you to review these Terms periodically.",
      "**Account-Free Service**: Our services do not require account creation or registration, reflecting our privacy-first approach. However, you are still bound by these Terms when using our services."
    ]
  },
  {
    icon: Shield,
    title: "Service Description & Scope",
    content: [
      "**Client-Side Processing**: AltafToolsHub provides browser-based file manipulation tools that process files entirely on your device using JavaScript and WebAssembly technologies. No files are uploaded to our servers, ensuring complete privacy and security.",
      "**Free to Use**: All tools are currently provided free of charge for both personal and commercial use. We reserve the right to introduce premium features in the future, but existing free tools will remain free.",
      "**No Registration Required**: You can use our services without creating an account or providing personal information. This anonymous usage model is core to our privacy-first approach.",
      "**Service Availability**: While we strive for 100% uptime, we cannot guarantee uninterrupted access. Services may be temporarily unavailable due to maintenance, updates, or factors beyond our control.",
      "**Tool Capabilities**: Our tools include PDF compression, unlocking, conversion, merging, splitting, and manipulation; image to PDF conversion; QR code generation; password generation; text extraction from images; and various other file processing utilities.",
      "**Browser Requirements**: Our services require a modern web browser with JavaScript enabled. We support the latest versions of Chrome, Firefox, Safari, and Edge. Older browsers may not be compatible with all features.",
      "**Processing Limits**: While we don't impose strict file size limits, very large files (over 100MB) may experience performance issues depending on your device's capabilities. Processing speed depends on your device's specifications, not our servers.",
      "**No Cloud Storage**: We do not provide cloud storage services. All processed files must be downloaded immediately after processing. Files are not retained in any form."
    ]
  },
  {
    icon: Scale,
    title: "Service Sustainability Model",
    content: [
      "**Free Forever with Ads Model**: AltafToolsHub operates on a 'Free Forever with Ads' model. Our core tools will always remain free to use, supported by advertising revenue to cover server, bandwidth, and maintenance costs.",
      "**Advertising Support**: We may display advertisements to support our free tools and cover operational costs including server infrastructure, bandwidth expenses, development and maintenance, security updates, and customer support. Advertising helps ensure our tools remain accessible to everyone without charge.",
      "**Future Premium Features**: We reserve the right to introduce optional premium features if operational costs require it. Potential scenarios for premium tiers include: excessive server costs from rapid growth (e.g., 100,000+ daily users), enterprise-specific features requiring dedicated resources, advanced AI-powered tools with high computational costs, priority processing for time-sensitive needs, and bulk processing capabilities beyond standard limits.",
      "**Commitment to Free Access**: Basic features and standard usage will always remain free. We will never paywall existing free tools. Any premium features will be optional additions, not replacements. The majority of users will be able to use our tools without payment.",
      "**Transparency in Pricing**: If we introduce premium features, we will announce changes at least 30 days in advance, clearly distinguish free vs. premium features, maintain grandfathering for any promised free features, and provide clear value propositions for any paid offerings.",
      "**Sustainable Operations**: This model ensures long-term availability of our services, continuous improvement and new feature development, maintenance of high performance and reliability, ability to scale with user growth, and commitment to user privacy and security."
    ]
  },
  {
    icon: Users,
    title: "User Responsibilities & Obligations",
    content: [
      "**Legal Use Only**: You agree to use our services only for lawful purposes and in accordance with these Terms and all applicable local, state, national, and international laws and regulations.",
      "**File Ownership**: You must own or have the necessary rights, licenses, consents, and permissions to any files you process using our tools. You are solely responsible for ensuring you have the right to process, modify, and distribute any files.",
      "**Data Backup**: You are responsible for maintaining backups of your files. We are not liable for any data loss, corruption, or failure to process files. Always keep copies of important files before processing.",
      "**Security**: You are responsible for the security of your device and files. Ensure you're using our services on secure, malware-free systems. We are not responsible for any security breaches on your device.",
      "**Accurate Information**: Any information you provide to us (such as in support requests) must be accurate, current, and complete. You agree to update such information to maintain its accuracy.",
      "**Respect for Others**: You agree not to use our services to process files that could harm, harass, or violate the rights of others, including files containing hate speech, harassment, or discriminatory content.",
      "**Compliance with Laws**: You are responsible for complying with all applicable laws regarding the files you process, including but not limited to copyright laws, privacy laws, and export control laws.",
      "**No Misrepresentation**: You agree not to misrepresent your identity, the source of any files, or your affiliation with any person or entity when using our services.",
      "**Technical Compliance**: You agree not to circumvent, disable, or interfere with security-related features of our services or features that enforce limitations on use.",
      "**Age Requirements**: You must be at least 16 years old to use our services. If you are under 18, you should have parental consent."
    ]
  },
  {
    icon: Ban,
    title: "Prohibited Uses & Restrictions",
    content: [
      "You may not use our services for any of the following purposes:",
      "• **Illegal Content**: Process files containing illegal content including child exploitation material, terrorist content, or material that violates any applicable law",
      "• **Intellectual Property Violation**: Process files that infringe upon copyrights, trademarks, patents, trade secrets, or other intellectual property rights without proper authorization",
      "• **Malicious Content**: Process or create files containing viruses, malware, ransomware, or any harmful code designed to damage or gain unauthorized access to systems",
      "• **Privacy Violations**: Process files containing personal information of others without their consent, including social security numbers, credit card information, or private communications",
      "• **System Abuse**: Use automated systems, bots, or scripts to access our services in a manner that could impair performance or circumvent limitations",
      "• **Reverse Engineering**: Attempt to reverse engineer, decompile, disassemble, or discover the source code of our services, except where prohibited by law",
      "• **Misrepresentation**: Misrepresent the source, ownership, or authenticity of processed files, or use our services to create fraudulent documents",
      "• **Commercial Exploitation**: Resell, sublicense, or commercialize our services without explicit written permission",
      "• **Security Testing**: Conduct security testing, penetration testing, or vulnerability scanning without prior written permission",
      "• **Harassment**: Process content that harasses, threatens, or intimidates individuals or groups",
      "• **Spam**: Use our services to create or process spam, chain letters, or unsolicited commercial communications",
      "• **Export Control Violations**: Process files subject to export controls or government classification without proper authorization",
      "Violation of these prohibitions may result in immediate termination of access and may be reported to law enforcement."
    ]
  },
  {
    icon: AlertCircle,
    title: "Disclaimers & Limitation of Liability",
    content: [
      "**No Warranties**: Our services are provided \"AS IS\" and \"AS AVAILABLE\" without any warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement.",
      "**Data Loss**: We are not responsible for any data loss, corruption, or failure that may occur during file processing. You acknowledge that file processing carries inherent risks and accept full responsibility for any outcomes.",
      "**Indirect Damages**: In no event shall AltafToolsHub be liable for any indirect, incidental, special, punitive, exemplary, or consequential damages, including loss of profits, data, use, goodwill, or other intangible losses.",
      "**Maximum Liability**: Our total cumulative liability for any claims shall not exceed $100 or the amount you paid us in the past 12 months (likely zero), whichever is greater.",
      "**Force Majeure**: We are not liable for any failure or delay due to circumstances beyond our reasonable control, including acts of God, natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, strikes, or shortages.",
      "**No Professional Advice**: Our services are not intended to provide legal, financial, medical, or other professional advice. Information provided should not be relied upon as a substitute for professional consultation.",
      "**Third-Party Actions**: We are not responsible for the actions or inactions of third parties, including internet service providers, device manufacturers, or browser developers.",
      "**Accuracy of Processing**: While we strive for accuracy, we do not guarantee that file processing will be error-free or meet your specific requirements. You are responsible for reviewing all processed files.",
      "**Time-Sensitive Materials**: We are not liable for any damages resulting from delays in processing time-sensitive materials.",
      "**Jurisdiction Limitations**: Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability, so some of the above limitations may not apply to you."
    ]
  },
  {
    icon: Globe,
    title: "Intellectual Property Rights",
    content: [
      "**Our Content**: All content on AltafToolsHub, including text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of AltafToolsHub or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws.",
      "**Your Files**: You retain all rights, title, and interest in and to the files you process using our services. We do not claim any ownership rights in your files. By using our services, you grant us only the minimal rights necessary to provide the services (processing within your browser).",
      "**Limited License**: Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use our services for lawful purposes. This license does not include any right to resell our services, use for commercial exploitation without permission, or use data mining tools.",
      "**Trademarks**: \"AltafToolsHub\" and our logos are our trademarks. You may not use our trademarks without our prior written consent, except to describe our services factually.",
      "**Open Source Components**: Our services may incorporate open source software components subject to separate license terms. We comply with all applicable open source licenses.",
      "**Feedback and Suggestions**: Any feedback, suggestions, ideas, or other information you provide regarding our services becomes our exclusive property. We may use, copy, modify, publish, or redistribute the feedback for any purpose without compensation to you.",
      "**Copyright Infringement**: If you believe that any content on our site infringes your copyright, please contact us at altaftoolshub@gmail.com with details. We respect intellectual property rights and will respond promptly.",
      "**DMCA Compliance**: We comply with the Digital Millennium Copyright Act (DMCA) and will respond to valid takedown notices."
    ]
  },
  {
    icon: Scale,
    title: "Governing Law, Disputes & General Provisions",
    content: [
      "**Governing Law**: These Terms are governed by and construed in accordance with applicable laws, without regard to conflict of law principles. You agree that any legal action or proceeding shall be brought exclusively in courts of competent jurisdiction.",
      "**Dispute Resolution**: We encourage you to contact us first to resolve any disputes amicably. Disputes shall first be subject to good faith negotiation for 30 days. If negotiation fails, disputes may be resolved through binding arbitration where permitted by law.",
      "**Class Action Waiver**: You agree to bring any claims against us only in your individual capacity and not as a plaintiff or class member in any purported class or representative action.",
      "**Severability**: If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect.",
      "**Entire Agreement**: These Terms, together with our Privacy Policy, constitute the entire agreement between you and AltafToolsHub regarding the use of our services.",
      "**Assignment**: You may not assign or transfer your rights under these Terms without our prior written consent. We may assign our rights and obligations without restriction.",
      "**Waiver**: Our failure to enforce any provision of these Terms shall not be deemed a waiver of such provision or our right to enforce it in the future.",
      "**Survival**: Provisions that by their nature should survive termination shall survive, including intellectual property, disclaimers, and limitations of liability.",
      "**Electronic Communications**: You consent to receive communications from us electronically and agree that all agreements, notices, and disclosures satisfy any legal requirement that such communications be in writing.",
      "**Statute of Limitations**: You agree that any claim arising out of or related to these Terms must be filed within one year after such claim arose, or be forever barred.",
      "**International Use**: We make no representation that our services are appropriate or available for use in all locations. You are responsible for compliance with local laws.",
      "**Indemnification**: You agree to indemnify, defend, and hold harmless AltafToolsHub from any claims, damages, losses, and expenses arising from your use of our services or violation of these Terms."
    ]
  },
  {
    icon: Globe,
    title: "Website Analytics & Tracking",
    content: [
      "**Google Analytics**: We use Google Analytics to collect anonymous information about how visitors use our website. This helps us understand user behavior, identify popular tools, and improve our services. Google Analytics collects data such as pages visited, time spent on pages, browser type, device information, and geographic region (country/city level only).",
      "**Purpose of Analytics**: We use analytics data solely to improve our website's functionality, performance, and user experience. We analyze usage patterns to identify technical issues, understand which tools are most valuable to users, optimize page load times and performance, and plan new features based on user needs.",
      "**Data Collection Notice**: By using our website, you consent to the collection of anonymous analytics data. This data cannot be used to personally identify you. We have configured Google Analytics with IP anonymization enabled, no remarketing or advertising features, no demographic data collection, and no user-ID tracking.",
      "**Third-Party Services**: Google Analytics is provided by Google LLC, which has its own privacy policy and terms. We do not control Google's data practices. Google may use the collected data in accordance with its own privacy policy. You can learn more about Google's practices at https://policies.google.com/privacy.",
      "**Opting Out**: You have several options to opt out of analytics tracking: Install the Google Analytics Opt-out Browser Add-on (https://tools.google.com/dlpage/gaoptout), use private/incognito browsing modes, enable Do Not Track in your browser (we honor DNT signals), or use privacy-focused browsers or extensions that block tracking scripts.",
      "**Future Advertising Policy**: While we currently do not display advertisements, we reserve the right to introduce advertising in the future to support our free services. If we implement advertising: we will update these Terms and our Privacy Policy 30 days in advance, advertisements will be clearly marked and distinguishable from content, we will not use targeted or behavioral advertising based on your file processing activities, and we will provide options to use the service without advertisements.",
      "**Data Usage for Website Maintenance**: Analytics data helps us maintain and improve our website by identifying and fixing technical issues, optimizing performance for different devices and browsers, understanding traffic patterns to ensure adequate server resources, and prioritizing development of the most-used features.",
      "**Cookie Notice**: Our website uses cookies for analytics purposes. These are small text files stored in your browser that help us understand usage patterns. Analytics cookies are optional and can be blocked without affecting core functionality. See our Privacy Policy for detailed cookie information.",
      "**Transparency Commitment**: We are committed to transparency about our data practices. We will never sell analytics data to third parties, use analytics data to identify individual users, share raw analytics data with advertisers, or use your file processing activities for analytics beyond basic tool usage metrics."
    ]
  },
  {
    icon: Mail,
    title: "Contact Information & Additional Terms",
    content: [
      "**Contact Details**: For any questions about these Terms and Conditions, please contact us at altaftoolshub@gmail.com. Include \"Terms Question\" in the subject line for faster routing.",
      "**Response Time**: We aim to respond to all inquiries within 48-72 business hours. Legal notices and urgent matters receive priority attention.",
      "**Legal Notices**: Any legal notices must be sent to altaftoolshub@gmail.com with \"Legal Notice\" in the subject line. Notice is deemed given 24 hours after email is sent.",
      "**Accessibility**: We are committed to making our services accessible to all users. If you encounter accessibility issues, please contact us so we can address them.",
      "**Export Controls**: You agree to comply with all applicable export and re-export control laws and regulations, including the Export Administration Regulations.",
      "**Government Use**: If you are a government entity, these Terms and related documents are \"Commercial Items\" and you acquire only those rights provided to all other users.",
      "**California Users**: California Civil Code Section 1789.3 requires specific consumer rights information. Contact us for such information.",
      "**Privacy Integration**: Our Privacy Policy is incorporated by reference into these Terms. By using our services, you also agree to our Privacy Policy.",
      "**Updates and Notifications**: We may provide notifications and updates via our website. You are responsible for checking our website regularly for such communications.",
      "**Third-Party Links**: Our services may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of third-party sites.",
      "**No Third-Party Beneficiaries**: These Terms do not create any third-party beneficiary rights except as expressly provided herein.",
      "**Term and Termination**: These Terms remain in effect as long as you use our services. We may terminate or suspend your access immediately for any reason, including breach of these Terms.",
      "**Data Protection**: We comply with GDPR, CCPA, and other applicable data protection regulations. Your files are processed locally and never leave your device.",
      "**Thank You**: Thank you for taking the time to read and understand our Terms. We are committed to providing valuable, privacy-focused tools while maintaining clear and fair terms of use."
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
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-primary">Terms & Conditions</h1>
            <p className="text-lg text-muted-foreground">
              Please read these terms carefully before using our services
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Effective Date: January 20, 2025
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
              href="mailto:altaftoolshub@gmail.com?subject=Legal%20Question%20-%20AltafToolsHub" 
              className="text-primary hover:underline font-medium"
              data-testid="link-legal-email"
            >
              altaftoolshub@gmail.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}