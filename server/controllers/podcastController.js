const Podcast = require('../models/Podcast');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

exports.createPodcast = async (req, res) => {
  try {
    const { title, description, category, tags, visibility } = req.body;

    // Check if files are uploaded
    if (!req.files || !req.files.mp3 || !req.files.coverImage) {
      return res.status(400).json({
        error: 'No audio or cover image file uploaded',
        details: 'Please upload both an MP3 file and a cover image'
      });
    }

    // Validate that category exists
    if (!category) {
      return res.status(400).json({
        error: 'Category is required',
        details: 'Please select a category for your podcast'
      });
    }

    // Find the category by name if a string is provided
    let categoryId = category;
    if (category && typeof category === 'string' && !mongoose.Types.ObjectId.isValid(category)) {
      const categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        return res.status(400).json({
          error: 'Invalid category',
          details: `The category "${category}" does not exist in the database`
        });
      }
      categoryId = categoryDoc._id;
    }

    // Access the uploaded files
    const audioFile = req.files.mp3[0];
    const coverImageFile = req.files.coverImage[0];

    // Create file paths for storage
    const audioFileName = `podcast-${Date.now()}-${path.basename(audioFile.originalname)}`;
    const coverImageFileName = `cover-${Date.now()}-${path.basename(coverImageFile.originalname)}`;

    // Define storage directories
    const audioDir = path.join(__dirname, '../public/uploads/podcasts');
    const coverDir = path.join(__dirname, '../public/uploads/covers');

    // Create directories if they don't exist
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    if (!fs.existsSync(coverDir)) {
      fs.mkdirSync(coverDir, { recursive: true });
    }

    // Define full paths for the files
    const audioPath = path.join(audioDir, audioFileName);
    const coverPath = path.join(coverDir, coverImageFileName);

    // Move files from temp upload location to permanent storage
    // Use renameSync instead of copyFileSync to avoid duplicates
    fs.renameSync(audioFile.path, audioPath);
    fs.renameSync(coverImageFile.path, coverPath);

    // Create URLs for accessing the files
    const audioUrl = `/uploads/podcasts/${audioFileName}`;
    const coverImageUrl = `/uploads/covers/${coverImageFileName}`;

    // Create podcast record
    const newPodcast = new Podcast({
      title,
      description,
      author: req.user?._id,
      filename: audioFileName,
      filePath: audioPath,
      audioUrl: audioUrl,
      category: categoryId,
      size: audioFile.size,
      coverImage: coverImageUrl,
      coverImagePath: coverPath,
      tags: tags ? tags.split(',') : [],
      visibility: visibility || 'public',
      metadata: {
        originalName: audioFile.originalname,
        mimeType: audioFile.mimetype,
        size: audioFile.size
      }
    });

    await newPodcast.save();

    // No need to remove local temp files since we used renameSync
    // which moves the file instead of copying it

    res.status(201).json({
      message: 'Podcast uploaded successfully',
      podcast: newPodcast
    });
  } catch (error) {
    // Remove local files if upload fails
    if (req.files && req.files.mp3 && fs.existsSync(req.files.mp3[0].path)) {
      fs.unlinkSync(req.files.mp3[0].path);
    }
    if (req.files && req.files.coverImage && fs.existsSync(req.files.coverImage[0].path)) {
      fs.unlinkSync(req.files.coverImage[0].path);
    }

    console.error('Comprehensive Upload Error:', {
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({
      error: 'Upload failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update the delete podcast function to remove local files
exports.deletePodcast = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }
    if (podcast.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this podcast' });
    }

    // Delete the audio and cover image files
    if (podcast.filePath && fs.existsSync(podcast.filePath)) {
      fs.unlinkSync(podcast.filePath);
    }
    if (podcast.coverImagePath && fs.existsSync(podcast.coverImagePath)) {
      fs.unlinkSync(podcast.coverImagePath);
    }

    await Podcast.findByIdAndDelete(req.params.id);
    res.json({ message: 'Podcast deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting podcast', error: error.message });
  }
};
exports.getPodcasts = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const userId = req.user?._id;

    // Base query
    let query = {};

    // Handle visibility based on authentication
    if (userId) {
      // If user is logged in, show public podcasts AND their own private podcasts
      query.$or = [
        { visibility: 'public' },
        { author: userId, visibility: 'private' }
      ];
    } else {
      // If no user, only show public podcasts
      query.visibility = 'public';
    }

    // Add category filter if provided
    if (category) {
      query.category = category;
    }

    const podcasts = await Podcast.find(query)
      .sort('-createdAt')
      .populate('author', 'username')
      .populate('category', 'name');

    res.json({ podcasts });
  } catch (error) {
    console.error('Error in getPodcasts:', error);
    res.status(500).json({ error: 'Failed to fetch podcasts' });
  }
};

exports.getPodcastsByAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;
    const userId = req.user?._id;

    let query = { author: authorId };

    // If the viewer is not the author, only show public podcasts
    if (!userId || userId.toString() !== authorId.toString()) {
      query.visibility = 'public';
    }

    const podcasts = await Podcast.find(query)
      .sort('-createdAt')
      .populate('author', 'username')
      .populate('category', 'name');

    res.json({ podcasts });
  } catch (error) {
    console.error('Error in getPodcastsByAuthor:', error);
    res.status(500).json({ error: 'Failed to fetch podcasts' });
  }
};

exports.getSinglePodcast = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id)
      .populate('author', 'username')
      .populate('category', 'name image description')
      .populate('comments.user', 'username');

    if (!podcast) {
      return res.status(404).json({ error: 'Podcast not found' });
    }

    if (podcast.visibility === 'private' &&
      (!req.user || podcast.author._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ error: 'Access denied to private podcast' });
    }

    res.json(podcast);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching podcast', error: error.message });
  }
};

exports.updatePodcast = async (req, res) => {
  try {
    const { title, description, category, tags, visibility } = req.body;
    const podcast = await Podcast.findById(req.params.id);

    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    if (podcast.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this podcast' });
    }

    // Find the category by name if a string is provided
    let categoryId = category;
    if (category && typeof category === 'string' && !mongoose.Types.ObjectId.isValid(category)) {
      const categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        return res.status(400).json({
          error: 'Invalid category',
          details: `The category "${category}" does not exist in the database`
        });
      }
      categoryId = categoryDoc._id;
    }

    // Handle file updates if provided
    if (req.files) {
      // Handle audio file update
      if (req.files.mp3 && req.files.mp3[0]) {
        const audioFile = req.files.mp3[0];
        const audioFileName = `podcast-${Date.now()}-${path.basename(audioFile.originalname)}`;
        const audioDir = path.join(__dirname, '../public/uploads/podcasts');

        if (!fs.existsSync(audioDir)) {
          fs.mkdirSync(audioDir, { recursive: true });
        }

        // Delete old audio file
        if (podcast.filePath && fs.existsSync(podcast.filePath)) {
          fs.unlinkSync(podcast.filePath);
        }

        // Save new audio file
        const audioPath = path.join(audioDir, audioFileName);
        fs.copyFileSync(audioFile.path, audioPath);
        fs.unlinkSync(audioFile.path);

        podcast.filename = audioFileName;
        podcast.filePath = audioPath;
        podcast.audioUrl = `/uploads/podcasts/${audioFileName}`;
        podcast.size = audioFile.size;
        podcast.metadata.originalName = audioFile.originalname;
        podcast.metadata.mimeType = audioFile.mimetype;
        podcast.metadata.size = audioFile.size;
      }

      // Handle cover image update
      if (req.files.coverImage && req.files.coverImage[0]) {
        const coverImageFile = req.files.coverImage[0];
        const coverImageFileName = `cover-${Date.now()}-${path.basename(coverImageFile.originalname)}`;
        const coverDir = path.join(__dirname, '../public/uploads/covers');

        if (!fs.existsSync(coverDir)) {
          fs.mkdirSync(coverDir, { recursive: true });
        }

        // Delete old cover image
        if (podcast.coverImagePath && fs.existsSync(podcast.coverImagePath)) {
          fs.unlinkSync(podcast.coverImagePath);
        }

        // Save new cover image
        const coverPath = path.join(coverDir, coverImageFileName);
        fs.copyFileSync(coverImageFile.path, coverPath);
        fs.unlinkSync(coverImageFile.path);

        podcast.coverImage = `/uploads/covers/${coverImageFileName}`;
        podcast.coverImagePath = coverPath;
      }
    }

    // Update other fields
    if (title) podcast.title = title;
    if (description) podcast.description = description;
    if (categoryId) podcast.category = categoryId;
    if (tags) podcast.tags = tags.split(',');
    if (visibility) podcast.visibility = visibility;

    await podcast.save();

    res.json({
      message: 'Podcast updated successfully',
      podcast
    });
  } catch (error) {
    // Clean up any uploaded files if there was an error
    if (req.files) {
      if (req.files.mp3 && req.files.mp3[0] && fs.existsSync(req.files.mp3[0].path)) {
        fs.unlinkSync(req.files.mp3[0].path);
      }
      if (req.files.coverImage && req.files.coverImage[0] && fs.existsSync(req.files.coverImage[0].path)) {
        fs.unlinkSync(req.files.coverImage[0].path);
      }
    }

    res.status(500).json({ message: 'Error updating podcast', error: error.message });
  }
};

// Add this function with other controller functions
exports.toggleLike = async (req, res) => {
  try {
    const podcastId = req.params.id;
    const userId = req.user._id;

    // Find the podcast
    const podcast = await Podcast.findById(podcastId);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    // Check if user has already liked the podcast
    const likeIndex = podcast.likes.indexOf(userId);

    if (likeIndex === -1) {
      // Add like
      podcast.likes.push(userId);
    } else {
      // Remove like
      podcast.likes.splice(likeIndex, 1);
    }

    // Save the updated podcast
    await podcast.save();

    res.json({
      success: true,
      liked: likeIndex === -1,
      likesCount: podcast.likes.length,
      message: likeIndex === -1 ? 'Podcast liked successfully' : 'Podcast unliked successfully'
    });

  } catch (error) {
    console.error('Error in toggleLike:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing like/unlike action',
      error: error.message
    });
  }
};

exports.getLikedPodcasts = async (req, res) => {
  try {
    const userId = req.user._id;

    const likedPodcasts = await Podcast.find({
      likes: userId
    }).populate('author category');

    res.json({
      success: true,
      podcasts: likedPodcasts
    });

  } catch (error) {
    console.error('Error in getLikedPodcasts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching liked podcasts',
      error: error.message
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    const comment = {
      user: req.user._id,
      text
    };

    podcast.comments.push(comment);
    await podcast.save();

    // Populate user info for the new comment
    const populatedPodcast = await Podcast.findById(req.params.id)
      .populate('comments.user', 'username');

    const newComment = populatedPodcast.comments[populatedPodcast.comments.length - 1];

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};


exports.deleteComment = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    const comment = podcast.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author or podcast author
    if (comment.user.toString() !== req.user._id.toString() &&
      podcast.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.deleteOne();
    await podcast.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};
exports.incrementListenCount = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    await podcast.incrementListenCount();

    res.json({ message: 'Listen count incremented', listenCount: podcast.listenCount });
  } catch (error) {
    console.error('Error incrementing listen count:', error);
    res.status(500).json({ message: 'Failed to increment listen count' });
  }
};
exports.getPopularPodcasts = async (req, res) => {
  try {
    const podcasts = await Podcast.find({ visibility: 'public' })
      .populate('author', 'username')
      .populate('category')
      .sort({ listenCount: -1 }) // Ensure proper sorting by listen count
      .limit(3);

    res.json({
      podcasts
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching popular podcasts',
      error: error.message
    });
  }
};
