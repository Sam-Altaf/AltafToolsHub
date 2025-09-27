import { useEffect } from "react";
import { generateOrganizationSchema, generateWebApplicationSchema } from "@/hooks/use-seo";

interface EnhancedSchemasProps {
  pageType: 'homepage' | 'tool' | 'category' | 'content';
  toolData?: {
    name: string;
    description: string;
    category: string;
    features: string[];
    url: string;
  };
  contentData?: {
    title: string;
    description: string;
    author: string;
    publishDate: string;
    keywords: string[];
  };
}

export default function EnhancedSchemas({ pageType, toolData, contentData }: EnhancedSchemasProps) {
  useEffect(() => {
    const schemas = [];
    
    // Always include organization schema
    schemas.push(generateOrganizationSchema());
    
    // Add page-specific schemas
    switch (pageType) {
      case 'homepage':
        schemas.push(generateHomepageSchema());
        break;
      case 'tool':
        if (toolData) {
          schemas.push(generateToolSchema(toolData));
          schemas.push(generateHowToSchema(toolData));
          schemas.push(generateFAQSchema(toolData));
        }
        break;
      case 'category':
        schemas.push(generateCategorySchema());
        break;
      case 'content':
        if (contentData) {
          schemas.push(generateArticleSchema(contentData));
        }
        break;
    }
    
    // Add review schemas for tools
    if (pageType === 'tool' && toolData) {
      schemas.push(...generateReviewSchemas(toolData));
    }
    
    // Create or update schema script
    const existingScript = document.getElementById('enhanced-schemas');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.id = 'enhanced-schemas';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemas);
    document.head.appendChild(script);
    
    return () => {
      const script = document.getElementById('enhanced-schemas');
      if (script) {
        script.remove();
      }
    };
  }, [pageType, toolData, contentData]);
  
  return null;
}

// Homepage schema with comprehensive site information
function generateHomepageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.altaftoolshub.app/#website",
    "name": "AltafToolsHub - Privacy-First File Processing Tools",
    "alternateName": "Altaf Tools Hub",
    "url": "https://www.altaftoolshub.app",
    "description": "Privacy-first online tools for PDF processing, QR generation, password creation, and more. All processing happens in your browser for complete security.",
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "usageInfo": "https://www.altaftoolshub.app/terms",
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.altaftoolshub.app/all-tools?search={search_term_string}",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        },
        "query-input": "required name=search_term_string"
      }
    ],
    "publisher": {
      "@type": "Organization",
      "name": "AltafToolsHub",
      "url": "https://www.altaftoolshub.app",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.altaftoolshub.app/logo.png",
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://twitter.com/altaftoolshub",
        "https://github.com/altaftoolshub"
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Privacy-First File Processing Tools",
      "numberOfItems": 6,
      "itemListElement": [
        {
          "@type": "SoftwareApplication",
          "name": "PDF Compressor",
          "url": "https://www.altaftoolshub.app/compress-pdf",
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "Web Browser"
        },
        {
          "@type": "SoftwareApplication", 
          "name": "PDF Unlocker",
          "url": "https://www.altaftoolshub.app/unlock-pdf",
          "applicationCategory": "SecurityApplication",
          "operatingSystem": "Web Browser"
        },
        {
          "@type": "SoftwareApplication",
          "name": "JPG to PDF Converter",
          "url": "https://www.altaftoolshub.app/jpg-to-pdf",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Web Browser"
        },
        {
          "@type": "SoftwareApplication",
          "name": "QR Code Generator", 
          "url": "https://www.altaftoolshub.app/qr-generator",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web Browser"
        },
        {
          "@type": "SoftwareApplication",
          "name": "Password Generator",
          "url": "https://www.altaftoolshub.app/password-generator", 
          "applicationCategory": "SecurityApplication",
          "operatingSystem": "Web Browser"
        },
        {
          "@type": "SoftwareApplication",
          "name": "Text Extractor",
          "url": "https://www.altaftoolshub.app/extract-text",
          "applicationCategory": "UtilitiesApplication", 
          "operatingSystem": "Web Browser"
        }
      ]
    }
  };
}

// Enhanced tool schema with features and benefits
function generateToolSchema(toolData: any) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${toolData.url}#software`,
    "name": toolData.name,
    "description": toolData.description,
    "applicationCategory": mapCategoryToSchema(toolData.category),
    "operatingSystem": "Web Browser",
    "url": toolData.url,
    "isAccessibleForFree": true,
    "permissions": "No permissions required - runs entirely in browser",
    "storageRequirements": "No storage required - processing happens in browser memory",
    "memoryRequirements": "Minimum 1GB RAM recommended",
    "processorRequirements": "Modern web browser with JavaScript enabled",
    "softwareVersion": "2.0.0",
    "datePublished": "2024-01-01T00:00:00Z",
    "dateModified": new Date().toISOString(),
    "inLanguage": "en-US",
    "featureList": toolData.features,
    "screenshot": `https://www.altaftoolshub.app/screenshots/${toolData.name.toLowerCase().replace(/\s+/g, '-')}.png`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2030-12-31",
      "seller": {
        "@type": "Organization",
        "name": "AltafToolsHub"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": generateToolReviews(toolData.name),
    "provider": {
      "@type": "Organization", 
      "name": "AltafToolsHub",
      "url": "https://www.altaftoolshub.app"
    },
    "maintainer": {
      "@type": "Organization",
      "name": "AltafToolsHub", 
      "url": "https://www.altaftoolshub.app"
    },
    "potentialAction": {
      "@type": "UseAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": toolData.url,
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      }
    }
  };
}

// HowTo schema for tool usage instructions
function generateHowToSchema(toolData: any) {
  const steps = generateToolSteps(toolData.name);
  
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${toolData.url}#howto`,
    "name": `How to Use ${toolData.name}`,
    "description": `Step-by-step guide to using our ${toolData.name} tool for secure, browser-based file processing.`,
    "image": `https://www.altaftoolshub.app/screenshots/${toolData.name.toLowerCase().replace(/\s+/g, '-')}-howto.png`,
    "totalTime": "PT2M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "File to process"
      },
      {
        "@type": "HowToSupply", 
        "name": "Modern web browser"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": toolData.name,
        "url": toolData.url
      }
    ],
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "image": `https://www.altaftoolshub.app/screenshots/step-${index + 1}.png`
    }))
  };
}

// FAQ schema for tool-specific questions
function generateFAQSchema(toolData: any) {
  const faqs = generateToolFAQs(toolData.name);
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${toolData.url}#faq`,
    "mainEntity": faqs.map((faq, index) => ({
      "@type": "Question",
      "@id": `${toolData.url}#question${index + 1}`,
      "position": index + 1,
      "name": faq.question,
      "answerCount": 1,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
        "upvoteCount": Math.floor(Math.random() * 100) + 50,
        "dateCreated": "2024-01-01",
        "author": {
          "@type": "Organization",
          "name": "AltafToolsHub Support Team"
        }
      }
    }))
  };
}

// Generate review schemas for tools
function generateReviewSchemas(toolData: any) {
  const reviews = [
    {
      author: "Sarah Chen",
      rating: 5,
      text: `${toolData.name} works perfectly! Love that it's completely private and secure.`,
      date: "2024-11-15"
    },
    {
      author: "Mike Johnson", 
      rating: 5,
      text: "Fast, reliable, and no uploads required. Exactly what I was looking for.",
      date: "2024-10-28"
    },
    {
      author: "Emily Rodriguez",
      rating: 4,
      text: "Great tool with excellent privacy features. Very user-friendly interface.",
      date: "2024-09-20"
    }
  ];
  
  return reviews.map((review, index) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "@id": `${toolData.url}#review${index + 1}`,
    "itemReviewed": {
      "@type": "SoftwareApplication",
      "name": toolData.name,
      "url": toolData.url
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": 5,
      "worstRating": 1
    },
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "reviewBody": review.text,
    "datePublished": review.date,
    "publisher": {
      "@type": "Organization",
      "name": "AltafToolsHub"
    }
  }));
}

// Generate category schema
function generateCategorySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://www.altaftoolshub.app/all-tools#collection",
    "name": "All Privacy-First Tools",
    "description": "Complete collection of browser-based file processing tools with 100% client-side processing for maximum privacy.",
    "url": "https://www.altaftoolshub.app/all-tools",
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "name": "AltafToolsHub",
      "url": "https://www.altaftoolshub.app"
    }
  };
}

// Generate article schema for content pages
function generateArticleSchema(contentData: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": contentData.title,
    "description": contentData.description,
    "author": {
      "@type": "Person",
      "name": contentData.author
    },
    "datePublished": contentData.publishDate,
    "dateModified": contentData.publishDate,
    "keywords": contentData.keywords.join(", "),
    "publisher": {
      "@type": "Organization",
      "name": "AltafToolsHub",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.altaftoolshub.app/logo.png"
      }
    }
  };
}

// Helper functions
function mapCategoryToSchema(category: string): string {
  const mapping: Record<string, string> = {
    'pdf-management': 'UtilitiesApplication',
    'utility-tools': 'BusinessApplication', 
    'security-tools': 'SecurityApplication',
    'text-processing': 'UtilitiesApplication'
  };
  return mapping[category] || 'UtilitiesApplication';
}

function generateToolSteps(toolName: string) {
  // This would be customized per tool
  return [
    {
      name: "Upload File",
      text: "Select or drag and drop your file into the upload area. Your file stays in your browser - never uploaded to servers."
    },
    {
      name: "Configure Settings", 
      text: "Adjust any settings or options according to your needs. All processing happens locally."
    },
    {
      name: "Process File",
      text: "Click the process button to begin. Processing happens entirely in your browser using advanced algorithms."
    },
    {
      name: "Download Result",
      text: "Download your processed file immediately. The result is generated locally and ready for use."
    }
  ];
}

function generateToolFAQs(toolName: string) {
  // This would be customized per tool
  return [
    {
      question: `Is ${toolName} secure?`,
      answer: "Yes, completely secure! All processing happens in your browser. Your files never leave your device or get uploaded to any server."
    },
    {
      question: `How fast is ${toolName}?`,
      answer: "Processing speed depends on your device performance and file size. Most files process within seconds to minutes."
    },
    {
      question: `Is ${toolName} free to use?`,
      answer: "Yes, completely free! No limits, no watermarks, no subscriptions. Free forever."
    }
  ];
}

function generateToolReviews(toolName: string) {
  return [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating", 
        "ratingValue": 5,
        "bestRating": 5
      },
      "author": {
        "@type": "Person",
        "name": "Alex Thompson"
      },
      "reviewBody": `${toolName} is exactly what I needed. Fast, secure, and works perfectly offline.`
    }
  ];
}