const Podcast = require('../models/Podcast');

exports.createPodcast = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      audioUrl, 
      category, 
      duration, 
      coverImage, 
      tags 
    } = req.body;

    const podcast = new Podcast({
      title,
      description,
      author: req.user.id,  // From authentication middleware
      audioUrl,
      category,
      duration,
      coverImage,
      tags
    });

    await podcast.save();

    res.status(201).json({
      message: 'Podcast created successfully',
      podcast
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating podcast', 
      error: error.message 
    });
  }
};

exports.getPodcasts = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    
    const query = category ? { category } : {};
    
    const podcasts = await Podcast.find(query)
      .populate('author', 'username')
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
    res.status(500).json({ 
      message: 'Error fetching podcasts', 
      error: error.message 
    });
  }
};