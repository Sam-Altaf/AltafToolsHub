import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSEO, generateHowToSchema, generateSoftwareApplicationSchema } from "@/hooks/use-seo";
import { 
  FileText, Trash2, Copy, Download, Clock, 
  Type, Hash, AlignLeft, BookOpen, Check, ArrowLeft 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import ToolSEO, { toolFAQs } from "@/components/seo/tool-seo";
import PrivacyNotice from "@/components/privacy-notice";
import { WhyUseSection, UseCasesSection, ComparisonSection, HowItWorksSection, commonFeatures } from "@/components/seo/tool-features";
import { ToolFAQ, generateWordCounterFAQs } from "@/components/seo/tool-faq";
import { PenTool, FileCheck, MessageSquare, Gauge, ScrollText, Edit3 } from "lucide-react";

interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: number; // in minutes
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
}

const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => (
  <Card className="p-4 glass">
    <div className="flex items-center gap-3">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </Card>
);

export default function WordCounter() {
  // Generate structured data for SEO
  const howToSchema = generateHowToSchema({
    name: "How to Count Words and Characters Online",
    description: "Count words, characters, sentences, and get reading time estimates instantly",
    totalTime: "PT5S",
    steps: [
      { name: "Enter Text", text: "Type or paste your text into the text area" },
      { name: "View Statistics", text: "See real-time word and character counts" },
      { name: "Check Reading Time", text: "View estimated reading time for your content" },
      { name: "Export Results", text: "Copy statistics or download as text file" }
    ]
  });

  const softwareSchema = generateSoftwareApplicationSchema({
    name: "Word Counter - AltafToolsHub",
    description: "Real-time word counter with character count, sentence analysis, and reading time. Perfect for writers and students. 100% browser-based.",
    applicationCategory: "UtilitiesApplication",
    url: "https://www.altaftoolshub.com/word-counter",
    aggregateRating: { ratingValue: 4.8, ratingCount: 2876, bestRating: 5 },
    featureList: [
      "Real-time word counting",
      "Character count with and without spaces",
      "Sentence and paragraph counting",
      "Reading time estimation",
      "Character limit tracking",
      "Export to text file",
      "100% client-side processing"
    ],
    datePublished: "2024-01-01",
    dateModified: "2025-01-17"
  });

  useSEO({
    title: "Free Word Counter Tool - Count Words, Characters & More | AltafToolsHub",
    description: "Free online word counter. Count words, characters, sentences, paragraphs instantly. Get reading time estimates. 100% client-side processing for privacy.",
    path: "/word-counter",
    keywords: "word counter, character counter, text counter, word count tool, character count tool, reading time calculator, online word counter, free text analyzer, word counter 2025, ai writing tool",
    ogImage: "https://www.altaftoolshub.com/og-word-counter.png",
    structuredData: [howToSchema, softwareSchema],
    additionalMetaTags: [
      { name: "application-name", content: "Word Counter - AltafToolsHub" },
      { property: "article:section", content: "Text Tools" },
      { property: "article:tag", content: "Text Analysis" },
      { property: "article:tag", content: "Writing Tools" },
      { property: "article:tag", content: "SEO Tools" }
    ]
  });

  const [text, setText] = useState("");
  const [stats, setStats] = useState<TextStats>({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0
  });
  const [characterLimit, setCharacterLimit] = useState<number | null>(null);
  const [customLimit, setCustomLimit] = useState("280"); // Twitter default
  const { toast } = useToast();

  const calculateStats = useCallback((inputText: string): TextStats => {
    if (!inputText) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0
      };
    }

    // Characters
    const characters = inputText.length;
    const charactersNoSpaces = inputText.replace(/\s/g, "").length;

    // Words - improved regex to handle various word boundaries
    const words = inputText
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0).length;

    // Sentences - count by sentence-ending punctuation
    const sentenceRegex = /[.!?]+[\s\n]+|[.!?]+$/g;
    const sentenceMatches = inputText.match(sentenceRegex);
    const sentences = sentenceMatches ? sentenceMatches.length : (inputText.trim() ? 1 : 0);

    // Paragraphs - count by line breaks
    const paragraphs = inputText
      .split(/\n\n+/)
      .filter(para => para.trim().length > 0).length;

    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs: paragraphs || (inputText.trim() ? 1 : 0),
      readingTime
    };
  }, []);

  // Update stats when text changes
  useEffect(() => {
    const newStats = calculateStats(text);
    setStats(newStats);
  }, [text, calculateStats]);

  const handleClear = () => {
    setText("");
    toast({
      title: "Cleared",
      description: "Text has been cleared.",
    });
  };

  const handleCopy = async () => {
    if (!text) {
      toast({
        title: "Nothing to Copy",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy text. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    if (!text) {
      toast({
        title: "Nothing to Export",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    const statsText = `
Text Statistics
===============
Words: ${stats.words}
Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Reading Time: ${stats.readingTime} minute(s)

Original Text:
==============
${text}
    `.trim();

    const blob = new Blob([statsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `text-stats-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exported!",
      description: "Text and statistics exported successfully.",
    });
  };

  const setPresetLimit = (limit: number | null) => {
    setCharacterLimit(limit);
    if (limit) {
      setCustomLimit(limit.toString());
    }
  };

  const characterPercentage = characterLimit 
    ? Math.min((stats.characters / characterLimit) * 100, 100)
    : 0;

  const isOverLimit = characterLimit && stats.characters > characterLimit;

  return (
    <div className="min-h-screen pattern-bg">
      <ToolSEO 
        toolName="Word Counter"
        description="Count words, characters, sentences and get reading time estimates instantly"
        category="UtilitiesApplication"
        faqs={toolFAQs["word-counter"]}
        rating={{ value: 4.7, count: 298 }}
      />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumbs items={[{ name: "Word Counter", url: "/word-counter" }]} />
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            className="mb-4" 
            data-testid="button-back"
            onClick={() => {
              window.location.href = '/';
              setTimeout(() => {
                const toolsSection = document.getElementById('tools-section');
                if (toolsSection) {
                  toolsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Word Counter</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Count words, characters, sentences, and more. Get instant reading time estimates and character limit checks.
          </p>
        </div>

        {/* Privacy Notice */}
        <PrivacyNotice message="Text analysis happens in your browser. Your content is never transmitted." />

        {/* Main Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            icon={Type}
            label="Words"
            value={stats.words.toLocaleString()}
            color="bg-gradient-to-br from-purple-500 to-blue-500"
          />
          <StatCard
            icon={Hash}
            label="Characters"
            value={stats.characters.toLocaleString()}
            color="bg-gradient-to-br from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={Hash}
            label="No Spaces"
            value={stats.charactersNoSpaces.toLocaleString()}
            color="bg-gradient-to-br from-cyan-500 to-teal-500"
          />
          <StatCard
            icon={AlignLeft}
            label="Sentences"
            value={stats.sentences.toLocaleString()}
            color="bg-gradient-to-br from-teal-500 to-green-500"
          />
          <StatCard
            icon={BookOpen}
            label="Paragraphs"
            value={stats.paragraphs.toLocaleString()}
            color="bg-gradient-to-br from-green-500 to-emerald-500"
          />
          <StatCard
            icon={Clock}
            label="Read Time"
            value={`${stats.readingTime} min`}
            color="bg-gradient-to-br from-emerald-500 to-cyan-500"
          />
        </div>

        {/* Character Limit Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Character Limit Checker</h2>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={characterLimit === 280 ? "default" : "outline"}
                size="sm"
                onClick={() => setPresetLimit(280)}
                data-testid="button-limit-twitter"
              >
                Twitter (280)
              </Button>
              <Button
                variant={characterLimit === 160 ? "default" : "outline"}
                size="sm"
                onClick={() => setPresetLimit(160)}
                data-testid="button-limit-sms"
              >
                SMS (160)
              </Button>
              <Button
                variant={characterLimit === 2200 ? "default" : "outline"}
                size="sm"
                onClick={() => setPresetLimit(2200)}
                data-testid="button-limit-linkedin"
              >
                LinkedIn (2200)
              </Button>
              <Button
                variant={characterLimit === 500 ? "default" : "outline"}
                size="sm"
                onClick={() => setPresetLimit(500)}
                data-testid="button-limit-meta"
              >
                Meta Desc (500)
              </Button>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={customLimit}
                  onChange={(e) => setCustomLimit(e.target.value)}
                  className="w-24 px-2 py-1 border rounded text-sm"
                  placeholder="Custom"
                  data-testid="input-custom-limit"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPresetLimit(parseInt(customLimit) || null)}
                  data-testid="button-set-custom"
                >
                  Set
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPresetLimit(null)}
                  data-testid="button-clear-limit"
                >
                  Clear
                </Button>
              </div>
            </div>

            {characterLimit && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Character Usage
                  </span>
                  <span className={cn(
                    "text-sm font-medium",
                    isOverLimit ? "text-red-500" : "text-green-500"
                  )}>
                    {stats.characters} / {characterLimit}
                  </span>
                </div>
                <Progress 
                  value={characterPercentage} 
                  className={cn(
                    "h-2",
                    isOverLimit && "[&>div]:bg-red-500"
                  )}
                />
                {isOverLimit && (
                  <p className="text-sm text-red-500">
                    ⚠️ Over limit by {stats.characters - characterLimit} characters
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Text Input Section */}
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Enter Your Text</h2>
            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                disabled={!text}
                data-testid="button-copy-text"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                size="sm"
                disabled={!text}
                data-testid="button-export-text"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                size="sm"
                disabled={!text}
                data-testid="button-clear-text"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
          
          <Textarea
            placeholder="Start typing or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[400px] font-mono"
            data-testid="textarea-input"
          />
        </Card>

        {/* Tips Section */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
          <h3 className="text-lg font-semibold mb-3">Writing Tips</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span className="text-sm">Average reading speed is 200-250 words per minute</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span className="text-sm">Optimal sentence length is 15-20 words for readability</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span className="text-sm">Paragraphs should typically be 3-5 sentences long</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span className="text-sm">Use the character limit checker for social media posts</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* SEO Content Sections */}
      <HowItWorksSection
        toolName="Word Counter"
        steps={[
          {
            number: 1,
            title: "Enter Your Text",
            description: "Type directly or paste your content into the text area.",
            icon: Edit3
          },
          {
            number: 2,
            title: "View Real-Time Stats",
            description: "See word count, characters, sentences, and paragraphs instantly.",
            icon: Gauge
          },
          {
            number: 3,
            title: "Check Reading Time",
            description: "Get estimated reading time based on average reading speed.",
            icon: Clock
          }
        ]}
      />

      <WhyUseSection
        toolName="Word Counter"
        benefits={[
          "Real-time counting as you type or paste text",
          "Comprehensive statistics: words, characters, sentences, paragraphs",
          "Reading time estimation based on 200 WPM average",
          "Character limit checker for social media posts",
          "Export statistics and text to file",
          "100% privacy - text never leaves your browser",
          "No limits on text length or usage",
          "Works offline once the page is loaded"
        ]}
        features={[
          commonFeatures.privacy,
          commonFeatures.instant,
          commonFeatures.free,
          {
            icon: Type,
            title: "Real-Time Analysis",
            description: "Statistics update instantly as you type or edit."
          }
        ]}
      />

      <UseCasesSection
        useCases={[
          {
            title: "Academic Writing",
            description: "Meet word count requirements for essays, papers, and assignments.",
            icon: BookOpen,
            example: "Check if your 2,000-word essay meets requirements"
          },
          {
            title: "SEO Content",
            description: "Optimize article length for search engine rankings.",
            icon: FileCheck,
            example: "Ensure blog posts are 1,500+ words for better SEO"
          },
          {
            title: "Social Media",
            description: "Stay within character limits for Twitter, LinkedIn, and other platforms.",
            icon: MessageSquare,
            example: "Keep tweets under 280 characters"
          },
          {
            title: "Content Planning",
            description: "Estimate reading time for blog posts and articles.",
            icon: ScrollText,
            example: "Check if article is a 5-minute read"
          },
          {
            title: "Creative Writing",
            description: "Track progress on novels, stories, and creative projects.",
            icon: PenTool,
            example: "Monitor daily writing goals and word counts"
          },
          {
            title: "Professional Documents",
            description: "Ensure reports and proposals meet length requirements.",
            icon: FileText,
            example: "Verify executive summary is under 500 words"
          }
        ]}
      />

      <ComparisonSection
        toolName="Word Counter"
        comparisons={[
          { feature: "Privacy", ourTool: "100% client-side", others: "May store text", highlight: true },
          { feature: "Real-Time Counting", ourTool: "Instant", others: "Click to count" },
          { feature: "Statistics Provided", ourTool: "6 metrics", others: "2-3 metrics" },
          { feature: "Reading Time", ourTool: true, others: "Premium feature" },
          { feature: "Character Limits", ourTool: "Customizable", others: "Fixed presets" },
          { feature: "Text Length Limit", ourTool: "Unlimited", others: "10,000 words" },
          { feature: "Export Options", ourTool: "Text file", others: "PDF (paid)" },
          { feature: "Registration", ourTool: false, others: "For history" },
          { feature: "Works Offline", ourTool: true, others: false },
          { feature: "Cost", ourTool: "Free forever", others: "Freemium" }
        ]}
      />

      <ToolFAQ 
        faqs={generateWordCounterFAQs()}
        toolName="Word Counter"
        toolPath="/word-counter"
      />
    </div>
  );
}