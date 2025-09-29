import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Image, Layers, ArrowRight, Sparkles, ChevronDown, LucideIcon
} from "lucide-react";
import { allTools, Tool } from "@/lib/tools-data";

// Helper type for custom tools
interface CustomTool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  available: boolean;
  category: string;
  new?: boolean;
}

type NavTool = Tool | CustomTool;

// Helper component for navigation items - improved layout with better sizing
const ToolNavItem = ({ tool, onClick }: { tool: NavTool; onClick?: () => void }) => {
  const Icon = tool.icon;
  
  const content = (
    <div className="group flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
        "bg-gradient-to-br shadow-sm", tool.color
      )}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium flex items-center gap-2 mb-1">
          <span className="truncate">{tool.title}</span>
          {tool.new && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-600 text-white font-medium">
              New
            </span>
          )}
          {!tool.available && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500 text-white font-medium">
              Soon
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground line-clamp-2">
          {tool.description}
        </div>
      </div>
    </div>
  );

  if (!tool.available) {
    return (
      <button
        className="w-full cursor-not-allowed opacity-50"
        disabled
        aria-disabled="true"
        data-testid={`nav-${tool.id}-disabled`}
        onClick={(e) => e.preventDefault()}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={tool.href}
      className="block w-full"
      data-testid={`nav-${tool.id}`}
      onClick={onClick}
    >
      {content}
    </Link>
  );
};

// Get organized PDF tools
const getPdfToolsSections = () => {
  const pdfTools = allTools.filter(tool => 
    tool.category === "pdf-management" || 
    tool.category === "pdf-conversion" || 
    tool.category === "pdf-security" ||
    tool.id === "extract-text" ||
    tool.id === "add-page-numbers" ||
    tool.id === "watermark-pdf"
  );

  return [
    {
      title: "ORGANIZE PDF",
      tools: [
        pdfTools.find(t => t.id === "merge-pdf"),
        pdfTools.find(t => t.id === "split-pdf"),
        pdfTools.find(t => t.id === "remove-pages"),
        pdfTools.find(t => t.id === "extract-pages"),
        pdfTools.find(t => t.id === "organize-pdf"),
        { id: "scan-to-pdf", title: "Scan to PDF", description: "Scan documents to PDF", icon: FileText, href: "/scan-to-pdf", color: "from-blue-500 to-indigo-500", available: false, category: "pdf-management" } as CustomTool
      ].filter(Boolean) as NavTool[]
    },
    {
      title: "OPTIMIZE PDF",
      tools: [
        pdfTools.find(t => t.id === "compress-pdf"),
        { id: "repair-pdf", title: "Repair PDF", description: "Repair corrupted PDF files", icon: FileText, href: "/repair-pdf", color: "from-red-500 to-orange-500", available: false, category: "pdf-management" } as CustomTool,
        pdfTools.find(t => t.id === "extract-text") ? {...pdfTools.find(t => t.id === "extract-text")!, title: "OCR PDF (Extract Text)"} as NavTool : undefined
      ].filter(Boolean) as NavTool[]
    },
    {
      title: "CONVERT TO PDF",
      tools: [
        pdfTools.find(t => t.id === "jpg-to-pdf"),
        pdfTools.find(t => t.id === "word-to-pdf"),
        pdfTools.find(t => t.id === "powerpoint-to-pdf"),
        pdfTools.find(t => t.id === "excel-to-pdf"),
        pdfTools.find(t => t.id === "html-to-pdf")
      ].filter(Boolean) as NavTool[]
    },
    {
      title: "CONVERT FROM PDF",
      tools: [
        pdfTools.find(t => t.id === "pdf-to-jpg"),
        pdfTools.find(t => t.id === "pdf-to-word"),
        pdfTools.find(t => t.id === "pdf-to-powerpoint"),
        pdfTools.find(t => t.id === "pdf-to-excel"),
        pdfTools.find(t => t.id === "pdf-to-pdfa")
      ].filter(Boolean) as NavTool[]
    },
    {
      title: "EDIT PDF",
      tools: [
        pdfTools.find(t => t.id === "rotate-pdf"),
        pdfTools.find(t => t.id === "add-page-numbers"),
        pdfTools.find(t => t.id === "watermark-pdf"),
        pdfTools.find(t => t.id === "crop-pdf"),
        { id: "edit-pdf", title: "Edit PDF", description: "Edit PDF text and images", icon: FileText, href: "/edit-pdf", color: "from-purple-500 to-pink-500", available: false, category: "pdf-management" } as CustomTool
      ].filter(Boolean) as NavTool[]
    },
    {
      title: "PDF SECURITY",
      tools: [
        pdfTools.find(t => t.id === "unlock-pdf"),
        pdfTools.find(t => t.id === "protect-pdf"),
        pdfTools.find(t => t.id === "sign-pdf"),
        { id: "redact-pdf", title: "Redact PDF", description: "Redact sensitive information", icon: FileText, href: "/redact-pdf", color: "from-gray-500 to-slate-500", available: false, category: "pdf-security" } as CustomTool,
        { id: "compare-pdf", title: "Compare PDF", description: "Compare two PDF files", icon: FileText, href: "/compare-pdf", color: "from-teal-500 to-cyan-500", available: false, category: "pdf-management" } as CustomTool
      ].filter(Boolean) as NavTool[]
    }
  ];
};

// Get organized Image tools
const getImageToolsSections = () => {
  const imageTools = allTools.filter(tool => 
    tool.category === "image-conversion" || 
    tool.category === "image-editing" ||
    tool.id === "extract-images"
  );

  return [
    {
      title: "IMAGE CONVERSION",
      tools: [
        { id: "jpg-to-png", title: "JPG to PNG", description: "Convert JPG to PNG", icon: Image, href: "/jpg-to-png", color: "from-blue-500 to-cyan-500", available: false, category: "image-conversion" } as CustomTool,
        { id: "png-to-jpg", title: "PNG to JPG", description: "Convert PNG to JPG", icon: Image, href: "/png-to-jpg", color: "from-cyan-500 to-blue-500", available: false, category: "image-conversion" } as CustomTool,
        { id: "webp-to-jpg", title: "WebP to JPG", description: "Convert WebP to JPG", icon: Image, href: "/webp-to-jpg", color: "from-green-500 to-emerald-500", available: false, category: "image-conversion" } as CustomTool,
        { id: "svg-to-png", title: "SVG to PNG", description: "Convert SVG to PNG", icon: Image, href: "/svg-to-png", color: "from-purple-500 to-pink-500", available: false, category: "image-conversion" } as CustomTool
      ]
    },
    {
      title: "IMAGE OPTIMIZATION",
      tools: [
        imageTools.find(t => t.id === "compress-image") || { id: "compress-image", title: "Compress Images", description: "Reduce image file size", icon: Image, href: "/compress-image", color: "from-orange-500 to-red-500", available: false, category: "image-editing" } as CustomTool,
        imageTools.find(t => t.id === "resize-image") || { id: "resize-image", title: "Resize Images", description: "Resize images to custom dimensions", icon: Image, href: "/resize-image", color: "from-teal-500 to-green-500", available: false, category: "image-editing" } as CustomTool,
        imageTools.find(t => t.id === "crop-image") || { id: "crop-image", title: "Crop Images", description: "Crop images to size", icon: Image, href: "/crop-image", color: "from-indigo-500 to-blue-500", available: false, category: "image-editing" } as CustomTool
      ]
    },
    {
      title: "IMAGE EDITING",
      tools: [
        { id: "add-watermark", title: "Add Watermark", description: "Add watermark to images", icon: Image, href: "/add-watermark", color: "from-indigo-500 to-purple-500", available: false, category: "image-editing" } as CustomTool,
        { id: "rotate-image", title: "Rotate Images", description: "Rotate images", icon: Image, href: "/rotate-image", color: "from-amber-500 to-orange-500", available: false, category: "image-editing" } as CustomTool,
        { id: "flip-image", title: "Flip Images", description: "Flip images horizontally or vertically", icon: Image, href: "/flip-image", color: "from-pink-500 to-rose-500", available: false, category: "image-editing" } as CustomTool
      ]
    }
  ];
};

// Menu configuration
const menuItems = [
  {
    id: "pdf-tools",
    label: "PDF Tools",
    icon: FileText,
    type: "pdf"
  },
  {
    id: "image-tools",
    label: "Image Tools",
    icon: Image,
    type: "image"
  },
  {
    id: "all-tools",
    label: "All Tools",
    icon: Layers,
    type: "all"
  }
];

export function MultiDropdownNav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle mouse enter on button
  const handleMouseEnter = (menuId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenMenu(menuId);
  };

  // Handle mouse leave with delay for better UX
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 150); // Small delay to prevent accidental closing
  };

  // Handle mouse enter on dropdown - cancel closing
  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
      }
    };

    if (openMenu) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openMenu]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getDropdownContent = (menuType: string) => {
    switch (menuType) {
      case 'pdf':
        return getPdfToolsSections();
      case 'image':
        return getImageToolsSections();
      case 'all':
        return [
          { title: "PDF TOOLS", tools: allTools.filter(t => t.category.includes("pdf")).slice(0, 8) },
          { title: "IMAGE TOOLS", tools: allTools.filter(t => t.category.includes("image")).slice(0, 8) },
          { title: "UTILITIES", tools: allTools.filter(t => t.category === "utilities").slice(0, 8) }
        ];
      default:
        return [];
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative multi-dropdown-container"
      onMouseLeave={handleMouseLeave}
    >
      {/* Menu Triggers */}
      <div className="flex items-center space-x-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              ref={(el) => { buttonRefs.current[item.id] = el }}
              variant="ghost"
              className={cn(
                "text-sm font-medium group px-3",
                "hover:bg-accent hover:text-accent-foreground",
                openMenu === item.id && "bg-accent text-accent-foreground"
              )}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)}
              data-testid={`nav-button-${item.id}`}
            >
              <Icon className="w-3.5 h-3.5 mr-1.5" />
              {item.label}
              <ChevronDown className="w-3 h-3 ml-1 group-hover:translate-y-0.5" />
            </Button>
          );
        })}
      </div>

      {/* Mega Menu Dropdown - Positioned relative to navigation */}
      <AnimatePresence>
        {openMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed inset-0 top-16 bg-black/10 dark:bg-black/30"
              style={{ zIndex: 9999 }}
              onClick={() => setOpenMenu(null)}
            />
            
            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-0 top-full mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              style={{ 
                zIndex: 10000,
                minWidth: '800px',
                maxWidth: '1000px',
                width: 'max-content'
              }}
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="p-6">
                {/* For All Tools - Add link at top */}
                {menuItems.find(m => m.id === openMenu)?.type === 'all' && (
                  <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <Link
                      href="/all-tools"
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      onClick={() => setOpenMenu(null)}
                    >
                      <Layers className="w-4 h-4 mr-2" />
                      View All Tools Page
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                )}
                
                {/* Sections displayed in optimized grid layout */}
                <div className={cn(
                  "grid gap-6",
                  menuItems.find(m => m.id === openMenu)?.type === 'pdf' && "grid-cols-3", 
                  menuItems.find(m => m.id === openMenu)?.type === 'image' && "grid-cols-3",
                  menuItems.find(m => m.id === openMenu)?.type === 'all' && "grid-cols-3"
                )}>
                  {getDropdownContent(menuItems.find(m => m.id === openMenu)?.type || '').map((section, sectionIdx) => (
                    <div key={sectionIdx} className="flex flex-col space-y-2">
                      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2">
                        {section.title}
                      </h3>
                      <div className="space-y-1">
                        {section.tools.map((tool) => tool && (
                          <ToolNavItem 
                            key={tool.id} 
                            tool={tool} 
                            onClick={() => setOpenMenu(null)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}