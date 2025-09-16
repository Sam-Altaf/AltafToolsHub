import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Image, FileCode, Zap, ArrowRight
} from "lucide-react";
import { toolCategories, Tool } from "@/lib/tools-data";

// Helper component for navigation items
const ToolNavItem = ({ tool }: { tool: Tool }) => {
  const Icon = tool.icon;
  return (
    <Link
      href={tool.href}
      className={cn(
        "group flex items-start space-x-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        !tool.available && "opacity-60"
      )}
      data-testid={`nav-${tool.id}`}
    >
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
        "bg-gradient-to-br", tool.color,
        "group-hover:scale-110"
      )}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="font-medium mb-1 flex items-center gap-2">
          {tool.title}
          {tool.new && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
              New
            </span>
          )}
          {!tool.available && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted-foreground/10 text-muted-foreground">
              Soon
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
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
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
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
              variant="ghost"
              className="font-medium hover:bg-accent hover:text-accent-foreground"
              onClick={handleToggle}
              data-testid={`nav-button-${item.id}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          );
        })}
      </div>

      {/* All Dropdowns Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-1"
            style={{ zIndex: 9999 }}
          >
            <div className="flex gap-4 p-6 bg-background border rounded-xl shadow-xl" style={{ position: 'relative', zIndex: 9999 }}>
              {menuItems.map((menuItem) => {
                const category = toolCategories.find(cat => cat.id === menuItem.categoryId);
                const tools = menuItem.id === "utilities" 
                  ? category?.tools 
                  : category?.tools.slice(0, 8);
                
                return (
                  <div key={menuItem.id} className="flex-1 min-w-[280px]">
                    <h3 className="font-semibold mb-4 text-sm text-muted-foreground flex items-center">
                      <menuItem.icon className="w-4 h-4 mr-2" />
                      {menuItem.label}
                    </h3>
                    <div className="space-y-1 max-h-[400px] overflow-y-auto">
                      {tools?.map((tool) => (
                        <ToolNavItem key={tool.id} tool={tool} />
                      ))}
                    </div>
                    {menuItem.id !== "utilities" && category && category.tools.length > 8 && (
                      <Link href={menuItem.href}>
                        <Button variant="outline" className="w-full mt-4" size="sm">
                          View All {menuItem.label}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}