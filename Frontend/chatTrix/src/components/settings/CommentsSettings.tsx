import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const CommentsSettings = () => {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-8">Comments</h1>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Hide offensive comments</h2>
              <p className="text-gray-500 text-sm mt-1">
                Automatically hide comments that may be offensive from your posts.
              </p>
            </div>
            <Switch id="hide-offensive" defaultChecked />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Manual filter</h2>
              <p className="text-gray-500 text-sm mt-1">
                Hide comments that contain specific words or phrases from your posts.
              </p>
            </div>
            <Switch id="manual-filter" />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Comment control</h2>
              <p className="text-gray-500 text-sm mt-1">
                Choose who can comment on your posts.
              </p>
            </div>
          </div>
          
          <div className="mt-4 space-y-2 pl-2">
            <div className="flex items-center space-x-2">
              <input type="radio" id="everyone" name="comment-control" defaultChecked />
              <label htmlFor="everyone">Everyone</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" id="following" name="comment-control" />
              <label htmlFor="following">People you follow</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" id="followers" name="comment-control" />
              <label htmlFor="followers">Your followers</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
