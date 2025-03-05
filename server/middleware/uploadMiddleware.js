const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the upload folder to 'uploads/'
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Create a unique filename with timestamp
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (allowedAudioTypes.includes(file.mimetype)) {
    cb(null, true); // Allow audio files
  } else if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true); // Allow image files
  } else {
    cb(new Error('Invalid file type. Only audio and image files are allowed.'), false); // Reject invalid file types
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  }
});

module.exports = upload;
