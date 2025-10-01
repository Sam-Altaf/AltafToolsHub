# AltafToolsHub - Privacy-First File Processing Tools

## Overview

AltafToolsHub is a web application providing privacy-first file processing and utility tools. All file processing occurs client-side, ensuring user privacy as files never leave the browser. Key features include comprehensive PDF tools (compression, size reduction, password unlocking, signing, JPG to PDF conversion, PDF to JPG/PNG/Images conversion with format choice, merging, combining, splitting, rotating, organizing, watermarking, page manipulation, image extraction, ZIP bundling, and PDF extraction from ZIP), document conversion tools (Word to PDF with text-focused basic formatting), and utility tools (QR code generator, password generator, OCR text extraction). Built with React 18 and Express, it offers a modern, responsive interface with dark/light mode, animations, and SEO optimization. The platform currently has 27 functional tools with plans for over 50 more.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS, shadcn/ui, Radix UI primitives
- **State Management**: TanStack Query
- **Build Tool**: Vite
- **Design System**: Modern gradient theme (Purple to Blue to Cyan), glass morphism, Inter font family, dark/light mode, mobile-first responsive design, custom hexagonal logo.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **API Design**: RESTful API
- **Storage**: In-memory storage (MemStorage) for current file processing.

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