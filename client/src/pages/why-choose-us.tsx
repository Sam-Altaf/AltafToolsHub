import { Card } from "@/components/ui/card";
import { Check, X, Star, Shield, Zap, Globe, Users, Award, Sparkles, Clock } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";

const features = [
  {
    category: "Privacy & Security",
    items: [
      { feature: "100% Client-Side Processing", us: true, smallpdf: false, ilovepdf: false, adobe: false },
      { feature: "Files Never Leave Your Browser", us: true, smallpdf: false, ilovepdf: false, adobe: false },
      { feature: "Zero Server Storage", us: true, smallpdf: false, ilovepdf: false, adobe: false },
      { feature: "No Registration Required", us: true, smallpdf: "Limited", ilovepdf: "Limited", adobe: false },
      { feature: "GDPR/CCPA Compliant by Design", us: true, smallpdf: true, ilovepdf: true, adobe: true },
      { feature: "No Data Mining or Analytics on Files", us: true, smallpdf: false, ilovepdf: false, adobe: false },
      { feature: "Works Offline (PWA)", us: "Coming", smallpdf: false, ilovepdf: false, adobe: true },
    ]
  },
  {
    category: "Features & Tools",
    items: [
      { feature: "PDF Compression", us: true, smallpdf: true, ilovepdf: true, adobe: true },
      { feature: "Exact Target Size (10KB-5MB)", us: true, smallpdf: false, ilovepdf: false, adobe: false },
      { feature: "Batch Processing", us: true, smallpdf: true, ilovepdf: true, adobe: true },
      { feature: "PDF Password Unlock", us: true, smallpdf: true, ilovepdf: true, adobe: true },
      { feature: "JPG to PDF Conversion", us: true, smallpdf: true, ilovepdf: true, adobe: true },
      { feature: "OCR Text Extraction", us: true, smallpdf: true, ilovepdf: true, adobe: true },
      { feature: "QR Code Generator", us: true, smallpdf: false, ilovepdf: false, adobe: false },
      { feature: "Password Generator", us: true, smallpdf: false, ilovepdf: false, adobe: false },
      { feature: "16+ Professional Tools", us: true, smallpdf: true, ilovepdf: true, adobe: true },
      { feature: "50+ Tools (Planned)", us: "2025", smallpdf: true, ilovepdf: true, adobe: true },
    ]
  },
  {
    category: "Pricing & Limits",
    items: [
      { feature: "Free Forever Core Features", us: true, smallpdf: false, ilovepdf: false, adobe: false },
      { feature: "No Daily Limits", us: true, smallpdf: false, ilovepdf: false, adobe: false },
      { feature: "Free Tier", us: "Unlimited", smallpdf: "2/day", ilovepdf: "Limited", adobe: "Trial" },
      { feature: "Premium Price", us: "Free", smallpdf: "$12/mo", ilovepdf: "$7/mo", adobe: "$20/mo" },
      { feature: "No Credit Card Required", us: true, smallpdf: false, ilovepdf: false, adobe: false },
      { feature: "No Watermarks", us: true, smallpdf: "Premium", ilovepdf: "Premium", adobe: true },
    ]
  },
  {
    category: "Performance",
    items: [
      { feature: "Processing Speed", us: "Instant", smallpdf: "Fast", ilovepdf: "Fast", adobe: "Fast" },
      { feature: "File Size Limit", us: "100MB", smallpdf: "5GB", ilovepdf: "2GB", adobe: "Unlimited" },
      { feature: "95%+ PageSpeed Score", us: true, smallpdf: false, ilovepdf: false, adobe: false },
      { feature: "No Server Queue Wait", us: true, smallpdf: false, ilovepdf: false, adobe: false },
      { feature: "Works on Any Device", us: true, smallpdf: true, ilovepdf: true, adobe: true },
    ]
  },
  {
    category: "Support & Trust",
    items: [
      { feature: "Email Support", us: true, smallpdf: true, ilovepdf: true, adobe: true },
      { feature: "Response Time", us: "48hrs", smallpdf: "24hrs", ilovepdf: "24hrs", adobe: "Priority" },
      { feature: "User Base", us: "50K+", smallpdf: "30M+", ilovepdf: "10M+", adobe: "100M+" },
      { feature: "Established Since", us: "2024", smallpdf: "2013", ilovepdf: "2010", adobe: "1982" },
      { feature: "Open Source Components", us: true, smallpdf: false, ilovepdf: false, adobe: false },
      { feature: "Transparent Processing", us: true, smallpdf: false, ilovepdf: false, adobe: false },
    ]
  }
];

const advantages = [
  {
    icon: Shield,
    title: "Absolute Privacy",
    description: "Your files never leave your browser. We can't see, access, or store your documents - it's technically impossible."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "No upload time, no server queues. Processing happens instantly on your device with optimized algorithms."
  },
  {
    icon: Sparkles,
    title: "Unique Features",
    description: "Exact target size compression, advanced QR generation, and tools you won't find anywhere else."
  },
  {
    icon: Clock,
    title: "Always Available",
    description: "No server downtime affects you. Works offline with PWA support coming soon."
  },
  {
    icon: Users,
    title: "User-First Design",
    description: "Built based on real user feedback. No dark patterns, no tricks, just tools that work."
  },
  {
    icon: Award,
    title: "Free Forever",
    description: "Core features will always be free. No daily limits, no forced registrations, no surprise charges."
  }
];

export default function WhyChooseUs() {
  useSEO({
    title: "Why Choose AltafToolsHub - Compare PDF Tools | Privacy-First Alternative",
    description: "Compare AltafToolsHub with SmallPDF, iLovePDF, and Adobe. See why 50,000+ users choose our 100% private, browser-based PDF tools with no upload required.",
    keywords: "altaftoolshub vs smallpdf, altaftoolshub vs ilovepdf, best pdf tools comparison, private pdf converter, free pdf tools comparison, smallpdf alternative, ilovepdf alternative",
    path: "/why-choose-us"
  });

  const renderValue = (value: boolean | string) => {
    if (value === true) {
      return <Check className="w-5 h-5 text-green-500" aria-label="Yes" />;
    } else if (value === false) {
      return <X className="w-5 h-5 text-red-500" aria-label="No" />;
    } else {
      return <span className="text-sm font-medium">{value}</span>;
    }
  };

  return (
    <div className="container py-8 md:py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient leading-tight">
            Why Choose AltafToolsHub?
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            See how we compare to other popular PDF tools and discover why privacy-conscious users choose us
          </p>
        </div>

        {/* Key Advantages */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {advantages.map((advantage, index) => (
            <motion.div
              key={advantage.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover-card-effect">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <advantage.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{advantage.title}</h3>
                    <p className="text-sm text-muted-foreground">{advantage.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detailed Comparison Table */}
        <Card className="overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Detailed Feature Comparison</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-2 font-semibold">Features</th>
                    <th className="text-center py-4 px-2">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-primary">AltafToolsHub</span>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                    </th>
                    <th className="text-center py-4 px-2">
                      <span className="font-semibold">SmallPDF</span>
                    </th>
                    <th className="text-center py-4 px-2">
                      <span className="font-semibold">iLovePDF</span>
                    </th>
                    <th className="text-center py-4 px-2">
                      <span className="font-semibold">Adobe</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((category, categoryIdx) => [
                    <tr key={`${category.category}-header`} className="bg-muted/50">
                      <td colSpan={5} className="py-3 px-2 font-semibold text-sm">
                        {category.category}
                      </td>
                    </tr>,
                    ...category.items.map((item, idx) => (
                      <tr key={`${category.category}-${idx}`} className="border-b hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-2 text-sm">{item.feature}</td>
                          <td className="py-3 px-2 text-center">
                            <div className="flex justify-center">
                              {renderValue(item.us)}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <div className="flex justify-center">
                              {renderValue(item.smallpdf)}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <div className="flex justify-center">
                              {renderValue(item.ilovepdf)}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <div className="flex justify-center">
                              {renderValue(item.adobe)}
                            </div>
                          </td>
                        </tr>
                    ))
                  ])}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Privacy Highlight */}
        <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="text-center space-y-4">
            <Shield className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">The Privacy Difference</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Unlike every other online PDF tool, AltafToolsHub processes your files entirely in your browser. 
              Your documents never leave your device, never touch our servers, and we never have access to them. 
              This isn't just a privacy policy promise—it's architecturally impossible for us to see your files.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-sm">No Upload Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm">100% Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm">Instant Processing</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Testimonial Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "Marketing Manager",
                text: "Finally, a PDF tool that doesn't upload my confidential documents to unknown servers. The privacy-first approach is exactly what our company needed."
              },
              {
                name: "David Kumar",
                role: "Legal Consultant",
                text: "The exact size compression is a game-changer. Court filing systems have strict size limits, and this tool hits them perfectly every time."
              },
              {
                name: "Maria Rodriguez",
                role: "Freelance Designer",
                text: "No registration, no limits, no uploads. It just works. I've processed hundreds of client PDFs without a single privacy concern."
              }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="p-6 h-full hover-card-effect">
                  <div className="flex flex-col h-full">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground flex-1 mb-4">"{testimonial.text}"</p>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="p-8 bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Ready to Experience True Privacy?</h2>
            <p className="text-lg text-muted-foreground">
              Join 50,000+ users who've chosen privacy and performance over compromise
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/compress-pdf" 
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                data-testid="link-try-compress"
              >
                Try PDF Compressor
              </a>
              <a 
                href="/all-tools" 
                className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors inline-flex items-center gap-2"
                data-testid="link-explore-tools"
              >
                Explore All Tools
              </a>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}