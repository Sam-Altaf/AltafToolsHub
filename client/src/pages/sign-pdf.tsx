import { useState, useRef, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import ToolSEO from "@/components/seo/tool-seo";
import FileUpload from "@/components/ui/file-upload";
import PrivacyNotice from "@/components/privacy-notice";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import { 
  Download, Trash2, PenTool, Type as TypeIcon, 
  Image as ImageIcon, Calendar, ZoomIn, ZoomOut, FileCheck,
  Settings, Upload, FileDown, Check, Info, Shield, Sparkles,
  Mail, Briefcase, School, Users, Globe2, FileText
} from "lucide-react";
import { WhyUseSection, UseCasesSection, ComparisonSection, HowItWorksSection, commonFeatures } from "@/components/seo/tool-features";
import { ToolFAQ, generateSignPDFFAQs } from "@/components/seo/tool-faq";
import { cn } from "@/lib/utils";

// Configure PDF.js worker - use local worker from node_modules
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
}

interface SignatureConfig {
  id: string;
  type: 'draw' | 'type' | 'image';
  data: string;
  text?: string;
  font?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  addDate?: boolean;
  applyToPages?: 'current' | 'all' | 'custom';
  customPages?: number[];
}

interface PageDimensions {
  widthPts: number;
  heightPts: number;
  widthPx: number;
  heightPx: number;
}

export default function SignPDFPage() {
  useSEO({
    title: "Sign PDF Online - Add Digital Signatures to Documents | AltafToolsHub",
    description: "Add digital signatures to your PDF documents online. Draw, type, or upload signatures with date stamps. Free, secure, and browser-based PDF signing tool with multi-page support.",
    keywords: "sign pdf, digital signature, pdf signature, e-signature, sign documents online, add signature to pdf, pdf signer",
    path: "/sign-pdf"
  });

  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pdfJsDoc, setPdfJsDoc] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [signatures, setSignatures] = useState<SignatureConfig[]>([]);
  const [currentSignature, setCurrentSignature] = useState<Partial<SignatureConfig>>({
    type: 'draw',
    width: 200,
    height: 80,
    page: 0,
    addDate: true,
    applyToPages: 'current'
  });
  const [customPageInput, setCustomPageInput] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureFont, setSignatureFont] = useState<'cursive' | 'script' | 'elegant'>('cursive');
  const [typedSignature, setTypedSignature] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageScale, setPageScale] = useState(1);
  const [pageDimensions, setPageDimensions] = useState<PageDimensions>({ widthPts: 612, heightPts: 792, widthPx: 0, heightPx: 0 });
  const [selectedSignatureId, setSelectedSignatureId] = useState<string | null>(null);
  const [draggingSignature, setDraggingSignature] = useState<string | null>(null);
  const [resizingSignature, setResizingSignature] = useState<{ id: string; corner: string } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const settingsSectionRef = useRef<HTMLDivElement>(null);
  const processingSectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (pdfJsDoc && pdfDoc && previewCanvasRef.current) {
      renderPage(currentPage);
    }
  }, [pdfJsDoc, pdfDoc, currentPage, pageScale, signatures, selectedSignatureId]);

  useEffect(() => {
    if (canvasRef.current && currentSignature.type === 'draw') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [currentSignature.type]);

  const scrollToSettings = () => {
    settingsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToProcessing = () => {
    processingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const renderPage = async (pageNum: number) => {
    if (!pdfJsDoc || !pdfDoc || !previewCanvasRef.current) return;

    try {
      const pdfLibPage = pdfDoc.getPage(pageNum);
      const { width: widthPts, height: heightPts } = pdfLibPage.getSize();
      
      const page = await pdfJsDoc.getPage(pageNum + 1);
      const viewport = page.getViewport({ scale: pageScale });
      
      const canvas = previewCanvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      setPageDimensions({ 
        widthPts, 
        heightPts, 
        widthPx: viewport.width, 
        heightPx: viewport.height 
      });
      
      if (context) {
        await page.render({ canvasContext: context, viewport }).promise;
        
        // Draw existing signatures for this page
        signatures.filter(sig => sig.page === pageNum).forEach(sig => {
          drawSignatureOnCanvas(context, sig, viewport.width, viewport.height, widthPts, heightPts);
        });
      }
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };

  const drawSignatureOnCanvas = (
    context: CanvasRenderingContext2D,
    sig: SignatureConfig,
    canvasWidth: number,
    canvasHeight: number,
    pdfWidth: number,
    pdfHeight: number
  ) => {
    const scaleX = canvasWidth / pdfWidth;
    const scaleY = canvasHeight / pdfHeight;
    
    const canvasX = sig.x * scaleX;
    const canvasY = sig.y * scaleY;
    const canvasW = sig.width * scaleX;
    const canvasH = sig.height * scaleY;
    
    const isSelected = selectedSignatureId === sig.id || draggingSignature === sig.id || resizingSignature?.id === sig.id;
    
    // Draw signature with border
    if (sig.type === 'image' || sig.type === 'draw') {
      const img = new Image();
      img.src = sig.data;
      img.onload = () => {
        context.save();
        context.strokeStyle = isSelected ? '#8b5cf6' : '#e5e7eb';
        context.lineWidth = 2;
        context.strokeRect(canvasX, canvasY, canvasW, canvasH);
        context.drawImage(img, canvasX, canvasY, canvasW, canvasH);
        
        // Draw resize handles
        if (isSelected) {
          drawResizeHandles(context, canvasX, canvasY, canvasW, canvasH);
        }
        context.restore();
      };
    } else if (sig.type === 'type') {
      context.save();
      context.strokeStyle = isSelected ? '#8b5cf6' : '#e5e7eb';
      context.lineWidth = 2;
      context.strokeRect(canvasX, canvasY, canvasW, canvasH);
      context.fillStyle = '#000';
      context.font = `${canvasH * 0.5}px ${getFontFamily(sig.font as any)}`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(sig.text || '', canvasX + canvasW / 2, canvasY + canvasH / 2);
      
      if (isSelected) {
        drawResizeHandles(context, canvasX, canvasY, canvasW, canvasH);
      }
      context.restore();
    }
  };

  const drawResizeHandles = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    const handleSize = 8;
    ctx.fillStyle = '#8b5cf6';
    
    // Top-left
    ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    // Top-right
    ctx.fillRect(x + w - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    // Bottom-left
    ctx.fillRect(x - handleSize / 2, y + h - handleSize / 2, handleSize, handleSize);
    // Bottom-right
    ctx.fillRect(x + w - handleSize / 2, y + h - handleSize / 2, handleSize, handleSize);
  };

  const handleFileSelect = async (selectedFile: File) => {
    if (!selectedFile.type.includes('pdf')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }

    try {
      setFile(selectedFile);
      const arrayBuffer = await selectedFile.arrayBuffer();
      
      const pdfLibDocument = await PDFDocument.load(arrayBuffer);
      const pdfJsDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      setPdfDoc(pdfLibDocument);
      setPdfJsDoc(pdfJsDocument);
      setPageCount(pdfLibDocument.getPageCount());
      setCurrentPage(0);
      
      toast({
        title: "PDF loaded successfully",
        description: `${pdfLibDocument.getPageCount()} pages loaded. Add your signatures below.`
      });

      setTimeout(scrollToSettings, 300);
    } catch (error) {
      toast({
        title: "Error loading PDF",
        description: "Could not load the PDF file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getFontFamily = (font: 'cursive' | 'script' | 'elegant') => {
    switch (font) {
      case 'cursive': return '"Dancing Script", cursive';
      case 'script': return '"Great Vibes", cursive';
      case 'elegant': return '"Pinyon Script", cursive';
      default: return '"Dancing Script", cursive';
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      setCurrentSignature(prev => ({ ...prev, data: dataUrl }));
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setCurrentSignature(prev => ({ ...prev, data: undefined }));
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCurrentSignature(prev => ({ ...prev, data: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getEventCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!previewCanvasRef.current) return null;
    const rect = previewCanvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getEventCoordinates(e);
    if (!coords) return;
    const { x: clickX, y: clickY } = coords;

    const scaleX = pageDimensions.widthPx / pageDimensions.widthPts;
    const scaleY = pageDimensions.heightPx / pageDimensions.heightPts;

    const clickedSig = signatures
      .filter(sig => sig.page === currentPage)
      .reverse()
      .find(sig => {
        const x = sig.x * scaleX;
        const y = sig.y * scaleY;
        const w = sig.width * scaleX;
        const h = sig.height * scaleY;

        // Check resize handles first
        const handleSize = 8;
        if (
          Math.abs(clickX - x) < handleSize && Math.abs(clickY - y) < handleSize ||
          Math.abs(clickX - (x + w)) < handleSize && Math.abs(clickY - y) < handleSize ||
          Math.abs(clickX - x) < handleSize && Math.abs(clickY - (y + h)) < handleSize ||
          Math.abs(clickX - (x + w)) < handleSize && Math.abs(clickY - (y + h)) < handleSize
        ) {
          let corner = '';
          if (Math.abs(clickX - x) < handleSize && Math.abs(clickY - y) < handleSize) corner = 'tl';
          else if (Math.abs(clickX - (x + w)) < handleSize && Math.abs(clickY - y) < handleSize) corner = 'tr';
          else if (Math.abs(clickX - x) < handleSize && Math.abs(clickY - (y + h)) < handleSize) corner = 'bl';
          else if (Math.abs(clickX - (x + w)) < handleSize && Math.abs(clickY - (y + h)) < handleSize) corner = 'br';
          
          setResizingSignature({ id: sig.id, corner });
          return true;
        }

        return clickX >= x && clickX <= x + w && clickY >= y && clickY <= y + h;
      });

    if (clickedSig) {
      const x = clickedSig.x * scaleX;
      const y = clickedSig.y * scaleY;
      setDragOffset({ x: clickX - x, y: clickY - y });
      setDraggingSignature(clickedSig.id);
      setSelectedSignatureId(clickedSig.id);
    } else {
      // Clicked on empty space, deselect
      setSelectedSignatureId(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getEventCoordinates(e);
    if (!coords) return;
    const { x: mouseX, y: mouseY } = coords;

    const scaleX = pageDimensions.widthPx / pageDimensions.widthPts;
    const scaleY = pageDimensions.heightPx / pageDimensions.heightPts;

    if (resizingSignature) {
      const sig = signatures.find(s => s.id === resizingSignature.id);
      if (!sig) return;

      const newSig = { ...sig };
      const corner = resizingSignature.corner;

      if (corner === 'br') {
        newSig.width = Math.max(30, (mouseX / scaleX) - sig.x);
        newSig.height = Math.max(15, (mouseY / scaleY) - sig.y);
      } else if (corner === 'bl') {
        const newWidth = Math.max(30, (sig.x + sig.width) - (mouseX / scaleX));
        newSig.x = (sig.x + sig.width) - newWidth;
        newSig.width = newWidth;
        newSig.height = Math.max(15, (mouseY / scaleY) - sig.y);
      } else if (corner === 'tr') {
        newSig.width = Math.max(30, (mouseX / scaleX) - sig.x);
        const newHeight = Math.max(15, (sig.y + sig.height) - (mouseY / scaleY));
        newSig.y = (sig.y + sig.height) - newHeight;
        newSig.height = newHeight;
      } else if (corner === 'tl') {
        const newWidth = Math.max(30, (sig.x + sig.width) - (mouseX / scaleX));
        const newHeight = Math.max(15, (sig.y + sig.height) - (mouseY / scaleY));
        newSig.x = (sig.x + sig.width) - newWidth;
        newSig.y = (sig.y + sig.height) - newHeight;
        newSig.width = newWidth;
        newSig.height = newHeight;
      }

      // Keep within bounds
      newSig.x = Math.max(0, Math.min(newSig.x, pageDimensions.widthPts - newSig.width));
      newSig.y = Math.max(0, Math.min(newSig.y, pageDimensions.heightPts - newSig.height));

      setSignatures(signatures.map(s => s.id === newSig.id ? newSig : s));
    } else if (draggingSignature) {
      const sig = signatures.find(s => s.id === draggingSignature);
      if (!sig) return;

      const newX = (mouseX - dragOffset.x) / scaleX;
      const newY = (mouseY - dragOffset.y) / scaleY;

      // Keep within bounds
      const boundedX = Math.max(0, Math.min(newX, pageDimensions.widthPts - sig.width));
      const boundedY = Math.max(0, Math.min(newY, pageDimensions.heightPts - sig.height));

      setSignatures(signatures.map(s => 
        s.id === draggingSignature 
          ? { ...s, x: boundedX, y: boundedY } 
          : s
      ));
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggingSignature(null);
    setResizingSignature(null);
  };

  const parseCustomPages = (input: string): number[] | null => {
    try {
      const pages: number[] = [];
      const parts = input.split(',').map(p => p.trim());
      
      for (const part of parts) {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(n => parseInt(n.trim()));
          if (isNaN(start) || isNaN(end) || start < 1 || end > pageCount || start > end) {
            return null;
          }
          for (let i = start; i <= end; i++) {
            pages.push(i - 1); // Convert to 0-indexed
          }
        } else {
          const pageNum = parseInt(part);
          if (isNaN(pageNum) || pageNum < 1 || pageNum > pageCount) {
            return null;
          }
          pages.push(pageNum - 1); // Convert to 0-indexed
        }
      }
      return [...new Set(pages)]; // Remove duplicates
    } catch {
      return null;
    }
  };

  const addSignatureToPDF = () => {
    if (!currentSignature.data && currentSignature.type !== 'type') {
      toast({
        title: "No signature",
        description: "Please create a signature first",
        variant: "destructive"
      });
      return;
    }

    if (currentSignature.type === 'type' && !typedSignature) {
      toast({
        title: "No signature text",
        description: "Please enter your signature text",
        variant: "destructive"
      });
      return;
    }

    const applyToPages = currentSignature.applyToPages || 'current';
    let pagesToApply: number[] = [currentPage];

    if (applyToPages === 'all') {
      pagesToApply = Array.from({ length: pageCount }, (_, i) => i);
    } else if (applyToPages === 'custom') {
      const parsed = parseCustomPages(customPageInput);
      if (!parsed || parsed.length === 0) {
        toast({
          title: "Invalid page range",
          description: "Please enter valid page numbers (e.g., 1, 3-5, 7)",
          variant: "destructive"
        });
        return;
      }
      pagesToApply = parsed;
    }

    const newSignatures: SignatureConfig[] = pagesToApply.map(pageNum => ({
      id: `${Date.now()}-${Math.random()}-${pageNum}`,
      type: currentSignature.type!,
      data: currentSignature.type === 'type' 
        ? '' 
        : currentSignature.data!,
      text: currentSignature.type === 'type' ? typedSignature : undefined,
      font: currentSignature.type === 'type' ? signatureFont : undefined,
      x: 50,
      y: 50,
      width: currentSignature.width || 200,
      height: currentSignature.height || 80,
      page: pageNum,
      addDate: currentSignature.addDate,
      applyToPages: currentSignature.applyToPages,
      customPages: applyToPages === 'custom' ? pagesToApply : undefined
    }));

    setSignatures([...signatures, ...newSignatures]);
    
    toast({
      title: "Signature added",
      description: applyToPages === 'all' 
        ? `Signature added to all ${pageCount} pages`
        : applyToPages === 'custom'
        ? `Signature added to ${pagesToApply.length} page(s)`
        : `Signature added to page ${currentPage + 1}`
    });
  };

  const removeSignature = (id: string) => {
    setSignatures(signatures.filter(sig => sig.id !== id));
  };

  const updateSignatureSize = (id: string, width: number, height: number) => {
    setSignatures(signatures.map(sig => 
      sig.id === id ? { ...sig, width: Math.max(30, width), height: Math.max(15, height) } : sig
    ));
  };

  const applySignatures = async () => {
    if (!pdfDoc || signatures.length === 0) return;

    setProcessing(true);
    setProgress(0);
    scrollToProcessing();

    try {
      const pdfDocCopy = await PDFDocument.load(await pdfDoc.save());
      const font = await pdfDocCopy.embedFont(StandardFonts.Helvetica);

      for (let i = 0; i < signatures.length; i++) {
        const sig = signatures[i];
        const page = pdfDocCopy.getPage(sig.page);
        const { height: pageHeight } = page.getSize();

        if (sig.type === 'draw' || sig.type === 'image') {
          const imageBytes = await fetch(sig.data).then(res => res.arrayBuffer());
          const image = sig.data.includes('png') 
            ? await pdfDocCopy.embedPng(imageBytes)
            : await pdfDocCopy.embedJpg(imageBytes);

          page.drawImage(image, {
            x: sig.x,
            y: pageHeight - sig.y - sig.height,
            width: sig.width,
            height: sig.height,
          });
        } else if (sig.type === 'type' && sig.text) {
          const fontSize = sig.height * 0.5;
          page.drawText(sig.text, {
            x: sig.x,
            y: pageHeight - sig.y - sig.height / 2,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
          });
        }

        if (sig.addDate) {
          const dateText = new Date().toLocaleDateString();
          page.drawText(dateText, {
            x: sig.x,
            y: pageHeight - sig.y - sig.height - 15,
            size: 8,
            font,
            color: rgb(0, 0, 0),
          });
        }

        setProgress(((i + 1) / signatures.length) * 100);
      }

      const pdfBytes = await pdfDocCopy.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file?.name.replace('.pdf', '_signed.pdf') || 'signed.pdf';
      a.click();

      toast({
        title: "Success!",
        description: `PDF signed with ${signatures.length} signature(s) and downloaded successfully`
      });

      setProcessing(false);
      setProgress(100);
    } catch (error) {
      toast({
        title: "Error signing PDF",
        description: "Could not apply signatures. Please try again.",
        variant: "destructive"
      });
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumbs
          items={[
            { name: "PDF Tools", url: "/all-tools#pdf" },
            { name: "Sign PDF", url: "/sign-pdf" }
          ]}
        />

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium mb-4">
            <PenTool className="h-4 w-4" />
            Advanced Digital Signatures
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Sign PDF Online
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Add digital signatures to your PDF documents with visual placement, drag-and-drop positioning, and customizable sizes. Apply signatures to single pages, all pages, or custom page ranges. Works on desktop and mobile devices.
          </p>
        </div>

        <PrivacyNotice message="100% Private: All signatures are created and applied in your browser. Your documents never leave your device. Visual e-signatures for easy document signing." />

        <div className="mb-8 max-w-4xl mx-auto">
          <FileUpload
            onFileSelect={handleFileSelect}
            accept=".pdf"
            maxSize={100 * 1024 * 1024}
            title="Upload PDF to Sign"
            description="Select or drag a PDF document to add your digital signature"
          />
        </div>

        {file && pdfDoc && (
          <>
            <div ref={settingsSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* PDF Preview */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">PDF Preview</h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPageScale(Math.max(0.5, pageScale - 0.1))}
                      data-testid="button-zoom-out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">{Math.round(pageScale * 100)}%</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPageScale(Math.min(2, pageScale + 0.1))}
                      data-testid="button-zoom-in"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-900 overflow-auto max-h-[600px]">
                  <canvas
                    ref={previewCanvasRef}
                    className="mx-auto cursor-move shadow-lg touch-none"
                    style={{ touchAction: 'none' }}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    onTouchStart={handleCanvasMouseDown}
                    onTouchMove={handleCanvasMouseMove}
                    onTouchEnd={handleCanvasMouseUp}
                    data-testid="canvas-pdf-preview"
                  />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    data-testid="button-prev-page"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage + 1} of {pageCount}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(pageCount - 1, currentPage + 1))}
                    disabled={currentPage === pageCount - 1}
                    data-testid="button-next-page"
                  >
                    Next
                  </Button>
                </div>

                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Click and drag signatures to reposition. Click corner handles to resize. Signatures stay within page boundaries.
                  </AlertDescription>
                </Alert>
              </Card>

              {/* Signature Creation */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Create Signature</h3>
                
                <Tabs value={currentSignature.type} onValueChange={(value) => setCurrentSignature(prev => ({ ...prev, type: value as 'draw' | 'type' | 'image' }))}>
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="draw" data-testid="tab-draw">
                      <PenTool className="h-4 w-4 mr-2" />
                      Draw
                    </TabsTrigger>
                    <TabsTrigger value="type" data-testid="tab-type">
                      <TypeIcon className="h-4 w-4 mr-2" />
                      Type
                    </TabsTrigger>
                    <TabsTrigger value="image" data-testid="tab-image">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Upload
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="draw" className="space-y-4">
                    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        width={400}
                        height={200}
                        className="w-full bg-white touch-none cursor-crosshair"
                        style={{ touchAction: 'none' }}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        data-testid="canvas-signature"
                      />
                    </div>
                    <Button onClick={clearCanvas} variant="outline" className="w-full" data-testid="button-clear-signature">
                      Clear Signature
                    </Button>
                  </TabsContent>

                  <TabsContent value="type" className="space-y-4">
                    <div>
                      <Label>Your Signature Text</Label>
                      <Input
                        value={typedSignature}
                        onChange={(e) => setTypedSignature(e.target.value)}
                        placeholder="Enter your name"
                        className="mb-4"
                        data-testid="input-signature-text"
                      />
                    </div>
                    
                    <div>
                      <Label>Signature Style</Label>
                      <Select value={signatureFont} onValueChange={(value: 'cursive' | 'script' | 'elegant') => setSignatureFont(value)}>
                        <SelectTrigger data-testid="select-signature-font">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cursive">Cursive</SelectItem>
                          <SelectItem value="script">Script</SelectItem>
                          <SelectItem value="elegant">Elegant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {typedSignature && (
                      <div className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                        <p 
                          style={{ fontFamily: getFontFamily(signatureFont) }}
                          className="text-3xl text-center text-black dark:text-white"
                          data-testid="text-signature-preview"
                        >
                          {typedSignature}
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      data-testid="input-signature-image"
                    />
                    <Button 
                      onClick={() => imageInputRef.current?.click()} 
                      variant="outline" 
                      className="w-full"
                      data-testid="button-upload-signature"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Upload Signature Image
                    </Button>
                    {currentSignature.data && currentSignature.type === 'image' && (
                      <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <img src={currentSignature.data} alt="Signature preview" width="400" height="160" className="max-w-full h-auto mx-auto" style={{ maxWidth: '100%', height: 'auto' }} data-testid="img-signature-preview" />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="space-y-4 mt-6">
                  {/* Apply to Pages */}
                  <div>
                    <Label className="mb-3 block">Apply Signature To</Label>
                    <RadioGroup 
                      value={currentSignature.applyToPages} 
                      onValueChange={(value: 'current' | 'all' | 'custom') => setCurrentSignature(prev => ({ ...prev, applyToPages: value }))}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="current" id="current" data-testid="radio-current-page" />
                        <Label htmlFor="current" className="font-normal cursor-pointer">
                          Current page only (Page {currentPage + 1})
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" data-testid="radio-all-pages" />
                        <Label htmlFor="all" className="font-normal cursor-pointer">
                          All pages ({pageCount} pages)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" data-testid="radio-custom-pages" />
                        <Label htmlFor="custom" className="font-normal cursor-pointer">
                          Custom pages
                        </Label>
                      </div>
                    </RadioGroup>

                    {currentSignature.applyToPages === 'custom' && (
                      <div className="mt-3">
                        <Input
                          value={customPageInput}
                          onChange={(e) => setCustomPageInput(e.target.value)}
                          placeholder="e.g., 1, 3-5, 7"
                          className="w-full"
                          data-testid="input-custom-pages"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Enter page numbers or ranges (e.g., 1, 3-5, 7)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Width (pts)</Label>
                      <Input
                        type="number"
                        min={30}
                        max={500}
                        value={currentSignature.width || 200}
                        onChange={(e) => setCurrentSignature(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                        data-testid="input-signature-width"
                      />
                    </div>
                    <div>
                      <Label>Height (pts)</Label>
                      <Input
                        type="number"
                        min={15}
                        max={300}
                        value={currentSignature.height || 80}
                        onChange={(e) => setCurrentSignature(prev => ({ ...prev, height: parseInt(e.target.value) }))}
                        data-testid="input-signature-height"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="addDate"
                      checked={currentSignature.addDate}
                      onChange={(e) => setCurrentSignature(prev => ({ ...prev, addDate: e.target.checked }))}
                      className="rounded"
                      data-testid="checkbox-add-date"
                    />
                    <Label htmlFor="addDate" className="flex items-center gap-2 cursor-pointer">
                      <Calendar className="h-4 w-4" />
                      Add date stamp
                    </Label>
                  </div>

                  <Button onClick={addSignatureToPDF} className="w-full" size="lg" data-testid="button-add-signature">
                    <Check className="h-5 w-5 mr-2" />
                    Add Signature
                  </Button>
                </div>

                {/* Signatures List */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Signatures on This Page</h4>
                  {signatures.filter(sig => sig.page === currentPage).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No signatures on this page</p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {signatures.filter(sig => sig.page === currentPage).map((sig) => (
                        <div key={sig.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800/50" data-testid={`signature-item-${sig.id}`}>
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {sig.type === 'draw' && <PenTool className="h-4 w-4 flex-shrink-0" />}
                            {sig.type === 'type' && <TypeIcon className="h-4 w-4 flex-shrink-0" />}
                            {sig.type === 'image' && <ImageIcon className="h-4 w-4 flex-shrink-0" />}
                            <span className="text-sm truncate">
                              {sig.type === 'type' ? sig.text : `${sig.type} signature`}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeSignature(sig.id)}
                            data-testid={`button-remove-signature-${sig.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Download Section */}
            {signatures.length > 0 && (
              <Card className="p-6" ref={processingSectionRef}>
                <div className="space-y-4">
                  {processing && (
                    <div>
                      <Progress value={progress} className="mb-2" />
                      <p className="text-sm text-center text-muted-foreground">
                        Applying signatures... {Math.round(progress)}%
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={applySignatures} 
                    disabled={processing || signatures.length === 0}
                    className="w-full"
                    size="lg"
                    data-testid="button-download-signed"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    {processing ? 'Signing PDF...' : `Download Signed PDF (${signatures.length} signature${signatures.length !== 1 ? 's' : ''})`}
                  </Button>

                  {!processing && signatures.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{signatures.length}</p>
                        <p className="text-xs text-muted-foreground">Total Signatures</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{new Set(signatures.map(s => s.page)).size}</p>
                        <p className="text-xs text-muted-foreground">Pages Signed</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{pageCount}</p>
                        <p className="text-xs text-muted-foreground">Total Pages</p>
                      </div>
                      <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">100%</p>
                        <p className="text-xs text-muted-foreground">Privacy</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      {/* SEO Content Sections */}
      <HowItWorksSection
        toolName="PDF Signer"
        steps={[
          {
            number: 1,
            title: "Upload Your PDF",
            description: "Select or drag your PDF document into the upload area. Files are processed locally in your browser.",
            icon: Upload
          },
          {
            number: 2,
            title: "Create & Position Signature",
            description: "Draw, type, or upload your signature. Drag to position and resize directly on the PDF preview. Choose to apply to current page, all pages, or custom page ranges.",
            icon: PenTool
          },
          {
            number: 3,
            title: "Download Signed PDF",
            description: "Get your signed PDF instantly. All signatures are embedded with optional date stamps.",
            icon: FileDown
          }
        ]}
      />

      <WhyUseSection
        toolName="PDF Signer"
        benefits={[
          "Create signatures by drawing, typing, or uploading images",
          "Visual drag-and-drop positioning with live PDF preview",
          "Interactive resizing with corner handles",
          "Apply signatures to single pages, all pages, or custom page ranges",
          "Add automatic date stamps to signatures",
          "Files never leave your device - 100% browser-based processing",
          "No registration, watermarks, or file limits",
          "Works on both desktop and mobile devices"
        ]}
        features={[
          commonFeatures.privacy,
          commonFeatures.speed,
          commonFeatures.free,
          {
            icon: Sparkles,
            title: "Multi-Page Support",
            description: "Apply signatures to multiple pages with custom page range selection."
          }
        ]}
      />

      <UseCasesSection
        useCases={[
          {
            title: "Business Contracts",
            description: "Sign business agreements, contracts, and legal documents digitally without printing.",
            icon: Briefcase,
            example: "Sign employment contracts, NDAs, and partnership agreements"
          },
          {
            title: "Academic Documents",
            description: "Sign student forms, recommendation letters, and academic submissions.",
            icon: School,
            example: "Sign permission forms, thesis submissions, and applications"
          },
          {
            title: "Email Attachments",
            description: "Quickly sign and return documents received via email.",
            icon: Mail,
            example: "Sign rental agreements, service contracts, and forms"
          },
          {
            title: "Government Forms",
            description: "Add digital signatures to tax forms, visa applications, and official documents.",
            icon: FileText,
            example: "Sign tax returns, permit applications, and declarations"
          },
          {
            title: "Team Approvals",
            description: "Sign project proposals, budget approvals, and team documents.",
            icon: Users,
            example: "Sign project charters, approval forms, and timesheets"
          },
          {
            title: "Remote Work",
            description: "Sign documents from anywhere without scanners or printers.",
            icon: Globe2,
            example: "Sign remote work agreements, expense reports, and policies"
          }
        ]}
      />

      <ComparisonSection
        toolName="PDF Signer"
        comparisons={[
          { feature: "File Privacy", ourTool: "Never leaves browser", others: "Uploaded to servers", highlight: true },
          { feature: "Signature Types", ourTool: "Draw, Type, Upload", others: "Type only", highlight: true },
          { feature: "Visual Positioning", ourTool: "Drag & drop with preview", others: "Fixed positions" },
          { feature: "Multi-Page Support", ourTool: "Single, All, Custom ranges", others: "All pages only", highlight: true },
          { feature: "Interactive Resize", ourTool: "Corner handles", others: "Fixed sizes" },
          { feature: "File Limits", ourTool: "Unlimited", others: "3-5 files/day" },
          { feature: "Registration Required", ourTool: false, others: true },
          { feature: "Watermarks", ourTool: false, others: "Free tier adds watermarks" },
          { feature: "Date Stamps", ourTool: true, others: "Premium only" },
          { feature: "Cost", ourTool: "Free forever", others: "$15-40/month" }
        ]}
      />

      <ToolFAQ 
        faqs={generateSignPDFFAQs()}
        toolName="PDF Signer"
        toolPath="/sign-pdf"
      />
    </div>
  );
}
