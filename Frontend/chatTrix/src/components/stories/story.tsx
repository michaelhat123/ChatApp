
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StoryProps {
  id: string;
  user: {
    id: string;
    username: string;
    profileImage: string;
  };
  viewed: boolean;
  onClick: (id: string) => void;
}

const Story = ({ id, user, viewed, onClick }: StoryProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="flex flex-col items-center mr-4 cursor-pointer"
      onClick={() => onClick(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`p-[2px] rounded-full ${viewed ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}>
        <div className="p-[2px] bg-background rounded-full">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.profileImage} alt={user.username} />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <span className="text-xs mt-1 max-w-16 truncate">{user.username}</span>
    </div>
  );
};

export default Story;
