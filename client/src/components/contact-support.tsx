import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, HelpCircle, Bug, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export function ContactSupportSection() {
  return (
    <section className="py-12 bg-muted/30 dark:bg-gray-900/30 overflow-hidden" data-testid="contact-support-section">
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 sm:p-10 lg:p-12 bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-gray-900 dark:to-primary/5 border-primary/20 dark:border-primary/30">
            <div className="text-center max-w-3xl mx-auto">
              <motion.h2 
                className="text-2xl sm:text-3xl font-bold mb-4 text-foreground dark:text-foreground"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Still have questions? <span className="gradient-text">We're here to help</span>
              </motion.h2>
              
              <motion.p 
                className="text-muted-foreground mb-8 text-base sm:text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Get support, report issues, or find answers to common questions
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {/* Email Support */}
                <a
                  href="mailto:support@altaftoolshub.com"
                  className="group"
                  aria-label="Contact support via email at support@altaftoolshub.com"
                  data-testid="link-email-support"
                >
                  <Button
                    size="lg"
                    variant="default"
                    className={cn(
                      "w-full sm:w-auto min-h-[44px] px-6",
                      "btn-gradient text-white",
                      "group-hover:scale-105 transition-transform"
                    )}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Email Support
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>

                {/* FAQ Link */}
                <Link href="/faq">
                  <Button
                    size="lg"
                    variant="outline"
                    className={cn(
                      "w-full sm:w-auto min-h-[44px] px-6",
                      "hover:bg-primary/10 hover:border-primary/50",
                      "group transition-all"
                    )}
                    data-testid="button-view-faq"
                  >
                    <HelpCircle className="w-5 h-5 mr-2" />
                    View FAQ
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                {/* Report Issue */}
                <a
                  href="mailto:support@altaftoolshub.com?subject=Issue%20Report"
                  className="group"
                  aria-label="Report an issue via email to support"
                  data-testid="link-report-issue"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className={cn(
                      "w-full sm:w-auto min-h-[44px] px-6",
                      "hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-600 dark:hover:text-red-400",
                      "group transition-all"
                    )}
                  >
                    <Bug className="w-5 h-5 mr-2" />
                    Report Issue
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </motion.div>

              {/* Additional Support Info */}
              <motion.div
                className="mt-8 pt-8 border-t border-border/50"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span>Average response time: <strong className="text-foreground">24 hours</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>Email: <strong className="text-foreground">support@altaftoolshub.com</strong></span>
                  </div>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}