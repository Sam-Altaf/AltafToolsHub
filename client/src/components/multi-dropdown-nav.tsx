import { useState, useRef, useEffect } from "react";
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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMenuItemMouseEnter = (itemId: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredItem(itemId);
  };

  const handleMenuItemMouseLeave = () => {
    // Add a small delay before closing to allow moving to dropdown
    timeoutRef.current = setTimeout(() => {
      if (!isDropdownHovered) {
        setHoveredItem(null);
      }
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    setIsDropdownHovered(true);
    // Clear timeout to prevent dropdown from closing
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    setIsDropdownHovered(false);
    // Close dropdown after a delay
    timeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 150);
  };

  return (
    <div className="relative flex items-center">
      {/* Menu Triggers */}
      <div className="flex items-center space-x-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => handleMenuItemMouseEnter(item.id)}
              onMouseLeave={handleMenuItemMouseLeave}
            >
              <Button
                variant="ghost"
                className={cn(
                  "font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  hoveredItem === item.id && "bg-accent text-accent-foreground"
                )}
                data-testid={`nav-${item.id}`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Individual Dropdown for each menu item */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            key={hoveredItem}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 z-50"
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            <div className="bg-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl p-6 min-w-[350px] max-w-[800px]">
              {menuItems
                .filter(item => item.id === hoveredItem)
                .map((menuItem) => {
                  const category = toolCategories.find(cat => cat.id === menuItem.categoryId);
                  const tools = menuItem.id === "utilities" 
                    ? category?.tools 
                    : category?.tools.slice(0, 8);
                  
                  return (
                    <div key={menuItem.id}>
                      <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider flex items-center">
                        <menuItem.icon className="w-4 h-4 mr-2" />
                        {menuItem.label} ({category?.tools.length || 0} tools)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                        {tools?.map((tool) => (
                          <ToolNavItem key={tool.id} tool={tool} />
                        ))}
                      </div>
                      {menuItem.id !== "utilities" && category && category.tools.length > 8 && (
                        <Link href={menuItem.href}>
                          <Button 
                            variant="outline" 
                            className="w-full mt-4 hover:scale-[1.02] transition-transform" 
                            size="sm"
                          >
                            View All {category.tools.length} {menuItem.label}
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