import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Key,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Copy,
  Settings,
  RefreshCw,
  HelpCircle,
  ChevronRight,
  BookOpen,
  Target,
  Clock,
  Lock,
  AlertTriangle,
  Hash,
  AtSign
} from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function HowToGeneratePassword() {
  // HowTo Schema for SEO
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Generate Secure Passwords",
    description: "Learn how to create strong, unique passwords using our free password generator with customizable security options",
    image: "https://altaftoolshub.app/images/password-generator-guide.png",
    totalTime: "PT2M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0"
    },
    supply: [],
    tool: [{
      "@type": "HowToTool",
      name: "AltafToolsHub Password Generator"
    }],
    step: [
      {
        "@type": "HowToStep",
        name: "Set password length",
        text: "Choose the desired length for your password (8-128 characters)",
        image: "https://altaftoolshub.app/images/password-step1.png"
      },
      {
        "@type": "HowToStep",
        name: "Select character types",
        text: "Choose which character types to include: uppercase, lowercase, numbers, symbols",
        image: "https://altaftoolshub.app/images/password-step2.png"
      },
      {
        "@type": "HowToStep",
        name: "Generate password",
        text: "Click Generate to create your secure password",
        image: "https://altaftoolshub.app/images/password-step3.png"
      },
      {
        "@type": "HowToStep",
        name: "Copy password",
        text: "Copy the generated password to your clipboard",
        image: "https://altaftoolshub.app/images/password-step4.png"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What makes a password strong?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A strong password is at least 12 characters long, includes uppercase and lowercase letters, numbers, and special characters, and doesn't contain dictionary words or personal information."
        }
      },
      {
        "@type": "Question",
        name: "How often should I change my passwords?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Change passwords immediately if there's a breach. Otherwise, focus on using unique, strong passwords for each account rather than frequent changes. Use two-factor authentication for added security."
        }
      },
      {
        "@type": "Question",
        name: "Is it safe to use an online password generator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our generator creates passwords entirely in your browser. No passwords are sent to our servers or stored anywhere. The generation happens locally on your device."
        }
      }
    ]
  };

  useSEO({
    title: "How to Generate Secure Passwords - Complete Guide",
    description: "Learn how to create strong, unique passwords for better security. Free password generator with tips for password management and best practices.",
    path: "/guides/how-to-generate-password",
    keywords: "generate secure password, strong password generator, password security guide, create random password, password best practices",
    structuredData: [howToSchema, faqSchema]
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/guides">Guides</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>How to Generate Password</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto"
        >
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              Complete Guide
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How to Generate Secure Passwords
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create strong, unique passwords to protect your online accounts
            </p>
            
            {/* Quick Info */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">4 min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm">Difficulty: Easy</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-sm">100% Secure</span>
              </div>
            </div>

            <Button asChild size="lg" className="btn-gradient text-white">
              <Link href="/password-generator" data-testid="try-tool-password-generator">
                <Key className="w-4 h-4 mr-2" />
                Try Password Generator
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Why Strong Passwords Matter</h2>
              <p className="text-muted-foreground mb-4">
                Weak passwords are the most common security vulnerability. Data breaches often succeed because of 
                reused or simple passwords. Creating unique, strong passwords for each account is your first line of defense.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Prevent Breaches</p>
                    <p className="text-sm text-muted-foreground">Stop unauthorized access</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Protect Identity</p>
                    <p className="text-sm text-muted-foreground">Safeguard personal information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Financial Security</p>
                    <p className="text-sm text-muted-foreground">Secure banking and payments</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Strength Criteria */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">What Makes a Password Strong?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Hash className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Length (12+ characters)</p>
                    <p className="text-sm text-muted-foreground">Longer passwords exponentially increase crack time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AtSign className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Character Variety</p>
                    <p className="text-sm text-muted-foreground">Mix uppercase, lowercase, numbers, and symbols</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Randomness</p>
                    <p className="text-sm text-muted-foreground">Avoid patterns, dictionary words, or personal info</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Key className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Uniqueness</p>
                    <p className="text-sm text-muted-foreground">Never reuse passwords across accounts</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step by Step Guide */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Key className="w-6 h-6 text-primary" />
                Step-by-Step Instructions
              </h2>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      1
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-2">Set Password Length</h3>
                    <p className="text-muted-foreground mb-3">
                      Choose your password length using the slider:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Minimum: 8 characters (basic security)</li>
                      <li>Recommended: 16+ characters (strong security)</li>
                      <li>Maximum: 128 characters (maximum security)</li>
                    </ul>
                    <Alert className="mt-3">
                      <Lightbulb className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Pro Tip:</strong> Each additional character makes your password exponentially harder to crack
                      </AlertDescription>
                    </Alert>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Settings className="w-8 h-8 text-primary/50" />
                      <span className="ml-2 text-muted-foreground">Screenshot Placeholder</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      2
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-2">Configure Character Types</h3>
                    <p className="text-muted-foreground mb-3">
                      Select which character types to include:
                    </p>
                    <div className="space-y-3">
                      <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Uppercase Letters:</strong> A-Z (Always recommended)
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Lowercase Letters:</strong> a-z (Always recommended)
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Numbers:</strong> 0-9 (Highly recommended)
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Symbols:</strong> !@#$%^&* (For maximum security)
                        </AlertDescription>
                      </Alert>
                    </div>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Hash className="w-8 h-8 text-primary/50" />
                      <span className="ml-2 text-muted-foreground">Screenshot Placeholder</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      3
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-2">Generate Your Password</h3>
                    <p className="text-muted-foreground mb-3">
                      Click "Generate Password" to create a random, secure password. Generate multiple options until you find one you like.
                    </p>
                    <Alert className="mt-3">
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Security Note:</strong> Passwords are generated locally in your browser using cryptographically secure randomness
                      </AlertDescription>
                    </Alert>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <RefreshCw className="w-8 h-8 text-primary/50" />
                      <span className="ml-2 text-muted-foreground">Screenshot Placeholder</span>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                      4
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-2">Copy and Store Securely</h3>
                    <p className="text-muted-foreground mb-3">
                      Copy the password to your clipboard and store it securely:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>Use a password manager (highly recommended)</li>
                      <li>Never save passwords in browsers on shared devices</li>
                      <li>Don't write passwords on sticky notes</li>
                      <li>Avoid saving in plain text files</li>
                    </ul>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <Copy className="w-8 h-8 text-primary/50" />
                      <span className="ml-2 text-muted-foreground">Screenshot Placeholder</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                Password Best Practices
              </h2>
              <div className="space-y-3">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Use a Password Manager:</strong> Store all passwords securely and access with one master password
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Enable 2FA:</strong> Add two-factor authentication for an extra security layer
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Regular Updates:</strong> Change passwords immediately after any security breach
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Unique for Each Account:</strong> Never reuse passwords, especially for important accounts
                  </AlertDescription>
                </Alert>
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Passphrases:</strong> Consider memorable phrases like "Coffee#Monday$2024!" for easier recall
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                Common Password Mistakes to Avoid
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Using personal information?</AccordionTrigger>
                  <AccordionContent>
                    Never use birthdays, names, addresses, or any publicly available information. Hackers often research targets on social media to guess passwords.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Simple substitutions like p@ssw0rd?</AccordionTrigger>
                  <AccordionContent>
                    Common letter-to-number substitutions (@ for a, 0 for o, 3 for e) are well-known to hackers. Use truly random combinations instead.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Keyboard patterns like qwerty123?</AccordionTrigger>
                  <AccordionContent>
                    Keyboard walks and patterns are among the first things hackers try. Avoid sequential keys or common patterns.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Saving passwords in browsers?</AccordionTrigger>
                  <AccordionContent>
                    Browser password storage can be vulnerable, especially on shared computers. Use a dedicated password manager with encryption instead.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-primary" />
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1">
                  <AccordionTrigger>How can I remember complex passwords?</AccordionTrigger>
                  <AccordionContent>
                    Use a password manager to store them securely. You only need to remember one master password. Alternatively, create passphrases from memorable sentences.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger>Should I write down passwords?</AccordionTrigger>
                  <AccordionContent>
                    Physical storage in a secure location (like a safe) is better than digital plain text. However, password managers are the most secure and convenient option.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger>How often should I generate new passwords?</AccordionTrigger>
                  <AccordionContent>
                    Generate new passwords when creating accounts, after breaches, or if you suspect compromise. Regular changes aren't necessary with strong, unique passwords.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-4">
                  <AccordionTrigger>Can hackers crack any password?</AccordionTrigger>
                  <AccordionContent>
                    Theoretically yes, but a 16+ character random password would take billions of years to crack with current technology. Focus on length and randomness.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-5">
                  <AccordionTrigger>Is this generator truly random?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we use the Web Crypto API which provides cryptographically secure random values, the same standard used for encryption.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Generate Your Secure Password Now</h2>
              <p className="text-muted-foreground mb-6">
                Create strong, unique passwords instantly with our free tool.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="btn-gradient text-white">
                  <Link href="/password-generator" data-testid="cta-password-generator">
                    Generate Password
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/guides" data-testid="cta-more-guides">
                    More Guides
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Guides */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Guides</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/guides/how-to-generate-qr-code" className="block">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">How to Generate QR Codes</h3>
                        <p className="text-sm text-muted-foreground">Create QR codes for secure sharing</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/guides/how-to-unlock-pdf" className="block">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Lock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">How to Unlock PDF Files</h3>
                        <p className="text-sm text-muted-foreground">Remove PDF password protection</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}