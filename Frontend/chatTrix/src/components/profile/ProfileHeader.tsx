
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle.tsx";
import { Button } from "../ui/button";
import { ChevronLeft, Check, Loader2, X } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileHeaderProps {
  onSave: () => void;
  isSaving: boolean;
}

export function ProfileHeader({ onSave, isSaving }: ProfileHeaderProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCancel = () => {
    if (showConfirmation) {
      setShowConfirmation(false);
    } else {
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 backdrop-blur-md p-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold">Edit Profile</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Manage your account information
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        {showConfirmation ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground hidden sm:block">Discard changes?</span>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirmation(false)}
              className="h-9"
            >
              <X className="h-4 w-4 mr-1" />
              <span>No</span>
            </Button>
            <Link to="/">
              <Button 
                variant="destructive"
                size="sm"
                className="h-9"
              >
                <Check className="h-4 w-4 mr-1" />
                <span>Yes</span>
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <Button 
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-9"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={onSave} 
              disabled={isSaving}
              size="sm"
              className="gap-2 h-9"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </header>
    );
  }
