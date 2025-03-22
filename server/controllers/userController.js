const User = require('../models/User');
const { generateToken } = require('../config/auth');
const { profile } = require('winston');
const fs = require('fs');
const path = require('path');


exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ username, email, password, role });
    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token: `Bearer ${token}`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, email, password, profile } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }
    if (password) {
      user.password = password;
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (profile) user.profile = profile;

    await user.save();
    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteUser  = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User  not found' });
    }

    // Check if the requesting user is trying to delete their own account
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(403).json({ message: 'Cannot delete your own account' });
    }

    // Optionally, check if the requesting user has admin privileges
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You do not have permission to delete this user' });
    }

    // Remove the user
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User  deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.json({
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update profile with avatar upload
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Initialize profile if it doesn't exist
    if (!user.profile) {
      user.profile = {};
    }
    
    // Update profile fields
    if (firstName) user.profile.firstName = firstName;
    if (lastName) user.profile.lastName = lastName;
    if (bio) user.profile.bio = bio;
    
    // Handle avatar upload
    if (req.file) {
      // Delete old avatar if exists
      if (user.profile.avatarPath && fs.existsSync(user.profile.avatarPath)) {
        fs.unlinkSync(user.profile.avatarPath);
      }
      
      const avatarFileName = `avatar-${user._id}-${Date.now()}${path.extname(req.file.originalname)}`;
      const avatarDir = path.join(__dirname, '../public/uploads/avatars');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(avatarDir)) {
        fs.mkdirSync(avatarDir, { recursive: true });
      }
      
      // Define full path for the file
      const avatarPath = path.join(avatarDir, avatarFileName);
      
      // Move file from temp upload location to permanent storage
      fs.renameSync(req.file.path, avatarPath);
      
      // Update user profile with avatar info
      user.profile.avatar = `/uploads/avatars/${avatarFileName}`;
      user.profile.avatarPath = avatarPath;
    }
    
    await user.save();
    
    // Don't send sensitive info back
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile,
      favorites: user.favorites
    };
    
    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    // Clean up uploaded file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
};