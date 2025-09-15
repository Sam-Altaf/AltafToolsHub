import { Check, X, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ComparisonFeature {
  feature: string;
  altafToolsHub: boolean | string;
  competitor1: boolean | string;
  competitor2: boolean | string;
  competitor3: boolean | string;
}

interface ComparisonTableProps {
  title: string;
  description?: string;
  features: ComparisonFeature[];
  competitor1Name?: string;
  competitor2Name?: string;
  competitor3Name?: string;
}

export function ComparisonTable({
  title,
  description,
  features,
  competitor1Name = "Adobe Acrobat",
  competitor2Name = "ILovePDF",
  competitor3Name = "SmallPDF"
}: ComparisonTableProps) {
  const renderCell = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-green-500 mx-auto" aria-label="Yes" />
      ) : (
        <X className="w-5 h-5 text-red-500 mx-auto" aria-label="No" />
      );
    }
    if (value === "-") {
      return <Minus className="w-5 h-5 text-gray-400 mx-auto" aria-label="Not applicable" />;
    }
    return <span className="text-sm text-center block">{value}</span>;
  };

  return (
    <section className="my-12" itemScope itemType="https://schema.org/Table">
      <header className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2" itemProp="name" data-testid="heading-comparison">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground" itemProp="description">
            {description}
          </p>
        )}
      </header>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" itemProp="mainEntity">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold" scope="col">
                  Features
                </th>
                <th className="text-center p-4 font-semibold" scope="col">
                  <div className="flex flex-col items-center gap-1">
                    <span>AltafToolsHub</span>
                    <Badge className="bg-primary text-xs">Our Tool</Badge>
                  </div>
                </th>
                <th className="text-center p-4 font-semibold" scope="col">
                  {competitor1Name}
                </th>
                <th className="text-center p-4 font-semibold" scope="col">
                  {competitor2Name}
                </th>
                <th className="text-center p-4 font-semibold" scope="col">
                  {competitor3Name}
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                  itemScope
                  itemType="https://schema.org/PropertyValue"
                >
                  <td className="p-4 font-medium" itemProp="name">
                    {row.feature}
                  </td>
                  <td className="p-4 text-center" itemProp="value">
                    <div className="font-semibold text-primary">
                      {renderCell(row.altafToolsHub)}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {renderCell(row.competitor1)}
                  </td>
                  <td className="p-4 text-center">
                    {renderCell(row.competitor2)}
                  </td>
                  <td className="p-4 text-center">
                    {renderCell(row.competitor3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <p className="text-sm text-center">
          <strong className="text-primary">Why AltafToolsHub?</strong> We're the only service that 
          processes everything in your browser for true privacy, requires no registration, 
          and is completely free forever.
        </p>
      </div>
    </section>
  );
}

// Pre-defined comparison data for PDF tools
export const pdfToolsComparison: ComparisonFeature[] = [
  {
    feature: "100% Browser Processing",
    altafToolsHub: true,
    competitor1: false,
    competitor2: false,
    competitor3: false
  },
  {
    feature: "No File Upload Required",
    altafToolsHub: true,
    competitor1: false,
    competitor2: false,
    competitor3: false
  },
  {
    feature: "No Registration Needed",
    altafToolsHub: true,
    competitor1: false,
    competitor2: "Limited",
    competitor3: "Limited"
  },
  {
    feature: "Completely Free",
    altafToolsHub: true,
    competitor1: "Trial",
    competitor2: "Limited",
    competitor3: "Limited"
  },
  {
    feature: "No Watermarks",
    altafToolsHub: true,
    competitor1: true,
    competitor2: "Paid only",
    competitor3: "Paid only"
  },
  {
    feature: "Unlimited Usage",
    altafToolsHub: true,
    competitor1: false,
    competitor2: false,
    competitor3: false
  },
  {
    feature: "Works Offline",
    altafToolsHub: true,
    competitor1: false,
    competitor2: false,
    competitor3: false
  },
  {
    feature: "Specific Size Targets",
    altafToolsHub: true,
    competitor1: false,
    competitor2: false,
    competitor3: false
  },
  {
    feature: "Data Privacy",
    altafToolsHub: "100%",
    competitor1: "Cloud",
    competitor2: "Cloud",
    competitor3: "Cloud"
  },
  {
    feature: "Processing Speed",
    altafToolsHub: "Instant",
    competitor1: "Fast",
    competitor2: "Fast",
    competitor3: "Fast"
  }
];

// Pre-defined comparison for general tools
export const generalToolsComparison: ComparisonFeature[] = [
  {
    feature: "Password Generator",
    altafToolsHub: true,
    competitor1: true,
    competitor2: true,
    competitor3: true
  },
  {
    feature: "QR Code Generator",
    altafToolsHub: true,
    competitor1: false,
    competitor2: true,
    competitor3: false
  },
  {
    feature: "Word Counter",
    altafToolsHub: true,
    competitor1: false,
    competitor2: false,
    competitor3: false
  },
  {
    feature: "Text OCR",
    altafToolsHub: true,
    competitor1: true,
    competitor2: true,
    competitor3: true
  },
  {
    feature: "Client-Side Only",
    altafToolsHub: true,
    competitor1: false,
    competitor2: false,
    competitor3: false
  },
  {
    feature: "Mobile Support",
    altafToolsHub: true,
    competitor1: true,
    competitor2: true,
    competitor3: true
  },
  {
    feature: "API Access",
    altafToolsHub: false,
    competitor1: true,
    competitor2: true,
    competitor3: true
  },
  {
    feature: "Batch Processing",
    altafToolsHub: "Coming",
    competitor1: true,
    competitor2: true,
    competitor3: true
  },
  {
    feature: "Price",
    altafToolsHub: "Free",
    competitor1: "$15/mo",
    competitor2: "$9/mo",
    competitor3: "$12/mo"
  },
  {
    feature: "Daily Limits",
    altafToolsHub: "None",
    competitor1: "Varies",
    competitor2: "2-3 files",
    competitor3: "2 files"
  }
];