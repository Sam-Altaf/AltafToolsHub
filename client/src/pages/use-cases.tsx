import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  GraduationCap,
  Users,
  Home,
  Building2,
  Heart,
  ShieldCheck,
  Globe,
  FileText,
  Image,
  QrCode,
  Lock,
  Zap,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Award,
  BookOpen,
  Camera,
  Mail,
  Presentation,
  Scale,
  Newspaper,
  ShoppingBag,
  Plane,
  Clock
} from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";

const UseCases = () => {
  useSEO({
    title: "Use Cases - Real-World Applications | AltafToolsHub",
    description: "Discover how professionals, students, businesses, and individuals use AltafToolsHub for document management, image conversion, QR codes, and more.",
    path: "/use-cases",
    keywords: "PDF tools use cases, document management, file conversion, business tools, education tools, personal productivity"
  });

  const industries = [
    {
      id: "business",
      title: "Business & Enterprise",
      icon: Briefcase,
      description: "Streamline document workflows and enhance productivity",
      useCases: [
        {
          title: "Contract Management",
          description: "Compress large contract PDFs for email, merge multiple documents, and remove sensitive pages before sharing.",
          tools: ["Compress PDF", "Merge PDF", "Remove Pages"],
          benefits: ["50% faster document sharing", "Secure handling of confidential data", "No vendor lock-in"]
        },
        {
          title: "Sales & Marketing Materials",
          description: "Convert product images to PDF catalogs, add watermarks to protect intellectual property, and compress for web distribution.",
          tools: ["JPG to PDF", "Watermark PDF", "Compress PDF"],
          benefits: ["Professional presentation materials", "Brand protection", "Optimized file sizes"]
        },
        {
          title: "HR Documentation",
          description: "Process employee documents, extract specific pages from handbooks, and organize onboarding materials.",
          tools: ["Extract Pages", "Organize PDF", "Merge PDF"],
          benefits: ["Streamlined onboarding", "Compliant document handling", "Zero data exposure risk"]
        },
        {
          title: "Financial Reports",
          description: "Compile quarterly reports, add page numbers for reference, and compress for stakeholder distribution.",
          tools: ["Merge PDF", "Add Page Numbers", "Compress PDF"],
          benefits: ["Professional formatting", "Easy navigation", "Quick distribution"]
        }
      ]
    },
    {
      id: "education",
      title: "Education & Research",
      icon: GraduationCap,
      description: "Enhance learning materials and research documentation",
      useCases: [
        {
          title: "Thesis & Dissertation Preparation",
          description: "Merge chapters, add page numbers, compress for submission, and extract specific sections for review.",
          tools: ["Merge PDF", "Add Page Numbers", "Extract Pages"],
          benefits: ["Meeting submission requirements", "Easy chapter management", "Version control"]
        },
        {
          title: "Course Material Creation",
          description: "Convert lecture slides to PDF, combine readings, add watermarks to protect original content.",
          tools: ["JPG to PDF", "Merge PDF", "Watermark PDF"],
          benefits: ["Organized course packs", "Copyright protection", "Student-friendly formats"]
        },
        {
          title: "Research Paper Management",
          description: "Extract relevant pages from journals, organize references, compress for online submission.",
          tools: ["Extract Pages", "Organize PDF", "Compress PDF"],
          benefits: ["Efficient literature review", "Meeting journal requirements", "Easy collaboration"]
        },
        {
          title: "Student Assignments",
          description: "Combine multiple assignments, convert handwritten notes to PDF, compress for submission portals.",
          tools: ["Merge PDF", "JPG to PDF", "Compress PDF"],
          benefits: ["Meeting file size limits", "Professional presentation", "Easy submission"]
        }
      ]
    },
    {
      id: "legal",
      title: "Legal & Compliance",
      icon: Scale,
      description: "Secure document handling for sensitive legal materials",
      useCases: [
        {
          title: "Case File Management",
          description: "Organize evidence documents, extract relevant pages, remove confidential sections before filing.",
          tools: ["Organize PDF", "Extract Pages", "Remove Pages"],
          benefits: ["Maintained confidentiality", "Court-ready documents", "Efficient case preparation"]
        },
        {
          title: "Contract Review",
          description: "Unlock password-protected contracts, add annotations, merge amendments and addendums.",
          tools: ["Unlock PDF", "Merge PDF", "Add Page Numbers"],
          benefits: ["Secure document access", "Complete contract packages", "Version tracking"]
        },
        {
          title: "Compliance Documentation",
          description: "Compile regulatory documents, add watermarks for draft versions, compress for archival.",
          tools: ["Merge PDF", "Watermark PDF", "Compress PDF"],
          benefits: ["Audit-ready packages", "Version control", "Efficient storage"]
        },
        {
          title: "Client Communications",
          description: "Remove sensitive pages from documents, compress for email, protect with passwords.",
          tools: ["Remove Pages", "Compress PDF", "Password Generator"],
          benefits: ["Client privacy protection", "Secure transmission", "Professional presentation"]
        }
      ]
    },
    {
      id: "healthcare",
      title: "Healthcare & Medical",
      icon: Heart,
      description: "HIPAA-compliant document processing for medical professionals",
      useCases: [
        {
          title: "Patient Records Management",
          description: "Extract specific test results, remove identifying information, compress for telemedicine platforms.",
          tools: ["Extract Pages", "Remove Pages", "Compress PDF"],
          benefits: ["HIPAA compliance", "Patient privacy", "Efficient sharing"]
        },
        {
          title: "Medical Imaging",
          description: "Convert medical images to PDF reports, merge with patient notes, compress for electronic health records.",
          tools: ["JPG to PDF", "Merge PDF", "Compress PDF"],
          benefits: ["Complete patient files", "EHR compatibility", "Reduced storage costs"]
        },
        {
          title: "Insurance Documentation",
          description: "Compile claim documents, remove sensitive pages, organize for submission.",
          tools: ["Merge PDF", "Remove Pages", "Organize PDF"],
          benefits: ["Faster claim processing", "Privacy protection", "Organized submissions"]
        },
        {
          title: "Research Publications",
          description: "Prepare medical research papers, add watermarks to preprints, compress for journal submission.",
          tools: ["Add Page Numbers", "Watermark PDF", "Compress PDF"],
          benefits: ["Publication-ready formats", "Intellectual property protection", "Meeting submission guidelines"]
        }
      ]
    },
    {
      id: "personal",
      title: "Personal & Home Use",
      icon: Home,
      description: "Simplify everyday document tasks for personal needs",
      useCases: [
        {
          title: "Tax Preparation",
          description: "Merge receipts and forms, organize by category, compress for electronic filing or storage.",
          tools: ["Merge PDF", "Organize PDF", "Compress PDF"],
          benefits: ["Organized records", "Easy filing", "Secure storage"]
        },
        {
          title: "Travel Documents",
          description: "Combine tickets and reservations, generate QR codes for quick access, compress for mobile storage.",
          tools: ["Merge PDF", "QR Generator", "Compress PDF"],
          benefits: ["All documents in one place", "Quick access at airports", "Offline availability"]
        },
        {
          title: "Photo Albums",
          description: "Convert family photos to PDF albums, add page numbers, create digital scrapbooks.",
          tools: ["JPG to PDF", "Add Page Numbers", "Merge PDF"],
          benefits: ["Preserved memories", "Easy sharing", "Professional presentation"]
        },
        {
          title: "Home Documentation",
          description: "Organize warranties and manuals, extract important pages, create home maintenance binders.",
          tools: ["Organize PDF", "Extract Pages", "Merge PDF"],
          benefits: ["Easy reference", "Organized records", "Quick access to information"]
        }
      ]
    },
    {
      id: "creative",
      title: "Creative & Media",
      icon: Camera,
      description: "Tools for designers, photographers, and content creators",
      useCases: [
        {
          title: "Portfolio Creation",
          description: "Convert artwork to PDF portfolios, add watermarks for protection, compress for online sharing.",
          tools: ["JPG to PDF", "Watermark PDF", "Compress PDF"],
          benefits: ["Professional presentation", "Copyright protection", "Easy distribution"]
        },
        {
          title: "Client Presentations",
          description: "Merge design concepts, add page numbers for reference, compress for email delivery.",
          tools: ["Merge PDF", "Add Page Numbers", "Compress PDF"],
          benefits: ["Organized proposals", "Professional delivery", "Quick client review"]
        },
        {
          title: "Photography Proofs",
          description: "Create PDF contact sheets, add watermarks to proofs, generate QR codes for gallery access.",
          tools: ["JPG to PDF", "Watermark PDF", "QR Generator"],
          benefits: ["Protected proofs", "Easy client review", "Streamlined workflow"]
        },
        {
          title: "Event Documentation",
          description: "Compile event photos, create digital albums, compress for social media sharing.",
          tools: ["JPG to PDF", "Merge PDF", "Compress PDF"],
          benefits: ["Complete event records", "Easy sharing", "Social media ready"]
        }
      ]
    }
  ];

  const commonScenarios = [
    {
      icon: Mail,
      title: "Email Attachments",
      description: "Reduce file sizes to meet email limits without sacrificing quality",
      solution: "Use our PDF Compressor to reduce files by up to 90% while maintaining readability"
    },
    {
      icon: Globe,
      title: "Web Publishing",
      description: "Optimize PDFs for fast web loading and better user experience",
      solution: "Compress and optimize PDFs to improve page load times and SEO rankings"
    },
    {
      icon: Presentation,
      title: "Presentations",
      description: "Convert slides and images into professional PDF presentations",
      solution: "Use JPG to PDF converter to create polished presentation materials"
    },
    {
      icon: ShieldCheck,
      title: "Secure Sharing",
      description: "Share documents safely without exposing sensitive information",
      solution: "Remove sensitive pages and process locally for maximum security"
    },
    {
      icon: Building2,
      title: "Office Workflows",
      description: "Streamline document management without expensive software",
      solution: "Use our free tools as alternatives to costly desktop applications"
    },
    {
      icon: ShoppingBag,
      title: "E-commerce",
      description: "Create product catalogs and process order documentation",
      solution: "Convert product images to PDF catalogs and organize invoices efficiently"
    }
  ];

  const benefits = [
    {
      title: "No Software Installation",
      description: "Access all tools directly from your browser on any device",
      icon: Globe
    },
    {
      title: "Complete Privacy",
      description: "Files never leave your device - 100% client-side processing",
      icon: Lock
    },
    {
      title: "Instant Processing",
      description: "No upload wait times - get results in seconds",
      icon: Zap
    },
    {
      title: "Free Forever",
      description: "Professional tools without subscriptions or hidden costs",
      icon: Award
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
              <TrendingUp className="w-3 h-3 mr-1" />
              Real-World Applications
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Use Cases for Every Need
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover how professionals, students, and businesses use AltafToolsHub 
              to solve real document challenges every day.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/all-tools">
                <Button size="lg" className="gap-2" data-testid="button-explore-tools">
                  Explore All Tools
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-how-it-works">
                  How It Works
                  <BookOpen className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industry Use Cases */}
      <section className="py-16">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Industry-Specific Solutions</h2>
            <p className="text-lg text-muted-foreground">
              Tailored workflows for every professional need
            </p>
          </motion.div>

          <Tabs defaultValue="business" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full mb-8">
              {industries.map((industry) => (
                <TabsTrigger 
                  key={industry.id} 
                  value={industry.id}
                  className="flex flex-col gap-1 h-auto py-3"
                  data-testid={`tab-${industry.id}`}
                >
                  <industry.icon className="w-5 h-5" />
                  <span className="text-xs">{industry.title.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {industries.map((industry) => (
              <TabsContent key={industry.id} value={industry.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-8 text-center">
                    <h3 className="text-2xl font-bold mb-2">{industry.title}</h3>
                    <p className="text-muted-foreground">{industry.description}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {industry.useCases.map((useCase, index) => (
                      <Card key={index} className="p-6 hover:shadow-lg transition-all">
                        <h4 className="text-xl font-semibold mb-3">{useCase.title}</h4>
                        <p className="text-muted-foreground mb-4">{useCase.description}</p>
                        
                        <div className="mb-4">
                          <div className="text-sm font-medium mb-2">Tools Used:</div>
                          <div className="flex flex-wrap gap-2">
                            {useCase.tools.map((tool, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium mb-2">Key Benefits:</div>
                          <ul className="space-y-1">
                            {useCase.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Common Scenarios */}
      <section className="py-16 bg-muted/30">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Common Scenarios We Solve</h2>
            <p className="text-lg text-muted-foreground">
              Quick solutions for everyday document challenges
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonScenarios.map((scenario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <scenario.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{scenario.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
                      <p className="text-sm text-primary font-medium">{scenario.solution}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-muted-foreground">
              Real examples of how our tools make a difference
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: "Reduced our document processing time by 75%. No more waiting for uploads or dealing with file size limits.",
                author: "Marketing Agency",
                metric: "75% Time Saved",
                icon: Clock
              },
              {
                quote: "Perfect for handling sensitive legal documents. The fact that files never leave our computers gives us peace of mind.",
                author: "Law Firm",
                metric: "100% Privacy",
                icon: ShieldCheck
              },
              {
                quote: "Saved thousands on software licenses. These free tools do everything our expensive desktop software did.",
                author: "Small Business",
                metric: "$5000+ Saved",
                icon: TrendingUp
              }
            ].map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-primary/10">
                      <story.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary">{story.metric}</div>
                  </div>
                  <p className="text-muted-foreground italic mb-4">"{story.quote}"</p>
                  <p className="text-sm font-medium">— {story.author}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose AltafToolsHub?</h2>
            <p className="text-lg text-muted-foreground">
              The advantages that set us apart
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 h-full text-center hover:shadow-lg transition-all">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Start Solving Your Document Challenges Today
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who trust AltafToolsHub for secure, 
                efficient document processing. No registration, no downloads, just instant results.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/all-tools">
                  <Button size="lg" className="gap-2" data-testid="button-get-started">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="gap-2" data-testid="button-learn-more">
                    Learn How It Works
                    <BookOpen className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  No Credit Card Required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Works on All Devices
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  100% Browser-Based
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default UseCases;