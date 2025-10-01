import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { ReducedMotionProvider } from "@/components/reduced-motion-provider";
import { useAnalytics } from "@/hooks/use-analytics";
import ScrollToTop from "@/components/scroll-to-top";
import ScrollToTopButton from "@/components/scroll-to-top-button";
import NavigationMemory from "@/components/navigation-memory";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CookieConsent from "@/components/cookie-consent";
import BlogRouter from "@/components/blog-router";
import { Loader2 } from "lucide-react";
import RedirectLanding from "@/components/redirect-landing";
import { seoAliases } from "@/lib/seo-aliases";

// Critical imports - Load immediately for core functionality
import Home from "@/pages/home";
import AllTools from "@/pages/all-tools";

// Lazy loaded tool components - Load on demand for better performance
const CompressPDF = lazy(() => import("@/pages/compress-pdf"));
const ReducePDF = lazy(() => import("@/pages/reduce-pdf"));
const UnlockPDF = lazy(() => import("@/pages/unlock-pdf"));
const ProtectPDF = lazy(() => import("@/pages/protect-pdf"));
const JpgToPDF = lazy(() => import("@/pages/jpg-to-pdf"));
const QRGenerator = lazy(() => import("@/pages/qr-generator"));
const PasswordGenerator = lazy(() => import("@/pages/password-generator"));
const ExtractText = lazy(() => import("@/pages/extract-text"));
const PDFToZIP = lazy(() => import("@/pages/pdf-to-zip"));
const ZIPToPDF = lazy(() => import("@/pages/zip-to-pdf"));
const MergePDF = lazy(() => import("@/pages/merge-pdf"));
const CombinePDF = lazy(() => import("@/pages/combine-pdf"));
const SplitPDF = lazy(() => import("@/pages/split-pdf"));
const RotatePDF = lazy(() => import("@/pages/rotate-pdf"));
const OrganizePDF = lazy(() => import("@/pages/organize-pdf"));
const RemovePages = lazy(() => import("@/pages/remove-pages"));
const CropPDF = lazy(() => import("@/pages/crop-pdf"));
const ExtractPages = lazy(() => import("@/pages/extract-pages"));
const ExtractImages = lazy(() => import("@/pages/extract-images"));
const AddPageNumber = lazy(() => import("@/pages/add-page-number"));
const WatermarkPDF = lazy(() => import("@/pages/watermark-pdf"));
const PDFToJPG = lazy(() => import("@/pages/pdf-to-jpg"));
const PDFToPNG = lazy(() => import("@/pages/pdf-to-png"));
const PDFToImages = lazy(() => import("@/pages/pdf-to-images"));

// Lazy loaded components - Non-critical pages
const NotFound = lazy(() => import("@/pages/not-found"));
const HowItWorks = lazy(() => import("@/pages/how-it-works"));
const UseCases = lazy(() => import("@/pages/use-cases"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const TermsConditions = lazy(() => import("@/pages/terms-conditions"));
const FAQ = lazy(() => import("@/pages/faq"));

const Documentation = lazy(() => import("@/pages/documentation"));
const About = lazy(() => import("@/pages/about"));
const WhyChooseUs = lazy(() => import("@/pages/why-choose-us"));

// Lazy loaded guides and resources
const Guides = lazy(() => import("@/pages/guides"));
const HowToCompressPDF = lazy(() => import("@/pages/guides/how-to-compress-pdf"));
const HowToUnlockPDF = lazy(() => import("@/pages/guides/how-to-unlock-pdf"));
const HowToConvertJpgToPDF = lazy(() => import("@/pages/guides/how-to-convert-jpg-to-pdf"));
const HowToGenerateQRCode = lazy(() => import("@/pages/guides/how-to-generate-qr-code"));
const HowToExtractText = lazy(() => import("@/pages/guides/how-to-extract-text-from-pdf"));
const HowToGeneratePassword = lazy(() => import("@/pages/guides/how-to-generate-password"));
const PDFCompressorComparison = lazy(() => import("@/pages/compare/pdf-compressor-comparison"));
const OnlinePDFTools2025 = lazy(() => import("@/pages/compare/online-pdf-tools-2025"));
const Resources = lazy(() => import("@/pages/resources"));
const Testimonials = lazy(() => import("@/pages/testimonials"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

function Router() {
  // Initialize analytics tracking for all pages
  useAnalytics();
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationMemory />
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Switch>
          {/* Blog routes - workaround for wouter v3 parameterized route issue */}
          <Route path="/blog/:slug">
            <BlogRouter />
          </Route>
          <Route path="/blog">
            <BlogRouter />
          </Route>
          {/* Critical routes - Load immediately */}
          <Route path="/" component={Home} />
          <Route path="/all-tools" component={AllTools} />
          
          {/* Tool routes - Lazy loaded with Suspense for performance */}
          <Route path="/compress-pdf">
            <Suspense fallback={<PageLoader />}>
              <CompressPDF />
            </Suspense>
          </Route>
          
          {/* SEO-friendly compression target routes - All use CompressPDF */}
          <Route path="/compress-pdf-to-10kb">
            <Suspense fallback={<PageLoader />}>
              <CompressPDF />
            </Suspense>
          </Route>
          <Route path="/compress-pdf-to-20kb">
            <Suspense fallback={<PageLoader />}>
              <CompressPDF />
            </Suspense>
          </Route>
          <Route path="/compress-pdf-to-50kb">
            <Suspense fallback={<PageLoader />}>
              <CompressPDF />
            </Suspense>
          </Route>
          <Route path="/compress-pdf-to-100kb">
            <Suspense fallback={<PageLoader />}>
              <CompressPDF />
            </Suspense>
          </Route>
          <Route path="/compress-pdf-to-150kb">
            <Suspense fallback={<PageLoader />}>
              <CompressPDF />
            </Suspense>
          </Route>
          <Route path="/compress-pdf-to-200kb">
            <Suspense fallback={<PageLoader />}>
              <CompressPDF />
            </Suspense>
          </Route>
          <Route path="/compress-pdf-to-300kb">
            <Suspense fallback={<PageLoader />}>
              <CompressPDF />
            </Suspense>
          </Route>
          <Route path="/compress-pdf-to-500kb">
            <Suspense fallback={<PageLoader />}>
              <CompressPDF />
            </Suspense>
          </Route>
          <Route path="/compress-pdf-to-1mb">
            <Suspense fallback={<PageLoader />}>
              <CompressPDF />
            </Suspense>
          </Route>
          <Route path="/compress-pdf-to-2mb">
            <Suspense fallback={<PageLoader />}>
              <CompressPDF />
            </Suspense>
          </Route>
          <Route path="/compress-pdf-to-5mb">
            <Suspense fallback={<PageLoader />}>
              <CompressPDF />
            </Suspense>
          </Route>

          {/* SEO-friendly alias routes - Keyword-optimized URLs that redirect to main tools */}
          {seoAliases.map((alias) => (
            <Route key={alias.path} path={alias.path}>
              <RedirectLanding
                targetPath={alias.targetPath}
                heading={alias.heading}
                subheading={alias.subheading}
                seo={alias.seo}
              />
            </Route>
          ))}
          
          <Route path="/reduce-pdf">
            <Suspense fallback={<PageLoader />}>
              <ReducePDF />
            </Suspense>
          </Route>
          <Route path="/unlock-pdf">
            <Suspense fallback={<PageLoader />}>
              <UnlockPDF />
            </Suspense>
          </Route>
          <Route path="/protect-pdf">
            <Suspense fallback={<PageLoader />}>
              <ProtectPDF />
            </Suspense>
          </Route>
          <Route path="/jpg-to-pdf">
            <Suspense fallback={<PageLoader />}>
              <JpgToPDF />
            </Suspense>
          </Route>
          <Route path="/qr-generator">
            <Suspense fallback={<PageLoader />}>
              <QRGenerator />
            </Suspense>
          </Route>
          <Route path="/password-generator">
            <Suspense fallback={<PageLoader />}>
              <PasswordGenerator />
            </Suspense>
          </Route>
          <Route path="/extract-text">
            <Suspense fallback={<PageLoader />}>
              <ExtractText />
            </Suspense>
          </Route>
          <Route path="/pdf-to-zip">
            <Suspense fallback={<PageLoader />}>
              <PDFToZIP />
            </Suspense>
          </Route>
          <Route path="/zip-to-pdf">
            <Suspense fallback={<PageLoader />}>
              <ZIPToPDF />
            </Suspense>
          </Route>
          <Route path="/merge-pdf">
            <Suspense fallback={<PageLoader />}>
              <MergePDF />
            </Suspense>
          </Route>
          <Route path="/combine-pdf">
            <Suspense fallback={<PageLoader />}>
              <CombinePDF />
            </Suspense>
          </Route>
          <Route path="/split-pdf">
            <Suspense fallback={<PageLoader />}>
              <SplitPDF />
            </Suspense>
          </Route>
          <Route path="/rotate-pdf">
            <Suspense fallback={<PageLoader />}>
              <RotatePDF />
            </Suspense>
          </Route>
          <Route path="/organize-pdf">
            <Suspense fallback={<PageLoader />}>
              <OrganizePDF />
            </Suspense>
          </Route>
          <Route path="/remove-pages">
            <Suspense fallback={<PageLoader />}>
              <RemovePages />
            </Suspense>
          </Route>
          <Route path="/crop-pdf">
            <Suspense fallback={<PageLoader />}>
              <CropPDF />
            </Suspense>
          </Route>
          <Route path="/extract-pages">
            <Suspense fallback={<PageLoader />}>
              <ExtractPages />
            </Suspense>
          </Route>
          <Route path="/extract-images">
            <Suspense fallback={<PageLoader />}>
              <ExtractImages />
            </Suspense>
          </Route>
          <Route path="/add-page-number">
            <Suspense fallback={<PageLoader />}>
              <AddPageNumber />
            </Suspense>
          </Route>
          <Route path="/watermark-pdf">
            <Suspense fallback={<PageLoader />}>
              <WatermarkPDF />
            </Suspense>
          </Route>
          <Route path="/pdf-to-jpg">
            <Suspense fallback={<PageLoader />}>
              <PDFToJPG />
            </Suspense>
          </Route>
          <Route path="/pdf-to-png">
            <Suspense fallback={<PageLoader />}>
              <PDFToPNG />
            </Suspense>
          </Route>
          <Route path="/pdf-to-images">
            <Suspense fallback={<PageLoader />}>
              <PDFToImages />
            </Suspense>
          </Route>
          
          {/* Lazy loaded routes with Suspense */}
          <Route path="/privacy">
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicy />
            </Suspense>
          </Route>
          <Route path="/privacy-policy">
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicy />
            </Suspense>
          </Route>
          <Route path="/terms">
            <Suspense fallback={<PageLoader />}>
              <TermsConditions />
            </Suspense>
          </Route>
          <Route path="/terms-conditions">
            <Suspense fallback={<PageLoader />}>
              <TermsConditions />
            </Suspense>
          </Route>
          <Route path="/faq">
            <Suspense fallback={<PageLoader />}>
              <FAQ />
            </Suspense>
          </Route>
          <Route path="/documentation">
            <Suspense fallback={<PageLoader />}>
              <Documentation />
            </Suspense>
          </Route>
          <Route path="/about">
            <Suspense fallback={<PageLoader />}>
              <About />
            </Suspense>
          </Route>
          <Route path="/why-choose-us">
            <Suspense fallback={<PageLoader />}>
              <WhyChooseUs />
            </Suspense>
          </Route>
          <Route path="/how-it-works">
            <Suspense fallback={<PageLoader />}>
              <HowItWorks />
            </Suspense>
          </Route>
          <Route path="/use-cases">
            <Suspense fallback={<PageLoader />}>
              <UseCases />
            </Suspense>
          </Route>
          
          {/* Lazy loaded Guides */}
          <Route path="/guides">
            <Suspense fallback={<PageLoader />}>
              <Guides />
            </Suspense>
          </Route>
          <Route path="/guides/how-to-compress-pdf">
            <Suspense fallback={<PageLoader />}>
              <HowToCompressPDF />
            </Suspense>
          </Route>
          <Route path="/guides/how-to-unlock-pdf">
            <Suspense fallback={<PageLoader />}>
              <HowToUnlockPDF />
            </Suspense>
          </Route>
          {/* Redirects to blog post */}
          <Route path="/guides/how-to-password-protect-pdf">
            {() => {
              window.location.href = "/blog/how-to-password-protect-pdf";
              return null;
            }}
          </Route>
          <Route path="/guides/how-to-convert-jpg-to-pdf">
            <Suspense fallback={<PageLoader />}>
              <HowToConvertJpgToPDF />
            </Suspense>
          </Route>
          <Route path="/guides/how-to-generate-qr-code">
            <Suspense fallback={<PageLoader />}>
              <HowToGenerateQRCode />
            </Suspense>
          </Route>
          <Route path="/guides/how-to-extract-text-from-pdf">
            <Suspense fallback={<PageLoader />}>
              <HowToExtractText />
            </Suspense>
          </Route>
          <Route path="/guides/how-to-generate-password">
            <Suspense fallback={<PageLoader />}>
              <HowToGeneratePassword />
            </Suspense>
          </Route>
          
          {/* Lazy loaded Comparisons */}
          <Route path="/compare/pdf-compressor-comparison">
            <Suspense fallback={<PageLoader />}>
              <PDFCompressorComparison />
            </Suspense>
          </Route>
          <Route path="/compare/online-pdf-tools-2025">
            <Suspense fallback={<PageLoader />}>
              <OnlinePDFTools2025 />
            </Suspense>
          </Route>
          
          {/* Lazy loaded Resources */}
          <Route path="/resources">
            <Suspense fallback={<PageLoader />}>
              <Resources />
            </Suspense>
          </Route>
          
          {/* Lazy loaded Testimonials */}
          <Route path="/testimonials">
            <Suspense fallback={<PageLoader />}>
              <Testimonials />
            </Suspense>
          </Route>
          
          {/* 404 Route */}
          <Route>
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          </Route>
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
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
    </HelmetProvider>
  );
}

export default App;
