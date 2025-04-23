
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Info, Phone, Video, Send, Image, Mic, Smile } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for conversations
const MOCK_CONVERSATIONS = {
  'c1': {
    id: 'c1',
    user: {
      id: 'user1',
      username: 'johndoe',
      fullName: 'John Doe',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      isOnline: true,
      lastActive: '2023-05-15T14:40:00Z',
    },
    messages: [
      {
        id: 'm1',
        senderId: 'user1',
        text: 'Hey, how are you?',
        timestamp: '2023-05-15T14:30:00Z',
        isRead: true,
      },
      {
        id: 'm2',
        senderId: 'currentUser',
        text: 'I\'m good! Just finished a new project.',
        timestamp: '2023-05-15T14:32:00Z',
        isRead: true,
      },
      {
        id: 'm3',
        senderId: 'user1',
        text: 'That\'s great! What kind of project?',
        timestamp: '2023-05-15T14:35:00Z',
        isRead: true,
      },
      {
        id: 'm4',
        senderId: 'currentUser',
        text: 'It\'s a mobile app for tracking fitness goals. I\'ll send you some screenshots later!',
        timestamp: '2023-05-15T14:38:00Z',
        isRead: true,
      },
    ],
  },
  'c2': {
    id: 'c2',
    user: {
      id: 'user2',
      username: 'janedoe',
      fullName: 'Jane Doe',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      isOnline: false,
      lastActive: '2023-05-15T11:20:00Z',
    },
    messages: [
      {
        id: 'm1',
        senderId: 'user2',
        text: 'Did you see my latest post?',
        timestamp: '2023-05-15T10:10:00Z',
        isRead: false,
      },
      {
        id: 'm2',
        senderId: 'user2',
        text: 'I think you\'ll like it!',
        timestamp: '2023-05-15T10:15:00Z',
        isRead: false,
      },
    ],
  },
  'c3': {
    id: 'c3',
    user: {
      id: 'user3',
      username: 'alexsmith',
      fullName: 'Alex Smith',
      profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      isOnline: true,
      lastActive: '2023-05-15T14:45:00Z',
    },
    messages: [
      {
        id: 'm1',
        senderId: 'currentUser',
        text: 'Hey Alex, I wanted to recommend that book we talked about.',
        timestamp: '2023-05-14T18:30:00Z',
        isRead: true,
      },
      {
        id: 'm2',
        senderId: 'currentUser',
        text: 'It\'s called "Atomic Habits" by James Clear.',
        timestamp: '2023-05-14T18:32:00Z',
        isRead: true,
      },
      {
        id: 'm3',
        senderId: 'user3',
        text: 'Thanks for the recommendation!',
        timestamp: '2023-05-14T18:45:00Z',
        isRead: true,
      },
    ],
  },
};

const Messenger = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user: currentUser } = useAuth();
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchConversation = async () => {
      if (!conversationId) return;
      
      setLoading(true);
      try {
        // In a real app, you would fetch data from backend
        // const { data } = await api.get(`/conversations/${conversationId}`);
        // setConversation(data.conversation);
        
        // This is simulating a network request with mock data
        setTimeout(() => {
          setConversation(MOCK_CONVERSATIONS[conversationId as keyof typeof MOCK_CONVERSATIONS] || null);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Failed to fetch conversation:', error);
        toast({
          title: "Error",
          description: "Could not load conversation. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchConversation();
  }, [conversationId]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;
    
    // Create a new message
    const newMsg = {
      id: `m${Date.now()}`,
      senderId: 'currentUser',
      text: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    
    // Update local state
    setConversation({
      ...conversation,
      messages: [...conversation.messages, newMsg],
    });
    setNewMessage('');
    
    // In a real app, you would send this to the backend
    // api.post(`/conversations/${conversationId}/messages`, { text: newMessage });
  };
  
  if (!conversationId) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto">
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Select a conversation to start chatting</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="animate-pulse text-center">
            <p>Loading messages...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!conversation) {
    return (
      <MainLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Conversation not found</p>
            <Link to="/chat" className="text-primary hover:underline block mt-2">
              Back to all messages
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Conversation header */}
        <div className="border-b border-border p-4 flex items-center justify-between bg-card rounded-t-md">
          <div className="flex items-center">
            <Link to="/chat" className="mr-2">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link to={`/profile/${conversation.user.username}`} className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={conversation.user.profileImage} alt={conversation.user.username} />
                <AvatarFallback>{conversation.user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{conversation.user.username}</p>
                <p className="text-xs text-muted-foreground">
                  {conversation.user.isOnline 
                    ? 'Active now' 
                    : `Active ${formatDistanceToNow(new Date(conversation.user.lastActive))} ago`
                  }
                </p>
              </div>
            </Link>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.messages.map((message: any) => {
            const isCurrentUser = message.senderId === 'currentUser';
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    <AvatarImage src={conversation.user.profileImage} alt={conversation.user.username} />
                    <AvatarFallback>{conversation.user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                
                <div className="max-w-xs">
                  <div 
                    className={`p-3 rounded-3xl ${
                      isCurrentUser 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted rounded-tl-none'
                    }`}
                  >
                    <p>{message.text}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(message.timestamp))} ago
                    {isCurrentUser && message.isRead && ' • Seen'}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message input */}
        <form 
          onSubmit={handleSendMessage}
          className="border-t border-border p-4 flex items-center space-x-2 bg-card rounded-b-md"
        >
          <Button type="button" variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            className="flex-1"
            placeholder="Message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          {newMessage.trim() ? (
            <Button type="submit" size="icon" className="rounded-full">
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button type="button" variant="ghost" size="icon">
                <Mic className="h-5 w-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon">
                <Image className="h-5 w-5" />
              </Button>
            </>
          )}
        </form>
      </div>
    </MainLayout>
  );
};

export default Messenger;
