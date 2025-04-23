import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const HiddenWords = () => {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Hidden Words</h1>
      <p className="text-gray-500 mb-6">
        Manage your list of hidden words and phrases.
      </p>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Hide offensive comments</h2>
              <p className="text-gray-500 text-sm mt-1">
                Hide comments that may be offensive from your posts and videos.
              </p>
            </div>
            <Switch id="hide-comments" defaultChecked />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Advanced comment filtering</h2>
              <p className="text-gray-500 text-sm mt-1">
                Hide comments that contain specific words, phrases, or emoji that you add to the list below.
              </p>
            </div>
            <Switch id="advanced-filtering" />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Filter message requests</h2>
              <p className="text-gray-500 text-sm mt-1">
                Hide message requests that may contain offensive content or spam.
              </p>
            </div>
            <Switch id="filter-messages" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
};
