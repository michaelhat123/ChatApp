import express from 'express';
import UserRelationship from '../modules/Relationship.js';
import  auth  from '../middleware/auth.js';

const router = express.Router();

// Get all relationships for the current user
router.get('/', auth, async (req, res) => {
  try {
    const relationships = await UserRelationship.find({ follower: req.user._id })
      .populate('following', 'username fullName profileImage');
    res.json(relationships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update relationship settings
router.patch('/:followingId', auth, async (req, res) => {
  try {
    const { followingId } = req.params;
    const { isCloseFriend, isFavorite, muteSettings, isRestricted } = req.body;

    const relationship = await UserRelationship.findOneAndUpdate(
      { follower: req.user._id, following: followingId },
      {
        isCloseFriend,
        isFavorite,
        muteSettings,
        isRestricted
      },
      { new: true, upsert: true }
    ).populate('following', 'username fullName profileImage');

    res.json(relationship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get relationship settings for a specific user
router.get('/:followingId', auth, async (req, res) => {
  try {
    const { followingId } = req.params;
    const relationship = await UserRelationship.findOne({
      follower: req.user._id,
      following: followingId
    }).populate('following', 'username fullName profileImage');

    if (!relationship) {
      return res.json({
        isCloseFriend: false,
        isFavorite: false,
        muteSettings: { posts: false, stories: false, all: false },
        isRestricted: false
      });
    }

    res.json(relationship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;