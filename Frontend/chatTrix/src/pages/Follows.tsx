
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface UserItemProps {
  username: string;
  fullName: string;
  isFollowing?: boolean;
}

const UserItem = ({ username, fullName, isFollowing }: UserItemProps) => {
  const [following, setFollowing] = useState(isFollowing || false);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 mr-3"></div>
        <div>
          <div className="font-semibold">{username}</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">{fullName}</div>
        </div>
      </div>
      <Button 
        variant={following ? "outline" : "default"}
        size="sm"
        onClick={() => setFollowing(!following)}
      >
        {following ? 'Following' : 'Follow'}
      </Button>
    </div>
  );
};

const Follows = () => {
  const followers = [
    { id: 1, username: 'user1', fullName: 'User One', isFollowing: true },
    { id: 2, username: 'user2', fullName: 'User Two', isFollowing: false },
    { id: 3, username: 'user3', fullName: 'User Three', isFollowing: true },
    { id: 4, username: 'user4', fullName: 'User Four', isFollowing: false },
    { id: 5, username: 'user5', fullName: 'User Five', isFollowing: true },
  ];

  const following = [
    { id: 1, username: 'user1', fullName: 'User One' },
    { id: 6, username: 'user6', fullName: 'User Six' },
    { id: 7, username: 'user7', fullName: 'User Seven' },
    { id: 8, username: 'user8', fullName: 'User Eight' },
    { id: 9, username: 'user9', fullName: 'User Nine' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-20 pb-10 px-4 max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-500" />
            Connections
          </h1>
          <Link to="/">
            <Button variant="outline" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="followers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          
          <TabsContent value="followers">
            <Card>
              <CardContent className="p-0">
                {followers.map(user => (
                  <UserItem 
                    key={user.id}
                    username={user.username}
                    fullName={user.fullName}
                    isFollowing={user.isFollowing}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="following">
            <Card>
              <CardContent className="p-0">
                {following.map(user => (
                  <UserItem 
                    key={user.id}
                    username={user.username}
                    fullName={user.fullName}
                    isFollowing={true}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Follows;
