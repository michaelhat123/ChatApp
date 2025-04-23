import { useState } from "react";
import { 
  User, Bell, Eye, Lock, Star, Ban, Video, MessageCircle, 
  AtSign, MessageSquare, Share, UserX, Type, Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import exp from "constants";

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
};

interface SettingsSidebarProps {
  activeItem: string;
  onSelectItem: (id: string) => void;
}

 const SettingsSidebar = ({ activeItem, onSelectItem }: SettingsSidebarProps) => {
  const iconSize = 20;
  const isMobile = useIsMobile();
  
  const navItems: NavItem[] = [
    { id: "edit-profile", label: "Edit Profile", icon: <User size={iconSize} /> },
    { id: "appearance", label: "Appearance", icon: <Palette size={iconSize} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={iconSize} /> },
    { id: "who-can-see", label: "Who can see your content", icon: <Eye size={iconSize} />, section: "privacy" },
    { id: "account-privacy", label: "Account privacy", icon: <Lock size={iconSize} /> },
    { id: "close-friends", label: "Close Friends", icon: <Star size={iconSize} /> },
    { id: "blocked", label: "Blocked", icon: <Ban size={iconSize} /> },
    { id: "hide-story", label: "Hide story and live", icon: <Video size={iconSize} /> },
    { id: "messages", label: "Messages and story replies", icon: <MessageCircle size={iconSize} />, section: "interaction" },
    { id: "tags", label: "Tags and mentions", icon: <AtSign size={iconSize} /> },
    { id: "comments", label: "Comments", icon: <MessageSquare size={iconSize} /> },
    { id: "sharing", label: "Sharing and reuse", icon: <Share size={iconSize} /> },
    { id: "restricted", label: "Restricted accounts", icon: <UserX size={iconSize} /> },
    { id: "hidden-words", label: "Hidden words", icon: <Type size={iconSize} /> }
  ];
  
  return (
    <div className={cn(
      "bg-background border-r border-border h-full overflow-y-auto",
      isMobile ? "w-full" : "w-64"
    )}>
      <nav className="py-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              {item.section && (
                <div className="px-6 py-3 text-sm text-muted-foreground">
                  {item.section === "privacy" && "Who can see your content"}
                  {item.section === "interaction" && "How others can interact with you"}
                </div>
              )}
              <button
                onClick={() => onSelectItem(item.id)}
                className={cn(
                  "w-full flex items-center px-6 py-3 text-sm hover:bg-accent",
                  activeItem === item.id ? "font-semibold" : ""
                )}
              >
                <span className="mr-3 text-foreground">{item.icon}</span>
                <span className="text-foreground">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SettingsSidebar;