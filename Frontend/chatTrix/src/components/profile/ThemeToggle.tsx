import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "../ui/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center gap-2 rounded-full border-border/50"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-4 w-4 transition-all" />
          <span className="text-xs font-medium hidden sm:inline-block">Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 transition-all" />
          <span className="text-xs font-medium hidden sm:inline-block">Light Mode</span>
        </>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
