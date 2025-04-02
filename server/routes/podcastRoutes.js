const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {createPodcast, getPodcast, getSinglePodcast, incrementListenCount,updatePodcast, deletePodcast, toggleLike, addComment, deleteComment , getPopularPodcasts} = require('../controllers/podcastController');
const { protect } = require('../middleware/authMiddleware');

// Set up multer storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir;
    
    // Set different directories based on file type
    if (file.fieldname === 'mp3') {
      uploadDir = path.join(__dirname, '../public/uploads/podcasts');
    } else if (file.fieldname === 'coverImage') {
      uploadDir = path.join(__dirname, '../public/uploads/covers');
    } else {
      uploadDir = path.join(__dirname, '../public/uploads');
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(cleanFileName));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'mp3') {
    // For audio files
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio file type. Only MP3 and WAV are allowed.'), false);
    }
  } else if (file.fieldname === 'coverImage') {
    // For image files
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image file type. Only JPG, PNG and WebP are allowed.'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Set up the fields for upload
const uploadFields = upload.fields([
  { name: 'mp3', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

// Routes
router.post('/', protect, uploadFields, createPodcast);
router.get('/', getPodcast);
router.get('/popular', getPopularPodcasts);
router.get('/:id', getSinglePodcast);
router.put('/:id', protect, uploadFields, updatePodcast);
router.delete('/:id', protect, deletePodcast);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.delete('/:id/comment/:commentId', protect, deleteComment);
router.post('/:id/increment-listen', incrementListenCount);
// Add this new route before module.exports


module.exports = router;