import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Appearance = () => {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Appearance</h1>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Dark Mode</Label>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark mode
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={handleThemeChange}
            />
            <Label htmlFor="dark-mode" className="sr-only">
              Dark Mode
            </Label>
          </div>
        </div>

        <div className="flex items-center space-x-4 p-4 rounded-lg border border-border">
          <div className="flex-1">
            <h3 className="font-medium">Preview</h3>
            <p className="text-sm text-muted-foreground">
              See how your app will look in {isDarkMode ? "dark" : "light"} mode
            </p>
          </div>
          <div className="p-2 rounded-full bg-muted">
            {isDarkMode ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appearance; 