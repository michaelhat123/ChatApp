import React, { useState, useCallback, useEffect } from 'react';
import {
  Bell,
  CheckCircle,
  Heart,
  User,
  MessageCircle,
  MinusCircle, // Added for potential "Mark All" state
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';


// Define the structure for a notification
interface Notification {
  id: string; // Unique identifier for the notification
  type: 'like' | 'comment' | 'follow' | 'message' | 'system'; // Type of notification
  userId?: string; // ID of the user involved (optional for system notifications)
  userFullName?: string; // Full name of the user involved (optional for system)
  userProfileImage?: string; // Profile image URL of the user involved (optional for system)
  createdAt: string; // Timestamp of when the notification was created
  read: boolean; // Status indicating if the notification has been read
  content?: string; // Main content of the notification (e.g., comment text, message snippet)
  postId?: string; // ID of the related post (optional)
}

// --- Mock Data (Replace with API calls in a real app) ---
const generateMockNotifications = (count: number): Notification[] => {
  const types: Notification['type'][] = ['like', 'comment', 'follow', 'message', 'system'];
  const names = ['Alice Johnson', 'Bob Smith', 'Charlie Lee', 'Dana White', 'Emma Watts', 'Liam Brown', 'Olivia Stone', 'Noah Green'];
  const contents = [
    'Great work on that post!',
    'Let’s catch up later.',
    'Nice update!',
    'Let’s meet tomorrow.',
    'Your password was changed successfully.',
    'Your settings were saved.',
    'Welcome aboard!',
  ];

  return Array.from({ length: count }).map((_, i) => {
    const type = types[i % types.length];
    const isSystem = type === 'system';
    const userIndex = i % names.length;
    const content = isSystem ? contents[i % contents.length] : type === 'comment' || type === 'message' ? contents[i % contents.length] : undefined;

    return {
      id: `mock-${Date.now()}-${i}`, // Ensure unique IDs
      type,
      userId: isSystem ? undefined : `${1000 + userIndex}`,
      userFullName: isSystem ? undefined : names[userIndex],
      userProfileImage: isSystem ? undefined : `/avatars/${names[userIndex].split(' ')[0].toLowerCase()}.jpg`, // Basic image URL
      createdAt: new Date(Date.now() - (count - i) * 90000 + i * 1000).toISOString(), // Vary timestamps
      read: Math.random() > 0.6, // Random read status
      content,
      postId: type === 'like' || type === 'comment' ? `post-${i}` : undefined,
    };
  });
};

const mockNotifications: Notification[] = generateMockNotifications(15); // Generate more diverse mock data

// Define animation variants for notification items
const notificationVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// --- Individual Notification Item Component ---
const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onGoTo: (notification: Notification) => void;
}> = ({ notification, onMarkAsRead, onGoTo }) => {

  // Function to generate the main text for the notification
  const getNotificationText = useCallback(() => {
    const { type, userFullName, content } = notification;
    switch (type) {
      case 'like':
        return userFullName ? <><span className="font-semibold">{userFullName}</span> liked your post.</> : 'Someone liked your post.';
      case 'comment':
        return userFullName ? <><span className="font-semibold">{userFullName}</span> commented: "{content}"</> : 'Someone commented on your post.';
      case 'follow':
        return userFullName ? <><span className="font-semibold">{userFullName}</span> started following you.</> : 'Someone started following you.';
      case 'message':
        return userFullName ? <><span className="font-semibold">{userFullName}</span> sent you a message: "{content}"</> : 'You received a new message.';
      case 'system':
        return content || 'You have a new system notification.';
      default:
        return 'You have a new notification.';
    }
  }, [notification]); // Re-create if notification changes

  // Function to get the appropriate icon based on notification type
  const getNotificationIcon = useCallback(() => {
    const { type } = notification;
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500 dark:text-red-400" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />;
      case 'follow':
        return <User className="h-4 w-4 text-green-500 dark:text-green-400" />;
      case 'message':
        return <MessageCircle className="h-4 w-4 text-purple-500 dark:text-purple-400" />;
      case 'system':
        return <Bell className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
    }
  }, [notification]); // Re-create if notification changes


  // Function to format the time elapsed since the notification was created
  const timeAgo = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30); // Approximation
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    const years = Math.floor(days / 365); // Approximation
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }, []);


  // Handle click on the notification item
  const handleItemClick = () => {
    onGoTo(notification);
    // Mark as read only AFTER navigating or performing the action,
    // or potentially handle marking as read on the backend upon click.
    // For this example, we'll keep the immediate mark as read for simplicity.
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  // Handle click on the "Mark as Read" button
  const handleMarkAsReadClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the item's onClick from firing
    onMarkAsRead(notification.id);
  };

  return (
    // Use motion.div for animations
    <motion.div
      variants={notificationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        'flex items-start gap-4 p-4 md:p-5 rounded-lg transition-all duration-200 border border-transparent', // Added border-transparent initially
        notification.read
          ? 'bg-white dark:bg-black text-black dark:text-gray-400' // Softer text for read
          : 'bg-white dark:bg-gray-950 text-white dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 border-blue-500 dark:border-blue-600', // Highlight unread, add border
        'cursor-pointer'
      )}
      onClick={handleItemClick}
      aria-label={`Notification: ${getNotificationText()}`} // Accessibility
    >
      {/* Avatar Section */}
      <Avatar className="h-10 w-10 mt-1">
        <AvatarImage
          src={notification.userProfileImage}
          alt={notification.userFullName || 'System'}
          onError={(e) => {
             // Handle image loading errors, e.g., show a fallback icon
             // console.error('Error loading avatar image:', e);
             // You could replace the src with a generic fallback here if needed
          }}
        />
        {/* Fallback displays initials or a generic icon */}
        <AvatarFallback>{notification.userFullName ? notification.userFullName.substring(0, 2) : <Bell className="h-5 w-5" />}</AvatarFallback>
      </Avatar>

      {/* Content Section */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2 text-sm">
          {getNotificationIcon()} {/* Notification type icon */}
          {/* Main notification text */}
          <p className={cn(
              notification.read ? 'text-gray-500 dark:text-gray-400' : 'font-medium text-gray-900 dark:text-gray-100'
          )}>
            {getNotificationText()}
          </p>
        </div>
        {/* Timestamp */}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {timeAgo(notification.createdAt)}
        </p>
      </div>

      {/* Mark as Read Button (only for unread) */}
      {!notification.read && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMarkAsReadClick}
          className="ml-auto text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full w-6 h-6" // Made button smaller and round
          aria-label="Mark as read" // Accessibility
          title="Mark as read" // Tooltip
        >
          <CheckCircle className="h-3 w-3" /> {/* Made icon smaller */}
        </Button>
      )}
    </motion.div>
  );
};

// --- Main Notifications List Component ---
const Notifications: React.FC = () => {
  // State to hold the list of notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  // State to track if all notifications are marked as read
  const [allRead, setAllRead] = useState(false);

  // Simulate fetching notifications on component mount
  useEffect(() => {
    // In a real app, replace this with an API call:
    // fetchNotifications().then(data => { setNotifications(data); setLoading(false); });
    const timer = setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1200); // Simulate network delay

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once on mount

  // Effect to update the 'allRead' state when notifications change
  useEffect(() => {
    setAllRead(notifications.length > 0 && notifications.every(n => n.read));
  }, [notifications]); // Depends on the notifications state

  // Callback to mark a single notification as read
  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // In a real app, also call an API to update the backend:
    // api.markNotificationAsRead(id).catch(error => console.error("Failed to mark read:", error));
  }, []); // No dependencies

  // Callback to mark ALL notifications as read
  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
     // In a real app, also call an API:
    // api.markAllNotificationsAsRead().catch(error => console.error("Failed to mark all read:", error));
  }, []); // No dependencies

  // Callback for navigating to the item related to the notification
  const handleGoToNotification = useCallback((notification: Notification) => {
    console.log('Navigating/Performing action for notification:', notification);
    // TODO: Implement actual navigation logic based on notification.type and related IDs (e.g., postId)
    // Example:
    // if (notification.type === 'comment' && notification.postId) {
    //   router.push(`/posts/${notification.postId}`);
    // } else if (notification.type === 'follow' && notification.userId) {
    //   router.push(`/users/${notification.userId}`);
    // }
  }, []); // No dependencies

  return (
    // Main container with background and layout adjustments
    <div className="min-h-screen bg-white dark:bg-black transition-colors p-4 md:p-10">
      {/* Adjusted margin based on potential sidebar */}
      <div className="max-w-4xl mx-auto mr-0 md:ml-[130px] "> {/* Slightly reduced max width */}

        {loading ? (
          // Loading State
          <div className="flex items-center justify-center h-[calc(100vh-80px)] text-gray-600 dark:text-gray-300">
            <p>Loading Notifications...</p> {/* More professional loading text */}
          </div>
        ) : (
          // Notifications List Container
          <motion.div
            initial={{ opacity: 0, y: 10 }} // Added slight initial y offset
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="rounded-xl bg-white dark:bg-black shadow-xl border border-gray-200 dark:border-gray-800 p-6 md:p-8" // Slightly adjusted padding/shadow/border color
          >
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3"> {/* Increased gap */}
                    <Bell className="w-7 h-7 text-blue-600 dark:text-blue-500" /> {/* Slightly bolder blue */}
                    <h2 className="text-xl font-bold md:block hidden  font-serif italic tracking-wider">
                      Notifications
                    </h2>
                </div>
                {/* Mark All as Read Button (Visible only if there are unread notifications) */}
                {notifications.some(n => !n.read) && (
                     <Button
                        variant="ghost"
                        size="sm" // Smaller button
                        onClick={handleMarkAllAsRead}
                        className="text-blue-600 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800/50"
                        aria-label="Mark all notifications as read"
                     >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark All As Read
                    </Button>
                )}

            </div>

            {/* Notification Items List */}
            <div className="space-y-4 md:space-y-5 "> {/* Increased vertical space between items */}
              <AnimatePresence initial={false}> {/* Disable initial animation on mount for children */}
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onGoTo={handleGoToNotification}
                    />
                  ))
                ) : (
                  // Empty State
                  <motion.div
                    key="empty" // Key for AnimatePresence
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    <Bell className="w-10 h-10 mx-auto mb-4" />
                    <p className="text-lg font-semibold">No new notifications</p>
                    <p className="text-sm">You're all caught up!</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;