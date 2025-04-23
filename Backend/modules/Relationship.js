import mongoose from 'mongoose';

const userRelationshipSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isCloseFriend: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  muteSettings: {
    posts: { type: Boolean, default: false },
    stories: { type: Boolean, default: false },
    all: { type: Boolean, default: false }
  },
  isRestricted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure unique combination of follower and following
userRelationshipSchema.index({ follower: 1, following: 1 }, { unique: true });

const UserRelationship = mongoose.model('UserRelationship', userRelationshipSchema);

export default UserRelationship; 