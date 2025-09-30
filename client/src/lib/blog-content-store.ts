// Blog content store - Content is stored separately and loaded on demand
// This file stores the actual blog post content to reduce initial bundle size
// Auto-generated - DO NOT EDIT DIRECTLY

type BlogContent = {
  [key: string]: () => Promise<{ default: string }>;
};

// Dynamically import blog content for code splitting
const blogContentMap: BlogContent = {
  "how-to-password-protect-pdf": () => import('./blog-contents/how-to-password-protect-pdf'),
  "how-to-compress-pdf-without-losing-quality": () => import('./blog-contents/how-to-compress-pdf-without-losing-quality'),
  "best-pdf-compression-settings-2025": () => import('./blog-contents/best-pdf-compression-settings-2025'),
  "reduce-pdf-file-size-for-email": () => import('./blog-contents/reduce-pdf-file-size-for-email'),
  "pdf-optimization-for-web-performance": () => import('./blog-contents/pdf-optimization-for-web-performance'),
  "compress-pdf-vs-zip-compression": () => import('./blog-contents/compress-pdf-vs-zip-compression'),
  "how-to-convert-jpg-to-pdf": () => import('./blog-contents/how-to-convert-jpg-to-pdf'),
  "how-to-generate-qr-codes": () => import('./blog-contents/how-to-generate-qr-codes'),
  "how-to-generate-secure-passwords": () => import('./blog-contents/how-to-generate-secure-passwords'),
  "how-to-extract-text-from-pdf": () => import('./blog-contents/how-to-extract-text-from-pdf'),
  "how-to-unlock-pdf": () => import('./blog-contents/how-to-unlock-pdf'),
  "how-to-merge-pdf-files": () => import('./blog-contents/how-to-merge-pdf-files'),
  "how-to-split-pdf": () => import('./blog-contents/how-to-split-pdf'),
  "how-to-crop-pdf": () => import('./blog-contents/how-to-crop-pdf'),
  "how-to-organize-pdf": () => import('./blog-contents/how-to-organize-pdf'),
  "how-to-rotate-pdf": () => import('./blog-contents/how-to-rotate-pdf'),
  "how-to-remove-pdf-pages": () => import('./blog-contents/how-to-remove-pdf-pages'),
  "how-to-extract-pdf-pages": () => import('./blog-contents/how-to-extract-pdf-pages'),
  "how-to-extract-images-from-pdf": () => import('./blog-contents/how-to-extract-images-from-pdf'),
  "how-to-add-page-numbers-to-pdf": () => import('./blog-contents/how-to-add-page-numbers-to-pdf'),
  "how-to-watermark-pdf": () => import('./blog-contents/how-to-watermark-pdf'),
};

// Lazy loading function with caching
const loadedContent = new Map<string, string>();

export async function loadBlogContent(slug: string): Promise<string> {
  // Check cache first
  if (loadedContent.has(slug)) {
    return loadedContent.get(slug)!;
  }

  // Load content dynamically
  const loader = blogContentMap[slug];
  if (!loader) return "";
  
  try {
    const module = await loader();
    const content = module.default;
    loadedContent.set(slug, content);
    return content;
  } catch (error) {
    console.error(`Failed to load blog content for ${slug}`, error);
    return "";
  }
}

// Get content synchronously for SSR/SEO if needed (fallback to empty)
export function getBlogContentSync(slug: string): string {
  if (loadedContent.has(slug)) {
    return loadedContent.get(slug)!;
  }
  
  // For SSR, we can't use dynamic imports, so return empty
  // The content will be loaded client-side
  return "";
}

// Preload specific blog post content
export async function preloadBlogContent(slug: string): Promise<void> {
  if (!loadedContent.has(slug)) {
    await loadBlogContent(slug);
  }
}

// Clear cache if needed (for memory management)
export function clearBlogContentCache(): void {
  loadedContent.clear();
}

// Get all available slugs
export function getAvailableSlugs(): string[] {
  return Object.keys(blogContentMap);
}
