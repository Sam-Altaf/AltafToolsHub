import { 
  FileText, Lock, Image, Shield, QrCode, Type, 
  FileImage, FilePlus, Scissors, Palette, FileArchive,
  Layers, FileDown, FileUp, Crop, RotateCw, FileX,
  Droplets, Hash, BookOpen, FileSpreadsheet, FileCode,
  Presentation, Book, FileSearch, PenTool, ScanLine,
  Calculator, Zap, Globe, Mail, Download, Upload,
  ChevronRight, LucideIcon
} from "lucide-react";

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  available: boolean;
  category: string;
  popular?: boolean;
  new?: boolean;
  features?: string[];
  extendedDescription?: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  tools: Tool[];
}

// All tools organized by category
export const allTools: Tool[] = [
  // PDF Management Tools
  {
    id: "compress-pdf",
    title: "Compress PDF",
    description: "Reduce PDF file size while maintaining quality",
    icon: FileDown,
    href: "/compress-pdf",
    color: "from-purple-500 to-blue-500",
    available: true,
    category: "pdf-management",
    popular: true,
    features: ["Smart compression", "Target size options", "Quality control", "Batch processing"],
    extendedDescription: "Advanced PDF compression with target sizes from 10KB to 5MB. Perfect for email attachments, web uploads, and storage optimization. Maintains text clarity and image quality."
  },
  {
    id: "reduce-pdf",
    title: "Reduce PDF Size",
    description: "Shrink PDF files to exact target sizes",
    icon: FileDown,
    href: "/reduce-pdf",
    color: "from-purple-600 to-indigo-500",
    available: true,
    category: "pdf-management",
    features: ["Size reduction", "Precise targeting", "Quality preservation", "Fast processing"],
    extendedDescription: "Powerful PDF size reduction with exact targeting from 10KB to 5MB. Ideal for email size limits, cloud storage optimization, and faster file sharing. Intelligent algorithms preserve document quality."
  },
  {
    id: "merge-pdf",
    title: "Merge PDF",
    description: "Combine multiple PDF files into one seamless document",
    icon: FilePlus,
    href: "/merge-pdf",
    color: "from-green-500 to-emerald-500",
    available: true,
    category: "pdf-management",
    features: ["Drag & drop reorder", "Preview before merge", "Unlimited files", "Preserve bookmarks"],
    extendedDescription: "Seamlessly merge multiple PDF files into a single document. Perfect for combining reports, contracts, or chapters into one comprehensive file while preserving formatting and quality."
  },
  {
    id: "combine-pdf",
    title: "Combine PDF",
    description: "Join multiple PDF documents into one unified file",
    icon: FilePlus,
    href: "/combine-pdf",
    color: "from-green-600 to-teal-500",
    available: true,
    category: "pdf-management",
    features: ["Intuitive ordering", "Unite documents", "No file limits", "Maintain quality"],
    extendedDescription: "Effortlessly combine multiple PDF documents into a single unified file. Ideal for joining reports, proposals, or documentation into one cohesive document with drag-and-drop simplicity."
  },
  {
    id: "split-pdf",
    title: "Split PDF",
    description: "Divide PDF files into separate documents by page ranges",
    icon: Scissors,
    href: "/split-pdf",
    color: "from-emerald-500 to-cyan-500",
    available: true,
    category: "pdf-management",
    features: ["Custom page ranges", "Split by size", "Extract single pages", "Batch splitting"],
    extendedDescription: "Split large PDF files into smaller, manageable documents. Extract specific pages or divide by custom ranges for easier sharing and organization."
  },
  {
    id: "crop-pdf",
    title: "Crop PDF",
    description: "Remove unwanted margins and whitespace from PDF pages",
    icon: Crop,
    href: "/crop-pdf",
    color: "from-cyan-500 to-blue-500",
    available: true,
    category: "pdf-management",
    features: ["Visual crop tool", "Auto-detect margins", "Batch cropping", "Custom dimensions"],
    extendedDescription: "Precisely crop PDF pages to remove unnecessary margins, headers, or footers. Ideal for presentations, scanned documents, and optimizing page layouts."
  },
  {
    id: "organize-pdf",
    title: "Organize PDF",
    description: "Rearrange, rotate, and manage PDF pages with ease",
    icon: Layers,
    href: "/organize-pdf",
    color: "from-amber-500 to-orange-500",
    available: true,
    category: "pdf-management",
    features: ["Drag to reorder", "Rotate pages", "Delete unwanted pages", "Thumbnail preview"],
    extendedDescription: "Complete PDF page management tool. Reorder pages by dragging, rotate to correct orientation, and remove unwanted content to create the perfect document."
  },
  {
    id: "rotate-pdf",
    title: "Rotate PDF",
    description: "Fix page orientation issues in your PDF documents",
    icon: RotateCw,
    href: "/rotate-pdf",
    color: "from-orange-500 to-red-500",
    available: true,
    category: "pdf-management",
    features: ["90° rotation", "Rotate all or selected", "Auto-detect orientation", "Batch rotation"],
    extendedDescription: "Quickly fix incorrectly oriented pages in your PDFs. Rotate individual pages or entire documents to ensure proper reading direction."
  },
  {
    id: "remove-pages",
    title: "Remove Pages",
    description: "Delete unwanted pages from your PDF documents",
    icon: FileX,
    href: "/remove-pages",
    color: "from-red-500 to-pink-500",
    available: true,
    category: "pdf-management",
    features: ["Select multiple pages", "Preview before delete", "Range selection", "Keep original"],
    extendedDescription: "Quickly remove unwanted or blank pages from PDFs. Perfect for cleaning up scanned documents or removing confidential pages before sharing."
  },
  {
    id: "extract-pages",
    title: "Extract Pages",
    description: "Save specific pages as separate PDF files",
    icon: FileSearch,
    href: "/extract-pages",
    color: "from-pink-500 to-purple-500",
    available: true,
    category: "pdf-management",
    features: ["Extract single or multiple", "Custom page ranges", "Create new PDF", "Preserve formatting"],
    extendedDescription: "Extract important pages from large PDFs to create focused documents. Ideal for sharing specific sections without sending entire files."
  },
  {
    id: "extract-images",
    title: "Extract Images",
    description: "Save all images from PDFs as separate image files",
    icon: FileImage,
    href: "/extract-images",
    color: "from-indigo-500 to-blue-500",
    available: true,
    category: "pdf-management",
    features: ["Extract all images", "Original quality", "Multiple formats", "Batch extraction"],
    extendedDescription: "Extract embedded images from PDFs while maintaining original quality. Perfect for recovering photos, graphics, and illustrations from documents."
  },
  {
    id: "add-page-number",
    title: "Add Page Numbers",
    description: "Insert customizable page numbers to PDF documents",
    icon: Hash,
    href: "/add-page-number",
    color: "from-blue-500 to-cyan-500",
    available: true,
    category: "pdf-management",
    features: ["Custom position", "Font styles", "Start from any number", "Skip pages option"],
    extendedDescription: "Add professional page numbers to your PDFs with full customization options. Choose position, style, and format for reports and documents."
  },
  {
    id: "watermark-pdf",
    title: "Watermark PDF",
    description: "Protect documents with custom text or image watermarks",
    icon: Droplets,
    href: "/watermark-pdf",
    color: "from-teal-500 to-green-500",
    available: true,
    category: "pdf-management",
    features: ["Text & image watermarks", "Transparency control", "Position options", "Batch watermarking"],
    extendedDescription: "Add professional watermarks to protect your intellectual property. Apply custom text or logos with adjustable opacity and positioning."
  },

  // Image Conversion Tools
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF",
    description: "Convert JPG images to PDF documents",
    icon: Image,
    href: "/jpg-to-pdf",
    color: "from-cyan-500 to-teal-500",
    available: true,
    category: "image-conversion",
    popular: true,
    features: ["Multiple images", "Reorder pages", "Auto orientation", "Quality settings"],
    extendedDescription: "Convert single or multiple JPG images into professional PDF documents. Perfect for creating photo albums, portfolios, or digitizing scanned documents with preserved image quality."
  },
  {
    id: "images-to-pdf",
    title: "Images to PDF",
    description: "Convert PNG, GIF, BMP, TIFF images to PDF documents",
    icon: FileImage,
    href: "/images-to-pdf",
    color: "from-green-500 to-emerald-500",
    available: false,
    category: "image-conversion",
    features: ["Multiple formats", "Batch conversion", "Page arrangement", "Size optimization"],
    extendedDescription: "Convert various image formats into PDF documents with smart page arrangement. Support for PNG, GIF, BMP, TIFF, and more. Perfect for creating multi-page documents from mixed image formats."
  },
  {
    id: "pdf-to-images",
    title: "PDF to Images",
    description: "Export PDF pages as PNG, JPG, or WEBP image formats",
    icon: FileImage,
    href: "/pdf-to-images",
    color: "from-emerald-500 to-cyan-500",
    available: true,
    category: "image-conversion",
    popular: true,
    new: true,
    features: ["Multiple formats", "Quality settings", "Page selection", "Batch export"],
    extendedDescription: "Convert PDF pages into high-quality images. Choose from PNG, JPG, WEBP formats with customizable resolution. Ideal for presentations, thumbnails, or web graphics."
  },
  {
    id: "pdf-to-jpg",
    title: "PDF to JPG",
    description: "Convert PDF pages to high-quality JPG images",
    icon: Image,
    href: "/pdf-to-jpg",
    color: "from-teal-500 to-green-500",
    available: true,
    category: "image-conversion",
    popular: true,
    new: true,
    features: ["High resolution", "Compression control", "Page range selection", "Bulk export"],
    extendedDescription: "Transform PDF pages into JPG images with adjustable quality. Perfect for creating image galleries, social media posts, or web-ready graphics from PDFs."
  },
  {
    id: "pdf-to-png",
    title: "PDF to PNG",
    description: "Convert PDF pages to lossless PNG images with transparency",
    icon: Image,
    href: "/pdf-to-png",
    color: "from-blue-500 to-purple-500",
    available: true,
    category: "image-conversion",
    popular: true,
    new: true,
    features: ["Lossless quality", "Transparency support", "High resolution", "Perfect for graphics"],
    extendedDescription: "Extract PDF pages as lossless PNG images with transparency support. Ideal for logos, diagrams, screenshots, and graphics requiring perfect quality preservation."
  },
  {
    id: "heic-to-pdf",
    title: "HEIC/HEIF to PDF",
    description: "Convert iPhone/iPad photos to universally compatible PDFs",
    icon: Image,
    href: "/heic-to-pdf",
    color: "from-purple-500 to-pink-500",
    available: false,
    category: "image-conversion",
    features: ["iOS photo support", "Quality preservation", "Batch conversion", "Metadata retention"],
    extendedDescription: "Convert Apple's HEIC/HEIF photo format to PDFs for easy sharing and compatibility. Maintains photo quality and metadata while ensuring universal accessibility."
  },
  {
    id: "tiff-to-pdf",
    title: "TIFF to PDF",
    description: "Convert TIFF images to PDF documents",
    icon: FileImage,
    href: "/tiff-to-pdf",
    color: "from-indigo-500 to-purple-500",
    available: false,
    category: "image-conversion"
  },
  {
    id: "avif-to-pdf",
    title: "AVIF to PDF",
    description: "Convert AVIF images to PDF format",
    icon: FileImage,
    href: "/avif-to-pdf",
    color: "from-pink-500 to-red-500",
    available: false,
    category: "image-conversion"
  },
  {
    id: "png-to-pdf",
    title: "PNG to PDF",
    description: "Convert PNG images to PDF documents with quality preservation",
    icon: Image,
    href: "/png-to-pdf",
    color: "from-blue-500 to-indigo-500",
    available: true,
    category: "image-conversion",
    popular: true,
    features: ["Transparency support", "Batch conversion", "Reorder pages", "Quality preservation"],
    extendedDescription: "Convert single or multiple PNG images into professional PDF documents. Preserves transparency and image quality. Perfect for screenshots, graphics, and digitizing documents with lossless quality."
  },
  {
    id: "webp-to-pdf",
    title: "WebP to PDF",
    description: "Convert WebP images to PDF format",
    icon: FileImage,
    href: "/webp-to-pdf",
    color: "from-cyan-500 to-blue-500",
    available: false,
    category: "image-conversion"
  },
  {
    id: "svg-to-pdf",
    title: "SVG to PDF",
    description: "Convert vector graphics to PDF format",
    icon: FileCode,
    href: "/svg-to-pdf",
    color: "from-amber-500 to-orange-500",
    available: false,
    category: "image-conversion"
  },

  // Document Conversion Tools
  {
    id: "word-to-pdf",
    title: "Word to PDF",
    description: "Convert Microsoft Word documents to PDF",
    icon: FileText,
    href: "/word-to-pdf",
    color: "from-blue-600 to-blue-500",
    available: true,
    category: "document-conversion",
    popular: true,
    features: ["Browser-based conversion", "Basic formatting support", "No file uploads", "English/Latin text"],
    extendedDescription: "Convert Microsoft Word documents (.docx) to PDF format directly in your browser. Text-focused conversion with basic formatting support (headings, bold text). Best for English/Latin text documents."
  },
  {
    id: "pdf-to-word",
    title: "PDF to Word",
    description: "Convert PDF files to editable Word documents",
    icon: FileText,
    href: "/pdf-to-word",
    color: "from-blue-500 to-cyan-500",
    available: true,
    category: "document-conversion",
    popular: true,
    features: ["Text extraction", "Image preservation", "Table detection", "Format retention"],
    extendedDescription: "Convert PDF documents to editable Word files (DOCX) with intelligent layout analysis. Extracts text with formatting, embeds images, and reconstructs tables while preserving document structure."
  },
  {
    id: "excel-to-pdf",
    title: "Excel to PDF",
    description: "Convert Excel spreadsheets to PDF format",
    icon: FileSpreadsheet,
    href: "/excel-to-pdf",
    color: "from-green-600 to-green-500",
    available: false,
    category: "document-conversion"
  },
  {
    id: "pdf-to-excel",
    title: "PDF to Excel",
    description: "Extract tables from PDF to Excel format",
    icon: FileSpreadsheet,
    href: "/pdf-to-excel",
    color: "from-green-500 to-emerald-500",
    available: false,
    category: "document-conversion"
  },
  {
    id: "powerpoint-to-pdf",
    title: "PowerPoint to PDF",
    description: "Convert presentations to PDF format",
    icon: Presentation,
    href: "/powerpoint-to-pdf",
    color: "from-red-600 to-orange-500",
    available: false,
    category: "document-conversion"
  },
  {
    id: "pdf-to-powerpoint",
    title: "PDF to PowerPoint",
    description: "Convert PDF to editable presentations",
    icon: Presentation,
    href: "/pdf-to-powerpoint",
    color: "from-orange-500 to-amber-500",
    available: false,
    category: "document-conversion"
  },
  {
    id: "txt-to-pdf",
    title: "TXT to PDF",
    description: "Convert plain text files to PDF format",
    icon: FileText,
    href: "/txt-to-pdf",
    color: "from-gray-600 to-gray-500",
    available: false,
    category: "document-conversion"
  },
  {
    id: "pdf-to-text",
    title: "PDF to Text",
    description: "Extract text content from PDF files",
    icon: FileText,
    href: "/pdf-to-text",
    color: "from-gray-500 to-slate-500",
    available: false,
    category: "document-conversion"
  },
  {
    id: "html-to-pdf",
    title: "HTML to PDF",
    description: "Convert web pages to PDF documents",
    icon: FileCode,
    href: "/html-to-pdf",
    color: "from-orange-500 to-red-500",
    available: false,
    category: "document-conversion"
  },
  {
    id: "pdf-to-html",
    title: "PDF to HTML",
    description: "Convert PDF files to HTML format",
    icon: FileCode,
    href: "/pdf-to-html",
    color: "from-red-500 to-pink-500",
    available: false,
    category: "document-conversion"
  },

  // eBook Conversion Tools
  {
    id: "epub-to-pdf",
    title: "EPUB to PDF",
    description: "Convert eBook files to PDF format",
    icon: Book,
    href: "/epub-to-pdf",
    color: "from-purple-600 to-purple-500",
    available: false,
    category: "ebook-conversion"
  },
  {
    id: "pdf-to-epub",
    title: "PDF to EPUB",
    description: "Convert PDF to eBook format",
    icon: Book,
    href: "/pdf-to-epub",
    color: "from-purple-500 to-pink-500",
    available: false,
    category: "ebook-conversion"
  },
  {
    id: "mobi-to-pdf",
    title: "MOBI to PDF",
    description: "Convert Kindle books to PDF format",
    icon: BookOpen,
    href: "/mobi-to-pdf",
    color: "from-orange-600 to-orange-500",
    available: false,
    category: "ebook-conversion"
  },
  {
    id: "pdf-to-mobi",
    title: "PDF to MOBI",
    description: "Convert PDF to Kindle format",
    icon: BookOpen,
    href: "/pdf-to-mobi",
    color: "from-orange-500 to-amber-500",
    available: false,
    category: "ebook-conversion"
  },
  {
    id: "azw-to-pdf",
    title: "AZW/AZW3 to PDF",
    description: "Convert Amazon eBooks to PDF",
    icon: Book,
    href: "/azw-to-pdf",
    color: "from-blue-600 to-indigo-500",
    available: false,
    category: "ebook-conversion"
  },
  {
    id: "fb2-to-pdf",
    title: "FB2 to PDF",
    description: "Convert FictionBook to PDF format",
    icon: BookOpen,
    href: "/fb2-to-pdf",
    color: "from-cyan-600 to-cyan-500",
    available: false,
    category: "ebook-conversion"
  },
  {
    id: "djvu-to-pdf",
    title: "DJVU to PDF",
    description: "Convert DJVU documents to PDF",
    icon: Book,
    href: "/djvu-to-pdf",
    color: "from-green-600 to-green-500",
    available: false,
    category: "ebook-conversion"
  },

  // Security Tools
  {
    id: "unlock-pdf",
    title: "Unlock PDF",
    description: "Remove password protection from PDFs",
    icon: Lock,
    href: "/unlock-pdf",
    color: "from-blue-500 to-cyan-500",
    available: true,
    category: "security",
    popular: true,
    features: ["Password removal", "Batch unlock", "Secure processing", "Instant unlock"],
    extendedDescription: "Safely remove password protection from your own PDF files. All processing happens locally in your browser for maximum security and privacy. Perfect for forgotten passwords."
  },
  {
    id: "protect-pdf",
    title: "Protect PDF",
    description: "Secure PDFs with password encryption and permissions",
    icon: Shield,
    href: "/protect-pdf",
    color: "from-red-500 to-pink-500",
    available: true,
    category: "security",
    popular: true,
    features: ["256-bit encryption", "Permission settings", "Owner password", "Print restrictions"],
    extendedDescription: "Add military-grade password protection to your sensitive PDFs. Set permissions for printing, copying, and editing. Perfect for confidential documents and secure sharing."
  },
  {
    id: "sign-pdf",
    title: "Sign PDF",
    description: "Add legally binding digital signatures to documents",
    icon: PenTool,
    href: "/sign-pdf",
    color: "from-indigo-500 to-purple-500",
    available: true,
    category: "security",
    popular: true,
    features: ["Draw signature", "Type signature", "Upload signature", "Date & time stamps"],
    extendedDescription: "Create and apply digital signatures to PDFs for contracts and agreements. Draw, type, or upload your signature with automatic timestamp verification."
  },
  {
    id: "redact-pdf",
    title: "Redact PDF",
    description: "Permanently remove sensitive information",
    icon: FileX,
    href: "/redact-pdf",
    color: "from-gray-600 to-gray-500",
    available: false,
    category: "security"
  },

  // Utility Tools
  {
    id: "qr-generator",
    title: "QR Generator",
    description: "Generate QR codes from text or URLs",
    icon: QrCode,
    href: "/qr-generator",
    color: "from-indigo-500 to-purple-600",
    available: true,
    category: "utilities",
    new: true,
    features: ["Custom colors", "Logo embedding", "Bulk generation", "Various formats"],
    extendedDescription: "Create professional QR codes instantly for URLs, WiFi, contact info, and more. Customize colors and sizes, download in multiple formats. Perfect for marketing materials and business cards."
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description: "Create strong, secure passwords",
    icon: Shield,
    href: "/password-generator",
    color: "from-emerald-500 to-teal-600",
    available: true,
    category: "utilities",
    new: true,
    features: ["Custom length", "Special characters", "Pronounceable", "Strength meter"],
    extendedDescription: "Generate ultra-secure passwords with customizable complexity. Include symbols, numbers, and mixed case. Features password strength analysis and easy copy-to-clipboard functionality."
  },
  {
    id: "extract-text",
    title: "Extract Text (OCR)",
    description: "Extract text from images using OCR",
    icon: ScanLine,
    href: "/extract-text",
    color: "from-cyan-500 to-blue-500",
    available: true,
    category: "utilities",
    new: true,
    features: ["Multiple languages", "Batch processing", "Handwriting recognition", "Export formats"],
    extendedDescription: "Extract text from images, scanned documents, and photos using advanced OCR technology. Supports 100+ languages and handwritten text. Export to Word, PDF, or plain text formats."
  },
  {
    id: "pdf-to-zip",
    title: "PDF to ZIP",
    description: "Bundle multiple PDFs into a compressed ZIP archive",
    icon: FileArchive,
    href: "/pdf-to-zip",
    color: "from-indigo-500 to-purple-500",
    available: true,
    category: "utilities",
    features: ["Batch compression", "Folder structure", "Size reduction", "Password protection"],
    extendedDescription: "Combine multiple PDF files into a single compressed ZIP archive for easy sharing and storage. Reduces overall file size while maintaining organization."
  },
  {
    id: "zip-to-pdf",
    title: "ZIP to PDF",
    description: "Extract PDF files from ZIP archives instantly",
    icon: Upload,
    href: "/zip-to-pdf",
    color: "from-purple-500 to-indigo-500",
    available: true,
    category: "utilities",
    new: true,
    features: ["Extract all PDFs", "Selective extraction", "Batch download", "Preview before download"],
    extendedDescription: "Extract and download PDF files from ZIP archives quickly. Perfect for accessing compressed document collections, email attachments, and archived files."
  },
  {
    id: "base64-encoder",
    title: "Base64 Encoder",
    description: "Encode and decode Base64 strings",
    icon: FileCode,
    href: "/base64-encoder",
    color: "from-amber-500 to-orange-500",
    available: false,
    category: "utilities"
  },
  {
    id: "url-shortener",
    title: "URL Shortener",
    description: "Create short links for long URLs",
    icon: Globe,
    href: "/url-shortener",
    color: "from-blue-500 to-indigo-500",
    available: false,
    category: "utilities"
  },
  {
    id: "email-validator",
    title: "Email Validator",
    description: "Validate and verify email addresses",
    icon: Mail,
    href: "/email-validator",
    color: "from-green-500 to-teal-500",
    available: false,
    category: "utilities"
  }
];

// Tool categories for navigation
export const toolCategories: ToolCategory[] = [
  {
    id: "pdf-management",
    name: "PDF Management",
    description: "Edit, organize, and manipulate PDF files",
    icon: FileText,
    tools: allTools.filter(tool => tool.category === "pdf-management")
  },
  {
    id: "image-conversion",
    name: "Image Conversion",
    description: "Convert between images and PDF formats",
    icon: Image,
    tools: allTools.filter(tool => tool.category === "image-conversion")
  },
  {
    id: "document-conversion",
    name: "Document Conversion",
    description: "Convert between document formats",
    icon: FileText,
    tools: allTools.filter(tool => tool.category === "document-conversion")
  },
  {
    id: "ebook-conversion",
    name: "eBook Conversion",
    description: "Convert between eBook formats",
    icon: Book,
    tools: allTools.filter(tool => tool.category === "ebook-conversion")
  },
  {
    id: "security",
    name: "Security",
    description: "Protect and secure your documents",
    icon: Shield,
    tools: allTools.filter(tool => tool.category === "security")
  },
  {
    id: "utilities",
    name: "Utilities",
    description: "Additional helpful tools",
    icon: Zap,
    tools: allTools.filter(tool => tool.category === "utilities")
  }
];

// Get popular tools
export const popularTools = allTools.filter(tool => tool.popular);

// Get available tools
export const availableTools = allTools.filter(tool => tool.available);

// Get coming soon tools
export const comingSoonTools = allTools.filter(tool => !tool.available);

// Get new tools
export const newTools = allTools.filter(tool => tool.new);

// Search tools function
export function searchTools(query: string): Tool[] {
  const searchTerm = query.toLowerCase();
  return allTools.filter(tool => 
    tool.title.toLowerCase().includes(searchTerm) ||
    tool.description.toLowerCase().includes(searchTerm) ||
    tool.category.toLowerCase().includes(searchTerm)
  );
}

// Get tool by ID
export function getToolById(id: string): Tool | undefined {
  return allTools.find(tool => tool.id === id);
}

// Get tools by category
export function getToolsByCategory(categoryId: string): Tool[] {
  return allTools.filter(tool => tool.category === categoryId);
}

// Stats for the platform
export const platformStats = {
  totalTools: allTools.length,
  availableTools: availableTools.length,
  comingSoonTools: comingSoonTools.length,
  categories: toolCategories.length,
  popularTools: popularTools.length
};