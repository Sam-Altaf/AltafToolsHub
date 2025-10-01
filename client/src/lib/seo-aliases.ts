import { RedirectLandingSEO } from "@/components/redirect-landing";

export interface SEOAlias {
  path: string;
  targetPath: string;
  heading: string;
  subheading: string;
  seo: RedirectLandingSEO;
}

export const seoAliases: SEOAlias[] = [
  // JPG to PDF aliases
  {
    path: "/jpg-to-pdf-converter",
    targetPath: "/jpg-to-pdf",
    heading: "JPG to PDF Converter",
    subheading: "Convert your JPG images to PDF format instantly. Free, secure, and 100% browser-based.",
    seo: {
      title: "JPG to PDF Converter - Free Online Tool | AltafToolsHub",
      description: "Convert JPG images to PDF files instantly with our free online converter. No upload required, 100% private, works in your browser. Batch convert multiple images to PDF.",
      keywords: "jpg to pdf converter, convert jpg to pdf, jpg to pdf online, image to pdf converter, photo to pdf",
    },
  },
  {
    path: "/image-to-pdf",
    targetPath: "/jpg-to-pdf",
    heading: "Image to PDF Converter",
    subheading: "Convert any image format to PDF. Support for JPG, JPEG, PNG, and more.",
    seo: {
      title: "Image to PDF Converter - Convert Photos to PDF Online Free",
      description: "Free online image to PDF converter. Convert JPG, PNG, JPEG, and other images to PDF format. No registration, fully private, browser-based processing.",
      keywords: "image to pdf, convert image to pdf, photo to pdf converter, pictures to pdf, jpg png to pdf",
    },
  },
  {
    path: "/jpeg-to-pdf",
    targetPath: "/jpg-to-pdf",
    heading: "JPEG to PDF Converter",
    subheading: "Quickly convert JPEG images to PDF documents with perfect quality.",
    seo: {
      title: "JPEG to PDF Converter Online - Free & Secure | AltafToolsHub",
      description: "Convert JPEG images to PDF instantly. Free online tool with no upload, 100% browser-based processing. Reorder images, batch convert, and download instantly.",
      keywords: "jpeg to pdf, convert jpeg to pdf, jpeg to pdf online, jpeg to pdf converter free",
    },
  },

  // PDF to JPG aliases
  {
    path: "/pdf-to-jpg-converter",
    targetPath: "/pdf-to-jpg",
    heading: "PDF to JPG Converter",
    subheading: "Extract pages from PDF and save as high-quality JPG images.",
    seo: {
      title: "PDF to JPG Converter - Convert PDF Pages to Images Free",
      description: "Convert PDF to JPG images online free. Extract all pages or specific pages as JPG files. High quality, secure, and 100% browser-based processing.",
      keywords: "pdf to jpg, convert pdf to jpg, pdf to jpg converter, pdf to image, pdf to jpeg",
    },
  },
  {
    path: "/convert-pdf-to-jpg",
    targetPath: "/pdf-to-jpg",
    heading: "Convert PDF to JPG",
    subheading: "Transform PDF documents into JPG images with perfect quality preservation.",
    seo: {
      title: "Convert PDF to JPG Online Free - High Quality Image Extraction",
      description: "Free tool to convert PDF files to JPG images. Extract individual pages or all pages as JPG. Privacy-first, no upload required, works offline.",
      keywords: "convert pdf to jpg online, pdf to jpg free, pdf to jpeg converter, extract images from pdf",
    },
  },
  {
    path: "/pdf-to-jpeg",
    targetPath: "/pdf-to-jpg",
    heading: "PDF to JPEG Converter",
    subheading: "Export PDF pages as JPEG images for easy sharing and editing.",
    seo: {
      title: "PDF to JPEG - Convert PDF Documents to JPEG Images Online",
      description: "Convert PDF to JPEG format online. Free, secure, and instant conversion. Choose specific pages or convert entire PDF to JPEG images.",
      keywords: "pdf to jpeg, pdf to jpeg converter, convert pdf to jpeg online, pdf to jpeg free",
    },
  },

  // PDF to PNG aliases
  {
    path: "/pdf-to-png-converter",
    targetPath: "/pdf-to-png",
    heading: "PDF to PNG Converter",
    subheading: "Convert PDF pages to PNG images with transparency support.",
    seo: {
      title: "PDF to PNG Converter - Convert PDF to PNG Images Online Free",
      description: "Convert PDF to PNG format online. High-quality PNG extraction with transparency support. Free, secure, and 100% browser-based.",
      keywords: "pdf to png, convert pdf to png, pdf to png converter, pdf to png online free",
    },
  },
  {
    path: "/convert-pdf-to-png",
    targetPath: "/pdf-to-png",
    heading: "Convert PDF to PNG",
    subheading: "Export PDF pages as PNG images with full transparency and quality.",
    seo: {
      title: "Convert PDF to PNG Online - Free PDF to PNG Image Converter",
      description: "Free online tool to convert PDF files to PNG images. Preserve transparency, extract all pages, and download instantly. No registration required.",
      keywords: "convert pdf to png online, pdf to png free, pdf to png converter online, pdf to transparent png",
    },
  },

  // Merge PDF aliases
  {
    path: "/merge-pdf-files",
    targetPath: "/merge-pdf",
    heading: "Merge PDF Files",
    subheading: "Combine multiple PDF documents into one seamless file.",
    seo: {
      title: "Merge PDF Files Online Free - Combine PDFs into One Document",
      description: "Merge multiple PDF files into a single document. Free online PDF merger with drag & drop reordering. Secure, fast, and 100% browser-based.",
      keywords: "merge pdf files, combine pdf, join pdf files, merge pdf online free, pdf merger",
    },
  },
  {
    path: "/join-pdf",
    targetPath: "/merge-pdf",
    heading: "Join PDF Files",
    subheading: "Join multiple PDFs into a single unified document effortlessly.",
    seo: {
      title: "Join PDF Files Online - Merge Multiple PDFs into One Free",
      description: "Free tool to join PDF files online. Combine multiple PDFs, reorder pages, and create a single document. Private and secure processing.",
      keywords: "join pdf, join pdf files, combine pdf files, merge pdf documents, pdf joiner online",
    },
  },

  // Combine PDF aliases
  {
    path: "/combine-pdf-files",
    targetPath: "/combine-pdf",
    heading: "Combine PDF Files",
    subheading: "Unite multiple PDF documents into one comprehensive file.",
    seo: {
      title: "Combine PDF Files - Merge PDFs into Single Document Online Free",
      description: "Combine multiple PDF files into one document online. Free PDF combiner with drag & drop. No file size limits, fully secure and private.",
      keywords: "combine pdf files, combine pdf online, merge pdf, join multiple pdfs, pdf combiner free",
    },
  },

  // Split PDF aliases
  {
    path: "/split-pdf-pages",
    targetPath: "/split-pdf",
    heading: "Split PDF Pages",
    subheading: "Divide PDF into separate documents or extract specific page ranges.",
    seo: {
      title: "Split PDF Pages - Divide PDF into Multiple Files Online Free",
      description: "Split PDF files by pages online. Extract specific pages or divide into multiple documents. Free, secure, and instant PDF splitting.",
      keywords: "split pdf, split pdf pages, divide pdf, extract pages from pdf, pdf splitter online",
    },
  },
  {
    path: "/divide-pdf",
    targetPath: "/split-pdf",
    heading: "Divide PDF",
    subheading: "Separate large PDFs into smaller, manageable documents.",
    seo: {
      title: "Divide PDF Online - Split PDF into Multiple Files Free",
      description: "Free online tool to divide PDF files. Split by page ranges, extract specific pages, or create multiple documents. 100% browser-based.",
      keywords: "divide pdf, separate pdf pages, split pdf into multiple files, pdf divider online",
    },
  },

  // Unlock PDF aliases
  {
    path: "/remove-pdf-password",
    targetPath: "/unlock-pdf",
    heading: "Remove PDF Password",
    subheading: "Unlock password-protected PDFs and remove restrictions instantly.",
    seo: {
      title: "Remove PDF Password - Unlock Protected PDFs Online Free",
      description: "Remove password from PDF files online. Unlock password-protected PDFs instantly. Free, secure, and works entirely in your browser.",
      keywords: "remove pdf password, unlock pdf, remove pdf protection, decrypt pdf, unlock pdf online",
    },
  },
  {
    path: "/unlock-pdf-password",
    targetPath: "/unlock-pdf",
    heading: "Unlock PDF Password",
    subheading: "Remove password protection and access your PDF files.",
    seo: {
      title: "Unlock PDF Password - Remove PDF Security Online Free Tool",
      description: "Unlock password-protected PDF files online for free. Remove PDF password restrictions and access your documents instantly. Private and secure.",
      keywords: "unlock pdf password, remove pdf password online, pdf password remover, unlock protected pdf",
    },
  },

  // QR Code Generator aliases
  {
    path: "/qr-code-generator",
    targetPath: "/qr-generator",
    heading: "QR Code Generator",
    subheading: "Create custom QR codes for URLs, text, contact info, and more.",
    seo: {
      title: "QR Code Generator - Create Free QR Codes Online | AltafToolsHub",
      description: "Free online QR code generator. Create custom QR codes for URLs, text, WiFi, contact info, and more. Download as PNG or SVG instantly.",
      keywords: "qr code generator, create qr code, qr code maker, generate qr code free, custom qr code",
    },
  },
  {
    path: "/create-qr-code",
    targetPath: "/qr-generator",
    heading: "Create QR Code",
    subheading: "Design and generate QR codes with custom colors and logos.",
    seo: {
      title: "Create QR Code Online Free - Custom QR Code Maker",
      description: "Create custom QR codes online. Add logos, change colors, and generate QR codes for any purpose. Free, instant, and high-quality downloads.",
      keywords: "create qr code online, make qr code, qr code creator, design qr code, custom qr code generator",
    },
  },
  {
    path: "/make-qr-code",
    targetPath: "/qr-generator",
    heading: "Make QR Code",
    subheading: "Quickly make professional QR codes for your business or personal use.",
    seo: {
      title: "Make QR Code - Free Online QR Code Creator & Generator",
      description: "Make QR codes online for free. Generate QR codes for websites, contact cards, WiFi, and more. Instant download in multiple formats.",
      keywords: "make qr code, qr code maker online, generate qr code, qr code builder, free qr code",
    },
  },

  // Watermark PDF aliases
  {
    path: "/add-watermark-to-pdf",
    targetPath: "/watermark-pdf",
    heading: "Add Watermark to PDF",
    subheading: "Protect your PDF documents with custom text or image watermarks.",
    seo: {
      title: "Add Watermark to PDF - Free PDF Watermarking Tool Online",
      description: "Add text or image watermarks to PDF files online for free. Customize position, transparency, and style. Secure and browser-based processing.",
      keywords: "add watermark to pdf, pdf watermark, watermark pdf online, add text to pdf, pdf watermarking tool",
    },
  },
  {
    path: "/pdf-watermark-maker",
    targetPath: "/watermark-pdf",
    heading: "PDF Watermark Maker",
    subheading: "Create professional watermarks for your PDF documents.",
    seo: {
      title: "PDF Watermark Maker - Add Custom Watermarks to PDFs Free",
      description: "Free PDF watermark maker. Add custom text or image watermarks to protect your documents. Adjust opacity, position, and style instantly.",
      keywords: "pdf watermark maker, create pdf watermark, add watermark pdf online, pdf watermarking",
    },
  },

  // Rotate PDF aliases
  {
    path: "/rotate-pdf-pages",
    targetPath: "/rotate-pdf",
    heading: "Rotate PDF Pages",
    subheading: "Fix page orientation and rotate PDF pages 90, 180, or 270 degrees.",
    seo: {
      title: "Rotate PDF Pages Online Free - Fix PDF Page Orientation",
      description: "Rotate PDF pages online. Fix incorrectly oriented pages, rotate all or specific pages 90°, 180°, or 270°. Free and instant processing.",
      keywords: "rotate pdf, rotate pdf pages, fix pdf orientation, rotate pdf online free, pdf rotator",
    },
  },

  // Organize PDF aliases
  {
    path: "/rearrange-pdf-pages",
    targetPath: "/organize-pdf",
    heading: "Rearrange PDF Pages",
    subheading: "Reorder, rotate, and organize your PDF pages with drag & drop.",
    seo: {
      title: "Rearrange PDF Pages - Reorder & Organize PDFs Online Free",
      description: "Rearrange PDF pages online with drag & drop. Reorder pages, rotate, and organize your PDF documents. Free, fast, and secure.",
      keywords: "rearrange pdf pages, reorder pdf, organize pdf pages, sort pdf pages, pdf page organizer",
    },
  },

  // Crop PDF aliases
  {
    path: "/crop-pdf-pages",
    targetPath: "/crop-pdf",
    heading: "Crop PDF Pages",
    subheading: "Remove margins and unwanted areas from PDF pages.",
    seo: {
      title: "Crop PDF Pages Online Free - Remove PDF Margins & Whitespace",
      description: "Crop PDF pages online. Remove margins, headers, footers, and unwanted areas. Free PDF cropping tool with visual preview.",
      keywords: "crop pdf, crop pdf pages, remove pdf margins, trim pdf, pdf cropper online",
    },
  },

  // Extract Pages aliases
  {
    path: "/extract-pdf-pages",
    targetPath: "/extract-pages",
    heading: "Extract PDF Pages",
    subheading: "Extract and save specific pages from PDF as separate documents.",
    seo: {
      title: "Extract PDF Pages - Save Specific Pages as New PDF Free",
      description: "Extract pages from PDF online. Save specific pages or page ranges as separate PDF files. Free, secure, and instant extraction.",
      keywords: "extract pdf pages, extract pages from pdf, save pdf pages, pdf page extractor online",
    },
  },

  // Extract Images aliases
  {
    path: "/extract-images-from-pdf",
    targetPath: "/extract-images",
    heading: "Extract Images from PDF",
    subheading: "Save all embedded images from PDFs as separate image files.",
    seo: {
      title: "Extract Images from PDF - Download PDF Images Online Free",
      description: "Extract images from PDF files online. Save all embedded images in original quality. Support for JPG, PNG formats. Free and instant.",
      keywords: "extract images from pdf, pdf image extractor, save images from pdf, get images from pdf",
    },
  },

  // Remove Pages aliases
  {
    path: "/delete-pdf-pages",
    targetPath: "/remove-pages",
    heading: "Delete PDF Pages",
    subheading: "Remove unwanted pages from your PDF documents.",
    seo: {
      title: "Delete PDF Pages Online Free - Remove Pages from PDF",
      description: "Delete pages from PDF files online. Remove unwanted, blank, or specific pages. Free PDF page remover with instant processing.",
      keywords: "delete pdf pages, remove pages from pdf, delete pages in pdf, pdf page remover online",
    },
  },

  // Add Page Numbers aliases
  {
    path: "/add-page-numbers-to-pdf",
    targetPath: "/add-page-number",
    heading: "Add Page Numbers to PDF",
    subheading: "Insert customizable page numbers to your PDF documents.",
    seo: {
      title: "Add Page Numbers to PDF - Free PDF Page Numbering Tool",
      description: "Add page numbers to PDF online for free. Customize position, format, and style. Perfect for reports, books, and documents.",
      keywords: "add page numbers to pdf, pdf page numbering, number pdf pages, insert page numbers pdf",
    },
  },

  // Protect PDF aliases
  {
    path: "/password-protect-pdf",
    targetPath: "/protect-pdf",
    heading: "Password Protect PDF",
    subheading: "Secure your PDF files with password encryption.",
    seo: {
      title: "Password Protect PDF - Secure PDFs with Encryption Free",
      description: "Password protect PDF files online for free. Add password encryption and security to your documents. 100% browser-based and private.",
      keywords: "password protect pdf, encrypt pdf, secure pdf, add password to pdf, pdf password protection",
    },
  },

  // Password Generator aliases
  {
    path: "/secure-password-generator",
    targetPath: "/password-generator",
    heading: "Secure Password Generator",
    subheading: "Create strong, random passwords for maximum security.",
    seo: {
      title: "Secure Password Generator - Create Strong Random Passwords Free",
      description: "Generate secure, random passwords online. Customize length, characters, and strength. Free password generator for maximum security.",
      keywords: "password generator, secure password generator, random password, strong password generator",
    },
  },

  // Extract Text aliases
  {
    path: "/extract-text-from-pdf",
    targetPath: "/extract-text",
    heading: "Extract Text from PDF",
    subheading: "Extract and copy text content from PDF documents using OCR.",
    seo: {
      title: "Extract Text from PDF - OCR PDF Text Extraction Online Free",
      description: "Extract text from PDF files using OCR technology. Convert scanned PDFs to editable text. Free, accurate, and browser-based.",
      keywords: "extract text from pdf, pdf to text, ocr pdf, pdf text extraction, copy text from pdf",
    },
  },
  {
    path: "/pdf-to-text",
    targetPath: "/extract-text",
    heading: "PDF to Text Converter",
    subheading: "Convert PDF documents to plain text with OCR technology.",
    seo: {
      title: "PDF to Text Converter - Extract Text from PDF Online Free",
      description: "Convert PDF to text online. Extract text from scanned PDFs using OCR. Free, accurate, and instant conversion.",
      keywords: "pdf to text, convert pdf to text, pdf text converter, extract text from scanned pdf",
    },
  },

  // PDF to ZIP aliases
  {
    path: "/convert-pdf-to-zip",
    targetPath: "/pdf-to-zip",
    heading: "Convert PDF to ZIP",
    subheading: "Bundle multiple PDFs into a compressed ZIP archive.",
    seo: {
      title: "PDF to ZIP - Compress Multiple PDFs into ZIP Archive Free",
      description: "Convert PDF files to ZIP archive online. Bundle multiple PDFs with maximum compression. Free, fast, and secure.",
      keywords: "pdf to zip, compress pdf to zip, create zip from pdf, pdf zip archive",
    },
  },

  // ZIP to PDF aliases
  {
    path: "/extract-pdf-from-zip",
    targetPath: "/zip-to-pdf",
    heading: "Extract PDF from ZIP",
    subheading: "Extract and download PDF files from ZIP archives.",
    seo: {
      title: "Extract PDF from ZIP - Unzip and Download PDFs Online Free",
      description: "Extract PDF files from ZIP archives online. Unzip and download PDFs with selective extraction. Free and instant processing.",
      keywords: "extract pdf from zip, unzip pdf, zip to pdf, extract files from zip online",
    },
  },

  // PDF to Images aliases
  {
    path: "/convert-pdf-to-images",
    targetPath: "/pdf-to-images",
    heading: "Convert PDF to Images",
    subheading: "Export PDF pages as images in multiple formats (JPG, PNG, WebP).",
    seo: {
      title: "PDF to Images Converter - Convert PDF to JPG, PNG Online Free",
      description: "Convert PDF to images online. Export pages as JPG, PNG, or WebP. Choose quality and format. Free and instant conversion.",
      keywords: "pdf to images, convert pdf to images, pdf to jpg png, pdf image converter online",
    },
  },
];
