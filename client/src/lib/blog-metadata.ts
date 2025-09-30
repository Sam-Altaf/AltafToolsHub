import { FileText, Settings, Mail, Globe, Package, Shield, Zap, Users, TrendingUp, BookOpen, Award, Clock, QrCode, Key, Type, Unlock, Image, FilePlus, Scissors, Crop, Layers, RotateCw, FileX, FileSearch, FileImage, Hash, Droplets } from "lucide-react";

// Optimized blog post interface without heavy content
export interface BlogPostMetadata {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  author: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  relatedTools: string[];
  relatedPosts?: string[];
  heroImage?: string;
  thumbnailImage?: string;
  supportingImages?: string[];
}

// Extended interface for full blog post with content
export interface BlogPost extends BlogPostMetadata {
  content: string;
}

// Optimized metadata-only array for better performance
export const blogPostsMetadata: BlogPostMetadata[] = [
  {
    id: "how-to-password-protect-pdf",
    slug: "how-to-password-protect-pdf",
    title: "How to Password Protect PDF Files in 2025: Ultimate Security Guide",
    excerpt: "Learn how to add password protection and encryption to PDF files. Comprehensive guide covering user passwords, owner passwords, and permission settings.",
    category: "Security",
    date: "Jan 28, 2025",
    readTime: "12 min read",
    tags: ["PDF Security", "Encryption", "Password Protection", "Data Privacy"],
    featured: true,
    icon: Shield,
    author: "Security Team",
    seoTitle: "How to Password Protect PDF Files in 2025 | Ultimate Security Guide",
    seoDescription: "Learn how to add password protection and military-grade AES-256 encryption to PDF files. Step-by-step guide with security best practices for 2025.",
    keywords: "password protect pdf, pdf encryption, secure pdf files, pdf password, pdf security, protect pdf documents, encrypt pdf, pdf protection guide",
    relatedTools: ["protect-pdf", "unlock-pdf"],
    relatedPosts: ["how-to-unlock-pdf", "pdf-optimization-for-web-performance"],
    heroImage: "@assets/blog_images/password-protect-pdf-hero.png",
    thumbnailImage: "@assets/blog_images/password-protect-pdf-thumb.png",
    supportingImages: ["@assets/blog_images/password-protection-types.png"]
  },
  {
    id: "how-to-compress-pdf-without-losing-quality",
    slug: "how-to-compress-pdf-without-losing-quality",
    title: "How to Compress PDF Without Losing Quality: Expert Guide 2025",
    excerpt: "Master PDF compression techniques that reduce file size by up to 90% while maintaining perfect quality. Learn the best settings and methods.",
    category: "Compression",
    date: "Jan 27, 2025",
    readTime: "10 min read",
    tags: ["PDF Compression", "File Optimization", "Quality Preservation"],
    featured: true,
    icon: Package,
    author: "Tech Team",
    seoTitle: "How to Compress PDF Without Losing Quality | Expert Guide 2025",
    seoDescription: "Learn how to reduce PDF file size by up to 90% without quality loss. Expert compression techniques, best settings, and free tools for 2025.",
    keywords: "compress pdf without losing quality, pdf compression, reduce pdf size, pdf optimizer, lossless pdf compression, pdf file size reducer",
    relatedTools: ["compress-pdf"],
    relatedPosts: ["best-pdf-compression-settings-2025", "reduce-pdf-file-size-for-email"],
    heroImage: "@assets/blog_images/compress-pdf-without-losing-quality-hero.png",
    thumbnailImage: "@assets/blog_images/compress-pdf-without-losing-quality-thumb.png",
    supportingImages: ["@assets/blog_images/pdf-compression-before-after.png", "@assets/blog_images/pdf-compression-workflow.png"]
  },
  {
    id: "best-pdf-compression-settings-2025",
    slug: "best-pdf-compression-settings-2025",
    title: "Best PDF Compression Settings for 2025: Complete Optimization Guide",
    excerpt: "Discover the optimal PDF compression settings for different use cases. From email attachments to web publishing and archival storage.",
    category: "Compression",
    date: "Jan 26, 2025",
    readTime: "15 min read",
    tags: ["PDF Settings", "Optimization", "File Size", "Compression Ratios"],
    icon: Settings,
    author: "Optimization Expert",
    seoTitle: "Best PDF Compression Settings 2025 | Complete Optimization Guide",
    seoDescription: "Find the perfect PDF compression settings for email, web, print, and storage. Detailed guide with recommended DPI, quality levels, and compression ratios.",
    keywords: "best pdf compression settings, pdf optimization settings, pdf dpi settings, pdf quality settings, pdf compression ratio, optimal pdf settings",
    relatedTools: ["compress-pdf"],
    relatedPosts: ["how-to-compress-pdf-without-losing-quality", "pdf-optimization-for-web-performance"],
    heroImage: "@assets/blog_images/best-pdf-compression-settings-hero.png",
    thumbnailImage: "@assets/blog_images/best-pdf-compression-settings-thumb.png"
  },
  {
    id: "reduce-pdf-file-size-for-email",
    slug: "reduce-pdf-file-size-for-email",
    title: "How to Reduce PDF File Size for Email: Quick Solutions 2025",
    excerpt: "Learn how to compress PDFs to meet email attachment limits. Quick methods to reduce file size below 25MB, 10MB, or even 5MB.",
    category: "Email",
    date: "Jan 25, 2025",
    readTime: "8 min read",
    tags: ["Email Attachments", "File Size", "PDF Compression", "Gmail", "Outlook"],
    featured: true,
    icon: Mail,
    author: "Email Expert",
    seoTitle: "Reduce PDF File Size for Email Attachments | Quick Guide 2025",
    seoDescription: "Compress PDFs for email quickly. Reduce file size below Gmail's 25MB, Outlook's 20MB limits. Free tools and methods that work in seconds.",
    keywords: "reduce pdf size for email, pdf email attachment, compress pdf for gmail, pdf file too large email, shrink pdf for email",
    relatedTools: ["compress-pdf"],
    relatedPosts: ["how-to-compress-pdf-without-losing-quality", "best-pdf-compression-settings-2025"],
    heroImage: "@assets/blog_images/email-pdf-size-hero.png",
    thumbnailImage: "@assets/blog_images/email-pdf-size-thumb.png"
  },
  {
    id: "pdf-optimization-for-web-performance",
    slug: "pdf-optimization-for-web-performance",
    title: "PDF Optimization for Web Performance: Speed & SEO Guide 2025",
    excerpt: "Optimize PDFs for fast web loading and better SEO. Learn linearization, compression, and embedding techniques for maximum performance.",
    category: "Web",
    date: "Jan 24, 2025",
    readTime: "14 min read",
    tags: ["Web Performance", "SEO", "Page Speed", "PDF Optimization"],
    icon: Globe,
    author: "Web Performance Team",
    seoTitle: "PDF Web Optimization Guide 2025 | Improve Load Speed & SEO",
    seoDescription: "Optimize PDFs for web performance. Reduce load times by 80%, improve SEO, and enhance user experience with linearization and smart compression.",
    keywords: "pdf web optimization, pdf page speed, pdf seo, linearized pdf, fast loading pdf, web optimized pdf",
    relatedTools: ["compress-pdf"],
    relatedPosts: ["best-pdf-compression-settings-2025", "compress-pdf-vs-zip-compression"],
    heroImage: "@assets/blog_images/pdf-optimization-web-hero.png",
    thumbnailImage: "@assets/blog_images/pdf-optimization-web-thumb.png"
  },
  {
    id: "compress-pdf-vs-zip-compression",
    slug: "compress-pdf-vs-zip-compression",
    title: "PDF Compression vs ZIP: Which Method is Best? Complete Comparison 2025",
    excerpt: "Compare PDF compression with ZIP files. Learn when to use each method, compression ratios, and the best approach for your needs.",
    category: "Compression",
    date: "Jan 23, 2025",
    readTime: "11 min read",
    tags: ["Compression Methods", "ZIP Files", "File Archives", "Comparison"],
    icon: Package,
    author: "Tech Analyst",
    seoTitle: "PDF vs ZIP Compression | Which is Better? Complete Guide 2025",
    seoDescription: "PDF compression vs ZIP files compared. Discover compression ratios, use cases, and when to use each method. Make the right choice for your files.",
    keywords: "pdf vs zip compression, pdf or zip smaller, compress pdf vs zip file, pdf compression comparison, zip pdf files",
    relatedTools: ["compress-pdf"],
    relatedPosts: ["how-to-compress-pdf-without-losing-quality", "best-pdf-compression-settings-2025"],
    heroImage: "@assets/blog_images/pdf-vs-zip-hero.png",
    thumbnailImage: "@assets/blog_images/pdf-vs-zip-thumb.png"
  },
  {
    id: "how-to-convert-jpg-to-pdf",
    slug: "how-to-convert-jpg-to-pdf",
    title: "How to Convert JPG to PDF: Complete Guide with Best Practices 2025",
    excerpt: "Convert JPG images to PDF documents easily. Learn multiple methods, batch conversion, and how to optimize quality and file size.",
    category: "Conversion",
    date: "Jan 22, 2025",
    readTime: "9 min read",
    tags: ["Image Conversion", "JPG to PDF", "File Format", "Document Creation"],
    featured: true,
    icon: Image,
    author: "Conversion Expert",
    seoTitle: "Convert JPG to PDF Free | Complete Guide & Best Tools 2025",
    seoDescription: "Convert JPG images to PDF documents quickly and free. Multiple images, batch conversion, quality settings. Step-by-step guide for all devices.",
    keywords: "jpg to pdf, convert jpg to pdf, image to pdf, jpeg to pdf converter, jpg to pdf free, batch jpg to pdf",
    relatedTools: ["jpg-to-pdf"],
    relatedPosts: ["how-to-extract-images-from-pdf", "pdf-optimization-for-web-performance"],
    heroImage: "@assets/blog_images/convert-jpg-to-pdf-hero.png",
    thumbnailImage: "@assets/blog_images/convert-jpg-to-pdf-thumb.png",
    supportingImages: ["@assets/blog_images/jpg-to-pdf-steps.png"]
  },
  {
    id: "how-to-generate-qr-codes",
    slug: "how-to-generate-qr-codes",
    title: "How to Generate QR Codes: Ultimate Guide for Business & Personal Use 2025",
    excerpt: "Create QR codes for websites, WiFi, payments, and more. Learn best practices, customization options, and tracking methods.",
    category: "Tools",
    date: "Jan 21, 2025",
    readTime: "13 min read",
    tags: ["QR Codes", "Marketing", "Digital Tools", "Business Solutions"],
    icon: QrCode,
    author: "Digital Marketing Team",
    seoTitle: "Generate QR Codes Free | Complete Business Guide 2025",
    seoDescription: "Create custom QR codes for URLs, WiFi, payments, menus. Free generator with logos, colors, tracking. Complete guide for business and personal use.",
    keywords: "generate qr code, qr code generator, create qr code, custom qr code, qr code maker, free qr code",
    relatedTools: ["qr-generator"],
    relatedPosts: ["how-to-generate-secure-passwords"],
    heroImage: "@assets/blog_images/qr-code-hero.png",
    thumbnailImage: "@assets/blog_images/qr-code-thumb.png"
  },
  {
    id: "how-to-generate-secure-passwords",
    slug: "how-to-generate-secure-passwords",
    title: "How to Generate Secure Passwords: Cybersecurity Best Practices 2025",
    excerpt: "Create unbreakable passwords using proven methods. Learn about password managers, 2FA, and protecting against modern threats.",
    category: "Security",
    date: "Jan 20, 2025",
    readTime: "11 min read",
    tags: ["Password Security", "Cybersecurity", "Authentication", "Data Protection"],
    icon: Key,
    author: "Security Team",
    seoTitle: "Generate Secure Passwords | Cybersecurity Guide 2025",
    seoDescription: "Create strong, secure passwords that protect against hackers. Password generator, best practices, 2FA setup. Complete security guide for 2025.",
    keywords: "generate secure password, password generator, strong password, password security, create secure password, password best practices",
    relatedTools: ["password-generator"],
    relatedPosts: ["how-to-password-protect-pdf"],
    heroImage: "@assets/blog_images/password-generator-hero.png",
    thumbnailImage: "@assets/blog_images/password-generator-thumb.png"
  },
  {
    id: "how-to-extract-text-from-pdf",
    slug: "how-to-extract-text-from-pdf",
    title: "How to Extract Text from PDF: OCR & Copy Methods Guide 2025",
    excerpt: "Extract text from any PDF including scanned documents. Learn OCR techniques, bulk extraction, and format preservation methods.",
    category: "Extraction",
    date: "Jan 19, 2025",
    readTime: "10 min read",
    tags: ["Text Extraction", "OCR", "PDF Tools", "Document Processing"],
    icon: Type,
    author: "Document Processing Team",
    seoTitle: "Extract Text from PDF Free | OCR & Copy Guide 2025",
    seoDescription: "Extract text from PDFs including scanned documents. Free OCR tools, bulk extraction, format preservation. Works with protected and image PDFs.",
    keywords: "extract text from pdf, pdf text extraction, ocr pdf, copy text from pdf, pdf to text converter, extract pdf content",
    relatedTools: ["extract-text"],
    relatedPosts: ["how-to-unlock-pdf", "how-to-extract-images-from-pdf"],
    heroImage: "@assets/blog_images/text-extraction-hero.png",
    thumbnailImage: "@assets/blog_images/text-extraction-thumb.png"
  },
  {
    id: "how-to-unlock-pdf",
    slug: "how-to-unlock-pdf",
    title: "How to Unlock PDF Files: Remove Passwords & Restrictions 2025",
    excerpt: "Unlock password-protected PDFs and remove restrictions. Legal methods for accessing your own documents when passwords are forgotten.",
    category: "Security",
    date: "Jan 18, 2025",
    readTime: "9 min read",
    tags: ["PDF Unlock", "Password Removal", "Document Access", "PDF Security"],
    icon: Unlock,
    author: "Security Team",
    seoTitle: "Unlock PDF Files | Remove Password & Restrictions 2025",
    seoDescription: "Unlock password-protected PDFs legally. Remove printing, copying, editing restrictions. Recovery methods for forgotten passwords. Free tools guide.",
    keywords: "unlock pdf, remove pdf password, pdf password remover, unlock protected pdf, pdf restrictions remover, decrypt pdf",
    relatedTools: ["unlock-pdf", "protect-pdf"],
    relatedPosts: ["how-to-password-protect-pdf", "how-to-extract-text-from-pdf"],
    heroImage: "@assets/blog_images/unlock-pdf-hero.png",
    thumbnailImage: "@assets/blog_images/unlock-pdf-thumb.png",
    supportingImages: ["@assets/blog_images/unlock-pdf-password-hero.png"]
  },
  {
    id: "how-to-merge-pdf-files",
    slug: "how-to-merge-pdf-files",
    title: "How to Merge PDF Files: Combine Documents Like a Pro 2025",
    excerpt: "Merge multiple PDFs into one document. Learn about page ordering, bookmark preservation, and batch processing techniques.",
    category: "Organization",
    date: "Jan 17, 2025",
    readTime: "8 min read",
    tags: ["PDF Merge", "Document Management", "File Organization", "Batch Processing"],
    icon: FilePlus,
    author: "Document Management Team",
    seoTitle: "Merge PDF Files Free | Combine Documents Guide 2025",
    seoDescription: "Merge multiple PDFs into one file free. Combine documents, rearrange pages, preserve bookmarks. Quick guide for batch processing and organization.",
    keywords: "merge pdf files, combine pdf, pdf merger, join pdf documents, pdf combiner, merge multiple pdfs",
    relatedTools: ["merge-pdf", "organize-pdf"],
    relatedPosts: ["how-to-split-pdf", "how-to-organize-pdf"],
    heroImage: "@assets/blog_images/merge-pdf-hero.png",
    thumbnailImage: "@assets/blog_images/merge-pdf-thumb.png",
    supportingImages: ["@assets/blog_images/merge-pdf-support1.png", "@assets/blog_images/pdf-merge-process.png"]
  },
  {
    id: "how-to-split-pdf",
    slug: "how-to-split-pdf",
    title: "How to Split PDF Files: Extract Pages & Divide Documents 2025",
    excerpt: "Split PDFs by pages, size, or bookmarks. Learn extraction techniques for creating multiple documents from a single PDF.",
    category: "Organization",
    date: "Jan 16, 2025",
    readTime: "9 min read",
    tags: ["PDF Split", "Page Extraction", "Document Division", "File Management"],
    icon: Scissors,
    author: "Document Management Team",
    seoTitle: "Split PDF Files Free | Extract & Divide Pages Guide 2025",
    seoDescription: "Split PDFs into multiple files free. Extract specific pages, divide by size or bookmarks. Quick methods for document separation and organization.",
    keywords: "split pdf, pdf splitter, extract pdf pages, divide pdf, separate pdf pages, pdf page extractor",
    relatedTools: ["split-pdf", "extract-pages"],
    relatedPosts: ["how-to-merge-pdf-files", "how-to-extract-pdf-pages"],
    heroImage: "@assets/blog_images/split-pdf-hero.png",
    thumbnailImage: "@assets/blog_images/split-pdf-thumb.png",
    supportingImages: ["@assets/blog_images/split-pdf-support1.png", "@assets/blog_images/pdf-split-options.png"]
  },
  {
    id: "how-to-crop-pdf",
    slug: "how-to-crop-pdf",
    title: "How to Crop PDF Pages: Remove Margins & Unwanted Content 2025",
    excerpt: "Crop PDF pages to remove margins, headers, or unwanted content. Learn precise cropping techniques and batch processing.",
    category: "Editing",
    date: "Jan 15, 2025",
    readTime: "7 min read",
    tags: ["PDF Cropping", "Page Editing", "Margin Removal", "Document Formatting"],
    icon: Crop,
    author: "Editing Team",
    seoTitle: "Crop PDF Pages Free | Remove Margins & Content Guide 2025",
    seoDescription: "Crop PDF pages to remove margins, headers, footers. Precise cropping tools, batch processing. Perfect for presentations and printing.",
    keywords: "crop pdf, pdf cropper, remove pdf margins, trim pdf pages, pdf page crop, adjust pdf margins",
    relatedTools: ["crop-pdf"],
    relatedPosts: ["how-to-rotate-pdf", "how-to-organize-pdf"],
    heroImage: "@assets/blog_images/crop-pdf-hero.png",
    thumbnailImage: "@assets/blog_images/crop-pdf-thumb.png"
  },
  {
    id: "how-to-organize-pdf",
    slug: "how-to-organize-pdf",
    title: "How to Organize PDF Pages: Reorder, Sort & Arrange Documents 2025",
    excerpt: "Organize PDF pages efficiently. Learn to reorder, sort, and arrange pages for better document structure and readability.",
    category: "Organization",
    date: "Jan 14, 2025",
    readTime: "10 min read",
    tags: ["PDF Organization", "Page Reordering", "Document Structure", "File Management"],
    featured: true,
    icon: Layers,
    author: "Organization Expert",
    seoTitle: "Organize PDF Pages | Reorder & Arrange Documents Guide 2025",
    seoDescription: "Organize PDF pages with drag-drop reordering. Sort, arrange, restructure documents. Create professional presentations and reports efficiently.",
    keywords: "organize pdf pages, reorder pdf, pdf page organizer, arrange pdf pages, sort pdf pages, pdf page management",
    relatedTools: ["organize-pdf", "merge-pdf"],
    relatedPosts: ["how-to-merge-pdf-files", "how-to-split-pdf"],
    heroImage: "@assets/blog_images/organize-pdf-hero.png",
    thumbnailImage: "@assets/blog_images/organize-pdf-thumb.png"
  },
  {
    id: "how-to-rotate-pdf",
    slug: "how-to-rotate-pdf",
    title: "How to Rotate PDF Pages: Fix Orientation Issues 2025",
    excerpt: "Rotate PDF pages to fix orientation problems. Learn single page, multiple page, and permanent rotation techniques.",
    category: "Editing",
    date: "Jan 13, 2025",
    readTime: "6 min read",
    tags: ["PDF Rotation", "Page Orientation", "Document Editing", "Fix PDF"],
    icon: RotateCw,
    author: "Editing Team",
    seoTitle: "Rotate PDF Pages Free | Fix Orientation Guide 2025",
    seoDescription: "Rotate PDF pages 90, 180, 270 degrees. Fix sideways, upside-down documents. Single or multiple pages, permanent rotation. Quick and free.",
    keywords: "rotate pdf, pdf rotation, turn pdf pages, fix pdf orientation, rotate pdf pages, pdf page rotation",
    relatedTools: ["rotate-pdf"],
    relatedPosts: ["how-to-crop-pdf", "how-to-organize-pdf"],
    heroImage: "@assets/blog_images/rotate-pdf-hero.png",
    thumbnailImage: "@assets/blog_images/rotate-pdf-thumb.png"
  },
  {
    id: "how-to-remove-pdf-pages",
    slug: "how-to-remove-pdf-pages",
    title: "How to Remove Pages from PDF: Delete Unwanted Content 2025",
    excerpt: "Remove unwanted pages from PDF documents. Learn selective deletion, batch removal, and document cleanup techniques.",
    category: "Editing",
    date: "Jan 12, 2025",
    readTime: "7 min read",
    tags: ["Page Removal", "PDF Editing", "Document Cleanup", "Delete Pages"],
    icon: FileX,
    author: "Editing Team",
    seoTitle: "Remove PDF Pages Free | Delete Unwanted Pages Guide 2025",
    seoDescription: "Remove pages from PDF documents free. Delete unwanted content, clean up documents, selective page removal. Quick methods for all devices.",
    keywords: "remove pdf pages, delete pdf pages, pdf page remover, remove pages from pdf, pdf page deletion, clean pdf document",
    relatedTools: ["remove-pages"],
    relatedPosts: ["how-to-extract-pdf-pages", "how-to-split-pdf"],
    heroImage: "@assets/blog_images/remove-pages-hero.png",
    thumbnailImage: "@assets/blog_images/remove-pages-thumb.png"
  },
  {
    id: "how-to-extract-pdf-pages",
    slug: "how-to-extract-pdf-pages",
    title: "How to Extract Pages from PDF: Save Specific Pages 2025",
    excerpt: "Extract specific pages from PDF documents. Learn to save individual pages, page ranges, and create new documents from existing PDFs.",
    category: "Extraction",
    date: "Jan 11, 2025",
    readTime: "8 min read",
    tags: ["Page Extraction", "PDF Tools", "Document Processing", "Save Pages"],
    icon: FileSearch,
    author: "Extraction Team",
    seoTitle: "Extract PDF Pages Free | Save Specific Pages Guide 2025",
    seoDescription: "Extract specific pages from PDFs free. Save individual pages, page ranges, create new documents. Perfect for sharing relevant content only.",
    keywords: "extract pdf pages, pdf page extractor, save pdf pages, extract specific pages, pdf extraction tool, get pages from pdf",
    relatedTools: ["extract-pages", "split-pdf"],
    relatedPosts: ["how-to-split-pdf", "how-to-remove-pdf-pages"],
    heroImage: "@assets/blog_images/extract-pages-hero.png",
    thumbnailImage: "@assets/blog_images/extract-pages-thumb.png"
  },
  {
    id: "how-to-extract-images-from-pdf",
    slug: "how-to-extract-images-from-pdf",
    title: "How to Extract Images from PDF: Save All Pictures 2025",
    excerpt: "Extract all images from PDF documents. Learn to save pictures in original quality, batch extraction, and format conversion.",
    category: "Extraction",
    date: "Jan 10, 2025",
    readTime: "9 min read",
    tags: ["Image Extraction", "PDF Images", "Picture Export", "Media Recovery"],
    icon: FileImage,
    author: "Media Team",
    seoTitle: "Extract Images from PDF Free | Save Pictures Guide 2025",
    seoDescription: "Extract all images from PDFs free. Save pictures in original quality, JPG, PNG formats. Batch extraction, preserve resolution. Quick and easy.",
    keywords: "extract images from pdf, pdf image extractor, save pdf images, get pictures from pdf, pdf to images, extract pdf photos",
    relatedTools: ["extract-images"],
    relatedPosts: ["how-to-convert-jpg-to-pdf", "how-to-extract-text-from-pdf"],
    heroImage: "@assets/blog_images/extract-images-hero.png",
    thumbnailImage: "@assets/blog_images/extract-images-thumb.png"
  },
  {
    id: "how-to-add-page-numbers-to-pdf",
    slug: "how-to-add-page-numbers-to-pdf",
    title: "How to Add Page Numbers to PDF: Professional Formatting 2025",
    excerpt: "Add page numbers to PDF documents professionally. Learn positioning, formatting, and custom numbering schemes.",
    category: "Editing",
    date: "Jan 9, 2025",
    readTime: "7 min read",
    tags: ["Page Numbers", "PDF Formatting", "Document Layout", "Professional PDFs"],
    icon: Hash,
    author: "Formatting Team",
    seoTitle: "Add Page Numbers to PDF Free | Professional Guide 2025",
    seoDescription: "Add page numbers to PDFs free. Custom positioning, formatting, numbering schemes. Create professional documents with proper pagination.",
    keywords: "add page numbers pdf, pdf page numbering, number pdf pages, pdf pagination, insert page numbers pdf, pdf page counter",
    relatedTools: ["add-page-number"],
    relatedPosts: ["how-to-watermark-pdf", "how-to-organize-pdf"],
    heroImage: "@assets/blog_images/page-numbers-hero.png",
    thumbnailImage: "@assets/blog_images/page-numbers-thumb.png"
  },
  {
    id: "how-to-watermark-pdf",
    slug: "how-to-watermark-pdf",
    title: "How to Add Watermark to PDF: Protect & Brand Documents 2025",
    excerpt: "Add watermarks to PDF documents for branding and protection. Learn text, image, and transparent watermark techniques.",
    category: "Security",
    date: "Jan 8, 2025",
    readTime: "10 min read",
    tags: ["Watermarks", "Document Protection", "Branding", "Copyright"],
    icon: Droplets,
    author: "Branding Team",
    seoTitle: "Add Watermark to PDF Free | Protection & Branding Guide 2025",
    seoDescription: "Add watermarks to PDFs free. Text, image, transparent overlays. Protect documents, add branding, copyright notices. Professional results.",
    keywords: "watermark pdf, add watermark to pdf, pdf watermark tool, protect pdf watermark, brand pdf documents, pdf overlay",
    relatedTools: ["watermark-pdf"],
    relatedPosts: ["how-to-password-protect-pdf", "how-to-add-page-numbers-to-pdf"],
    heroImage: "@assets/blog_images/watermark-pdf-hero.png",
    thumbnailImage: "@assets/blog_images/watermark-pdf-thumb.png"
  }
];

export const blogCategories = [
  { name: "All Posts", count: 21 },
  { name: "Compression", count: 6 },
  { name: "Security", count: 4 },
  { name: "Extraction", count: 3 },
  { name: "Organization", count: 3 },
  { name: "Editing", count: 4 },
  { name: "Conversion", count: 1 },
  { name: "Tools", count: 2 },
  { name: "Email", count: 1 },
  { name: "Web", count: 1 }
];

// Get blog post metadata without content for listing pages
export const getBlogPostMetadataBySlug = (slug: string): BlogPostMetadata | undefined => {
  return blogPostsMetadata.find(post => post.slug === slug);
};

// Get related posts (metadata only) for performance
export const getRelatedPostsMetadata = (currentSlug: string, limit: number = 3): BlogPostMetadata[] => {
  const currentPost = getBlogPostMetadataBySlug(currentSlug);
  if (!currentPost) return [];
  
  return blogPostsMetadata
    .filter(post => 
      post.slug !== currentSlug && 
      (post.category === currentPost.category || 
       post.tags.some(tag => currentPost.tags.includes(tag)))
    )
    .slice(0, limit);
};