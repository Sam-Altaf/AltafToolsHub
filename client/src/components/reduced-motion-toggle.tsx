import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, EyeOff, Monitor } from "lucide-react";
import { useReducedMotionContext } from "./reduced-motion-provider";

export function ReducedMotionToggle() {
  const { reducedMotion, userPreference, setUserPreference } = useReducedMotionContext();

  const handlePreferenceChange = (preference: boolean | null) => {
    setUserPreference(preference);
  };

  const getIcon = () => {
    if (userPreference === true) return Eye;
    if (userPreference === false) return EyeOff;
    return Monitor;
  };

  const getLabel = () => {
    if (userPreference === true) return "Reduce Motion";
    if (userPreference === false) return "Enable Motion";
    return "System Default";
  };

  const Icon = getIcon();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={`Motion preference: ${getLabel()}`}
          data-testid="button-motion-toggle"
        >
          <Icon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handlePreferenceChange(null)}
          className={userPreference === null ? "bg-accent" : ""}
        >
          <Monitor className="mr-2 h-4 w-4" />
          System Default
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handlePreferenceChange(false)}
          className={userPreference === false ? "bg-accent" : ""}
        >
          <EyeOff className="mr-2 h-4 w-4" />
          Enable Motion
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handlePreferenceChange(true)}
          className={userPreference === true ? "bg-accent" : ""}
        >
          <Eye className="mr-2 h-4 w-4" />
          Reduce Motion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}