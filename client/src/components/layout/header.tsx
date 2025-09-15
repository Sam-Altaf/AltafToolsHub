import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo, LogoIcon } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, ChevronDown, FileText, Lock, Image, 
  FileImage, FilePlus, Scissors, Palette, FileArchive,
  Layers, Home, Info, Mail, Star, ArrowRight,
  QrCode, Shield, Type, Book, FileCode, Zap
} from "lucide-react";
import { toolCategories, popularTools, Tool } from "@/lib/tools-data";

// Helper component for navigation items
const ToolNavItem = ({ tool }: { tool: Tool }) => {
  const Icon = tool.icon;
  return (
    <NavigationMenuLink asChild>
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
    </NavigationMenuLink>
  );
};

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <motion.header 
      className={cn(
        "sticky top-0 z-50 w-full max-w-full overflow-x-hidden transition-all duration-300",
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg border-b shadow-sm" 
          : "bg-background border-b"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2" 
            data-testid="link-home"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Logo size="sm" variant="full" className="text-primary" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex relative z-[90]">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/" className={navigationMenuTriggerStyle()}>
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* PDF Management */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-medium">
                  <FileText className="w-4 h-4 mr-2" />
                  PDF Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-[100]">
                  <div className="grid gap-2 p-4 w-[500px] lg:w-[600px] lg:grid-cols-2">
                    {toolCategories.find(cat => cat.id === "pdf-management")?.tools.slice(0, 8).map((tool) => (
                      <ToolNavItem key={tool.id} tool={tool} />
                    ))}
                  </div>
                  <div className="p-4 pt-0">
                    <Link href="/#pdf-tools">
                      <Button variant="outline" className="w-full" size="sm">
                        View All PDF Tools
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Image Conversion */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-medium">
                  <Image className="w-4 h-4 mr-2" />
                  Image Tools
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-[100]">
                  <div className="grid gap-2 p-4 w-[500px] lg:w-[600px] lg:grid-cols-2">
                    {toolCategories.find(cat => cat.id === "image-conversion")?.tools.slice(0, 8).map((tool) => (
                      <ToolNavItem key={tool.id} tool={tool} />
                    ))}
                  </div>
                  <div className="p-4 pt-0">
                    <Link href="/#image-tools">
                      <Button variant="outline" className="w-full" size="sm">
                        View All Image Tools
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Document Conversion */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-medium">
                  <FileCode className="w-4 h-4 mr-2" />
                  Convert
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-[100]">
                  <div className="grid gap-2 p-4 w-[500px] lg:w-[600px] lg:grid-cols-2">
                    {toolCategories.find(cat => cat.id === "document-conversion")?.tools.slice(0, 8).map((tool) => (
                      <ToolNavItem key={tool.id} tool={tool} />
                    ))}
                  </div>
                  <div className="p-4 pt-0">
                    <Link href="/#convert-tools">
                      <Button variant="outline" className="w-full" size="sm">
                        View All Converters
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Utilities */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-medium">
                  <Zap className="w-4 h-4 mr-2" />
                  Utilities
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-[100]">
                  <div className="grid gap-2 p-4 w-[500px] lg:w-[600px] lg:grid-cols-2">
                    {toolCategories.find(cat => cat.id === "utilities")?.tools.map((tool) => (
                      <ToolNavItem key={tool.id} tool={tool} />
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* About Link */}
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  <Button 
                    variant="ghost" 
                    className="font-medium"
                    data-testid="nav-about-desktop"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    About
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/compress-pdf">
                <Button 
                  className="btn-gradient text-white font-medium"
                  data-testid="button-try-now-desktop"
                >
                  Try Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
            <ThemeToggle />
          </div>

          {/* Mobile Right Section */}
          <div className="flex lg:hidden items-center space-x-2">
            <ThemeToggle />
            
            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative"
                  data-testid="button-mobile-menu"
                >
                  <AnimatePresence mode="wait">
                    {mobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <X className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Menu className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              
              <SheetContent 
                side="left" 
                className="w-full sm:w-[400px] p-0"
              >
                <SheetHeader className="border-b px-6 py-4">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center space-x-2">
                      <LogoIcon size="sm" />
                      <span>Navigation</span>
                    </SheetTitle>
                  </div>
                </SheetHeader>
                
                <div className="flex flex-col h-full">
                  <nav className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="space-y-1">
                      {/* Home Link */}
                      <Link href="/">
                        <SheetClose asChild>
                          <Button
                            variant={isActive("/") ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            data-testid="nav-home-mobile"
                          >
                            <Home className="w-4 h-4 mr-3" />
                            Home
                          </Button>
                        </SheetClose>
                      </Link>

                      {/* Tool Categories for Mobile */}
                      {toolCategories.map((category) => (
                        <div key={category.id} className="py-3">
                          <h3 className="mb-2 px-3 text-sm font-semibold text-muted-foreground flex items-center">
                            <category.icon className="w-4 h-4 mr-2" />
                            {category.name}
                          </h3>
                          <div className="space-y-1">
                            {category.tools.slice(0, 5).map((tool) => {
                              const Icon = tool.icon;
                              return (
                                <Link key={tool.id} href={tool.href}>
                                  <SheetClose asChild>
                                    <Button
                                      variant={isActive(tool.href) ? "secondary" : "ghost"}
                                      className={cn(
                                        "w-full justify-start group",
                                        !tool.available && "opacity-60"
                                      )}
                                      data-testid={`nav-${tool.id}-mobile`}
                                    >
                                      <Icon className="w-4 h-4 mr-3" />
                                      <div className="flex-1 text-left">
                                        <div className="flex items-center gap-2">
                                          {tool.title}
                                          {tool.new && (
                                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600">
                                              New
                                            </span>
                                          )}
                                          {!tool.available && (
                                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted-foreground/10 text-muted-foreground">
                                              Soon
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {tool.description}
                                        </div>
                                      </div>
                                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Button>
                                  </SheetClose>
                                </Link>
                              );
                            })}
                            {category.tools.length > 5 && (
                              <Link href={`/#${category.id}`}>
                                <SheetClose asChild>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start text-primary"
                                    size="sm"
                                  >
                                    View all {category.tools.length} tools
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </Button>
                                </SheetClose>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* About and Contact */}
                      <div className="py-3 border-t">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          data-testid="nav-about-mobile"
                        >
                          <Info className="w-4 h-4 mr-3" />
                          About
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          data-testid="nav-contact-mobile"
                        >
                          <Mail className="w-4 h-4 mr-3" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </nav>

                  {/* CTA Button */}
                  <div className="p-6 border-t">
                    <Link href="/compress-pdf">
                      <SheetClose asChild>
                        <Button 
                          className="w-full btn-gradient text-white"
                          data-testid="button-try-now-mobile"
                        >
                          Try PDF Compressor
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </SheetClose>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}