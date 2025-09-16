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
    id: "merge-pdf",
    title: "Merge PDF",
    description: "Combine multiple PDF files into one document",
    icon: FilePlus,
    href: "/merge-pdf",
    color: "from-green-500 to-emerald-500",
    available: false,
    category: "pdf-management"
  },
  {
    id: "split-pdf",
    title: "Split PDF",
    description: "Split PDF files by pages or custom ranges",
    icon: Scissors,
    href: "/split-pdf",
    color: "from-emerald-500 to-cyan-500",
    available: false,
    category: "pdf-management"
  },
  {
    id: "crop-pdf",
    title: "Crop PDF",
    description: "Crop PDF pages to remove unwanted areas",
    icon: Crop,
    href: "/crop-pdf",
    color: "from-cyan-500 to-blue-500",
    available: false,
    category: "pdf-management"
  },
  {
    id: "organize-pdf",
    title: "Organize PDF",
    description: "Reorder, rotate, and delete pages",
    icon: Layers,
    href: "/organize-pdf",
    color: "from-amber-500 to-orange-500",
    available: false,
    category: "pdf-management"
  },
  {
    id: "rotate-pdf",
    title: "Rotate PDF",
    description: "Rotate PDF pages to correct orientation",
    icon: RotateCw,
    href: "/rotate-pdf",
    color: "from-orange-500 to-red-500",
    available: false,
    category: "pdf-management"
  },
  {
    id: "remove-pages",
    title: "Remove Pages",
    description: "Delete specific pages from PDF files",
    icon: FileX,
    href: "/remove-pages",
    color: "from-red-500 to-pink-500",
    available: false,
    category: "pdf-management"
  },
  {
    id: "extract-pages",
    title: "Extract Pages",
    description: "Extract specific pages from PDF files",
    icon: FileSearch,
    href: "/extract-pages",
    color: "from-pink-500 to-purple-500",
    available: false,
    category: "pdf-management"
  },
  {
    id: "extract-images",
    title: "Extract Images",
    description: "Extract all images from PDF documents",
    icon: FileImage,
    href: "/extract-images",
    color: "from-indigo-500 to-blue-500",
    available: false,
    category: "pdf-management"
  },
  {
    id: "add-page-number",
    title: "Add Page Numbers",
    description: "Add page numbers to PDF documents",
    icon: Hash,
    href: "/add-page-number",
    color: "from-blue-500 to-cyan-500",
    available: false,
    category: "pdf-management"
  },
  {
    id: "watermark-pdf",
    title: "Watermark PDF",
    description: "Add text or image watermarks to protect PDFs",
    icon: Droplets,
    href: "/watermark-pdf",
    color: "from-teal-500 to-green-500",
    available: false,
    category: "pdf-management"
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
    description: "Convert multiple image formats to PDF",
    icon: FileImage,
    href: "/images-to-pdf",
    color: "from-green-500 to-emerald-500",
    available: false,
    category: "image-conversion"
  },
  {
    id: "pdf-to-images",
    title: "PDF to Images",
    description: "Convert PDF pages to various image formats",
    icon: FileImage,
    href: "/pdf-to-images",
    color: "from-emerald-500 to-cyan-500",
    available: false,
    category: "image-conversion"
  },
  {
    id: "pdf-to-jpg",
    title: "PDF to JPG",
    description: "Extract JPG images from PDF pages",
    icon: Image,
    href: "/pdf-to-jpg",
    color: "from-teal-500 to-green-500",
    available: false,
    category: "image-conversion",
    popular: true
  },
  {
    id: "heic-to-pdf",
    title: "HEIC/HEIF to PDF",
    description: "Convert iPhone photos to PDF format",
    icon: Image,
    href: "/heic-to-pdf",
    color: "from-purple-500 to-pink-500",
    available: false,
    category: "image-conversion"
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
    description: "Convert PNG images to PDF documents",
    icon: Image,
    href: "/png-to-pdf",
    color: "from-blue-500 to-indigo-500",
    available: false,
    category: "image-conversion"
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
    available: false,
    category: "document-conversion",
    popular: true
  },
  {
    id: "pdf-to-word",
    title: "PDF to Word",
    description: "Convert PDF files to editable Word documents",
    icon: FileText,
    href: "/pdf-to-word",
    color: "from-blue-500 to-cyan-500",
    available: false,
    category: "document-conversion",
    popular: true
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
    description: "Add password protection to PDF files",
    icon: Shield,
    href: "/protect-pdf",
    color: "from-red-500 to-pink-500",
    available: false,
    category: "security"
  },
  {
    id: "sign-pdf",
    title: "Sign PDF",
    description: "Add digital signatures to PDF documents",
    icon: PenTool,
    href: "/sign-pdf",
    color: "from-indigo-500 to-purple-500",
    available: false,
    category: "security"
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
    popular: true,
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
    popular: true,
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
    description: "Compress multiple PDFs into ZIP archive",
    icon: FileArchive,
    href: "/pdf-to-zip",
    color: "from-indigo-500 to-purple-500",
    available: false,
    category: "utilities"
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