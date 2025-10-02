# AltafToolsHub - Privacy-First File Processing Tools

## Overview

AltafToolsHub is a web application providing privacy-first file processing and utility tools. All file processing occurs client-side, ensuring user privacy as files never leave the browser. Key features include comprehensive PDF tools (compression, size reduction, password unlocking, signing, JPG to PDF conversion, PDF to JPG/PNG/Images conversion with format choice, merging, combining, splitting, rotating, organizing, watermarking, page manipulation, image extraction, ZIP bundling, and PDF extraction from ZIP), document conversion tools (Word to PDF with text-focused basic formatting), and utility tools (QR code generator, password generator, OCR text extraction). Built with React 18 and Express, it offers a modern, responsive interface with dark/light mode, animations, and SEO optimization. The platform currently has 27 functional tools with plans for over 50 more.

## Recent Changes

### SEO & Performance Audit Implementation (Oct 2, 2025)
Completed all 4 phases of systematic optimization plan:

**Phase 1: SEO & Discoverability (✅ Complete)**
- Created comprehensive sitemap.xml with 50+ pages (tools, blog posts, info pages)
- Added robots.txt with proper crawler directives and sitemap reference
- Added SEO meta tags to all-tools page (title, description, keywords, OG image)
- Expected impact: +30-50% organic traffic within 3 months

**Phase 2: Performance & Optimization (✅ Complete)**
- Vite build optimizations: Terser minification, lightningcss, hashed chunks
- CSS reduction: 172.32 kB → 168.09 kB (gzip: 25.86 kB)
- Separated OCR chunk (tesseract.js) for better code splitting
- Added comprehensive security headers: CSP, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, HSTS
- Drop console logs in production builds
- Expected impact: +10-15 PageSpeed points

**Phase 3: Enhanced Analytics & Tracking (✅ Complete)**
- Created comprehensive analytics-events.ts utility with 15+ tracking functions
- Tool lifecycle tracking: trackToolStart, trackToolComplete, trackToolError
- Conversion tracking: trackFileDownload with auto GA4 conversion events
- User interaction tracking: trackButtonClick, trackFileUpload, trackSettingsChange
- Engagement tracking: trackSocialShare, trackSearch, trackOutboundLink
- User journey tracking: trackUserJourney for multi-step workflows
- Automatic scroll depth tracking (25%, 50%, 75%, 100% milestones)
- Session duration tracking with visibility API
- ErrorBoundary component for React error catching with GA tracking
- Full integration in App.tsx (wrapped with ErrorBoundary, scroll/session tracking)
- Created analytics-usage-guide.md with examples and best practices
- All analytics respect Cookie Consent Mode v2 (consent-aware gtag guards)
- Expected impact: +50-70% improvement in conversion tracking and user insights

**Phase 4: Accessibility (✅ Complete)**
- Skip navigation link for keyboard users (Tab on page load reveals skip link)
- Screen reader support: ScreenReaderAnnouncer component and useAnnouncer hook
- ARIA landmarks: Header (banner), Main (main), Navigation (navigation), Footer (contentinfo)
- Focus management utilities: trapFocus, restoreFocus, createFocusTrap (fixed for modals/dialogs)
- Enhanced focus indicators: 2px ring outline with high contrast, special treatment for form inputs
- WCAG 2.1 Level AA color contrast compliance (muted-foreground colors optimized)
- sr-only CSS utility class for screen reader-only content
- Proper semantic HTML structure with heading hierarchy
- Created accessibility-guide.md with testing checklist and developer guidelines
- Expected impact: WCAG 2.1 Level AA conformance, improved usability for all users

### PageSpeed Optimization (Oct 1, 2025)
Implemented production build system targeting 90-96% PageSpeed score (from baseline 29%):
- **Production Build**: Vite production build with code splitting (3273 modules, ~30s build time)
- **Compression**: Gzip compression active (73% reduction: 379KB → 100KB for main bundle)
- **Service Worker**: Workbox-powered PWA service worker with runtime caching (133 precache entries, 4.16MB)
- **Cache Strategy**: Immutable caching for hashed assets (1 year max-age), StaleWhileRevalidate for images/attached_assets
- **Code Splitting**: Manual chunks for react-core, ui-components, pdf-processing, ocr, animations, utilities
- **Deployment**: Production workflow configured (`npm run build && npm run start`)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS, shadcn/ui, Radix UI primitives
- **State Management**: TanStack Query
- **Build Tool**: Vite with production optimization (code splitting, PWA service worker)
- **Design System**: Modern gradient theme (Purple to Blue to Cyan), glass morphism, Inter font family, dark/light mode, mobile-first responsive design, custom hexagonal logo.
- **Performance**: Gzip compression (73% reduction), immutable asset caching, Workbox service worker with runtime caching

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **API Design**: RESTful API
- **Storage**: In-memory storage (MemStorage) for current file processing
- **Optimization**: Gzip compression middleware, aggressive caching headers for static assets (1y immutable for hashed files, 30d for images)

### Database
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL with Neon Database serverless driver
- **Schema Management**: Centralized schema definitions
- **Migrations**: Drizzle Kit

### File Processing Strategy
- **Privacy**: 100% client-side processing; files never leave the browser.
- **PDF Compression**: Canvas-based using PDF.js with binary search for exact target sizes (10KB-5MB).
- **PDF Manipulation**: Full suite of PDF tools including compress, reduce size, merge, combine, split, rotate, organize, crop, watermark, page number addition, page removal, and digital signing with drag/resize signatures.
- **PDF to ZIP**: Bundle multiple PDFs into compressed ZIP archives using JSZip with maximum compression (level 9).
- **ZIP to PDF**: Extract PDF files from ZIP archives with selective or batch download capabilities.
- **Document Conversion**: Word to PDF converter (mammoth.js + pdf-lib) with text-focused conversion, basic formatting support (headings, bold), structure preservation (paragraphs, line breaks), formatting inheritance, English/Latin text focus, .docx-only support.
- **Other Features**: PDF password unlocking, JPG to PDF conversion with reordering, QR code generation, password generation, OCR text extraction.

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