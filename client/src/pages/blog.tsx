import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen,
  TrendingUp,
  FileText,
  Shield,
  Zap,
  Users,
  ChevronRight,
  Tag,
  Sparkles,
  Bell
} from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { ContactSupportSection } from "@/components/contact-support";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const blogPosts: BlogPost[] = [
  {
    id: "ultimate-pdf-compression-guide",
    title: "The Ultimate Guide to PDF Compression in 2025",
    excerpt: "Learn how to reduce PDF file sizes by up to 90% while maintaining quality. Discover the best techniques for different use cases, from email attachments to web publishing.",
    category: "PDF Tools",
    date: "January 15, 2025",
    readTime: "8 min read",
    tags: ["PDF", "Compression", "File Size", "Tutorial"],
    featured: true,
    icon: FileText
  },
  {
    id: "privacy-first-file-processing",
    title: "Why Privacy-First File Processing Matters More Than Ever",
    excerpt: "Explore the importance of client-side processing and how browser-based tools protect your sensitive documents from data breaches and unauthorized access.",
    category: "Privacy & Security",
    date: "January 12, 2025",
    readTime: "6 min read",
    tags: ["Privacy", "Security", "Client-Side", "Data Protection"],
    featured: true,
    icon: Shield
  },
  {
    id: "image-to-pdf-best-practices",
    title: "Converting Images to PDF: Best Practices and Tips",
    excerpt: "Master the art of converting JPG, PNG, and other image formats to PDF. Learn about resolution, compression, and organization techniques for professional results.",
    category: "Image Tools",
    date: "January 10, 2025",
    readTime: "5 min read",
    tags: ["Images", "PDF", "Conversion", "Quality"],
    icon: FileText
  },
  {
    id: "qr-code-marketing-2025",
    title: "QR Codes in 2025: Marketing Strategies That Work",
    excerpt: "Discover how businesses are leveraging QR codes for contactless payments, digital menus, and customer engagement. Includes case studies and implementation tips.",
    category: "QR Codes",
    date: "January 8, 2025",
    readTime: "7 min read",
    tags: ["QR Codes", "Marketing", "Business", "Digital"],
    icon: Zap
  },
  {
    id: "optimize-pdfs-for-web",
    title: "How to Optimize PDFs for Web Performance",
    excerpt: "Speed up your website by properly optimizing PDF documents. Learn about file size reduction, lazy loading, and SEO best practices for PDF content.",
    category: "Web Optimization",
    date: "January 5, 2025",
    readTime: "6 min read",
    tags: ["SEO", "Web Performance", "PDF", "Optimization"],
    icon: TrendingUp
  },
  {
    id: "document-workflow-automation",
    title: "Streamline Your Document Workflow with Browser Tools",
    excerpt: "Save hours every week by automating repetitive document tasks. Learn how to batch process files and create efficient workflows without expensive software.",
    category: "Productivity",
    date: "January 3, 2025",
    readTime: "5 min read",
    tags: ["Productivity", "Automation", "Workflow", "Efficiency"],
    icon: Users
  },
  {
    id: "pdf-security-features",
    title: "Understanding PDF Security: Encryption and Password Protection",
    excerpt: "A comprehensive guide to PDF security features, including password protection, encryption levels, and best practices for protecting sensitive documents.",
    category: "Security",
    date: "December 28, 2024",
    readTime: "7 min read",
    tags: ["Security", "PDF", "Encryption", "Privacy"],
    icon: Shield
  },
  {
    id: "batch-file-processing",
    title: "Batch Processing Files: Save Time with Bulk Operations",
    excerpt: "Learn how to process multiple files simultaneously. Perfect for teams handling large volumes of documents, images, or data files.",
    category: "Productivity",
    date: "December 25, 2024",
    readTime: "4 min read",
    tags: ["Batch Processing", "Productivity", "Efficiency", "Tools"],
    icon: Zap
  },
  {
    id: "mobile-document-management",
    title: "Mobile Document Management: Working on the Go",
    excerpt: "Tips and tricks for managing documents on mobile devices. Learn about the best practices for file compression, sharing, and organization on smartphones.",
    category: "Mobile",
    date: "December 20, 2024",
    readTime: "5 min read",
    tags: ["Mobile", "Documents", "Productivity", "Tips"],
    icon: FileText
  }
];

const categories = [
  { name: "All Posts", count: blogPosts.length },
  { name: "PDF Tools", count: blogPosts.filter(p => p.category === "PDF Tools").length },
  { name: "Privacy & Security", count: blogPosts.filter(p => p.category.includes("Security")).length },
  { name: "Productivity", count: blogPosts.filter(p => p.category === "Productivity").length },
  { name: "Web Optimization", count: blogPosts.filter(p => p.category === "Web Optimization").length }
];

export default function BlogPage() {
  useSEO({
    title: "Blog - File Processing Tips & Tutorials | AltafToolsHub",
    description: "Expert guides on PDF compression, image conversion, document security, and productivity tips. Learn how to process files efficiently with privacy-first tools.",
    path: "/blog",
    keywords: "blog, tutorials, pdf tips, file processing, document management, privacy tools, productivity"
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen">
      {/* Coming Soon Banner */}
      <motion.section 
        className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-b border-primary/30"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container-section py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-lg font-semibold text-primary">Blog Coming Soon!</span>
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bell className="w-4 h-4" />
              <span>Get notified when we launch our blog with expert tutorials and guides</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container-section">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
              <BookOpen className="w-3 h-3 mr-1" />
              Blog & Tutorials
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Learn & Master File Processing
            </h1>
            <p className="text-lg text-muted-foreground">
              Expert tips, tutorials, and best practices for working with documents and files
            </p>
            <Card className="mt-8 p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                <p className="text-amber-900 dark:text-amber-200 font-medium">
                  We're working on amazing content! Check back soon for in-depth tutorials and guides.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b">
        <div className="container-section">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                data-testid={`blog-category-${category.name.toLowerCase().replace(/\s/g, '-')}`}
              >
                <span className="text-sm font-medium">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12">
          <div className="container-section">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Featured Articles</h2>
              <p className="text-muted-foreground">Popular guides and tutorials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {featuredPosts.map((post, index) => {
                const Icon = post.icon;
                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="p-6 h-full hover:shadow-xl transition-all group cursor-pointer"
                      data-testid={`blog-featured-${post.id}`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <Badge variant="secondary" className="mb-2">
                            {post.category}
                          </Badge>
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts */}
      <section className="py-12 bg-muted/30">
        <div className="container-section">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Latest Articles</h2>
            <p className="text-muted-foreground">Fresh content and tutorials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => {
              const Icon = post.icon;
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="p-6 h-full hover:shadow-lg transition-all group cursor-pointer"
                    data-testid={`blog-post-${post.id}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <div className="flex items-center mt-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Read More</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </motion.article>
              );
            })}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline"
              className="group"
              data-testid="button-load-more"
            >
              Load More Articles
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12">
        <div className="container-section">
          <Card className="p-8 lg:p-12 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
            <div className="text-center max-w-2xl mx-auto">
              <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
              <p className="text-muted-foreground mb-6">
                Get the latest tips and tutorials delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  data-testid="input-newsletter-email"
                />
                <Button className="btn-gradient text-white">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Support Section */}
      <ContactSupportSection />
    </div>
  );
}