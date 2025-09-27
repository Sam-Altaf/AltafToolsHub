import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { ReducedMotionProvider } from "@/components/reduced-motion-provider";
import ScrollToTop from "@/components/scroll-to-top";
import ScrollToTopButton from "@/components/scroll-to-top-button";
import NavigationMemory from "@/components/navigation-memory";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CookieConsent from "@/components/cookie-consent";
import LoadingSpinner from "@/components/LoadingSpinner";

// Eagerly load critical pages
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

// Lazy load all other pages for better performance
const AllTools = lazy(() => import("@/pages/all-tools"));
const CompressPDF = lazy(() => import("@/pages/compress-pdf"));
const UnlockPDF = lazy(() => import("@/pages/unlock-pdf"));
const JpgToPDF = lazy(() => import("@/pages/jpg-to-pdf"));
const QRGenerator = lazy(() => import("@/pages/qr-generator"));
const PasswordGenerator = lazy(() => import("@/pages/password-generator"));
const ExtractText = lazy(() => import("@/pages/extract-text"));
const HowItWorks = lazy(() => import("@/pages/how-it-works"));
const UseCases = lazy(() => import("@/pages/use-cases"));
const MergePDF = lazy(() => import("@/pages/merge-pdf"));
const SplitPDF = lazy(() => import("@/pages/split-pdf"));
const RotatePDF = lazy(() => import("@/pages/rotate-pdf"));
const OrganizePDF = lazy(() => import("@/pages/organize-pdf"));
const RemovePages = lazy(() => import("@/pages/remove-pages"));
const CropPDF = lazy(() => import("@/pages/crop-pdf"));
const ExtractPages = lazy(() => import("@/pages/extract-pages"));
const ExtractImages = lazy(() => import("@/pages/extract-images"));
const AddPageNumber = lazy(() => import("@/pages/add-page-number"));
const WatermarkPDF = lazy(() => import("@/pages/watermark-pdf"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const TermsConditions = lazy(() => import("@/pages/terms-conditions"));
const FAQ = lazy(() => import("@/pages/faq"));
const Blog = lazy(() => import("@/pages/blog"));
const Documentation = lazy(() => import("@/pages/documentation"));

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationMemory />
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/all-tools" component={AllTools} />
            <Route path="/compress-pdf" component={CompressPDF} />
            <Route path="/unlock-pdf" component={UnlockPDF} />
            <Route path="/jpg-to-pdf" component={JpgToPDF} />
            <Route path="/qr-generator" component={QRGenerator} />
            <Route path="/password-generator" component={PasswordGenerator} />
            <Route path="/extract-text" component={ExtractText} />
            <Route path="/merge-pdf" component={MergePDF} />
            <Route path="/split-pdf" component={SplitPDF} />
            <Route path="/rotate-pdf" component={RotatePDF} />
            <Route path="/organize-pdf" component={OrganizePDF} />
            <Route path="/remove-pages" component={RemovePages} />
            <Route path="/crop-pdf" component={CropPDF} />
            <Route path="/extract-pages" component={ExtractPages} />
            <Route path="/extract-images" component={ExtractImages} />
            <Route path="/add-page-number" component={AddPageNumber} />
            <Route path="/watermark-pdf" component={WatermarkPDF} />
            <Route path="/privacy" component={PrivacyPolicy} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms" component={TermsConditions} />
            <Route path="/terms-conditions" component={TermsConditions} />
            <Route path="/faq" component={FAQ} />
            <Route path="/blog" component={Blog} />
            <Route path="/documentation" component={Documentation} />
            <Route path="/how-it-works" component={HowItWorks} />
            <Route path="/use-cases" component={UseCases} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ReducedMotionProvider>
          <TooltipProvider>
            <Toaster />
            <CookieConsent />
            <ScrollToTopButton />
            <Router />
          </TooltipProvider>
        </ReducedMotionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
