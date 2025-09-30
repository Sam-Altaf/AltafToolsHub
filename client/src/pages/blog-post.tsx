import { useParams, Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight,
  BookOpen,
  User,
  Tag,
  Share2,
  Twitter,
  Linkedin,
  Copy,
  Check,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { useSEO, generateArticleSchema, generateBreadcrumbSchema } from "@/hooks/use-seo";
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/blog-data";
import { ContactSupportSection } from "@/components/contact-support";
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);
  const [currentHeading, setCurrentHeading] = useState("");

  const post = getBlogPostBySlug(slug || "");
  const relatedPosts = post ? getRelatedPosts(post.slug, 3) : [];

  useEffect(() => {
    // Scroll to top when post changes
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!post) return;

    // Track scroll position for table of contents
    const handleScroll = () => {
      const headings = document.querySelectorAll('h2, h3');
      let current = "";
      
      headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          current = heading.id;
        }
      });
      
      setCurrentHeading(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  if (!post) {
    setLocation("/blog");
    return null;
  }

  const Icon = post.icon;
  const postUrl = `https://altaftoolshub.com/blog/${post.slug}`;

  // Generate breadcrumb items
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` }
  ];

  // Generate article schema
  const articleSchema = generateArticleSchema({
    headline: post.seoTitle,
    description: post.seoDescription,
    image: "https://altaftoolshub.com/og-image.png",
    datePublished: "2025-01-28",
    dateModified: "2025-01-28",
    author: {
      name: post.author
    }
  });

  useSEO({
    title: post.seoTitle,
    description: post.seoDescription,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    structuredData: [
      articleSchema,
      generateBreadcrumbSchema(breadcrumbItems)
    ],
    articlePublishedTime: "2025-01-28T00:00:00Z",
    articleModifiedTime: "2025-01-28T00:00:00Z"
  });

  const copyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank');
  };

  // Extract headings for table of contents
  const extractHeadings = (content: string) => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const headings: { level: number; text: string; id: string }[] = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      headings.push({ level, text, id });
    }
    
    return headings;
  };

  const tableOfContents = extractHeadings(post.content);

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <section className="py-4 border-b">
        <div className="container-section">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-8 lg:py-12 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container-section">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back to Blog */}
            <Button 
              variant="ghost" 
              className="mb-6" 
              data-testid="button-back-to-blog"
              onClick={() => setLocation("/blog")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>

            {/* Post Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="secondary" className="text-sm">
                {post.category}
              </Badge>
              {post.featured && (
                <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white border-0">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share:
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnTwitter}
                data-testid="button-share-twitter"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnLinkedIn}
                data-testid="button-share-linkedin"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyLink}
                data-testid="button-copy-link"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-section">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
              {/* Article Content */}
              <motion.article
                className="prose prose-lg dark:prose-invert max-w-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mb-4 text-foreground">{children}</h1>
                    ),
                    h2: ({ children }) => {
                      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return (
                        <h2 id={id} className="text-2xl font-bold mt-8 mb-4 text-foreground scroll-mt-20">
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return (
                        <h3 id={id} className="text-xl font-semibold mt-6 mb-3 text-foreground scroll-mt-20">
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children }) => (
                      <p className="mb-4 text-muted-foreground leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-4 ml-6 list-disc text-muted-foreground">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-4 ml-6 list-decimal text-muted-foreground">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="mb-2">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                    a: ({ href, children }) => {
                      const isInternal = href?.startsWith('/');
                      if (isInternal) {
                        return (
                          <Link 
                            href={href!}
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            {children}
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        );
                      }
                      return (
                        <a 
                          href={href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          {children}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => {
                      const isInline = !String(children).includes('\n');
                      if (isInline) {
                        return <code className="bg-muted px-1 py-0.5 rounded text-sm">{children}</code>;
                      }
                      return (
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                          <code className="text-sm">{children}</code>
                        </pre>
                      );
                    },
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full divide-y divide-border">{children}</table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-2 text-left font-semibold bg-muted">{children}</th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-2 border-t">{children}</td>
                    )
                  }}
                >
                  {post.content}
                </ReactMarkdown>

                {/* CTA Section */}
                <Card className="p-6 mt-8 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
                  <h3 className="text-xl font-bold mb-3">Ready to Get Started?</h3>
                  <p className="text-muted-foreground mb-4">
                    Try our free tools to put these techniques into practice.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {post.relatedTools.map(tool => (
                      <Button 
                        key={tool}
                        className="btn-gradient text-white"
                        onClick={() => setLocation(`/${tool}`)}
                      >
                        Try {tool.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ))}
                  </div>
                </Card>
              </motion.article>

              {/* Sidebar */}
              <aside className="lg:sticky lg:top-24 h-fit space-y-6">
                {/* Table of Contents */}
                {tableOfContents.length > 0 && (
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      Table of Contents
                    </h3>
                    <nav className="space-y-2">
                      {tableOfContents.map((heading) => (
                        <a
                          key={heading.id}
                          href={`#${heading.id}`}
                          className={cn(
                            "block text-sm hover:text-primary transition-colors",
                            heading.level === 3 && "ml-4",
                            currentHeading === heading.id ? "text-primary font-medium" : "text-muted-foreground"
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          {heading.text}
                        </a>
                      ))}
                    </nav>
                  </Card>
                )}

                {/* Quick Tools */}
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-background">
                  <h3 className="font-semibold mb-4">Quick Tools</h3>
                  <div className="space-y-2">
                    {post.relatedTools.slice(0, 3).map(tool => (
                      <Button 
                        key={tool}
                        variant="ghost" 
                        className="w-full justify-start"
                        data-testid={`sidebar-tool-${tool}`}
                        onClick={() => setLocation(`/${tool}`)}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        {tool.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Button>
                    ))}
                  </div>
                </Card>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container-section">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => {
                  const RelatedIcon = relatedPost.icon;
                  return (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full">
                        <div className="flex items-center gap-2 mb-3">
                          <RelatedIcon className="w-5 h-5 text-primary" />
                          <Badge variant="outline" className="text-xs">
                            {relatedPost.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-2 line-clamp-2">{relatedPost.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{relatedPost.excerpt}</p>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Support Section */}
      <ContactSupportSection />
    </div>
  );
}