import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const AccountPrivacy = () => {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-8">Account Privacy</h1>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Private account</h2>
              <p className="text-gray-500 text-sm mt-1">
                When your account is private, only people you approve can see your photos and videos. Your existing followers won't be affected.
              </p>
            </div>
            <Switch id="private-account" />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Activity status</h2>
              <p className="text-gray-500 text-sm mt-1">
                Allow accounts you follow and anyone you message to see when you were last active or are currently active on Instagram apps. When this is turned off, you won't be able to see the activity status of other accounts.
              </p>
            </div>
            <Switch id="activity-status" defaultChecked />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Story sharing</h2>
              <p className="text-gray-500 text-sm mt-1">
                Allow people to share your story as messages.
              </p>
            </div>
            <Switch id="story-sharing" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
};
