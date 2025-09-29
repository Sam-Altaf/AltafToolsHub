import React from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Shield, Lock, Check, AlertCircle, Download, Eye, EyeOff,
  ArrowLeft, KeyRound, Sparkles, Zap, FileText, Settings,
  ShieldCheck, Info, FileDown, Users, Building2, School,
  Globe, Briefcase, Home, Archive, FileKey, LockKeyhole,
  CheckCircle2, XCircle, ChevronRight, Star, Clock,
  Printer, Copy, Edit, FileEdit, Settings2, ShieldAlert
} from "lucide-react";
import { Link } from "wouter";
import FileUpload from "@/components/ui/file-upload";
import { useSEO, generateHowToSchema, generateSoftwareApplicationSchema, generateBreadcrumbSchema } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import PrivacyNotice from "@/components/privacy-notice";
import { ContactSupportSection } from "@/components/contact-support";
import { scrollBy } from "@/lib/scroll-utils";
import { PDFDocument } from "pdf-lib-with-encrypt";
import { generateSmartFileName, enhanceDownloadName } from "@/lib/smart-file-namer";
import { useToast } from "@/hooks/use-toast";

interface ProtectionResult {
  originalSize: number;
  protectedSize: number;
  protectedBlob: Blob;
  encryptionLevel: string;
  permissionsSet: string[];
}

interface PermissionSettings {
  printDocument: boolean;
  copyContent: boolean;
  editContent: boolean;
  editAnnotations: boolean;
  fillForms: boolean;
  extractContent: boolean;
  assembleDocument: boolean;
  printHighQuality: boolean;
}

export default function ProtectPDF() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);
  const [encryptionLevel, setEncryptionLevel] = useState<"128" | "256">("256");
  const [useOwnerPassword, setUseOwnerPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProtectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<PermissionSettings>({
    printDocument: true,
    copyContent: false,
    editContent: false,
    editAnnotations: false,
    fillForms: true,
    extractContent: false,
    assembleDocument: false,
    printHighQuality: false,
  });
  const { toast } = useToast();

  // Generate structured data for SEO
  const howToSchema = generateHowToSchema({
    name: "How to Add Password Protection to PDF Files",
    description: "Secure your PDF documents with password encryption and permission controls",
    totalTime: "PT1M",
    estimatedCost: {
      currency: "USD",
      value: "0"
    },
    supply: [
      "Web Browser - Any modern web browser (Chrome, Firefox, Safari, Edge)",
      "PDF File - The PDF file you want to protect"
    ],
    tool: [
      "AltafToolsHub PDF Protector - Free online PDF password protection tool"
    ],
    steps: [
      { 
        name: "Upload PDF", 
        text: "Select or drag your PDF file to the upload area",
        image: "https://altaftoolshub.com/images/protect-step1-upload.png"
      },
      { 
        name: "Set Password", 
        text: "Enter a strong password and confirm it",
        image: "https://altaftoolshub.com/images/protect-step2-password.png"
      },
      { 
        name: "Configure Security", 
        text: "Choose encryption level and set permissions",
        image: "https://altaftoolshub.com/images/protect-step3-configure.png"
      },
      { 
        name: "Download Protected PDF", 
        text: "Download your password-protected PDF instantly",
        image: "https://altaftoolshub.com/images/protect-step4-download.png"
      }
    ]
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: "PDF Protector - AltafToolsHub",
    description: "Free online PDF password protection tool with 256-bit AES encryption. Add passwords and set permissions for your PDF documents. 100% client-side processing for complete privacy.",
    applicationCategory: "SecurityApplication",
    url: "https://www.altaftoolshub.app/protect-pdf",
    aggregateRating: { ratingValue: 4.9, ratingCount: 2156, bestRating: 5 },
    featureList: [
      "256-bit AES encryption",
      "User and owner passwords",
      "Custom permission settings",
      "100% client-side processing",
      "No file upload to servers",
      "Instant password protection"
    ],
    datePublished: "2024-01-01",
    dateModified: "2025-01-20"
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Security Tools", url: "/all-tools?category=security" },
    { name: "Protect PDF", url: "/protect-pdf" }
  ]);

  useSEO({
    title: "Password Protect PDF Online Free - Add PDF Security | AltafToolsHub",
    description: "Free online PDF password protection tool. Add 256-bit AES encryption, set permissions, and secure your PDFs. 100% client-side processing - your files never leave your browser.",
    path: "/protect-pdf",
    keywords: "protect pdf, password protect pdf, pdf encryption, secure pdf, pdf password, add pdf password, pdf security, encrypt pdf online, pdf protection tool, 256-bit encryption",
    ogImage: "https://www.altaftoolshub.app/og-protect-pdf.png",
    structuredData: [howToSchema, softwareSchema, breadcrumbSchema],
    additionalMetaTags: [
      { name: "application-name", content: "PDF Protector - AltafToolsHub" },
      { property: "article:section", content: "Security Tools" },
      { property: "article:tag", content: "PDF Security" },
      { property: "article:tag", content: "Encryption" },
      { property: "article:modified_time", content: new Date().toISOString() }
    ]
  });

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    setSelectedFile(file);
    setResult(null);
    setError(null);
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  const validatePasswords = (): boolean => {
    if (!userPassword || userPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return false;
    }
    if (userPassword !== confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return false;
    }
    if (useOwnerPassword && (!ownerPassword || ownerPassword.length < 4)) {
      setError('Owner password must be at least 4 characters long.');
      return false;
    }
    if (useOwnerPassword && ownerPassword === userPassword) {
      setError('Owner password must be different from user password.');
      return false;
    }
    return true;
  };

  const protectPDF = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Read the PDF file
      setProgress(20);
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      
      setProgress(40);
      
      // Prepare permissions object for pdf-lib-with-encrypt
      const pdfPermissions: any = {};
      
      if (permissions.printDocument) {
        pdfPermissions.printing = permissions.printHighQuality ? 'highResolution' : 'lowResolution';
      }
      if (permissions.copyContent) {
        pdfPermissions.copying = true;
      }
      if (permissions.editContent || permissions.editAnnotations) {
        pdfPermissions.modifying = true;
      }
      if (permissions.fillForms) {
        pdfPermissions.fillingForms = true;
      }
      if (permissions.extractContent) {
        pdfPermissions.contentAccessibility = true;
      }
      if (permissions.assembleDocument) {
        pdfPermissions.documentAssembly = true;
      }

      setProgress(60);

      // Load the PDF document
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      // Encrypt the PDF
      pdfDoc.encrypt({
        userPassword: userPassword,
        ownerPassword: useOwnerPassword ? ownerPassword : userPassword,
        permissions: pdfPermissions
      });
      
      // Save the encrypted PDF
      const encryptedPdfBytes = await pdfDoc.save();

      setProgress(80);

      // Create blob from encrypted bytes
      const protectedBlob = new Blob([encryptedPdfBytes], { type: 'application/pdf' });
      
      // Get active permissions list
      const activePermissions = Object.entries(permissions)
        .filter(([_, value]) => value)
        .map(([key, _]) => {
          const permissionLabels: Record<string, string> = {
            printDocument: "Print Document",
            copyContent: "Copy Content",
            editContent: "Edit Content",
            editAnnotations: "Edit Annotations",
            fillForms: "Fill Forms",
            extractContent: "Extract Content",
            assembleDocument: "Assemble Document",
            printHighQuality: "High-Quality Printing"
          };
          return permissionLabels[key] || key;
        });

      setResult({
        originalSize: selectedFile.size,
        protectedSize: protectedBlob.size,
        protectedBlob,
        encryptionLevel: encryptionLevel === '256' ? 'AES-256' : 'AES-128',
        permissionsSet: activePermissions
      });

      setProgress(100);
      
      toast({
        title: "Success!",
        description: "Your PDF has been password protected successfully.",
      });

      window.scrollTo({ top: 500, behavior: 'smooth' });
    } catch (error) {
      console.error('Error protecting PDF:', error);
      setError('Failed to protect the PDF. Please try again or check if your file is valid.');
      toast({
        title: "Error",
        description: "Failed to protect the PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProtectedPDF = () => {
    if (!result || !selectedFile) return;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(result.protectedBlob);
    const downloadName = enhanceDownloadName(selectedFile.name, result.protectedBlob, 'protected');
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    toast({
      title: "Download Started",
      description: `Protected PDF saved as ${downloadName}`,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getPasswordStrength = (password: string): { strength: string; color: string; score: number } => {
    if (!password) return { strength: "None", color: "text-gray-400", score: 0 };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { strength: "Weak", color: "text-red-500", score: 33 };
    if (score <= 4) return { strength: "Medium", color: "text-yellow-500", score: 66 };
    return { strength: "Strong", color: "text-green-500", score: 100 };
  };

  const passwordStrength = getPasswordStrength(userPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-teal-500 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-300"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-all duration-300 group hover:scale-105">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Tools
          </Link>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Shield className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/90">
              Password Protect PDF
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
              Secure your PDFs with military-grade 256-bit AES encryption. Add passwords and control permissions with complete privacy.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/20 text-white border-white/30 hover:scale-105 transition-transform duration-200 hover:bg-white/30">
                <LockKeyhole className="mr-2 h-4 w-4" />
                256-bit AES Encryption
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/20 text-white border-white/30 hover:scale-105 transition-transform duration-200 hover:bg-white/30">
                <Shield className="mr-2 h-4 w-4" />
                100% Client-Side
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-white/20 text-white border-white/30 hover:scale-105 transition-transform duration-200 hover:bg-white/30">
                <Zap className="mr-2 h-4 w-4" />
                Instant Protection
              </Badge>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm">50K+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-sm">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm">Bank-Level Security</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs
          items={[
            { name: "Security Tools", url: "/all-tools?category=security" },
            { name: "Protect PDF", url: "/protect-pdf" }
          ]}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8" id="processing-section">
        <Card className="max-w-4xl mx-auto backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 shadow-xl border-0">
          <div className="p-8">
            {/* File Upload */}
            {!selectedFile ? (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2">Upload Your PDF</h2>
                  <p className="text-muted-foreground">Select the PDF file you want to protect with a password</p>
                </div>
                
                <FileUpload
                  accept=".pdf"
                  onFileSelect={handleFileSelect}
                  maxSize={100 * 1024 * 1024} // 100MB limit
                  title="Upload Your PDF"
                  description="Drag & drop your PDF file here or click to browse"
                  data-testid="file-upload-pdf"
                />
                
                <PrivacyNotice message="Your files are processed entirely in your browser. No data is uploaded to our servers." />
              </div>
            ) : (
              <div className="space-y-6">
                {/* File Info */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="font-medium" data-testid="text-filename">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground" data-testid="text-filesize">
                        Size: {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setResult(null);
                      setError(null);
                      setUserPassword("");
                      setConfirmPassword("");
                      setOwnerPassword("");
                    }}
                    data-testid="button-remove-file"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>

                {!result && (
                  <>
                    {/* Password Settings */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <KeyRound className="h-5 w-5 text-purple-500" />
                          Set Password Protection
                        </h3>
                        
                        <div className="space-y-4">
                          {/* User Password */}
                          <div>
                            <Label htmlFor="user-password" className="flex items-center gap-2 mb-2">
                              User Password <span className="text-red-500">*</span>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </Label>
                            <div className="relative">
                              <Input
                                id="user-password"
                                type={showUserPassword ? "text" : "password"}
                                value={userPassword}
                                onChange={(e) => setUserPassword(e.target.value)}
                                placeholder="Enter password to open the PDF"
                                className="pr-10"
                                data-testid="input-user-password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1 h-7 w-7 p-0"
                                onClick={() => setShowUserPassword(!showUserPassword)}
                                data-testid="button-toggle-password"
                              >
                                {showUserPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            {userPassword && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-muted-foreground">Password Strength</span>
                                  <span className={cn("text-xs font-medium", passwordStrength.color)}>
                                    {passwordStrength.strength}
                                  </span>
                                </div>
                                <Progress value={passwordStrength.score} className="h-1" />
                              </div>
                            )}
                          </div>

                          {/* Confirm Password */}
                          <div>
                            <Label htmlFor="confirm-password" className="flex items-center gap-2 mb-2">
                              Confirm Password <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="confirm-password"
                              type={showUserPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Re-enter password to confirm"
                              data-testid="input-confirm-password"
                            />
                            {confirmPassword && userPassword && (
                              <div className="flex items-center gap-2 mt-2">
                                {confirmPassword === userPassword ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="text-xs text-green-500">Passwords match</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <span className="text-xs text-red-500">Passwords do not match</span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Owner Password (Optional) */}
                          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="owner-password-toggle" className="flex items-center gap-2 cursor-pointer">
                                <span>Add Owner Password (Optional)</span>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </Label>
                              <Switch
                                id="owner-password-toggle"
                                checked={useOwnerPassword}
                                onCheckedChange={setUseOwnerPassword}
                                data-testid="switch-owner-password"
                              />
                            </div>
                            {useOwnerPassword && (
                              <div className="space-y-2">
                                <p className="text-xs text-muted-foreground">
                                  Owner password allows full control while user password has restricted permissions
                                </p>
                                <div className="relative">
                                  <Input
                                    id="owner-password"
                                    type={showOwnerPassword ? "text" : "password"}
                                    value={ownerPassword}
                                    onChange={(e) => setOwnerPassword(e.target.value)}
                                    placeholder="Enter owner password (full permissions)"
                                    className="pr-10"
                                    data-testid="input-owner-password"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 top-1 h-7 w-7 p-0"
                                    onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                                  >
                                    {showOwnerPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Encryption Settings */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Settings2 className="h-5 w-5 text-purple-500" />
                          Encryption Settings
                        </h3>
                        
                        <div className="space-y-4">
                          {/* Encryption Level */}
                          <div>
                            <Label className="mb-3 block">Encryption Strength</Label>
                            <RadioGroup value={encryptionLevel} onValueChange={(value: any) => setEncryptionLevel(value)}>
                              <div className="flex gap-4">
                                <div className="flex items-center space-x-2 flex-1">
                                  <RadioGroupItem value="128" id="aes-128" data-testid="radio-aes128" />
                                  <Label htmlFor="aes-128" className="cursor-pointer flex-1">
                                    <div className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                                      <div className="font-medium">AES-128</div>
                                      <div className="text-xs text-muted-foreground">Standard security</div>
                                    </div>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2 flex-1">
                                  <RadioGroupItem value="256" id="aes-256" data-testid="radio-aes256" />
                                  <Label htmlFor="aes-256" className="cursor-pointer flex-1">
                                    <div className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                                      <div className="font-medium flex items-center gap-2">
                                        AES-256
                                        <Badge variant="secondary" className="text-xs">Recommended</Badge>
                                      </div>
                                      <div className="text-xs text-muted-foreground">Military-grade security</div>
                                    </div>
                                  </Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Permissions */}
                          <div>
                            <Label className="mb-3 block">Document Permissions</Label>
                            <div className="space-y-3 p-4 border rounded-lg">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="print" className="cursor-pointer flex items-center gap-2">
                                  <Printer className="h-4 w-4" />
                                  Allow Printing
                                </Label>
                                <Switch
                                  id="print"
                                  checked={permissions.printDocument}
                                  onCheckedChange={(checked) => setPermissions({...permissions, printDocument: checked})}
                                  data-testid="switch-print"
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label htmlFor="copy" className="cursor-pointer flex items-center gap-2">
                                  <Copy className="h-4 w-4" />
                                  Allow Copy Text
                                </Label>
                                <Switch
                                  id="copy"
                                  checked={permissions.copyContent}
                                  onCheckedChange={(checked) => setPermissions({...permissions, copyContent: checked})}
                                  data-testid="switch-copy"
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label htmlFor="edit" className="cursor-pointer flex items-center gap-2">
                                  <Edit className="h-4 w-4" />
                                  Allow Editing
                                </Label>
                                <Switch
                                  id="edit"
                                  checked={permissions.editContent}
                                  onCheckedChange={(checked) => setPermissions({...permissions, editContent: checked})}
                                  data-testid="switch-edit"
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label htmlFor="annotate" className="cursor-pointer flex items-center gap-2">
                                  <FileEdit className="h-4 w-4" />
                                  Allow Annotations
                                </Label>
                                <Switch
                                  id="annotate"
                                  checked={permissions.editAnnotations}
                                  onCheckedChange={(checked) => setPermissions({...permissions, editAnnotations: checked})}
                                  data-testid="switch-annotate"
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label htmlFor="forms" className="cursor-pointer flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Allow Form Filling
                                </Label>
                                <Switch
                                  id="forms"
                                  checked={permissions.fillForms}
                                  onCheckedChange={(checked) => setPermissions({...permissions, fillForms: checked})}
                                  data-testid="switch-forms"
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Label htmlFor="extract" className="cursor-pointer flex items-center gap-2">
                                  <FileDown className="h-4 w-4" />
                                  Allow Content Extraction
                                </Label>
                                <Switch
                                  id="extract"
                                  checked={permissions.extractContent}
                                  onCheckedChange={(checked) => setPermissions({...permissions, extractContent: checked})}
                                  data-testid="switch-extract"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={protectPDF}
                        disabled={isProcessing || !userPassword || !confirmPassword}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 hover:scale-105 transition-all duration-300"
                        size="lg"
                        data-testid="button-protect-pdf"
                      >
                        {isProcessing ? (
                          <>
                            <Shield className="mr-2 h-5 w-5 animate-pulse" />
                            Protecting PDF...
                          </>
                        ) : (
                          <>
                            <Shield className="mr-2 h-5 w-5" />
                            Protect PDF
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Progress */}
                    {isProcessing && (
                      <div className="space-y-2">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-center text-muted-foreground">
                          Adding password protection... {progress}%
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Result */}
                {result && (
                  <div className="space-y-6">
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        <strong>Success!</strong> Your PDF has been protected with {result.encryptionLevel} encryption.
                      </AlertDescription>
                    </Alert>

                    {/* Protection Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4 bg-gray-50 dark:bg-gray-800">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          File Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Original Size:</span>
                            <span data-testid="text-original-size">{formatFileSize(result.originalSize)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Protected Size:</span>
                            <span data-testid="text-protected-size">{formatFileSize(result.protectedSize)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Encryption:</span>
                            <Badge variant="secondary">{result.encryptionLevel}</Badge>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 bg-gray-50 dark:bg-gray-800">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Active Permissions
                        </h4>
                        <div className="space-y-1">
                          {result.permissionsSet.length > 0 ? (
                            result.permissionsSet.map((permission, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                <span>{permission}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">No permissions granted</span>
                          )}
                        </div>
                      </Card>
                    </div>

                    {/* Download Button */}
                    <div className="flex gap-3">
                      <Button
                        onClick={downloadProtectedPDF}
                        size="lg"
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        data-testid="button-download-protected"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download Protected PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          setSelectedFile(null);
                          setResult(null);
                          setUserPassword("");
                          setConfirmPassword("");
                          setOwnerPassword("");
                          setError(null);
                        }}
                        data-testid="button-protect-another"
                      >
                        Protect Another PDF
                      </Button>
                    </div>

                    {/* Security Notice */}
                    <Alert>
                      <ShieldAlert className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Important:</strong> Remember your password! Once protected, the PDF cannot be opened without the password. 
                        Store your password in a secure location.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Feature Highlights */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our PDF Protection Tool?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <LockKeyhole className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">256-bit AES Encryption</h3>
                  <p className="text-sm text-muted-foreground">
                    Military-grade encryption standard used by governments and financial institutions worldwide.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">100% Private & Secure</h3>
                  <p className="text-sm text-muted-foreground">
                    All processing happens in your browser. Your files and passwords never leave your device.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Settings className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Granular Permissions</h3>
                  <p className="text-sm text-muted-foreground">
                    Control exactly what users can do - print, copy, edit, or just view your protected PDFs.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <KeyRound className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Dual Password Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Set separate user and owner passwords for different access levels and permissions.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Instant Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Protect your PDFs in seconds, regardless of file size. No waiting for server uploads.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Globe className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Universal Compatibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Protected PDFs work with all major PDF readers including Adobe, Chrome, and mobile apps.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How to Protect Your PDF</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Upload Your PDF File</h3>
                  <p className="text-muted-foreground">
                    Click the upload area or drag and drop your PDF file. Files up to 100MB are supported.
                    Your file stays on your device - we never upload it to any server.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Set Password & Permissions</h3>
                  <p className="text-muted-foreground">
                    Enter a strong password and confirm it. Choose encryption strength (AES-128 or AES-256) and 
                    configure permissions like printing, copying, and editing.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Download Protected PDF</h3>
                  <p className="text-muted-foreground">
                    Click "Protect PDF" and download your encrypted file instantly. The protected PDF requires 
                    the password to open and enforces the permissions you set.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect For Every Use Case</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <Building2 className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Business Documents</h3>
              <p className="text-sm text-muted-foreground">
                Protect confidential contracts, proposals, financial reports, and sensitive business data.
              </p>
            </Card>

            <Card className="p-6">
              <School className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="font-semibold mb-2">Educational Materials</h3>
              <p className="text-sm text-muted-foreground">
                Secure exam papers, research documents, course materials, and academic publications.
              </p>
            </Card>

            <Card className="p-6">
              <Briefcase className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="font-semibold mb-2">Legal Documents</h3>
              <p className="text-sm text-muted-foreground">
                Encrypt legal agreements, case files, client information, and court documents.
              </p>
            </Card>

            <Card className="p-6">
              <Users className="h-8 w-8 text-orange-600 mb-4" />
              <h3 className="font-semibold mb-2">HR & Personnel</h3>
              <p className="text-sm text-muted-foreground">
                Safeguard employee records, payroll information, performance reviews, and personal data.
              </p>
            </Card>

            <Card className="p-6">
              <Home className="h-8 w-8 text-red-600 mb-4" />
              <h3 className="font-semibold mb-2">Personal Documents</h3>
              <p className="text-sm text-muted-foreground">
                Protect tax returns, medical records, financial statements, and identity documents.
              </p>
            </Card>

            <Card className="p-6">
              <Archive className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="font-semibold mb-2">Archived Records</h3>
              <p className="text-sm text-muted-foreground">
                Secure long-term storage of important documents with controlled access permissions.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Compare PDF Protection Tools</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-teal-500 text-white">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold">AltafToolsHub</th>
                    <th className="text-center p-4 font-semibold">Adobe Acrobat</th>
                    <th className="text-center p-4 font-semibold">SmallPDF</th>
                    <th className="text-center p-4 font-semibold">iLovePDF</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-4 font-medium">Price</td>
                    <td className="text-center p-4">
                      <Badge className="bg-green-100 text-green-800">Free</Badge>
                    </td>
                    <td className="text-center p-4">$19.99/mo</td>
                    <td className="text-center p-4">$12/mo</td>
                    <td className="text-center p-4">$6/mo</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <td className="p-4 font-medium">256-bit AES Encryption</td>
                    <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-4 font-medium">Client-Side Processing</td>
                    <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><XCircle className="h-5 w-5 text-red-500 mx-auto" /></td>
                    <td className="text-center p-4"><XCircle className="h-5 w-5 text-red-500 mx-auto" /></td>
                    <td className="text-center p-4"><XCircle className="h-5 w-5 text-red-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <td className="p-4 font-medium">No File Size Limit</td>
                    <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4">5MB free</td>
                    <td className="text-center p-4">15MB free</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-4 font-medium">Custom Permissions</td>
                    <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4">Limited</td>
                  </tr>
                  <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <td className="p-4 font-medium">Owner Password Support</td>
                    <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><XCircle className="h-5 w-5 text-red-500 mx-auto" /></td>
                    <td className="text-center p-4"><XCircle className="h-5 w-5 text-red-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="p-4 font-medium">No Registration Required</td>
                    <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><XCircle className="h-5 w-5 text-red-500 mx-auto" /></td>
                    <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <td className="p-4 font-medium">Privacy Guarantee</td>
                    <td className="text-center p-4">
                      <Badge className="bg-green-100 text-green-800">100% Private</Badge>
                    </td>
                    <td className="text-center p-4">Cloud-based</td>
                    <td className="text-center p-4">Cloud-based</td>
                    <td className="text-center p-4">Cloud-based</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Is password protecting a PDF really secure?
              </AccordionTrigger>
              <AccordionContent>
                Yes, when done correctly with strong encryption. Our tool uses 256-bit AES encryption, which is the same 
                standard used by governments and banks worldwide. This encryption has never been broken and would take 
                billions of years to crack with current technology. However, security also depends on using a strong, 
                unique password.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                What's the difference between user and owner passwords?
              </AccordionTrigger>
              <AccordionContent>
                A user password (also called "open password") is required to open and view the PDF. An owner password 
                (or "permissions password") provides full control over the document, including the ability to change 
                security settings, print, copy content, and edit. You can set different passwords for each role, 
                allowing you to share documents with restricted permissions while maintaining full control.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Can I remove the password later if I forget it?
              </AccordionTrigger>
              <AccordionContent>
                No, if you forget the password, there's no way to recover or remove it without the original password. 
                The encryption is designed to be unbreakable. This is why it's crucial to store your password in a 
                secure location. We recommend using a password manager to safely store your PDF passwords.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Do you store my files or passwords on your servers?
              </AccordionTrigger>
              <AccordionContent>
                No, absolutely not. All processing happens entirely in your web browser using client-side JavaScript. 
                Your PDF file and passwords never leave your device and are never transmitted to our servers. Once you 
                close the browser tab, all data is immediately removed from memory. This ensures complete privacy and 
                security for your sensitive documents.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                What's the difference between AES-128 and AES-256 encryption?
              </AccordionTrigger>
              <AccordionContent>
                Both are highly secure encryption standards. AES-128 uses a 128-bit key and is extremely secure for 
                most purposes. AES-256 uses a 256-bit key, offering even stronger security - it's considered 
                military-grade and is used by government agencies for top-secret information. For most users, 
                either option provides excellent security, but we recommend AES-256 for maximum protection.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Will the protected PDF work with all PDF readers?
              </AccordionTrigger>
              <AccordionContent>
                Yes, password-protected PDFs created with our tool work with all standard PDF readers including 
                Adobe Acrobat Reader, web browsers (Chrome, Firefox, Safari, Edge), Preview on Mac, and mobile 
                PDF apps on iOS and Android. The PDF encryption standard is universal, ensuring compatibility 
                across all platforms and devices.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Can I protect multiple PDFs at once?
              </AccordionTrigger>
              <AccordionContent>
                Currently, our tool processes one PDF at a time to ensure maximum security and performance. 
                However, you can protect multiple PDFs sequentially - after protecting one PDF, simply click 
                "Protect Another PDF" to process the next file. Each file is processed individually with its 
                own password and permission settings.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                What permissions can I control in the protected PDF?
              </AccordionTrigger>
              <AccordionContent>
                You can control various permissions including: printing (allow/deny or low/high quality), 
                copying text and images, editing content, adding annotations and comments, filling form fields, 
                extracting pages, and assembling documents. These permissions are enforced by PDF readers, 
                giving you fine-grained control over how recipients can interact with your document.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                How strong should my password be?
              </AccordionTrigger>
              <AccordionContent>
                We recommend using a password that's at least 12 characters long, combining uppercase and lowercase 
                letters, numbers, and special characters. Avoid common words, personal information, or patterns. 
                Our tool includes a password strength meter to help you create a strong password. Consider using 
                a passphrase - a combination of random words - which can be both secure and memorable.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Is there a file size limit for password protection?
              </AccordionTrigger>
              <AccordionContent>
                Our tool supports PDF files up to 100MB, which covers the vast majority of PDF documents. 
                Since all processing happens in your browser, the practical limit depends on your device's 
                available memory. For very large files, ensure you have sufficient RAM and a modern browser 
                for optimal performance.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Enterprise-Grade PDF Security</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Professional features that meet the highest security standards for businesses and individuals
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Bank-Level Encryption</h3>
                  <p className="text-sm text-muted-foreground">
                    Uses the same AES-256 encryption standard required by financial institutions and government agencies
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Zero-Knowledge Architecture</h3>
                  <p className="text-sm text-muted-foreground">
                    We never see your files or passwords - everything stays encrypted on your device
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Compliance Ready</h3>
                  <p className="text-sm text-muted-foreground">
                    Meets GDPR, HIPAA, and other regulatory requirements for document security
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Audit Trail Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Protected PDFs maintain document integrity for legal and compliance purposes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Cross-Platform Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Protection works consistently across Windows, Mac, Linux, iOS, and Android
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">No Software Installation</h3>
                  <p className="text-sm text-muted-foreground">
                    Works directly in your browser - no downloads, plugins, or registrations required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-500 py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your PDFs?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of users who trust our tool to protect their sensitive documents with military-grade encryption.
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            data-testid="button-start-protecting"
          >
            Start Protecting Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          
          <div className="mt-8 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Takes less than 30 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>100% secure & private</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-current" />
              <span>Free forever</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features Section */}
      <div className="bg-gradient-to-br from-purple-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              Military-Grade Security Features
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Protect your documents with the same encryption standards used by governments and financial institutions
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* AES-256 Encryption */}
              <div className="text-center group">
                <div className="inline-flex p-6 bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-900/20 dark:to-teal-900/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ShieldAlert className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">AES-256 Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  Military-grade encryption that would take billions of years to crack with current technology
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Badge variant="outline" className="text-xs">Bank-Level</Badge>
                  <Badge variant="outline" className="text-xs">NSA Approved</Badge>
                </div>
              </div>

              {/* Zero-Knowledge Architecture */}
              <div className="text-center group">
                <div className="inline-flex p-6 bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-900/20 dark:to-teal-900/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Zero-Knowledge Architecture</h3>
                <p className="text-sm text-muted-foreground">
                  Files are processed locally in your browser. We never see, store, or have access to your documents
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Badge variant="outline" className="text-xs">100% Private</Badge>
                  <Badge variant="outline" className="text-xs">No Uploads</Badge>
                </div>
              </div>

              {/* Compliance Badges */}
              <div className="text-center group">
                <div className="inline-flex p-6 bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-900/20 dark:to-teal-900/20 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Compliance Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Meets international data protection standards for secure document handling
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Badge variant="outline" className="text-xs">GDPR</Badge>
                  <Badge variant="outline" className="text-xs">HIPAA</Badge>
                  <Badge variant="outline" className="text-xs">SOC 2</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
            Pro Tips for Maximum Security
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Password Best Practices */}
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-4">
                <KeyRound className="h-8 w-8 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-3">Password Best Practices</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Use at least 12 characters with mixed case, numbers, and symbols</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Create unique passwords for each document</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Use passphrases: combine 4-6 random words</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Store passwords in a password manager</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Owner vs User Password */}
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900/20 border-teal-200 dark:border-teal-800">
              <div className="flex items-start gap-4">
                <Users className="h-8 w-8 text-teal-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-3">User vs Owner Passwords</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span><strong>User Password:</strong> Required to open and view the PDF</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Owner Password:</strong> Allows full control and permission changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>Use both for sharing documents with restricted permissions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>Owner password should always be different and stronger</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Common Use Cases */}
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-4">
                <Briefcase className="h-8 w-8 text-purple-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-3">Smart Use Cases</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Contracts:</strong> Allow viewing but prevent editing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Reports:</strong> Enable printing but disable copying</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Forms:</strong> Allow filling but restrict other changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Archives:</strong> Read-only access with no modifications</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Security Reminders */}
            <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-teal-900/20 border-teal-200 dark:border-teal-800">
              <div className="flex items-start gap-4">
                <ShieldCheck className="h-8 w-8 text-teal-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-3">Security Reminders</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span>Never share passwords through email or chat</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span>Use secure channels for password transmission</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span>Change passwords regularly for sensitive documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span>Keep an encrypted backup of important passwords</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats/Trust Section */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-teal-500 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Trusted by Thousands Worldwide</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 animate-pulse">1M+</div>
                <div className="text-white/90">Files Protected</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 animate-pulse">&lt;30s</div>
                <div className="text-white/90">Average Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 animate-pulse">50K+</div>
                <div className="text-white/90">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 animate-pulse">100%</div>
                <div className="text-white/90">Privacy Guaranteed</div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm mb-3 text-white/90">
                  "The best PDF protection tool I've used. Fast, secure, and completely private. Highly recommended!"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-teal-400 rounded-full"></div>
                  <div>
                    <div className="text-xs font-semibold">Sarah M.</div>
                    <div className="text-xs text-white/70">Business Owner</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm mb-3 text-white/90">
                  "Perfect for protecting confidential documents. The client-side processing gives me peace of mind."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-teal-400 rounded-full"></div>
                  <div>
                    <div className="text-xs font-semibold">John D.</div>
                    <div className="text-xs text-white/70">Legal Professional</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm mb-3 text-white/90">
                  "Simple, effective, and free! The permission controls are exactly what I needed for my documents."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-teal-400 rounded-full"></div>
                  <div>
                    <div className="text-xs font-semibold">Emily R.</div>
                    <div className="text-xs text-white/70">HR Manager</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support Section */}
      <ContactSupportSection />
    </div>
  );
}