import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdContainerProps {
  className?: string;
  position?: "top" | "bottom" | "sidebar" | "inline";
  format?: "banner" | "rectangle" | "square" | "responsive";
  testId?: string;
  showLabel?: boolean;
  enabled?: boolean;
}

/**
 * AdContainer Component
 * 
 * A reusable component for displaying advertisements.
 * Currently shows a placeholder for future Google AdSense integration.
 * 
 * @param className - Additional CSS classes to apply
 * @param position - Position type for styling purposes
 * @param format - Ad format for future AdSense configuration
 * @param testId - Custom test ID (defaults to "ad-container")
 * @param showLabel - Whether to show "Advertisement" label
 * @param enabled - Whether to show the ad container (for easy toggling)
 */
export default function AdContainer({
  className,
  position = "inline",
  format = "responsive",
  testId = "ad-container",
  showLabel = true,
  enabled = true
}: AdContainerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!enabled || !isClient) {
    return null;
  }

  const containerStyles = cn(
    "ad-container",
    "relative",
    "overflow-hidden",
    "transition-all duration-300",
    {
      "w-full max-w-[728px] h-[90px] mx-auto": format === "banner",
      "w-[300px] h-[250px]": format === "rectangle",
      "w-[250px] h-[250px]": format === "square",
      "w-full min-h-[100px] max-w-4xl mx-auto": format === "responsive",
      "my-6": position === "inline",
      "mb-6": position === "top",
      "mt-6": position === "bottom",
      "sticky top-20": position === "sidebar",
    },
    className
  );

  return (
    <div 
      className={containerStyles}
      data-testid={testId}
      data-ad-position={position}
      data-ad-format={format}
      aria-label="Advertisement"
      role="complementary"
    >
      <Card className="h-full bg-muted/30 border-muted flex items-center justify-center p-4">
        <div className="text-center">
          {showLabel && (
            <p className="text-sm text-muted-foreground font-medium mb-2">
              Advertisement
            </p>
          )}
          <div className="text-xs text-muted-foreground/70">
            {/* Placeholder for Google AdSense */}
            {/* Future implementation:
                <ins className="adsbygoogle"
                     style={{ display: 'block' }}
                     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                     data-ad-slot="XXXXXXXXXX"
                     data-ad-format={format}
                     data-full-width-responsive="true">
                </ins>
                
                Script to be added in index.html:
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                
                Component will need to call:
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            */}
            <div className="px-4 py-2 rounded bg-muted/50">
              <span className="opacity-50">Ad Space</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * AdBanner Component
 * Convenience component for banner ads
 */
export function AdBanner(props: Omit<AdContainerProps, "format">) {
  return <AdContainer {...props} format="banner" />;
}

/**
 * AdSidebar Component
 * Convenience component for sidebar ads
 */
export function AdSidebar(props: Omit<AdContainerProps, "position" | "format">) {
  return <AdContainer {...props} position="sidebar" format="rectangle" />;
}

/**
 * AdInline Component
 * Convenience component for inline content ads
 */
export function AdInline(props: Omit<AdContainerProps, "position">) {
  return <AdContainer {...props} position="inline" />;
}