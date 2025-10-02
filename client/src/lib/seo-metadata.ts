/**
 * Comprehensive SEO metadata for all pages
 * Each page has unique, optimized title, description, and keywords
 */

interface PageMetadata {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  structuredDataType?: string;
}

export const seoMetadata: Record<string, PageMetadata> = {
  // Home Page
  '/': {
    title: 'Free Online PDF & File Tools - 100% Private, Browser-Based Processing',
    description: 'Professional-grade PDF tools with complete privacy. Compress, merge, split, convert PDFs and images - all processing happens in your browser. No uploads, no registration, completely free.',
    keywords: 'pdf tools, pdf converter, compress pdf, merge pdf, split pdf, jpg to pdf, pdf editor, online pdf tools, free pdf tools, browser-based pdf tools, privacy-first pdf tools, pdf compressor, pdf merger',
    ogTitle: 'AltafToolsHub - Free Privacy-First PDF & File Tools',
    ogDescription: 'Professional PDF and file processing tools that work entirely in your browser. Your files never leave your device. 100% private, secure, and free.'
  },

  // Core Tool Pages - Comprehensive SEO for 27+ tools
  '/compress-pdf': {
    title: 'Compress PDF to Exact Size - Reduce PDF to 10KB, 100KB, 1MB Free',
    description: 'Advanced PDF compression tool to reduce file size by up to 95% while maintaining quality. Target exact sizes from 10KB to 5MB. Perfect for email attachments and web uploads. 100% browser-based processing.',
    keywords: 'compress pdf, reduce pdf size, pdf compressor, shrink pdf, compress pdf to 100kb, compress pdf to 10kb, pdf size reducer, compress pdf online, pdf compression tool, reduce pdf file size, compress pdf for email, make pdf smaller',
    ogTitle: 'Compress PDF to Exact Target Size - Free Online Tool',
    ogDescription: 'Reduce PDF file size to exact targets: 10KB, 50KB, 100KB, 500KB, 1MB, or 5MB. Smart compression maintains text clarity. No uploads required - works in your browser.'
  },

  '/reduce-pdf': {
    title: 'Reduce PDF Size Online Free - Shrink PDFs to Target File Size',
    description: 'Powerful PDF size reduction tool with precise targeting. Shrink PDFs to specific sizes from 10KB to 5MB while preserving document quality. Ideal for email limits and storage optimization.',
    keywords: 'reduce pdf size, shrink pdf, pdf size reducer, make pdf smaller, reduce pdf file size, pdf shrink tool, compress pdf file, optimize pdf size, pdf file reducer, decrease pdf size',
    ogTitle: 'Reduce PDF File Size - Target Exact Sizes Free',
    ogDescription: 'Shrink PDF files to precise target sizes. Perfect for email attachments with size limits. Maintains document quality while reducing file size dramatically.'
  },

  '/merge-pdf': {
    title: 'Merge PDF Files Online Free - Combine Multiple PDFs Into One',
    description: 'Combine multiple PDF documents into a single file instantly. Drag and drop to reorder pages, preserve bookmarks and formatting. No file limits, 100% private browser-based processing.',
    keywords: 'merge pdf, combine pdf, join pdf files, pdf merger, merge pdf files online, combine pdf files, pdf combiner, merge multiple pdfs, join pdf documents, pdf joiner, consolidate pdf',
    ogTitle: 'Merge PDF Files - Combine Documents Instantly Free',
    ogDescription: 'Merge unlimited PDF files into one document. Drag to reorder, preserve quality and bookmarks. Works entirely in your browser for complete privacy.'
  },

  '/combine-pdf': {
    title: 'Combine PDF Files Free - Join Multiple PDFs Together Online',
    description: 'Join multiple PDF documents into one unified file with drag-and-drop simplicity. Maintain original quality, bookmarks, and formatting. No registration or file uploads required.',
    keywords: 'combine pdf files, join pdf, pdf combiner, unite pdf files, combine multiple pdfs, pdf file combiner, merge pdf documents, join pdf files together, combine pdf online',
    ogTitle: 'Combine PDF Files - Unite Documents Seamlessly',
    ogDescription: 'Combine multiple PDFs into one file effortlessly. Intuitive drag-and-drop interface, unlimited files, perfect quality preservation.'
  },

  '/split-pdf': {
    title: 'Split PDF Files Online Free - Extract Pages & Divide Documents',
    description: 'Split large PDFs into smaller documents by page ranges, size, or custom selection. Extract specific pages or divide evenly. Perfect for sharing relevant sections without entire files.',
    keywords: 'split pdf, pdf splitter, divide pdf, extract pdf pages, separate pdf, split pdf pages, pdf divider, split pdf online, pdf page splitter, break pdf',
    ogTitle: 'Split PDF - Divide Documents & Extract Pages Free',
    ogDescription: 'Split PDFs by page ranges, file size, or custom selection. Extract exactly what you need. Fast, free, and completely private browser processing.'
  },

  '/crop-pdf': {
    title: 'Crop PDF Pages Free - Remove Margins, Headers & Whitespace',
    description: 'Precisely crop PDF pages to remove unwanted margins, headers, footers, or content. Visual cropping tool with batch processing. Perfect for presentations and optimizing page layouts.',
    keywords: 'crop pdf, pdf cropper, remove pdf margins, trim pdf pages, pdf margin removal, crop pdf pages, pdf trimmer, adjust pdf margins, crop pdf online',
    ogTitle: 'Crop PDF Pages - Remove Unwanted Margins Free',
    ogDescription: 'Crop PDF pages visually to remove margins and unwanted content. Batch crop multiple pages, auto-detect margins, custom dimensions.'
  },

  '/organize-pdf': {
    title: 'Organize PDF Pages - Reorder, Rotate & Rearrange Documents Free',
    description: 'Complete PDF page management tool. Drag to reorder pages, rotate to correct orientation, delete unwanted pages. Create perfectly organized documents with thumbnail preview.',
    keywords: 'organize pdf, reorder pdf pages, pdf organizer, arrange pdf pages, sort pdf pages, pdf page manager, rearrange pdf, pdf page reorder, organize pdf pages',
    ogTitle: 'Organize PDF - Reorder & Manage Pages Free',
    ogDescription: 'Organize PDF pages with drag-drop reordering, rotation, and deletion. Visual thumbnail preview for perfect document structure.'
  },

  '/rotate-pdf': {
    title: 'Rotate PDF Pages Free - Fix Orientation 90, 180, 270 Degrees',
    description: 'Fix incorrectly oriented PDF pages instantly. Rotate individual pages or entire documents 90, 180, or 270 degrees. Auto-detect orientation for batch rotation.',
    keywords: 'rotate pdf, pdf rotation, turn pdf pages, fix pdf orientation, rotate pdf pages, pdf page rotation, flip pdf pages, rotate pdf online',
    ogTitle: 'Rotate PDF Pages - Fix Document Orientation Free',
    ogDescription: 'Rotate PDF pages to correct orientation. Individual or batch rotation, auto-detection, permanent fixes. Quick and free.'
  },

  '/remove-pages': {
    title: 'Remove Pages from PDF Free - Delete Unwanted PDF Pages',
    description: 'Delete unwanted or blank pages from PDF documents quickly. Select multiple pages for removal, preview before deletion, keep original file safe.',
    keywords: 'remove pdf pages, delete pdf pages, pdf page remover, remove pages from pdf, delete pages in pdf, pdf page deletion, extract pages pdf',
    ogTitle: 'Remove PDF Pages - Delete Unwanted Content Free',
    ogDescription: 'Remove unwanted pages from PDFs easily. Select multiple pages, preview changes, maintain document integrity.'
  },

  '/extract-pages': {
    title: 'Extract PDF Pages Free - Save Specific Pages as New PDF',
    description: 'Extract important pages from large PDFs to create focused documents. Save single pages or custom ranges as new PDF files. Perfect for sharing specific sections.',
    keywords: 'extract pdf pages, pdf page extractor, save pdf pages, extract pages from pdf, pdf extraction, get pages from pdf, pdf page export',
    ogTitle: 'Extract PDF Pages - Create New Documents Free',
    ogDescription: 'Extract specific pages from PDFs to create new documents. Custom page ranges, preserve formatting, instant download.'
  },

  '/extract-images': {
    title: 'Extract Images from PDF Free - Save All Pictures & Graphics',
    description: 'Extract all embedded images from PDF documents in original quality. Save as JPG, PNG, or original format. Perfect for recovering photos, graphics, and illustrations.',
    keywords: 'extract images from pdf, pdf image extractor, save pdf images, get pictures from pdf, pdf to images, extract pdf photos, pdf image export',
    ogTitle: 'Extract Images from PDF - Save Pictures Free',
    ogDescription: 'Extract all images from PDFs while maintaining original quality. Multiple format options, batch extraction, preserve resolution.'
  },

  '/add-page-number': {
    title: 'Add Page Numbers to PDF Free - Professional Document Pagination',
    description: 'Insert customizable page numbers to PDF documents. Choose position, style, font, and format. Start from any number, skip pages option. Professional pagination for reports.',
    keywords: 'add page numbers pdf, pdf page numbering, number pdf pages, pdf pagination, insert page numbers, pdf page counter, add numbers to pdf',
    ogTitle: 'Add Page Numbers to PDF - Professional Formatting',
    ogDescription: 'Add custom page numbers to PDFs with full control over position, style, and format. Create professionally paginated documents.'
  },

  '/watermark-pdf': {
    title: 'Watermark PDF Free - Add Text or Image Watermarks for Protection',
    description: 'Protect PDF documents with custom watermarks. Add text or image/logo watermarks with adjustable opacity, position, and size. Batch watermarking for multiple files.',
    keywords: 'watermark pdf, pdf watermark, add watermark to pdf, pdf watermarking, protect pdf watermark, pdf stamp, pdf branding, watermark pdf online',
    ogTitle: 'Watermark PDF - Protect Documents with Custom Marks',
    ogDescription: 'Add professional watermarks to PDFs. Text or image watermarks, transparency control, batch processing. Protect your intellectual property.'
  },

  '/jpg-to-pdf': {
    title: 'JPG to PDF Converter Free - Convert Images to PDF Documents Online',
    description: 'Convert single or multiple JPG images to professional PDF documents. Reorder pages, adjust orientation, preserve image quality. Perfect for photo albums and scanned documents.',
    keywords: 'jpg to pdf, convert jpg to pdf, image to pdf, jpeg to pdf, jpg to pdf converter, photo to pdf, jpg pdf converter, convert images to pdf',
    ogTitle: 'JPG to PDF Converter - Create PDFs from Images Free',
    ogDescription: 'Convert JPG images to PDF documents instantly. Multiple images support, drag to reorder, quality preservation. 100% private processing.'
  },

  '/png-to-pdf': {
    title: 'PNG to PDF Converter Free - Convert PNG Images with Transparency',
    description: 'Convert PNG images to PDF while preserving transparency and lossless quality. Perfect for screenshots, graphics, and documents requiring perfect quality preservation.',
    keywords: 'png to pdf, convert png to pdf, png to pdf converter, image to pdf png, png pdf converter, transparent png to pdf, png file to pdf',
    ogTitle: 'PNG to PDF - Convert with Transparency Support Free',
    ogDescription: 'Convert PNG images to PDF with transparency preservation. Lossless quality, batch conversion, perfect for graphics and screenshots.'
  },

  '/pdf-to-jpg': {
    title: 'PDF to JPG Converter Free - Convert PDF Pages to Images Online',
    description: 'Convert PDF pages to high-quality JPG images. Extract all pages or select specific ones. Adjustable quality and resolution. Perfect for presentations and web graphics.',
    keywords: 'pdf to jpg, convert pdf to jpg, pdf to image, pdf to jpeg, pdf jpg converter, pdf to jpg online, extract jpg from pdf, pdf page to jpg',
    ogTitle: 'PDF to JPG - Convert Pages to Images Free',
    ogDescription: 'Transform PDF pages into JPG images with adjustable quality. Select specific pages, batch export, perfect for sharing and presentations.'
  },

  '/pdf-to-png': {
    title: 'PDF to PNG Converter Free - Extract Pages as Lossless Images',
    description: 'Convert PDF pages to lossless PNG images with transparency support. High resolution output perfect for logos, diagrams, and graphics requiring perfect quality.',
    keywords: 'pdf to png, convert pdf to png, pdf to png converter, pdf to image png, pdf png converter, pdf to transparent png, extract png from pdf',
    ogTitle: 'PDF to PNG - Lossless Image Extraction Free',
    ogDescription: 'Extract PDF pages as lossless PNG images with transparency. High resolution, perfect quality, ideal for graphics and diagrams.'
  },

  '/pdf-to-images': {
    title: 'PDF to Images Converter - Export as PNG, JPG, or WEBP Free',
    description: 'Convert PDF pages to multiple image formats. Choose PNG for quality, JPG for size, or WEBP for web. Customizable resolution and quality settings.',
    keywords: 'pdf to images, pdf to image converter, convert pdf to images, pdf image export, pdf to png jpg, pdf to multiple images, extract images pdf',
    ogTitle: 'PDF to Images - Multiple Format Export Free',
    ogDescription: 'Convert PDFs to PNG, JPG, or WEBP images. Choose format based on your needs. Quality settings, page selection, batch export.'
  },

  '/word-to-pdf': {
    title: 'Word to PDF Converter Free - Convert DOCX Documents Online',
    description: 'Convert Microsoft Word documents to PDF format directly in browser. Preserves basic formatting, headings, and text styles. No file uploads, instant conversion.',
    keywords: 'word to pdf, docx to pdf, convert word to pdf, microsoft word to pdf, doc to pdf converter, word pdf converter, docx pdf converter',
    ogTitle: 'Word to PDF - Convert DOCX Documents Free',
    ogDescription: 'Convert Word documents to PDF instantly. Browser-based conversion, basic formatting support, no uploads required.'
  },

  '/unlock-pdf': {
    title: 'Unlock PDF Free - Remove Password Protection & Restrictions',
    description: 'Remove password protection and restrictions from PDF files you own. Unlock printing, copying, and editing permissions. All processing happens securely in your browser.',
    keywords: 'unlock pdf, remove pdf password, pdf password remover, unlock protected pdf, pdf unlocker, decrypt pdf, remove pdf protection',
    ogTitle: 'Unlock PDF - Remove Passwords & Restrictions Free',
    ogDescription: 'Safely unlock password-protected PDFs you own. Remove restrictions, enable printing and copying. 100% secure browser processing.'
  },

  '/protect-pdf': {
    title: 'Password Protect PDF Free - Secure Documents with Encryption',
    description: 'Add military-grade AES-256 encryption to PDF documents. Set user and owner passwords, control permissions for printing, copying, and editing. Maximum security for sensitive files.',
    keywords: 'protect pdf, password protect pdf, encrypt pdf, secure pdf, pdf encryption, pdf password protection, lock pdf, pdf security',
    ogTitle: 'Protect PDF - Add Password & Encryption Free',
    ogDescription: '256-bit AES encryption for PDFs. Set passwords, control permissions, secure sensitive documents. Complete privacy with browser processing.'
  },

  '/sign-pdf': {
    title: 'Sign PDF Online Free - Add Digital Signatures to Documents',
    description: 'Create and apply digital signatures to PDF documents. Draw, type, or upload your signature. Add date/time stamps for contracts and agreements. Legally binding signatures.',
    keywords: 'sign pdf, digital signature pdf, pdf signature, esign pdf, electronic signature pdf, sign pdf online, add signature to pdf',
    ogTitle: 'Sign PDF - Add Digital Signatures Free',
    ogDescription: 'Apply digital signatures to PDFs for contracts and agreements. Draw, type, or upload signatures with automatic timestamps.'
  },

  '/qr-generator': {
    title: 'QR Code Generator Free - Create Custom QR Codes Online',
    description: 'Generate professional QR codes for URLs, WiFi, contact info, and more. Customize colors, add logos, download in multiple formats. Perfect for marketing and business cards.',
    keywords: 'qr code generator, create qr code, qr code maker, generate qr code, custom qr code, qr code creator, free qr code generator, qr code online',
    ogTitle: 'QR Code Generator - Create Custom Codes Free',
    ogDescription: 'Create professional QR codes instantly. Custom colors, logo embedding, multiple formats. Perfect for business and marketing.'
  },

  '/password-generator': {
    title: 'Strong Password Generator - Create Secure Passwords Online Free',
    description: 'Generate ultra-secure passwords with customizable complexity. Include symbols, numbers, mixed case, pronounceable options. Features strength analysis and instant copy.',
    keywords: 'password generator, strong password generator, secure password generator, random password generator, password creator, generate password, password maker',
    ogTitle: 'Password Generator - Create Strong Passwords Free',
    ogDescription: 'Generate unbreakable passwords with custom length and complexity. Strength meter, pronounceable options, instant copy to clipboard.'
  },

  '/extract-text': {
    title: 'Extract Text from Images & PDFs - OCR Tool Online Free',
    description: 'Extract text from images, scanned documents, and photos using advanced OCR. Supports 100+ languages, handwriting recognition. Export to Word, PDF, or plain text.',
    keywords: 'extract text, ocr online, text extraction, image to text, pdf to text, ocr converter, text recognition, extract text from image',
    ogTitle: 'Extract Text OCR - Convert Images to Text Free',
    ogDescription: 'Extract text from images and scanned documents with advanced OCR. Multiple languages, handwriting support, various export formats.'
  },

  '/pdf-to-zip': {
    title: 'PDF to ZIP Converter - Bundle PDFs into Compressed Archive Free',
    description: 'Combine multiple PDF files into a compressed ZIP archive for easy sharing. Reduces overall file size while maintaining organization. Password protection option available.',
    keywords: 'pdf to zip, compress pdf to zip, pdf zip archive, bundle pdf files, pdf compression zip, create pdf zip, pdf archiver',
    ogTitle: 'PDF to ZIP - Bundle & Compress Files Free',
    ogDescription: 'Bundle multiple PDFs into a ZIP archive. Compression for reduced size, organized folders, password protection option.'
  },

  '/zip-to-pdf': {
    title: 'Extract PDFs from ZIP Files - Unzip & Access Documents Free',
    description: 'Extract PDF files from ZIP archives instantly. Selective extraction, batch download, preview before downloading. No need to extract entire archive.',
    keywords: 'zip to pdf, extract pdf from zip, unzip pdf files, pdf extraction zip, zip pdf extractor, get pdf from zip, unarchive pdf',
    ogTitle: 'ZIP to PDF - Extract Documents from Archives Free',
    ogDescription: 'Extract PDFs from ZIP files instantly. Selective extraction, preview files, batch download. No full extraction needed.'
  },

  // Information Pages
  '/about': {
    title: 'About AltafToolsHub - Privacy-First PDF Tools Since 2024',
    description: 'Learn about our mission to provide professional PDF tools with complete privacy. Founded by security experts, we ensure your files never leave your browser.',
    keywords: 'about altaftoolshub, pdf tools company, privacy-first tools, browser-based pdf tools, secure pdf processing, about us',
    ogTitle: 'About AltafToolsHub - Our Mission for Digital Privacy',
    ogDescription: 'Founded in 2024 with a mission to provide professional PDF tools that respect your privacy completely. All processing happens in your browser.'
  },

  '/privacy-policy': {
    title: 'Privacy Policy - Your Files Never Leave Your Browser',
    description: 'Our comprehensive privacy policy explains how we protect your data. All file processing happens locally in your browser. We never see, store, or access your files.',
    keywords: 'privacy policy, data protection, file privacy, browser processing, gdpr compliance, privacy guarantee, secure file processing',
    ogTitle: 'Privacy Policy - Complete Data Protection Guaranteed',
    ogDescription: 'Learn how we protect your privacy. All files are processed in your browser, never uploaded to servers. Complete privacy and security.'
  },

  '/terms-conditions': {
    title: 'Terms & Conditions - Free Use Guidelines & Legal Information',
    description: 'Terms of service for using AltafToolsHub free PDF tools. Understand your rights, our commitments, and usage guidelines for our browser-based services.',
    keywords: 'terms conditions, terms of service, usage guidelines, legal terms, service agreement, user agreement, terms of use',
    ogTitle: 'Terms & Conditions - Service Agreement',
    ogDescription: 'Terms of service for AltafToolsHub. Free use guidelines, user rights, and service commitments for our PDF tools.'
  },

  '/how-it-works': {
    title: 'How Browser-Based PDF Processing Works - Technology Explained',
    description: 'Understand the technology behind our privacy-first approach. Learn how WebAssembly and browser APIs enable powerful PDF processing without server uploads.',
    keywords: 'how it works, browser processing, webassembly pdf, client-side processing, pdf technology, privacy technology, local processing',
    ogTitle: 'How It Works - Browser-Based Processing Technology',
    ogDescription: 'Discover how we process PDFs entirely in your browser using WebAssembly and modern web technologies. No uploads, complete privacy.'
  },

  '/why-choose-us': {
    title: 'Why Choose AltafToolsHub - Privacy, Speed & Professional Tools',
    description: 'Discover why millions trust our PDF tools. 100% privacy with browser processing, lightning-fast performance, professional features, all completely free.',
    keywords: 'why choose altaftoolshub, best pdf tools, privacy pdf tools, free pdf tools, professional pdf tools, pdf tool comparison',
    ogTitle: 'Why Choose Us - Privacy-First Professional PDF Tools',
    ogDescription: 'The only PDF tools that never touch your files. Complete privacy, professional features, lightning speed, and always free.'
  },

  '/use-cases': {
    title: 'PDF Tool Use Cases - Business, Education & Personal Solutions',
    description: 'Explore how professionals use our PDF tools for business documents, educational materials, legal paperwork, and personal projects. Real-world applications and examples.',
    keywords: 'pdf use cases, business pdf tools, education pdf tools, legal document tools, pdf applications, pdf tool examples',
    ogTitle: 'Use Cases - Real-World PDF Tool Applications',
    ogDescription: 'Discover how businesses, educators, and individuals use our PDF tools for document management, collaboration, and productivity.'
  },

  '/faq': {
    title: 'Frequently Asked Questions - PDF Tools Help & Support',
    description: 'Find answers to common questions about our PDF tools. Learn about features, privacy, compatibility, and troubleshooting. Comprehensive help resource.',
    keywords: 'faq, frequently asked questions, pdf help, pdf support, tool questions, how to use pdf tools, pdf troubleshooting',
    ogTitle: 'FAQ - Your Questions Answered',
    ogDescription: 'Complete FAQ covering all aspects of our PDF tools. Features, privacy, compatibility, and usage guides.'
  },

  '/all-tools': {
    title: 'All PDF & File Tools - Complete Collection of 50+ Free Tools',
    description: 'Browse our complete collection of PDF and file processing tools. Compress, convert, merge, split, secure, and edit - all with complete privacy and no uploads.',
    keywords: 'all pdf tools, pdf tool collection, file tools, complete pdf toolkit, pdf converter tools, pdf editor tools, free pdf utilities',
    ogTitle: 'All Tools - Complete PDF & File Processing Suite',
    ogDescription: 'Access 50+ professional PDF and file tools. Every tool works in your browser for complete privacy. Always free, no registration.'
  },

  '/blog': {
    title: 'PDF Tips & Tutorials - Expert Guides for Document Management',
    description: 'Learn PDF best practices, tips, and tutorials from experts. Comprehensive guides on compression, security, conversion, and document management.',
    keywords: 'pdf blog, pdf tutorials, pdf tips, pdf guides, document management, pdf how-to, pdf best practices, pdf learning',
    ogTitle: 'Blog - PDF Tips, Tutorials & Expert Guides',
    ogDescription: 'Expert guides and tutorials for PDF management. Learn compression techniques, security best practices, and productivity tips.'
  },

  '/testimonials': {
    title: 'Customer Testimonials - What Users Say About Our PDF Tools',
    description: 'Read reviews and testimonials from satisfied users. Discover how professionals and individuals benefit from our privacy-first PDF tools.',
    keywords: 'testimonials, customer reviews, pdf tool reviews, user feedback, customer stories, tool testimonials, user testimonials',
    ogTitle: 'Testimonials - Real User Experiences',
    ogDescription: 'See what thousands of users say about our PDF tools. Real testimonials from professionals who trust our privacy-first approach.'
  },

  '/resources': {
    title: 'PDF Resources & Downloads - Templates, Guides & Documentation',
    description: 'Access free PDF resources including templates, comprehensive guides, technical documentation, and best practice documents for PDF management.',
    keywords: 'pdf resources, pdf templates, pdf guides, pdf documentation, free pdf resources, pdf downloads, pdf materials',
    ogTitle: 'Resources - Free PDF Templates & Guides',
    ogDescription: 'Free PDF resources including templates, guides, and documentation. Everything you need for professional PDF management.'
  },

  '/documentation': {
    title: 'Technical Documentation - API Reference & Developer Guide',
    description: 'Complete technical documentation for developers. API reference, integration guides, and technical specifications for our PDF processing tools.',
    keywords: 'documentation, api reference, developer guide, technical docs, pdf api, integration guide, developer documentation',
    ogTitle: 'Documentation - Technical Reference & API Guide',
    ogDescription: 'Comprehensive technical documentation for developers. API reference, integration guides, and specifications.'
  },

  // Comparison Pages
  '/compare/pdf-compressor-comparison': {
    title: 'PDF Compressor Comparison 2025 - Best Tools Benchmarked',
    description: 'Detailed comparison of top PDF compression tools. Compare compression ratios, speed, quality, privacy features, and pricing. Make an informed choice.',
    keywords: 'pdf compressor comparison, best pdf compressor, pdf tool comparison, compression benchmark, pdf software comparison',
    ogTitle: 'PDF Compressor Comparison - Find the Best Tool',
    ogDescription: 'Compare top PDF compressors on compression ratio, speed, quality, and privacy. Detailed benchmarks and recommendations.'
  },

  '/compare/online-pdf-tools-2025': {
    title: 'Best Online PDF Tools 2025 - Comprehensive Feature Comparison',
    description: 'Compare the best online PDF tools of 2025. Feature-by-feature comparison of privacy, functionality, pricing, and performance. Expert recommendations.',
    keywords: 'online pdf tools comparison, best pdf tools 2025, pdf tool review, pdf software comparison, pdf tool features',
    ogTitle: 'Online PDF Tools 2025 - Complete Comparison Guide',
    ogDescription: 'Compare leading online PDF tools. Privacy, features, pricing, and performance analyzed. Find the perfect tool for your needs.'
  },

  // Guide Pages
  '/guides': {
    title: 'PDF Guides & How-To Tutorials - Step-by-Step Instructions',
    description: 'Comprehensive collection of PDF guides and tutorials. Step-by-step instructions for compression, conversion, security, and document management.',
    keywords: 'pdf guides, pdf tutorials, how-to guides, pdf instructions, step-by-step guides, pdf help guides, pdf learning',
    ogTitle: 'Guides - Complete PDF How-To Collection',
    ogDescription: 'Step-by-step guides for all PDF tasks. Compression, conversion, security, and management tutorials with screenshots.'
  },

  '/guides/how-to-compress-pdf': {
    title: 'How to Compress PDF Files - Complete Step-by-Step Guide 2025',
    description: 'Learn how to compress PDF files effectively. Step-by-step guide with screenshots, best settings, and tips for maintaining quality while reducing size.',
    keywords: 'how to compress pdf, pdf compression guide, compress pdf tutorial, reduce pdf size guide, pdf compression steps',
    ogTitle: 'How to Compress PDF - Complete Tutorial',
    ogDescription: 'Step-by-step guide to compress PDFs effectively. Learn optimal settings, quality preservation, and size reduction techniques.'
  },

  '/guides/how-to-convert-jpg-to-pdf': {
    title: 'How to Convert JPG to PDF - Easy Step-by-Step Tutorial',
    description: 'Convert JPG images to PDF documents with our detailed guide. Learn single and batch conversion, page arrangement, and quality optimization.',
    keywords: 'convert jpg to pdf guide, jpg to pdf tutorial, image to pdf guide, jpg conversion tutorial, jpg pdf steps',
    ogTitle: 'Convert JPG to PDF - Step-by-Step Guide',
    ogDescription: 'Complete tutorial for converting JPG images to PDF. Single and batch conversion, quality settings, page arrangement tips.'
  },

  '/guides/how-to-extract-text-from-pdf': {
    title: 'Extract Text from PDF - OCR & Copy Methods Tutorial',
    description: 'Learn multiple methods to extract text from PDFs including scanned documents. OCR techniques, bulk extraction, and format preservation explained.',
    keywords: 'extract text from pdf guide, pdf text extraction tutorial, ocr pdf guide, copy text from pdf tutorial',
    ogTitle: 'Extract Text from PDF - Complete Guide',
    ogDescription: 'Comprehensive guide to extract text from any PDF. OCR for scanned documents, bulk extraction, format preservation techniques.'
  },

  '/guides/how-to-generate-password': {
    title: 'How to Generate Strong Passwords - Security Best Practices 2025',
    description: 'Create unbreakable passwords with our comprehensive guide. Learn about password complexity, management tools, and protection against cyber threats.',
    keywords: 'generate password guide, strong password tutorial, password security guide, create secure password tutorial',
    ogTitle: 'Generate Strong Passwords - Security Guide',
    ogDescription: 'Learn to create unbreakable passwords. Complexity requirements, password managers, 2FA setup, and security best practices.'
  },

  '/guides/how-to-generate-qr-code': {
    title: 'How to Generate QR Codes - Complete Creation Guide 2025',
    description: 'Master QR code creation for business and personal use. Learn about different QR types, customization options, tracking, and best practices.',
    keywords: 'generate qr code guide, qr code tutorial, create qr code guide, qr code creation steps, qr code how-to',
    ogTitle: 'Generate QR Codes - Complete Tutorial',
    ogDescription: 'Step-by-step guide to create professional QR codes. Types, customization, tracking, and implementation best practices.'
  },

  '/guides/how-to-unlock-pdf': {
    title: 'How to Unlock PDF Files - Remove Passwords & Restrictions Guide',
    description: 'Unlock password-protected PDFs legally and safely. Learn to remove restrictions, recover from forgotten passwords, and manage document security.',
    keywords: 'unlock pdf guide, remove pdf password tutorial, pdf unlock guide, pdf restriction removal tutorial',
    ogTitle: 'Unlock PDF Files - Complete Guide',
    ogDescription: 'Safely unlock PDFs you own. Remove passwords, lift restrictions, and manage document security with our comprehensive guide.'
  }
};

// Helper function to get metadata for a specific path
export function getPageMetadata(path: string): PageMetadata | undefined {
  // Handle exact matches first
  if (seoMetadata[path]) {
    return seoMetadata[path];
  }

  // Handle dynamic blog post URLs
  if (path.startsWith('/blog/') && path !== '/blog') {
    // Return generic blog post metadata that will be overridden by specific post data
    return {
      title: 'Blog Post - AltafToolsHub',
      description: 'Read our latest insights on PDF management and document processing.',
      keywords: 'pdf blog, pdf tips, document management, pdf guides',
    };
  }

  // Handle dynamic guide URLs
  if (path.startsWith('/guides/') && path !== '/guides') {
    return {
      title: 'PDF Guide - AltafToolsHub',
      description: 'Step-by-step guide for PDF processing and management.',
      keywords: 'pdf guide, pdf tutorial, how-to guide, pdf instructions',
    };
  }

  // Handle dynamic compare URLs
  if (path.startsWith('/compare/')) {
    return {
      title: 'Tool Comparison - AltafToolsHub',
      description: 'Compare PDF tools and find the best solution for your needs.',
      keywords: 'pdf tool comparison, best pdf tools, tool review, software comparison',
    };
  }

  return undefined;
}

// Export function to generate dynamic meta tags for tools with target sizes
export function generateToolMetaTags(toolId: string, targetSize?: string): PageMetadata {
  const baseMetadata = seoMetadata[`/${toolId}`];
  
  if (!baseMetadata || !targetSize) {
    return baseMetadata || {
      title: 'PDF Tool - AltafToolsHub',
      description: 'Professional PDF processing tool with complete privacy.',
      keywords: 'pdf tool, pdf processor, online pdf tool',
    };
  }

  // Customize metadata for specific target sizes
  const sizeMap: Record<string, string> = {
    '10kb': '10KB',
    '20kb': '20KB',
    '50kb': '50KB',
    '100kb': '100KB',
    '150kb': '150KB',
    '200kb': '200KB',
    '300kb': '300KB',
    '500kb': '500KB',
    '1mb': '1MB',
    '2mb': '2MB',
    '5mb': '5MB',
  };

  const formattedSize = sizeMap[targetSize.toLowerCase()] || targetSize;

  return {
    ...baseMetadata,
    title: baseMetadata.title.replace('Exact Size', formattedSize),
    description: `${baseMetadata.description.split('.')[0]} to exactly ${formattedSize}. ${baseMetadata.description.split('.').slice(1).join('.')}`,
    keywords: `${baseMetadata.keywords}, compress to ${formattedSize}, reduce to ${formattedSize}`,
  };
}