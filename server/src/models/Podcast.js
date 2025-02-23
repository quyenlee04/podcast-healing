const mongoose = require('mongoose');

const PodcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Podcast title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: [
      'music', 
      'education', 
      'technology', 
      'entertainment', 
      'health', 
      'comedy'
    ],
    required: [true, 'Category is required']
  },
  audioUrl: {
    type: String,
    required: [true, 'Audio file is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  listens: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  tags: [String],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to get formatted duration
PodcastSchema.virtual('formattedDuration').get(function() {
    const hours = Math.floor(this.duration / 3600);
    const minutes = Math.floor((this.duration % 3600) / 60);
    const seconds = this.duration % 60;
  
    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds}s`;
  });
  
  // Increment listen count
  PodcastSchema.methods.incrementListens = async function() {
    this.listens += 1;
    await this.save();
  };
  
  // Static method to get popular podcasts
  PodcastSchema.statics.getPopularPodcasts = async function(limit = 10) {
    return this.find()
      .sort({ listens: -1 })
      .limit(limit)
      .populate('author', 'username');
  };
  
  module.exports = mongoose.model('Podcast', PodcastSchema);
