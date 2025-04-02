const mongoose = require('mongoose');

const PodcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Podcast title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Podcast description is required'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: [true, 'Filename is required']
  },
  filePath: {
    type: String,
    required: [true, 'File path is required']
  },
  audioUrl: {
    type: String,
    required: [true, 'Audio URL is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  size: {
    type: Number,
    default: 0
  },
  coverImage: {
    type: String,
    default: '/uploads/default/default-cover.jpg'
  },
  coverImagePath: {
    type: String
  },
  tags: [String],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    type: Object,
    default: {}
  }, listenCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});
PodcastSchema.methods.incrementListenCount = function() {
  this.listenCount = (this.listenCount || 0) + 1;
  return this.save();
};
module.exports = mongoose.model('Podcast', PodcastSchema);
