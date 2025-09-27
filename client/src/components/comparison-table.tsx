import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap, Shield, Clock, DollarSign, User, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotionContext } from "@/components/reduced-motion-provider";
import { getMotionProps } from "@/hooks/use-reduced-motion";

interface ComparisonFeature {
  feature: string;
  icon: React.ComponentType<{ className?: string }>;
  altafToolsHub: string | boolean;
  competitors: string | boolean;
  highlight?: boolean;
}

const comparisonData: ComparisonFeature[] = [
  {
    feature: "Features",
    icon: Zap,
    altafToolsHub: "60+ Professional Tools",
    competitors: "10-20 Basic Tools",
    highlight: true
  },
  {
    feature: "Processing Speed",
    icon: Clock,
    altafToolsHub: "Instant (Browser-Based)",
    competitors: "Slow (Upload Required)",
    highlight: true
  },
  {
    feature: "Pricing",
    icon: DollarSign,
    altafToolsHub: "100% Free Forever",
    competitors: "$9-29/month",
    highlight: true
  },
  {
    feature: "Ease of Use",
    icon: User,
    altafToolsHub: "No Registration",
    competitors: "Account Required"
  },
  {
    feature: "Privacy & Security",
    icon: Shield,
    altafToolsHub: "100% Private (No Upload)",
    competitors: "Files Uploaded to Server",
    highlight: true
  },
  {
    feature: "File Size Limits",
    icon: Globe,
    altafToolsHub: "No Limits",
    competitors: "10-50MB Limits"
  }
];

const CheckMark = () => (
  <Check className="w-5 h-5 text-green-500" data-testid="icon-check" />
);

const XMark = () => (
  <X className="w-5 h-5 text-red-500" data-testid="icon-x" />
);

export function ComparisonTable() {
  const { reducedMotion } = useReducedMotionContext();

  return (
    <section className="py-16 overflow-hidden" data-testid="comparison-table-section">
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-blue-600 text-white border-0 shadow-md">
              <Zap className="w-3 h-3 mr-1" />
              Why Choose Us
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              <span className="gradient-text">AltafToolsHub</span> vs Competitors
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See why thousands choose our privacy-first tools over traditional online converters
            </p>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 dark:bg-gray-800/50 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-foreground dark:text-foreground">Feature</th>
                      <th className="px-6 py-4 text-center font-semibold">
                        <span className="text-primary">AltafToolsHub</span>
                      </th>
                      <th className="px-6 py-4 text-center font-semibold text-muted-foreground">
                        Other Tools
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.tr
                          key={item.feature}
                          className={cn(
                            "border-t transition-colors hover:bg-muted/30 dark:hover:bg-gray-800/30",
                            item.highlight && "bg-primary/5 dark:bg-primary/10"
                          )}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          data-testid={`comparison-row-${item.feature.toLowerCase().replace(/\s/g, '-')}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 text-primary" />
                              <span className="font-medium text-foreground dark:text-foreground">{item.feature}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {typeof item.altafToolsHub === 'boolean' ? (
                                item.altafToolsHub ? <CheckMark /> : <XMark />
                              ) : (
                                <span className="font-medium text-green-600 dark:text-green-400">
                                  {item.altafToolsHub}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {typeof item.competitors === 'boolean' ? (
                                item.competitors ? <CheckMark /> : <XMark />
                              ) : (
                                <span className="text-muted-foreground">
                                  {item.competitors}
                                </span>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {comparisonData.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.feature}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={cn(
                      "p-4 sm:p-6 bg-card dark:bg-card transition-all duration-300 hover:shadow-lg",
                      item.highlight && "border-2 border-primary/50 bg-primary/5 dark:bg-primary/10 shadow-md"
                    )}
                    data-testid={`comparison-card-${item.feature.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-base sm:text-lg text-foreground dark:text-foreground">{item.feature}</h3>
                      {item.highlight && (
                        <Badge className="ml-auto bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary border-primary/30 text-xs">
                          Key
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {/* AltafToolsHub */}
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-blue-500/10 dark:from-primary/20 dark:to-blue-500/20 rounded-lg border border-primary/20">
                        <span className="font-medium text-sm flex items-center gap-2">
                          <Check className="w-3 h-3 text-primary" />
                          AltafToolsHub
                        </span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          {typeof item.altafToolsHub === 'boolean' ? (
                            item.altafToolsHub ? <CheckMark /> : <XMark />
                          ) : (
                            item.altafToolsHub
                          )}
                        </span>
                      </div>
                      
                      {/* Competitors */}
                      <div className="flex items-center justify-between p-3 bg-muted/50 dark:bg-gray-800/50 rounded-lg border border-muted">
                        <span className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                          <X className="w-3 h-3 opacity-50" />
                          Other Tools
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {typeof item.competitors === 'boolean' ? (
                            item.competitors ? <CheckMark /> : <XMark />
                          ) : (
                            <span className="opacity-75">{item.competitors}</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-lg font-medium mb-2">
              Experience the difference with our privacy-first tools
            </p>
            <p className="text-muted-foreground">
              No registration, no uploads, no limits - just powerful tools that work
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}