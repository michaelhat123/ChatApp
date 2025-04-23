import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { Grid, Bookmark, Film, TagIcon, Settings, UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { generateColorFromString } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProfileUser {
  id: string;
  username: string;
  fullName: string;
  profileImage: string;
  bio: string;
  website: string;
  isVerified: boolean;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isCurrentUser: boolean;
}

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Fetch user info
        const { data: userData } = await api.get(`/users/${username}`);
        
        // Construct the full image URL
        const baseUrl = import.meta.env.VITE_API_URL || '';
        let fullImageUrl = userData.profileImage;

        // Only prepend baseUrl if the image is not a full URL (like ui-avatars.com)
        if (userData.profileImage && !userData.profileImage.startsWith('http')) {
          const imagePath = userData.profileImage.startsWith('/') 
            ? userData.profileImage 
            : `/${userData.profileImage}`;
          fullImageUrl = `${baseUrl}${imagePath}`;
        }

        // Test if the image exists before setting it
        const img = new Image();
        img.onload = () => {
          setProfileUser({
            ...userData,
            profileImage: fullImageUrl,
            isCurrentUser: currentUser?.id === userData.id,
            isFollowing: userData.isFollowing || false,
          });
        };
        img.onerror = () => {
          console.error('Profile image failed to load:', fullImageUrl);
          const initials = userData.fullName
            ?.split(' ')
            .map(name => name?.[0] || '')
            .join('')
            .toUpperCase() || '??';
          const color = generateColorFromString(userData.username);
          setProfileUser({
            ...userData,
            profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color.substring(1)}`,
            isCurrentUser: currentUser?.id === userData.id,
            isFollowing: userData.isFollowing || false,
          });
        };
        img.src = fullImageUrl;

        // Fetch posts
        const { data: postsData } = await api.get(`/users/${username}/posts`);
        setPosts(postsData);

        // Fetch reels
        const { data: reelsData } = await api.get(`/users/${username}/reels`);
        setReels(reelsData);

        // Fetch saved posts only if current user is viewing their own profile
        if (currentUser?.username === username) {
          const { data: savedData } = await api.get('/users/saved-posts');
          setSavedPosts(savedData);
        } else {
          setSavedPosts([]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username, currentUser]);

  const handleFollowToggle = async () => {
    if (!profileUser) return;
    
    await followUser();
  };

  const followUser = async () => {
    if (!profileUser) return;
    
    setFollowLoading(true);
    try {
      await api.post(`/users/${profileUser.id}/follow`);
      
      setProfileUser(prev => prev ? {
        ...prev,
        isFollowing: true,
        followersCount: prev.followersCount + 1,
      } : null);

      toast({
        title: "Success",
        description: `You are now following ${profileUser.username}`,
      });
    } catch (error) {
      console.error("Error following user:", error);
      toast({
        title: "Error",
        description: "Failed to follow user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFollowLoading(false);
    }
  };

  const unfollowUser = async () => {
    if (!profileUser) return;
    
    setFollowLoading(true);
    try {
      await api.post(`/users/${profileUser.id}/unfollow`);
      
      setProfileUser(prev => prev ? {
        ...prev,
        isFollowing: false,
        followersCount: prev.followersCount - 1,
      } : null);

      toast({
        title: "Success",
        description: `You have unfollowed ${profileUser.username}`,
      });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      toast({
        title: "Error",
        description: "Failed to unfollow user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFollowLoading(false);
      setShowUnfollowDialog(false);
    }
  };

  const PostGrid = ({ items }: { items: { id: string, image?: string, thumbnail?: string }[] }) => (
    <div>
      <div className="mb-2 text-right text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? 'post' : 'posts'}
      </div>
      <div className="grid grid-cols-3 gap-1">
        {items.map((item) => (
          <div key={item.id} className="aspect-square">
            <img
              src={item.image || item.thumbnail}
              alt="Post"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image load error:', e);
                e.currentTarget.src = '/default-post.png';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (loading || !profileUser) {
    return (
      <MainLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="animate-pulse text-center">
            <p>Loading profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-10 pb-8 border-b border-border relative">
          <Avatar className="h-20 w-20 md:h-36 md:w-36">
            <AvatarImage 
              src={profileUser.profileImage} 
              alt={profileUser.username}
              onError={(e) => {
                console.error('Profile image load error:', e);
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.fullName)}&background=${generateColorFromString(profileUser.username).substring(1)}`;
              }}
            />
            <AvatarFallback>{profileUser.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 mt-4 md:mt-0">
            <div className="flex flex-col md:flex-row md:items-center mb-4">
              <h1 className="text-xl font-medium mr-4">{profileUser.username}</h1>
              {profileUser.isCurrentUser ? (
                <Button variant="outline" size="sm" className="hover:bg-gray-200 dark:hover:bg-slate-900">
                  <Link to="/Edit">Edit Profile</Link>
                </Button>
              ) : (
                <div className="flex gap-2">
                  {!profileUser.isFollowing && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className="flex items-center gap-2"
                    >
                      {followLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span>Follow</span>
                      )}
                    </Button>
                  )}
                  {profileUser.isFollowing && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={followLoading}
                          className="text-black dark:text-white hover:bg-blue-900 hover:text-white dark:hover:bg-blue-900"
                        >
                          {followLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <div className="flex items-center gap-1">
                              <span>Following</span>
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-0 bg-white dark:bg-black">
                        <div className="flex flex-col items-center p-4">
                          <Avatar className="h-16 w-16 mb-2">
                            <AvatarImage 
                              src={profileUser.profileImage} 
                              alt={profileUser.username}
                              onError={(e) => {
                                console.error('Profile image load error:', e);
                                const color = generateColorFromString(profileUser.username);
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.fullName)}&background=${color.substring(1)}`;
                              }}
                            />
                            <AvatarFallback>{profileUser.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{profileUser.username}</span>
                        </div>
                        <Separator />
                        <DropdownMenuItem
                          onClick={() => setShowUnfollowDialog(true)}
                          className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/20 py-2"
                        >
                          Unfollow
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              )}
            </div>
            <div className="flex space-x-4 md:space-x-8 mb-4">
              <div>
                <span className="font-semibold">{posts.length}</span>
                {posts.length === 1 ? ' post' : ' posts'}
              </div>
              <div>
                <span className="font-semibold">{profileUser.followersCount}</span>
                {profileUser.followersCount === 1 ? ' follower' : ' followers'}
              </div>
              <div>
                <span className="font-semibold">{profileUser.followingCount}</span> following
              </div>
            </div>
            <div className="mb-4">
              <h2 className="font-semibold">{profileUser.fullName}</h2>
              {profileUser.bio && <p className="whitespace-pre-line">{profileUser.bio}</p>}
              {profileUser.website && (
                <a 
                  href={profileUser.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {profileUser.website}
                </a>
              )}
            </div>
          </div>
          {/* Settings Link */}
          {profileUser.isCurrentUser && (
            <Link
              to="/settings"
              className="absolute right-2 top-2 sm:right-[20px] flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Settings className="h-5 w-5" />
            </Link>
          )}
        </div>
        {/* Profile content */}
        <Tabs defaultValue="posts" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">
              <Grid className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Posts</span>
            </TabsTrigger>
            <TabsTrigger value="reels">
              <Film className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Reels</span>
            </TabsTrigger>
            {profileUser.isCurrentUser && (
              <TabsTrigger value="saved">
                <Bookmark className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Saved</span>
              </TabsTrigger>
            )}
            {!profileUser.isCurrentUser && (
              <TabsTrigger value="tagged">
                <TagIcon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Tagged</span>
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="posts" className="mt-6">
            {posts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No posts yet</p>
              </div>
            ) : (
              <PostGrid items={posts} />
            )}
          </TabsContent>
          <TabsContent value="reels" className="mt-6">
            {reels.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No reels yet</p>
              </div>
            ) : (
              <PostGrid items={reels} />
            )}
          </TabsContent>
          <TabsContent value="saved" className="mt-6">
            {savedPosts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No saved posts</p>
              </div>
            ) : (
              <PostGrid items={savedPosts} />
            )}
          </TabsContent>
          <TabsContent value="tagged" className="mt-6">
            <div className="text-center py-10">
              <p className="text-muted-foreground">No tagged posts</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Unfollow Confirmation Dialog */}
      <AlertDialog open={showUnfollowDialog} onOpenChange={setShowUnfollowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unfollow {profileUser.username}?</AlertDialogTitle>
            <AlertDialogDescription>
              Their posts will no longer show up in your home feed. You can still view their profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={unfollowUser}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:text-black"
            >
              Unfollow
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Profile;