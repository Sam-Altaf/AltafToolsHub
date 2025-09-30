import { useParams, Link, useLocation } from "wouter";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  Facebook,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  List,
  ChevronDown,
  ChevronUp,
  Hash,
  X
} from "lucide-react";
import { SiWhatsapp, SiInstagram } from "react-icons/si";
import { useSEO, generateArticleSchema, generateBreadcrumbSchema } from "@/hooks/use-seo";
import { getBlogPostBySlugAsync, getRelatedPosts } from "@/lib/blog-data-optimized";
import { ContactSupportSection } from "@/components/contact-support";
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { allTools } from "@/lib/tools-data";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogImageStatic } from "@/components/blog-image";

// Throttle function for performance optimization
function throttle<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  
  const throttled = (...args: Parameters<T>) => {
    lastArgs = args;
    
    if (!timeout) {
      func(...lastArgs);
      timeout = setTimeout(() => {
        timeout = null;
        if (lastArgs) {
          func(...lastArgs);
        }
      }, wait);
    }
  };
  
  return throttled;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);
  const [currentHeading, setCurrentHeading] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [shareBarVisible, setShareBarVisible] = useState(true);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  // Load blog post async for better performance
  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setLocation("/blog");
        return;
      }
      
      setLoading(true);
      try {
        const loadedPost = await getBlogPostBySlugAsync(slug);
        if (!loadedPost) {
          setLocation("/blog");
          return;
        }
        setPost(loadedPost);
      } catch (error) {
        console.error("Error loading blog post:", error);
        setLocation("/blog");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug, setLocation]);

  // Always call hooks before any early returns (React Rules of Hooks)
  // Compute safe values even when post is null/loading
  const relatedPosts = post ? getRelatedPosts(post.slug, 3) : [];
  const Icon = post?.icon;
  const postUrl = `https://altaftoolshub.app/blog/${slug || ''}`;

  // Generate breadcrumb items with safe fallbacks
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post?.title || "Loading...", url: `/blog/${slug || ''}` }
  ];

  // Generate article schema with safe fallbacks
  const articleSchema = generateArticleSchema({
    headline: post?.seoTitle || "AltafToolsHub Blog",
    description: post?.seoDescription || "Privacy-first file processing tools",
    image: "https://altaftoolshub.app/og-image.png",
    datePublished: "2025-01-28",
    dateModified: "2025-01-28",
    author: {
      name: post?.author || "AltafToolsHub"
    }
  });

  // CRITICAL: useSEO must be called before any early returns
  useSEO({
    title: post?.seoTitle || "AltafToolsHub Blog",
    description: post?.seoDescription || "Privacy-first file processing tools",
    path: `/blog/${slug || ''}`,
    keywords: post?.keywords || "pdf tools, file processing, privacy",
    structuredData: [
      articleSchema,
      generateBreadcrumbSchema(breadcrumbItems)
    ],
    articlePublishedTime: "2025-01-28T00:00:00Z",
    articleModifiedTime: "2025-01-28T00:00:00Z"
  });

  useEffect(() => {
    // Scroll to top when post changes
    window.scrollTo(0, 0);
    // Reset progress and table of contents state
    setReadingProgress(0);
    setCurrentHeading("");
    setTocOpen(false);
  }, [slug]);

  // Throttled scroll handler for performance
  const handleScroll = useCallback(
    throttle(() => {
      if (!post || !contentRef.current) return;

      // Calculate reading progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(100, Math.max(0, scrollPercent)));

      // Track current heading for table of contents
      const headings = document.querySelectorAll('h2[id], h3[id]');
      let current = "";
      
      headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        // Check if heading is in the viewport (with some offset for better UX)
        if (rect.top <= 100) {
          current = heading.id;
        }
      });
      
      if (current !== currentHeading) {
        setCurrentHeading(current);
      }
    }, 100),
    [post, currentHeading]
  );

  useEffect(() => {
    if (!post) return;

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [post, handleScroll]);

  // Show loading skeleton while fetching content
  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container-section py-12">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const copyLink = () => {
    navigator.clipboard.writeText(postUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`;
    window.open(url, 'share-twitter', 'width=550,height=450,menubar=no,toolbar=no,resizable=yes,scrollbars=yes');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
    window.open(url, 'share-linkedin', 'width=570,height=520,menubar=no,toolbar=no,resizable=yes,scrollbars=yes');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    window.open(url, 'share-facebook', 'width=550,height=450,menubar=no,toolbar=no,resizable=yes,scrollbars=yes');
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + postUrl)}`;
    window.open(url, 'share-whatsapp', 'width=550,height=450,menubar=no,toolbar=no,resizable=yes,scrollbars=yes');
  };

  const shareOnInstagram = () => {
    // Instagram doesn't have direct web share API, so we copy link and show a toast
    navigator.clipboard.writeText(postUrl).then(() => {
      toast({
        title: "Link copied for Instagram!",
        description: "Paste this link in your Instagram story or bio.",
      });
    });
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

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      const offset = 80; // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile TOC after clicking
      if (isMobile) {
        setTocOpen(false);
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 w-full h-[3px] z-50 bg-gradient-to-r from-primary via-accent to-secondary transition-transform duration-150 origin-left"
        style={{ 
          transform: `scaleX(${readingProgress / 100})`,
        }}
        aria-label={`Reading progress: ${Math.round(readingProgress)}%`}
        data-testid="reading-progress-bar"
      />

      {/* Floating Share Button - Collapsible Design - Works on All Devices */}
      <AnimatePresence>
        {readingProgress > 30 && shareBarVisible && (
          <motion.div
            className="fixed bottom-6 right-4 sm:right-6 z-40"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {!shareMenuOpen ? (
              // Minimized: Single Share Icon Button
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setShareMenuOpen(true)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-primary to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white dark:border-gray-800"
                  data-testid="button-open-share-menu"
                >
                  <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="sr-only">Open share menu</span>
                </Button>
              </motion.div>
            ) : (
              // Expanded: Show All Share Options
              <motion.div
                className="bg-background/95 backdrop-blur-md border-2 rounded-2xl p-3 shadow-2xl w-[260px] sm:min-w-[240px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header with Close Button */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b">
                  <span className="text-sm font-semibold text-foreground">Share Article</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-destructive/10"
                    onClick={() => setShareMenuOpen(false)}
                    data-testid="button-close-share-menu"
                  >
                    <X className="w-4 h-4" />
                    <span className="sr-only">Close share menu</span>
                  </Button>
                </div>

                {/* Share Options Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {/* WhatsApp */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-green-500/10 hover:border-green-500"
                    onClick={shareOnWhatsApp}
                    data-testid="button-share-whatsapp"
                  >
                    <SiWhatsapp className="w-5 h-5 text-green-600" />
                    <span className="text-[10px]">WhatsApp</span>
                  </Button>

                  {/* Instagram */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-pink-500/10 hover:border-pink-500"
                    onClick={shareOnInstagram}
                    data-testid="button-share-instagram"
                  >
                    <SiInstagram className="w-5 h-5 text-pink-600" />
                    <span className="text-[10px]">Instagram</span>
                  </Button>

                  {/* Facebook */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-blue-500/10 hover:border-blue-500"
                    onClick={shareOnFacebook}
                    data-testid="button-share-facebook"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <span className="text-[10px]">Facebook</span>
                  </Button>

                  {/* LinkedIn */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-blue-700/10 hover:border-blue-700"
                    onClick={shareOnLinkedIn}
                    data-testid="button-share-linkedin"
                  >
                    <Linkedin className="w-5 h-5 text-blue-700" />
                    <span className="text-[10px]">LinkedIn</span>
                  </Button>

                  {/* Twitter */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-sky-500/10 hover:border-sky-500"
                    onClick={shareOnTwitter}
                    data-testid="button-share-twitter"
                  >
                    <Twitter className="w-5 h-5 text-sky-500" />
                    <span className="text-[10px]">Twitter</span>
                  </Button>

                  {/* Copy Link */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-primary/10 hover:border-primary"
                    onClick={copyLink}
                    data-testid="button-copy-link"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-[10px]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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

            {/* Hero Image */}
            {post.heroImage && (
              <div className="relative w-full mb-6 sm:mb-8 rounded-xl overflow-hidden shadow-xl">
                <BlogImageStatic
                  src={post.heroImage}
                  alt={`${post.title} hero`}
                  className="w-full h-auto aspect-[16/9] sm:aspect-[21/9] object-cover"
                  priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-40" />
              </div>
            )}

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

            {/* Mobile Share Buttons - Below author info */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6 lg:hidden">
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
                  data-testid="button-share-twitter-mobile"
                >
                  <Twitter className="w-4 h-4" />
                  <span className="sr-only">Share on Twitter</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] min-w-[44px] px-3 sm:px-4"
                  onClick={shareOnLinkedIn}
                  data-testid="button-share-linkedin-mobile"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="sr-only">Share on LinkedIn</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] min-w-[44px] px-3 sm:px-4"
                  onClick={shareOnFacebook}
                  data-testid="button-share-facebook-mobile"
                >
                  <Facebook className="w-4 h-4" />
                  <span className="sr-only">Share on Facebook</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] min-w-[44px] px-3 sm:px-4"
                  onClick={copyLink}
                  data-testid="button-copy-link-mobile"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="sr-only">Copy link</span>
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs sm:text-sm py-1 px-2 sm:py-1.5 sm:px-3">
                  <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile Table of Contents (Collapsible) */}
      {tableOfContents.length > 0 && isMobile && (
        <section className="py-4 px-4 sm:px-6 lg:hidden relative z-30">
          <div className="max-w-4xl mx-auto">
            <Collapsible open={tocOpen} onOpenChange={setTocOpen}>
              <Card className="p-4">
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                  <h3 className="font-semibold flex items-center gap-2 text-sm">
                    <List className="w-4 h-4 text-primary" />
                    Table of Contents
                  </h3>
                  {tocOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <nav className="space-y-1.5">
                    {tableOfContents.map((heading) => (
                      <button
                        key={heading.id}
                        onClick={() => scrollToHeading(heading.id)}
                        className={cn(
                          "block w-full text-left text-xs py-1.5 px-2 rounded hover:bg-muted transition-colors",
                          heading.level === 3 && "ml-4 text-xs",
                          currentHeading === heading.id 
                            ? "text-primary font-medium bg-primary/10" 
                            : "text-muted-foreground"
                        )}
                        data-testid={`toc-mobile-${heading.id}`}
                      >
                        <span className="flex items-center gap-1">
                          {heading.level === 3 && <Hash className="w-3 h-3 opacity-50" />}
                          {heading.text}
                        </span>
                      </button>
                    ))}
                  </nav>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-8 sm:py-10 lg:py-12" ref={contentRef}>
        <div className="container-section px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px] gap-8 lg:gap-10">
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

                {/* Supporting Images */}
                {post.supportingImages && post.supportingImages.length > 0 && (
                  <div className="my-6 sm:my-8 space-y-4 sm:space-y-6">
                    {post.supportingImages.map((image: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                      >
                        <img
                          src={image.replace('@assets/', '/attached_assets/')}
                          alt={`${post.title} - Supporting image ${index + 1}`}
                          className="w-full h-auto rounded-lg shadow-md"
                          loading="lazy"
                          data-testid={`blog-supporting-image-${index}`}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Related Tools CTA Section */}
                <div className="mt-8 sm:mt-12">
                  <Card className="p-6 sm:p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-primary/10">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Try These Tools
                    </h2>
                    <p className="text-muted-foreground mb-6 sm:mb-8">
                      Put what you've learned into practice with our powerful, free tools
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {post.relatedTools.slice(0, 3).map((toolId: string) => {
                        const tool = allTools.find(t => t.id === toolId);
                        if (!tool) return null;
                        const ToolIcon = tool.icon;
                        return (
                          <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="group"
                          >
                            <Card className="h-full p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background/50 backdrop-blur-sm">
                              <div className="flex flex-col h-full">
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} p-2.5 mb-4 group-hover:scale-110 transition-transform`}>
                                  <ToolIcon className="w-full h-full text-white" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{tool.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">
                                  {tool.description}
                                </p>
                                <Button
                                  className="w-full btn-gradient text-white hover:shadow-lg transition-all"
                                  onClick={() => setLocation(tool.href)}
                                  data-testid={`related-tool-${tool.id}`}
                                >
                                  Try Now
                                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              </motion.article>

              {/* Desktop Sidebar Table of Contents */}
              {!isMobile && tableOfContents.length > 0 && (
                <aside className="hidden lg:block relative z-30">
                  <div className="sticky top-24 space-y-6">
                    {/* Table of Contents */}
                    <Card className="p-5">
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Table of Contents
                      </h3>
                      <nav className="space-y-1">
                        {tableOfContents.map((heading) => (
                          <button
                            key={heading.id}
                            onClick={() => scrollToHeading(heading.id)}
                            className={cn(
                              "block w-full text-left text-sm py-1.5 px-2 rounded hover:bg-muted transition-all duration-200",
                              heading.level === 3 && "ml-4 text-xs",
                              currentHeading === heading.id 
                                ? "text-primary font-medium bg-primary/10 border-l-2 border-primary" 
                                : "text-muted-foreground hover:text-foreground"
                            )}
                            data-testid={`toc-desktop-${heading.id}`}
                          >
                            <span className="flex items-center gap-1.5">
                              {heading.level === 3 && <Hash className="w-3 h-3 opacity-50" />}
                              {heading.text}
                            </span>
                          </button>
                        ))}
                      </nav>
                      {/* Reading Progress Indicator */}
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>Reading progress</span>
                          <span>{Math.round(readingProgress)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-300 ease-out"
                            style={{ width: `${readingProgress}%` }}
                          />
                        </div>
                      </div>
                    </Card>

                    {/* Quick Tools */}
                    <Card className="p-5 bg-gradient-to-br from-primary/5 to-background">
                      <h3 className="font-semibold mb-3 text-sm">Quick Tools</h3>
                      <div className="space-y-1">
                        {post.relatedTools.slice(0, 3).map((tool: string) => (
                          <Button 
                            key={tool}
                            variant="ghost" 
                            className="w-full justify-start text-sm h-9"
                            data-testid={`sidebar-tool-${tool}`}
                            onClick={() => setLocation(`/${tool}`)}
                          >
                            <ArrowRight className="w-3 h-3 mr-2" />
                            {tool.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </Button>
                        ))}
                      </div>
                    </Card>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-8 sm:py-10 lg:py-12 bg-muted/30">
          <div className="container-section px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {relatedPosts.map(relatedPost => {
                  const RelatedIcon = relatedPost.icon;
                  return (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="p-4 sm:p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                              <RelatedIcon className="w-5 h-5 text-primary" />
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {relatedPost.category}
                            </Badge>
                          </div>
                          <h3 className="font-semibold mb-2 text-foreground line-clamp-2 text-sm sm:text-base">
                            {relatedPost.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3">
                            {relatedPost.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {relatedPost.readTime}
                            </span>
                            <span className="text-primary flex items-center gap-1 font-medium">
                              Read more
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
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