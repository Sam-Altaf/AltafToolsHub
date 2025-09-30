import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSEO, generateHowToSchema, generateSoftwareApplicationSchema } from "@/hooks/use-seo";
import { QrCode, Download, Copy, Palette, Zap, Shield, Check, X, RefreshCw, ArrowLeft, Book } from "lucide-react";
import QRCode from "qrcode";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import ToolSEO, { toolFAQs } from "@/components/seo/tool-seo";
import PrivacyNotice from "@/components/privacy-notice";
import { WhyUseSection, UseCasesSection, ComparisonSection, HowItWorksSection, commonFeatures } from "@/components/seo/tool-features";
import { ToolFAQ, generateQRGeneratorFAQs } from "@/components/seo/tool-faq";
import { Store, Share2, Wifi, Calendar, MapPin, CreditCard, Type, Settings as SettingsIcon } from "lucide-react";
import { ContactSupportSection } from "@/components/contact-support";

type QRSize = "small" | "medium" | "large";

const sizeMap: Record<QRSize, number> = {
  small: 200,
  medium: 300,
  large: 400
};

export default function QRGenerator() {
  // Generate structured data for SEO
  const howToSchema = generateHowToSchema({
    name: "How to Generate QR Codes Online",
    description: "Create custom QR codes for text, URLs, and more with customizable colors and sizes",
    totalTime: "PT30S",
    steps: [
      { name: "Enter Data", text: "Type or paste the text, URL, or data for your QR code" },
      { name: "Customize Design", text: "Choose size and colors for your QR code" },
      { name: "Generate QR Code", text: "QR code generates automatically as you type" },
      { name: "Download", text: "Download your QR code as a PNG image" }
    ]
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: "QR Code Generator - AltafToolsHub",
    description: "Free QR code generator with custom colors and sizes. Create QR codes for URLs, text, WiFi, and more. 100% browser-based.",
    applicationCategory: "BusinessApplication",
    url: "https://www.altaftoolshub.app/qr-generator",
    aggregateRating: { ratingValue: 4.9, ratingCount: 2156, bestRating: 5 },
    featureList: [
      "Generate QR codes for any text or URL",
      "Custom foreground and background colors",
      "Three size options (200px, 300px, 400px)",
      "Real-time QR generation as you type",
      "Download as PNG image",
      "100% client-side processing",
      "No watermarks or limits"
    ],
    datePublished: "2024-01-01",
    dateModified: "2025-01-17"
  });

  useSEO({
    title: "Free QR Code Generator - Create Custom QR Codes Online | AltafToolsHub",
    description: "Free online QR code generator. Create custom QR codes from text, URLs, emails, phone numbers. Customize colors and sizes. 100% client-side for privacy.",
    path: "/qr-generator",
    keywords: "qr code generator, create qr code, free qr generator, online qr code, custom qr code, qr code maker, generate qr code, qr code creator, qr code 2025, ai qr generator",
    ogImage: "https://www.altaftoolshub.app/og-qr-generator.png",
    structuredData: [howToSchema, softwareSchema],
    additionalMetaTags: [
      { name: "application-name", content: "QR Code Generator - AltafToolsHub" },
      { property: "article:section", content: "Utility Tools" },
      { property: "article:tag", content: "QR Code Generation" },
      { property: "article:tag", content: "Marketing Tools" },
      { property: "article:tag", content: "Business Tools" }
    ]
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("");
  const [size, setSize] = useState<QRSize>("medium");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Generate QR code whenever input changes
  useEffect(() => {
    if (!text.trim()) {
      setQrDataUrl(null);
      return;
    }

    const generateQR = async () => {
      setIsGenerating(true);
      try {
        const canvas = canvasRef.current;
        if (!canvas) return;

        await QRCode.toCanvas(canvas, text, {
          width: sizeMap[size],
          color: {
            dark: fgColor,
            light: bgColor
          },
          margin: 2,
          errorCorrectionLevel: 'M'
        });

        const dataUrl = canvas.toDataURL('image/png');
        setQrDataUrl(dataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
        toast({
          title: "Generation Failed",
          description: "Failed to generate QR code. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsGenerating(false);
      }
    };

    const debounceTimer = setTimeout(generateQR, 300);
    return () => clearTimeout(debounceTimer);
  }, [text, size, fgColor, bgColor]);

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = qrDataUrl;
    link.click();

    toast({
      title: "Downloaded!",
      description: "QR code has been downloaded successfully.",
    });
  };

  const handleCopyImage = async () => {
    if (!qrDataUrl) return;

    try {
      const blob = await (await fetch(qrDataUrl)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      
      toast({
        title: "Copied!",
        description: "QR code copied to clipboard.",
      });
    } catch (error) {
      // Fallback: copy data URL as text
      await navigator.clipboard.writeText(qrDataUrl);
      toast({
        title: "Copied!",
        description: "QR code data copied to clipboard.",
      });
    }
  };

  const handleReset = () => {
    setText("");
    setSize("medium");
    setFgColor("#000000");
    setBgColor("#ffffff");
    setQrDataUrl(null);
  };

  return (
    <div className="min-h-screen pattern-bg">
      <ToolSEO 
        toolName="QR Code Generator"
        description="Generate QR codes instantly from text or URLs with customizable colors and sizes"
        category="UtilitiesApplication"
        faqs={toolFAQs["qr-generator"]}
        rating={{ value: 4.9, count: 456 }}
      />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs items={[{ name: "QR Generator", url: "/qr-generator" }]} />
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/all-tools">
            <Button 
              variant="ghost" 
              className="mb-4" 
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tools
            </Button>
          </Link>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-primary">QR Code Generator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate QR codes instantly from any text or URL. Customize colors and sizes, all processed securely in your browser.
          </p>
        </div>

        {/* Privacy Notice */}
        <PrivacyNotice message="QR codes are generated locally. Your data remains completely private." />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 glass">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">100% Private</h3>
                <p className="text-sm text-muted-foreground">Generated in your browser</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 glass">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Instant Generation</h3>
                <p className="text-sm text-muted-foreground">Real-time QR codes</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 glass">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Customizable</h3>
                <p className="text-sm text-muted-foreground">Colors and sizes</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">QR Code Content</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="qr-text">Text or URL</Label>
                <Textarea
                  id="qr-text"
                  placeholder="Enter text, URL, or any data to encode..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mt-2 min-h-[120px]"
                  data-testid="input-qr-text"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {text.length} characters
                </p>
              </div>

              <div>
                <Label htmlFor="qr-size">Size</Label>
                <Select value={size} onValueChange={(v) => setSize(v as QRSize)}>
                  <SelectTrigger id="qr-size" className="mt-2" data-testid="select-qr-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (200x200)</SelectItem>
                    <SelectItem value="medium">Medium (300x300)</SelectItem>
                    <SelectItem value="large">Large (400x400)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fg-color">Foreground Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="fg-color"
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                      data-testid="input-fg-color"
                    />
                    <Input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                      data-testid="input-bg-color"
                    />
                    <Input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
                data-testid="button-reset-qr"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset All
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Generated QR Code</h2>
            
            <div className="flex flex-col items-center">
              {text.trim() ? (
                <>
                  <div className="relative mb-6">
                    <canvas
                      ref={canvasRef}
                      className="border rounded-lg shadow-lg"
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        display: isGenerating ? 'none' : 'block'
                      }}
                    />
                    {isGenerating && (
                      <div className="flex items-center justify-center w-full h-64 border rounded-lg">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Generating QR code...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {qrDataUrl && !isGenerating && (
                    <div className="flex gap-4 w-full">
                      <Button
                        onClick={handleDownload}
                        className="flex-1"
                        data-testid="button-download-qr"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PNG
                      </Button>
                      <Button
                        onClick={handleCopyImage}
                        variant="outline"
                        className="flex-1"
                        data-testid="button-copy-qr"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Image
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <QrCode className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Enter text or URL to generate QR code
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-primary/10">
          <h3 className="text-lg font-semibold mb-3">Pro Tips</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span className="text-sm">QR codes can store URLs, text, WiFi credentials, contact info, and more</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span className="text-sm">Higher error correction allows QR codes to work even when partially damaged</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span className="text-sm">Use high contrast colors for better scanning reliability</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span className="text-sm">Test your QR code with different devices before sharing</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* SEO Content Sections */}
      <HowItWorksSection
        toolName="QR Code Generator"
        steps={[
          {
            number: 1,
            title: "Enter Your Data",
            description: "Type or paste any text, URL, email, or phone number into the input field.",
            icon: Type
          },
          {
            number: 2,
            title: "Customize Appearance",
            description: "Choose size and colors to match your brand or preference.",
            icon: Palette
          },
          {
            number: 3,
            title: "Download QR Code",
            description: "Save your QR code as a high-quality PNG image for any use.",
            icon: Download
          }
        ]}
      />

      {/* Blog Link */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <Book className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Want to learn more? </span>
                <Link href="/guides/how-to-generate-qr-codes" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline transition-colors">
                  Read our complete guide: How to Generate QR Codes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WhyUseSection
        toolName="QR Code Generator"
        benefits={[
          "Generate unlimited QR codes without any restrictions or watermarks",
          "Real-time generation - see your QR code update as you type",
          "Custom colors to match your brand or design requirements",
          "Three size options for different use cases and resolutions",
          "Works with any QR scanner app on smartphones and tablets",
          "100% browser-based - no data sent to servers",
          "No registration, email, or personal information required",
          "QR codes never expire and work forever"
        ]}
        features={[
          commonFeatures.privacy,
          commonFeatures.instant,
          commonFeatures.free,
          {
            icon: Palette,
            title: "Custom Colors",
            description: "Match your brand with custom foreground and background colors."
          }
        ]}
      />

      <UseCasesSection
        useCases={[
          {
            title: "Business Cards",
            description: "Add QR codes to business cards for instant contact sharing.",
            icon: CreditCard,
            example: "Link to your digital vCard or LinkedIn profile"
          },
          {
            title: "Restaurant Menus",
            description: "Create contactless digital menus for restaurants and cafes.",
            icon: Store,
            example: "QR code linking to online menu or ordering system"
          },
          {
            title: "WiFi Sharing",
            description: "Share WiFi credentials without revealing the password.",
            icon: Wifi,
            example: "Generate WiFi QR for guests and customers"
          },
          {
            title: "Event Management",
            description: "Use QR codes for event tickets, check-ins, and information.",
            icon: Calendar,
            example: "Event registration and attendance tracking"
          },
          {
            title: "Marketing Campaigns",
            description: "Track campaign performance with unique QR codes.",
            icon: Share2,
            example: "Print ads, flyers, and promotional materials"
          },
          {
            title: "Location Sharing",
            description: "Share locations for meetups, stores, or events.",
            icon: MapPin,
            example: "Google Maps links for easy navigation"
          }
        ]}
      />

      <ComparisonSection
        toolName="QR Generator"
        comparisons={[
          { feature: "Data Privacy", ourTool: "100% client-side", others: "Server processing", highlight: true },
          { feature: "Generation Speed", ourTool: "Real-time", others: "Submit and wait" },
          { feature: "Custom Colors", ourTool: "Full RGB control", others: "Limited presets" },
          { feature: "Size Options", ourTool: "3 sizes", others: "Fixed size" },
          { feature: "Usage Limits", ourTool: "Unlimited", others: "10-50 per day" },
          { feature: "Registration", ourTool: false, others: "Email required" },
          { feature: "Watermarks", ourTool: false, others: "On free tier" },
          { feature: "QR Code Expiry", ourTool: "Never expires", others: "May expire" },
          { feature: "Download Format", ourTool: "PNG", others: "PNG, paid for SVG" },
          { feature: "Cost", ourTool: "Free forever", others: "$5-20/month" }
        ]}
      />

      <ToolFAQ 
        faqs={generateQRGeneratorFAQs()}
        toolName="QR Code Generator"
        toolPath="/qr-generator"
      />
    </div>

  );
}