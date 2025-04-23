
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StoryItem {
  id: string;
  user: {
    id: string;
    username: string;
    profileImage: string;
  };
  image: string;
  timestamp: string;
}

interface StoryViewerProps {
  stories: StoryItem[];
  currentStoryId: string;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const StoryViewer = ({ 
  stories, 
  currentStoryId, 
  onClose, 
  onNext, 
  onPrevious 
}: StoryViewerProps) => {
  const [progress, setProgress] = useState(0);
  
  const currentStoryIndex = stories.findIndex(story => story.id === currentStoryId);
  const currentStory = stories[currentStoryIndex];
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress(prev => {
          const newProgress = prev + 0.5;
          if (newProgress >= 100) {
            clearInterval(timer);
            onNext();
          }
          return newProgress;
        });
      }
    }, 30);
    
    return () => clearInterval(timer);
  }, [currentStoryId, progress, onNext]);
  
  useEffect(() => {
    setProgress(0);
  }, [currentStoryId]);
  
  const handleClick = (e: React.MouseEvent) => {
    const { clientX } = e;
    const { innerWidth } = window;
    
    if (clientX < innerWidth / 2) {
      onPrevious();
    } else {
      onNext();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <button
        className="absolute top-4 right-4 z-10 text-white"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </button>
      
      <div className="absolute top-0 left-0 right-0 flex p-2">
        {stories.map((story, index) => (
          <div 
            key={story.id} 
            className="h-1 bg-gray-600 rounded-full flex-1 mx-1 overflow-hidden"
          >
            {index === currentStoryIndex && (
              <div 
                className="h-full bg-white"
                style={{ width: `${progress}%` }}
              />
            )}
            {index < currentStoryIndex && (
              <div className="h-full bg-white w-full" />
            )}
          </div>
        ))}
      </div>
      
      <div 
        className="absolute top-6 left-4 flex items-center text-white mt-4"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={currentStory.user.profileImage} alt={currentStory.user.username} />
          <AvatarFallback>{currentStory.user.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="ml-2 font-medium">{currentStory.user.username}</span>
      </div>
      
      <div 
        className="h-full w-full flex items-center justify-center"
        onClick={handleClick}
      >
        <img 
          src={currentStory.image} 
          alt="Story" 
          className="max-h-screen max-w-full object-contain"
        />
      </div>
    </div>
  );
};

export default StoryViewer;
