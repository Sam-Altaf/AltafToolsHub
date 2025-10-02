# AltafToolsHub - Privacy-First File Processing Tools

## Overview

AltafToolsHub is a production-ready web application providing privacy-first file processing and utility tools. All file processing occurs client-side, ensuring user privacy as files never leave the browser. Key features include comprehensive PDF tools (compression, size reduction, password unlocking, signing, JPG to PDF conversion, PDF to JPG/PNG/Images conversion with format choice, merging, combining, splitting, rotating, organizing, watermarking, page manipulation, image extraction, ZIP bundling, and PDF extraction from ZIP), document conversion tools (Word to PDF with text-focused basic formatting), and utility tools (QR code generator, password generator, OCR text extraction). Built with React 18 and Express, it offers a modern, responsive interface with dark/light mode, animations, and SEO optimization. The platform currently has 27 functional tools with plans for over 50 more.

## Recent Changes

### Comprehensive Production Optimization (Oct 2, 2025)
Successfully completed a full-scale production optimization implementing SEO, Performance, UX, and Content improvements:

**SEO Enhancements:**
- Created centralized metadata system (seo-metadata.ts) with 74+ unique page titles, descriptions, and keywords
- Built automated sitemap generation script producing 74 URLs with proper priority and changefreq values
- Added server-side 301 redirect middleware for altaftoolshub.app domain handling
- Enhanced useSEO hook to dynamically inject metadata and JSON-LD structured data
- Implemented proper structured data schemas for all tool pages and blog posts

**Performance Improvements:**
- Fixed PWA configuration with complete manifest, icons, and service worker generation
- Successfully generates service worker with 133 precached entries (4.1MB)
- Production build optimized with code splitting into logical chunks (react-core, ui-components, pdf-processing, animations, utilities)
- Build time: ~1 minute with 3277 modules transformed
- Bundle size optimizations: main bundle gzipped to 111.46 kB

**UX Improvements:**
- Redesigned upload areas from dashed to solid borders with enhanced hover/active/dragover states
- Fixed cookie consent persistence for both Accept/Reject choices using localStorage
- Created ProcessingLoader component with progress bars and status indicators
- Improved mobile tap targets to minimum 44px for better touch accessibility
- Polished button consistency with primary gradient and secondary outlined styles

**Content Additions:**
- Wrote comprehensive 200+ word descriptions for 15 major PDF tools
- Added detailed features, use cases, and privacy guarantees for each tool
- Created technical explanations emphasizing browser-based processing
- Integrated comparison data and benchmarks into tool descriptions

**Production Status:**
✅ Successfully built and tested - all features working
✅ No TypeScript errors - clean compilation  
✅ PWA enabled with proper caching strategy
✅ SEO ready with unique metadata for 74+ pages
✅ Security headers properly configured
✅ Mobile responsive with enhanced touch targets
✅ Cookie consent with proper persistence
✅ Processing indicators and feedback implemented

### Previous Updates

**PageSpeed Optimization (Oct 1, 2025)**
Implemented production build system targeting 90-96% PageSpeed score (from baseline 29%):
- **Production Build**: Vite production build with code splitting
- **Compression**: Gzip compression active (73% reduction)
- **Service Worker**: Workbox-powered PWA service worker
- **Cache Strategy**: Immutable caching for hashed assets (1 year max-age)
- **Deployment**: Production workflow configured

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter with dynamic route metadata injection
- **Styling**: Tailwind CSS, shadcn/ui, Radix UI primitives
- **State Management**: TanStack Query
- **Build Tool**: Vite with production optimization (code splitting, PWA service worker)
- **Design System**: Modern gradient theme (Purple to Blue to Cyan), glass morphism, Inter font family, dark/light mode, mobile-first responsive design, custom hexagonal logo
- **Performance**: Gzip compression (73% reduction), immutable asset caching, Workbox service worker with runtime caching
- **SEO**: Dynamic metadata injection, JSON-LD structured data, automated sitemap generation

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **API Design**: RESTful API
- **Storage**: In-memory storage (MemStorage) for current file processing
- **Middleware**: 301 redirect handler, security headers, gzip compression
- **Optimization**: Aggressive caching headers for static assets (1y immutable for hashed files, 30d for images)

### Database
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL with Neon Database serverless driver
- **Schema Management**: Centralized schema definitions
- **Migrations**: Drizzle Kit

### File Processing Strategy
- **Privacy**: 100% client-side processing; files never leave the browser
- **PDF Compression**: Canvas-based using PDF.js with binary search for exact target sizes (10KB-5MB)
- **PDF Manipulation**: Full suite of PDF tools including compress, reduce size, merge, combine, split, rotate, organize, crop, watermark, page number addition, page removal, and digital signing with drag/resize signatures
- **PDF to ZIP**: Bundle multiple PDFs into compressed ZIP archives using JSZip with maximum compression (level 9)
- **ZIP to PDF**: Extract PDF files from ZIP archives with selective or batch download capabilities
- **Document Conversion**: Word to PDF converter (mammoth.js + pdf-lib) with text-focused conversion, basic formatting support (headings, bold), structure preservation (paragraphs, line breaks), formatting inheritance, English/Latin text focus, .docx-only support
- **Other Features**: PDF password unlocking, JPG to PDF conversion with reordering, QR code generation, password generation, OCR text extraction

## External Dependencies

### Core Framework & UI
- **@vitejs/plugin-react**
- **wouter**
- **@tanstack/react-query**
- **@radix-ui/**\*
- **tailwindcss**
- **lucide-react**

### Database & Backend
- **drizzle-orm**
- **@neondatabase/serverless**
- **drizzle-kit**
- **express**

### Development & Utilities
- **typescript**
- **@replit/vite-plugin-***
- **react-hook-form**, **@hookform/resolvers**, **zod**
- **date-fns**
- **clsx**, **nanoid**
- **framer-motion**
- **qrcode**
- **pdf-lib**, **pdfjs-dist**
- **jszip** - ZIP archive creation with maximum compression
- **tesseract.js** - OCR text extraction from images
- **mammoth** - DOCX to HTML conversion for Word to PDF tool
- **vite-plugin-pwa** - PWA service worker generation with Workbox
- **compression** - Express middleware for gzip/deflate compression