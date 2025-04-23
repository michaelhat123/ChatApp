import  EditProfile  from "./EditProfile";
import { Notifications } from "./Notification";
import { AccountPrivacy } from "./AccountPrivacy";
import { CloseFriends } from "./CloseFriends";
import { Blocked } from "./Blocked";
import { HiddenWords } from "./HiddenWords";
import { WhoCanSee } from "./WhoCanSee";
import { CommentsSettings } from "./CommentsSettings";
import { HideStory } from "./HideStory";
import Appearance from "./Appearance";

interface SettingsContentProps {
  activeSection: string;
}

 const SettingsContent = ({ activeSection }: SettingsContentProps) => {
  const renderContent = () => {
    switch (activeSection) {
      case "edit-profile":
        return <EditProfile />;
      case "appearance":
        return <Appearance />;
      case "notifications":
        return <Notifications />;
      case "account-privacy":
        return <AccountPrivacy />;
      case "close-friends":
        return <CloseFriends />;
      case "blocked":
        return <Blocked />;
      case "hidden-words":
        return <HiddenWords />;
      case "who-can-see":
        return <WhoCanSee />;
      case "comments":
        return <CommentsSettings />;
      case "hide-story":
        return <HideStory />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4 capitalize">
              {activeSection.split("-").join(" ")}
            </h1>
            <p className="text-muted-foreground">
              This section is under development.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {renderContent()}
    </div>
  );
};

export default SettingsContent;