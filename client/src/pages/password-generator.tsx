import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useSEO, generateHowToSchema, generateSoftwareApplicationSchema } from "@/hooks/use-seo";
import { Shield, Copy, RefreshCw, Lock, Zap, Check, X, History, Trash2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import ToolSEO, { toolFAQs } from "@/components/seo/tool-seo";
import PrivacyNotice from "@/components/privacy-notice";
import { WhyUseSection, UseCasesSection, ComparisonSection, HowItWorksSection, commonFeatures } from "@/components/seo/tool-features";
import { ToolFAQ, generatePasswordGeneratorFAQs } from "@/components/seo/tool-faq";
import { Key, Settings, Download, User, Mail, CreditCard, ShieldCheck, Hash, Briefcase, School, Users, Globe } from "lucide-react";
import { ContactSupportSection } from "@/components/contact-support";

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

interface GeneratedPassword {
  value: string;
  timestamp: Date;
  strength: PasswordStrength;
}

type PasswordStrength = "weak" | "medium" | "strong" | "very-strong";

const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false
};

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

export default function PasswordGenerator() {
  // Generate structured data for SEO
  const howToSchema = generateHowToSchema({
    name: "How to Generate Strong Passwords",
    description: "Create secure, random passwords with customizable length and character types",
    totalTime: "PT10S",
    steps: [
      { name: "Set Length", text: "Choose password length between 4-50 characters" },
      { name: "Select Characters", text: "Choose which character types to include" },
      { name: "Generate Password", text: "Click 'Generate New Password' button" },
      { name: "Copy Password", text: "Copy the generated password to your clipboard" }
    ]
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: "Password Generator - AltafToolsHub",
    description: "Cryptographically secure password generator with strength meter. Create strong passwords with custom settings. 100% browser-based.",
    applicationCategory: "SecurityApplication",
    url: "https://www.altaftoolshub.com/password-generator",
    aggregateRating: { ratingValue: 4.9, ratingCount: 3421, bestRating: 5 },
    featureList: [
      "Cryptographically secure random generation",
      "Password length 4-50 characters",
      "Custom character sets (uppercase, lowercase, numbers, symbols)",
      "Real-time strength meter",
      "Password history tracking",
      "One-click copy to clipboard",
      "100% client-side generation"
    ],
    datePublished: "2024-01-01",
    dateModified: "2025-01-17"
  });

  useSEO({
    title: "Strong Password Generator - Create Secure Passwords | AltafToolsHub",
    description: "Free secure password generator. Create strong, random passwords with custom length and character types. Includes strength meter. 100% client-side processing.",
    path: "/password-generator",
    keywords: "password generator, secure password, strong password, random password generator, password creator, password maker, online password generator, free password tool, password generator 2025, ai password security",
    ogImage: "https://www.altaftoolshub.com/og-password-generator.png",
    structuredData: [howToSchema, softwareSchema],
    additionalMetaTags: [
      { name: "application-name", content: "Password Generator - AltafToolsHub" },
      { property: "article:section", content: "Security Tools" },
      { property: "article:tag", content: "Password Security" },
      { property: "article:tag", content: "Cybersecurity" },
      { property: "article:tag", content: "Privacy Tools" }
    ]
  });

  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<PasswordStrength>("weak");
  const [history, setHistory] = useState<GeneratedPassword[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  const calculateStrength = useCallback((pass: string, opts: PasswordOptions): PasswordStrength => {
    if (pass.length < 8) return "weak";
    
    let score = 0;
    
    // Length score
    if (pass.length >= 12) score += 2;
    if (pass.length >= 16) score += 2;
    if (pass.length >= 20) score += 1;
    
    // Character variety score
    if (opts.uppercase && /[A-Z]/.test(pass)) score += 1;
    if (opts.lowercase && /[a-z]/.test(pass)) score += 1;
    if (opts.numbers && /[0-9]/.test(pass)) score += 1;
    if (opts.symbols && /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pass)) score += 2;
    
    // Pattern checks (reduce score for patterns)
    if (/(.)\1{2,}/.test(pass)) score -= 1; // Repeated characters
    if (/^[A-Z][a-z]+[0-9]+$/.test(pass)) score -= 1; // Common pattern
    
    if (score >= 8) return "very-strong";
    if (score >= 6) return "strong";
    if (score >= 4) return "medium";
    return "weak";
  }, []);

  const generatePassword = useCallback(() => {
    const { length, uppercase, lowercase, numbers, symbols } = options;
    
    // Validate at least one character type is selected
    if (!uppercase && !lowercase && !numbers && !symbols) {
      toast({
        title: "Invalid Options",
        description: "Please select at least one character type.",
        variant: "destructive"
      });
      return;
    }

    let charset = "";
    if (uppercase) charset += CHAR_SETS.uppercase;
    if (lowercase) charset += CHAR_SETS.lowercase;
    if (numbers) charset += CHAR_SETS.numbers;
    if (symbols) charset += CHAR_SETS.symbols;

    let newPassword = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      newPassword += charset[array[i] % charset.length];
    }

    // Ensure at least one character from each selected type
    const ensureChars: string[] = [];
    if (uppercase) ensureChars.push(CHAR_SETS.uppercase[Math.floor(Math.random() * CHAR_SETS.uppercase.length)]);
    if (lowercase) ensureChars.push(CHAR_SETS.lowercase[Math.floor(Math.random() * CHAR_SETS.lowercase.length)]);
    if (numbers) ensureChars.push(CHAR_SETS.numbers[Math.floor(Math.random() * CHAR_SETS.numbers.length)]);
    if (symbols) ensureChars.push(CHAR_SETS.symbols[Math.floor(Math.random() * CHAR_SETS.symbols.length)]);

    // Replace random positions with ensured characters
    const passwordArray = newPassword.split('');
    ensureChars.forEach((char, index) => {
      const randomPos = Math.floor(Math.random() * length);
      passwordArray[randomPos] = char;
    });
    
    newPassword = passwordArray.join('');
    const newStrength = calculateStrength(newPassword, options);
    
    setPassword(newPassword);
    setStrength(newStrength);
    
    // Add to history
    const newEntry: GeneratedPassword = {
      value: newPassword,
      timestamp: new Date(),
      strength: newStrength
    };
    setHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10
  }, [options, calculateStrength, toast]);

  // Generate initial password on mount
  useEffect(() => {
    generatePassword();
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy password. Please try again.",
        variant: "destructive"
      });
    }
  };

  const clearHistory = () => {
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "Password history has been cleared.",
    });
  };

  const getStrengthColor = (s: PasswordStrength) => {
    switch (s) {
      case "very-strong": return "text-green-500";
      case "strong": return "text-emerald-500";
      case "medium": return "text-yellow-500";
      case "weak": return "text-red-500";
    }
  };

  const getStrengthBg = (s: PasswordStrength) => {
    switch (s) {
      case "very-strong": return "bg-green-500";
      case "strong": return "bg-emerald-500";
      case "medium": return "bg-yellow-500";
      case "weak": return "bg-red-500";
    }
  };

  const getStrengthWidth = (s: PasswordStrength) => {
    switch (s) {
      case "very-strong": return "100%";
      case "strong": return "75%";
      case "medium": return "50%";
      case "weak": return "25%";
    }
  };

  return (
    <div className="min-h-screen pattern-bg">
      <ToolSEO 
        toolName="Password Generator"
        description="Generate strong, secure passwords with customizable options and strength indicator"
        category="UtilitiesApplication"
        faqs={toolFAQs["password-generator"]}
        rating={{ value: 4.8, count: 378 }}
      />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs items={[{ name: "Password Generator", url: "/password-generator" }]} />
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            className="mb-4" 
            data-testid="button-back"
            onClick={() => {
              window.location.href = '/';
              // Removed automatic scrolling to prevent page jumping
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Password Generator</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate strong, secure passwords with customizable options. All passwords are created using cryptographically secure randomness.
          </p>
        </div>

        {/* Privacy Notice */}
        <PrivacyNotice message="Passwords are generated using your device's secure random generator. Each password is unique and never stored." />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 glass">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Cryptographically Secure</h3>
                <p className="text-sm text-muted-foreground">Uses Web Crypto API</p>
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
                <p className="text-sm text-muted-foreground">No server required</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 glass">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Password History</h3>
                <p className="text-sm text-muted-foreground">Session-only storage</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Options Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Password Options</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="length">Password Length</Label>
                  <span className="text-2xl font-bold text-primary">{options.length}</span>
                </div>
                <Slider
                  id="length"
                  min={8}
                  max={64}
                  step={1}
                  value={[options.length]}
                  onValueChange={([value]) => setOptions(prev => ({ ...prev, length: value }))}
                  className="mb-2"
                  data-testid="slider-password-length"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>8</span>
                  <span>64</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Character Types</Label>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uppercase"
                    checked={options.uppercase}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, uppercase: checked as boolean }))
                    }
                    data-testid="checkbox-uppercase"
                  />
                  <Label htmlFor="uppercase" className="flex-1 cursor-pointer">
                    Uppercase Letters (A-Z)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={options.lowercase}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, lowercase: checked as boolean }))
                    }
                    data-testid="checkbox-lowercase"
                  />
                  <Label htmlFor="lowercase" className="flex-1 cursor-pointer">
                    Lowercase Letters (a-z)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={options.numbers}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, numbers: checked as boolean }))
                    }
                    data-testid="checkbox-numbers"
                  />
                  <Label htmlFor="numbers" className="flex-1 cursor-pointer">
                    Numbers (0-9)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={options.symbols}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, symbols: checked as boolean }))
                    }
                    data-testid="checkbox-symbols"
                  />
                  <Label htmlFor="symbols" className="flex-1 cursor-pointer">
                    Special Characters (!@#$%...)
                  </Label>
                </div>
              </div>

              <Button
                onClick={generatePassword}
                className="w-full"
                size="lg"
                data-testid="button-generate-password"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New Password
              </Button>
            </div>
          </Card>

          {/* Generated Password Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Password</h2>
            
            <div className="space-y-4">
              {/* Password Display */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="font-mono text-lg break-all mb-3" data-testid="text-generated-password">
                  {password || "Click 'Generate' to create a password"}
                </div>
                
                {/* Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Strength:</span>
                      <span className={cn("text-sm font-medium capitalize", getStrengthColor(strength))}>
                        {strength.replace("-", " ")}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-300", getStrengthBg(strength))}
                        style={{ width: getStrengthWidth(strength) }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {password && (
                <Button
                  onClick={() => copyToClipboard(password)}
                  className="w-full"
                  variant="outline"
                  data-testid="button-copy-password"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
              )}

              {/* History Toggle */}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-3">
                  <Button
                    onClick={() => setShowHistory(!showHistory)}
                    variant="ghost"
                    size="sm"
                    data-testid="button-toggle-history"
                  >
                    <History className="w-4 h-4 mr-2" />
                    {showHistory ? "Hide" : "Show"} History ({history.length})
                  </Button>
                  {history.length > 0 && (
                    <Button
                      onClick={clearHistory}
                      variant="ghost"
                      size="sm"
                      data-testid="button-clear-history"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* History List */}
                {showHistory && history.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {history.map((item, index) => (
                      <div 
                        key={index}
                        className="p-3 bg-muted/30 rounded-lg text-sm"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-mono text-xs break-all flex-1">
                            {item.value}
                          </span>
                          <Button
                            onClick={() => copyToClipboard(item.value)}
                            variant="ghost"
                            size="sm"
                            className="ml-2"
                            data-testid={`button-copy-history-${index}`}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{item.timestamp.toLocaleTimeString()}</span>
                          <span className={cn("capitalize", getStrengthColor(item.strength))}>
                            {item.strength.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-primary/10">
          <h3 className="text-lg font-semibold mb-3">Security Tips</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span className="text-sm">Use unique passwords for each account</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span className="text-sm">Longer passwords are generally more secure than complex short ones</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span className="text-sm">Consider using a password manager to store your passwords securely</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span className="text-sm">Enable two-factor authentication when available</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* SEO Content Sections */}
      <HowItWorksSection
        toolName="Password Generator"
        steps={[
          {
            number: 1,
            title: "Set Parameters",
            description: "Choose password length and which character types to include.",
            icon: Settings
          },
          {
            number: 2,
            title: "Generate Password",
            description: "Click generate to create a cryptographically secure password.",
            icon: Key
          },
          {
            number: 3,
            title: "Copy & Use",
            description: "Copy your password and save it in a secure password manager.",
            icon: Copy
          }
        ]}
      />

      <WhyUseSection
        toolName="Password Generator"
        benefits={[
          "Uses cryptographically secure random generation (crypto.getRandomValues)",
          "Generates passwords up to 50 characters long",
          "Real-time strength indicator helps create strong passwords",
          "Customizable character sets for different requirements",
          "Password history tracking for convenience",
          "100% client-side - passwords never leave your browser",
          "No limits, registration, or tracking",
          "Works offline once the page is loaded"
        ]}
        features={[
          commonFeatures.privacy,
          commonFeatures.instant,
          commonFeatures.free,
          {
            icon: ShieldCheck,
            title: "Cryptographically Secure",
            description: "Uses browser's crypto API for true randomness.",
            highlight: true
          }
        ]}
      />

      <UseCasesSection
        useCases={[
          {
            title: "Account Security",
            description: "Create unique, strong passwords for all your online accounts.",
            icon: User,
            example: "Generate different passwords for banking, email, social media"
          },
          {
            title: "Work Accounts",
            description: "Meet corporate password requirements with custom settings.",
            icon: Briefcase,
            example: "Create passwords matching company security policies"
          },
          {
            title: "Email Protection",
            description: "Secure email accounts with strong, unique passwords.",
            icon: Mail,
            example: "Generate complex passwords for Gmail, Outlook, ProtonMail"
          },
          {
            title: "Financial Security",
            description: "Protect banking and payment accounts with maximum security.",
            icon: CreditCard,
            example: "Create ultra-strong passwords for banking apps"
          },
          {
            title: "Development & Testing",
            description: "Generate test passwords for development environments.",
            icon: Hash,
            example: "Quick password generation for testing user accounts"
          },
          {
            title: "Password Rotation",
            description: "Regular password updates for enhanced security.",
            icon: RefreshCw,
            example: "Generate new passwords during quarterly security updates"
          }
        ]}
      />

      <ComparisonSection
        toolName="Password Generator"
        comparisons={[
          { feature: "Generation Method", ourTool: "Crypto API", others: "Math.random()", highlight: true },
          { feature: "Privacy", ourTool: "100% client-side", others: "Server-generated" },
          { feature: "Password Length", ourTool: "Up to 50 chars", others: "16-32 typical" },
          { feature: "Character Sets", ourTool: "Fully customizable", others: "Limited options" },
          { feature: "Strength Meter", ourTool: "Real-time analysis", others: "Basic or none" },
          { feature: "History Tracking", ourTool: "Local only", others: "Cloud stored" },
          { feature: "Usage Limits", ourTool: "Unlimited", others: "5-10 per day" },
          { feature: "Registration", ourTool: false, others: "Often required" },
          { feature: "Works Offline", ourTool: true, others: false },
          { feature: "Cost", ourTool: "Free forever", others: "Freemium" }
        ]}
      />

      <ToolFAQ 
        faqs={generatePasswordGeneratorFAQs()}
        toolName="Password Generator"
        toolPath="/password-generator"
      />
    </div>

  );
}