import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Download,
  Upload,
  Settings,
  Zap,
  HelpCircle,
  ChevronRight,
  BookOpen,
  Target,
  Clock,
  Key,
  FileText,
  Users,
  Building,
  GraduationCap,
  Heart,
  FileKey,
  ShieldAlert,
  ShieldCheck,
  XCircle
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

export default function HowToPasswordProtectPDF() {
  // HowTo Schema for SEO
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Password Protect PDF Files in 2025",
    description: "Learn how to add password protection and encryption to PDF files using our free online tool with military-grade AES encryption",
    image: "https://altaftoolshub.com/images/protect-pdf-guide.png",
    totalTime: "PT2M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0"
    },
    supply: [],
    tool: [{
      "@type": "HowToTool",
      name: "AltafToolsHub PDF Protector"
    }],
    step: [
      {
        "@type": "HowToStep",
        name: "Upload PDF file",
        text: "Upload the PDF file you want to protect to the tool",
        image: "https://altaftoolshub.com/images/protect-step1.png"
      },
      {
        "@type": "HowToStep",
        name: "Set password",
        text: "Enter and confirm a strong password for your PDF",
        image: "https://altaftoolshub.com/images/protect-step2.png"
      },
      {
        "@type": "HowToStep",
        name: "Configure permissions",
        text: "Choose encryption level and set document permissions",
        image: "https://altaftoolshub.com/images/protect-step3.png"
      },
      {
        "@type": "HowToStep",
        name: "Download protected PDF",
        text: "Download your password-protected PDF file",
        image: "https://altaftoolshub.com/images/protect-step4.png"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What's the difference between user and owner passwords?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A user password (open password) is required to open and view the PDF. An owner password (permissions password) provides full control over the document, including the ability to change security settings, print, copy, and edit."
        }
      },
      {
        "@type": "Question",
        name: "How secure is 256-bit AES encryption for PDFs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "256-bit AES encryption is military-grade security used by governments and financial institutions. It would take billions of years to crack with current technology, making it virtually unbreakable when used with a strong password."
        }
      },
      {
        "@type": "Question",
        name: "Can I remove the password if I forget it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, if you forget the password, there's no way to recover it. The encryption is designed to be unbreakable. Always store your passwords securely using a password manager."
        }
      },
      {
        "@type": "Question",
        name: "Does password protecting a PDF increase file size?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Password protection adds minimal overhead to your PDF file. The increase is typically less than 1% of the original file size, as encryption doesn't duplicate content."
        }
      },
      {
        "@type": "Question",
        name: "Will protected PDFs work on all devices?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, password-protected PDFs work with all standard PDF readers including Adobe Acrobat, web browsers, and mobile apps on iOS and Android. The PDF encryption standard is universal."
        }
      },
      {
        "@type": "Question",
        name: "Is it safe to protect PDFs online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "With our tool, yes! All processing happens in your browser using client-side encryption. Your files and passwords never leave your device and are not uploaded to any server."
        }
      },
      {
        "@type": "Question",
        name: "What permissions can I control in a protected PDF?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can control printing, copying text, editing content, adding annotations, filling forms, extracting pages, and assembling documents. These permissions are enforced by PDF readers."
        }
      },
      {
        "@type": "Question",
        name: "How strong should my PDF password be?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use at least 12 characters combining uppercase and lowercase letters, numbers, and special characters. Avoid common words or personal information. Consider using a passphrase for better security."
        }
      },
      {
        "@type": "Question",
        name: "Can I protect multiple PDFs with the same password?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can use the same password for multiple PDFs, but for maximum security, consider using unique passwords for highly sensitive documents and storing them in a password manager."
        }
      },
      {
        "@type": "Question",
        name: "What's the difference between AES-128 and AES-256?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Both are highly secure. AES-128 uses a 128-bit key and is extremely secure for most purposes. AES-256 uses a 256-bit key for military-grade security. We recommend AES-256 for maximum protection."
        }
      }
    ]
  };

  useSEO({
    title: "How to Password Protect PDF Files in 2025: Ultimate Security Guide",
    description: "Step-by-step guide to password protecting PDF files with AES encryption. Learn about user vs owner passwords, permissions, and security best practices.",
    path: "/guides/how-to-password-protect-pdf",
    keywords: "password protect pdf, pdf encryption, secure pdf files, pdf security, protect pdf online, pdf password protection, aes encryption pdf",
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
              <BreadcrumbPage>How to Password Protect PDF</BreadcrumbPage>
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
              Ultimate Guide
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How to Password Protect PDF Files in 2025: Ultimate Security Guide
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Master PDF security with military-grade encryption, permission controls, and best practices for protecting sensitive documents
            </p>
            
            {/* Quick Info */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">12 min read</span>
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
              <Link href="/protect-pdf" data-testid="try-tool-protect-pdf">
                <Shield className="w-4 h-4 mr-2" />
                Try PDF Protector Now
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
              <h2 className="text-2xl font-bold mb-4">Why PDF Protection Matters in 2025</h2>
              <p className="text-muted-foreground mb-4">
                In today's digital age, PDF documents carry everything from financial records and legal contracts to medical information and intellectual property. With cyber threats evolving daily and data breaches costing companies millions, protecting your PDF files has never been more critical.
              </p>
              <p className="text-muted-foreground mb-4">
                PDF password protection provides a robust first line of defense, ensuring that only authorized individuals can access your sensitive information. Whether you're a business professional sharing confidential reports, a healthcare provider handling patient records, or an individual protecting personal documents, understanding PDF encryption is essential.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Military-Grade Security</h3>
                    <p className="text-sm text-muted-foreground">256-bit AES encryption</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Complete Privacy</h3>
                    <p className="text-sm text-muted-foreground">Client-side processing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Settings className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Granular Control</h3>
                    <p className="text-sm text-muted-foreground">Custom permissions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Understanding PDF Protection Types */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Types of PDF Protection: User vs Owner Passwords</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-600" />
                    User Password (Document Open Password)
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    The user password is required to open and view the PDF. Without this password, the document remains completely inaccessible. This is your primary security barrier.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Prevents unauthorized viewing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Encrypts entire document content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Required for any document access</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileKey className="w-5 h-5 text-purple-600" />
                    Owner Password (Permissions Password)
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    The owner password provides master control over the document. It allows you to modify security settings and grant specific permissions while restricting others.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Controls printing permissions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Manages copy/paste abilities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Restricts editing and annotations</span>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Best Practice:</strong> Use both passwords for maximum security. Set a user password for access control and an owner password to manage permissions, ensuring they're different and equally strong.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Step-by-Step Guide */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Step-by-Step Guide to Password Protect PDFs</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-purple-600">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Upload Your PDF Document</h3>
                    <p className="text-muted-foreground mb-3">
                      Navigate to our PDF protection tool and upload your document. You can drag and drop the file or click to browse. Files up to 100MB are supported, and your document never leaves your browser.
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Upload className="w-4 h-4 text-blue-500" />
                        <span>Supported formats: PDF only</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>100% client-side processing</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-purple-600">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Create a Strong Password</h3>
                    <p className="text-muted-foreground mb-3">
                      Enter a robust password that combines uppercase and lowercase letters, numbers, and special characters. Our password strength meter helps ensure your password is secure.
                    </p>
                    <div className="space-y-2">
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm font-medium mb-2">Password Requirements:</p>
                        <ul className="space-y-1 text-sm">
                          <li>• Minimum 12 characters recommended</li>
                          <li>• Mix of upper and lowercase letters</li>
                          <li>• Include numbers and symbols</li>
                          <li>• Avoid dictionary words</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-purple-600">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Configure Security Settings</h3>
                    <p className="text-muted-foreground mb-3">
                      Choose your encryption level (AES-128 or AES-256) and set document permissions. Control whether users can print, copy text, edit, or fill forms.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="text-sm font-semibold mb-1">Encryption Options</h4>
                        <p className="text-xs text-muted-foreground">AES-128 or AES-256</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="text-sm font-semibold mb-1">Permissions</h4>
                        <p className="text-xs text-muted-foreground">Customizable access</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-purple-600">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Download Protected PDF</h3>
                    <p className="text-muted-foreground mb-3">
                      Click "Protect PDF" to encrypt your document. The process takes seconds, and you'll receive your protected file instantly. Store your password securely!
                    </p>
                    <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        Your PDF is now protected with military-grade encryption
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button asChild size="lg" className="btn-gradient text-white">
                  <Link href="/protect-pdf" data-testid="start-protecting-pdf">
                    <Shield className="w-4 h-4 mr-2" />
                    Start Protecting PDFs Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Best Practices */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Security Best Practices for PDF Protection</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold mb-2">Password Creation Guidelines</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Use unique passwords for highly sensitive documents</li>
                    <li>• Consider passphrases: combine 4-6 random words</li>
                    <li>• Never use personal information (birthdays, names, addresses)</li>
                    <li>• Store passwords in a reputable password manager</li>
                    <li>• Change passwords regularly for frequently shared documents</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold mb-2">Encryption Level Selection</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Use AES-256 for financial and legal documents</li>
                    <li>• AES-128 is sufficient for general business documents</li>
                    <li>• Consider compatibility: older PDF readers may not support AES-256</li>
                    <li>• Match encryption strength to document sensitivity</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold mb-2">Permission Management</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Restrict printing for confidential documents</li>
                    <li>• Disable text copying for intellectual property</li>
                    <li>• Allow form filling but restrict editing for applications</li>
                    <li>• Enable annotations for collaborative documents</li>
                    <li>• Use owner passwords to maintain control over permissions</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold mb-2">Distribution Security</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Share passwords through a different channel than the PDF</li>
                    <li>• Use encrypted email or secure messaging for password sharing</li>
                    <li>• Consider time-limited access for temporary document sharing</li>
                    <li>• Maintain an access log for sensitive documents</li>
                    <li>• Verify recipient identity before sharing passwords</li>
                  </ul>
                </div>
              </div>

              <Alert className="mt-6">
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Tip:</strong> Never send passwords in the same email as the PDF. Use a phone call, text message, or secure messaging app to communicate passwords separately.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Common Mistakes to Avoid */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Common Mistakes to Avoid</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Using Weak Passwords</h3>
                      <p className="text-sm text-muted-foreground">
                        Simple passwords like "123456" or "password" can be cracked in seconds. Always use complex, unique passwords.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Forgetting to Test</h3>
                      <p className="text-sm text-muted-foreground">
                        Always test your protected PDF before sharing to ensure the password works and permissions are correct.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Not Backing Up Passwords</h3>
                      <p className="text-sm text-muted-foreground">
                        Lost passwords mean permanently locked documents. Always store passwords securely in multiple locations.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Over-Restricting Permissions</h3>
                      <p className="text-sm text-muted-foreground">
                        Too many restrictions can make documents unusable. Balance security with practical usability needs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Same Password for All Files</h3>
                      <p className="text-sm text-muted-foreground">
                        Using one password for everything creates a single point of failure. Vary passwords based on sensitivity.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Ignoring Updates</h3>
                      <p className="text-sm text-muted-foreground">
                        PDF security standards evolve. Stay updated on best practices and encryption improvements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Industry Use Cases */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Industry Use Cases for PDF Protection</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Business & Corporate</h3>
                    <p className="text-muted-foreground mb-3">
                      Protecting financial reports, strategic plans, merger documents, and confidential client information. Companies use PDF encryption to prevent industrial espionage and maintain competitive advantage.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Financial Reports</Badge>
                      <Badge variant="secondary">Contracts</Badge>
                      <Badge variant="secondary">Business Plans</Badge>
                      <Badge variant="secondary">Client Data</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Healthcare</h3>
                    <p className="text-muted-foreground mb-3">
                      HIPAA compliance requires protecting patient records, medical histories, test results, and insurance information. PDF encryption ensures patient privacy and regulatory compliance.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Patient Records</Badge>
                      <Badge variant="secondary">Test Results</Badge>
                      <Badge variant="secondary">Insurance Forms</Badge>
                      <Badge variant="secondary">Medical History</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Legal</h3>
                    <p className="text-muted-foreground mb-3">
                      Law firms protect case files, court documents, depositions, and attorney-client privileged information. Password protection maintains confidentiality and chain of custody.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Legal Briefs</Badge>
                      <Badge variant="secondary">Court Documents</Badge>
                      <Badge variant="secondary">Depositions</Badge>
                      <Badge variant="secondary">Case Files</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Education</h3>
                    <p className="text-muted-foreground mb-3">
                      Educational institutions protect exam papers, grade reports, research data, and student records. PDF encryption prevents cheating and maintains academic integrity.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Exam Papers</Badge>
                      <Badge variant="secondary">Grade Reports</Badge>
                      <Badge variant="secondary">Research Data</Badge>
                      <Badge variant="secondary">Transcripts</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Tips */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Advanced PDF Protection Tips</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Layered Security Approach
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Combine PDF encryption with additional security measures for maximum protection:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Use watermarks to deter unauthorized sharing</li>
                    <li>• Add digital signatures for authenticity verification</li>
                    <li>• Implement DRM systems for enterprise-level control</li>
                    <li>• Set expiration dates for time-sensitive documents</li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-500" />
                    Permission Strategies
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Optimize permissions based on document purpose:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <strong>Read-Only Documents:</strong> Disable all editing and copying</li>
                    <li>• <strong>Forms:</strong> Allow form filling but restrict other edits</li>
                    <li>• <strong>Review Documents:</strong> Enable comments but disable content changes</li>
                    <li>• <strong>Print-Restricted:</strong> Allow viewing but prevent physical copies</li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Key className="w-5 h-5 text-orange-500" />
                    Password Management Tips
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Professional password management practices:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Use password managers like Bitwarden or 1Password</li>
                    <li>• Create password policies for organization-wide compliance</li>
                    <li>• Implement password rotation schedules</li>
                    <li>• Document password recovery procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    What's the difference between user and owner passwords?
                  </AccordionTrigger>
                  <AccordionContent>
                    A user password (also called "document open password") is required to open and view the PDF. Without it, the document cannot be accessed at all. An owner password (or "permissions password") provides master control over the document. It allows you to change security settings, modify permissions, and have full control even if a user password is set. You can use both passwords together - users need the user password to open the document but are restricted by the permissions you've set with the owner password.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    How secure is 256-bit AES encryption for PDFs?
                  </AccordionTrigger>
                  <AccordionContent>
                    256-bit AES (Advanced Encryption Standard) is considered military-grade encryption and is virtually unbreakable with current technology. It's the same encryption standard used by governments, banks, and military organizations worldwide. To put it in perspective, breaking AES-256 encryption would take the world's fastest supercomputer billions of years. The security of your protected PDF ultimately depends on the strength of your password - the encryption itself is impenetrable.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Can I remove the password if I forget it?
                  </AccordionTrigger>
                  <AccordionContent>
                    No, if you forget the password, there's no legitimate way to recover or remove it. The encryption is designed to be unbreakable, and there's no "backdoor" or recovery method. This is why it's crucial to store your passwords securely using a password manager or other secure method. Some people keep a physical record in a safe or use encrypted password managers. Remember: losing the password means losing access to the document permanently.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Does password protecting a PDF increase file size?
                  </AccordionTrigger>
                  <AccordionContent>
                    Password protection adds minimal overhead to your PDF file. The encryption process typically increases file size by less than 1% because it doesn't duplicate or add content - it simply scrambles the existing data. For example, a 10MB PDF might become 10.1MB after encryption. The slight increase comes from the encryption metadata and security headers added to the file. This negligible size increase is a small price to pay for the security benefits.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Will protected PDFs work on all devices and PDF readers?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, password-protected PDFs created with standard encryption work universally across all modern PDF readers and devices. This includes Adobe Acrobat Reader, web browsers (Chrome, Firefox, Safari, Edge), Preview on Mac, and mobile PDF apps on iOS and Android. The PDF encryption standard is part of the official PDF specification, ensuring compatibility. However, very old PDF readers (pre-2000) might have issues with AES-256 encryption, though AES-128 has near-universal support.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Is it safe to protect PDFs using online tools?
                  </AccordionTrigger>
                  <AccordionContent>
                    It depends on the tool. Our PDF protector is completely safe because all processing happens in your browser using client-side JavaScript. Your files and passwords never leave your device and are never transmitted to any server. This "zero-knowledge" approach means even we cannot see your documents or passwords. However, be cautious with tools that upload your files to servers - they could potentially access your sensitive information. Always check if a tool offers client-side processing for maximum security.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    What permissions can I control in a protected PDF?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can control numerous permissions including: printing (allow/deny or set quality levels), copying text and images, editing content, adding or modifying annotations and comments, filling in form fields, extracting pages, assembling documents (inserting, rotating, or deleting pages), and more. These permissions are enforced by PDF readers, giving you fine-grained control over how recipients can interact with your document. You can create view-only documents or allow specific actions while restricting others.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    How strong should my PDF password be?
                  </AccordionTrigger>
                  <AccordionContent>
                    Your password should be at least 12 characters long, but 16-20 characters is even better. Use a combination of uppercase and lowercase letters, numbers, and special characters. Avoid dictionary words, personal information, keyboard patterns, or common substitutions (like @ for a). Consider using a passphrase - a series of random words strung together - which can be both secure and memorable. For example: "Coffee#Sunrise7Mountain$Blue" is stronger and easier to remember than "P@ssw0rd123". Always use unique passwords for your most sensitive documents.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    Can I protect multiple PDFs with the same password?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, you can use the same password for multiple PDFs, and this is common for related documents or document sets. However, for maximum security, consider using unique passwords for highly sensitive or unrelated documents. If one password is compromised, it won't affect other documents. A good practice is to use password categories - one password for internal documents, another for client files, and unique passwords for highly confidential materials. Store all passwords securely in a password manager.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10" className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left">
                    What's the difference between AES-128 and AES-256 encryption?
                  </AccordionTrigger>
                  <AccordionContent>
                    Both AES-128 and AES-256 are extremely secure encryption standards. AES-128 uses a 128-bit encryption key and provides excellent security that would take millions of years to crack. AES-256 uses a 256-bit key, offering even stronger protection - it's considered military-grade and is used for top-secret government information. For most purposes, AES-128 is more than sufficient, but AES-256 provides peace of mind for the most sensitive documents. The performance difference is negligible on modern devices, so we recommend AES-256 for maximum protection.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Security Considerations */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Additional Security Considerations</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Legal and Compliance Aspects</h3>
                  <p className="text-muted-foreground mb-3">
                    Many industries have specific requirements for document protection. HIPAA in healthcare, GDPR in Europe, and SOX in finance all mandate certain levels of data protection. PDF encryption helps meet these requirements by providing:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Audit trails showing who accessed protected documents</li>
                    <li>• Evidence of reasonable security measures</li>
                    <li>• Protection against data breaches</li>
                    <li>• Compliance with encryption requirements</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">When to Use Different Protection Levels</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <strong className="text-green-700 dark:text-green-300">Low Security:</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        General business documents, marketing materials, public-facing content. Use simple passwords and basic permissions.
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <strong className="text-yellow-700 dark:text-yellow-300">Medium Security:</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Internal documents, project files, standard contracts. Use strong passwords and restrict copying/editing.
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <strong className="text-red-700 dark:text-red-300">High Security:</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        Financial records, legal documents, personal data. Use complex passwords, AES-256, and strict permissions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6 text-center">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Ready to Secure Your PDFs?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start protecting your sensitive documents with military-grade encryption. Our tool makes PDF security simple, fast, and completely private.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="btn-gradient text-white">
                  <Link href="/protect-pdf" data-testid="cta-protect-pdf">
                    <Shield className="w-4 h-4 mr-2" />
                    Protect PDF Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/unlock-pdf" data-testid="link-unlock-pdf">
                    <Lock className="w-4 h-4 mr-2" />
                    Unlock PDF
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Guides */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Related Guides</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/guides/how-to-unlock-pdf">
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <Lock className="w-8 h-8 text-blue-500 mb-2" />
                    <h3 className="font-semibold mb-1">How to Unlock PDFs</h3>
                    <p className="text-sm text-muted-foreground">
                      Remove password protection from PDFs safely
                    </p>
                  </div>
                </Link>
                <Link href="/guides/how-to-compress-pdf">
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <FileText className="w-8 h-8 text-green-500 mb-2" />
                    <h3 className="font-semibold mb-1">Compress PDF Files</h3>
                    <p className="text-sm text-muted-foreground">
                      Reduce PDF size without quality loss
                    </p>
                  </div>
                </Link>
                <Link href="/watermark-pdf">
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <Shield className="w-8 h-8 text-purple-500 mb-2" />
                    <h3 className="font-semibold mb-1">Add Watermarks</h3>
                    <p className="text-sm text-muted-foreground">
                      Brand and protect PDFs with watermarks
                    </p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>
    </div>
  );
}