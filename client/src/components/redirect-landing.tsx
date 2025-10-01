import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";

export interface RedirectLandingSEO {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface RedirectLandingProps {
  targetPath: string;
  seo: RedirectLandingSEO;
  heading: string;
  subheading: string;
}

export default function RedirectLanding({
  targetPath,
  seo,
  heading,
  subheading,
}: RedirectLandingProps) {
  const [, setLocation] = useLocation();
  const [countdown, setCountdown] = useState(2);

  // Prefetch target route
  useEffect(() => {
    // Prefetch by creating a link element
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = targetPath;
    document.head.appendChild(link);

    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, [targetPath]);

  // Auto-redirect after countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Use replace to avoid back-button trap
          window.location.replace(targetPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetPath, setLocation]);

  // Generate FAQ structured data if provided
  const faqSchema = seo.faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seo.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  // Breadcrumb structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${window.location.origin}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: heading,
        item: window.location.href,
      },
    ],
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{seo.title}</title>
        <meta name="title" content={seo.title} />
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        
        {/* Canonical URL - Self-referencing to allow each alias to rank independently */}
        <link rel="canonical" href={window.location.href} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content={seo.title} />
        <meta property="twitter:description" content={seo.description} />
        {seo.ogImage && <meta property="twitter:image" content={seo.ogImage} />}

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>

      <div className="min-h-screen pattern-bg flex items-center justify-center px-4">
        <Card className="glass max-w-2xl w-full p-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-blue-600 text-white mb-6 shadow-md">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Privacy-First Processing</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">
            {heading}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            {subheading}
          </p>

          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto"
              data-testid="button-continue-to-tool"
              asChild
            >
              <Link href={targetPath}>
                Continue to Tool
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <p className="text-sm text-muted-foreground">
              Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>

          <noscript>
            <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                JavaScript is disabled. Please{" "}
                <Link href={targetPath} className="underline font-medium">
                  click here to continue
                </Link>
                .
              </p>
            </div>
          </noscript>

          {/* FAQ Section if provided */}
          {seo.faq && seo.faq.length > 0 && (
            <div className="mt-8 text-left">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {seo.faq.slice(0, 3).map((item, index) => (
                  <div key={index} className="border-b border-border pb-3">
                    <h3 className="font-medium text-sm mb-2">{item.question}</h3>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
