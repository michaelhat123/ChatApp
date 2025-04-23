import Notification from '../modules/Notification.js';
import User from '../modules/user.model.js';
import Post from '../modules/post.model.js';
import { io } from '../server.js';

// Get all notifications for the authenticated user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate('sender', 'username fullName profileImage')
      .populate('postId', 'imageUrl')
      .limit(50);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      read: false
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Emit event to update unread count
    io.to(req.user._id.toString()).emit('notification:read', {
      notificationId: notification._id,
      unreadCount: await Notification.countDocuments({
        recipient: req.user._id,
        read: false
      })
    });

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );

    // Emit event to update unread count
    io.to(req.user._id.toString()).emit('notifications:allRead', {
      unreadCount: 0
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notifications as read', error: error.message });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Emit event to update unread count
    io.to(req.user._id.toString()).emit('notification:deleted', {
      notificationId: notification._id,
      unreadCount: await Notification.countDocuments({
        recipient: req.user._id,
        read: false
      })
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};

// Helper function to create a notification
export const createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();

    // Populate sender and post data
    const populatedNotification = await Notification.findById(notification._id)
      .populate('sender', 'username fullName profileImage')
      .populate('postId', 'imageUrl');

    // Emit real-time notification
    io.to(data.recipient.toString()).emit('notification:new', populatedNotification);

    return populatedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}; 