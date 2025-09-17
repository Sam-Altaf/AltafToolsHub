import { Logo } from "@/components/logo";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 mt-16 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Logo size="sm" variant="full" className="text-primary" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Privacy-first file tools that work entirely in your browser</p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors" data-testid="link-privacy">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors" data-testid="link-terms">
              Terms of Service
            </Link>
            <a href="mailto:privacy@altaftoolshub.com" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors" data-testid="link-contact">Contact</a>
          </div>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-4">© 2025 AltafToolsHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
