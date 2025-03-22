const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');

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
    
    let imagePath = '';
    let imageUrl = '';
    
    // Handle image upload
    if (req.file) {
      const imageFileName = `category-${Date.now()}-${path.basename(req.file.originalname)}`;
      const imageDir = path.join(__dirname, '../public/uploads/categories');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }
      
      // Define full path for the file
      imagePath = path.join(imageDir, imageFileName);
      
      // Move file from temp upload location to permanent storage
      fs.copyFileSync(req.file.path, imagePath);
      
      // Create URL for accessing the file
      imageUrl = `/uploads/categories/${imageFileName}`;
      
      // Remove temp file
      fs.unlinkSync(req.file.path);
    }
    
    const newCategory = new Category({
      name,
      description,
      image: imageUrl || '/uploads/default/default-category.jpg',
      imagePath: imagePath
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
      // Delete old image if exists
      if (category.imagePath && fs.existsSync(category.imagePath)) {
        fs.unlinkSync(category.imagePath);
      }
      
      const imageFileName = `category-${Date.now()}-${path.basename(req.file.originalname)}`;
      const imageDir = path.join(__dirname, '../public/uploads/categories');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }
      
      // Define full path for the file
      const imagePath = path.join(imageDir, imageFileName);
      
      // Move file from temp upload location to permanent storage
      fs.copyFileSync(req.file.path, imagePath);
      
      // Create URL for accessing the file
      const imageUrl = `/uploads/categories/${imageFileName}`;
      
      // Update category with new image info
      category.image = imageUrl;
      category.imagePath = imagePath;
      
      // Remove temp file
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
    
    // Delete image if exists
    if (category.imagePath && fs.existsSync(category.imagePath)) {
      fs.unlinkSync(category.imagePath);
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