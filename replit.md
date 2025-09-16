# AltafToolsHub - Privacy-First File Processing Tools

## Overview

AltafToolsHub is a comprehensive web application offering privacy-first file processing and utility tools. All file processing happens 100% client-side, ensuring complete privacy as files never leave the user's browser. The platform features PDF tools (compression with intelligent target sizes, password unlocking, JPG to PDF conversion) and utility tools (QR code generator, password generator, word counter). Built with React 18 and Express, it provides a modern, responsive interface with dark/light mode support, professional animations, and SEO optimization for 2025.

## Recent Updates (December 2024)

### Major Features Added
- **All Tools Page (September 2025)**: Created comprehensive All Tools section displaying all 60+ tools with filters for categories, availability status (Available/Coming Soon), search, and view modes (grid/list). Added to main navigation for easy discovery.
- **Enhanced Tool Descriptions (September 2025)**: Added extended descriptions and feature lists to all available tools for better UI/UX and SEO optimization. Tool cards now display rich content including features and category information.
- **Highest Quality PDF Compression (September 2025)**: Enhanced PDF compressor with "Highest Quality" mode featuring maximum text clarity using 0.92-0.99 JPEG quality and 0.96-1.0 scale for superior text readability
- **PDF Compressor Complete Fix (January 2025)**: Rebuilt with PDF.js canvas-based compression, real progress bar, exact target size achievement through binary search, and local worker for true offline/privacy
- **Password Toggle**: Show/hide password functionality for PDF unlocker with eye icon
- **Complete UI/UX Redesign**: Modern gradient theme with glass morphism effects, uniform card layouts, and professional animations
- **Custom Logo**: Hexagonal hub design with integrated tool icons representing the multi-tool nature of the platform
- **Dark/Light Mode**: Complete theme system with system preference detection and persistence
- **Responsive Navigation**: Mobile-optimized hamburger menu and desktop navigation with dropdowns
- **Privacy Compliance**: Cookie consent popup, comprehensive privacy policy, and terms of service pages
- **New Tools Added**: QR Code Generator, Password Generator, and Word Counter - all with 100% client-side processing
- **SEO Optimization**: Complete 2025 SEO implementation with structured data, meta tags, sitemap, and performance optimizations

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system based on shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom styling for accessibility and consistency
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful API structure with /api prefix routing
- **Development**: Hot module reloading with Vite integration in development mode
- **Storage Interface**: Modular storage abstraction with in-memory implementation

### Design System
- **Color Scheme**: Modern gradient-based theme (Purple #8B5CF6 to Blue #3B82F6 to Cyan #06B6D4), Teal accents (#14B8A6)
- **Visual Effects**: Glass morphism effects with backdrop blur for modern aesthetic
- **Typography**: Inter font family from Google Fonts with improved hierarchy
- **Components**: shadcn/ui component library with custom gradient theming and animations
- **Responsive Design**: Mobile-first approach with breakpoints at 640px, 768px, 1024px, 1280px
- **Theme System**: Dark/light mode with system preference detection and localStorage persistence
- **Logo**: Custom hexagonal hub design with integrated tool icons and gradient colors

### Database Integration
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon Database serverless driver
- **Schema Management**: Centralized schema definitions in shared directory
- **Migrations**: Drizzle Kit for database migration management

### File Processing Strategy
- **Privacy Focus**: Client-side processing to ensure files never leave user's browser
- **File Handling**: Browser-based file manipulation without server uploads
- **Security**: No server-side file storage or processing for maximum privacy
- **PDF Compression**: Canvas-based compression using PDF.js with exact target size options (10KB-5MB) through binary search algorithm, converts to optimized images for maximum compression
- **Password Features**: PDF unlocking with password show/hide toggle
- **Image Conversion**: Multiple JPG to PDF conversion with reordering support

## External Dependencies

### Core Framework Dependencies
- **@vitejs/plugin-react**: React plugin for Vite build system
- **wouter**: Lightweight routing library for React applications
- **@tanstack/react-query**: Server state management and caching

### UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Utility for creating variant-based component APIs
- **lucide-react**: Icon library for consistent iconography

### Database and Backend
- **drizzle-orm**: Type-safe ORM for database operations
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-kit**: Database migration and schema management tools
- **express**: Web application framework for Node.js

### Development Tools
- **typescript**: Static type checking for JavaScript
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **esbuild**: Fast JavaScript bundler for production builds

### Form and Validation
- **react-hook-form**: Performant forms with easy validation
- **@hookform/resolvers**: Validation resolver for react-hook-form
- **zod**: TypeScript-first schema validation library

### Utility Libraries
- **date-fns**: Modern JavaScript date utility library
- **clsx**: Utility for constructing className strings conditionally
- **nanoid**: URL-safe unique string ID generator
- **framer-motion**: Professional animation library for React
- **qrcode**: Client-side QR code generation
- **pdf-lib**: PDF manipulation library for client-side processing
- **pdfjs-dist**: PDF.js library for rendering and processing PDFs