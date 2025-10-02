#!/usr/bin/env node

/**
 * Automated sitemap generation script
 * Generates sitemap.xml with all routes from the application
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get today's date in ISO format
const today = new Date().toISOString().split('T')[0];

// Define all routes with their priorities and change frequencies
const routes = [
  // Core Pages
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/all-tools', priority: 0.9, changefreq: 'weekly' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/how-it-works', priority: 0.7, changefreq: 'monthly' },
  { path: '/why-choose-us', priority: 0.7, changefreq: 'monthly' },
  { path: '/use-cases', priority: 0.7, changefreq: 'monthly' },
  { path: '/documentation', priority: 0.6, changefreq: 'weekly' },
  { path: '/faq', priority: 0.6, changefreq: 'monthly' },
  { path: '/privacy-policy', priority: 0.5, changefreq: 'yearly' },
  { path: '/terms-conditions', priority: 0.5, changefreq: 'yearly' },
  { path: '/testimonials', priority: 0.6, changefreq: 'monthly' },
  { path: '/resources', priority: 0.6, changefreq: 'weekly' },
  { path: '/blog', priority: 0.8, changefreq: 'weekly' },
  { path: '/guides', priority: 0.7, changefreq: 'weekly' },

  // PDF Management Tools (High Priority - Most Popular)
  { path: '/compress-pdf', priority: 0.9, changefreq: 'weekly' },
  { path: '/reduce-pdf', priority: 0.9, changefreq: 'weekly' },
  { path: '/merge-pdf', priority: 0.9, changefreq: 'weekly' },
  { path: '/combine-pdf', priority: 0.8, changefreq: 'weekly' },
  { path: '/split-pdf', priority: 0.9, changefreq: 'weekly' },
  { path: '/crop-pdf', priority: 0.8, changefreq: 'weekly' },
  { path: '/organize-pdf', priority: 0.8, changefreq: 'weekly' },
  { path: '/rotate-pdf', priority: 0.8, changefreq: 'weekly' },
  { path: '/remove-pages', priority: 0.8, changefreq: 'weekly' },
  { path: '/extract-pages', priority: 0.8, changefreq: 'weekly' },
  { path: '/extract-images', priority: 0.8, changefreq: 'weekly' },
  { path: '/add-page-number', priority: 0.7, changefreq: 'weekly' },
  { path: '/watermark-pdf', priority: 0.8, changefreq: 'weekly' },

  // Image Conversion Tools
  { path: '/jpg-to-pdf', priority: 0.9, changefreq: 'weekly' },
  { path: '/png-to-pdf', priority: 0.8, changefreq: 'weekly' },
  { path: '/pdf-to-jpg', priority: 0.9, changefreq: 'weekly' },
  { path: '/pdf-to-png', priority: 0.8, changefreq: 'weekly' },
  { path: '/pdf-to-images', priority: 0.8, changefreq: 'weekly' },

  // Document Conversion
  { path: '/word-to-pdf', priority: 0.8, changefreq: 'weekly' },

  // Security Tools
  { path: '/unlock-pdf', priority: 0.9, changefreq: 'weekly' },
  { path: '/protect-pdf', priority: 0.9, changefreq: 'weekly' },
  { path: '/sign-pdf', priority: 0.8, changefreq: 'weekly' },

  // Utility Tools
  { path: '/qr-generator', priority: 0.8, changefreq: 'weekly' },
  { path: '/password-generator', priority: 0.8, changefreq: 'weekly' },
  { path: '/extract-text', priority: 0.7, changefreq: 'weekly' },
  { path: '/pdf-to-zip', priority: 0.7, changefreq: 'weekly' },
  { path: '/zip-to-pdf', priority: 0.7, changefreq: 'weekly' },

  // Comparison Pages
  { path: '/compare/pdf-compressor-comparison', priority: 0.7, changefreq: 'monthly' },
  { path: '/compare/online-pdf-tools-2025', priority: 0.7, changefreq: 'monthly' },

  // Guide Pages
  { path: '/guides/how-to-compress-pdf', priority: 0.6, changefreq: 'monthly' },
  { path: '/guides/how-to-convert-jpg-to-pdf', priority: 0.6, changefreq: 'monthly' },
  { path: '/guides/how-to-extract-text-from-pdf', priority: 0.6, changefreq: 'monthly' },
  { path: '/guides/how-to-generate-password', priority: 0.6, changefreq: 'monthly' },
  { path: '/guides/how-to-generate-qr-code', priority: 0.6, changefreq: 'monthly' },
  { path: '/guides/how-to-unlock-pdf', priority: 0.6, changefreq: 'monthly' },

  // Blog Posts
  { path: '/blog/how-to-password-protect-pdf', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog/how-to-compress-pdf-without-losing-quality', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog/best-pdf-compression-settings-2025', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog/reduce-pdf-file-size-for-email', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog/pdf-optimization-for-web-performance', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog/compress-pdf-vs-zip-compression', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog/how-to-convert-jpg-to-pdf', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog/how-to-generate-qr-codes', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog/how-to-generate-secure-passwords', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog/how-to-extract-text-from-pdf', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog/how-to-unlock-pdf', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog/how-to-merge-pdf-files', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog/how-to-split-pdf', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog/how-to-crop-pdf', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog/how-to-organize-pdf', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog/how-to-rotate-pdf', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog/how-to-remove-pdf-pages', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog/how-to-extract-pdf-pages', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog/how-to-extract-images-from-pdf', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog/how-to-add-page-numbers-to-pdf', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog/how-to-watermark-pdf', priority: 0.6, changefreq: 'monthly' },

  // SEO-friendly URL variations for high-value tools
  { path: '/compress-pdf-to-100kb', priority: 0.8, changefreq: 'weekly' },
  { path: '/compress-pdf-to-200kb', priority: 0.8, changefreq: 'weekly' },
  { path: '/compress-pdf-to-500kb', priority: 0.8, changefreq: 'weekly' },
  { path: '/compress-pdf-to-1mb', priority: 0.8, changefreq: 'weekly' },
];

// Generate sitemap XML
function generateSitemap() {
  const baseUrl = 'https://altaftoolshub.app';
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  routes.forEach(route => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority.toFixed(1)}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  
  return xml;
}

// Write sitemap to public directory
function writeSitemap() {
  const sitemap = generateSitemap();
  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  
  fs.writeFileSync(outputPath, sitemap, 'utf8');
  console.log(`✅ Sitemap generated successfully at ${outputPath}`);
  console.log(`📊 Total URLs: ${routes.length}`);
}

// Also generate robots.txt with sitemap reference
function generateRobots() {
  const robots = `# Robots.txt for AltafToolsHub
# https://altaftoolshub.app/

# Allow all crawlers
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /tmp/
Disallow: /.git/

# Specific crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

# Sitemap location
Sitemap: https://altaftoolshub.app/sitemap.xml

# Crawl delay (in seconds)
Crawl-delay: 0`;

  const outputPath = path.join(process.cwd(), 'public', 'robots.txt');
  fs.writeFileSync(outputPath, robots, 'utf8');
  console.log(`✅ Robots.txt generated successfully at ${outputPath}`);
}

// Main execution
try {
  writeSitemap();
  generateRobots();
  console.log('🎉 Sitemap generation complete!');
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}