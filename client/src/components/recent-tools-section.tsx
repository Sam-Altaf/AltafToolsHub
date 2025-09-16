import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Clock, X, ArrowRight } from "lucide-react";
import { useRecentTools } from "@/hooks/use-recent-tools";

export function RecentToolsSection() {
  const { recentTools, clearRecentTools, hasRecentTools } = useRecentTools();

  if (!hasRecentTools) {
    return null;
  }

  return (
    <section className="py-8 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Recently Used Tools</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearRecentTools}
            className="text-muted-foreground hover:text-foreground"
            data-testid="button-clear-recent"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recentTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={tool.href}>
                  <Card 
                    className={cn(
                      "p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group",
                      "hover:scale-105 hover:border-primary/50"
                    )}
                    data-testid={`recent-tool-${tool.id}`}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        "bg-gradient-to-br", tool.color,
                        "group-hover:scale-110 transition-transform"
                      )}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-medium text-sm line-clamp-1">
                        {tool.title}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}