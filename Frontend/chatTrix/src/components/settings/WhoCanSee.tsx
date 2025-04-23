import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const WhoCanSee = () => {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-8">Who can see your content</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="font-medium mb-4">Profile visibility</h2>
          
          <RadioGroup defaultValue="followers" className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="everyone" id="everyone" />
              <Label htmlFor="everyone">Everyone</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="followers" id="followers" />
              <Label htmlFor="followers">Followers only</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="font-medium mb-4">Story and post sharing</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="story-sharing" className="font-normal">Allow sharing to stories</label>
              <Switch id="story-sharing" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="post-sharing" className="font-normal">Allow sharing of posts</label>
              <Switch id="post-sharing" defaultChecked />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="font-medium mb-4">Tags and mentions</h2>
          
          <RadioGroup defaultValue="everyone" className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="everyone" id="tags-everyone" />
              <Label htmlFor="tags-everyone">Everyone</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="followers" id="tags-followers" />
              <Label htmlFor="tags-followers">People you follow</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no-one" id="tags-no-one" />
              <Label htmlFor="tags-no-one">No one</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};
