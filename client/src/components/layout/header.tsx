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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, ChevronDown, FileText, Lock, Image, 
  FileImage, FilePlus, Scissors, Palette, FileArchive,
  Layers, Home, Info, Mail, Star, ArrowRight,
  QrCode, Shield, Type
} from "lucide-react";

const pdfTools = [
  {
    id: "compress-pdf",
    title: "Compress PDF",
    description: "Reduce file size",
    icon: FileText,
    href: "/compress-pdf",
    available: true
  },
  {
    id: "unlock-pdf",
    title: "Unlock PDF", 
    description: "Remove password",
    icon: Lock,
    href: "/unlock-pdf",
    available: true
  },
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF",
    description: "Convert images",
    icon: Image,
    href: "/jpg-to-pdf",
    available: true
  }
];

const utilityTools = [
  {
    id: "qr-generator",
    title: "QR Generator",
    description: "Create QR codes",
    icon: QrCode,
    href: "/qr-generator",
    available: true
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description: "Secure passwords",
    icon: Shield,
    href: "/password-generator",
    available: true
  },
  {
    id: "word-counter",
    title: "Word Counter",
    description: "Count text stats",
    icon: Type,
    href: "/word-counter",
    available: true
  }
];

const moreTools = [
  {
    id: "pdf-to-jpg",
    title: "PDF to JPG",
    description: "Extract images",
    icon: FileImage,
    href: "/pdf-to-jpg",
    available: false
  },
  {
    id: "merge-pdf",
    title: "Merge PDF",
    description: "Combine files",
    icon: FilePlus,
    href: "/merge-pdf",
    available: false
  },
  {
    id: "split-pdf",
    title: "Split PDF",
    description: "Divide pages",
    icon: Scissors,
    href: "/split-pdf",
    available: false
  },
  {
    id: "watermark-pdf",
    title: "Watermark PDF",
    description: "Add watermarks",
    icon: Palette,
    href: "/watermark-pdf",
    available: false
  },
  {
    id: "pdf-to-zip",
    title: "PDF to ZIP",
    description: "Create archives",
    icon: FileArchive,
    href: "/pdf-to-zip",
    available: false
  },
  {
    id: "organize-pdf",
    title: "Organize PDF",
    description: "Reorder pages",
    icon: Layers,
    href: "/organize-pdf",
    available: false
  }
];

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
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                className="font-medium"
                data-testid="nav-home-desktop"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>

            {/* PDF Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="font-medium"
                  data-testid="nav-pdf-tools-desktop"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  PDF Tools
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-64 glass dark:glass-dark"
              >
                <DropdownMenuLabel>Available Tools</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {pdfTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link key={tool.id} href={tool.href}>
                      <DropdownMenuItem 
                        className="cursor-pointer group"
                        data-testid={`dropdown-${tool.id}`}
                      >
                        <div className="flex items-start space-x-3 w-full">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{tool.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {tool.description}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </DropdownMenuItem>
                    </Link>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Utility Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="font-medium"
                  data-testid="nav-utility-tools-desktop"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Utility Tools
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-64 glass dark:glass-dark"
              >
                <DropdownMenuLabel>Available Tools</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {utilityTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link key={tool.id} href={tool.href}>
                      <DropdownMenuItem 
                        className="cursor-pointer group"
                        data-testid={`dropdown-${tool.id}`}
                      >
                        <div className="flex items-start space-x-3 w-full">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{tool.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {tool.description}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </DropdownMenuItem>
                    </Link>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="font-medium"
                  data-testid="nav-more-tools-desktop"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  More Tools
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-64 glass dark:glass-dark"
              >
                <DropdownMenuLabel className="flex items-center justify-between">
                  Coming Soon
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    New
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {moreTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <DropdownMenuItem 
                      key={tool.id}
                      className="cursor-pointer group opacity-60"
                      disabled
                      data-testid={`dropdown-${tool.id}`}
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{tool.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {tool.description}
                          </div>
                        </div>
                        <Star className="w-3 h-3 text-primary" />
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* About Link */}
            <Button 
              variant="ghost" 
              className="font-medium"
              data-testid="nav-about-desktop"
            >
              <Info className="w-4 h-4 mr-2" />
              About
            </Button>

            {/* Contact Link */}
            <Button 
              variant="ghost" 
              className="font-medium"
              data-testid="nav-contact-desktop"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </nav>

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

                      {/* PDF Tools Section */}
                      <div className="py-3">
                        <h3 className="mb-2 px-3 text-sm font-semibold text-muted-foreground">
                          PDF Tools
                        </h3>
                        <div className="space-y-1">
                          {pdfTools.map((tool) => {
                            const Icon = tool.icon;
                            return (
                              <Link key={tool.id} href={tool.href}>
                                <SheetClose asChild>
                                  <Button
                                    variant={isActive(tool.href) ? "secondary" : "ghost"}
                                    className="w-full justify-start group"
                                    data-testid={`nav-${tool.id}-mobile`}
                                  >
                                    <Icon className="w-4 h-4 mr-3" />
                                    <div className="flex-1 text-left">
                                      <div>{tool.title}</div>
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
                        </div>
                      </div>

                      {/* Utility Tools Section */}
                      <div className="py-3">
                        <h3 className="mb-2 px-3 text-sm font-semibold text-muted-foreground">
                          Utility Tools
                        </h3>
                        <div className="space-y-1">
                          {utilityTools.map((tool) => {
                            const Icon = tool.icon;
                            return (
                              <Link key={tool.id} href={tool.href}>
                                <SheetClose asChild>
                                  <Button
                                    variant={isActive(tool.href) ? "secondary" : "ghost"}
                                    className="w-full justify-start group"
                                    data-testid={`nav-${tool.id}-mobile`}
                                  >
                                    <Icon className="w-4 h-4 mr-3" />
                                    <div className="flex-1 text-left">
                                      <div>{tool.title}</div>
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
                        </div>
                      </div>

                      {/* More Tools Section */}
                      <div className="py-3">
                        <h3 className="mb-2 px-3 text-sm font-semibold text-muted-foreground flex items-center justify-between">
                          More Tools
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Coming Soon
                          </span>
                        </h3>
                        <div className="space-y-1 opacity-60">
                          {moreTools.map((tool) => {
                            const Icon = tool.icon;
                            return (
                              <Button
                                key={tool.id}
                                variant="ghost"
                                className="w-full justify-start cursor-not-allowed"
                                disabled
                                data-testid={`nav-${tool.id}-mobile`}
                              >
                                <Icon className="w-4 h-4 mr-3" />
                                <div className="flex-1 text-left">
                                  <div>{tool.title}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {tool.description}
                                  </div>
                                </div>
                                <Star className="w-3 h-3 text-primary" />
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="my-4 h-px bg-border" />

                      {/* About Link */}
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        data-testid="nav-about-mobile"
                      >
                        <Info className="w-4 h-4 mr-3" />
                        About
                      </Button>

                      {/* Contact Link */}
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        data-testid="nav-contact-mobile"
                      >
                        <Mail className="w-4 h-4 mr-3" />
                        Contact
                      </Button>
                    </div>
                  </nav>
                  
                  {/* Mobile CTA */}
                  <div className="border-t p-6">
                    <Link href="/compress-pdf">
                      <SheetClose asChild>
                        <Button 
                          className="w-full btn-gradient text-white font-medium"
                          data-testid="button-try-now-mobile"
                        >
                          Try PDF Compressor
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </SheetClose>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      100% Free • No Sign-up Required
                    </p>
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