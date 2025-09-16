import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
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
import WordCounter from "@/pages/word-counter";
import TextEnhancer from "@/pages/text-enhancer";
import ExtractText from "@/pages/extract-text";
import FileCalculator from "@/pages/file-calculator";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsConditions from "@/pages/terms-conditions";
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
          <Route path="/word-counter" component={WordCounter} />
          <Route path="/text-enhancer" component={TextEnhancer} />
          <Route path="/extract-text" component={ExtractText} />
          <Route path="/file-calculator" component={FileCalculator} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/terms" component={TermsConditions} />
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
        <TooltipProvider>
          <Toaster />
          <CookieConsent />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
