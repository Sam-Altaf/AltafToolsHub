import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Loader2, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessingLoaderProps {
  isProcessing: boolean;
  progress?: number;
  message?: string;
  subMessage?: string;
  steps?: {
    label: string;
    completed: boolean;
  }[];
  className?: string;
}

export default function ProcessingLoader({
  isProcessing,
  progress = 0,
  message = "Processing your file...",
  subMessage = "This won't take long",
  steps,
  className,
}: ProcessingLoaderProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isProcessing) {
      // Animate progress smoothly
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(0);
    }
  }, [progress, isProcessing]);

  if (!isProcessing) return null;

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm", className)}>
      <Card className="w-full max-w-md mx-4 p-6 glass">
        <div className="flex flex-col items-center text-center">
          {/* Animated Icon */}
          <div className="relative mb-6">
            <div className="gradient-primary w-20 h-20 rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <Loader2 className="absolute inset-0 w-20 h-20 text-primary animate-spin" />
          </div>

          {/* Messages */}
          <h3 className="text-lg font-semibold mb-2">{message}</h3>
          <p className="text-sm text-muted-foreground mb-6">{subMessage}</p>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="w-full mb-6">
              <Progress 
                value={animatedProgress} 
                className="h-2"
                data-testid="progress-processing"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(animatedProgress)}% complete
              </p>
            </div>
          )}

          {/* Processing Steps */}
          {steps && steps.length > 0 && (
            <div className="w-full space-y-3 text-left">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-3 transition-opacity duration-300",
                    step.completed ? "opacity-100" : "opacity-40"
                  )}
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin flex-shrink-0" />
                  )}
                  <span className="text-sm">{step.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Indeterminate Loader */}
          {!progress && !steps && (
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// Inline loader variant for smaller contexts
export function InlineLoader({
  isLoading,
  message = "Loading...",
  size = "default"
}: {
  isLoading: boolean;
  message?: string;
  size?: "small" | "default" | "large";
}) {
  if (!isLoading) return null;

  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-5 h-5",
    large: "w-6 h-6"
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
}

// Operation status indicator
export function OperationStatus({
  status,
  message,
}: {
  status: "idle" | "processing" | "success" | "error";
  message: string;
}) {
  const icons = {
    idle: null,
    processing: <Loader2 className="w-5 h-5 animate-spin" />,
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />
  };

  const colors = {
    idle: "text-muted-foreground",
    processing: "text-primary",
    success: "text-green-600",
    error: "text-red-600"
  };

  if (status === "idle") return null;

  return (
    <div className={cn("flex items-center gap-2 p-4 rounded-lg glass", colors[status])}>
      {icons[status]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}