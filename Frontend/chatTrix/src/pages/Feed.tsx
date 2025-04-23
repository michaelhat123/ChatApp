import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StoriesBar from '@/components/stories/StoriesBar';
import Post from '../components/posts/post.jsx';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

// Mock data for development
const MOCK_STORIES = [
  {
    id: '1',
    user: {
      id: 'user1',
      username: 'johndoe',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    timestamp: new Date().toISOString(),
    viewed: false,
  },
  {
    id: '2',
    user: {
      id: 'user2',
      username: 'janedoe',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    image: 'https://images.unsplash.com/photo-1511300636408-a63a89df3482?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    timestamp: new Date().toISOString(),
    viewed: false,
  },
  {
    id: '3',
    user: {
      id: 'user3',
      username: 'alexsmith',
      profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    timestamp: new Date().toISOString(),
    viewed: true,
  },
  {
    id: '4',
    user: {
      id: 'user4',
      username: 'sarahj',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    timestamp: new Date().toISOString(),
    viewed: false,
  },
  {
    id: '5',
    user: {
      id: 'user5',
      username: 'michaelw',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    timestamp: new Date().toISOString(),
    viewed: true,
  },
];

const MOCK_POSTS = [
  {
    id: '1',
    user: {
      id: 'user1',
      username: 'johndoe',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Enjoying the beautiful view! 🌄 #nature #travel',
    likes: 125,
    comments: [
      {
        id: 'c1',
        user: { username: 'janedoe' },
        text: 'Stunning view! Where is this?',
      },
      {
        id: 'c2',
        user: { username: 'alexsmith' },
        text: 'Looks amazing!',
      },
    ],
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    user: {
      id: 'user3',
      username: 'alexsmith',
      profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Food is always a good idea 🍕 #foodie #dinner',
    likes: 89,
    comments: [
      {
        id: 'c3',
        user: { username: 'sarahj' },
        text: 'This looks delicious! Recipe please!',
      },
    ],
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    isLiked: true,
    isSaved: true,
  },
  {
    id: '3',
    user: {
      id: 'user2',
      username: 'janedoe',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    image: 'https://images.unsplash.com/photo-1682686580186-b55d2a91053c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    caption: 'Weekend getaway with friends ✨ #friends #weekend',
    likes: 211,
    comments: [
      {
        id: 'c4',
        user: { username: 'johndoe' },
        text: 'Looks like you had a great time!',
      },
      {
        id: 'c5',
        user: { username: 'michaelw' },
        text: 'The place looks amazing!',
      },
      {
        id: 'c6',
        user: { username: 'sarahj' },
        text: 'Next time invite me too!',
      },
    ],
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isLiked: false,
    isSaved: false,
  },
];

const Feed = () => {
  const [stories, setStories] = useState(MOCK_STORIES);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch data from backend
        // const { data } = await api.get('/posts/feed');
        // setPosts(data.posts);
        
        // This is simulating a network request with mock data
        setTimeout(() => {
          setPosts(MOCK_POSTS);
          setStories(MOCK_STORIES);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch feed:', error);
        toast({
          title: "Error",
          description: "Could not load feed. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchFeed();
  }, []);
  
  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-screen">
        <div className="max-w-[470px] w-full">
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="animate-pulse text-center">
                <p>Loading feed...</p>
              </div>
            </div>
          ) : (
            <>
              <StoriesBar stories={stories} />
              
              <div className="mt-6">
                {posts.map((post) => (
                  <Post key={post.id} {...post} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Feed;
