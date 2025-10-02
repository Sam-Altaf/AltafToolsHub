# AltafToolsHub - Privacy-First File Processing Tools

## Overview

AltafToolsHub is a production-ready web application offering privacy-first file processing and utility tools. All processing occurs client-side, ensuring user data never leaves the browser. The platform provides a comprehensive suite of PDF tools (compression, merging, splitting, conversion, watermarking, security, etc.), document conversion tools (Word to PDF, PDF to Word), and various utilities like QR code and password generators, and OCR text extraction. Built with React 18 and Express, it features a modern, responsive UI with dark/light modes, animations, and SEO optimization. The project aims to expand its current 28 tools to over 50.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter with dynamic route metadata
- **Styling**: Tailwind CSS, shadcn/ui, Radix UI primitives
- **State Management**: TanStack Query
- **Build Tool**: Vite with production optimizations (code splitting, PWA service worker)
- **Design System**: Modern gradient theme (Purple to Blue to Cyan), glass morphism, Inter font family, dark/light mode, mobile-first responsive design, custom hexagonal logo
- **Performance**: Gzip compression, immutable asset caching, Workbox service worker with runtime caching
- **SEO**: Dynamic metadata injection, JSON-LD structured data, automated sitemap generation

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **API Design**: RESTful API
- **Storage**: In-memory storage (MemStorage) for current file processing
- **Middleware**: 301 redirect handler, security headers, gzip compression
- **Optimization**: Aggressive caching headers for static assets

### Database
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL with Neon Database serverless driver
- **Schema Management**: Centralized schema definitions
- **Migrations**: Drizzle Kit

### File Processing Strategy
- **Privacy**: 100% client-side processing; files never leave the browser.
- **PDF Compression**: Canvas-based using PDF.js with binary search for exact target sizes, including advanced optimizations like device detection for "Turbo Mode" (WebWorker parallel processing) and selective text/image page compression.
- **PDF Manipulation**: Comprehensive tools for compressing, reducing size, merging, combining, splitting, rotating, organizing, cropping, watermarking, adding page numbers, removing pages, and digital signing with drag/resize signatures.
- **PDF to ZIP**: Bundles multiple PDFs into compressed ZIP archives using JSZip.
- **ZIP to PDF**: Extracts PDF files from ZIP archives.
- **Document Conversion**:
    - **Word to PDF**: Uses mammoth.js + pdf-lib for text-focused conversion, basic formatting (headings, bold), structure preservation, and .docx-only support.
    - **PDF to Word**: Advanced conversion using pdf.js + docx library, supporting text extraction, formatting detection, image preservation, table detection via layout analysis, and paragraph structure retention.
- **Other Features**: PDF password unlocking, JPG to PDF conversion with reordering, QR code generation, password generation, and OCR text extraction using Tesseract.js.

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
- **react-hook-form**, **@hookform/resolvers**, **zod**
- **date-fns**
- **clsx**, **nanoid**
- **framer-motion**
- **qrcode**
- **pdf-lib**, **pdfjs-dist**
- **jszip**
- **tesseract.js**
- **mammoth**
- **docx**
- **vite-plugin-pwa**
- **compression**