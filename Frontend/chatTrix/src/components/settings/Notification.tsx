import { Switch } from "@/components/ui/switch";

export const Notifications = () => {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-8">Notifications</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="font-medium mb-4">Push notifications</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="likes" className="font-normal">Likes</label>
              <Switch id="likes" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="comments" className="font-normal">Comments</label>
              <Switch id="comments" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="comment-likes" className="font-normal">Comment Likes</label>
              <Switch id="comment-likes" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="follows" className="font-normal">Follows</label>
              <Switch id="follows" defaultChecked />
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="font-medium mb-4">Email notifications</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="email-feedback" className="font-normal">Feedback emails</label>
              <Switch id="email-feedback" />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="email-reminder" className="font-normal">Reminder emails</label>
              <Switch id="email-reminder" />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="email-product" className="font-normal">Product emails</label>
              <Switch id="email-product" />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="email-news" className="font-normal">News emails</label>
              <Switch id="email-news" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
