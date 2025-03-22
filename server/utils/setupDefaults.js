const fs = require('fs');
const path = require('path');

// Function to set up default files
const setupDefaultFiles = () => {
  const defaultDir = path.join(__dirname, '../public/uploads/default');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(defaultDir)) {
    fs.mkdirSync(defaultDir, { recursive: true });
  }
  
  // Create a simple default image if it doesn't exist
  const defaultCategoryImage = path.join(defaultDir, 'default-category.jpg');
  const defaultPodcastCover = path.join(defaultDir, 'default-cover.jpg');
  
  // You can copy existing default images here or create placeholders
  // For simplicity, we'll just check if they exist
  if (!fs.existsSync(defaultCategoryImage)) {
    console.log('Default category image not found. Please add a default image at:', defaultCategoryImage);
  }
  
  if (!fs.existsSync(defaultPodcastCover)) {
    console.log('Default podcast cover not found. Please add a default image at:', defaultPodcastCover);
  }
};

module.exports = setupDefaultFiles;