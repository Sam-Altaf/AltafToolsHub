import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { useEffect } from "react";
import { generateBreadcrumbSchema } from "@/hooks/use-seo";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [
    { name: "Home", url: "/" },
    ...items
  ];

  useEffect(() => {
    // Add breadcrumb structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(generateBreadcrumbSchema(allItems));
    script.id = 'breadcrumb-schema';
    
    // Remove existing breadcrumb schema if exists
    const existing = document.getElementById('breadcrumb-schema');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const element = document.getElementById('breadcrumb-schema');
      if (element) {
        element.remove();
      }
    };
  }, [items]);

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="mb-6"
      data-testid="nav-breadcrumb"
    >
      <ol 
        className="flex items-center space-x-2 text-sm"
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
      >
        {allItems.map((item, index) => (
          <li 
            key={item.url}
            className="flex items-center"
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
            )}
            {index === allItems.length - 1 ? (
              <span 
                className="text-muted-foreground font-medium"
                itemProp="name"
                data-testid={`breadcrumb-current-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.name}
              </span>
            ) : (
              <Link 
                href={item.url}
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                itemProp="item"
                data-testid={`breadcrumb-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {index === 0 && <Home className="w-4 h-4" />}
                <span itemProp="name">{item.name}</span>
              </Link>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}