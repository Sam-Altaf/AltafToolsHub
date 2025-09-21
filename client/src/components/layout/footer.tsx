import { useState, useEffect } from "react";
import { Logo } from "@/components/logo";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Shield, 
  Lock, 
  Mail, 
  FileText, 
  Image, 
  QrCode,
  Calculator,
  Twitter,
  Linkedin,
  Github,
  ChevronRight,
  ChevronDown,
  Heart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const productLinks = [
  { name: "PDF Compressor", href: "/compress-pdf", icon: FileText },
  { name: "PDF Unlocker", href: "/unlock-pdf", icon: Lock },
  { name: "JPG to PDF", href: "/jpg-to-pdf", icon: Image },
  { name: "QR Code Generator", href: "/qr-generator", icon: QrCode },
  // { name: "Calculator", href: "/calculator", icon: Calculator }, // Tool not yet available
  { name: "All Tools", href: "/all-tools", icon: ChevronRight }
];

const resourceLinks = [
  { name: "FAQ", href: "/faq" },
  { name: "Blog", href: "/blog" },
  // { name: "Documentation", href: "/docs" }, // Coming soon
  { name: "How It Works", href: "/#features-section" },
  { name: "Use Cases", href: "/#use-cases" }
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms-conditions" },
  // { name: "Cookie Policy", href: "/cookies" }, // Coming soon
  // { name: "GDPR Compliance", href: "/gdpr" } // Coming soon
];

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/altaftoolshub", ariaLabel: "Follow us on Twitter" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/altaftoolshub", ariaLabel: "Connect on LinkedIn" },
  { name: "GitHub", icon: Github, href: "https://github.com/altaftoolshub", ariaLabel: "View our GitHub" }
];

export default function Footer() {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return (
    <footer className="bg-muted/50 dark:bg-gray-900 border-t border-border transition-colors duration-300">
      <div className="container-section py-12 lg:py-16">
        {/* Trust/Privacy Messaging */}
        <motion.div 
          className="text-center mb-12 pb-12 border-b border-border/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground dark:text-foreground">Your Privacy is Our Priority</h3>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All file processing happens directly in your browser. No uploads, no data storage, no tracking.
            Your files never leave your device.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Badge variant="secondary" className="px-3 py-1">
              <Lock className="w-3 h-3 mr-1" />
              100% Client-Side
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Shield className="w-3 h-3 mr-1" />
              No Data Storage
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Heart className="w-3 h-3 mr-1" />
              Free Forever
            </Badge>
          </div>
        </motion.div>

        {/* Main Footer Content - 4 Column Desktop, Stacked Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Product Column - Collapsible on Mobile */}
          <Collapsible
            open={!isMobile || openSections.includes('tools')}
            onOpenChange={() => setOpenSections(prev => 
              prev.includes('tools') 
                ? prev.filter(s => s !== 'tools')
                : [...prev, 'tools']
            )}
            className="group"
          >
            <div className="flex sm:block items-center justify-between mb-4">
              <h4 className="font-semibold text-lg flex items-center gap-2 text-foreground dark:text-foreground">
                <FileText className="w-5 h-5 text-primary" />
                Popular Tools
              </h4>
              <CollapsibleTrigger className="sm:hidden p-3 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-3" aria-label="Toggle tools section">
                <ChevronDown className={cn(
                  "w-5 h-5 transition-transform",
                  openSections.includes('tools') && "rotate-180"
                )} />
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-3 sm:!block">
              {productLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                      data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, '-')}`}
                    >
                      <Icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                      <span className="text-sm">{link.name}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all group-hover:translate-x-1" />
                    </Link>
                  </li>
                );
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* Resources Column - Collapsible on Mobile */}
          <Collapsible
            open={!isMobile || openSections.includes('resources')}
            onOpenChange={() => setOpenSections(prev => 
              prev.includes('resources') 
                ? prev.filter(s => s !== 'resources')
                : [...prev, 'resources']
            )}
            className="group"
          >
            <div className="flex sm:block items-center justify-between mb-4">
              <h4 className="font-semibold text-lg text-foreground dark:text-foreground">Resources</h4>
              <CollapsibleTrigger className="sm:hidden p-3 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-3" aria-label="Toggle resources section">
                <ChevronDown className={cn(
                  "w-5 h-5 transition-transform",
                  openSections.includes('resources') && "rotate-180"
                )} />
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-3 sm:!block">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Legal Column - Collapsible on Mobile */}
          <Collapsible
            open={!isMobile || openSections.includes('legal')}
            onOpenChange={() => setOpenSections(prev => 
              prev.includes('legal') 
                ? prev.filter(s => s !== 'legal')
                : [...prev, 'legal']
            )}
            className="group"
          >
            <div className="flex sm:block items-center justify-between mb-4">
              <h4 className="font-semibold text-lg text-foreground dark:text-foreground">Legal</h4>
              <CollapsibleTrigger className="sm:hidden p-3 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-3" aria-label="Toggle legal section">
                <ChevronDown className={cn(
                  "w-5 h-5 transition-transform",
                  openSections.includes('legal') && "rotate-180"
                )} />
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-3 sm:!block">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Contact Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-foreground dark:text-foreground">Contact</h4>
            <div className="space-y-4">
              <a 
                href="mailto:support@altaftoolshub.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                data-testid="footer-email"
              >
                <Mail className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                <span>support@altaftoolshub.com</span>
              </a>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-3 text-foreground dark:text-foreground">Follow Us</p>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg bg-muted dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary transition-all flex items-center justify-center group min-w-[44px] min-h-[44px]"
                        aria-label={social.ariaLabel}
                        data-testid={`footer-social-${social.name.toLowerCase()}`}
                      >
                        <Icon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Logo size="sm" variant="full" className="text-primary" />
              <span className="text-sm text-muted-foreground">
                © 2025 AltafToolsHub. All rights reserved.
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for privacy
              </span>
              <span>•</span>
              <span>60+ Free Tools</span>
              <span>•</span>
              <span>No Registration</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}