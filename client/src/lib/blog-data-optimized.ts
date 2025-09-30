// Optimized blog data system with lazy loading
import { blogPostsMetadata, BlogPost, BlogPostMetadata } from './blog-metadata';
import { loadBlogContent, getBlogContentSync, preloadBlogContent } from './blog-content-store';

// Re-export the BlogPost interface for backward compatibility
export type { BlogPost } from './blog-metadata';

// Export categories for backward compatibility
export { blogCategories } from './blog-metadata';

// Create a proxy object for each blog post that lazy loads content
function createLazyBlogPost(metadata: BlogPostMetadata): BlogPost {
  let cachedContent: string | null = null;
  
  return new Proxy(metadata as BlogPost, {
    get(target, prop) {
      if (prop === 'content') {
        // Load content synchronously on first access (for SSR/SEO)
        if (cachedContent === null) {
          cachedContent = getBlogContentSync(target.slug);
        }
        return cachedContent;
      }
      return target[prop as keyof BlogPostMetadata];
    }
  });
}

// Export blog posts with lazy-loaded content
export const blogPosts: BlogPost[] = blogPostsMetadata.map(createLazyBlogPost);

// Get blog post by slug with lazy loading
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  const metadata = blogPostsMetadata.find(post => post.slug === slug);
  if (!metadata) return undefined;
  
  // Create a lazy-loaded blog post
  return createLazyBlogPost(metadata);
};

// Get blog post async (for better performance in components)
export const getBlogPostBySlugAsync = async (slug: string): Promise<BlogPost | undefined> => {
  const metadata = blogPostsMetadata.find(post => post.slug === slug);
  if (!metadata) return undefined;
  
  // Load content asynchronously
  const content = await loadBlogContent(slug);
  
  return {
    ...metadata,
    content
  };
};

// Get related posts with metadata only (for performance)
export const getRelatedPosts = (currentSlug: string, limit: number = 3): BlogPost[] => {
  const currentPost = blogPostsMetadata.find(post => post.slug === currentSlug);
  if (!currentPost) return [];
  
  const related = blogPostsMetadata
    .filter(post => 
      post.slug !== currentSlug && 
      (post.category === currentPost.category || 
       post.tags.some(tag => currentPost.tags.includes(tag)))
    )
    .slice(0, limit);
    
  // Return metadata-only posts (content will be lazy-loaded if accessed)
  return related.map(createLazyBlogPost);
};

// Preload content for specific posts (useful for anticipated navigation)
export const preloadBlogPosts = (slugs: string[]) => {
  slugs.forEach(slug => preloadBlogContent(slug));
};

// Get all post metadata without content (for listings)
export const getAllBlogMetadata = (): BlogPostMetadata[] => {
  return blogPostsMetadata;
};

// Helper to check if content is available in cache
export const isContentCached = (slug: string): boolean => {
  // This would check if content is already loaded
  // Implementation depends on the content store
  return false;
};