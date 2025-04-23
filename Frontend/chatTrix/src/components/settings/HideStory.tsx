import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export const HideStory = () => {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-8">Hide story and live</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="font-medium mb-3">Hide story and live from</h2>
          <p className="text-gray-500 text-sm mb-4">
            People who can't see your story also can't see your live videos. They won't be notified that you've hidden stories or lives from them.
          </p>
          
          <Input 
            type="text" 
            placeholder="Search..." 
            className="w-full border-gray-300 mb-4" 
          />
          
          <div className="space-y-2 mt-6">
            <p className="text-gray-500 text-center py-4">
              You haven't hidden your story from anyone.
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Allow message replies</h2>
              <p className="text-gray-500 text-sm mt-1">
                Choose who can reply to your story.
              </p>
            </div>
          </div>
          
          <div className="mt-4 space-y-2 pl-2">
            <div className="flex items-center space-x-2">
              <input type="radio" id="everyone-reply" name="reply-control" defaultChecked />
              <label htmlFor="everyone-reply">Everyone</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" id="following-reply" name="reply-control" />
              <label htmlFor="following-reply">People you follow</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" id="no-one-reply" name="reply-control" />
              <label htmlFor="no-one-reply">Off</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
