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

// Helper component for navigation items - fixed size buttons
const ToolNavItem = ({ tool, onClick }: { tool: NavTool; onClick?: () => void }) => {
  const Icon = tool.icon;
  
  const content = (
    <div className="group flex items-center gap-2 px-3 py-2.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors h-[44px]">
      <div className={cn(
        "w-6 h-6 rounded flex items-center justify-center flex-shrink-0",
        "bg-gradient-to-br shadow-sm", tool.color
      )}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium flex items-center gap-2">
          <span className="truncate">{tool.title}</span>
          {tool.new && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-medium">
              New
            </span>
          )}
          {!tool.available && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-500 text-white font-medium">
              Soon
            </span>
          )}
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

// Get organized PDF tools - tools that OUTPUT PDFs or have PDF INPUT
const getPdfToolsSections = () => {
  const pdfTools = allTools.filter(tool => 
    tool.category === "pdf-management" || 
    tool.category === "document-conversion" || 
    tool.category === "ebook-conversion" ||
    tool.category === "security" ||
    tool.id === "extract-text" ||
    tool.id === "pdf-to-zip" ||
    // Include all *-to-pdf tools from image-conversion category
    (tool.category === "image-conversion" && tool.id.includes("-to-pdf"))
  );

  // Group tools by their actual categories
  const categories = new Map<string, NavTool[]>();
  
  pdfTools.forEach(tool => {
    const categoryName = tool.category === "pdf-management" ? "PDF Management" :
                         tool.category === "document-conversion" ? "Document Conversion" :
                         tool.category === "image-conversion" ? "Image Conversion" :
                         tool.category === "security" ? "Security" :
                         tool.category === "ebook-conversion" ? "eBook Conversion" :
                         tool.category === "utilities" ? "Utilities" :
                         "Other";
    
    if (!categories.has(categoryName)) {
      categories.set(categoryName, []);
    }
    categories.get(categoryName)!.push(tool);
  });

  // Convert to array format and sort by priority (include all categories)
  const priorityOrder = ["PDF Management", "Document Conversion", "Image Conversion", "Security", "eBook Conversion", "Utilities", "Other"];
  
  // Get all categories, sorted by priority
  const allCategories = Array.from(categories.keys());
  const sortedCategories = [
    ...priorityOrder.filter(cat => categories.has(cat)),
    ...allCategories.filter(cat => !priorityOrder.includes(cat))
  ];
  
  return sortedCategories.map(categoryName => ({
    title: categoryName.toUpperCase(),
    tools: categories.get(categoryName)!.slice(0, 10) // Limit to 10 per category
  }));
};

// Get organized Image tools - tools that OUTPUT images or have IMAGE INPUT
const getImageToolsSections = () => {
  const imageTools = allTools.filter(tool => 
    tool.id === "pdf-to-images" ||
    tool.id === "pdf-to-jpg" ||
    tool.id === "pdf-to-png" ||
    tool.id === "extract-images"
  );

  // Group tools by their actual categories
  const categories = new Map<string, NavTool[]>();
  
  imageTools.forEach(tool => {
    const categoryName = tool.category === "pdf-management" ? "PDF Management" :
                         tool.category === "document-conversion" ? "Document Conversion" :
                         tool.category === "image-conversion" ? "Image Conversion" :
                         "Other";
    
    if (!categories.has(categoryName)) {
      categories.set(categoryName, []);
    }
    categories.get(categoryName)!.push(tool);
  });

  // Convert to array format
  return Array.from(categories.entries()).map(([categoryName, tools]) => ({
    title: categoryName.toUpperCase(),
    tools: tools
  }));
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
  const [arrowPosition, setArrowPosition] = useState<number>(320); // default center position
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
    
    // Calculate arrow position based on button position
    const button = buttonRefs.current[menuId];
    const container = containerRef.current;
    if (button && container) {
      const buttonRect = button.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const relativeLeft = buttonRect.left - containerRect.left;
      const buttonCenter = relativeLeft + buttonRect.width / 2;
      // Add offset for -left-40 (10rem = 160px)
      const arrowPos = buttonCenter + 160;
      setArrowPosition(arrowPos);
    }
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
          { 
            title: "PDF TOOLS", 
            tools: allTools.filter(t => 
              t.category === "pdf-management" || 
              t.category === "document-conversion" || 
              t.category === "ebook-conversion" ||
              t.category === "security" ||
              (t.category === "image-conversion" && (t.id.includes("to-pdf") || t.id.includes("pdf-to")))
            ).slice(0, 12) 
          },
          { 
            title: "IMAGE TOOLS", 
            tools: allTools.filter(t => 
              t.category === "image-conversion" ||
              t.id === "extract-images"
            ).slice(0, 10) 
          },
          { 
            title: "UTILITIES", 
            tools: allTools.filter(t => 
              t.category === "utilities"
            ).slice(0, 8) 
          }
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
              onClick={() => {
                const newMenuId = openMenu === item.id ? null : item.id;
                if (newMenuId) {
                  handleMouseEnter(newMenuId);
                } else {
                  setOpenMenu(null);
                }
              }}
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
              className={cn(
                "absolute top-full mt-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden",
                '-left-40'
              )}
              style={{ 
                zIndex: 10000,
                minWidth: '650px',
                maxWidth: '900px',
                width: 'max-content',
                maxHeight: 'calc(100vh - 120px)',
                overflowY: 'auto'
              }}
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Arrow pointing up to show which menu */}
              <div 
                className="absolute -top-2 w-4 h-4 bg-white dark:bg-gray-900 border-l border-t border-gray-200 dark:border-gray-700 transform rotate-45 shadow-lg transition-all duration-200"
                style={{ left: `${arrowPosition}px` }}
              ></div>
              <div className="p-4">
                {/* Header links for all dropdowns */}
                {menuItems.find(m => m.id === openMenu)?.type === 'pdf' && (
                  <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <Link
                      href="/all-tools?category=pdf-management"
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      onClick={() => setOpenMenu(null)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View All PDF Tools
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                )}
                {menuItems.find(m => m.id === openMenu)?.type === 'image' && (
                  <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <Link
                      href="/all-tools?category=image-conversion"
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      onClick={() => setOpenMenu(null)}
                    >
                      <Image className="w-4 h-4 mr-2" />
                      View All Image Tools
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                )}
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
                  "grid gap-3",
                  (() => {
                    const sections = getDropdownContent(menuItems.find(m => m.id === openMenu)?.type || '');
                    const numSections = sections.length;
                    if (numSections === 1) return "grid-cols-1";
                    if (numSections === 2) return "grid-cols-2";
                    if (numSections === 3) return "grid-cols-3";
                    return "grid-cols-4";
                  })()
                )}>
                  {getDropdownContent(menuItems.find(m => m.id === openMenu)?.type || '').map((section, sectionIdx) => (
                    <div key={sectionIdx} className="flex flex-col">
                      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-1">
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