const Podcast = require('../models/Podcast');
const Category = require('../models/Category'); // Add this import
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const fs = require('fs');

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
    const audioFile = req.files.mp3[0]; // The MP3 file
    const coverImageFile = req.files.coverImage[0]; // The cover image file

    // Upload audio file to Cloudinary
    const cloudinaryAudioResult = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: 'auto',
      folder: 'podcasts',
      use_filename: true,
      unique_filename: false,
      overwrite: true
    });

    // Upload cover image to Cloudinary
    let coverImageUrl = '';
    if (coverImageFile) {
      const cloudinaryImage = await cloudinary.uploader.upload(coverImageFile.path, {
        resource_type: 'image',
        folder: 'podcast_covers',
        use_filename: true,
        unique_filename: false
      });
      coverImageUrl = cloudinaryImage.secure_url;
    }

    // Create podcast record
    const newPodcast = new Podcast({
      title,
      description,
      author: req.user?._id,
      filename: audioFile.originalname,
      cloudinaryPublicId: cloudinaryAudioResult.public_id,
      audioUrl: cloudinaryAudioResult.secure_url,
      category: categoryId, // Use the resolved category ID
      size: audioFile.size,
      coverImage: coverImageUrl,
      tags: tags ? tags.split(',') : [],
      visibility: visibility || 'public',
      metadata: {
        cloudinaryDetails: {
          public_id: cloudinaryAudioResult.public_id,
          format: cloudinaryAudioResult.format,
          resource_type: cloudinaryAudioResult.resource_type
        }
      }
    });

    await newPodcast.save();

    // Remove local files after upload
    fs.unlinkSync(audioFile.path);
    if (coverImageFile) {
      fs.unlinkSync(coverImageFile.path);
    }

    res.status(201).json({
      message: 'Podcast uploaded successfully',
      podcast: newPodcast,
      cloudinaryResult: {
        public_id: cloudinaryAudioResult.public_id,
        url: cloudinaryAudioResult.secure_url
      }
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
      stack: error.stack,
      cloudinaryError: error.response ? error.response.body : 'No Cloudinary response'
    });

    res.status(500).json({
      error: 'Upload failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getPodcast = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const userId = req.user?._id;

    let query = {};

    console.log('Query parameters:', req.query);
    console.log('User ID:', req.user?._id);
    
    // Handle category filtering - convert string name to ObjectId if needed
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        // Try to find category by name
        const categoryDoc = await Category.findOne({ name: category });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        } else {
          // If category doesn't exist, return empty results
          return res.json({
            podcasts: [],
            totalPages: 0,
            currentPage: page
          });
        }
      }
    }

    if (userId) {
      query.$or = [
        { visibility: 'public' },
        { author: userId.toString() }
      ];
    } else {
      query.visibility = 'public';
    }
    
    console.log('Final query:', query);

    const podcasts = await Podcast.find(query)
      .populate('author', 'username')
      .populate('category', 'name image description') // Populate category details
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Podcast.countDocuments(query);

    res.json({
      podcasts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    res.status(500).json({
      error: 'Failed to fetch podcasts',
      details: error.message
    });
  }
};

exports.getSinglePodcast = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id)
      .populate('author', 'username')
      .populate('category', 'name image description') // Populate category details
      .populate('comments.user', 'username');
    
    if (!podcast) {
      return res.status(404).json({ error: 'Podcast not found' });
    }
    if (podcast.visibility === 'private' &&
      (!req.user || podcast.author._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ error: 'Access denied to private podcast' });
    }
    res.json(podcast);
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching podcast', error: error.message });

  }
};

exports.updatePodcast = async (req, res) => {
  try {
    const { title, description, category, duration, coverImage, tags } = req.body;
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }
    if (podcast.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this podcast' });
    }
    podcast.title = title;
    podcast.description = description;
    podcast.category = category;
    podcast.duration = duration;
    podcast.coverImage = coverImage;
    podcast.visibility = visibility || podcast.visibility;
    podcast.tags = tags ? tags.split(',') : podcast.tags;
    await podcast.save();
    res.json({
      message: 'Podcast updated successfully',
      podcast
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating podcast', error: error.message });
  }
};

exports.deletePodcast = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }
    if (podcast.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this podcast' });
    }

    //remove from cloudinary
    await cloudinary.uploader.destroy(podcast.cloudinaryPublicId);
    await Podcast.findByIdAndDelete(req.params.id);
    res.json({ message: 'Podcast deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting podcast', error: error.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }
    const userId = req.user._id;
    const likeIndex = podcast.likes.findIndex(like => like.user.toString() === userId.toString());
    if (likeIndex !== -1) {
      podcast.likes.splice(likeIndex, 1);
    } else {
      podcast.likes.push(userId);
    }
    await podcast.save();
    res.json({
      message: likeIndex !== -1 ? 'Podcast unliked' : 'Podcast liked',
      likeCount: podcast.likes.length
    });
  }

  catch (error) {
    res.status(500).json({ message: 'Error processing like', error: error.message });
  }
};
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: 'Comment text is required'
      });
    }

    const podcast = await Podcast.findById(req.params.id);

    if (!podcast) {
      return res.status(404).json({
        message: 'Podcast not found'
      });
    }

    const newComment = {
      id: req.params.id,
      user: req.user._id,
      text,
      createdAt: new Date()
    };

    podcast.comments.push(newComment);
    await podcast.save();

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding comment',
      error: error.message
    });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const podcast = await Podcast.findById(req.params.id);

    if (!podcast) {
      return res.status(404).json({
        message: 'Podcast not found'
      });
    }

    const commentIndex = podcast.comments.findIndex(
      comment =>
        comment._id.toString() === commentId &&
        comment.user.toString() === req.user._id.toString()
    );

    if (commentIndex === -1) {
      return res.status(403).json({
        message: 'Comment not found or unauthorized'
      });
    }

    podcast.comments.splice(commentIndex, 1);
    await podcast.save();

    res.json({
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting comment',
      error: error.message
    });
  }
};