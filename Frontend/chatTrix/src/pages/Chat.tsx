
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

// Mock data for conversations
const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    user: {
      id: 'user1',
      username: 'johndoe',
      fullName: 'John Doe',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    lastMessage: {
      text: 'Hey, how are you?',
      timestamp: '2023-05-15T14:30:00Z',
      isRead: true,
      isSent: false,
    },
    unreadCount: 0,
  },
  {
    id: 'c2',
    user: {
      id: 'user2',
      username: 'janedoe',
      fullName: 'Jane Doe',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    lastMessage: {
      text: 'Did you see my latest post?',
      timestamp: '2023-05-15T10:15:00Z',
      isRead: false,
      isSent: false,
    },
    unreadCount: 2,
  },
  {
    id: 'c3',
    user: {
      id: 'user3',
      username: 'alexsmith',
      fullName: 'Alex Smith',
      profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    lastMessage: {
      text: 'Thanks for the recommendation!',
      timestamp: '2023-05-14T18:45:00Z',
      isRead: true,
      isSent: true,
    },
    unreadCount: 0,
  },
  {
    id: 'c4',
    user: {
      id: 'user4',
      username: 'sarahj',
      fullName: 'Sarah Johnson',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    lastMessage: {
      text: 'Let me know when you\'re free',
      timestamp: '2023-05-13T09:20:00Z',
      isRead: true,
      isSent: false,
    },
    unreadCount: 0,
  },
];

const Chat = () => {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch data from backend
        // const { data } = await api.get('/conversations');
        // setConversations(data.conversations);
        
        // This is simulating a network request with mock data
        setTimeout(() => {
          setConversations(MOCK_CONVERSATIONS);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        toast({
          title: "Error",
          description: "Could not load conversations. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, []);
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today: show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // This week: show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older: show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <Button variant="ghost" size="icon">
            <Edit className="h-5 w-5" />
          </Button>
        </div>
        
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="animate-pulse text-center">
              <p>Loading conversations...</p>
            </div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No messages yet</p>
            <Button className="mt-4">Start a Conversation</Button>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <Link 
                key={conversation.id} 
                to={`/direct/inbox/${conversation.id}`}
                className="flex items-center p-3 hover:bg-muted rounded-md transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.user.profileImage} alt={conversation.user.username} />
                    <AvatarFallback>{conversation.user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {conversation.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{conversation.user.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(conversation.lastMessage.timestamp)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-medium' : 'text-muted-foreground'}`}>
                      {conversation.lastMessage.isSent && 'You: '}
                      {conversation.lastMessage.text}
                    </p>
                    {conversation.lastMessage.isRead && conversation.lastMessage.isSent && (
                      <span className="text-xs text-muted-foreground">Seen</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Chat;
