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

  console.log("BlogPostPage - Rendering with slug:", slug);
  const post = getBlogPostBySlug(slug || "");
  console.log("BlogPostPage - Post found:", !!post, post?.title);
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
      <section className="py-3 sm:py-4 border-b">
        <div className="container-section px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground overflow-x-auto scrollbar-none" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap min-h-[44px] flex items-center px-2">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <Link href="/blog" className="hover:text-primary transition-colors whitespace-nowrap min-h-[44px] flex items-center px-2">
              Blog
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-none">{post.title}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container-section px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back to Blog */}
            <Button 
              variant="ghost" 
              className="mb-4 sm:mb-6 min-h-[44px] px-4" 
              data-testid="button-back-to-blog"
              onClick={() => setLocation("/blog")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Blog</span>
              <span className="sm:hidden">Back</span>
            </Button>

            {/* Post Header */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {post.category}
              </Badge>
              {post.featured && (
                <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white border-0 text-xs sm:text-sm">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 break-words">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {post.readTime}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs sm:text-sm py-1 px-2 sm:py-1.5 sm:px-3">
                  <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Share Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto mb-2 sm:mb-0">
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Share:
              </span>
              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] min-w-[44px] px-3 sm:px-4"
                  onClick={shareOnTwitter}
                  data-testid="button-share-twitter"
                >
                  <Twitter className="w-4 h-4" />
                  <span className="sr-only">Share on Twitter</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] min-w-[44px] px-3 sm:px-4"
                  onClick={shareOnLinkedIn}
                  data-testid="button-share-linkedin"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="sr-only">Share on LinkedIn</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] min-w-[44px] px-3 sm:px-4"
                  onClick={copyLink}
                  data-testid="button-copy-link"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="sr-only">Copy link</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="container-section px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-8">
              {/* Article Content */}
              <motion.article
                className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert prose-p:text-sm sm:prose-p:text-base prose-li:text-sm sm:prose-li:text-base prose-table:text-xs sm:prose-table:text-sm lg:prose-table:text-base max-w-full prose-img:max-w-full prose-img:h-auto overflow-x-hidden"
                style={{ maxWidth: '100%' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-foreground break-words">{children}</h1>
                    ),
                    h2: ({ children }) => {
                      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return (
                        <h2 id={id} className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4 text-foreground scroll-mt-20 break-words">
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                      return (
                        <h3 id={id} className="text-lg sm:text-xl font-semibold mt-4 sm:mt-6 mb-2 sm:mb-3 text-foreground scroll-mt-20 break-words">
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children }) => (
                      <p className="mb-3 sm:mb-4 text-muted-foreground leading-relaxed text-sm sm:text-base">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-3 sm:mb-4 ml-4 sm:ml-6 list-disc text-muted-foreground text-sm sm:text-base">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-3 sm:mb-4 ml-4 sm:ml-6 list-decimal text-muted-foreground text-sm sm:text-base">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="mb-1.5 sm:mb-2">{children}</li>
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
                      <blockquote className="border-l-2 sm:border-l-4 border-primary pl-3 sm:pl-4 italic my-3 sm:my-4 text-muted-foreground text-sm sm:text-base">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => {
                      const isInline = !String(children).includes('\n');
                      if (isInline) {
                        return <code className="bg-muted px-0.5 sm:px-1 py-0.5 rounded text-xs sm:text-sm break-all">{children}</code>;
                      }
                      return (
                        <pre className="bg-muted p-2 sm:p-4 rounded-lg overflow-x-auto mb-3 sm:mb-4 text-xs sm:text-sm">
                          <code className="text-xs sm:text-sm">{children}</code>
                        </pre>
                      );
                    },
                    table: ({ children }) => (
                      <div className="my-4 sm:my-6 -mx-4 sm:mx-0">
                        <div className="overflow-x-auto px-4 sm:px-0">
                          <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden shadow-sm ring-1 ring-border rounded-none sm:rounded-lg">
                              <table className="min-w-full divide-y divide-border">{children}</table>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="px-2 py-2 sm:px-3 sm:py-3 text-left text-[10px] sm:text-xs font-medium uppercase tracking-wider bg-muted text-foreground whitespace-nowrap">{children}</th>
                    ),
                    td: ({ children }) => (
                      <td className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm border-t break-words max-w-[150px] sm:max-w-none">{children}</td>
                    )
                  }}
                >
                  {post.content}
                </ReactMarkdown>

                {/* CTA Section */}
                <Card className="p-4 sm:p-6 mt-6 sm:mt-8 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Ready to Get Started?</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                    Try our free tools to put these techniques into practice.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {post.relatedTools.map(tool => (
                      <Button 
                        key={tool}
                        className="btn-gradient text-white min-h-[44px] text-sm sm:text-base"
                        onClick={() => setLocation(`/${tool}`)}
                      >
                        <span className="hidden sm:inline">Try </span>
                        {tool.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                      </Button>
                    ))}
                  </div>
                </Card>

                {/* Mobile Table of Contents */}
                {tableOfContents.length > 0 && (
                  <Card className="p-4 sm:p-5 mt-6 sm:mt-8 lg:hidden">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      Table of Contents
                    </h3>
                    <nav className="space-y-1.5">
                      {tableOfContents.map((heading) => (
                        <a
                          key={heading.id}
                          href={`#${heading.id}`}
                          className={cn(
                            "block text-xs sm:text-sm py-1 hover:text-primary transition-colors",
                            heading.level === 3 && "ml-3 sm:ml-4",
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
              </motion.article>

              {/* Sidebar - Hidden on mobile, shown on lg screens */}
              <aside className="hidden lg:block lg:sticky lg:top-24 h-fit space-y-6">
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
        <section className="py-8 sm:py-10 lg:py-12 bg-muted/30">
          <div className="container-section px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {relatedPosts.map(relatedPost => {
                  const RelatedIcon = relatedPost.icon;
                  return (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <Card className="p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all cursor-pointer h-full">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                          <RelatedIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                          <Badge variant="outline" className="text-[10px] sm:text-xs">
                            {relatedPost.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-1.5 sm:mb-2 line-clamp-2 text-sm sm:text-base">{relatedPost.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">{relatedPost.excerpt}</p>
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