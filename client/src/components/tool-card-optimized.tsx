import { memo } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tool } from "@/lib/tools-data";
import { Sparkles, Star, Clock } from "lucide-react";
import { getMotionProps } from "@/hooks/use-reduced-motion";
import { useReducedMotionContext } from "@/components/reduced-motion-provider";

interface ToolCardProps {
  tool: Tool;
  index?: number;
}

// Memoized tool card component for better performance
export const OptimizedToolCard = memo(function OptimizedToolCard({ tool, index = 0 }: ToolCardProps) {
  const Icon = tool.icon;
  const { reducedMotion } = useReducedMotionContext();
  
  const cardContent = (
    <motion.div
      className="h-full"
      {...getMotionProps(reducedMotion, {
        whileHover: tool.available ? { scale: 1.03, y: -5 } : {},
        whileTap: tool.available ? { scale: 0.98 } : {},
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { 
          duration: 0.5, 
          delay: index * 0.05,
          ease: [0.4, 0, 0.2, 1],
        }
      }, {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0 }
      })}
    >
      <Card className={cn(
        "tool-card relative h-full p-6 transition-all duration-500 group min-h-[280px] rounded-lg",
        tool.available 
          ? "cursor-pointer hover:shadow-2xl focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2" 
          : "cursor-not-allowed opacity-70",
        "border border-transparent hover:border-primary/20"
      )} data-testid={`tool-card-${tool.id}`}>
        {/* Badge */}
        {(tool.new || tool.popular || !tool.available) && (
          <div className="absolute top-3 right-3">
            {tool.new && (
              <Badge className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white border-0 font-semibold shadow-lg">
                <Sparkles className="w-3 h-3 mr-1" />
                New
              </Badge>
            )}
            {tool.popular && (
              <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white border-0 font-semibold shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            )}
            {!tool.available && (
              <Badge variant="outline" className="border-muted-foreground/50">
                <Clock className="w-3 h-3 mr-1" />
                Coming Soon
              </Badge>
            )}
          </div>
        )}

        {/* Icon */}
        <div className={cn(
          "mb-4 inline-flex p-3 rounded-xl transition-all duration-300",
          tool.available 
            ? "bg-gradient-to-r from-primary/10 to-blue-500/10 group-hover:from-primary/20 group-hover:to-blue-500/20" 
            : "bg-muted"
        )}>
          <Icon className={cn(
            "w-6 h-6 transition-transform duration-300",
            tool.available 
              ? "text-primary group-hover:scale-110" 
              : "text-muted-foreground"
          )} />
        </div>

        {/* Content */}
        <h3 className={cn(
          "text-lg font-semibold mb-2 transition-colors",
          tool.available 
            ? "text-foreground group-hover:text-primary" 
            : "text-muted-foreground"
        )}>
          {tool.title}
        </h3>
        
        <p className={cn(
          "text-sm mb-4 line-clamp-3",
          tool.available ? "text-muted-foreground" : "text-muted-foreground/70"
        )}>
          {tool.description}
        </p>

        {/* Footer */}
        {tool.available && (
          <div className="mt-auto pt-4">
            <span className="text-sm text-primary font-medium group-hover:underline flex items-center">
              Open Tool
              <svg
                className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        )}
      </Card>
    </motion.div>
  );

  if (tool.available) {
    return (
      <Link href={`/${tool.id}`} data-testid={`link-tool-${tool.id}`}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}, (prevProps, nextProps) => {
  // Custom equality check for memo optimization
  return (
    prevProps.tool.id === nextProps.tool.id &&
    prevProps.tool.available === nextProps.tool.available &&
    prevProps.tool.new === nextProps.tool.new &&
    prevProps.tool.popular === nextProps.tool.popular &&
    prevProps.index === nextProps.index
  );
});