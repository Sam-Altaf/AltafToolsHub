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
      faq: [
        {
          question: "How do I convert JPG to PDF?",
          answer: "Simply click the button above to access our free JPG to PDF converter. Upload your JPG images, arrange them in your preferred order, and download the combined PDF file. All processing happens in your browser for maximum privacy."
        },
        {
          question: "Is this JPG to PDF converter free?",
          answer: "Yes, our JPG to PDF converter is completely free with no hidden costs, subscriptions, or file limits. You can convert unlimited images to PDF without any restrictions."
        },
        {
          question: "Is it safe to convert JPG to PDF online?",
          answer: "Absolutely. Our converter runs entirely in your browser - your files never leave your device. No uploads to external servers means complete privacy and security for your images."
        }
      ]
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
      faq: [
        {
          question: "What image formats can I convert to PDF?",
          answer: "Our tool supports all common image formats including JPG, JPEG, PNG, GIF, BMP, and more. Click the button above to start converting any image format to PDF instantly."
        },
        {
          question: "Can I convert multiple images to one PDF?",
          answer: "Yes! You can upload multiple images and combine them into a single PDF file. Drag and drop to reorder your images before creating the PDF."
        },
        {
          question: "Does the tool compress my images?",
          answer: "The tool preserves your image quality by default. Your photos and pictures maintain their original resolution when converted to PDF format."
        }
      ]
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
      faq: [
        {
          question: "What's the difference between JPG and JPEG?",
          answer: "JPG and JPEG are the same image format - JPEG is just the full name. Both file extensions (.jpg and .jpeg) represent identical image files that our converter handles perfectly."
        },
        {
          question: "How do I maintain quality when converting JPEG to PDF?",
          answer: "Our converter preserves 100% of your original JPEG quality. The images are embedded into the PDF without any compression or quality loss."
        },
        {
          question: "Can I convert JPEG to PDF on mobile?",
          answer: "Yes! Our browser-based converter works on all devices including phones and tablets. Simply access the tool through your mobile browser."
        }
      ]
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
      faq: [
        {
          question: "How do I convert PDF pages to JPG images?",
          answer: "Click the button above to access our free PDF to JPG converter. Upload your PDF file, select which pages you want to convert, and download the JPG images. Each page becomes a separate high-quality image file."
        },
        {
          question: "Can I convert specific pages from a PDF to JPG?",
          answer: "Yes! Our tool lets you choose exactly which pages to convert. You can extract individual pages, page ranges, or convert the entire PDF document to JPG images."
        },
        {
          question: "What quality are the JPG images after conversion?",
          answer: "Our converter maintains high image quality with customizable resolution settings. You can choose the output quality that best balances file size and image clarity for your needs."
        }
      ]
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
      faq: [
        {
          question: "Is converting PDF to JPG free?",
          answer: "Absolutely! Our PDF to JPG converter is completely free with no limits on file size or number of conversions. Simply click above to start converting your PDFs to JPG images instantly."
        },
        {
          question: "Does the conversion work offline?",
          answer: "Yes! Once the page loads, all processing happens in your browser. Your PDF files never leave your device, ensuring complete privacy and security during conversion."
        },
        {
          question: "Can I batch convert multiple PDF pages at once?",
          answer: "Yes, you can convert all pages from your PDF in one go. Each page will be saved as an individual JPG image that you can download together as a ZIP file or separately."
        }
      ]
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
      faq: [
        {
          question: "Why would I convert PDF to JPEG instead of keeping it as PDF?",
          answer: "JPEG images are easier to share on social media, insert into presentations, or use in image editing software. Click above to access our converter and transform your PDF pages into versatile JPEG images."
        },
        {
          question: "How long does PDF to JPEG conversion take?",
          answer: "Conversion is instant! Since processing happens in your browser, there's no upload wait time. Most PDFs convert in seconds, depending on the number of pages and your device speed."
        },
        {
          question: "Will the JPEG images have the same dimensions as my PDF pages?",
          answer: "Yes, the converter maintains the aspect ratio and proportions of your original PDF pages. You can also adjust the output resolution to suit your specific needs."
        }
      ]
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
      faq: [
        {
          question: "What's the advantage of PNG over JPG for PDF conversion?",
          answer: "PNG format supports transparency and provides lossless compression, making it ideal for documents with transparent backgrounds or text. Click above to convert your PDF to high-quality PNG images with full transparency support."
        },
        {
          question: "Can I convert PDF to PNG with transparent background?",
          answer: "Yes! Our converter preserves transparency in your PDF pages. If your PDF has transparent elements, they'll be maintained in the PNG output, perfect for overlaying images or creating graphics."
        },
        {
          question: "Are PNG files larger than JPG files?",
          answer: "Generally yes, because PNG uses lossless compression. However, for documents with text, diagrams, or images requiring transparency, PNG is the better choice despite larger file sizes."
        }
      ]
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
      faq: [
        {
          question: "How do I convert a multi-page PDF to PNG images?",
          answer: "Simply click the button above and upload your PDF. Our converter will extract each page as a separate PNG image, which you can download individually or as a complete ZIP archive."
        },
        {
          question: "Is there a limit to the PDF file size for PNG conversion?",
          answer: "Since all processing happens in your browser, the limit depends on your device's memory. Most standard PDFs convert without issues. Larger files may take a bit longer but will still work."
        },
        {
          question: "Can I adjust the PNG image resolution?",
          answer: "Yes! Our tool offers adjustable resolution settings so you can control the output quality and file size of your PNG images to match your specific requirements."
        }
      ]
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
      faq: [
        {
          question: "How many PDF files can I merge at once?",
          answer: "You can merge unlimited PDF files in one go! Click above to access our merger tool, upload multiple PDFs, arrange them in your desired order with drag and drop, and combine them into a single document."
        },
        {
          question: "Will merging PDFs reduce the quality?",
          answer: "No, our merger preserves 100% of the original quality. All pages, images, text, and formatting from each PDF are maintained perfectly in the merged document."
        },
        {
          question: "Can I rearrange the order of PDFs before merging?",
          answer: "Absolutely! Our tool features an intuitive drag-and-drop interface that lets you reorder your PDF files before merging them. Simply drag files up or down to arrange them as needed."
        }
      ]
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
      faq: [
        {
          question: "What's the difference between joining and merging PDFs?",
          answer: "They're essentially the same! Both terms refer to combining multiple PDF files into one document. Click above to join your PDF files quickly and securely in your browser."
        },
        {
          question: "Can I join password-protected PDFs?",
          answer: "If you know the password, you can unlock the PDF first using our unlock tool, then join it with other PDFs. Our join tool works with all standard PDF files."
        },
        {
          question: "Is joining PDFs online safe?",
          answer: "Yes! Our tool processes everything in your browser - your files never leave your device. This ensures complete privacy and security when joining your PDF documents."
        }
      ]
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
      faq: [
        {
          question: "Can I combine PDFs with different page sizes?",
          answer: "Yes! Our combiner handles PDFs with different page sizes, orientations, and dimensions. Click above to combine your mixed-format PDFs into one unified document while preserving each page's original properties."
        },
        {
          question: "How do I combine PDFs on my phone?",
          answer: "Our browser-based tool works perfectly on mobile devices! Simply open it on your phone's browser, select your PDF files, and combine them. No app installation required."
        },
        {
          question: "Will combining PDFs increase the file size significantly?",
          answer: "The combined PDF size will equal the sum of all individual PDFs. However, you can use our compress tool afterward to reduce the file size if needed."
        }
      ]
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
      faq: [
        {
          question: "How can I split a PDF into multiple files?",
          answer: "Click above to access our PDF splitter. Upload your PDF, then choose to split by page ranges, extract specific pages, or divide into equal parts. Each section will be saved as a separate PDF file you can download instantly."
        },
        {
          question: "Can I split a PDF and extract only certain pages?",
          answer: "Absolutely! Our tool lets you select exactly which pages you want to extract. You can choose individual pages, page ranges, or even odd/even pages to create your custom split PDFs."
        },
        {
          question: "Is splitting large PDFs free?",
          answer: "Yes, completely free! There are no file size limits or page restrictions. Split PDFs of any size without any costs or subscriptions."
        }
      ]
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
      faq: [
        {
          question: "Why would I need to divide a PDF?",
          answer: "Dividing PDFs is useful for sharing specific sections, reducing file sizes for email, organizing chapters, or extracting relevant pages. Click above to divide your PDF into manageable, shareable segments."
        },
        {
          question: "Can I divide a PDF into equal parts automatically?",
          answer: "Yes! Our tool offers automatic division options. You can split by number of files or number of pages per file, making it easy to divide large PDFs evenly without manual selection."
        },
        {
          question: "Will dividing a PDF lose any content or formatting?",
          answer: "No, dividing preserves everything perfectly. Each divided PDF maintains the original pages' content, formatting, images, links, and quality without any loss."
        }
      ]
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
      faq: [
        {
          question: "How do I remove a password from a PDF?",
          answer: "Click above to access our PDF unlock tool. Upload your password-protected PDF, enter the password, and our tool will remove the security to give you an unlocked PDF you can freely edit and share."
        },
        {
          question: "Is it legal to remove PDF passwords?",
          answer: "It's legal to remove passwords from PDFs you own or have permission to access. Our tool requires you to know the password, ensuring you have legitimate access to the document."
        },
        {
          question: "Can I remove copy and print restrictions from PDFs?",
          answer: "Yes! Our tool removes various PDF restrictions including copy protection, print restrictions, and editing limitations, giving you full access to your PDF content."
        }
      ]
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
      faq: [
        {
          question: "What if I forgot my PDF password?",
          answer: "Unfortunately, if you don't know the password, it cannot be removed for security reasons. Our tool requires the correct password to unlock PDFs, protecting document security and owner rights."
        },
        {
          question: "Does unlocking a PDF modify the original file?",
          answer: "Our tool creates a new unlocked version of your PDF. The output file is identical to the original except without password protection, maintaining all content and quality."
        },
        {
          question: "Is it safe to unlock PDFs using an online tool?",
          answer: "Yes! All processing happens in your browser - your files and passwords never leave your device. This browser-based approach ensures complete privacy and security."
        }
      ]
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
      faq: [
        {
          question: "How do I create a QR code for free?",
          answer: "Click above to access our free QR code generator. Enter your URL, text, or contact information, customize the design and colors if desired, then download your QR code as PNG or SVG instantly."
        },
        {
          question: "What types of QR codes can I generate?",
          answer: "Our generator supports URLs, plain text, email addresses, phone numbers, WiFi credentials, contact cards (vCard), and more. Each type is optimized for the best scanning experience."
        },
        {
          question: "Can I customize the QR code design and colors?",
          answer: "Yes! You can customize colors, add logos, adjust size, and even change the style. Our tool generates professional, scannable QR codes that match your brand or personal style."
        }
      ]
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
      faq: [
        {
          question: "Can I add my logo to a QR code?",
          answer: "Yes! Click above to access our QR code creator. You can upload your logo or image to embed in the center of the QR code while maintaining full scannability. Perfect for branded marketing materials."
        },
        {
          question: "What information can I encode in a QR code?",
          answer: "You can encode website URLs, contact information, WiFi passwords, email addresses, phone numbers, plain text, app store links, and much more. Our creator supports all standard QR code data types."
        },
        {
          question: "Do custom colored QR codes scan properly?",
          answer: "Yes! As long as there's sufficient contrast between the foreground and background colors, custom colored QR codes scan perfectly. Our tool ensures your designs remain fully functional."
        }
      ]
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
      faq: [
        {
          question: "How long does it take to make a QR code?",
          answer: "Making a QR code takes just seconds! Click above, enter your information, customize if desired, and download instantly. The entire process is immediate with no waiting or processing time."
        },
        {
          question: "Can I make a QR code for my WiFi network?",
          answer: "Absolutely! Our tool has a dedicated WiFi QR code option. Enter your network name and password, and generate a QR code that lets visitors connect to your WiFi by simply scanning it."
        },
        {
          question: "What file formats can I download my QR code in?",
          answer: "You can download your QR code as PNG for general use, SVG for scalable vector graphics, or other formats. Each format is optimized for different use cases like web, print, or design applications."
        }
      ]
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
      faq: [
        {
          question: "How can I add a watermark to my PDF?",
          answer: "Click above to access our watermarking tool. Upload your PDF, choose between text or image watermark, customize the position, size, transparency, and rotation, then download your watermarked PDF instantly."
        },
        {
          question: "Can I add watermarks to multiple pages at once?",
          answer: "Yes! You can apply watermarks to all pages, specific pages, or even alternating pages. The watermark will be consistently applied across your selected pages with the same settings."
        },
        {
          question: "Will the watermark affect PDF quality or file size?",
          answer: "Watermarks have minimal impact on file size and don't reduce your PDF's quality. Text watermarks add almost no size, while image watermarks depend on the image file size you upload."
        }
      ]
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
      faq: [
        {
          question: "What types of watermarks can I create?",
          answer: "You can create text watermarks with custom fonts, colors, and styles, or image watermarks using your logo or any picture. Click above to design professional watermarks that protect and brand your PDFs."
        },
        {
          question: "Can I control the watermark transparency?",
          answer: "Yes! You have full control over opacity levels. Make your watermark subtle and transparent so it doesn't obscure content, or bold and opaque for maximum visibility and protection."
        },
        {
          question: "How do I position watermarks diagonally across pages?",
          answer: "Our maker includes rotation controls that let you angle your watermark at any degree. Diagonal watermarks (typically 45 degrees) are popular for copyright protection and look professional."
        }
      ]
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
      faq: [
        {
          question: "How do I rotate specific pages in a PDF?",
          answer: "Click above to access our rotation tool. Upload your PDF, select which pages need rotation (all pages or specific ones), choose the rotation angle (90°, 180°, or 270°), and download your corrected PDF."
        },
        {
          question: "Can I rotate pages in different directions?",
          answer: "Yes! You can rotate individual pages independently. For example, rotate page 1 clockwise 90° while rotating page 5 counterclockwise 90°. Each page can have its own rotation applied."
        },
        {
          question: "Will rotating pages reduce PDF quality?",
          answer: "No, rotation is a lossless operation. Your PDF's content, images, and text quality remain exactly the same - only the orientation changes. There's no compression or quality degradation."
        }
      ]
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
      faq: [
        {
          question: "How do I rearrange pages in a PDF?",
          answer: "Click above to access our page organizer. Upload your PDF, then simply drag and drop pages to reorder them. You can also rotate pages, delete unwanted ones, and add new pages. Download your reorganized PDF when done."
        },
        {
          question: "Can I move pages from one PDF to another?",
          answer: "Yes! Upload multiple PDFs, then drag pages between documents to combine and organize them exactly how you want. It's perfect for creating custom documents from multiple sources."
        },
        {
          question: "Is there a preview when rearranging pages?",
          answer: "Absolutely! You'll see thumbnail previews of all pages as you drag and drop them. This visual interface makes it easy to organize your PDF exactly as you envision it."
        }
      ]
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
      faq: [
        {
          question: "Why would I need to crop a PDF?",
          answer: "Cropping removes excess white space, margins, headers, or footers to focus on essential content. Click above to crop your PDF and reduce file size while improving the viewing experience on different devices."
        },
        {
          question: "Can I crop different areas on different pages?",
          answer: "Yes! You can apply different crop settings to individual pages or use the same crop area for all pages. Our tool offers both flexibility for custom cropping and efficiency for batch operations."
        },
        {
          question: "Will cropping reduce the PDF file size?",
          answer: "Yes, cropping can reduce file size by removing unnecessary margins and whitespace. The amount of size reduction depends on how much content is trimmed from your pages."
        }
      ]
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
      faq: [
        {
          question: "How do I extract specific pages from a PDF?",
          answer: "Click above to use our extraction tool. Upload your PDF, select the pages you want to extract (individual pages or ranges like 1-5, 10-15), and download them as a new separate PDF file instantly."
        },
        {
          question: "Can I extract multiple page ranges at once?",
          answer: "Yes! You can select multiple non-consecutive pages or ranges (e.g., pages 1, 5-7, 12, 20-25) and extract them all together into a single new PDF document."
        },
        {
          question: "Does extracting pages remove them from the original PDF?",
          answer: "No, extraction creates a new PDF with your selected pages while leaving the original file unchanged. You get a new document containing only the pages you chose."
        }
      ]
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
      faq: [
        {
          question: "How can I extract all images from a PDF at once?",
          answer: "Click above to access our image extractor. Upload your PDF and the tool will automatically detect and extract all embedded images. Download them individually or as a ZIP archive containing all images."
        },
        {
          question: "What image formats are extracted from PDFs?",
          answer: "Our tool extracts images in their original format (JPG, PNG, GIF, etc.) preserving the exact quality and format they were embedded in. No conversion or quality loss occurs during extraction."
        },
        {
          question: "Can I extract images from scanned PDFs?",
          answer: "Yes! If your PDF contains scanned images, our tool will extract them. For text that was scanned as images, you might want to use our OCR text extraction tool instead."
        }
      ]
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
      faq: [
        {
          question: "How do I delete specific pages from my PDF?",
          answer: "Click above to access our page removal tool. Upload your PDF, select which pages you want to delete by clicking on them, then download your cleaned-up PDF with the unwanted pages removed."
        },
        {
          question: "Can I delete multiple pages at once?",
          answer: "Yes! You can select and delete multiple pages simultaneously. Select all the pages you want to remove and delete them in one action, saving time when cleaning up large documents."
        },
        {
          question: "Is there a way to automatically remove blank pages?",
          answer: "Our tool helps you identify blank or nearly-blank pages visually through thumbnails. You can quickly spot and select blank pages to delete them from your PDF efficiently."
        }
      ]
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
      faq: [
        {
          question: "How do I add page numbers to my PDF?",
          answer: "Click above to access our page numbering tool. Upload your PDF, choose the position (header, footer, or custom), select the format (1, 2, 3 or Page 1 of 10), customize the style, and download your numbered PDF instantly."
        },
        {
          question: "Can I start page numbering from a specific page?",
          answer: "Yes! You can choose which page to start numbering from and what number to begin with. This is useful for documents where you don't want numbers on the cover or table of contents."
        },
        {
          question: "Can I customize the appearance of page numbers?",
          answer: "Absolutely! You can customize the font, size, color, position, and format of your page numbers. Add prefixes like 'Page' or suffixes like 'of 10' to create professional-looking pagination."
        }
      ]
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
      faq: [
        {
          question: "How do I add password protection to a PDF?",
          answer: "Click above to access our PDF encryption tool. Upload your PDF, set a strong password, choose security options (like preventing copying or printing), and download your password-protected PDF. All processing happens securely in your browser."
        },
        {
          question: "What level of encryption does the tool use?",
          answer: "Our tool uses industry-standard AES encryption to protect your PDFs. You can choose between different security levels depending on your needs, ensuring your documents remain secure and private."
        },
        {
          question: "Can I restrict specific actions like printing or editing?",
          answer: "Yes! Beyond password protection, you can set permissions to restrict copying, printing, editing, or commenting. This gives you granular control over how recipients can interact with your PDF."
        }
      ]
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
      faq: [
        {
          question: "How do I create a strong password?",
          answer: "Click above to use our secure password generator. Set your desired length (12+ characters recommended), include uppercase, lowercase, numbers, and symbols, then generate instantly. Copy your secure password and use it immediately."
        },
        {
          question: "What makes a password secure?",
          answer: "Secure passwords are long (12+ characters), use a mix of uppercase, lowercase, numbers, and special characters, and are completely random. Our generator creates passwords that meet all security best practices automatically."
        },
        {
          question: "Can I generate multiple passwords at once?",
          answer: "Yes! Our tool can generate multiple passwords simultaneously. Generate several options and choose the one you prefer, or create different passwords for multiple accounts in one session."
        }
      ]
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
      faq: [
        {
          question: "How do I extract text from a scanned PDF?",
          answer: "Click above to access our OCR-powered text extraction tool. Upload your PDF (even scanned documents), and our advanced OCR technology will recognize and extract all text, making it editable and searchable."
        },
        {
          question: "Can I extract text from images in PDFs?",
          answer: "Yes! Our OCR (Optical Character Recognition) technology can extract text from images embedded in PDFs. It works with scanned documents, photos of text, and image-based PDFs with high accuracy."
        },
        {
          question: "What languages does the OCR support?",
          answer: "Our text extraction tool supports multiple languages including English and many other major languages. The OCR engine automatically detects the language and extracts text accurately."
        }
      ]
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
      faq: [
        {
          question: "Why convert PDF to text instead of copying directly?",
          answer: "Converting PDF to text is essential for scanned documents or PDFs where copying is disabled. Click above to use our converter with OCR that extracts text from any PDF, making it editable in word processors or text editors."
        },
        {
          question: "Will the text maintain formatting after conversion?",
          answer: "The tool extracts plain text content, which means basic formatting like paragraphs and line breaks are preserved. For advanced layout preservation, consider other PDF editing options."
        },
        {
          question: "Can I convert multi-page PDFs to text?",
          answer: "Absolutely! Upload PDFs with any number of pages. Our converter will extract text from all pages, giving you a complete text file or allowing you to copy text from specific pages."
        }
      ]
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
      faq: [
        {
          question: "Why would I convert PDFs to a ZIP file?",
          answer: "Converting PDFs to ZIP is perfect for sharing multiple documents in one file, reducing total file size for email attachments, or organizing related PDFs together. Click above to bundle your PDFs into a convenient ZIP archive."
        },
        {
          question: "Does converting to ZIP compress the PDFs?",
          answer: "Yes! ZIP compression reduces the overall file size, making it easier to share multiple PDFs via email or cloud storage. The compression is lossless, so your PDF quality remains unchanged."
        },
        {
          question: "Can I add multiple PDFs to one ZIP file?",
          answer: "Absolutely! Upload as many PDFs as you need, and our tool will bundle them all into a single compressed ZIP archive. You can also organize them into folders within the ZIP if needed."
        }
      ]
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
      faq: [
        {
          question: "How do I extract PDFs from a ZIP file?",
          answer: "Click above to access our extraction tool. Upload your ZIP archive, and we'll display all PDF files contained within. Select which PDFs to extract and download them individually or all at once."
        },
        {
          question: "Can I extract only specific PDFs from a ZIP?",
          answer: "Yes! Once you upload your ZIP file, you'll see previews of all contained PDFs. Select only the ones you need and extract them, leaving the rest behind."
        },
        {
          question: "What if my ZIP file contains other files besides PDFs?",
          answer: "Our tool automatically filters and shows only PDF files from your ZIP archive. You can easily identify and extract just the PDFs without dealing with other file types."
        }
      ]
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
      faq: [
        {
          question: "What image formats can I convert my PDF to?",
          answer: "Click above to convert your PDF to JPG, PNG, or WebP format. Each format has advantages: JPG for photos, PNG for transparency and text, WebP for modern web optimization with smaller file sizes."
        },
        {
          question: "Can I convert all PDF pages to images at once?",
          answer: "Yes! Our converter processes all pages simultaneously, converting each page into a separate image file. Download them individually or as a convenient ZIP archive containing all images."
        },
        {
          question: "How do I choose the right image format for my PDF?",
          answer: "Use JPG for documents with photos (smaller files), PNG for documents with text or transparency needs (better quality), and WebP for web use (best compression with quality). Our tool lets you compare and choose."
        }
      ]
    },
  },
];
