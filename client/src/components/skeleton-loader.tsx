import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const baseClasses = "bg-muted";
  
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };
  
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-md",
  };
  
  const style: React.CSSProperties = {
    width: width || (variant === "circular" ? 40 : "100%"),
    height: height || (variant === "circular" ? 40 : variant === "text" ? 16 : 200),
  };
  
  return (
    <div
      className={cn(
        baseClasses,
        animationClasses[animation],
        variantClasses[variant],
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}

// Skeleton for card components
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <div className="space-y-3">
        <Skeleton variant="rectangular" height={150} className="mb-4" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  );
}

// Skeleton for blog post cards
export function BlogPostSkeleton() {
  return (
    <article className="rounded-lg border bg-card overflow-hidden">
      <Skeleton variant="rectangular" height={200} />
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton variant="rounded" width={60} height={20} />
          <Skeleton variant="rounded" width={80} height={20} />
        </div>
        <Skeleton variant="text" width="90%" height={24} className="mb-2" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="70%" />
        <div className="flex items-center justify-between mt-4">
          <Skeleton variant="text" width={100} />
          <Skeleton variant="rounded" width={80} height={32} />
        </div>
      </div>
    </article>
  );
}

// Skeleton for tool cards
export function ToolCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-start justify-between mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="rounded" width={60} height={20} />
      </div>
      <Skeleton variant="text" width="70%" height={20} className="mb-2" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="90%" />
      <div className="mt-4">
        <Skeleton variant="rounded" width="100%" height={36} />
      </div>
    </div>
  );
}

// Skeleton for guide cards
export function GuideCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Skeleton variant="rectangular" height={180} />
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={80} />
        </div>
        <Skeleton variant="text" width="85%" height={24} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="95%" />
        <div className="flex items-center gap-4 mt-4">
          <Skeleton variant="text" width={60} />
          <Skeleton variant="text" width={80} />
        </div>
      </div>
    </div>
  );
}

// Skeleton for comparison tables
export function ComparisonTableSkeleton() {
  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="bg-muted p-4">
        <Skeleton variant="text" width="30%" height={24} />
      </div>
      <div className="divide-y">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex divide-x">
            <div className="flex-1 p-4">
              <Skeleton variant="text" width="60%" />
            </div>
            <div className="flex-1 p-4">
              <Skeleton variant="text" width="40%" />
            </div>
            <div className="flex-1 p-4">
              <Skeleton variant="text" width="50%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton for page headers
export function PageHeaderSkeleton() {
  return (
    <div className="text-center max-w-3xl mx-auto py-12 space-y-4">
      <Skeleton variant="rounded" width={120} height={24} className="mx-auto mb-4" />
      <Skeleton variant="text" width="60%" height={48} className="mx-auto" />
      <Skeleton variant="text" width="80%" height={20} className="mx-auto" />
      <Skeleton variant="text" width="70%" height={20} className="mx-auto" />
    </div>
  );
}

// Skeleton for stats sections
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="text-center p-6 rounded-lg border">
          <Skeleton variant="text" width="60%" height={32} className="mx-auto mb-2" />
          <Skeleton variant="text" width="80%" className="mx-auto" />
        </div>
      ))}
    </div>
  );
}

// Add shimmer animation to tailwind (you'll need to add this to tailwind.config.ts)
// animation: {
//   shimmer: "shimmer 2s infinite linear",
// },
// keyframes: {
//   shimmer: {
//     "0%": { backgroundPosition: "-1000px 0" },
//     "100%": { backgroundPosition: "1000px 0" },
//   },
// }