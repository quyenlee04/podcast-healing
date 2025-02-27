const mongoose = require('mongoose');

const PodcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Technology', 'Science', 'Business', 'Entertainment', 'Sports'],
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  coverImage: {
    type: String,
    default: 'https://example.com/default-podcast-cover.jpg'
  },
  tags: [String],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Podcast', PodcastSchema);
