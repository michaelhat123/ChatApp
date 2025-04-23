
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Comment {
  id: string;
  user: {
    username: string;
  };
  text: string;
}

interface PostProps {
  id: string;
  user: {
    id: string;
    username: string;
    profileImage: string;
  };
  image: string;
  caption: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
  isLiked: boolean;
  isSaved: boolean;
}

const Post = ({
  id,
  user,
  image,
  caption,
  likes,
  comments,
  timestamp,
  isLiked: initialIsLiked,
  isSaved: initialIsSaved,
}: PostProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [showAllComments, setShowAllComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    // Here you would make an API call to update the like status
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Here you would make an API call to update the save status
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Here you would make an API call to post the comment
      setNewComment('');
    }
  };

  const displayedComments = showAllComments 
    ? comments 
    : comments.slice(0, 2);

  return (
    <div className="border border-border rounded-md mb-6 bg-card">
      {/* Post header */}
      <div className="flex items-center justify-between p-3">
        <Link to={`/profile/${user.username}`} className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profileImage} alt={user.username} />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.username}</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report</DropdownMenuItem>
            <DropdownMenuItem>Unfollow</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Post image */}
      <div className="relative">
        <img 
          src={image} 
          alt="Post" 
          className="w-full max-h-[600px] object-cover"
          onDoubleClick={handleLike}
        />
      </div>

      {/* Post actions */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLike}
            className={isLiked ? "text-red-500" : ""}
          >
            <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <Send className="h-6 w-6" />
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleSave}
        >
          <Bookmark className={`h-6 w-6 ${isSaved ? "fill-current" : ""}`} />
        </Button>
      </div>

      {/* Likes */}
      <div className="px-3 font-medium">
        {likeCount} likes
      </div>

      {/* Caption and comments */}
      <div className="px-3 pt-2">
        <div className="mb-2">
          <Link to={`/profile/${user.username}`} className="font-medium mr-2">
            {user.username}
          </Link>
          <span className="text-foreground">{caption}</span>
        </div>

        {comments.length > 2 && !showAllComments && (
          <button 
            className="text-muted-foreground text-sm mb-1"
            onClick={() => setShowAllComments(true)}
          >
            View all {comments.length} comments
          </button>
        )}

        {displayedComments.map((comment) => (
          <div key={comment.id} className="mb-1">
            <Link to={`/profile/${comment.user.username}`} className="font-medium mr-2">
              {comment.user.username}
            </Link>
            <span className="text-foreground">{comment.text}</span>
          </div>
        ))}

        {/* Timestamp */}
        <div className="text-xs text-muted-foreground mt-1 mb-3">
          {formatDistanceToNow(new Date(timestamp))} ago
        </div>
      </div>

      {/* Add comment */}
      <form 
        onSubmit={handleSubmitComment}
        className="flex items-center border-t border-border p-3"
      >
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 bg-transparent border-none focus:outline-none"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button 
          type="submit" 
          variant="ghost"
          className="text-primary font-medium"
          disabled={!newComment.trim()}
        >
          Post
        </Button>
      </form>
    </div>
  );
};

export default Post;
