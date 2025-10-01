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
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import ToolSEO from "@/components/seo/tool-seo";
import { toolFAQs } from "@/components/seo/tool-seo";
import FileUpload from "@/components/ui/file-upload";
import PrivacyNotice from "@/components/privacy-notice";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import { 
  Download, Trash2, PenTool, Type as TypeIcon, 
  Image as ImageIcon, Calendar, ZoomIn, ZoomOut, FileCheck
} from "lucide-react";

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
    description: "Add digital signatures to your PDF documents online. Draw, type, or upload signatures with date stamps. Free, secure, and browser-based PDF signing tool.",
    keywords: "sign pdf, digital signature, pdf signature, e-signature, sign documents online, add signature to pdf",
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
    addDate: true
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureFont, setSignatureFont] = useState<'cursive' | 'script' | 'elegant'>('cursive');
  const [typedSignature, setTypedSignature] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageScale, setPageScale] = useState(1);
  const [pageDimensions, setPageDimensions] = useState<PageDimensions>({ widthPts: 612, heightPts: 792, widthPx: 0, heightPx: 0 });
  const [draggingSignature, setDraggingSignature] = useState<string | null>(null);
  const [resizingSignature, setResizingSignature] = useState<{ id: string; corner: string } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (pdfJsDoc && pdfDoc && previewCanvasRef.current) {
      renderPage(currentPage);
    }
  }, [pdfJsDoc, pdfDoc, currentPage, pageScale, signatures]);

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

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      if (context) {
        signatures
          .filter(sig => sig.page === pageNum)
          .forEach(sig => {
            const x = (sig.x / widthPts) * viewport.width;
            const y = viewport.height - ((sig.y + sig.height) / heightPts) * viewport.height;
            const w = (sig.width / widthPts) * viewport.width;
            const h = (sig.height / heightPts) * viewport.height;

            context.strokeStyle = '#6366f1';
            context.lineWidth = 2;
            context.setLineDash([5, 5]);
            context.strokeRect(x, y, w, h);
            context.setLineDash([]);

            if (sig.type === 'draw' || sig.type === 'image') {
              const img = new Image();
              img.onload = () => {
                context.drawImage(img, x, y, w, h);
              };
              img.src = sig.data;
            } else if (sig.type === 'type') {
              context.font = `${h * 0.6}px ${getFontFamily(sig.font || 'cursive')}`;
              context.fillStyle = '#000';
              context.fillText(sig.text || '', x + 5, y + h * 0.7);
            }

            const handleSize = 10;
            context.fillStyle = '#6366f1';
            context.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
            context.fillRect(x + w - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
            context.fillRect(x - handleSize / 2, y + h - handleSize / 2, handleSize, handleSize);
            context.fillRect(x + w - handleSize / 2, y + h - handleSize / 2, handleSize, handleSize);
          });
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      toast({
        title: "Error rendering preview",
        description: "Failed to render PDF page. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setProgress(10);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      
      const pdf = await PDFDocument.load(arrayBuffer);
      setPdfDoc(pdf);
      const count = pdf.getPageCount();
      setPageCount(count);
      
      setProgress(50);
      
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfJs = await loadingTask.promise;
      setPdfJsDoc(pdfJs);
      
      setCurrentPage(0);
      setProgress(100);
      
      toast({
        title: "PDF loaded successfully",
        description: `Ready to sign ${count} page(s)`
      });
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast({
        title: "Error loading PDF",
        description: "Failed to load the PDF file. Please try another file.",
        variant: "destructive"
      });
      setFile(null);
      setPdfDoc(null);
      setPdfJsDoc(null);
    }
  };

  const getHandleAt = (sig: SignatureConfig, x: number, y: number): string | null => {
    const { widthPts, heightPts, widthPx, heightPx } = pageDimensions;
    const sigX = (sig.x / widthPts) * widthPx;
    const sigY = heightPx - ((sig.y + sig.height) / heightPts) * heightPx;
    const sigW = (sig.width / widthPts) * widthPx;
    const sigH = (sig.height / heightPts) * heightPx;
    
    const handleSize = 10;
    const tolerance = 5;
    
    if (Math.abs(x - sigX) < handleSize + tolerance && Math.abs(y - sigY) < handleSize + tolerance) {
      return 'tl';
    }
    if (Math.abs(x - (sigX + sigW)) < handleSize + tolerance && Math.abs(y - sigY) < handleSize + tolerance) {
      return 'tr';
    }
    if (Math.abs(x - sigX) < handleSize + tolerance && Math.abs(y - (sigY + sigH)) < handleSize + tolerance) {
      return 'bl';
    }
    if (Math.abs(x - (sigX + sigW)) < handleSize + tolerance && Math.abs(y - (sigY + sigH)) < handleSize + tolerance) {
      return 'br';
    }
    
    return null;
  };

  const handlePreviewPointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const clickedSig = signatures.find(sig => {
      if (sig.page !== currentPage) return false;
      
      const { widthPts, heightPts, widthPx, heightPx } = pageDimensions;
      const sigX = (sig.x / widthPts) * widthPx;
      const sigY = heightPx - ((sig.y + sig.height) / heightPts) * heightPx;
      const sigW = (sig.width / widthPts) * widthPx;
      const sigH = (sig.height / heightPts) * heightPx;

      return x >= sigX && x <= sigX + sigW && y >= sigY && y <= sigY + sigH;
    });

    if (clickedSig) {
      const handle = getHandleAt(clickedSig, x, y);
      
      if (handle) {
        setResizingSignature({ id: clickedSig.id, corner: handle });
        setDragOffset({ x, y });
      } else {
        const { widthPts, heightPts, widthPx, heightPx } = pageDimensions;
        const sigX = (clickedSig.x / widthPts) * widthPx;
        const sigY = heightPx - ((clickedSig.y + clickedSig.height) / heightPts) * heightPx;
        
        setDraggingSignature(clickedSig.id);
        setDragOffset({ x: x - sigX, y: y - sigY });
      }
    }
  };

  const handlePreviewPointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!draggingSignature && !resizingSignature) return;

    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault();
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const { widthPts, heightPts, widthPx, heightPx } = pageDimensions;

    if (draggingSignature) {
      setSignatures(prev => prev.map(sig => {
        if (sig.id === draggingSignature) {
          const newPxX = x - dragOffset.x;
          const newPxY = y - dragOffset.y;
          
          const newX = Math.max(0, Math.min(widthPts - sig.width, (newPxX / widthPx) * widthPts));
          const newY = Math.max(0, Math.min(heightPts - sig.height, ((heightPx - newPxY - ((sig.height / heightPts) * heightPx)) / heightPx) * heightPts));
          
          return { ...sig, x: newX, y: newY };
        }
        return sig;
      }));
    } else if (resizingSignature) {
      setSignatures(prev => prev.map(sig => {
        if (sig.id === resizingSignature.id) {
          const corner = resizingSignature.corner;
          
          const currentPxX = (sig.x / widthPts) * widthPx;
          const currentPxY = heightPx - ((sig.y + sig.height) / heightPts) * heightPx;
          const currentPxW = (sig.width / widthPts) * widthPx;
          const currentPxH = (sig.height / heightPts) * heightPx;
          
          let newPxX = currentPxX;
          let newPxY = currentPxY;
          let newPxW = currentPxW;
          let newPxH = currentPxH;
          
          if (corner === 'br') {
            newPxW = x - currentPxX;
            newPxH = y - currentPxY;
          } else if (corner === 'tr') {
            newPxW = x - currentPxX;
            newPxH = currentPxH + (currentPxY - y);
            newPxY = y;
          } else if (corner === 'bl') {
            newPxW = currentPxW + (currentPxX - x);
            newPxX = x;
            newPxH = y - currentPxY;
          } else if (corner === 'tl') {
            newPxW = currentPxW + (currentPxX - x);
            newPxH = currentPxH + (currentPxY - y);
            newPxX = x;
            newPxY = y;
          }
          
          const minW = 50;
          const minH = 20;
          if (newPxW < minW) newPxW = minW;
          if (newPxH < minH) newPxH = minH;
          
          const newX = (newPxX / widthPx) * widthPts;
          const newY = ((heightPx - newPxY - newPxH) / heightPx) * heightPts;
          const newWidth = (newPxW / widthPx) * widthPts;
          const newHeight = (newPxH / heightPx) * heightPts;
          
          const clampedX = Math.max(0, Math.min(widthPts - newWidth, newX));
          const clampedY = Math.max(0, Math.min(heightPts - newHeight, newY));
          const clampedWidth = Math.max(30, Math.min(widthPts - clampedX, newWidth));
          const clampedHeight = Math.max(15, Math.min(heightPts - clampedY, newHeight));
          
          return { ...sig, x: clampedX, y: clampedY, width: clampedWidth, height: clampedHeight };
        }
        return sig;
      }));
    }
  };

  const handlePreviewPointerUp = () => {
    setDraggingSignature(null);
    setResizingSignature(null);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault();
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault();
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setCurrentSignature(prev => ({ ...prev, data: dataUrl }));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setCurrentSignature(prev => ({ ...prev, data: '' }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCurrentSignature(prev => ({ ...prev, type: 'image', data: dataUrl }));
      toast({
        title: "Signature image uploaded",
        description: "You can now add it to your PDF"
      });
    };
    reader.readAsDataURL(file);
  };

  const addSignatureToPDF = () => {
    if (!pdfDoc) return;

    if (currentSignature.type === 'draw' && !currentSignature.data) {
      toast({
        title: "No signature drawn",
        description: "Please draw your signature first",
        variant: "destructive"
      });
      return;
    }

    if (currentSignature.type === 'type' && !typedSignature.trim()) {
      toast({
        title: "No signature text",
        description: "Please enter your signature text",
        variant: "destructive"
      });
      return;
    }

    if (currentSignature.type === 'image' && !currentSignature.data) {
      toast({
        title: "No signature image",
        description: "Please upload a signature image",
        variant: "destructive"
      });
      return;
    }

    const signature: SignatureConfig = {
      id: `sig-${Date.now()}-${Math.random()}`,
      type: currentSignature.type as 'draw' | 'type' | 'image',
      data: currentSignature.data || '',
      text: typedSignature,
      font: signatureFont,
      x: 50,
      y: 100,
      width: currentSignature.width || 200,
      height: currentSignature.height || 80,
      page: currentPage,
      addDate: currentSignature.addDate
    };

    setSignatures([...signatures, signature]);
    toast({
      title: "Signature added",
      description: `Signature added to page ${currentPage + 1}. Drag to reposition or resize.`
    });
  };

  const removeSignature = (id: string) => {
    setSignatures(signatures.filter(sig => sig.id !== id));
    toast({
      title: "Signature removed",
      description: "Signature has been removed from the document"
    });
  };

  const updateSignatureSize = (id: string, width: number, height: number) => {
    setSignatures(prev => prev.map(sig => 
      sig.id === id ? { ...sig, width: Math.max(30, width), height: Math.max(15, height) } : sig
    ));
  };

  const applySignatures = async () => {
    if (!pdfDoc || signatures.length === 0) {
      toast({
        title: "No signatures to apply",
        description: "Please add at least one signature",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    setProgress(0);

    try {
      const pdfCopy = await PDFDocument.load(await pdfDoc.save());
      const pages = pdfCopy.getPages();

      for (let i = 0; i < signatures.length; i++) {
        const sig = signatures[i];
        setProgress(((i + 1) / signatures.length) * 90);

        if (sig.page >= pages.length) continue;
        const page = pages[sig.page];
        const { height: pageHeight } = page.getSize();

        if (sig.type === 'type') {
          const font = await pdfCopy.embedFont(StandardFonts.TimesRomanItalic);
          const fontSize = sig.height * 0.6;
          
          page.drawText(sig.text || '', {
            x: sig.x,
            y: pageHeight - sig.y - fontSize,
            size: fontSize,
            font,
            color: rgb(0, 0, 0)
          });

          if (sig.addDate) {
            const dateFont = await pdfCopy.embedFont(StandardFonts.Helvetica);
            const dateText = `Signed: ${new Date().toLocaleDateString()}`;
            page.drawText(dateText, {
              x: sig.x,
              y: pageHeight - sig.y - fontSize - 20,
              size: 10,
              font: dateFont,
              color: rgb(0.3, 0.3, 0.3)
            });
          }
        } else if (sig.type === 'draw' || sig.type === 'image') {
          const response = await fetch(sig.data);
          const imageBytes = await response.arrayBuffer();
          
          let image;
          if (sig.data.includes('image/png') || sig.data.includes('data:image/png')) {
            image = await pdfCopy.embedPng(imageBytes);
          } else {
            image = await pdfCopy.embedJpg(imageBytes);
          }
          
          page.drawImage(image, {
            x: sig.x,
            y: pageHeight - sig.y - sig.height,
            width: sig.width,
            height: sig.height
          });

          if (sig.addDate) {
            const dateFont = await pdfCopy.embedFont(StandardFonts.Helvetica);
            const dateText = `Signed: ${new Date().toLocaleDateString()}`;
            page.drawText(dateText, {
              x: sig.x,
              y: pageHeight - sig.y - sig.height - 15,
              size: 10,
              font: dateFont,
              color: rgb(0.3, 0.3, 0.3)
            });
          }
        }
      }

      setProgress(95);
      const pdfBytes = await pdfCopy.save();
      setProgress(100);

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file ? file.name.replace('.pdf', '_signed.pdf') : 'signed_document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "PDF signed successfully",
        description: `Your signed PDF has been downloaded`
      });

      setProcessing(false);
      setProgress(0);
    } catch (error) {
      console.error('Error signing PDF:', error);
      toast({
        title: "Error signing PDF",
        description: "Failed to apply signatures. Please try again.",
        variant: "destructive"
      });
      setProcessing(false);
      setProgress(0);
    }
  };

  const getFontFamily = (fontType?: string) => {
    switch (fontType) {
      case 'cursive':
        return 'Brush Script MT, cursive';
      case 'script':
        return 'Lucida Handwriting, cursive';
      case 'elegant':
        return 'Edwardian Script ITC, cursive';
      default:
        return 'cursive';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ToolSEO 
        toolName="Sign PDF - Add Digital Signatures"
        description="Add digital signatures to your PDF documents with draw, type, or upload options."
        category="SecurityApplication"
        faqs={toolFAQs['sign-pdf']}
      />
      
      <Breadcrumbs 
        items={[
          { name: "PDF Tools", url: "/all-tools?category=pdf" },
          { name: "Sign PDF", url: "/sign-pdf" }
        ]}
      />

      <div className="text-center mb-8 mt-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
          <PenTool className="h-5 w-5 text-white" />
          <span className="text-white font-medium text-sm">Advanced Signature Placement</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Sign PDF Online
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Add digital signatures to your PDF documents with visual placement, drag-and-drop positioning, and customizable sizes. Works on desktop and mobile devices.
        </p>
      </div>

      <PrivacyNotice 
        message="100% Private: All signatures are created and applied in your browser. Your documents never leave your device. Visual e-signatures for easy document signing."
      />

      <div className="grid gap-6">
        {!file ? (
          <FileUpload
            accept="application/pdf"
            title="Upload PDF to Sign"
            description="Select a PDF document to add your digital signature"
            onFileSelect={handleFileSelect}
            data-testid="upload-pdf"
          />
        ) : (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-8 w-8 text-indigo-600" />
                  <div>
                    <h3 className="font-semibold" data-testid="text-filename">{file.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pageCount} page{pageCount !== 1 ? 's' : ''} • {signatures.length} signature{signatures.length !== 1 ? 's' : ''} added
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFile(null);
                    setPdfDoc(null);
                    setPdfJsDoc(null);
                    setSignatures([]);
                    setProgress(0);
                  }}
                  data-testid="button-remove-pdf"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">PDF Preview</h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPageScale(s => Math.max(0.5, s - 0.1))}
                      data-testid="button-zoom-out"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">{Math.round(pageScale * 100)}%</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setPageScale(s => Math.min(2, s + 0.1))}
                      data-testid="button-zoom-in"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-auto max-h-[600px] bg-gray-100 dark:bg-gray-900">
                  <canvas
                    ref={previewCanvasRef}
                    className="mx-auto cursor-move"
                    style={{ touchAction: 'none' }}
                    onMouseDown={handlePreviewPointerDown}
                    onMouseMove={handlePreviewPointerMove}
                    onMouseUp={handlePreviewPointerUp}
                    onMouseLeave={handlePreviewPointerUp}
                    onTouchStart={handlePreviewPointerDown}
                    onTouchMove={handlePreviewPointerMove}
                    onTouchEnd={handlePreviewPointerUp}
                    data-testid="canvas-pdf-preview"
                  />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
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
                    onClick={() => setCurrentPage(p => Math.min(pageCount - 1, p + 1))}
                    disabled={currentPage === pageCount - 1}
                    data-testid="button-next-page"
                  >
                    Next
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  💡 Tip: Drag signatures to reposition, resize using corner handles
                </p>
              </Card>

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
                        <img src={currentSignature.data} alt="Signature" className="max-w-full h-auto mx-auto" data-testid="img-signature-preview" />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="space-y-4 mt-6">
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

                  <Button onClick={addSignatureToPDF} className="w-full" data-testid="button-add-signature">
                    Add to Page {currentPage + 1}
                  </Button>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Signatures on This Page</h4>
                  {signatures.filter(sig => sig.page === currentPage).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No signatures on this page</p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {signatures.filter(sig => sig.page === currentPage).map((sig) => (
                        <div key={sig.id} className="flex items-center justify-between p-2 border rounded" data-testid={`signature-item-${sig.id}`}>
                          <div className="flex items-center gap-2">
                            {sig.type === 'draw' && <PenTool className="h-4 w-4" />}
                            {sig.type === 'type' && <TypeIcon className="h-4 w-4" />}
                            {sig.type === 'image' && <ImageIcon className="h-4 w-4" />}
                            <span className="text-sm truncate max-w-32">
                              {sig.type === 'type' ? sig.text : `${sig.type} signature`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={30}
                              max={500}
                              value={Math.round(sig.width)}
                              onChange={(e) => updateSignatureSize(sig.id, parseInt(e.target.value), sig.height)}
                              className="w-16 h-8 text-xs"
                              data-testid={`input-width-${sig.id}`}
                            />
                            <span className="text-xs">×</span>
                            <Input
                              type="number"
                              min={15}
                              max={300}
                              value={Math.round(sig.height)}
                              onChange={(e) => updateSignatureSize(sig.id, sig.width, parseInt(e.target.value))}
                              className="w-16 h-8 text-xs"
                              data-testid={`input-height-${sig.id}`}
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeSignature(sig.id)}
                              data-testid={`button-remove-signature-${sig.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {signatures.length > 0 && (
              <Card className="p-6">
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
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
