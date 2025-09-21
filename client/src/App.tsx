import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { ReducedMotionProvider } from "@/components/reduced-motion-provider";
import ScrollToTop from "@/components/scroll-to-top";
import NotFound from "@/pages/not-found";
import NavigationMemory from "@/components/navigation-memory";
import Home from "@/pages/home";
import AllTools from "@/pages/all-tools";
import CompressPDF from "@/pages/compress-pdf";
import UnlockPDF from "@/pages/unlock-pdf";
import JpgToPDF from "@/pages/jpg-to-pdf";
import QRGenerator from "@/pages/qr-generator";
import PasswordGenerator from "@/pages/password-generator";
import ExtractText from "@/pages/extract-text";
import HowItWorks from "@/pages/how-it-works";
import UseCases from "@/pages/use-cases";
import MergePDF from "@/pages/merge-pdf";
import SplitPDF from "@/pages/split-pdf";
import RotatePDF from "@/pages/rotate-pdf";
import OrganizePDF from "@/pages/organize-pdf";
import RemovePages from "@/pages/remove-pages";
import CropPDF from "@/pages/crop-pdf";
import ExtractPages from "@/pages/extract-pages";
import ExtractImages from "@/pages/extract-images";
import AddPageNumber from "@/pages/add-page-number";
import WatermarkPDF from "@/pages/watermark-pdf";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsConditions from "@/pages/terms-conditions";
import FAQ from "@/pages/faq";
import Blog from "@/pages/blog";
import Documentation from "@/pages/documentation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CookieConsent from "@/components/cookie-consent";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationMemory />
      <ScrollToTop />
      <Header />
      <div className="flex-1">
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
            <Router />
          </TooltipProvider>
        </ReducedMotionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
