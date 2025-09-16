import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, FileText, Image, Layers, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const QUICK_ACTIONS_DISMISSED_KEY = 'altaf-quick-actions-dismissed';

const quickActions = [
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    icon: FileText,
    href: '/compress-pdf',
    color: 'from-purple-500 to-blue-500'
  },
  {
    id: 'jpg-to-pdf',
    title: 'JPG to PDF',
    icon: Layers,
    href: '/jpg-to-pdf',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'unlock-pdf',
    title: 'Unlock PDF',
    icon: Image,
    href: '/unlock-pdf',
    color: 'from-cyan-500 to-teal-500'
  }
];

export function QuickActionsBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the bar
    const dismissed = localStorage.getItem(QUICK_ACTIONS_DISMISSED_KEY);
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Show after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem(QUICK_ACTIONS_DISMISSED_KEY, 'true');
  };

  const handleReset = () => {
    setIsDismissed(false);
    setIsVisible(true);
    localStorage.removeItem(QUICK_ACTIONS_DISMISSED_KEY);
  };

  if (isDismissed) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReset}
        className="fixed bottom-4 right-4 z-40 bg-background/80 backdrop-blur-sm border shadow-lg"
        data-testid="button-show-quick-actions"
      >
        <Zap className="w-4 h-4 mr-2" />
        Quick Actions
      </Button>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40"
          data-testid="quick-actions-bar"
        >
          <Card className="p-3 bg-background/95 backdrop-blur-sm border shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Quick Actions
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleDismiss}
                data-testid="button-dismiss-quick-actions"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.id} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card 
                        className={cn(
                          "p-3 cursor-pointer transition-all duration-300",
                          "hover:shadow-lg hover:border-primary/50 group"
                        )}
                        data-testid={`quick-action-${action.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            "bg-gradient-to-br", action.color,
                            "group-hover:scale-110 transition-transform"
                          )}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{action.title}</p>
                            <p className="text-xs text-muted-foreground">Quick access</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-center text-muted-foreground">
                Popular tools for quick access
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}