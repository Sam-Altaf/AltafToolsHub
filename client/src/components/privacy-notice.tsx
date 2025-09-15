import { Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface PrivacyNoticeProps {
  message: string;
  className?: string;
}

export default function PrivacyNotice({ message, className }: PrivacyNoticeProps) {
  return (
    <Alert 
      className={cn(
        "mb-8 border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30",
        className
      )}
      data-testid="privacy-notice"
    >
      <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" />
      <AlertDescription className="text-teal-900 dark:text-teal-100 font-medium ml-2">
        {message}
      </AlertDescription>
    </Alert>
  );
}