import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Image, FileCode, Zap, ArrowRight, Sparkles
} from "lucide-react";
import { toolCategories, Tool } from "@/lib/tools-data";

// Helper component for navigation items
const ToolNavItem = ({ tool }: { tool: Tool }) => {
  const Icon = tool.icon;
  return (
    <Link
      href={tool.href}
      className={cn(
        "group relative flex items-start space-x-3 select-none rounded-xl p-3 leading-none no-underline outline-none transition-all duration-300",
        "hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent",
        "hover:shadow-lg hover:translate-y-[-3px] hover:scale-[1.02]",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
        !tool.available && "opacity-60 hover:translate-y-0 hover:scale-100"
      )}
      data-testid={`nav-${tool.id}`}
    >
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-500",
        "bg-gradient-to-br", tool.color,
        "group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg",
        "shadow-sm"
      )}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="font-medium mb-1 flex items-center gap-2">
          {tool.title}
          {tool.new && (
            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-green-500/20 to-green-400/10 text-green-600 dark:text-green-400 font-semibold animate-pulse-glow">
              <Sparkles className="w-3 h-3 mr-0.5" />
              New
            </span>
          )}
          {!tool.available && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted-foreground/10 text-muted-foreground">
              Soon
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {tool.description}
        </p>
      </div>
    </Link>
  );
};

const menuItems = [
  {
    id: "pdf-management",
    label: "PDF Tools",
    icon: FileText,
    categoryId: "pdf-management",
    href: "/#pdf-tools"
  },
  {
    id: "image-conversion",
    label: "Image Tools", 
    icon: Image,
    categoryId: "image-conversion",
    href: "/#image-tools"
  },
  {
    id: "document-conversion",
    label: "Convert",
    icon: FileCode,
    categoryId: "document-conversion",
    href: "/#convert-tools"
  },
  {
    id: "utilities",
    label: "Utilities",
    icon: Zap,
    categoryId: "utilities",
    href: "/#utilities"
  }
];

export function MultiDropdownNav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenu]);

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

  const handleToggle = (menuId: string) => {
    setOpenMenu(openMenu === menuId ? null : menuId);
  };

  const getDropdownPosition = (menuId: string) => {
    const button = buttonRefs.current[menuId];
    if (!button || !containerRef.current) return { left: 0, width: 400 };
    
    const buttonRect = button.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    // Calculate ideal dropdown width
    const idealWidth = 500;
    const minWidth = 400;
    const maxWidth = Math.min(600, viewportWidth - 40);
    
    // Calculate left position relative to container
    let left = buttonRect.left - containerRect.left;
    
    // Adjust width based on available space
    let width = idealWidth;
    
    // Check if dropdown would overflow viewport
    if (buttonRect.left + idealWidth > viewportWidth - 20) {
      // Adjust position to prevent overflow
      const availableSpace = viewportWidth - buttonRect.left - 20;
      width = Math.max(minWidth, Math.min(availableSpace, maxWidth));
      
      // If still not enough space, align to right edge
      if (width < minWidth) {
        width = minWidth;
        left = Math.max(0, viewportWidth - minWidth - 20 - containerRect.left);
      }
    }
    
    return { left, width };
  };

  return (
    <div 
      ref={containerRef}
      className="relative multi-dropdown-container"
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
                "font-medium transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                openMenu === item.id && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleToggle(item.id)}
              data-testid={`nav-button-${item.id}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          );
        })}
      </div>

      {/* Category-Specific Dropdown */}
      <AnimatePresence>
        {openMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/10 backdrop-blur-sm"
              style={{ zIndex: 2147483646 }}
              onClick={() => setOpenMenu(null)}
            />
            
            {/* Dropdown Container */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className="dropdown-menu-container absolute top-full mt-2"
              style={{ 
                zIndex: 2147483647,
                position: 'absolute',
                left: `${getDropdownPosition(openMenu).left}px`,
                width: `${getDropdownPosition(openMenu).width}px`
              }}
            >
            {menuItems.filter(item => item.id === openMenu).map((menuItem) => {
              const category = toolCategories.find(cat => cat.id === menuItem.categoryId);
              const tools = category?.tools; // Get ALL tools, no slicing
              const Icon = menuItem.icon;
              
              // Calculate grid columns based on number of tools
              const gridCols = tools && tools.length > 6 ? "grid-cols-2" : "grid-cols-1";
              
              return (
                <div key={menuItem.id} className="dropdown-menu-content bg-background/95 backdrop-blur-xl border border-primary/10 rounded-2xl shadow-2xl overflow-hidden">
                  {/* Enhanced Header with Shimmer */}
                  <div className="relative bg-gradient-to-r from-primary/15 via-primary/10 to-secondary/5 p-5 border-b border-primary/10 overflow-hidden">
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-slow" />
                    
                    <div className="relative flex items-center justify-between">
                      <h3 className="font-bold text-xl flex items-center">
                        <motion.div
                          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mr-3 shadow-lg"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="w-5 h-5 text-primary" />
                        </motion.div>
                        {menuItem.label}
                      </h3>
                      <motion.span
                        className="text-sm font-semibold text-primary bg-primary/10 backdrop-blur px-3 py-1.5 rounded-full shadow-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        {tools?.length || 0} tools available
                      </motion.span>
                    </div>
                  </div>
                  
                  {/* Tools Grid with Glass Effect */}
                  <div className="p-5 bg-gradient-to-b from-transparent to-muted/5">
                    {tools && tools.length > 0 ? (
                      <div className={cn(
                        "grid gap-3 max-h-[520px] overflow-y-auto pr-3 custom-scrollbar",
                        "scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent",
                        gridCols
                      )}>
                        {tools.map((tool, index) => (
                          <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ 
                              delay: index * 0.03,
                              duration: 0.3,
                              type: "spring",
                              stiffness: 300,
                              damping: 25
                            }}
                            whileInView={{ opacity: 1 }}
                          >
                            <ToolNavItem tool={tool} />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No tools available in this category
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}