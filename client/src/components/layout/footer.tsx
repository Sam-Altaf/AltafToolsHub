import { Logo } from "@/components/logo";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-muted/30 dark:bg-gray-900/80 text-foreground mt-16 transition-colors duration-300 border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Logo size="sm" variant="full" className="text-primary" />
          </div>
          <p className="text-muted-foreground mb-4">Privacy-first file tools that work entirely in your browser</p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-privacy">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-terms">
              Terms of Service
            </Link>
            <a href="mailto:privacy@altaftoolshub.com" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-contact">Contact</a>
          </div>
          <p className="text-muted-foreground/70 text-sm mt-4">© 2025 AltafToolsHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
