const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ active: true }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching categories', 
      error: error.message 
    });
  }
};

// Get single category
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching category', 
      error: error.message 
    });
  }
};

// Create new category with image upload
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    let imageUrl = '';
    let cloudinaryPublicId = '';
    
    // Upload image to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'image',
        folder: 'category_images',
        use_filename: true,
        unique_filename: false
      });
      
      imageUrl = result.secure_url;
      cloudinaryPublicId = result.public_id;
      
      // Remove local file after upload
      fs.unlinkSync(req.file.path);
    }
    
    const newCategory = new Category({
      name,
      description,
      image: imageUrl || undefined,
      cloudinaryPublicId: cloudinaryPublicId || undefined
    });
    
    await newCategory.save();
    res.status(201).json({
      message: 'Category created successfully',
      category: newCategory
    });
  } catch (error) {
    // Remove local file if upload fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Error creating category', 
      error: error.message 
    });
  }
};

// Update category with image
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, active } = req.body;
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Update image if provided
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (category.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(category.cloudinaryPublicId);
      }
      
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'image',
        folder: 'category_images',
        use_filename: true,
        unique_filename: false
      });
      
      category.image = result.secure_url;
      category.cloudinaryPublicId = result.public_id;
      
      // Remove local file after upload
      fs.unlinkSync(req.file.path);
    }
    
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (active !== undefined) category.active = active;
    
    await category.save();
    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    // Remove local file if upload fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Error updating category', 
      error: error.message 
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Delete image from Cloudinary if exists
    if (category.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(category.cloudinaryPublicId);
    }
    
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting category', 
      error: error.message 
    });
  }
};