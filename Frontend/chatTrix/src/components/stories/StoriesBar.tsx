
import { useState } from 'react';
import Story from './story.tsx';
import StoryViewer from './StoryViewer';

interface StoryItem {
  id: string;
  user: {
    id: string;
    username: string;
    profileImage: string;
  };
  image: string;
  timestamp: string;
  viewed: boolean;
}

interface StoriesBarProps {
  stories: StoryItem[];
}

const StoriesBar = ({ stories }: StoriesBarProps) => {
  const [activeStory, setActiveStory] = useState<string | null>(null);
  
  const handleStoryClick = (id: string) => {
    setActiveStory(id);
  };
  
  const handleCloseStory = () => {
    setActiveStory(null);
  };
  
  const handleNextStory = () => {
    if (!activeStory) return;
    
    const currentIndex = stories.findIndex(story => story.id === activeStory);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < stories.length) {
      setActiveStory(stories[nextIndex].id);
    } else {
      handleCloseStory();
    }
  };
  
  const handlePreviousStory = () => {
    if (!activeStory) return;
    
    const currentIndex = stories.findIndex(story => story.id === activeStory);
    const prevIndex = currentIndex - 1;
    
    if (prevIndex >= 0) {
      setActiveStory(stories[prevIndex].id);
    }
  };
  
  return (
    <>
      <div className="flex overflow-x-auto py-4 scrollbar-none">
        {stories.map((story) => (
          <Story
            key={story.id}
            id={story.id}
            user={story.user}
            viewed={story.viewed}
            onClick={handleStoryClick}
          />
        ))}
      </div>
      
      {activeStory && (
        <StoryViewer
          stories={stories}
          currentStoryId={activeStory}
          onClose={handleCloseStory}
          onNext={handleNextStory}
          onPrevious={handlePreviousStory}
        />
      )}
    </>
  );
};

export default StoriesBar;
