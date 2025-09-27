import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Lock, Image, Shield, Zap, Check, ArrowRight, 
  Search, Star, Users, Globe, Download, TrendingUp,
  Clock, ChevronRight, Sparkles, QrCode, Calculator,
  BookOpen, FileCode, Type, PenTool, Book, CloudOff, Gift
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoIcon } from "@/components/logo";
import { ContactSupportSection } from "@/components/contact-support";
import { 
  toolCategories, 
  allTools, 
  popularTools, 
  availableTools, 
  comingSoonTools,
  platformStats,
  Tool 
} from "@/lib/tools-data";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Shield,
    title: "100% Privacy",
    description: "All processing happens in your browser. Your files never leave your device.",
    gradient: "from-purple-500 to-blue-500"
  },
  {
    icon: CloudOff,
    title: "No Upload Required", 
    description: "Everything works offline. No server uploads mean instant processing.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant processing with no delays or server wait times.",
    gradient: "from-cyan-500 to-teal-500"
  },
  {
    icon: Gift,
    title: "Free Forever",
    description: "Professional-grade tools, completely free. No limits, no subscriptions.",
    gradient: "from-teal-500 to-green-500"
  }
];

const stats = [
  { value: "60+", label: "Total Tools", description: "All file types covered", icon: FileText },
  { value: platformStats.availableTools.toString(), label: "Available Now", description: "Ready to use", icon: Check },
  { value: "100%", label: "Privacy", description: "Browser-based", icon: Shield },
  { value: "Free", label: "Forever", description: "No hidden costs", icon: Star }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Manager",
    content: "Finally, PDF tools that respect my privacy! No more worrying about sensitive documents being uploaded to unknown servers.",
    rating: 5,
    avatar: "SC"
  },
  {
    name: "David Kumar",
    role: "Software Developer",
    content: "The client-side processing is brilliant. Fast, secure, and works offline once loaded. Exactly what I needed.",
    rating: 5,
    avatar: "DK"
  },
  {
    name: "Emily Rodriguez",
    role: "Academic Researcher",
    content: "I use the PDF compressor daily for research papers. The precision in file size targeting is unmatched.",
    rating: 5,
    avatar: "ER"
  }
];

// Enhanced Tool Card Component with animations
const ToolCard = ({ tool }: { tool: Tool }) => {
  const Icon = tool.icon;
  
  const cardContent = (
    <motion.div
      className="h-full"
      whileHover={tool.available ? { scale: 1.02, y: -3 } : {}}
      whileTap={tool.available ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card className={cn(
        "tool-card relative h-full p-6 transition-all duration-300 group min-h-[280px] rounded-lg",
        tool.available 
          ? "cursor-pointer hover:shadow-xl focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2" 
          : "cursor-not-allowed opacity-70",
        "border border-transparent hover:border-primary/20"
      )} data-testid={`tool-card-${tool.id}`}>
        {/* New/Popular/Coming Soon Badge */}
        {(tool.new || tool.popular || !tool.available) && (
          <div className="absolute top-3 right-3">
            {tool.new && (
              <Badge className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white border-0 font-semibold shadow-lg">
                <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
                New
              </Badge>
            )}
            {tool.popular && (
              <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white border-0 font-semibold shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            )}
            {!tool.available && (
              <Badge className="bg-gradient-to-r from-gray-600 to-gray-700 text-white border-0 font-medium shadow-md">
                <Clock className="w-3 h-3 mr-1 animate-pulse" />
                Coming Soon
              </Badge>
            )}
          </div>
        )}
        
        {/* Enhanced Icon */}
        <motion.div 
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all shadow-lg",
            "bg-gradient-to-br", tool.color,
            tool.available && "group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-3"
          )}
          whileHover={tool.available ? { rotate: [0, -3, 3, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-8 h-8 text-white drop-shadow-lg" />
        </motion.div>
        
        {/* Content */}
        <h3 className="font-semibold text-lg sm:text-xl mb-3 flex items-center gap-2 line-clamp-1">
          {tool.title}
          {tool.available && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="inline-block"
            >
              <ChevronRight className="w-5 h-5 text-primary" />
            </motion.div>
          )}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300 mb-3">
          {tool.extendedDescription || tool.description}
        </p>
        {tool.features && (
          <div className="space-y-1 text-sm text-muted-foreground/70">
            {tool.features.slice(0, 2).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )}
        
        {!tool.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-center p-4">
              <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Coming Soon</p>
              <p className="text-xs text-muted-foreground mt-1">This tool is being developed</p>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );

  if (!tool.available) {
    return (
      <div className="h-full rounded-lg" data-testid={`tool-card-${tool.id}`}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={`/${tool.id}`} className="h-full block rounded-lg">
      {cardContent}
    </Link>
  );
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("pdf");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter tools based on search and category
  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
                           tool.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const filteredAvailableTools = filteredTools.filter(tool => tool.available);
  const filteredComingSoonTools = filteredTools.filter(tool => !tool.available);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden pt-20 pb-24 sm:pt-32 sm:pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20"></div>
        
        <div className="container relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Logo with enhanced animation */}
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15,
                delay: 0.2 
              }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24">
                <LogoIcon className="w-full h-full" />
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Privacy-First File Tools
            </motion.h1>
            
            <motion.p 
              className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Professional file processing tools that work entirely in your browser. 
              <span className="text-primary font-semibold"> Your files never leave your device.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/compress-pdf">
                  <Button size="lg" className="hero-btn-primary text-white px-10 py-6 text-lg font-semibold shadow-2xl" data-testid="button-try-compressor">
                    <motion.div
                      className="mr-2"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Zap className="w-5 h-5" />
                    </motion.div>
                    Try PDF Compressor
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  className="hero-btn-secondary px-10 py-6 text-lg font-semibold"
                  onClick={() => {
                    document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  data-testid="button-browse-tools"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Browse All Tools
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-primary/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm font-medium">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Available Tools Section */}
      <section id="tools-section" className="py-24 bg-muted/30">
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Available Tools</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start using these professional-grade tools right now. More coming soon!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {availableTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: index * 0.1 }}
              >
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/all-tools">
              <Button size="lg" variant="outline" className="px-8 py-3">
                <ArrowRight className="w-5 h-5 mr-2" />
                View All {allTools.length} Tools
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose AltafToolsHub?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tools with enterprise-level security, completely free
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 h-full text-center group hover:shadow-lg transition-all duration-300">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto",
                    "bg-gradient-to-br", feature.gradient
                  )}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Trusted by Professionals</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our users are saying about their experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <ContactSupportSection />
    </div>
  );
}