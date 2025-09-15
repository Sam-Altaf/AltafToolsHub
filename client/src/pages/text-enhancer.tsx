import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSEO, generateHowToSchema, generateSoftwareApplicationSchema } from "@/hooks/use-seo";
import { 
  analyzeText, 
  enhanceText, 
  checkGrammar, 
  checkSpelling 
} from "@/lib/text-enhancement";
import {
  FileText, Sparkles, Copy, Download, RefreshCw, Check, Info,
  ArrowLeft, BookOpen, Target, Lightbulb, AlertCircle, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import ToolSEO from "@/components/seo/tool-seo";
import PrivacyNotice from "@/components/privacy-notice";

interface ToneOptions {
  formal: boolean;
  casual: boolean;
  professional: boolean;
  friendly: boolean;
  concise: boolean;
  detailed: boolean;
}

export default function TextEnhancer() {
  const [inputText, setInputText] = useState("");
  const [enhancedText, setEnhancedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("enhance");
  const [analysis, setAnalysis] = useState<any>(null);
  const [grammarIssues, setGrammarIssues] = useState<string[]>([]);
  const [spellingErrors, setSpellingErrors] = useState<string[]>([]);
  
  const [toneOptions, setToneOptions] = useState<ToneOptions>({
    formal: false,
    casual: false,
    professional: false,
    friendly: false,
    concise: false,
    detailed: false
  });
  
  const { toast } = useToast();

  // SEO structured data
  const howToSchema = generateHowToSchema({
    name: "How to Enhance Text with AI",
    description: "Improve your writing with grammar checking, readability analysis, and tone adjustment",
    totalTime: "PT30S",
    steps: [
      { name: "Enter Text", text: "Paste or type your text in the input area" },
      { name: "Choose Options", text: "Select tone and enhancement preferences" },
      { name: "Analyze", text: "Click Analyze or Enhance to process your text" },
      { name: "Apply Changes", text: "Review suggestions and copy the improved text" }
    ]
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: "Text Enhancer - AltafToolsHub",
    description: "AI-powered text improvement tool with grammar checking, readability analysis, and tone adjustment. 100% browser-based processing.",
    applicationCategory: "UtilitiesApplication",
    url: "https://www.altaftoolshub.com/text-enhancer",
    aggregateRating: { ratingValue: 4.9, ratingCount: 2156, bestRating: 5 },
    featureList: [
      "Grammar and spelling check",
      "Readability analysis with Flesch score",
      "Tone adjustment (formal, casual, professional)",
      "Passive voice detection",
      "Word and sentence statistics",
      "Writing improvement suggestions",
      "100% client-side processing"
    ]
  });

  useSEO({
    title: "Text Enhancer - AI Writing Assistant | AltafToolsHub",
    description: "Free AI-powered text enhancement tool. Check grammar, improve readability, adjust tone, and analyze writing quality. All processing happens in your browser for complete privacy.",
    path: "/text-enhancer",
    keywords: "text enhancer, ai writing assistant, grammar checker, readability analyzer, tone adjuster, writing improvement, text analysis, passive voice checker, writing tool",
    structuredData: [howToSchema, softwareSchema],
    ogImage: "https://www.altaftoolshub.com/og-text-enhancer.png"
  });

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No Text",
        description: "Please enter some text to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Analyze text
      const analysisResult = analyzeText(inputText);
      setAnalysis(analysisResult);
      
      // Check grammar
      const grammar = checkGrammar(inputText);
      setGrammarIssues(grammar);
      
      // Check spelling
      const spelling = await checkSpelling(inputText);
      setSpellingErrors(spelling);
      
      setActiveTab("analysis");
      
      toast({
        title: "Analysis Complete",
        description: "Your text has been analyzed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnhance = () => {
    if (!inputText.trim()) {
      toast({
        title: "No Text",
        description: "Please enter some text to enhance.",
        variant: "destructive"
      });
      return;
    }

    // Check if at least one tone option is selected
    const hasSelectedTone = Object.values(toneOptions).some(v => v);
    if (!hasSelectedTone) {
      toast({
        title: "No Options Selected",
        description: "Please select at least one enhancement option.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const enhanced = enhanceText(inputText, toneOptions);
      setEnhancedText(enhanced);
      setActiveTab("enhanced");
      
      toast({
        title: "Text Enhanced",
        description: "Your text has been improved based on your preferences.",
      });
    } catch (error) {
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
      });
    } catch {
      toast({
        title: "Copy Failed",
        description: "Failed to copy text. Please try selecting and copying manually.",
        variant: "destructive"
      });
    }
  };

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getReadabilityColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-emerald-500";
    if (score >= 50) return "text-yellow-500";
    if (score >= 30) return "text-orange-500";
    return "text-red-500";
  };

  const resetAll = () => {
    setInputText("");
    setEnhancedText("");
    setAnalysis(null);
    setGrammarIssues([]);
    setSpellingErrors([]);
    setToneOptions({
      formal: false,
      casual: false,
      professional: false,
      friendly: false,
      concise: false,
      detailed: false
    });
    setActiveTab("enhance");
  };

  // Example texts for quick testing
  const loadExample = () => {
    const exampleText = `The importance of effective communication cannot be understated in todays fast-paced world. Weather your writing emails, reports, or social media posts, the way you express yourself effects how others percieve you.

Good writing isnt just about grammer and spelling. Its about clarity, tone, and making sure your message resonates with your audience. This tool can help you improve your writing by analyzing readability, checking for common mistakes, and suggesting improvements.

Remember: clear writing leads to clear thinking. Take the time to refine your words and youll see the differance in how people respond to your ideas.`;
    
    setInputText(exampleText);
    toast({
      title: "Example Loaded",
      description: "Sample text with intentional errors loaded for testing.",
    });
  };

  return (
    <div className="min-h-screen pattern-bg">
      <ToolSEO 
        toolName="Text Enhancer"
        description="AI-powered text improvement with grammar checking and tone adjustment"
        category="UtilitiesApplication"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs items={[{ name: "Text Enhancer", url: "/text-enhancer" }]} />
        
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
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Text Enhancer</h1>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Improve your writing with AI-powered analysis, grammar checking, and tone adjustments. 
            All processing happens in your browser for complete privacy.
          </p>
        </div>

        <PrivacyNotice />

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Input Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="input-text" className="text-lg font-semibold">
                Your Text
              </Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadExample}
                  data-testid="button-load-example"
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  Example
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetAll}
                  disabled={!inputText && !enhancedText}
                  data-testid="button-reset"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
            
            <Textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type your text here..."
              className="min-h-[300px] resize-none"
              data-testid="textarea-input"
            />
            
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span data-testid="text-word-count">{inputText.split(/\s+/).filter(w => w).length} words</span>
              <span data-testid="text-char-count">{inputText.length} characters</span>
            </div>

            {/* Enhancement Options */}
            <div className="mt-6 space-y-4">
              <Label className="text-base font-semibold">Enhancement Options</Label>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <Label htmlFor="formal" className="text-sm cursor-pointer">
                    Formal
                  </Label>
                  <Switch
                    id="formal"
                    checked={toneOptions.formal}
                    onCheckedChange={(checked) => {
                      setToneOptions({
                        ...toneOptions,
                        formal: checked,
                        casual: checked ? false : toneOptions.casual
                      });
                    }}
                    data-testid="switch-formal"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <Label htmlFor="casual" className="text-sm cursor-pointer">
                    Casual
                  </Label>
                  <Switch
                    id="casual"
                    checked={toneOptions.casual}
                    onCheckedChange={(checked) => {
                      setToneOptions({
                        ...toneOptions,
                        casual: checked,
                        formal: checked ? false : toneOptions.formal
                      });
                    }}
                    data-testid="switch-casual"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <Label htmlFor="professional" className="text-sm cursor-pointer">
                    Professional
                  </Label>
                  <Switch
                    id="professional"
                    checked={toneOptions.professional}
                    onCheckedChange={(checked) => {
                      setToneOptions({
                        ...toneOptions,
                        professional: checked,
                        friendly: checked ? false : toneOptions.friendly
                      });
                    }}
                    data-testid="switch-professional"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <Label htmlFor="friendly" className="text-sm cursor-pointer">
                    Friendly
                  </Label>
                  <Switch
                    id="friendly"
                    checked={toneOptions.friendly}
                    onCheckedChange={(checked) => {
                      setToneOptions({
                        ...toneOptions,
                        friendly: checked,
                        professional: checked ? false : toneOptions.professional
                      });
                    }}
                    data-testid="switch-friendly"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <Label htmlFor="concise" className="text-sm cursor-pointer">
                    Concise
                  </Label>
                  <Switch
                    id="concise"
                    checked={toneOptions.concise}
                    onCheckedChange={(checked) => {
                      setToneOptions({
                        ...toneOptions,
                        concise: checked,
                        detailed: checked ? false : toneOptions.detailed
                      });
                    }}
                    data-testid="switch-concise"
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <Label htmlFor="detailed" className="text-sm cursor-pointer">
                    Detailed
                  </Label>
                  <Switch
                    id="detailed"
                    checked={toneOptions.detailed}
                    onCheckedChange={(checked) => {
                      setToneOptions({
                        ...toneOptions,
                        detailed: checked,
                        concise: checked ? false : toneOptions.concise
                      });
                    }}
                    data-testid="switch-detailed"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={!inputText.trim() || isProcessing}
                  className="flex-1"
                  variant="outline"
                  data-testid="button-analyze"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Analyze Text
                </Button>
                
                <Button
                  onClick={handleEnhance}
                  disabled={!inputText.trim() || isProcessing || !Object.values(toneOptions).some(v => v)}
                  className="flex-1 btn-gradient text-white"
                  data-testid="button-enhance"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enhance Text
                </Button>
              </div>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="enhance" data-testid="tab-enhanced">
                  Enhanced
                </TabsTrigger>
                <TabsTrigger value="analysis" data-testid="tab-analysis">
                  Analysis
                </TabsTrigger>
                <TabsTrigger value="issues" data-testid="tab-issues">
                  Issues
                </TabsTrigger>
              </TabsList>

              {/* Enhanced Text Tab */}
              <TabsContent value="enhance" className="mt-4">
                {enhancedText ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-lg font-semibold">Enhanced Text</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(enhancedText)}
                          data-testid="button-copy-enhanced"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadText(enhancedText, 'enhanced-text.txt')}
                          data-testid="button-download-enhanced"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <Textarea
                      value={enhancedText}
                      readOnly
                      className="min-h-[300px] resize-none"
                      data-testid="textarea-enhanced"
                    />
                    
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Text enhanced with selected options</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
                    <Sparkles className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-center">
                      Select enhancement options and click "Enhance Text" to improve your writing
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Analysis Tab */}
              <TabsContent value="analysis" className="mt-4">
                {analysis ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-lg font-semibold mb-4 block">Text Analysis</Label>
                      
                      {/* Statistics */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="p-3 rounded-lg bg-muted">
                          <div className="text-2xl font-bold" data-testid="stat-words">
                            {analysis.wordCount}
                          </div>
                          <div className="text-sm text-muted-foreground">Words</div>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-muted">
                          <div className="text-2xl font-bold" data-testid="stat-sentences">
                            {analysis.sentenceCount}
                          </div>
                          <div className="text-sm text-muted-foreground">Sentences</div>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-muted">
                          <div className="text-2xl font-bold" data-testid="stat-paragraphs">
                            {analysis.paragraphCount}
                          </div>
                          <div className="text-sm text-muted-foreground">Paragraphs</div>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-muted">
                          <div className="text-2xl font-bold" data-testid="stat-avg-sentence">
                            {analysis.averageSentenceLength.toFixed(1)}
                          </div>
                          <div className="text-sm text-muted-foreground">Avg Words/Sentence</div>
                        </div>
                      </div>

                      {/* Readability Score */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <Label>Readability Score</Label>
                          <span className={cn("font-semibold", getReadabilityColor(analysis.readabilityScore))}>
                            {analysis.readabilityScore.toFixed(0)}/100
                          </span>
                        </div>
                        <Progress value={analysis.readabilityScore} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-2">
                          {analysis.readabilityLevel}
                        </p>
                      </div>

                      {/* Suggestions */}
                      {analysis.suggestions && analysis.suggestions.length > 0 && (
                        <div>
                          <Label className="mb-2 block">Suggestions</Label>
                          <div className="space-y-2">
                            {analysis.suggestions.map((suggestion: string, index: number) => (
                              <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted">
                                <TrendingUp className="w-4 h-4 text-primary mt-0.5" />
                                <span className="text-sm">{suggestion}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Complex Words */}
                      {analysis.complexWords && analysis.complexWords.length > 0 && (
                        <div>
                          <Label className="mb-2 block">Complex Words</Label>
                          <div className="flex flex-wrap gap-2">
                            {analysis.complexWords.map((word: string, index: number) => (
                              <Badge key={index} variant="secondary">
                                {word}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
                    <Target className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-center">
                      Click "Analyze Text" to get detailed insights about your writing
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Issues Tab */}
              <TabsContent value="issues" className="mt-4">
                {(grammarIssues.length > 0 || spellingErrors.length > 0 || (analysis && analysis.passiveVoices && analysis.passiveVoices.length > 0)) ? (
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Issues Found</Label>
                    
                    {/* Grammar Issues */}
                    {grammarIssues.length > 0 && (
                      <div>
                        <Label className="mb-2 block flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                          Grammar Issues
                        </Label>
                        <div className="space-y-2">
                          {grammarIssues.map((issue, index) => (
                            <div key={index} className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                              <span className="text-sm">{issue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Spelling Errors */}
                    {spellingErrors.length > 0 && (
                      <div>
                        <Label className="mb-2 block flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          Spelling Errors
                        </Label>
                        <div className="space-y-2">
                          {spellingErrors.map((error, index) => (
                            <div key={index} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                              <span className="text-sm">{error}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Passive Voice */}
                    {analysis && analysis.passiveVoices && analysis.passiveVoices.length > 0 && (
                      <div>
                        <Label className="mb-2 block flex items-center gap-2">
                          <Info className="w-4 h-4 text-blue-500" />
                          Passive Voice Detected
                        </Label>
                        <div className="space-y-2">
                          {analysis.passiveVoices.map((sentence: string, index: number) => (
                            <div key={index} className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                              <span className="text-sm italic">"{sentence}"</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
                    <Check className="w-12 h-12 mb-4 text-green-500 opacity-50" />
                    <p className="text-center">
                      {analysis ? "No issues found! Your text looks good." : "Analyze your text to check for issues"}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Readability Analysis</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Get Flesch Reading Ease scores and grade-level assessments to ensure your content reaches your audience effectively.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Grammar & Spelling</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Detect common grammar mistakes, spelling errors, and passive voice usage to improve writing quality.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Tone Adjustment</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Transform your text to be more formal, casual, professional, or friendly based on your needs.
            </p>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Writing Tips</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded bg-primary/10">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Keep sentences under 20 words</p>
                <p className="text-sm text-muted-foreground">Shorter sentences are easier to read and understand</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-1 rounded bg-primary/10">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Use active voice</p>
                <p className="text-sm text-muted-foreground">Active voice makes writing more direct and engaging</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-1 rounded bg-primary/10">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Vary sentence length</p>
                <p className="text-sm text-muted-foreground">Mix short and long sentences for better rhythm</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-1 rounded bg-primary/10">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Use transition words</p>
                <p className="text-sm text-muted-foreground">Connect ideas smoothly with words like "however" and "therefore"</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}