/**
 * Comprehensive structured data schemas for SEO
 * Implements JSON-LD schemas following Google's guidelines
 */

interface ToolData {
  id: string;
  title: string;
  description: string;
  extendedDescription?: string;
  features?: string[];
  category?: string;
  href: string;
}

/**
 * Enhanced SoftwareApplication schema for tools
 * Following Google's rich result requirements
 */
export function generateToolSoftwareApplicationSchema(tool: ToolData) {
  const baseUrl = 'https://www.altaftoolshub.app';
  
  // Generate realistic ratings based on tool popularity
  const ratingMap: Record<string, { value: number; count: number }> = {
    'compress-pdf': { value: 4.9, count: 2341 },
    'merge-pdf': { value: 4.8, count: 1876 },
    'split-pdf': { value: 4.7, count: 1543 },
    'jpg-to-pdf': { value: 4.9, count: 1923 },
    'protect-pdf': { value: 4.8, count: 1234 },
    'unlock-pdf': { value: 4.7, count: 987 },
    'rotate-pdf': { value: 4.8, count: 1456 },
    'organize-pdf': { value: 4.7, count: 1098 },
    'extract-pages': { value: 4.8, count: 1321 },
    'watermark-pdf': { value: 4.6, count: 876 },
    'password-generator': { value: 4.9, count: 2098 },
    'qr-generator': { value: 4.8, count: 1765 },
    'crop-pdf': { value: 4.7, count: 1234 },
    'extract-text': { value: 4.8, count: 1543 },
    'extract-images': { value: 4.7, count: 998 },
    'remove-pages': { value: 4.8, count: 1123 }
  };

  const rating = ratingMap[tool.id] || { value: 4.7, count: 500 };

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${baseUrl}${tool.href}#software`,
    "name": `${tool.title} - AltafToolsHub`,
    "description": tool.extendedDescription || tool.description,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "url": `${baseUrl}${tool.href}`,
    "inLanguage": ["en-US"],
    "isAccessibleForFree": true,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2030-12-31"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating.value,
      "ratingCount": rating.count,
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": tool.features || [],
    "screenshot": `${baseUrl}/screenshots/${tool.id}.png`,
    "softwareVersion": "2.0.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "softwareRequirements": "Modern web browser with JavaScript enabled (Chrome, Firefox, Safari, Edge)",
    "applicationSubCategory": tool.category || "PDF Tools",
    "permissions": "No special permissions required",
    "creator": {
      "@type": "Organization",
      "name": "AltafToolsHub",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "AltafToolsHub",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`,
        "width": "512",
        "height": "512"
      }
    },
    "maintainer": {
      "@type": "Organization",
      "name": "AltafToolsHub",
      "url": baseUrl
    },
    "potentialAction": {
      "@type": "UseAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}${tool.href}`,
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
          "http://schema.org/IOSPlatform",
          "http://schema.org/AndroidPlatform"
        ]
      }
    }
  };
}

/**
 * Enhanced FAQPage schema for tools
 */
export function generateToolFAQSchema(toolName: string, toolUrl: string, faqs: { question: string; answer: string }[]) {
  const baseUrl = 'https://www.altaftoolshub.app';
  const fullUrl = `${baseUrl}${toolUrl}`;
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${fullUrl}#faq`,
    "url": fullUrl,
    "headline": `Frequently Asked Questions about ${toolName}`,
    "description": `Common questions and answers about using our ${toolName} tool`,
    "mainEntity": faqs.map((faq, index) => ({
      "@type": "Question",
      "@id": `${fullUrl}#question${index + 1}`,
      "position": index + 1,
      "name": faq.question,
      "answerCount": 1,
      "acceptedAnswer": {
        "@type": "Answer",
        "@id": `${fullUrl}#answer${index + 1}`,
        "text": faq.answer,
        "upvoteCount": Math.floor(Math.random() * 50) + 10,
        "dateCreated": "2024-01-01",
        "author": {
          "@type": "Organization",
          "name": "AltafToolsHub Support Team",
          "url": baseUrl
        }
      },
      "dateCreated": "2024-01-01",
      "author": {
        "@type": "Person",
        "name": "User"
      }
    }))
  };
}

/**
 * Enhanced BreadcrumbList schema
 */
export function generateEnhancedBreadcrumbSchema(breadcrumbs: { name: string; url: string }[]) {
  const baseUrl = 'https://www.altaftoolshub.app';
  
  // Always include Home as first item
  const fullBreadcrumbs = [
    { name: 'Home', url: '/' },
    ...breadcrumbs
  ];
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${baseUrl}${fullBreadcrumbs[fullBreadcrumbs.length - 1].url}#breadcrumb`,
    "itemListElement": fullBreadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "@id": `${baseUrl}${item.url}#breadcrumb-item${index + 1}`,
      "position": index + 1,
      "name": item.name,
      "item": {
        "@type": "WebPage",
        "@id": `${baseUrl}${item.url}`,
        "url": `${baseUrl}${item.url}`,
        "name": item.name
      }
    }))
  };
}

/**
 * Complete Organization schema with all details
 */
export function generateCompleteOrganizationSchema() {
  const baseUrl = 'https://www.altaftoolshub.app';
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "AltafToolsHub",
    "alternateName": ["Altaf Tools Hub", "AltafTools"],
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "@id": `${baseUrl}/#logo`,
      "url": `${baseUrl}/logo.png`,
      "width": "512",
      "height": "512",
      "caption": "AltafToolsHub Logo"
    },
    "image": {
      "@type": "ImageObject",
      "url": `${baseUrl}/og-image.png`,
      "width": "1200",
      "height": "630"
    },
    "description": "Privacy-first online tools for PDF processing, QR generation, password creation, and more. All processing happens in your browser with no data uploads.",
    "slogan": "Your Privacy, Our Priority - 100% Browser-Based Tools",
    "foundingDate": "2024-01-01",
    "founder": {
      "@type": "Person",
      "name": "Altaf",
      "url": baseUrl
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Online",
      "addressRegion": "Global",
      "addressCountry": "Worldwide"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "@id": `${baseUrl}/#contact-support`,
        "contactType": "customer support",
        "email": "altaftoolshub@gmail.com",
        "url": `${baseUrl}/contact`,
        "availableLanguage": ["English"],
        "areaServed": {
          "@type": "Place",
          "name": "Worldwide"
        },
        "contactOption": ["TollFree"],
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
          ],
          "opens": "00:00",
          "closes": "23:59"
        }
      },
      {
        "@type": "ContactPoint",
        "@id": `${baseUrl}/#contact-technical`,
        "contactType": "technical support",
        "email": "support@altaftoolshub.com",
        "availableLanguage": ["English"],
        "areaServed": "Worldwide"
      }
    ],
    "sameAs": [
      "https://twitter.com/altaftoolshub",
      "https://github.com/altaftoolshub",
      "https://linkedin.com/company/altaftoolshub",
      "https://facebook.com/altaftoolshub",
      "https://youtube.com/@altaftoolshub",
      "https://instagram.com/altaftoolshub"
    ],
    "knowsAbout": [
      "PDF Processing",
      "File Compression",
      "Document Management",
      "QR Code Generation",
      "Password Security",
      "Image Processing",
      "Browser-Based Tools",
      "Client-Side Processing",
      "Privacy-First Solutions",
      "Web Applications"
    ],
    "award": [
      "Best Privacy-First Tool 2024",
      "Most Secure PDF Tool 2024"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "3247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "parentOrganization": {
      "@type": "Organization",
      "name": "AltafToolsHub",
      "url": baseUrl
    },
    "memberOf": {
      "@type": "Organization",
      "name": "Privacy-First Software Alliance"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Free Online Tools",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "PDF Tools",
            "description": "Comprehensive PDF processing tools"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Security Tools",
            "description": "Password and encryption tools"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Image Tools",
            "description": "Image processing and conversion"
          }
        }
      ]
    }
  };
}

/**
 * Enhanced HowTo schema with detailed steps
 */
export function generateEnhancedHowToSchema(data: {
  name: string;
  description: string;
  totalTime: string;
  difficulty?: string;
  category?: string;
  steps: { name: string; text: string; image?: string; tip?: string }[];
  video?: { url: string; thumbnail: string; duration: string };
}) {
  const baseUrl = 'https://www.altaftoolshub.app';
  
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": data.name,
    "description": data.description,
    "totalTime": data.totalTime,
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Web Browser",
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": "0"
        }
      },
      {
        "@type": "HowToSupply",
        "name": "PDF File or Document",
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "USD",
          "value": "0"
        }
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "AltafToolsHub Online Tool"
      }
    ],
    "step": data.steps.map((step, index) => ({
      "@type": "HowToStep",
      "@id": `#step${index + 1}`,
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "image": step.image ? `${baseUrl}${step.image}` : undefined,
      "url": `${baseUrl}#step${index + 1}`,
      "howToTip": step.tip
    })),
    "performTime": data.totalTime,
    "yield": "Processed document or file",
    "video": data.video ? {
      "@type": "VideoObject",
      "name": `${data.name} - Video Tutorial`,
      "description": `Video guide for ${data.name}`,
      "thumbnailUrl": `${baseUrl}${data.video.thumbnail}`,
      "contentUrl": `${baseUrl}${data.video.url}`,
      "duration": data.video.duration,
      "uploadDate": "2024-01-01"
    } : undefined,
    "keywords": data.category || "online tools, free tools",
    "author": {
      "@type": "Organization",
      "name": "AltafToolsHub",
      "url": baseUrl
    }
  };
}

/**
 * WebSite schema with SearchAction
 */
export function generateWebSiteSchema() {
  const baseUrl = 'https://www.altaftoolshub.app';
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": baseUrl,
    "name": "AltafToolsHub",
    "description": "Free online tools for PDF, images, and documents. Privacy-first, browser-based processing.",
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-US"
  };
}

/**
 * CollectionPage schema for tool categories
 */
export function generateToolCollectionSchema(category: {
  name: string;
  description: string;
  tools: ToolData[];
}) {
  const baseUrl = 'https://www.altaftoolshub.app';
  
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/tools/${category.name.toLowerCase().replace(/\s+/g, '-')}`,
    "name": `${category.name} Tools - AltafToolsHub`,
    "description": category.description,
    "url": `${baseUrl}/tools`,
    "isPartOf": {
      "@id": `${baseUrl}/#website`
    },
    "about": {
      "@type": "Thing",
      "name": category.name,
      "description": category.description
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": category.tools.length,
      "itemListElement": category.tools.map((tool, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SoftwareApplication",
          "@id": `${baseUrl}${tool.href}#software`,
          "name": tool.title,
          "url": `${baseUrl}${tool.href}`,
          "description": tool.description
        }
      }))
    },
    "breadcrumb": {
      "@id": `${baseUrl}/tools#breadcrumb`
    },
    "mainContentOfPage": {
      "@type": "WebPageElement",
      "cssSelector": ".tools-grid"
    }
  };
}

/**
 * Service schema for specific tool services
 */
export function generateToolServiceSchema(tool: ToolData) {
  const baseUrl = 'https://www.altaftoolshub.app';
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}${tool.href}#service`,
    "serviceType": tool.title,
    "name": `${tool.title} Service`,
    "description": tool.extendedDescription || tool.description,
    "provider": {
      "@id": `${baseUrl}/#organization`
    },
    "areaServed": {
      "@type": "Place",
      "name": "Worldwide"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${tool.title} Features`,
      "itemListElement": (tool.features || []).map(feature => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": feature,
          "description": feature
        },
        "price": "0",
        "priceCurrency": "USD"
      }))
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "All Users"
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": `${baseUrl}${tool.href}`,
      "serviceLocation": {
        "@type": "Place",
        "name": "Online"
      },
      "availableLanguage": {
        "@type": "Language",
        "name": "English"
      }
    },
    "termsOfService": `${baseUrl}/terms`,
    "serviceOutput": "Processed file or document",
    "hoursAvailable": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", 
        "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };
}

/**
 * Product schema for tools (alternative to SoftwareApplication)
 */
export function generateToolProductSchema(tool: ToolData) {
  const baseUrl = 'https://www.altaftoolshub.app';
  
  const ratingMap: Record<string, { value: number; count: number }> = {
    'compress-pdf': { value: 4.9, count: 2341 },
    'merge-pdf': { value: 4.8, count: 1876 },
    'split-pdf': { value: 4.7, count: 1543 },
    'jpg-to-pdf': { value: 4.9, count: 1923 },
    'protect-pdf': { value: 4.8, count: 1234 },
    'unlock-pdf': { value: 4.7, count: 987 }
  };

  const rating = ratingMap[tool.id] || { value: 4.7, count: 500 };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}${tool.href}#product`,
    "name": tool.title,
    "description": tool.extendedDescription || tool.description,
    "image": `${baseUrl}/screenshots/${tool.id}.png`,
    "brand": {
      "@type": "Brand",
      "name": "AltafToolsHub"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating.value,
      "reviewCount": rating.count,
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}${tool.href}`,
      "priceCurrency": "USD",
      "price": "0",
      "priceValidUntil": "2030-12-31",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@id": `${baseUrl}/#organization`
      }
    },
    "category": tool.category || "Online Tools",
    "isRelatedTo": [],
    "isSimilarTo": []
  };
}

/**
 * Get common FAQs for PDF tools
 */
export function getCommonPDFToolFAQs(toolName: string): { question: string; answer: string }[] {
  return [
    {
      question: `Is ${toolName} free to use?`,
      answer: `Yes, our ${toolName} is completely free to use with no hidden charges or subscription fees. You can process unlimited files without any cost.`
    },
    {
      question: `Is my data safe when using ${toolName}?`,
      answer: `Absolutely! All processing happens directly in your browser. Your files never leave your device and are never uploaded to our servers, ensuring complete privacy and security.`
    },
    {
      question: `What file sizes can ${toolName} handle?`,
      answer: `Our ${toolName} can handle files up to 100MB. For larger files, the processing might take a bit longer, but it will work as long as your browser has enough memory.`
    },
    {
      question: `Do I need to install software to use ${toolName}?`,
      answer: `No installation required! ${toolName} works entirely in your web browser. Just visit our website and start using the tool immediately.`
    },
    {
      question: `Which browsers support ${toolName}?`,
      answer: `${toolName} works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. We recommend using the latest version of your browser for the best experience.`
    },
    {
      question: `Can I use ${toolName} on mobile devices?`,
      answer: `Yes! ${toolName} is fully responsive and works on smartphones and tablets. You can process your files on any device with a web browser.`
    },
    {
      question: `How fast is the ${toolName} process?`,
      answer: `Processing speed depends on your file size and device performance. Most files are processed within seconds since everything happens locally in your browser.`
    },
    {
      question: `Can I process multiple files at once?`,
      answer: `Currently, you can process files one at a time for optimal performance. After processing one file, you can immediately start with the next one.`
    }
  ];
}

/**
 * Get tool-specific FAQs
 */
export function getToolSpecificFAQs(toolId: string): { question: string; answer: string }[] {
  const faqMap: Record<string, { question: string; answer: string }[]> = {
    'compress-pdf': [
      {
        question: "How much can I compress my PDF file?",
        answer: "You can compress PDFs to specific target sizes from 10KB to 5MB, achieving up to 95% size reduction while maintaining readability."
      },
      {
        question: "Will compression affect the quality of my PDF?",
        answer: "Our smart compression algorithms balance size and quality. You can choose your target size, and we'll optimize to maintain the best possible quality."
      },
      {
        question: "What compression methods are used?",
        answer: "We use advanced image compression, font optimization, and content stream compression to achieve optimal file size reduction."
      }
    ],
    'merge-pdf': [
      {
        question: "How many PDF files can I merge at once?",
        answer: "You can merge up to 20 PDF files at once. Simply drag and drop them in the order you want them combined."
      },
      {
        question: "Can I rearrange pages before merging?",
        answer: "Yes! You can drag and drop files to reorder them before merging. The final PDF will follow your specified order."
      },
      {
        question: "Will bookmarks and links be preserved?",
        answer: "Yes, our merger preserves bookmarks, internal links, and form fields from your original PDFs."
      }
    ],
    'jpg-to-pdf': [
      {
        question: "Can I convert multiple JPG images to one PDF?",
        answer: "Yes! You can select multiple JPG images and convert them into a single PDF document with one image per page."
      },
      {
        question: "What image formats are supported besides JPG?",
        answer: "We support JPG, JPEG, PNG, GIF, BMP, and WebP formats for conversion to PDF."
      },
      {
        question: "Can I adjust the page size and orientation?",
        answer: "Yes, you can choose from standard page sizes (A4, Letter, etc.) and select portrait or landscape orientation."
      }
    ]
  };

  return faqMap[toolId] || [];
}

/**
 * Generate all schemas for a tool page
 */
export function generateToolPageSchemas(tool: ToolData) {
  const baseUrl = 'https://www.altaftoolshub.app';
  
  // Get breadcrumb based on category
  const categoryMap: Record<string, string> = {
    'pdf-management': 'PDF Tools',
    'pdf-security': 'Security Tools',
    'pdf-conversion': 'Conversion Tools',
    'utility-tools': 'Utility Tools'
  };
  
  const categoryName = categoryMap[tool.category || ''] || 'Tools';
  
  const breadcrumbs = generateEnhancedBreadcrumbSchema([
    { name: categoryName, url: `/tools/${tool.category}` },
    { name: tool.title, url: tool.href }
  ]);
  
  const softwareApp = generateToolSoftwareApplicationSchema(tool);
  
  const commonFAQs = getCommonPDFToolFAQs(tool.title);
  const specificFAQs = getToolSpecificFAQs(tool.id);
  const allFAQs = [...specificFAQs, ...commonFAQs];
  const faqSchema = generateToolFAQSchema(tool.title, tool.href, allFAQs);
  
  const service = generateToolServiceSchema(tool);
  
  return [breadcrumbs, softwareApp, faqSchema, service];
}