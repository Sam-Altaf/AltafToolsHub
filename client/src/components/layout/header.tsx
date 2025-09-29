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
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, Home, Info, Mail, ArrowRight, Clock, BookOpen, GraduationCap
} from "lucide-react";
import { toolCategories, popularTools, Tool } from "@/lib/tools-data";
import { MultiDropdownNav } from "@/components/multi-dropdown-nav";
import { getMotionProps } from "@/hooks/use-reduced-motion";
import { ReducedMotionToggle } from "@/components/reduced-motion-toggle";
import { useReducedMotionContext } from "@/components/reduced-motion-provider";

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { reducedMotion } = useReducedMotionContext();
  
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
        "sticky top-0 w-full max-w-full transition-all duration-300",
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg border-b shadow-sm" 
          : "bg-background border-b"
      )}
      style={{ 
        zIndex: 10000,  // High z-index for header but not maximum (dropdown needs to be above)
        position: 'sticky',
        top: 0,
        isolation: 'isolate' // Create new stacking context
      }}
      {...getMotionProps(reducedMotion, {
        initial: { y: -100 },
        animate: { y: 0 },
        transition: { type: "spring", stiffness: 100, damping: 20 }
      })}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2" 
            data-testid="link-home"
            aria-label="Home - AltafToolsHub"
          >
            <motion.div
              {...getMotionProps(reducedMotion, {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                transition: { type: "spring", stiffness: 400, damping: 17 }
              })}
            >
              <Logo size="sm" variant="full" className="text-primary" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <Button 
              variant="ghost" 
              className="font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              asChild
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              className="font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              data-testid="nav-all-tools-desktop"
              asChild
            >
              <Link href="/all-tools">
                <Menu className="w-4 h-4 mr-2" />
                All Tools
              </Link>
            </Button>
            
            <MultiDropdownNav />
            
            <Button 
              variant="ghost" 
              className="font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              data-testid="nav-guides-desktop"
              asChild
            >
              <Link href="/guides">
                <BookOpen className="w-4 h-4 mr-2" />
                Guides
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              className="font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              data-testid="nav-resources-desktop"
              asChild
            >
              <Link href="/resources">
                <GraduationCap className="w-4 h-4 mr-2" />
                Resources
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              className="font-medium"
              data-testid="nav-about-desktop"
            >
              <Info className="w-4 h-4 mr-2" />
              About
            </Button>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-2">
            <motion.div 
              {...getMotionProps(reducedMotion, {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 }
              })}
            >
              <Button 
                className="btn-gradient text-white font-medium focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                data-testid="button-try-now-desktop"
                asChild
              >
                <Link href="/compress-pdf">
                  Try Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
            <ReducedMotionToggle />
            <ThemeToggle />
          </div>

          {/* Mobile Right Section */}
          <div className="flex lg:hidden items-center space-x-2">
            <ReducedMotionToggle />
            <ThemeToggle />
            
            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative"
                  data-testid="button-mobile-menu"
                  aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-navigation"
                >
                  <AnimatePresence mode="wait">
                    {mobileMenuOpen ? (
                      <motion.div
                        key="close"
                        {...getMotionProps(reducedMotion, {
                          initial: { rotate: -90, opacity: 0 },
                          animate: { rotate: 0, opacity: 1 },
                          exit: { rotate: 90, opacity: 0 },
                          transition: { duration: 0.2 }
                        })}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <X className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        {...getMotionProps(reducedMotion, {
                          initial: { rotate: 90, opacity: 0 },
                          animate: { rotate: 0, opacity: 1 },
                          exit: { rotate: -90, opacity: 0 },
                          transition: { duration: 0.2 }
                        })}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Menu className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
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
                  <nav className="flex-1 overflow-y-auto px-6 py-6" aria-label="Mobile navigation" id="mobile-navigation">
                    <div className="space-y-1" role="list">
                      {/* Home Link */}
                      <SheetClose asChild>
                        <Button
                          variant={isActive("/") ? "secondary" : "ghost"}
                          className="w-full justify-start focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                          data-testid="nav-home-mobile"
                          asChild
                        >
                          <Link href="/">
                            <Home className="w-4 h-4 mr-3" />
                            Home
                          </Link>
                        </Button>
                      </SheetClose>
                      
                      {/* All Tools Link */}
                      <SheetClose asChild>
                        <Button
                          variant={isActive("/all-tools") ? "secondary" : "ghost"}
                          className="w-full justify-start focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                          data-testid="nav-all-tools-mobile"
                          asChild
                        >
                          <Link href="/all-tools">
                            <Menu className="w-4 h-4 mr-3" />
                            All Tools
                          </Link>
                        </Button>
                      </SheetClose>

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
                                <SheetClose key={tool.id} asChild>
                                  <Button
                                    variant={isActive(tool.href) ? "secondary" : "ghost"}
                                    className={cn(
                                      "w-full justify-start group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                                      !tool.available && "opacity-60 cursor-not-allowed"
                                    )}
                                    data-testid={`nav-${tool.id}-mobile`}
                                    disabled={!tool.available}
                                    aria-disabled={!tool.available}
                                    asChild={tool.available}
                                    onClick={!tool.available ? (e) => e.preventDefault() : undefined}
                                  >
                                    {tool.available ? (
                                      <Link href={tool.href}>
                                        <Icon className="w-4 h-4 mr-3" />
                                        <div className="flex-1 text-left">
                                          <div className="flex items-center gap-2">
                                            {tool.title}
                                            {tool.new && (
                                              <span className="text-xs px-1.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-700 to-emerald-800 text-white shadow-md">
                                                New
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {tool.description}
                                          </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </Link>
                                    ) : (
                                      <div className="flex w-full items-center">
                                        <Icon className="w-4 h-4 mr-3" />
                                        <div className="flex-1 text-left">
                                          <div className="flex items-center gap-2">
                                            {tool.title}
                                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-md">
                                              Soon
                                            </span>
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {tool.description}
                                          </div>
                                        </div>
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                      </div>
                                    )}
                                  </Button>
                                </SheetClose>
                              );
                            })}
                            {category.tools.length > 5 && (
                              <SheetClose asChild>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                  size="sm"
                                  asChild
                                >
                                  <Link href={`/#${category.id}`}>
                                    View all {category.tools.length} tools
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </Link>
                                </Button>
                              </SheetClose>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Guides and Resources */}
                      <div className="py-3 border-t">
                        <SheetClose asChild>
                          <Button
                            variant={isActive("/guides") ? "secondary" : "ghost"}
                            className="w-full justify-start focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            data-testid="nav-guides-mobile"
                            asChild
                          >
                            <Link href="/guides">
                              <BookOpen className="w-4 h-4 mr-3" />
                              How-To Guides
                            </Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button
                            variant={isActive("/resources") ? "secondary" : "ghost"}
                            className="w-full justify-start focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            data-testid="nav-resources-mobile"
                            asChild
                          >
                            <Link href="/resources">
                              <GraduationCap className="w-4 h-4 mr-3" />
                              Learning Center
                            </Link>
                          </Button>
                        </SheetClose>
                      </div>

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
                    <SheetClose asChild>
                      <Button 
                        className="w-full btn-gradient text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                        data-testid="button-try-now-mobile"
                        asChild
                      >
                        <Link href="/compress-pdf">
                          Try PDF Compressor
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </SheetClose>
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