// Blog loader with code splitting support
// This module provides lazy loading for blog content while maintaining SSR compatibility

import type { BlogPost } from './blog-data';

// Cache for loaded blog data
let blogDataCache: {
  blogPosts?: BlogPost[];
  blogCategories?: any[];
  getBlogPostBySlug?: (slug: string) => BlogPost | undefined;
  getRelatedPosts?: (currentSlug: string, limit: number) => BlogPost[];
} = {};

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Load blog data with code splitting
export async function loadBlogData() {
  // Return cached data if available
  if (blogDataCache.blogPosts) {
    return blogDataCache;
  }

  // Dynamically import blog data (this creates a separate chunk)
  const blogModule = await import('./blog-data');
  
  // Cache the loaded data
  blogDataCache = {
    blogPosts: blogModule.blogPosts,
    blogCategories: blogModule.blogCategories,
    getBlogPostBySlug: blogModule.getBlogPostBySlug,
    getRelatedPosts: blogModule.getRelatedPosts
  };

  return blogDataCache;
}

// Synchronous fallback for SSR
export function loadBlogDataSync() {
  if (blogDataCache.blogPosts) {
    return blogDataCache;
  }

  // For SSR, we need to import synchronously
  // This will only be used on the server
  const blogModule = require('./blog-data');
  
  blogDataCache = {
    blogPosts: blogModule.blogPosts,
    blogCategories: blogModule.blogCategories,
    getBlogPostBySlug: blogModule.getBlogPostBySlug,
    getRelatedPosts: blogModule.getRelatedPosts
  };

  return blogDataCache;
}

// Get blog posts with lazy loading
export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await loadBlogData();
  return data.blogPosts || [];
}

// Get blog post by slug with lazy loading
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const data = await loadBlogData();
  return data.getBlogPostBySlug?.(slug);
}

// Get related posts with lazy loading
export async function getRelatedPosts(currentSlug: string, limit: number = 3): Promise<BlogPost[]> {
  const data = await loadBlogData();
  return data.getRelatedPosts?.(currentSlug, limit) || [];
}

// Preload blog data (useful for anticipating navigation)
export function preloadBlogData() {
  if (isBrowser && !blogDataCache.blogPosts) {
    // Start loading in the background
    loadBlogData().catch(console.error);
  }
}