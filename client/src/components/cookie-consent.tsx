import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Cookie, Shield, Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    functional: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Small delay to ensure smooth page load
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      functional: true,
    };
    localStorage.setItem("cookieConsent", JSON.stringify(allPreferences));
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    setShowBanner(false);
    
    // Trigger GA loading if analytics is accepted
    if (allPreferences.analytics) {
      window.dispatchEvent(new Event('ga-consent-granted'));
    }
  };

  const handleRejectAll = () => {
    // Save rejection state to prevent banner from showing again
    const rejectionPreferences = {
      necessary: true,
      analytics: false,
      functional: false,
    };
    localStorage.setItem("cookieConsent", JSON.stringify(rejectionPreferences));
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    setShowPreferences(false);
    setShowBanner(false);
    
    // Trigger GA loading if analytics is accepted
    if (preferences.analytics) {
      window.dispatchEvent(new Event('ga-consent-granted'));
    }
  };

  const handleManagePreferences = () => {
    setShowPreferences(true);
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
            data-testid="cookie-consent-banner"
          >
            <Card className="glass max-w-7xl mx-auto p-6 sm:p-8 shadow-2xl border-2">
              <button
                onClick={() => setShowBanner(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close cookie banner"
                data-testid="button-close-banner"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Cookie className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">We value your privacy</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We use cookies to enhance your browsing experience and analyze our traffic. 
                    All file processing happens entirely in your browser - <span className="font-medium">your files never leave your device</span>. 
                    By clicking "Accept All", you consent to our use of cookies. 
                    You can manage your preferences or learn more in our{" "}
                    <Link href="/privacy-policy" className="text-primary hover:underline font-medium">
                      privacy policy
                    </Link>
                    {" "}and{" "}
                    <Link href="/terms-conditions" className="text-primary hover:underline font-medium">
                      terms & conditions
                    </Link>.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <Button
                    onClick={handleManagePreferences}
                    variant="outline"
                    className="w-full sm:w-auto"
                    data-testid="button-manage-cookies"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                  <Button
                    onClick={handleRejectAll}
                    variant="outline"
                    className="w-full sm:w-auto"
                    data-testid="button-reject-cookies"
                  >
                    Reject All
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    className="btn-gradient text-white w-full sm:w-auto"
                    data-testid="button-accept-cookies"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. You can enable or disable different types of cookies below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Necessary Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="necessary" className="text-base font-medium">
                    Necessary Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    These cookies are essential for the website to function properly. They cannot be disabled.
                  </p>
                </div>
                <Switch
                  id="necessary"
                  checked={preferences.necessary}
                  disabled
                  data-testid="switch-necessary"
                />
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="analytics" className="text-base font-medium">
                    Analytics Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    These cookies help us understand how visitors interact with our website by collecting anonymous information.
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, analytics: checked }))
                  }
                  data-testid="switch-analytics"
                />
              </div>
            </div>

            {/* Functional Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="functional" className="text-base font-medium">
                    Functional Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    These cookies enable enhanced functionality and personalization, such as remembering your preferences.
                  </p>
                </div>
                <Switch
                  id="functional"
                  checked={preferences.functional}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, functional: checked }))
                  }
                  data-testid="switch-functional"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => setShowPreferences(false)}
              variant="outline"
              className="w-full sm:w-auto"
              data-testid="button-cancel-preferences"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePreferences}
              className="btn-gradient text-white w-full sm:w-auto"
              data-testid="button-save-preferences"
            >
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}