import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { allTools, toolCategories } from "@/lib/tools-data";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Star, 
  Sparkles, 
  ArrowRight,
  Check,
  Clock,
  Filter,
  Grid3x3,
  List,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HowItWorksSection } from "@/components/seo/tool-features";
import { ToolFAQ } from "@/components/seo/tool-faq";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ToolCard = ({ tool, view }: { tool: any; view: 'grid' | 'list' }) => {
  const Icon = tool.icon;
  
  const cardContent = (
    <motion.div
      whileHover={tool.available ? { scale: 1.02, y: -3 } : {}}
      whileTap={tool.available ? { scale: 0.98 } : {}}
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "relative h-full transition-all duration-300 cursor-pointer group overflow-hidden",
        view === 'grid' ? "p-6 min-h-[240px]" : "p-5",
        "hover:shadow-xl hover:border-primary/30",
        !tool.available && "opacity-60 cursor-not-allowed hover:opacity-60"
      )} data-testid={`tool-card-${tool.id}`}>
        {/* Background Gradient */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500",
          "bg-gradient-to-br",
          tool.color
        )} style={{ opacity: 0.03 }}></div>
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {tool.new && (
            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30 text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              New
            </Badge>
          )}
          {tool.popular && (
            <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
              <Star className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
          {!tool.available && (
            <Badge variant="secondary" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Soon
            </Badge>
          )}
        </div>
        
        {view === 'grid' ? (
          <div className="relative">
            {/* Icon with gradient background */}
            <div className={cn(
              "w-14 h-14 mb-4 rounded-xl flex items-center justify-center",
              "bg-gradient-to-br",
              tool.color,
              "shadow-lg"
            )}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            
            {/* Content */}
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
              {tool.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {tool.description}
            </p>
            
            {/* Extended Description for SEO and better UX */}
            <div className="text-xs text-muted-foreground/80 space-y-1">
              {tool.features && tool.features.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tool.features.slice(0, 3).map((feature: string, index: number) => (
                    <span key={index} className="inline-flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-500" />
                      <span>{feature}</span>
                    </span>
                  ))}
                </div>
              )}
              {tool.category && (
                <p className="text-xs opacity-70 mt-2">
                  Category: {toolCategories.find(c => c.id === tool.category)?.name}
                </p>
              )}
            </div>
            
            {/* Action Button */}
            {tool.available && (
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
              "bg-gradient-to-br",
              tool.color,
              "shadow-md"
            )}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {tool.description}
              </p>
            </div>
            
            {/* Arrow */}
            {tool.available && (
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
  
  return tool.available ? (
    <Link href={tool.href}>{cardContent}</Link>
  ) : (
    cardContent
  );
};

export default function AllToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'status'>('category');
  
  // Filter and sort tools
  const filteredTools = useMemo(() => {
    let tools = allTools;
    
    // Filter by search query
    if (searchQuery) {
      tools = tools.filter(tool => 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      tools = tools.filter(tool => tool.category === selectedCategory);
    }
    
    // Sort tools
    switch (sortBy) {
      case 'name':
        tools = [...tools].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'status':
        tools = [...tools].sort((a, b) => {
          if (a.available === b.available) return 0;
          return a.available ? -1 : 1;
        });
        break;
      case 'category':
      default:
        // Keep original order (grouped by category)
        break;
    }
    
    return tools;
  }, [searchQuery, selectedCategory, sortBy]);
  
  // Group tools by category for display
  const groupedTools = useMemo(() => {
    if (sortBy !== 'category' || selectedCategory !== 'all') {
      return null;
    }
    
    const groups: Record<string, typeof allTools> = {};
    filteredTools.forEach(tool => {
      if (!groups[tool.category]) {
        groups[tool.category] = [];
      }
      groups[tool.category].push(tool);
    });
    
    return groups;
  }, [filteredTools, sortBy, selectedCategory]);
  
  const availableToolsCount = allTools.filter(t => t.available).length;
  const totalToolsCount = allTools.length;
  
  return (
    <div className="min-h-screen relative">
      {/* Hero background gradient */}
      <div className="absolute inset-0 hero-gradient -z-10" />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/30">
              <Sparkles className="w-3 h-3 mr-1" />
              {availableToolsCount} Tools Available • {totalToolsCount - availableToolsCount} Coming Soon
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">All Tools</span> at Your Fingertips
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Explore our complete collection of privacy-first tools. Every tool processes your files locally 
              in your browser - nothing is ever uploaded to servers.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tools... (e.g., PDF, compress, convert)"
                  className="pl-12 pr-4 py-6 text-lg rounded-xl bg-background/80 backdrop-blur-sm border-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-tools"
                />
              </div>
            </div>
            
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]" data-testid="select-category">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {toolCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.tools.length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Sort By */}
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[180px]" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">By Category</SelectItem>
                  <SelectItem value="name">By Name</SelectItem>
                  <SelectItem value="status">By Status</SelectItem>
                </SelectContent>
              </Select>
              
              {/* View Mode */}
              <div className="flex items-center gap-2 border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                  data-testid="button-view-grid"
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                  data-testid="button-view-list"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Tools Grid/List */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {groupedTools && sortBy === 'category' && selectedCategory === 'all' ? (
              // Grouped by Category View
              <motion.div 
                key="grouped"
                className="space-y-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {toolCategories.map((category) => {
                  const categoryTools = groupedTools[category.id] || [];
                  if (categoryTools.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="space-y-6">
                      <div className="flex items-center gap-3">
                        <category.icon className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">{category.name}</h2>
                        <Badge variant="secondary" className="ml-2">
                          {categoryTools.length} tools
                        </Badge>
                      </div>
                      
                      <div className={cn(
                        viewMode === 'grid' 
                          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                          : "space-y-3"
                      )}>
                        {categoryTools.map((tool) => (
                          <ToolCard key={tool.id} tool={tool} view={viewMode} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              // Flat View
              <motion.div 
                key="flat"
                className={cn(
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-3"
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} view={viewMode} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* No Results */}
          {filteredTools.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-xl text-muted-foreground">
                No tools found matching your criteria. Try adjusting your filters.
              </p>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Tool Highlights section can be added later */}
      
      {/* How It Works */}
      <HowItWorksSection
        toolName="All Tools"
        steps={[
          {
            number: 1,
            title: "Browse Tools",
            description: "Explore our collection of 60+ tools organized by category",
            icon: Search
          },
          {
            number: 2,
            title: "Select Your Tool",
            description: "Click on any available tool to start using it instantly",
            icon: Grid3x3
          },
          {
            number: 3,
            title: "Process Locally",
            description: "All processing happens in your browser for 100% privacy",
            icon: Check
          }
        ]}
      />
      
      {/* FAQ Section */}
      <ToolFAQ
        toolName="All Tools"
        toolPath="/all-tools"
        faqs={[
          {
            question: "Are all tools free to use?",
            answer: "Yes! All available tools on AltafToolsHub are completely free to use with no hidden charges or subscriptions."
          },
          {
            question: "Do I need to create an account?",
            answer: "No account needed! All tools work instantly without any sign-up or login requirements."
          },
          {
            question: "Is my data safe?",
            answer: "Absolutely! All file processing happens locally in your browser. Your files never leave your device or get uploaded to any server."
          },
          {
            question: "When will more tools be available?",
            answer: "We're constantly working on new tools! Check back regularly or follow us for updates on new tool releases."
          },
          {
            question: "Can I use these tools on mobile?",
            answer: "Yes! All our tools are responsive and work on mobile devices, tablets, and desktop computers."
          }
        ]}
      />
    </div>
  );
}