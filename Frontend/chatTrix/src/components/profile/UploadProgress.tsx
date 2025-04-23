import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
}

export function UploadProgress({
  isUploading,
  progress,
}: UploadProgressProps) {
  const [visible, setVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (isUploading) {
      setVisible(true);
      setCompleted(false);
      setFailed(false);
    } else if (progress >= 100) {
      setCompleted(true);
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [isUploading, progress]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-80 -translate-x-1/2 rounded-lg bg-background p-4 shadow-lg border border-border/50">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {completed ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : failed ? (
            <X className="h-4 w-4 text-red-500" />
          ) : (
            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          )}
          <h3 className="text-sm font-medium">
            {completed 
              ? "Upload complete" 
              : failed 
              ? "Upload failed" 
              : "Uploading image..."}
          </h3>
        </div>
        <span className="text-xs font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-1.5" />
      {completed && (
        <p className="mt-2 text-xs text-muted-foreground">
          Your new profile picture has been uploaded
        </p>
      )}
      {failed && (
        <p className="mt-2 text-xs text-red-500">
          Please try again or select a different image
        </p>
      )}
    </div>
    );
  }
