/**
 * Comprehensive tool descriptions for SEO and user information
 * Each description is 200+ words explaining the tool's features, benefits, and use cases
 */

export interface ToolDescription {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  useCases: string[];
  technicalDetails?: string;
  privacyNote: string;
}

export const toolDescriptions: Record<string, ToolDescription> = {
  'compress-pdf': {
    id: 'compress-pdf',
    title: 'Advanced PDF Compression Tool',
    shortDescription: 'Reduce PDF file size while maintaining quality',
    fullDescription: `Our advanced PDF compression tool employs state-of-the-art algorithms to dramatically reduce file sizes while preserving document quality. This sophisticated tool analyzes every element of your PDF - from embedded images and fonts to vector graphics and metadata - optimizing each component for maximum compression efficiency.

    The compression engine uses intelligent algorithms that differentiate between text, images, and graphics, applying optimal compression techniques to each element type. For images, we employ advanced JPEG compression with customizable quality settings, while text and vector graphics are optimized using lossless compression methods to ensure perfect clarity.

    What sets our tool apart is the ability to target specific file sizes. Whether you need to compress a PDF to exactly 100KB for an email attachment or reduce it to 1MB for a web upload, our precision targeting ensures you get the exact size you need without unnecessary quality loss. The tool also provides real-time preview capabilities, allowing you to see the compression results before downloading.

    All processing happens entirely in your browser using WebAssembly technology, meaning your sensitive documents never leave your device. This client-side processing ensures complete privacy and security while delivering professional-grade compression results comparable to desktop software.`,
    features: [
      'Target specific file sizes (10KB to 5MB)',
      'Intelligent content-aware compression',
      'Batch processing for multiple files',
      'Real-time compression preview',
      'Maintains document structure and formatting',
      'Preserves text searchability',
      'Optimizes embedded images and fonts',
      'No quality loss for text elements'
    ],
    useCases: [
      'Email attachments with size limits',
      'Website upload requirements',
      'Storage space optimization',
      'Faster document sharing',
      'Mobile device storage management',
      'Cloud storage optimization'
    ],
    technicalDetails: 'Uses advanced algorithms including JPEG2000 for images, Flate compression for text, and intelligent font subsetting. Employs multi-pass optimization to achieve target sizes.',
    privacyNote: '100% browser-based processing. Your files never touch our servers and remain completely private.'
  },

  'merge-pdf': {
    id: 'merge-pdf',
    title: 'Professional PDF Merger',
    shortDescription: 'Combine multiple PDF files into one document',
    fullDescription: `Our professional PDF merger tool provides a seamless solution for combining multiple PDF documents into a single, organized file. This powerful tool is designed for both personal and professional use, offering intuitive drag-and-drop functionality with advanced organizational features.

    The merger preserves all original formatting, including fonts, images, layouts, and interactive elements like hyperlinks and form fields. It intelligently handles different page sizes and orientations, automatically adjusting the final document for consistency. The tool supports unlimited file merging with no restrictions on the number of pages or file sizes, making it ideal for large-scale document consolidation projects.

    Beyond simple concatenation, our merger offers sophisticated page management features. You can reorder pages with visual thumbnails, rotate individual pages to correct orientation, and remove unwanted pages before finalizing the merge. The tool also maintains document metadata and bookmarks, creating a professional final document with preserved navigation structure.

    The entire merging process occurs locally in your browser, utilizing advanced JavaScript and WebAssembly technologies. This ensures lightning-fast processing speeds while maintaining complete privacy - your confidential documents never leave your computer, eliminating any security concerns associated with cloud-based services.`,
    features: [
      'Unlimited PDF merging',
      'Drag-and-drop page reordering',
      'Visual page preview thumbnails',
      'Maintains all formatting and hyperlinks',
      'Preserves bookmarks and metadata',
      'Handles mixed page orientations',
      'Batch processing capability',
      'Custom page range selection'
    ],
    useCases: [
      'Consolidating reports and presentations',
      'Creating unified project documentation',
      'Combining scanned documents',
      'Assembling legal documents',
      'Merging invoices and receipts',
      'Creating comprehensive portfolios'
    ],
    privacyNote: 'All merging happens in your browser. Files are processed locally without any server uploads.'
  },

  'split-pdf': {
    id: 'split-pdf',
    title: 'Intelligent PDF Splitter',
    shortDescription: 'Extract pages or divide PDFs into multiple files',
    fullDescription: `Our intelligent PDF splitter offers precise control over document division, allowing you to extract specific pages or split large PDFs into manageable sections. This versatile tool supports multiple splitting methods to accommodate various document management needs.

    The splitter provides three primary modes: page range extraction for selecting specific sections, fixed page splitting for dividing documents into equal parts, and custom splitting for creating multiple documents with specific page combinations. Each mode offers visual page previews, ensuring accurate selection before processing. The tool maintains all original document properties, including formatting, images, fonts, and interactive elements.

    For complex documents, the splitter offers advanced features like bookmark-based splitting, which automatically divides documents at chapter or section boundaries. It can also split by file size, creating multiple documents that meet specific size requirements for email or upload limits. The tool preserves document hierarchy and navigation, ensuring split documents remain professionally structured.

    Processing occurs entirely within your browser using cutting-edge web technologies. This local processing approach guarantees maximum speed and complete privacy, as your documents never leave your device. The tool can handle documents of any size, from single-page extractions to splitting thousand-page manuscripts.`,
    features: [
      'Multiple splitting modes (range, fixed, custom)',
      'Visual page selection with thumbnails',
      'Bookmark-based automatic splitting',
      'Size-based splitting for upload limits',
      'Batch processing for multiple splits',
      'Preserves all formatting and links',
      'Custom naming for output files',
      'Preview before splitting'
    ],
    useCases: [
      'Extracting specific chapters or sections',
      'Creating separate documents for distribution',
      'Meeting upload size requirements',
      'Organizing large document archives',
      'Preparing documents for printing',
      'Sharing relevant portions only'
    ],
    privacyNote: 'Completely secure browser-based splitting. No data transmission to external servers.'
  },

  'jpg-to-pdf': {
    id: 'jpg-to-pdf',
    title: 'JPG to PDF Converter',
    shortDescription: 'Convert JPG images to professional PDF documents',
    fullDescription: `Transform your JPG images into professional PDF documents with our comprehensive conversion tool. Designed for photographers, designers, and business professionals, this converter maintains image quality while providing extensive customization options for the final PDF output.

    The converter supports both single and batch conversions, allowing you to create individual PDFs or combine multiple images into a single document. Advanced image processing ensures optimal quality retention, with options for resolution adjustment, color space management, and compression levels. The tool automatically detects image orientation and can rotate images to ensure proper viewing in the final PDF.

    Organization features include drag-and-drop reordering, automatic page sizing to match images, and options for adding margins or fitting images to standard page sizes. For professional presentations, the tool offers layout templates, allowing you to arrange multiple images per page with customizable spacing and borders. Metadata preservation ensures EXIF data and other image information is retained in the PDF.

    All conversion processing happens directly in your browser, leveraging modern web APIs and PDF generation libraries. This approach ensures rapid conversion speeds while maintaining complete privacy - your images and resulting PDFs never leave your device, making it ideal for handling sensitive or confidential visual content.`,
    features: [
      'Single and batch image conversion',
      'Quality preservation with adjustable compression',
      'Automatic orientation detection',
      'Multiple layout options (fit, fill, custom)',
      'Drag-and-drop page ordering',
      'Standard page size templates',
      'Margin and padding controls',
      'EXIF data preservation'
    ],
    useCases: [
      'Creating photo portfolios',
      'Converting scanned documents',
      'Preparing presentation materials',
      'Archiving image collections',
      'Creating printable documents',
      'Professional photography deliverables'
    ],
    privacyNote: 'Images are converted locally in your browser with zero server interaction.'
  },

  'pdf-to-jpg': {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG Image Extractor',
    shortDescription: 'Convert PDF pages to high-quality JPG images',
    fullDescription: `Convert your PDF documents into high-quality JPG images with our professional extraction tool. This powerful converter transforms each page of your PDF into individual image files, perfect for presentations, web publishing, or image editing applications.

    The extraction process offers granular control over output quality and resolution. Choose from preset quality levels or specify exact DPI settings for print-ready images. The tool supports both RGB and CMYK color spaces, ensuring accurate color reproduction for different use cases. Advanced rendering technology faithfully reproduces complex PDF elements including gradients, transparency, and vector graphics as rasterized images.

    Flexible export options allow you to convert all pages or select specific ranges. For large documents, the batch processing engine efficiently handles hundreds of pages while providing real-time progress updates. Each extracted image can be customized with different quality settings, and you can preview results before downloading to ensure they meet your requirements.

    The entire conversion process runs locally in your browser using sophisticated PDF rendering engines compiled to WebAssembly. This ensures professional-quality results comparable to desktop software while maintaining complete privacy - your PDFs and extracted images never leave your device, making it perfect for confidential documents.`,
    features: [
      'High-resolution image extraction (up to 600 DPI)',
      'Adjustable JPEG quality settings',
      'Page range selection',
      'Batch processing with progress tracking',
      'Color space preservation (RGB/CMYK)',
      'Automatic file naming and numbering',
      'Preview before download',
      'Maintains aspect ratios'
    ],
    useCases: [
      'Creating website graphics from PDFs',
      'Extracting slides for presentations',
      'Social media content creation',
      'Document thumbnails generation',
      'Image editing preparation',
      'Creating preview images'
    ],
    privacyNote: 'PDF rendering and conversion happen entirely in your browser for complete security.'
  },

  'protect-pdf': {
    id: 'protect-pdf',
    title: 'PDF Security & Encryption Tool',
    shortDescription: 'Secure PDFs with passwords and permissions',
    fullDescription: `Safeguard your sensitive PDF documents with military-grade encryption and comprehensive permission controls. Our PDF protection tool implements industry-standard AES-256 encryption, providing multiple layers of security to ensure your documents remain confidential and tamper-proof.

    The tool offers two-level password protection: user passwords for viewing documents and owner passwords for controlling permissions. Set granular permissions including printing restrictions, copy/paste prevention, form filling limitations, and modification blocks. These controls ensure recipients can only interact with your document in approved ways, maintaining document integrity and preventing unauthorized distribution.

    Advanced security features include digital certificate support for encrypted key exchange, watermark addition for visual protection, and metadata scrubbing to remove hidden information. The tool can also add expiration dates to documents, automatically restricting access after specified timeframes. For compliance requirements, it supports various encryption standards including RC4 and AES at different key lengths.

    All encryption processing occurs locally in your browser using cryptographically secure libraries. Your passwords and documents never leave your device, ensuring that even we cannot access your protected files. This zero-knowledge architecture provides peace of mind when handling confidential business documents, legal contracts, or personal information.`,
    features: [
      'AES-256 military-grade encryption',
      'Dual password protection (user/owner)',
      'Granular permission controls',
      'Print and copy restrictions',
      'Digital certificate support',
      'Watermark addition',
      'Document expiration dates',
      'Metadata removal for privacy'
    ],
    useCases: [
      'Protecting confidential business documents',
      'Securing legal contracts',
      'Controlling document distribution',
      'Compliance with data protection regulations',
      'Preventing unauthorized modifications',
      'Secure document sharing'
    ],
    privacyNote: 'Encryption happens locally in your browser. Passwords and documents remain completely private.'
  },

  'unlock-pdf': {
    id: 'unlock-pdf',
    title: 'PDF Password Remover',
    shortDescription: 'Remove restrictions and passwords from PDFs',
    fullDescription: `Regain full access to your PDF documents by removing passwords and restrictions with our PDF unlocking tool. Designed for legitimate use on documents you own or have permission to modify, this tool removes various PDF restrictions while maintaining document integrity and quality.

    The unlocker handles multiple types of PDF protection, including user passwords that prevent opening, owner passwords that restrict editing, and permission flags that limit printing, copying, or form filling. It works with PDFs encrypted using various standards, from older 40-bit RC4 to modern 256-bit AES encryption. The tool preserves all document content, formatting, and embedded elements while removing restrictive flags.

    For workflow efficiency, the tool supports batch processing, allowing you to unlock multiple documents simultaneously. It automatically detects the type of protection applied and removes appropriate restrictions while maintaining document structure. The process is intelligent enough to preserve beneficial features like form fields and digital signatures while removing only the restrictive elements.

    Processing occurs entirely within your browser using JavaScript-based PDF libraries. This ensures your documents and any passwords you provide never leave your device, maintaining complete confidentiality. The tool is designed for recovering access to your own documents when passwords are forgotten or when you need to remove restrictions from legitimately obtained files.`,
    features: [
      'Removes user and owner passwords',
      'Eliminates printing restrictions',
      'Enables copying and text selection',
      'Unlocks form filling capabilities',
      'Preserves document quality',
      'Batch unlocking support',
      'Maintains all content and formatting',
      'Works with various encryption standards'
    ],
    useCases: [
      'Recovering forgotten passwords',
      'Removing restrictions from owned documents',
      'Enabling printing for archived files',
      'Allowing text extraction for research',
      'Preparing documents for editing',
      'Streamlining document workflows'
    ],
    privacyNote: 'Unlocking is performed locally in your browser. Documents never leave your device.'
  },

  'qr-generator': {
    id: 'qr-generator',
    title: 'Professional QR Code Generator',
    shortDescription: 'Create customized QR codes for any purpose',
    fullDescription: `Generate professional QR codes instantly with our comprehensive QR code creation tool. Supporting multiple data types and extensive customization options, this generator creates scannable codes optimized for both print and digital media.

    The generator supports diverse QR code types including URLs, plain text, email addresses, phone numbers, SMS messages, WiFi credentials, vCard contacts, and cryptocurrency addresses. Each type is optimized with appropriate data encoding to minimize code complexity while maintaining scan reliability. Advanced error correction levels ensure codes remain scannable even when partially damaged or obscured.

    Customization options extend beyond basic generation. Design your QR codes with custom colors, gradient fills, and rounded corners to match brand aesthetics. Add logos or images to the center while maintaining scannability through intelligent redundancy algorithms. Choose from various output formats including PNG, JPEG, SVG, and PDF, with resolution options suitable for everything from business cards to billboard displays.

    All QR code generation happens instantly in your browser using JavaScript libraries. This client-side approach ensures rapid generation without server delays while maintaining privacy - generated codes and embedded data never leave your device. Perfect for creating codes containing sensitive information like WiFi passwords or private URLs.`,
    features: [
      'Multiple QR code types (URL, text, email, WiFi, etc.)',
      'Custom colors and gradients',
      'Logo embedding capability',
      'Variable error correction levels',
      'Multiple export formats (PNG, JPEG, SVG, PDF)',
      'Batch generation support',
      'Size optimization for different media',
      'Real-time preview'
    ],
    useCases: [
      'Marketing campaigns and advertisements',
      'Business card contact information',
      'Restaurant menu links',
      'WiFi credential sharing',
      'Event ticketing and check-ins',
      'Product packaging and labels'
    ],
    privacyNote: 'QR codes are generated entirely in your browser. No data is sent to servers.'
  },

  'password-generator': {
    id: 'password-generator',
    title: 'Secure Password Generator',
    shortDescription: 'Create strong, unique passwords instantly',
    fullDescription: `Generate cryptographically secure passwords tailored to your security requirements with our advanced password generator. Using true random number generation and customizable complexity rules, this tool creates unbreakable passwords for all your accounts and applications.

    The generator employs cryptographically secure random number generators (CSRNG) available in modern browsers, ensuring true randomness rather than predictable pseudo-random sequences. Choose from multiple password strategies including random characters, pronounceable passwords for easier memorization, passphrase generation using word lists, and pattern-based passwords that meet specific site requirements.

    Customization options cover every aspect of password creation. Set precise length requirements, include or exclude character types (uppercase, lowercase, numbers, symbols), avoid ambiguous characters for better readability, and exclude specific characters that certain systems don't accept. The tool can generate multiple passwords simultaneously and includes a strength meter that calculates entropy and estimated crack time.

    All password generation occurs locally in your browser using the Web Crypto API. Generated passwords are never transmitted, logged, or stored anywhere, ensuring complete security. The tool includes convenient features like one-click copying and QR code generation for secure password transfer to mobile devices, all while maintaining a zero-knowledge architecture.`,
    features: [
      'Cryptographically secure generation',
      'Customizable length (1-256 characters)',
      'Character type selection',
      'Pronounceable password option',
      'Passphrase generation',
      'Strength analysis and entropy calculation',
      'Bulk password generation',
      'One-click secure copying'
    ],
    useCases: [
      'Creating account passwords',
      'Generating secure API keys',
      'Setting up service credentials',
      'Creating memorable passphrases',
      'Bulk user account creation',
      'Secure token generation'
    ],
    privacyNote: 'Passwords are generated using local cryptographic functions. Nothing is ever transmitted or stored.'
  },

  'extract-text': {
    id: 'extract-text',
    title: 'OCR Text Extraction Tool',
    shortDescription: 'Extract text from images and scanned PDFs',
    fullDescription: `Extract text from images and scanned documents with our powerful OCR (Optical Character Recognition) tool. Utilizing advanced machine learning algorithms, this tool converts visual text into editable, searchable content with remarkable accuracy across multiple languages and document types.

    The OCR engine employs state-of-the-art neural network models trained on millions of documents, achieving high accuracy even with challenging inputs like handwritten text, low-quality scans, or complex layouts. It supports over 100 languages including Latin, Cyrillic, Arabic, and Asian scripts, with automatic language detection for multi-language documents. The tool handles various image formats (JPEG, PNG, TIFF, BMP) and can process scanned PDFs page by page.

    Advanced preprocessing enhances recognition accuracy. The tool automatically corrects image skew, enhances contrast, removes noise, and separates text regions from graphics. For complex documents, it preserves layout structure, maintaining columns, tables, and formatting. Output options include plain text, formatted text with preserved styling, and searchable PDFs where text is embedded as a hidden layer.

    All OCR processing happens directly in your browser using WebAssembly-compiled Tesseract.js. This ensures your documents remain completely private while delivering desktop-quality OCR results. The tool can process everything from business cards to full books without any data leaving your device.`,
    features: [
      'Support for 100+ languages',
      'Automatic language detection',
      'Handwriting recognition',
      'Layout preservation',
      'Table extraction',
      'Batch processing capability',
      'Multiple output formats',
      'Image preprocessing and enhancement'
    ],
    useCases: [
      'Digitizing printed documents',
      'Converting scanned PDFs to searchable text',
      'Extracting text from photos',
      'Creating accessible documents',
      'Data extraction from forms',
      'Archiving historical documents'
    ],
    privacyNote: 'OCR processing runs entirely in your browser. Images and text never leave your device.'
  },

  'crop-pdf': {
    id: 'crop-pdf',
    title: 'PDF Page Cropper',
    shortDescription: 'Remove margins and unwanted areas from PDFs',
    fullDescription: `Precisely crop PDF pages to remove unwanted margins, headers, footers, or any specific areas with our intuitive PDF cropping tool. Perfect for optimizing documents for reading devices, presentations, or print layouts, this tool offers pixel-perfect control over page dimensions.

    The cropper provides multiple selection methods including manual area selection with visual guides, automatic margin detection that identifies and removes white space, and preset crop templates for common formats like removing headers/footers or converting to specific aspect ratios. The visual interface displays real-time previews, allowing you to see exactly how your cropped document will appear before processing.

    Advanced features include batch cropping where the same crop area can be applied to multiple pages or entire documents, individual page cropping for documents with varying layouts, and smart content detection that ensures important content isn't accidentally removed. The tool maintains vector quality for text and graphics while properly handling embedded images and preserving internal links and bookmarks.

    All cropping operations are performed locally in your browser using PDF manipulation libraries. This ensures instant processing without upload delays while maintaining complete privacy - your documents never leave your device. The tool can handle documents of any size, from single-page flyers to extensive manuscripts.`,
    features: [
      'Visual crop area selection',
      'Automatic margin detection',
      'Batch cropping for multiple pages',
      'Preset crop templates',
      'Real-time preview',
      'Maintains vector quality',
      'Preserves links and bookmarks',
      'Undo/redo functionality'
    ],
    useCases: [
      'Removing unnecessary margins for e-readers',
      'Preparing slides from PDF presentations',
      'Extracting specific content areas',
      'Optimizing PDFs for mobile viewing',
      'Creating consistent page layouts',
      'Removing headers and footers'
    ],
    privacyNote: 'Cropping is performed entirely in your browser for maximum privacy and speed.'
  },

  'rotate-pdf': {
    id: 'rotate-pdf',
    title: 'PDF Page Rotation Tool',
    shortDescription: 'Rotate PDF pages to correct orientation',
    fullDescription: `Correct page orientation issues quickly and easily with our PDF rotation tool. Whether dealing with incorrectly scanned documents, mixed orientation pages, or documents that need reorientation for specific uses, this tool provides comprehensive rotation capabilities with visual feedback.

    The rotation tool offers multiple operation modes. Rotate individual pages by selecting specific pages and applying 90, 180, or 270-degree rotations. Use batch rotation to apply the same rotation to all pages or page ranges. The automatic orientation detection feature can identify and correct pages that are sideways or upside down, particularly useful for large scanned document batches.

    The visual interface displays thumbnail previews of all pages, making it easy to identify which pages need rotation. You can rotate pages individually with simple click controls or select multiple pages for simultaneous rotation. The tool preserves all document properties including text selectability, hyperlinks, form fields, and annotations while only adjusting the viewing orientation.

    Processing happens entirely within your browser using PDF manipulation libraries compiled to WebAssembly. This local processing approach ensures immediate results without server round-trips while maintaining complete document privacy. Your PDFs never leave your device, making it safe for rotating confidential or sensitive documents.`,
    features: [
      'Individual page rotation',
      'Batch rotation for multiple pages',
      'Automatic orientation detection',
      'Visual thumbnail previews',
      '90, 180, 270-degree rotation options',
      'Preserves all document properties',
      'Keyboard shortcuts for quick rotation',
      'Portrait/landscape detection'
    ],
    useCases: [
      'Fixing scanned document orientation',
      'Correcting mixed orientation pages',
      'Preparing documents for specific viewers',
      'Standardizing document layouts',
      'Rotating pages for printing',
      'Adjusting mobile-unfriendly orientations'
    ],
    privacyNote: 'Page rotation is processed locally in your browser with no external data transfer.'
  },

  'add-page-number': {
    id: 'add-page-number',
    title: 'PDF Page Numbering Tool',
    shortDescription: 'Add professional page numbers to PDF documents',
    fullDescription: `Add professional page numbers to your PDF documents with complete control over positioning, formatting, and style. This comprehensive numbering tool transforms plain PDFs into properly paginated documents suitable for professional reports, books, and academic papers.

    The tool offers extensive customization options for page number format and appearance. Choose from various numbering styles including Arabic numerals, Roman numerals, or letters. Format options include simple numbers, "Page X", "Page X of Y", or custom formats with prefixes and suffixes. Position numbers anywhere on the page with pixel-precise control, using presets for common positions (top/bottom, left/center/right) or custom coordinates.

    Advanced features accommodate complex documents. Set different numbering schemes for different sections, skip numbering on specific pages like cover pages or blank pages, and start numbering from any value. The tool can handle existing page numbers by overlaying or replacing them. For professional documents, customize font family, size, color, and add backgrounds or borders to make page numbers stand out or blend seamlessly.

    All page numbering is applied locally in your browser using PDF manipulation libraries. This ensures your documents remain completely private while the tool adds numbering with the same precision as desktop publishing software. The process preserves all original document content and formatting while adding the pagination layer.`,
    features: [
      'Multiple numbering formats (Arabic, Roman, letters)',
      'Flexible positioning options',
      'Custom number formatting',
      'Font and style customization',
      'Section-based numbering',
      'Skip pages option',
      'Starting number selection',
      'Batch processing support'
    ],
    useCases: [
      'Preparing academic papers',
      'Creating professional reports',
      'Book and manuscript formatting',
      'Legal document preparation',
      'Presentation handouts',
      'Archive organization'
    ],
    privacyNote: 'Page numbers are added locally in your browser. Documents never leave your device.'
  },

  'watermark-pdf': {
    id: 'watermark-pdf',
    title: 'PDF Watermark Tool',
    shortDescription: 'Add text or image watermarks to protect PDFs',
    fullDescription: `Protect and brand your PDF documents with professional watermarks using our comprehensive watermarking tool. Add text or image watermarks with precise control over appearance, positioning, and transparency to ensure your documents are properly identified while maintaining readability.

    The tool supports both text and image watermarks with extensive customization options. Text watermarks can include static text, dynamic elements like dates or page numbers, and multiple lines with different formatting. Choose from system fonts or upload custom fonts, adjust size, color, rotation angle, and transparency. Image watermarks support logos, signatures, or stamps in various formats (PNG, JPEG, SVG) with smart scaling to maintain aspect ratios.

    Positioning options ensure watermarks appear exactly where needed. Use preset positions, create custom layouts with multiple watermarks per page, or apply different watermarks to odd/even pages. The opacity control allows watermarks to be subtle background elements or prominent overlays. Advanced blending modes ensure watermarks integrate well with document content without obscuring important information.

    All watermarking happens locally in your browser using PDF and image manipulation libraries. Your documents and watermark images never leave your device, ensuring complete confidentiality. This is especially important when watermarking sensitive business documents or adding security markers to confidential materials.`,
    features: [
      'Text and image watermarks',
      'Custom fonts and styling',
      'Adjustable transparency',
      'Multiple positioning options',
      'Rotation and scaling controls',
      'Batch watermarking',
      'Dynamic text elements',
      'Multiple watermarks per page'
    ],
    useCases: [
      'Branding company documents',
      'Adding copyright notices',
      'Marking documents as drafts or confidential',
      'Preventing unauthorized distribution',
      'Adding digital signatures',
      'Creating letterhead effects'
    ],
    privacyNote: 'Watermarks are applied locally in your browser. Files remain completely private.'
  },

  'organize-pdf': {
    id: 'organize-pdf',
    title: 'PDF Page Organizer',
    shortDescription: 'Reorder, delete, and rearrange PDF pages',
    fullDescription: `Take complete control over your PDF document structure with our intuitive page organization tool. Designed for users who need to restructure documents, combine content from multiple sources, or create custom page arrangements, this tool provides visual drag-and-drop functionality with professional results.

    The organizer displays all pages as interactive thumbnails, allowing you to see your document structure at a glance. Drag and drop pages to reorder them, creating the perfect flow for presentations, reports, or combined documents. Select multiple pages for bulk operations like moving page groups, reversing page order, or creating custom sequences. The tool supports complex reorganization patterns including interleaving pages from different sections or creating alternating page layouts.

    Beyond simple reordering, the tool offers comprehensive page management. Delete unwanted pages, duplicate important ones, or extract specific pages to create new documents. The undo/redo functionality allows experimentation without fear of mistakes. For large documents, use the zoom controls and page navigation to efficiently manage hundreds of pages. The tool maintains all page properties including annotations, form fields, and hyperlinks during reorganization.

    All page organization happens directly in your browser using JavaScript PDF libraries. This ensures instant response times for drag-and-drop operations while maintaining complete privacy - your documents never leave your device. The tool can handle documents of any size, from simple reordering tasks to complex document restructuring projects.`,
    features: [
      'Visual drag-and-drop interface',
      'Thumbnail page previews',
      'Multi-page selection',
      'Page deletion and duplication',
      'Undo/redo functionality',
      'Zoom controls for large documents',
      'Keyboard shortcuts',
      'Preserves all page content'
    ],
    useCases: [
      'Restructuring presentations',
      'Combining content from multiple documents',
      'Creating custom page sequences',
      'Removing unwanted pages',
      'Preparing documents for printing',
      'Organizing scanned documents'
    ],
    privacyNote: 'Page organization is done entirely in your browser with no data transmission.'
  },

  'extract-pages': {
    id: 'extract-pages',
    title: 'PDF Page Extractor',
    shortDescription: 'Extract specific pages from PDF documents',
    fullDescription: `Extract exactly the pages you need from PDF documents with our precise page extraction tool. Whether you need to pull out a single page, create a subset document, or extract multiple page ranges, this tool provides flexible selection methods with instant results.

    The extraction tool offers multiple selection methods to accommodate different needs. Select individual pages by clicking, define page ranges using intuitive syntax (e.g., "1-5, 8, 10-15"), or use smart selection patterns like extracting all odd/even pages. The visual interface shows thumbnail previews of all pages, making it easy to identify and select the content you need. For documents with bookmarks, you can extract entire sections based on the document's structural hierarchy.

    Advanced features ensure professional results. The tool preserves all page properties including formatting, fonts, images, hyperlinks, and form fields. When extracting pages with cross-references or bookmarks, the tool intelligently updates or removes broken links. You can extract pages into a single new PDF or create multiple individual PDFs, one for each extracted page. Custom naming patterns help organize extracted files systematically.

    Processing occurs entirely within your browser using PDF manipulation libraries. This local approach ensures immediate extraction without upload delays while maintaining complete document confidentiality. Your source PDFs and extracted pages never leave your device, making it ideal for handling sensitive documents where specific sections need to be shared without revealing the entire document.`,
    features: [
      'Multiple selection methods',
      'Page range syntax support',
      'Visual page selection',
      'Bookmark-based extraction',
      'Single or multiple file output',
      'Preserves all formatting',
      'Smart link updating',
      'Custom file naming'
    ],
    useCases: [
      'Sharing specific document sections',
      'Creating excerpt documents',
      'Extracting forms from larger documents',
      'Pulling out report chapters',
      'Creating sample pages',
      'Document version control'
    ],
    privacyNote: 'Page extraction happens locally in your browser for complete security.'
  }
};

// Helper function to get tool description by ID
export function getToolDescription(toolId: string): ToolDescription | undefined {
  return toolDescriptions[toolId];
}

// Helper function to get a formatted description for display
export function getFormattedDescription(toolId: string): string {
  const tool = toolDescriptions[toolId];
  if (!tool) return '';
  
  return `${tool.fullDescription}\n\n${tool.privacyNote}`;
}

// Helper function to get SEO-friendly description (first 160 chars)
export function getSEODescription(toolId: string): string {
  const tool = toolDescriptions[toolId];
  if (!tool) return '';
  
  const description = tool.fullDescription.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  return description.length > 160 ? description.substring(0, 157) + '...' : description;
}