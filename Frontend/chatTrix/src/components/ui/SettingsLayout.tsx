
import { useState, useEffect } from "react";
import  SettingsSidebar  from "./SettingsSidebar";
import SettingsContent from "../settings/SettingsContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { MenuIcon, ChevronLeft, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

 const SettingsLayout = () => {
  const [activeSection, setActiveSection] = useState("edit-profile");
  const isMobile = useIsMobile();
  const [showContent, setShowContent] = useState(!isMobile);

  
  // Handle responsive behavior
  useEffect(() => {
    setShowContent(!isMobile);
  }, [isMobile]);

  const handleSelectItem = (id: string) => {
    setActiveSection(id);
    if (isMobile) {
      setShowContent(true);
    }
  };

  const handleBackToMenu = () => {
    setShowContent(false);
  };

  // Desktop view
  if (!isMobile) {
    return (
      <div className="flex min-h-screen bg-background ml-[100px]">
        <div className="w-64 flex-shrink-0 flex flex-col h-screen">
          <ScrollArea className="flex-1">
            <SettingsSidebar activeItem={activeSection} onSelectItem={handleSelectItem} />
          </ScrollArea>
        </div>
        <div className="flex-1 border-l border-border flex flex-col h-screen">
          <div className="px-6 py-4 border-b border-border flex justify-between items-center">
            <h1 className="text-lg font-semibold">Settings</h1>
          </div>
          <ScrollArea className="flex-1">
            <SettingsContent activeSection={activeSection} />
          </ScrollArea>
        </div>
      </div>
    );
  }

  // Mobile view
  return (
    <div className="min-h-screen bg-background">
      {!showContent ? (
        // Mobile sidebar view
        <div className="flex flex-col h-screen">
          <div className="px-4 py-3 border-b border-border flex justify-between items-center">
            <h1 className="text-lg font-semibold">Settings</h1>
          </div>
          <ScrollArea className="flex-1">
            <SettingsSidebar activeItem={activeSection} onSelectItem={handleSelectItem} />
          </ScrollArea>
        </div>
      ) : (
        // Mobile content view
        <div className="flex flex-col h-screen">
          <div className="px-4 py-3 border-b border-border flex justify-between items-center">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={handleBackToMenu} className="mr-2">
                <ChevronLeft size={20} />
              </Button>
              <h1 className="text-lg font-semibold capitalize">
                {activeSection.split("-").join(" ")}
              </h1>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <SettingsContent activeSection={activeSection} />
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SettingsLayout;