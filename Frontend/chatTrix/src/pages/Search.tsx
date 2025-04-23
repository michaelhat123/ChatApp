import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Search as SearchIcon, Clock, User } from 'lucide-react';
import { Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ExplorePost {
    _id: string;
    images: string[];
    caption?: string;
    likes: string[];
    comments: any[];
}

interface UserSearchResult {
    _id: string;
    username: string;
    fullName: string;
    profileImage: string;
    isVerified?: boolean;
}

interface RecentSearchUser {
    _id: string;
    username: string;
    fullName: string;
    profileImage: string;
}

const RECENT_SEARCHES_KEY = 'recentSearchUsers';
const MAX_RECENT_SEARCHES = 5;

const Search = () => {
    const [explorePosts, setExplorePosts] = useState<ExplorePost[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [recentSearchUsers, setRecentSearchUsers] = useState<RecentSearchUser[]>(() => {
        const storedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
        return storedSearches ? JSON.parse(storedSearches) : [];
    });
    const { toast } = useToast();
    const navigate = useNavigate();

    const fetchExplore = async () => {
        setLoading(true);
        try {
            const { data } = await api.get<ExplorePost[]>('/posts/explore');
            setExplorePosts(data);
            setHasMore(data && data.length >= 30);
            setPage(1);
        } catch (error: any) {
            console.error('Failed to fetch explore content:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMorePosts = async () => {
        if (!hasMore || loadingMore || searchQuery) return;
        setLoadingMore(true);
        try {
            const { data } = await api.get<ExplorePost[]>(`/posts/explore?page=${page + 1}`);
            if (data && data.length > 0) {
                setExplorePosts((prevPosts) => [...prevPosts, ...data]);
                setPage((prevPage) => prevPage + 1);
                setHasMore(data.length >= 30);
            } else {
                setHasMore(false);
            }
        } catch (error: any) {
            console.error('Failed to fetch more explore content:', error.message);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchExplore();
    }, []);

    useEffect(() => {
        const searchUsers = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }

            setLoading(true);
            try {
                const { data } = await api.get<UserSearchResult[]>(`/search?q=${searchQuery}`);
                // Ensure profile images are properly formatted
                const formattedResults = data.map(user => ({
                    ...user,
                    profileImage: user.profileImage 
                        ? (user.profileImage.startsWith('http') 
                            ? user.profileImage 
                            : `${import.meta.env.VITE_API_URL}${user.profileImage}`)
                        : ''
                }));
                setSearchResults(formattedResults);
            } catch (error: any) {
                console.error('Search failed:', error.message);
                toast({
                    variant: "destructive",
                    title: "Search Error",
                    description: "Failed to search users. Please try again."
                });
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            searchUsers();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, toast]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
                !loading &&
                hasMore &&
                !searchQuery
            ) {
                fetchMorePosts();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore, fetchMorePosts, searchQuery]);

    const addRecentSearchUser = (user: RecentSearchUser) => {
        setRecentSearchUsers((prevSearches) => {
            const isDuplicate = prevSearches.some((u) => u._id === user._id);
            if (isDuplicate) {
                return prevSearches;
            }
            const updatedSearches = [user, ...prevSearches].slice(0, MAX_RECENT_SEARCHES);
            localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
            return updatedSearches;
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // We only store recent searches when a user is clicked
    };

    const handleRecentSearchClick = (user: RecentSearchUser) => {
        navigate(`/profile/${user.username}`);
    };

    const clearRecentSearches = () => {
        setRecentSearchUsers([]);
        localStorage.removeItem(RECENT_SEARCHES_KEY);
        toast({ description: 'Recent searches cleared.' });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto">
                {/* Search bar */}
                <div className="relative mb-2">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <SearchIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <form onSubmit={handleSearchSubmit}>
                        <Input
                            type="search"
                            placeholder="Search users..."
                            className="ps-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                {/* Recent Searched Users */}
                {recentSearchUsers.length > 0 && !searchQuery && (
                    <div className="mb-4 border border-border rounded-md bg-card p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>Recently Viewed Profiles</span>
                            </div>
                            <Button size="sm" variant="ghost" onClick={clearRecentSearches}>
                                Clear
                            </Button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {recentSearchUsers.map((user) => (
                                <Button
                                    key={user._id}
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => handleRecentSearchClick(user)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage 
                                                src={user.profileImage} 
                                                alt={user.username}
                                                onError={(e) => {
                                                    e.currentTarget.src = '';
                                                }}
                                            />
                                            <AvatarFallback className="text-xs">
                                                {getInitials(user.fullName || user.username)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{user.username}</span>
                                        <span className="text-xs text-muted-foreground">({user.fullName})</span>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search results */}
                {searchQuery && (
                    <div className="mb-6 border border-border rounded-md bg-card overflow-hidden">
                        {loading ? (
                            <div className="p-4 text-center">
                                <p>Searching...</p>
                            </div>
                        ) : searchResults.length === 0 ? (
                            <div className="p-4 text-center">
                                <p>No users found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {searchResults.map((user) => (
                                    <Link
                                        key={user._id}
                                        to={`/profile/${user.username}`}
                                        className="flex items-center p-3 hover:bg-muted transition-colors"
                                        onClick={() => addRecentSearchUser(user)}
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage 
                                                src={user.profileImage} 
                                                alt={user.username}
                                                onError={(e) => {
                                                    e.currentTarget.src = '';
                                                }}
                                            />
                                            <AvatarFallback className="text-sm">
                                                {getInitials(user.fullName || user.username)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="ml-3">
                                            <div className="flex items-center">
                                                <p className="font-medium">{user.username}</p>
                                                {user.isVerified && (
                                                    <svg className="w-4 h-4 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{user.fullName}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Grid of explore posts */}
                {!searchQuery && (
                    loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="aspect-square bg-muted animate-pulse rounded-md" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {explorePosts.map((post) => (
                                <div key={post._id} className="relative group aspect-square">
                                    <img
                                        src={post.images[0]}
                                        alt={post.caption || 'Post'}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-md">
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="flex space-x-4">
                                                <div className="flex items-center space-x-1">
                                                    <Heart className="w-6 h-6 text-white" />
                                                    <span className="text-white">{post.likes.length}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <MessageCircle className="w-6 h-6 text-white" />
                                                    <span className="text-white">{post.comments.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </MainLayout>
    );
};

export default Search;