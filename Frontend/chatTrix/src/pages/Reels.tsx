
import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send, Bookmark, Music, MoreVertical } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

// Mock data for reels
const MOCK_REELS = [
  {
    id: '1',
    user: {
      id: 'user1',
      username: 'johndoe',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39700-large.mp4',
    caption: 'Exploring new makeup trends ✨ #makeup #fashion',
    audioName: 'Original Audio - johndoe',
    likes: 5243,
    comments: 152,
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    user: {
      id: 'user2',
      username: 'janedoe',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    caption: 'Perfect day at the beach 🌊 #summer #beach',
    audioName: 'Summer Vibes - Popular Track',
    likes: 8762,
    comments: 324,
    isLiked: true,
    isSaved: true,
  },
  {
    id: '3',
    user: {
      id: 'user3',
      username: 'alexsmith',
      profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
    caption: 'Nature is amazing 🌿 #nature #flowers',
    audioName: 'Nature Sounds - relaxing',
    likes: 3219,
    comments: 98,
    isLiked: false,
    isSaved: false,
  },
];

interface ReelProps {
  id: string;
  user: {
    id: string;
    username: string;
    profileImage: string;
  };
  videoUrl: string;
  caption: string;
  audioName: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  onInView: (id: string) => void;
}

const Reel = ({ 
  id, 
  user, 
  videoUrl, 
  caption, 
  audioName, 
  likes, 
  comments, 
  isLiked: initialIsLiked,
  isSaved: initialIsSaved,
  onInView 
}: ReelProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          video.play();
          onInView(id);
        } else {
          video.pause();
        }
      },
      { threshold: 0.7 }
    );
    
    observerRef.current.observe(video);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [id, onInView]);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    // In a real app, you would make an API call to update the like
  };
  
  const handleSave = () => {
    setIsSaved(!isSaved);
    // In a real app, you would make an API call to update the save
  };
  
  return (
    <div className="relative h-full flex items-center bg-black">
      {/* Video */}
      <video 
        ref={videoRef}
        src={videoUrl}
        className="h-full w-full object-contain"
        loop
        muted
        playsInline
      />
      
      {/* Overlay with user info and caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center mb-2">
          <Link to={`/profile/${user.username}`} className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={user.profileImage} alt={user.username} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium mr-2">{user.username}</span>
          </Link>
          <Button size="sm" variant="outline" className="ml-2 text-white bg-transparent border-white">
            Follow
          </Button>
        </div>
        
        <p className="mb-2">{caption}</p>
        
        <div className="flex items-center">
          <Music className="h-4 w-4 mr-2" />
          <p className="text-sm">{audioName}</p>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-4">
        <div className="flex flex-col items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={handleLike}
          >
            <Heart className={`h-7 w-7 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <span className="text-white text-xs">{likeCount}</span>
        </div>
        
        <div className="flex flex-col items-center">
          <Button variant="ghost" size="icon" className="text-white">
            <MessageCircle className="h-7 w-7" />
          </Button>
          <span className="text-white text-xs">{comments}</span>
        </div>
        
        <Button variant="ghost" size="icon" className="text-white">
          <Send className="h-7 w-7" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white"
          onClick={handleSave}
        >
          <Bookmark className={`h-7 w-7 ${isSaved ? "fill-white" : ""}`} />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-white">
          <MoreVertical className="h-7 w-7" />
        </Button>
      </div>
    </div>
  );
};

const Reels = () => {
  const [reels, setReels] = useState(MOCK_REELS);
  const [activeReel, setActiveReel] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchReels = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch data from backend
        // const { data } = await api.get('/reels');
        // setReels(data.reels);
        
        // This is simulating a network request with mock data
        setTimeout(() => {
          setReels(MOCK_REELS);
          if (MOCK_REELS.length > 0) {
            setActiveReel(MOCK_REELS[0].id);
          }
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch reels:', error);
        toast({
          title: "Error",
          description: "Could not load reels. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchReels();
  }, []);
  
  const handleReelInView = (id: string) => {
    setActiveReel(id);
  };
  
  return (
    <MainLayout>
      <div className="max-w-md mx-auto h-[calc(100vh-8rem)]">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-pulse text-center">
              <p>Loading reels...</p>
            </div>
          </div>
        ) : (
          <div className="h-full snap-y snap-mandatory overflow-y-scroll scrollbar-none">
            {reels.map((reel) => (
              <div 
                key={reel.id} 
                className="h-full snap-start snap-always"
              >
                <Reel 
                  {...reel} 
                  onInView={handleReelInView}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Reels;
