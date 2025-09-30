import { useState, memo, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen,
  ChevronRight,
  Tag,
  Search,
  Filter,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";
import { useSEO, generateFAQSchema, generateBreadcrumbSchema } from "@/hooks/use-seo";
import { ContactSupportSection } from "@/components/contact-support";
import { blogPosts, blogCategories } from "@/lib/blog-data-optimized";
import { Input } from "@/components/ui/input";
import { allTools } from "@/lib/tools-data";
import { BlogImageStatic } from "@/components/blog-image";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePosts, setVisiblePosts] = useState(6);

  // Generate FAQ schema for SEO
  const faqItems = [
    {
      question: "How can I compress PDFs without losing quality?",
      answer: "Use intelligent compression tools that apply different compression methods to text and images. Our guide shows you how to reduce file sizes by up to 90% while maintaining perfect text quality."
    },
    {
      question: "What are the best PDF compression settings for 2025?",
      answer: "For email attachments, use 150 DPI and 85% quality. For web publishing, 96 DPI and 80% quality works best. Our comprehensive guide covers all use cases."
    },
    {
      question: "How do I reduce PDF file size for email?",
      answer: "Most email providers limit attachments to 25MB. Compress your PDFs to under 10MB using our free tools or follow our step-by-step guide for various methods."
    },
    {
      question: "Should I use PDF compression or ZIP compression?",
      answer: "PDF compression is better for single documents that need immediate viewing, while ZIP works better for bundling multiple files. Our comparison guide helps you choose."
    }
  ];

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" }
  ];

  useSEO({
    title: "Blog - Expert PDF Tips & Tutorials | AltafToolsHub",
    description: "Learn PDF compression techniques, file optimization strategies, and document management best practices. Expert guides and tutorials for all your PDF needs.",
    path: "/blog",
    keywords: "pdf blog, pdf tutorials, file compression guides, document optimization, pdf tips and tricks, file management blog",
    structuredData: [
      generateFAQSchema(faqItems),
      generateBreadcrumbSchema(breadcrumbItems)
    ]
  });

  // Filter posts based on category and search
  const filteredPosts = blogPosts.filter(post => {
    const categoryMatch = selectedCategory === "All Posts" || post.category === selectedCategory;
    const searchMatch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  // Separate featured and regular posts from ALL filtered posts
  const allFeaturedPosts = filteredPosts.filter(post => post.featured);
  const allRegularPosts = filteredPosts.filter(post => !post.featured);

  // Show all featured posts (or limit if there are too many)
  const maxFeaturedToShow = 4;
  const showAllFeatured = allFeaturedPosts.length <= maxFeaturedToShow;
  const featuredPosts = showAllFeatured ? allFeaturedPosts : allFeaturedPosts.slice(0, maxFeaturedToShow);
  const hasMoreFeatured = !showAllFeatured;

  // Apply pagination only to regular posts
  const regularPosts = allRegularPosts.slice(0, visiblePosts);
  const hasMoreRegularPosts = allRegularPosts.length > visiblePosts;

  const loadMore = () => {
    setVisiblePosts(prev => prev + 6);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container-section">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-primary to-blue-600 text-white border-0 shadow-md">
              <BookOpen className="w-3 h-3 mr-1" />
              Blog & Resources
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              PDF Tips, Guides & Tutorials
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Master PDF compression, optimization, and file management with our expert guides
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
                data-testid="input-blog-search"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b bg-muted/30">
        <div className="container-section">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Filter className="w-5 h-5 text-muted-foreground" />
            {blogCategories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCategory(category.name)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category.name 
                    ? "bg-primary text-white shadow-lg" 
                    : "bg-background hover:bg-primary/10 hover:text-primary border"
                }`}
                data-testid={`blog-category-${category.name.toLowerCase().replace(/\s/g, '-')}`}
              >
                <span className="text-sm font-medium">{category.name}</span>
                <Badge 
                  variant={selectedCategory === category.name ? "secondary" : "outline"} 
                  className="text-xs"
                >
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Featured Articles</h2>
                <p className="text-muted-foreground">In-depth guides and tutorials</p>
              </div>
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Link href={`/blog/${post.slug}`}>
                      <Card 
                        className="h-full hover:shadow-xl transition-all group cursor-pointer border-2 hover:border-primary/50 overflow-hidden"
                        data-testid={`blog-featured-${post.id}`}
                      >
                        {post.thumbnailImage ? (
                          <div className="relative w-full h-56 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                            <BlogImageStatic
                              src={post.thumbnailImage}
                              alt={`${post.title} thumbnail`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-primary to-blue-600 text-white border-0">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        ) : (
                          <div className="relative w-full h-56 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden flex items-center justify-center">
                            <Icon className="w-24 h-24 text-primary/30" />
                            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-primary to-blue-600 text-white border-0">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
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
                            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                          </div>

                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.article>
                );
              })}
            </div>

            {/* See All Featured Button */}
            {hasMoreFeatured && (
              <div className="text-center mt-8">
                <Button 
                  size="lg" 
                  className="group bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
                  onClick={() => {
                    // This would typically navigate to a featured articles page or expand the list
                    // For now, we'll just show all featured articles
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  data-testid="button-see-all-featured"
                >
                  See All Featured Articles ({allFeaturedPosts.length - maxFeaturedToShow} more)
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        </section>
      )}


      {/* Regular Posts */}
      {(regularPosts.length > 0 || allRegularPosts.length > 0) && (
        <section className="py-12 bg-muted/30">
          <div className="container-section">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">
                {selectedCategory === "All Posts" ? "All Articles" : selectedCategory}
              </h2>
              <p className="text-muted-foreground">
                {allRegularPosts.length} {allRegularPosts.length === 1 ? "article" : "articles"} found {searchTerm && `for "${searchTerm}"`}
                {allFeaturedPosts.length > 0 && ` (plus ${allFeaturedPosts.length} featured)`}
              </p>
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
                    <Link href={`/blog/${post.slug}`}>
                      <Card 
                        className="h-full hover:shadow-lg transition-all group cursor-pointer hover:border-primary/50 overflow-hidden"
                        data-testid={`blog-post-${post.id}`}
                      >
                        {post.thumbnailImage ? (
                          <div className="relative w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                            <BlogImageStatic
                              src={post.thumbnailImage}
                              alt={`${post.title} thumbnail`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="relative w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden flex items-center justify-center">
                            <Icon className="w-20 h-20 text-primary/20" />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
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

                          <div className="flex items-center mt-4 text-primary">
                            <span className="text-sm font-medium">Read More</span>
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.article>
                );
              })}
            </div>

            {/* Load More / No Results */}
            {allRegularPosts.length === 0 && allFeaturedPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">
                  No articles found matching your criteria.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Posts");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : hasMoreRegularPosts && (
              <div className="text-center mt-12">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="group"
                  onClick={loadMore}
                  data-testid="button-load-more"
                >
                  Load More Articles ({allRegularPosts.length - visiblePosts} remaining)
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular Topics Section */}
      <section className="py-12">
        <div className="container-section">
          <Card className="p-8 bg-gradient-to-r from-primary/5 via-background to-primary/5">
            <h3 className="text-xl font-bold mb-6 text-center">Popular Topics</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {["PDF Compression", "File Size Reduction", "Email Attachments", "Web Optimization", "Quality Settings", "ZIP vs PDF"].map(topic => (
                <Badge 
                  key={topic} 
                  variant="secondary" 
                  className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-white transition-colors"
                  onClick={() => setSearchTerm(topic.split(' ')[0].toLowerCase())}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Tool Cards Section */}
      <section className="py-12 bg-muted/30">
        <div className="container-section">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-3">Try Our Free Tools</h2>
            <p className="text-muted-foreground">
              Put our guides into practice with these powerful, free online tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allTools
              .filter(tool => tool.available)
              .slice(0, 8)
              .map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={tool.href}>
                      <Card 
                        className="h-full p-6 hover:shadow-lg transition-all cursor-pointer group hover:border-primary/50"
                        data-testid={`tool-card-${tool.id}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} p-2.5 text-white group-hover:scale-110 transition-transform`}>
                            <Icon className="w-full h-full" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold group-hover:text-primary transition-colors">
                                {tool.title}
                              </h3>
                              {tool.popular && (
                                <Badge variant="secondary" className="text-xs">
                                  Popular
                                </Badge>
                              )}
                              {tool.new && (
                                <Badge variant="default" className="text-xs bg-green-500">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-primary">
                          <span className="text-sm font-medium">Use Tool</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
          </div>

          <div className="text-center mt-8">
            <Link href="/all-tools">
              <Button size="lg" variant="outline" className="group">
                View All Tools
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <ContactSupportSection />
    </div>
  );
}