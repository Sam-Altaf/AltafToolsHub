import { useState, useRef, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";
import ToolSEO from "@/components/seo/tool-seo";
import { 
  Upload, FileText, Download, Trash2, PenTool, Type as TypeIcon, 
  Image as ImageIcon, Calendar, AlertCircle, CheckCircle2, ArrowLeft 
} from "lucide-react";
import { Link } from "wouter";

interface SignatureConfig {
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

export default function SignPDFPage() {
  useSEO({
    title: "Sign PDF Online - Add Digital Signatures to Documents | AltafToolsHub",
    description: "Add digital signatures to your PDF documents online. Draw, type, or upload signatures with date stamps. Free, secure, and browser-based PDF signing tool.",
    keywords: "sign pdf, digital signature, pdf signature, e-signature, sign documents online, add signature to pdf",
    path: "/sign-pdf"
  });

  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [signatures, setSignatures] = useState<SignatureConfig[]>([]);
  const [currentSignature, setCurrentSignature] = useState<Partial<SignatureConfig>>({
    type: 'draw',
    x: 50,
    y: 50,
    width: 200,
    height: 80,
    page: 0,
    addDate: true
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureFont, setSignatureFont] = useState<'cursive' | 'script' | 'elegant'>('cursive');
  const [typedSignature, setTypedSignature] = useState("");
  const [pageCount, setPageCount] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    setProgress(10);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPdfDoc(pdf);
      setPageCount(pdf.getPageCount());
      setProgress(100);
      
      toast({
        title: "PDF loaded successfully",
        description: `Ready to sign ${pdf.getPageCount()} page(s)`
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
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
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

  const addSignature = () => {
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
      type: currentSignature.type as 'draw' | 'type' | 'image',
      data: currentSignature.data || '',
      text: typedSignature,
      font: signatureFont,
      x: currentSignature.x || 50,
      y: currentSignature.y || 50,
      width: currentSignature.width || 200,
      height: currentSignature.height || 80,
      page: currentSignature.page || 0,
      addDate: currentSignature.addDate
    };

    setSignatures([...signatures, signature]);
    toast({
      title: "Signature added",
      description: `Signature added to page ${signature.page + 1}`
    });
  };

  const removeSignature = (index: number) => {
    setSignatures(signatures.filter((_, i) => i !== index));
    toast({
      title: "Signature removed",
      description: "Signature has been removed from the document"
    });
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
          const fontSize = 24;
          
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
          if (sig.data.includes('image/png')) {
            image = await pdfCopy.embedPng(imageBytes);
          } else {
            image = await pdfCopy.embedJpg(imageBytes);
          }

          const scaledDims = image.scale(sig.width / image.width);
          
          page.drawImage(image, {
            x: sig.x,
            y: pageHeight - sig.y - scaledDims.height,
            width: scaledDims.width,
            height: scaledDims.height
          });

          if (sig.addDate) {
            const dateFont = await pdfCopy.embedFont(StandardFonts.Helvetica);
            const dateText = `Signed: ${new Date().toLocaleDateString()}`;
            page.drawText(dateText, {
              x: sig.x,
              y: pageHeight - sig.y - scaledDims.height - 15,
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

  const getFontFamily = () => {
    switch (signatureFont) {
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <ToolSEO 
        toolName="Sign PDF - Add Digital Signatures"
        description="Add digital signatures to your PDF documents with draw, type, or upload options."
        category="SecurityApplication"
      />
      
      <div className="mb-6">
        <Link href="/" data-testid="link-home">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
          <PenTool className="h-5 w-5 text-white" />
          <span className="text-white font-medium text-sm">Smart Signature Processing</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Sign PDF Online
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Add digital signatures to your PDF documents. Draw, type, or upload your signature with date stamps for contracts and agreements.
        </p>
      </div>

      <Card className="p-6 mb-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>100% Private:</strong> All signatures are created and applied in your browser. Your documents never leave your device.
          </p>
        </div>
      </Card>

      <div className="grid gap-6">
        {!file ? (
          <Card className="p-8">
            <div className="text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
                data-testid="input-pdf-file"
              />
              <div 
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                data-testid="dropzone-upload"
              >
                <Upload className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Upload PDF to Sign</h3>
                <p className="text-muted-foreground mb-4">
                  Click to select a PDF document
                </p>
                <Button variant="outline" data-testid="button-select-pdf">
                  Select PDF File
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-indigo-600" />
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

            <div className="grid md:grid-cols-2 gap-6">
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
                        className="w-full bg-white cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
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
                          style={{ fontFamily: getFontFamily() }}
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
                      <Upload className="h-4 w-4 mr-2" />
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
                  <div>
                    <Label>Page Number (1-{pageCount})</Label>
                    <Input
                      type="number"
                      min={1}
                      max={pageCount}
                      value={(currentSignature.page || 0) + 1}
                      onChange={(e) => setCurrentSignature(prev => ({ ...prev, page: parseInt(e.target.value) - 1 }))}
                      data-testid="input-page-number"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>X Position</Label>
                      <Slider
                        value={[currentSignature.x || 50]}
                        onValueChange={([value]) => setCurrentSignature(prev => ({ ...prev, x: value }))}
                        min={0}
                        max={500}
                        step={5}
                        data-testid="slider-x-position"
                      />
                      <span className="text-xs text-muted-foreground">{currentSignature.x || 50}px</span>
                    </div>
                    <div>
                      <Label>Y Position</Label>
                      <Slider
                        value={[currentSignature.y || 50]}
                        onValueChange={([value]) => setCurrentSignature(prev => ({ ...prev, y: value }))}
                        min={0}
                        max={800}
                        step={5}
                        data-testid="slider-y-position"
                      />
                      <span className="text-xs text-muted-foreground">{currentSignature.y || 50}px</span>
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

                  <Button onClick={addSignature} className="w-full" data-testid="button-add-signature">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Add Signature to PDF
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Added Signatures</h3>
                
                {signatures.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <PenTool className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No signatures added yet</p>
                    <p className="text-sm">Create a signature and add it to your document</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {signatures.map((sig, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`signature-item-${index}`}>
                        <div className="flex items-center gap-3">
                          {sig.type === 'draw' && <PenTool className="h-5 w-5 text-indigo-600" />}
                          {sig.type === 'type' && <TypeIcon className="h-5 w-5 text-purple-600" />}
                          {sig.type === 'image' && <ImageIcon className="h-5 w-5 text-pink-600" />}
                          <div>
                            <p className="font-medium">
                              {sig.type === 'type' ? sig.text : `${sig.type.charAt(0).toUpperCase() + sig.type.slice(1)} signature`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Page {sig.page + 1} • Position ({sig.x}, {sig.y})
                              {sig.addDate && ' • With date'}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeSignature(index)}
                          data-testid={`button-remove-signature-${index}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {signatures.length > 0 && (
                  <div className="mt-6 space-y-4">
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
                      data-testid="button-download-signed"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {processing ? 'Signing PDF...' : 'Download Signed PDF'}
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
            <PenTool className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-semibold mb-2">Multiple Methods</h3>
          <p className="text-sm text-muted-foreground">
            Draw, type, or upload your signature image
          </p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold mb-2">Date Stamps</h3>
          <p className="text-sm text-muted-foreground">
            Automatically add signing date and time
          </p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-6 w-6 text-pink-600 dark:text-pink-400" />
          </div>
          <h3 className="font-semibold mb-2">Precise Placement</h3>
          <p className="text-sm text-muted-foreground">
            Position signatures exactly where needed
          </p>
        </Card>
      </div>
    </div>
  );
}
