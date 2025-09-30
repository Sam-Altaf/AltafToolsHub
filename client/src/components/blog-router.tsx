import { useLocation } from "wouter";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Lazy load blog components
const Blog = lazy(() => import("@/pages/blog"));
const BlogPost = lazy(() => import("@/pages/blog-post"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

/**
 * Custom BlogRouter component to handle blog routing outside of Switch
 * This is a workaround for wouter v3's Switch component not properly matching parameterized routes
 */
export default function BlogRouter() {
  const [location] = useLocation();
  
  // Strip query strings and hash fragments for clean path matching
  const cleanPath = location.split('?')[0].split('#')[0];
  
  // Check if we're on a blog route (exact match /blog or /blog/*)
  // Use regex to prevent matching unrelated routes like /blogger
  if (!cleanPath.match(/^\/blog(\/|$)/)) {
    return null;
  }
  
  // Extract slug from URL path: /blog/slug-name -> slug-name
  // Remove trailing slashes for consistent parsing
  const normalizedPath = cleanPath.replace(/\/$/, '');
  const pathParts = normalizedPath.split("/");
  const hasSlug = pathParts.length > 2 && pathParts[2];
  
  // If there's a slug in the URL, render the BlogPost component
  if (hasSlug) {
    return (
      <Suspense fallback={<PageLoader />}>
        <BlogPost />
      </Suspense>
    );
  }
  
  // Otherwise, render the Blog listing
  return (
    <Suspense fallback={<PageLoader />}>
      <Blog />
    </Suspense>
  );
}