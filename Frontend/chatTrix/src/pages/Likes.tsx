
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface LikeItemProps {
  username: string;
  postImage: string;
  timestamp: string;
}

const LikeItem = ({ username, postImage, timestamp }: LikeItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 mr-3"></div>
        <div>
          <div className="font-semibold">{username}</div>
          <div className="text-gray-500 dark:text-gray-400 text-xs">liked your post • {timestamp}</div>
        </div>
      </div>
      <div className="h-12 w-12 rounded bg-gray-200 dark:bg-gray-800">
        {postImage && <img src={postImage} alt="Post" className="h-full w-full object-cover rounded" />}
      </div>
    </div>
  );
};

const Likes = () => {
  const recentLikes = [
    { id: 1, username: 'user1', postImage: 'https://source.unsplash.com/random/100x100?nature', timestamp: '2h ago' },
    { id: 2, username: 'user2', postImage: 'https://source.unsplash.com/random/100x100?food', timestamp: '3h ago' },
    { id: 3, username: 'user3', postImage: 'https://source.unsplash.com/random/100x100?travel', timestamp: '5h ago' },
    { id: 4, username: 'user4', postImage: 'https://source.unsplash.com/random/100x100?pets', timestamp: '1d ago' },
    { id: 5, username: 'user5', postImage: 'https://source.unsplash.com/random/100x100?art', timestamp: '2d ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-20 pb-10 px-4 max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            Activity
          </h1>
          <Link to="/">
            <Button variant="outline" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Likes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentLikes.map(like => (
              <LikeItem 
                key={like.id}
                username={like.username}
                postImage={like.postImage}
                timestamp={like.timestamp}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Likes;
