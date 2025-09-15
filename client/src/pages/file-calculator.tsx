import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useSEO, generateHowToSchema, generateSoftwareApplicationSchema } from "@/hooks/use-seo";
import { 
  Calculator, ArrowLeft, HardDrive, Download, Clock, 
  Wifi, Database, Server, Sparkles, Info, TrendingUp,
  FileText, Image, Music, Video, Archive, Code,
  ArrowUpDown, Copy, RefreshCw, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import ToolSEO from "@/components/seo/tool-seo";
import PrivacyNotice from "@/components/privacy-notice";

type SizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';
type SpeedUnit = 'Kbps' | 'Mbps' | 'Gbps';

interface Conversion {
  from: { value: number; unit: SizeUnit };
  to: { [key in SizeUnit]?: number };
}

interface DownloadEstimate {
  speed: number;
  speedUnit: SpeedUnit;
  fileSize: number;
  fileSizeUnit: SizeUnit;
  time: {
    seconds: number;
    formatted: string;
  };
}

interface StorageEstimate {
  totalSize: number;
  unit: SizeUnit;
  breakdown: {
    type: string;
    count: number;
    avgSize: number;
    totalSize: number;
  }[];
}

const SIZE_UNITS: SizeUnit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
const SPEED_UNITS: SpeedUnit[] = ['Kbps', 'Mbps', 'Gbps'];

const UNIT_MULTIPLIERS: { [key in SizeUnit]: number } = {
  'B': 1,
  'KB': 1024,
  'MB': 1024 * 1024,
  'GB': 1024 * 1024 * 1024,
  'TB': 1024 * 1024 * 1024 * 1024,
  'PB': 1024 * 1024 * 1024 * 1024 * 1024
};

const SPEED_MULTIPLIERS: { [key in SpeedUnit]: number } = {
  'Kbps': 1024 / 8, // Convert to bytes per second
  'Mbps': (1024 * 1024) / 8,
  'Gbps': (1024 * 1024 * 1024) / 8
};

const COMMON_SPEEDS = [
  { label: '2G Mobile', speed: 0.1, unit: 'Mbps' as SpeedUnit },
  { label: '3G Mobile', speed: 2, unit: 'Mbps' as SpeedUnit },
  { label: '4G LTE', speed: 25, unit: 'Mbps' as SpeedUnit },
  { label: '5G', speed: 100, unit: 'Mbps' as SpeedUnit },
  { label: 'DSL', speed: 10, unit: 'Mbps' as SpeedUnit },
  { label: 'Cable', speed: 50, unit: 'Mbps' as SpeedUnit },
  { label: 'Fiber', speed: 500, unit: 'Mbps' as SpeedUnit },
  { label: 'Gigabit', speed: 1, unit: 'Gbps' as SpeedUnit }
];

const FILE_TYPES = [
  { type: 'Documents', icon: FileText, avgSize: 100, unit: 'KB' as SizeUnit, examples: 'PDF, DOC, TXT' },
  { type: 'Images', icon: Image, avgSize: 2, unit: 'MB' as SizeUnit, examples: 'JPG, PNG, GIF' },
  { type: 'Music', icon: Music, avgSize: 8, unit: 'MB' as SizeUnit, examples: 'MP3, AAC, FLAC' },
  { type: 'Videos', icon: Video, avgSize: 700, unit: 'MB' as SizeUnit, examples: 'MP4, AVI, MKV' },
  { type: '4K Videos', icon: Video, avgSize: 4, unit: 'GB' as SizeUnit, examples: 'Ultra HD MP4' },
  { type: 'Archives', icon: Archive, avgSize: 50, unit: 'MB' as SizeUnit, examples: 'ZIP, RAR, 7Z' },
  { type: 'Code Projects', icon: Code, avgSize: 20, unit: 'MB' as SizeUnit, examples: 'Git repos' }
];

export default function FileCalculator() {
  const [activeTab, setActiveTab] = useState("converter");
  
  // Converter state
  const [convertValue, setConvertValue] = useState("1024");
  const [convertFromUnit, setConvertFromUnit] = useState<SizeUnit>("MB");
  const [conversion, setConversion] = useState<Conversion | null>(null);
  
  // Download calculator state
  const [downloadSize, setDownloadSize] = useState("100");
  const [downloadSizeUnit, setDownloadSizeUnit] = useState<SizeUnit>("MB");
  const [downloadSpeed, setDownloadSpeed] = useState("25");
  const [downloadSpeedUnit, setDownloadSpeedUnit] = useState<SpeedUnit>("Mbps");
  const [downloadEstimate, setDownloadEstimate] = useState<DownloadEstimate | null>(null);
  
  // Storage calculator state
  const [storageItems, setStorageItems] = useState([
    { type: 'Documents', count: 100 },
    { type: 'Images', count: 500 },
    { type: 'Music', count: 200 }
  ]);
  const [storageEstimate, setStorageEstimate] = useState<StorageEstimate | null>(null);
  
  const { toast } = useToast();

  // SEO structured data
  const howToSchema = generateHowToSchema({
    name: "How to Calculate File Sizes and Download Times",
    description: "Convert between file size units and estimate download times",
    totalTime: "PT10S",
    steps: [
      { name: "Enter Value", text: "Input the file size or value to convert" },
      { name: "Select Units", text: "Choose the unit to convert from and to" },
      { name: "View Results", text: "See instant conversions and calculations" },
      { name: "Copy Values", text: "Copy results for use in other applications" }
    ]
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: "File Size Calculator - AltafToolsHub",
    description: "File size converter, download time calculator, and storage estimator. Convert between KB, MB, GB and more.",
    applicationCategory: "UtilitiesApplication",
    url: "https://www.altaftoolshub.com/file-calculator",
    aggregateRating: { ratingValue: 4.7, ratingCount: 456, bestRating: 5 },
    featureList: [
      "Convert between all file size units",
      "Calculate download times",
      "Estimate storage requirements",
      "Common connection speed presets",
      "File type size estimates",
      "Real-time calculations"
    ]
  });

  useSEO({
    title: "File Size Calculator - Convert Units & Download Time | AltafToolsHub",
    description: "Free file size calculator and converter. Convert between KB, MB, GB, TB. Calculate download times and storage requirements. No ads, instant results.",
    path: "/file-calculator",
    keywords: "file size calculator, kb to mb converter, mb to gb, download time calculator, storage calculator, file size converter, data unit converter",
    structuredData: [howToSchema, softwareSchema],
    ogImage: "https://www.altaftoolshub.com/og-file-calculator.png"
  });

  // Convert file sizes
  useEffect(() => {
    const value = parseFloat(convertValue);
    if (isNaN(value) || value < 0) {
      setConversion(null);
      return;
    }

    const bytesValue = value * UNIT_MULTIPLIERS[convertFromUnit];
    const converted: { [key in SizeUnit]?: number } = {};
    
    SIZE_UNITS.forEach(unit => {
      converted[unit] = bytesValue / UNIT_MULTIPLIERS[unit];
    });

    setConversion({
      from: { value, unit: convertFromUnit },
      to: converted
    });
  }, [convertValue, convertFromUnit]);

  // Calculate download time
  useEffect(() => {
    const size = parseFloat(downloadSize);
    const speed = parseFloat(downloadSpeed);
    
    if (isNaN(size) || isNaN(speed) || size <= 0 || speed <= 0) {
      setDownloadEstimate(null);
      return;
    }

    const bytesSize = size * UNIT_MULTIPLIERS[downloadSizeUnit];
    const bytesPerSecond = speed * SPEED_MULTIPLIERS[downloadSpeedUnit];
    const seconds = bytesSize / bytesPerSecond;
    
    setDownloadEstimate({
      speed,
      speedUnit: downloadSpeedUnit,
      fileSize: size,
      fileSizeUnit: downloadSizeUnit,
      time: {
        seconds,
        formatted: formatTime(seconds)
      }
    });
  }, [downloadSize, downloadSizeUnit, downloadSpeed, downloadSpeedUnit]);

  // Calculate storage requirements
  useEffect(() => {
    let totalBytes = 0;
    const breakdown = storageItems.map(item => {
      const fileType = FILE_TYPES.find(t => t.type === item.type);
      if (!fileType) return null;
      
      const avgSizeBytes = fileType.avgSize * UNIT_MULTIPLIERS[fileType.unit];
      const totalSizeBytes = avgSizeBytes * item.count;
      totalBytes += totalSizeBytes;
      
      return {
        type: item.type,
        count: item.count,
        avgSize: fileType.avgSize,
        totalSize: totalSizeBytes
      };
    }).filter(Boolean) as StorageEstimate['breakdown'];

    // Determine best unit for total
    let bestUnit: SizeUnit = 'B';
    for (const unit of SIZE_UNITS.slice().reverse()) {
      const inUnit = totalBytes / UNIT_MULTIPLIERS[unit];
      if (inUnit >= 1) {
        bestUnit = unit;
        break;
      }
    }

    setStorageEstimate({
      totalSize: totalBytes / UNIT_MULTIPLIERS[bestUnit],
      unit: bestUnit,
      breakdown
    });
  }, [storageItems]);

  const formatTime = (seconds: number): string => {
    if (seconds < 1) return 'Less than 1 second';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      const remainingHours = hours % 24;
      return `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
    }
    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    }
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  const formatNumber = (num: number): string => {
    if (num < 0.001) return num.toExponential(2);
    if (num < 1) return num.toFixed(6);
    if (num < 10) return num.toFixed(3);
    if (num < 100) return num.toFixed(2);
    if (num < 1000) return num.toFixed(1);
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Value copied to clipboard.",
      });
    } catch {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const addStorageItem = (type: string) => {
    if (storageItems.find(item => item.type === type)) {
      toast({
        title: "Already Added",
        description: `${type} is already in your storage calculation.`,
        variant: "destructive"
      });
      return;
    }
    setStorageItems([...storageItems, { type, count: 100 }]);
  };

  const updateStorageItem = (index: number, count: number) => {
    const updated = [...storageItems];
    updated[index].count = count;
    setStorageItems(updated);
  };

  const removeStorageItem = (index: number) => {
    setStorageItems(storageItems.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen pattern-bg">
      <ToolSEO 
        toolName="File Size Calculator"
        description="Convert file sizes and calculate download times"
        category="UtilitiesApplication"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs items={[{ name: "File Calculator", url: "/file-calculator" }]} />
        
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => {
              const toolsSection = document.getElementById('tools-section');
              if (toolsSection) {
                window.history.pushState({}, '', '/');
                setTimeout(() => {
                  toolsSection.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold">File Size Calculator</h1>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Convert between file size units, calculate download times, and estimate storage requirements. 
            All calculations happen instantly in your browser.
          </p>
        </div>

        <PrivacyNotice />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="converter" data-testid="tab-converter">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Converter
            </TabsTrigger>
            <TabsTrigger value="download" data-testid="tab-download">
              <Download className="w-4 h-4 mr-2" />
              Download Time
            </TabsTrigger>
            <TabsTrigger value="storage" data-testid="tab-storage">
              <Database className="w-4 h-4 mr-2" />
              Storage
            </TabsTrigger>
          </TabsList>

          {/* Unit Converter Tab */}
          <TabsContent value="converter" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input */}
              <Card className="p-6">
                <Label className="text-lg font-semibold mb-4 block">Convert From</Label>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="convert-value">Value</Label>
                    <Input
                      id="convert-value"
                      type="number"
                      value={convertValue}
                      onChange={(e) => setConvertValue(e.target.value)}
                      placeholder="Enter value"
                      className="text-lg"
                      data-testid="input-convert-value"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="convert-unit">Unit</Label>
                    <Select value={convertFromUnit} onValueChange={(v) => setConvertFromUnit(v as SizeUnit)}>
                      <SelectTrigger id="convert-unit" data-testid="select-convert-unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SIZE_UNITS.map(unit => (
                          <SelectItem key={unit} value={unit}>
                            {unit} ({unit === 'B' ? 'Bytes' : `${unit.replace('B', '')}bytes`})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Alert className="border-primary/20 bg-primary/5">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Using binary (1024-based) calculations for accurate computer storage values
                    </AlertDescription>
                  </Alert>
                </div>
              </Card>

              {/* Results */}
              <Card className="p-6">
                <Label className="text-lg font-semibold mb-4 block">Converted Values</Label>
                
                {conversion ? (
                  <div className="space-y-3">
                    {SIZE_UNITS.map(unit => {
                      const value = conversion.to[unit];
                      if (value === undefined) return null;
                      
                      const isOriginal = unit === convertFromUnit;
                      
                      return (
                        <div 
                          key={unit}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg",
                            isOriginal ? "bg-primary/10 border border-primary/20" : "bg-muted"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <HardDrive className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {unit === 'B' ? 'Bytes' : `${unit.replace('B', '')}bytes`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-mono",
                              isOriginal && "font-bold text-primary"
                            )} data-testid={`text-converted-${unit}`}>
                              {formatNumber(value)} {unit}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(value.toString())}
                              data-testid={`button-copy-${unit}`}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Enter a value to see conversions</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Download Time Tab */}
          <TabsContent value="download" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input */}
              <Card className="p-6">
                <Label className="text-lg font-semibold mb-4 block">Download Parameters</Label>
                
                <div className="space-y-4">
                  <div>
                    <Label>File Size</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={downloadSize}
                        onChange={(e) => setDownloadSize(e.target.value)}
                        placeholder="Size"
                        className="flex-1"
                        data-testid="input-download-size"
                      />
                      <Select value={downloadSizeUnit} onValueChange={(v) => setDownloadSizeUnit(v as SizeUnit)}>
                        <SelectTrigger className="w-[100px]" data-testid="select-download-unit">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SIZE_UNITS.slice(1).map(unit => (
                            <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Connection Speed</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={downloadSpeed}
                        onChange={(e) => setDownloadSpeed(e.target.value)}
                        placeholder="Speed"
                        className="flex-1"
                        data-testid="input-download-speed"
                      />
                      <Select value={downloadSpeedUnit} onValueChange={(v) => setDownloadSpeedUnit(v as SpeedUnit)}>
                        <SelectTrigger className="w-[100px]" data-testid="select-speed-unit">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SPEED_UNITS.map(unit => (
                            <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Common Speeds</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {COMMON_SPEEDS.map(preset => (
                        <Button
                          key={preset.label}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDownloadSpeed(preset.speed.toString());
                            setDownloadSpeedUnit(preset.unit);
                          }}
                          className="justify-start"
                          data-testid={`button-speed-${preset.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Wifi className="w-3 h-3 mr-2" />
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Results */}
              <Card className="p-6">
                <Label className="text-lg font-semibold mb-4 block">Download Time</Label>
                
                {downloadEstimate ? (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <div className="text-3xl font-bold mb-2" data-testid="text-download-time">
                        {downloadEstimate.time.formatted}
                      </div>
                      <p className="text-muted-foreground">
                        To download {downloadEstimate.fileSize} {downloadEstimate.fileSizeUnit} 
                        at {downloadEstimate.speed} {downloadEstimate.speedUnit}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total seconds</span>
                          <span className="font-mono" data-testid="text-total-seconds">
                            {downloadEstimate.time.seconds.toFixed(2)}s
                          </span>
                        </div>
                      </div>
                      
                      <Alert className="border-yellow-500/20 bg-yellow-500/5">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Actual download times may vary based on network conditions, server speed, and other factors
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Download className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Enter file size and connection speed to calculate download time</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Storage Calculator Tab */}
          <TabsContent value="storage" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-lg font-semibold">Storage Items</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStorageItems([])}
                    disabled={storageItems.length === 0}
                    data-testid="button-clear-storage"
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="space-y-3 mb-4">
                  {storageItems.map((item, index) => {
                    const fileType = FILE_TYPES.find(t => t.type === item.type);
                    if (!fileType) return null;
                    const Icon = fileType.icon;
                    
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                        <Icon className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium">{item.type}</div>
                          <div className="text-xs text-muted-foreground">
                            ~{fileType.avgSize} {fileType.unit} each
                          </div>
                        </div>
                        <Input
                          type="number"
                          value={item.count}
                          onChange={(e) => updateStorageItem(index, parseInt(e.target.value) || 0)}
                          className="w-24"
                          min="0"
                          data-testid={`input-storage-${item.type.toLowerCase()}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStorageItem(index)}
                          data-testid={`button-remove-${item.type.toLowerCase()}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <Label className="mb-2 block">Add File Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {FILE_TYPES.filter(t => !storageItems.find(item => item.type === t.type)).map(fileType => {
                      const Icon = fileType.icon;
                      return (
                        <Button
                          key={fileType.type}
                          variant="outline"
                          size="sm"
                          onClick={() => addStorageItem(fileType.type)}
                          className="justify-start"
                          data-testid={`button-add-${fileType.type.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Icon className="w-3 h-3 mr-2" />
                          {fileType.type}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </Card>

              {/* Results */}
              <Card className="p-6">
                <Label className="text-lg font-semibold mb-4 block">Storage Requirements</Label>
                
                {storageEstimate && storageEstimate.breakdown.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-center py-6 rounded-lg bg-primary/5 border border-primary/20">
                      <Server className="w-12 h-12 mx-auto mb-4 text-primary" />
                      <div className="text-3xl font-bold mb-2" data-testid="text-total-storage">
                        {storageEstimate.totalSize.toFixed(2)} {storageEstimate.unit}
                      </div>
                      <p className="text-muted-foreground">Total storage required</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Breakdown</Label>
                      {storageEstimate.breakdown.map((item, index) => {
                        const fileType = FILE_TYPES.find(t => t.type === item.type);
                        if (!fileType) return null;
                        const Icon = fileType.icon;
                        
                        // Convert to best unit for display
                        let displaySize = item.totalSize;
                        let displayUnit: SizeUnit = 'B';
                        for (const unit of SIZE_UNITS.slice().reverse()) {
                          const inUnit = item.totalSize / UNIT_MULTIPLIERS[unit];
                          if (inUnit >= 1) {
                            displaySize = inUnit;
                            displayUnit = unit;
                            break;
                          }
                        }
                        
                        return (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                            <div className="flex items-center gap-3">
                              <Icon className="w-4 h-4 text-primary" />
                              <div>
                                <span className="font-medium">{item.type}</span>
                                <span className="text-sm text-muted-foreground ml-2">
                                  ({item.count} files)
                                </span>
                              </div>
                            </div>
                            <Badge variant="secondary">
                              {displaySize.toFixed(2)} {displayUnit}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>

                    <Alert className="border-blue-500/20 bg-blue-500/5">
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        Consider adding 20-30% extra space for future growth and system overhead
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Add file types to calculate storage requirements</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <ArrowUpDown className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Unit Conversion</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Convert between all standard file size units from Bytes to Petabytes.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Download Times</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Calculate how long files take to download at different connection speeds.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Storage Planning</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Estimate storage needs for collections of different file types.
            </p>
          </Card>
        </div>

        {/* Tips */}
        <Alert className="border-primary/20 bg-primary/5">
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            <strong>Pro Tip:</strong> When planning storage, remember that operating systems often show sizes differently. 
            Windows uses binary (1024-based) while macOS uses decimal (1000-based) calculations.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}